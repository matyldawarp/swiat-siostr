import { PixelUI, S, textStyle } from '../ui/pixel.js';
import { createHamsterTextures, startBlinking } from '../gfx/hamster.js';
import { addImage, addPattern } from '../gfx/images.js';
import { Illness } from '../ui/illness.js';
import { playStep } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

// Pictures of this scene: docs/assets/gfx/mapa/.
const P = 'mapa/';

// Places on the map. `at` is where the building stands, as fractions of the map; every
// road starts at home and passes through `bends` on its way to the place. Going between
// two places other than home walks past home. `image` is the building, anchored on the
// middle of its base; `trees` are offsets of trees around it.
// To add a place: an entry here, its scene in main.js and in SCENE_PARENTS (routes.js),
// the scene's goBack setting registry 'mapLocation' to the key, and its road in mapa/drogi.
const MAP_PLACES = {
    home: {
        scene: 'TerrariumScene',
        at: [0.16, 0.74],
        image: P + 'dom',
        trees: [[-40, -6], [38, -14]]
    },
    hospital: {
        scene: 'HospitalScene',
        at: [0.8, 0.36],
        bends: [[0.45, 0.8], [0.66, 0.62]],
        image: P + 'szpital',
        trees: [[48, -4], [-46, 2]]
    },
    bakery: {
        scene: 'BakeryScene',
        at: [0.84, 0.86],
        bends: [[0.4, 0.95], [0.64, 0.92]],
        image: P + 'cukiernia',
        trees: [[-48, 0]]
    },
    dentist: {
        scene: 'DentistScene',
        at: [0.3, 0.32],
        bends: [[0.1, 0.56], [0.2, 0.42]],
        image: P + 'dentysta',
        trees: [[44, -2]]
    },
    studio: {
        scene: 'ColoringScene',
        at: [0.56, 0.3],
        bends: [[0.3, 0.6], [0.45, 0.45]],
        image: P + 'pracownia',
        trees: [[46, 0]]
    },
    school: {
        scene: 'SchoolScene',
        at: [0.1, 0.41],
        bends: [[0.06, 0.58]],
        image: P + 'szkola'
    },
    gabi: {
        scene: 'GabiHouseScene',
        at: [0.88, 0.6],
        bends: [[0.45, 0.8], [0.68, 0.68]],
        image: P + 'domek-gabi'
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

        // Grass over the whole window, then every road (one picture over the stage).
        const b = this.view.bleed;
        addPattern(this, b.x, b.y, b.width, b.height, P + 'trawa');
        addImage(this, 0, 0, P + 'drogi');
        // Points along the roads, for keeping the clouds off them.
        const roadPoints = Object.values(this.roads).flatMap((road) => road.getSpacedPoints(Math.round(road.getLength() / 2)));

        Object.entries(MAP_PLACES).forEach(([key, place]) => this.createPlace(key, positions[key], place.image));

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

    createPlace(key, pos, image) {
        this.places = this.places || {};

        // In a container around the place so it can pulse in place.
        const container = this.add.container(pos.x, pos.y, [addImage(this, 0, 0, image)]);
        this.places[key] = container;

        const zone = this.add.zone(pos.x, pos.y - S(22), S(70), S(64)).setInteractive({ useHandCursor: true });
        zone.on('pointerup', () => this.goTo(key));
    }

    drawTrees(positions, width, height) {
        const spots = Object.entries(MAP_PLACES).flatMap(([key, place]) => (place.trees || [])
            .map(([dx, dy]) => ({ x: positions[key].x + S(dx), y: positions[key].y + S(dy) })));
        spots
            .filter((p) => p.x > S(12) && p.x < width - S(12) && p.y > S(30) && p.y < height - S(4))
            .forEach((p) => addImage(this, p.x, p.y, P + 'drzewko'));
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
        // Keep clear of the settings, music and reload buttons in the top-right corner.
        const corner = [{ x: width - S(17), y: S(17) }, { x: width - S(43), y: S(17) }, { x: width - S(69), y: S(17) }];

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
        // Tap area: the cloud picture's size before the outline.
        const w = S(44);
        const h = S(26);
        const picture = addImage(this, 0, 0, P + 'chmurka');
        const mark = PixelUI.addText(this, 0, S(1), '?', textStyle(S(14), { bold: true, color: '#b9a6dc' })).setOrigin(0.5);

        const cloud = this.add.container(x, y, [picture, mark]);
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

    // Back home: the hamster walks there first, then the terrarium opens.
    goBack() {
        this.goTo('home');
    }

    enter(place) {
        this.registry.set('mapLocation', place);
        PixelUI.fadeTo(this, MAP_PLACES[place].scene);
    }
}
