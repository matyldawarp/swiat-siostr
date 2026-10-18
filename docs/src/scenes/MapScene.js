import { PixelUI, S, textStyle } from '../ui/pixel.js';
import { createHamsterTextures, startBlinking } from '../gfx/hamster.js';
import { Icons } from '../gfx/icons.js';
import { Illness } from '../ui/illness.js';
import { playStep } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const MAP_COLORS = {
    grass: 0xd4f2e4,
    grassLight: 0xe2f7ec,
    road: 0xf6e3c4,
    roadEdge: 0xe8cc9e,
    roadDots: 0xfff7e0,
    flowers: [0xf7b2cc, 0xfff1c9, 0xd9ccf5, 0xffffff]
};

// Places on the map. `at` is where the building stands, as fractions of the map; every
// road starts at home and passes through `bends` on its way to the place. Going between
// two places other than home walks past home. `trees` are offsets of trees around it.
// To add a place: an entry here, its scene in main.js, and the scene's map button setting
// registry 'mapLocation' to the key.
const MAP_PLACES = {
    home: {
        scene: 'TerrariumScene',
        at: [0.16, 0.74],
        draw: (g, x, y) => Icons.house(g, x, y - S(18), S(44)),
        trees: [[-40, -6], [38, -14]]
    },
    hospital: {
        scene: 'HospitalScene',
        at: [0.8, 0.36],
        bends: [[0.42, 0.82], [0.58, 0.36]],
        draw: (g, x, y) => Icons.hospital(g, x, y, S(64), S(54)),
        trees: [[48, -4], [-46, 2]]
    },
    bakery: {
        scene: 'BakeryScene',
        at: [0.84, 0.86],
        bends: [[0.4, 0.95], [0.64, 0.92]],
        draw: (g, x, y) => Icons.bakery(g, x, y, S(60), S(50)),
        trees: [[-48, 0]]
    }
};

export class MapScene extends BaseScene {
    constructor() {
        super('MapScene');
    }

    init(data) {
        super.init(data);
        this.traveling = false;
        this.character = this.selectedCharacter();
        this.location = this.registry.get('mapLocation') || 'home';
        this.sickBubble = null;
    }

    update() {
        if (this.sickBubble) {
            this.sickBubble.setPosition(Math.round(this.hamster.x + S(16)), Math.round(this.hamster.y - S(30)));
        }
    }

    build({ width, height }) {
        createHamsterTextures(this, this.character);

        // Where things sit, as fractions of the map so it fits any window.
        const at = ([fx, fy]) => ({ x: Math.round(width * fx), y: Math.round(height * fy) });
        const positions = {};
        this.stands = {};
        Object.entries(MAP_PLACES).forEach(([key, place]) => {
            positions[key] = at(place.at);
            // The hamster stands just in front of each building; roads join those spots.
            this.stands[key] = { x: positions[key].x, y: positions[key].y + S(10) };
        });
        this.roads = {};
        Object.entries(MAP_PLACES).filter(([, place]) => place.bends).forEach(([key, place]) => {
            this.roads[key] = new Phaser.Curves.Spline([this.stands.home, ...place.bends.map(at), this.stands[key]]
                .map((p) => new Phaser.Math.Vector2(p.x, p.y)));
        });

        this.drawGround(this.view.bleed);
        const roadPoints = Object.values(this.roads).flatMap((road) => this.drawRoad(road));

        Object.entries(MAP_PLACES).forEach(([key, place]) => {
            const { x, y } = positions[key];
            this.createPlace(key, positions[key], (g) => place.draw(g, x, y));
        });

        this.drawTrees(positions, width, height);
        this.createClouds(width, height, Object.values(positions), roadPoints);
        this.createHamster();

        // The places you can travel to gently pulse; a sick hamster's hospital pulses harder.
        const sick = Illness.isSick(this);
        Object.keys(MAP_PLACES).filter((key) => key !== this.location).forEach((key) => {
            PixelUI.pulse(this, this.places[key], sick && key === 'hospital' ? 0.14 : 0.06);
        });
        if (sick) {
            this.sickBubble = Illness.createBubble(this, S(20)).setDepth(11);
        }
    }

    // Grass over the whole window (`area` is view.bleed), with lighter patches and flowers.
    drawGround({ x, y, width, height }) {
        const g = this.add.graphics();
        g.fillStyle(MAP_COLORS.grass, 1);
        g.fillRect(x, y, width, height);

        g.fillStyle(MAP_COLORS.grassLight, 1);
        for (let i = 0; i < (width * height) / 9000; i++) {
            PixelUI.fillCircle(g, Phaser.Math.Between(x, x + width), Phaser.Math.Between(y, y + height), Phaser.Math.Between(S(6), S(14)));
        }
        for (let i = 0; i < (width * height) / 1500; i++) {
            g.fillStyle(Phaser.Utils.Array.GetRandom(MAP_COLORS.flowers), 1);
            g.fillRect(Phaser.Math.Between(x, x + width), Phaser.Math.Between(y, y + height), 2, 2);
        }
    }

    // Sandy road along a spline; returns its sample points for spacing other things.
    drawRoad(road) {
        const g = this.add.graphics();
        const points = road.getSpacedPoints(Math.round(road.getLength() / 2));
        const r = S(5);

        g.fillStyle(MAP_COLORS.roadEdge, 1);
        points.forEach((p) => PixelUI.fillCircle(g, Math.round(p.x), Math.round(p.y), r + 1));
        g.fillStyle(MAP_COLORS.road, 1);
        points.forEach((p) => PixelUI.fillCircle(g, Math.round(p.x), Math.round(p.y), r));
        g.fillStyle(MAP_COLORS.roadDots, 1);
        points.forEach((p, i) => {
            if (i % 6 === 0) {
                g.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2, 2);
            }
        });
        return points;
    }

    createPlace(key, pos, draw) {
        this.places = this.places || {};

        // Drawn in a container around the place so it can pulse in place.
        const container = this.add.container(pos.x, pos.y);
        const g = this.add.graphics({ x: -pos.x, y: -pos.y });
        draw(g);
        container.add(g);
        this.places[key] = container;

        const zone = this.add.zone(pos.x, pos.y - S(22), S(70), S(64)).setInteractive({ useHandCursor: true });
        zone.on('pointerup', () => this.goTo(key));
    }

    drawTrees(positions, width, height) {
        const g = this.add.graphics();
        const spots = Object.entries(MAP_PLACES).flatMap(([key, place]) => (place.trees || [])
            .map(([dx, dy]) => ({ x: positions[key].x + S(dx), y: positions[key].y + S(dy) })));
        spots
            .filter((p) => p.x > S(12) && p.x < width - S(12) && p.y > S(30) && p.y < height - S(4))
            .forEach((p) => Icons.tree(g, p.x, p.y, S(22)));
        this.treeSpots = spots;
    }

    // Fills every free spot of a grid with a "?" cloud: places still to discover.
    createClouds(width, height, buildings, roadPoints) {
        const cellW = S(64);
        const cellH = S(46);
        const cols = Math.floor((width - S(8)) / cellW);
        const rows = Math.floor((height - S(8)) / cellH);
        const offX = (width - cols * cellW) / 2 + cellW / 2;
        const offY = (height - rows * cellH) / 2 + cellH / 2;

        const near = (p, list, dist) => list.some((q) => Phaser.Math.Distance.Between(p.x, p.y, q.x, q.y) < dist);
        const sparseRoad = roadPoints.filter((_, i) => i % 4 === 0);
        // Keep clear of the music and reload buttons in the top-right corner.
        const corner = [{ x: width - S(17), y: S(17) }, { x: width - S(43), y: S(17) }];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const p = {
                    x: Math.round(offX + col * cellW + Phaser.Math.Between(-S(4), S(4))),
                    y: Math.round(offY + row * cellH + Phaser.Math.Between(-S(3), S(3)))
                };
                const buildingSpots = buildings.map((b) => ({ x: b.x, y: b.y - S(20) }));
                if (near(p, buildingSpots, S(58)) || near(p, sparseRoad, S(28))
                    || near(p, this.treeSpots, S(26)) || near(p, corner, S(40))) {
                    continue;
                }
                this.createCloud(p.x, p.y);
            }
        }
    }

    createCloud(x, y) {
        const w = S(44);
        const h = S(26);
        const g = this.add.graphics();
        Icons.cloud(g, 0, 0, w, h);
        const mark = PixelUI.addText(this, 0, S(1), '?', textStyle(S(14), { bold: true, color: '#b9a6dc' })).setOrigin(0.5);

        const cloud = this.add.container(x, y, [g, mark]);
        cloud.setSize(w, h);
        cloud.setInteractive({ useHandCursor: true });

        // Gentle drift so the map feels alive.
        this.tweens.add({
            targets: cloud,
            y: y - S(2),
            duration: Phaser.Math.Between(1400, 2200),
            delay: Phaser.Math.Between(0, 1500),
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });

        // Locked for now: a little wiggle says "not yet".
        cloud.on('pointerup', () => {
            if (cloud.wiggling) {
                return;
            }
            cloud.wiggling = true;
            playStep(this);
            this.tweens.add({
                targets: cloud,
                x: x + S(3),
                duration: 60,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    cloud.x = x;
                    cloud.wiggling = false;
                }
            });
        });
    }

    createHamster() {
        const stand = this.stands[this.location];
        this.hamster = this.add.image(stand.x, stand.y - S(6), this.character.id).setScale(2).setDepth(10);
        startBlinking(this, this.hamster, this.character);
        this.idleBob = this.tweens.add({
            targets: this.hamster,
            y: this.hamster.y - S(2),
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [1]
        });
    }

    goTo(place) {
        if (this.traveling || this.leaving) {
            return;
        }
        if (place === this.location) {
            this.enter(place);
            return;
        }

        this.traveling = true;
        this.idleBob.stop();
        const lift = S(6);
        let hop = 0;
        const steps = this.time.addEvent({ delay: 200, loop: true, callback: () => playStep(this) });

        // Roads all start at home: walk back home along the current place's road, then out
        // along the new one.
        const legs = [];
        if (this.location !== 'home') {
            legs.push({ road: this.roads[this.location], from: 1, to: 0 });
        }
        if (place !== 'home') {
            legs.push({ road: this.roads[place], from: 0, to: 1 });
        }

        const walk = (i) => {
            if (i === legs.length) {
                steps.remove();
                this.location = place;
                this.enter(place);
                return;
            }
            const { road, from, to } = legs[i];
            const progress = { t: from };
            this.tweens.add({
                targets: progress,
                t: to,
                duration: Math.max(1200, road.getLength() * 6),
                ease: legs.length === 1 ? 'Sine.easeInOut' : (i === 0 ? 'Sine.easeIn' : 'Sine.easeOut'),
                onUpdate: () => {
                    const p = road.getPointAt(progress.t);
                    // Little bounce while walking.
                    hop++;
                    this.hamster.setPosition(Math.round(p.x), Math.round(p.y) - lift - (Math.floor(hop / 6) % 2) * S(2));
                },
                onComplete: () => walk(i + 1)
            });
        };
        walk(0);
    }

    enter(place) {
        this.registry.set('mapLocation', place);
        PixelUI.fadeTo(this, MAP_PLACES[place].scene);
    }
}
