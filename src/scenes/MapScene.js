const MAP_COLORS = {
    grass: 0xd4f2e4,
    grassLight: 0xe2f7ec,
    road: 0xf6e3c4,
    roadEdge: 0xe8cc9e,
    roadDots: 0xfff7e0,
    flowers: [0xf7b2cc, 0xfff1c9, 0xd9ccf5, 0xffffff]
};

// Places on the map and the scene each one opens.
const MAP_PLACES = {
    home: 'TerrariumScene',
    hospital: 'HospitalScene'
};

class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    init(data) {
        this.leaving = false;
        this.traveling = false;
        this.skipIntro = Boolean(data.resized);
        this.character = getCharacter(this.registry.get('selectedCharacter'));
        this.location = this.registry.get('mapLocation') || 'home';
    }

    create() {
        const { width, height } = PixelUI.setupView(this);
        createHamsterTextures(this, this.character);
        const portrait = height > width;

        // Where things sit, as fractions of the map so it fits any window.
        const at = (fx, fy) => ({ x: Math.round(width * fx), y: Math.round(height * fy) });
        const homePos = portrait ? at(0.28, 0.8) : at(0.16, 0.74);
        const hospitalPos = portrait ? at(0.7, 0.28) : at(0.8, 0.36);
        const bends = portrait ? [at(0.64, 0.7), at(0.34, 0.46)] : [at(0.42, 0.82), at(0.58, 0.36)];

        // Hamster stands just in front of each building; the road joins those spots.
        this.stands = {
            home: { x: homePos.x, y: homePos.y + S(10) },
            hospital: { x: hospitalPos.x, y: hospitalPos.y + S(10) }
        };
        this.road = new Phaser.Curves.Spline([
            this.stands.home, ...bends, this.stands.hospital
        ].map((p) => new Phaser.Math.Vector2(p.x, p.y)));

        this.drawGround(width, height);
        const roadPoints = this.drawRoad();

        this.createPlace('home', homePos, (g) => Icons.house(g, homePos.x, homePos.y - S(18), S(44)));
        this.createPlace('hospital', hospitalPos, (g) => Icons.hospital(g, hospitalPos.x, hospitalPos.y, S(64), S(54)));

        this.drawTrees(homePos, hospitalPos, width, height);
        this.createClouds(width, height, [homePos, hospitalPos], roadPoints);
        this.createHamster();

        // The place you can travel to gently pulses.
        const target = this.location === 'home' ? 'hospital' : 'home';
        PixelUI.pulse(this, this.places[target], 0.06);

        if (!this.skipIntro) {
            PixelUI.fadeIn(this);
        }
        PixelUI.restartOnResize(this);
    }

    drawGround(width, height) {
        const g = this.add.graphics();
        g.fillStyle(MAP_COLORS.grass, 1);
        g.fillRect(0, 0, width, height);

        // Lighter grass patches and scattered flowers.
        g.fillStyle(MAP_COLORS.grassLight, 1);
        for (let i = 0; i < (width * height) / 9000; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            PixelUI.fillCircle(g, x, y, Phaser.Math.Between(S(6), S(14)));
        }
        for (let i = 0; i < (width * height) / 1500; i++) {
            g.fillStyle(Phaser.Utils.Array.GetRandom(MAP_COLORS.flowers), 1);
            g.fillRect(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), 2, 2);
        }
    }

    // Sandy road along the spline; returns its sample points for spacing other things.
    drawRoad() {
        const g = this.add.graphics();
        const points = this.road.getSpacedPoints(Math.round(this.road.getLength() / 2));
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

    drawTrees(homePos, hospitalPos, width, height) {
        const g = this.add.graphics();
        const spots = [
            { x: homePos.x - S(40), y: homePos.y - S(6) },
            { x: homePos.x + S(38), y: homePos.y - S(14) },
            { x: hospitalPos.x + S(48), y: hospitalPos.y - S(4) },
            { x: hospitalPos.x - S(46), y: hospitalPos.y + S(2) }
        ];
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
        // Keep clear of the reload button in the top-right corner.
        const reload = { x: width - S(17), y: S(17) };

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const p = {
                    x: Math.round(offX + col * cellW + Phaser.Math.Between(-S(4), S(4))),
                    y: Math.round(offY + row * cellH + Phaser.Math.Between(-S(3), S(3)))
                };
                const buildingSpots = buildings.map((b) => ({ x: b.x, y: b.y - S(20) }));
                if (near(p, buildingSpots, S(58)) || near(p, sparseRoad, S(28))
                    || near(p, this.treeSpots, S(26)) || near(p, [reload], S(40))) {
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
        const mark = PixelUI.addText(this, 0, S(1), '?', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: `${S(14)}px`,
            color: '#b9a6dc'
        }).setOrigin(0.5);

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
        const forward = place === 'hospital';
        const progress = { t: forward ? 0 : 1 };
        const lift = S(6);

        let hop = 0;
        const steps = this.time.addEvent({ delay: 200, loop: true, callback: () => playStep(this) });

        this.tweens.add({
            targets: progress,
            t: forward ? 1 : 0,
            duration: 2600,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                const p = this.road.getPointAt(progress.t);
                // Little bounce while walking.
                hop++;
                this.hamster.setPosition(Math.round(p.x), Math.round(p.y) - lift - (Math.floor(hop / 6) % 2) * S(2));
            },
            onComplete: () => {
                steps.remove();
                this.location = place;
                this.registry.set('mapLocation', place);
                this.enter(place);
            }
        });
    }

    enter(place) {
        this.registry.set('mapLocation', place);
        PixelUI.fadeTo(this, MAP_PLACES[place]);
    }
}
