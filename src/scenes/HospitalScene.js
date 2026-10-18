const HOSPITAL_COLORS = {
    wall: 0xe4f1ff,
    wainscot: 0xf7d6e4,
    tileA: 0xffffff,
    tileB: 0xd4f2e4,
    bedFrame: 0xd9ccf5,
    bedFrameDark: 0xc3b3ea,
    mattress: 0xffffff,
    pillow: 0xfbd3e2,
    blanket: 0xffe1c4,
    blanketStripe: 0xf7b2cc,
    windowFrame: 0xffffff
};

const HOSPITAL_HAMSTER_SCALE = 4;

// Treatment steps, suggested in this order (the next one pulses) but any order works.
const TREATMENTS = ['thermometer', 'syrup', 'plaster'];

class HospitalScene extends Phaser.Scene {
    constructor() {
        super('HospitalScene');
    }

    init(data) {
        this.leaving = false;
        this.skipIntro = Boolean(data.resized);
        this.character = getCharacter(this.registry.get('selectedCharacter'));
        this.busy = false;
        this.done = new Set();
        this.toolButtons = {};
    }

    create() {
        const { width, height } = PixelUI.setupView(this);
        this.viewWidth = width;
        createHamsterTextures(this, this.character);
        createHeartTexture(this);

        const portrait = height > width;
        const floorY = Math.round(height * (portrait ? 0.62 : 0.66));

        this.drawRoom(width, height, floorY);
        this.createBed(portrait ? Math.round(width / 2) : Math.round(width * 0.46), floorY);
        this.createTools(width, height);

        this.mapButton = PixelUI.createIconButton(this, S(24), height - S(24), S(32),
            (g, size) => Icons.map(g, 0, 0, size), () => this.goToMap());

        this.updateHints();

        if (!this.skipIntro) {
            PixelUI.fadeIn(this);
        }
        PixelUI.restartOnResize(this);
    }

    drawRoom(width, height, floorY) {
        const C = HOSPITAL_COLORS;
        const g = this.add.graphics();

        g.fillStyle(C.wall, 1);
        g.fillRect(0, 0, width, floorY);
        g.fillStyle(C.wainscot, 1);
        g.fillRect(0, floorY - S(10), width, S(10));
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(0, floorY, width, 1);

        // Checkered floor.
        const tile = S(12);
        for (let y = floorY + 1; y < height; y += tile) {
            for (let x = 0; x < width; x += tile) {
                const odd = (Math.floor(x / tile) + Math.floor((y - floorY) / tile)) % 2;
                g.fillStyle(odd ? C.tileB : C.tileA, 1);
                g.fillRect(x, y, tile, tile);
            }
        }

        // Cross sign on the wall.
        const sign = S(30);
        const signX = Math.round(width * 0.16);
        const signY = Math.round(floorY * 0.32);
        PixelUI.drawBox(g, signX - sign / 2, signY - sign / 2, sign, sign, ICON_COLORS.cream, PALETTE.outline);
        Icons.cross(g, signX, signY, Math.round(sign * 0.7));

        // Window with sky and a cloud.
        const winW = S(56);
        const winH = S(40);
        const winX = Math.round(width * 0.8 - winW / 2);
        const winY = Math.round(floorY * 0.28 - winH / 2);
        PixelUI.drawBox(g, winX, winY, winW, winH, PALETTE.sky[0], PALETTE.outline);
        Icons.cloud(g, winX + Math.round(winW * 0.45), winY + Math.round(winH * 0.5), S(26), S(14));
        g.fillStyle(C.windowFrame, 1);
        g.fillRect(winX + Math.round(winW / 2) - 1, winY + 2, 2, winH - 4);
        g.fillRect(winX + 2, winY + Math.round(winH / 2) - 1, winW - 4, 2);
    }

    createBed(cx, floorY) {
        const C = HOSPITAL_COLORS;
        const bedW = S(130);
        const left = Math.round(cx - bedW / 2);
        const legH = S(12);
        const frameH = S(6);
        const mattressH = S(8);
        const bottom = floorY + S(14);
        const frameTop = bottom - legH - frameH;
        const mattressTop = frameTop - mattressH;

        const back = this.add.graphics();
        // Headboard on the left.
        PixelUI.drawBox(back, left - S(4), mattressTop - S(34), S(12), S(34) + frameH + mattressH + legH, C.bedFrame, PALETTE.outline);
        // Legs, frame, mattress.
        back.fillStyle(PALETTE.outline, 1);
        back.fillRect(left + S(8), frameTop, S(5), legH + frameH);
        back.fillRect(left + bedW - S(12), frameTop, S(5), legH + frameH);
        back.fillStyle(C.bedFrameDark, 1);
        back.fillRect(left + S(8) + 1, frameTop, S(5) - 2, legH + frameH - 1);
        back.fillRect(left + bedW - S(12) + 1, frameTop, S(5) - 2, legH + frameH - 1);
        PixelUI.drawBox(back, left, frameTop, bedW, frameH, C.bedFrame, PALETTE.outline);
        PixelUI.drawBox(back, left + 2, mattressTop, bedW - 4, mattressH + 2, C.mattress, PALETTE.outline);
        // Pillow.
        PixelUI.drawBox(back, left + S(8), mattressTop - S(8), S(26), S(10), C.pillow, PALETTE.outline);

        // Hamster sits on the mattress next to the pillow.
        const scale = HOSPITAL_HAMSTER_SCALE;
        const hx = left + S(52);
        // Sits on the mattress; the blanket then covers only up to its paws.
        const hy = mattressTop - 8 * scale - S(2);
        this.hamster = this.add.container(hx, hy);
        this.hamsterImage = this.add.image(0, 0, this.character.id).setScale(scale);
        this.hamster.add(this.hamsterImage);
        this.hamsterImage.setInteractive({ useHandCursor: true });
        this.hamsterImage.on('pointerdown', () => {
            playCharacterSound(this, this.character.sound);
            this.showHearts(1);
        });
        startBlinking(this, this.hamsterImage, this.character);

        // Still has its cold on arrival: bubble stays until the treatment is done.
        if (Illness.isSick(this)) {
            this.sickBubble = Illness.createBubble(this).setDepth(20);
            this.sickBubble.setPosition(hx + S(30), hy - 8 * scale - S(12));
            this.sneezeTimer = this.time.addEvent({
                delay: 5000,
                loop: true,
                callback: () => {
                    if (!this.busy) {
                        Illness.sneeze(this, this.hamsterImage, this.hamster, this.character, this.spots.mouth);
                    }
                }
            });
        }

        // Points on the hamster the tools go to (in world coordinates).
        this.spots = {
            mouth: { x: hx, y: hy + 1.5 * scale },
            armpit: { x: hx + 7 * scale, y: hy + 2 * scale },
            cheek: { x: hx + 4 * scale, y: hy + 0.5 * scale }
        };

        // Blanket over the hamster's lower half.
        const front = this.add.graphics();
        const blanketLeft = hx - S(26);
        const blanketTop = mattressTop - S(10);
        const blanketW = left + bedW - 2 - blanketLeft;
        PixelUI.drawBox(front, blanketLeft, blanketTop, blanketW, S(10) + mattressH, C.blanket, PALETTE.outline);
        front.fillStyle(C.blanketStripe, 1);
        front.fillRect(blanketLeft + 2, blanketTop + S(4), blanketW - 4, S(2));
    }

    createTools(width, height) {
        const size = S(40);
        const gap = S(56);
        const y = height - S(30);
        const draws = {
            thermometer: (g, s) => Icons.thermometer(g, 0, 0, s, 0.3),
            syrup: (g, s) => Icons.spoon(g, 0, 0, s),
            plaster: (g, s) => Icons.plaster(g, 0, 0, s)
        };

        TREATMENTS.forEach((key, i) => {
            const x = Math.round(width / 2 + (i - 1) * gap);
            this.toolButtons[key] = PixelUI.createIconButton(this, x, y, size, draws[key], () => this.useTool(key));
        });
    }

    // The next suggested tool pulses; used tools fade out.
    updateHints() {
        Object.values(this.toolButtons).forEach((b) => {
            if (b.pulseTween) {
                b.pulseTween.stop();
                b.pulseTween = null;
                b.setScale(1);
            }
        });
        const next = TREATMENTS.find((k) => !this.done.has(k));
        if (next) {
            const button = this.toolButtons[next];
            button.pulseTween = PixelUI.pulse(this, button);
        }
    }

    useTool(key) {
        if (this.busy || this.done.has(key)) {
            return;
        }
        this.busy = true;
        const button = this.toolButtons[key];
        button.setAlpha(0.4);

        const actions = {
            thermometer: () => this.measureTemperature(button),
            syrup: () => this.giveSyrup(button),
            plaster: () => this.stickPlaster(button)
        };
        actions[key]();
    }

    // Moves a fresh graphics object drawn by `draw` from the button to `to`, then calls onArrive.
    flyTool(button, to, draw, onArrive) {
        const tool = this.add.graphics({ x: button.x, y: button.y }).setDepth(20);
        draw(tool);
        this.tweens.add({
            targets: tool,
            x: Math.round(to.x),
            y: Math.round(to.y),
            duration: 450,
            ease: 'Quad.easeOut',
            onComplete: () => onArrive(tool)
        });
    }

    measureTemperature(button) {
        const size = S(40);
        const to = { x: this.spots.armpit.x, y: this.spots.armpit.y };
        this.flyTool(button, to, (g) => Icons.thermometer(g, 0, 0, size, 0.2), (tool) => {
            const reading = { level: 0.2 };
            this.tweens.add({
                targets: reading,
                level: 0.75,
                duration: 1400,
                ease: 'Stepped',
                easeParams: [6],
                onUpdate: () => {
                    tool.clear();
                    Icons.thermometer(tool, 0, 0, size, reading.level);
                },
                onComplete: () => {
                    playDing(this);
                    this.time.delayedCall(400, () => {
                        tool.destroy();
                        this.finishStep('thermometer');
                    });
                }
            });
        });
    }

    giveSyrup(button) {
        const size = S(40);
        const bowlOffset = size / 2 - Math.round(size * 0.22) - 1;
        const to = { x: this.spots.mouth.x + bowlOffset, y: this.spots.mouth.y };
        this.flyTool(button, to, (g) => Icons.spoon(g, 0, 0, size, true), (tool) => {
            const id = this.character.id;
            let bite = 0;
            this.time.addEvent({
                delay: 160,
                repeat: 5,
                callback: () => {
                    bite++;
                    this.hamsterImage.setTexture(bite % 2 ? `${id}-chew` : id);
                    if (bite === 1) {
                        tool.clear();
                        Icons.spoon(tool, 0, 0, size, false);
                        playCharacterSound(this, this.character.sound);
                    }
                    if (bite === 6) {
                        this.hamsterImage.setTexture(id);
                        this.tweens.add({
                            targets: tool,
                            alpha: 0,
                            duration: 300,
                            onComplete: () => {
                                tool.destroy();
                                this.finishStep('syrup');
                            }
                        });
                    }
                }
            });
        });
    }

    stickPlaster(button) {
        const w = S(16);
        this.flyTool(button, this.spots.cheek, (g) => Icons.plaster(g, 0, 0, w), (tool) => {
            // Stays on the cheek: move it into the hamster so it follows its hops.
            tool.setPosition(tool.x - this.hamster.x, tool.y - this.hamster.y);
            this.hamster.add(tool);
            playPat(this);
            this.tweens.add({
                targets: this.hamster,
                y: this.hamster.y - S(3),
                duration: 100,
                yoyo: true,
                onComplete: () => this.finishStep('plaster')
            });
        });
    }

    finishStep(key) {
        this.done.add(key);
        this.busy = false;
        this.showHearts(2);

        // Small heart on the used tool marks it as done.
        const button = this.toolButtons[key];
        const mark = this.add.graphics();
        Icons.heart(mark, S(14), -S(14), S(12));
        button.add(mark);

        this.updateHints();
        if (this.done.size === TREATMENTS.length) {
            this.time.delayedCall(500, () => this.celebrate());
        }
    }

    showHearts(count) {
        for (let i = 0; i < count; i++) {
            const heart = this.add.image(
                this.hamster.x + Phaser.Math.Between(-S(16), S(16)),
                this.hamster.y - S(30),
                'heart'
            ).setScale(3).setDepth(20);
            this.tweens.add({
                targets: heart,
                y: heart.y - S(24),
                alpha: 0,
                delay: i * 150,
                duration: 800,
                ease: 'Stepped',
                easeParams: [6],
                onComplete: () => heart.destroy()
            });
        }
    }

    // "Brave patient" sticker, then the map button invites the trip home.
    celebrate() {
        const cx = Math.round(this.viewWidth / 2);
        const cy = S(44);

        playFanfare(this);
        this.showHearts(5);

        // Healthy again.
        Illness.setSick(this, false);
        if (this.sneezeTimer) {
            this.sneezeTimer.remove();
        }
        if (this.sickBubble) {
            const bubble = this.sickBubble;
            this.sickBubble = null;
            this.tweens.add({ targets: bubble, alpha: 0, duration: 300, onComplete: () => bubble.destroy() });
        }

        const star = this.add.graphics({ x: cx, y: cy }).setDepth(30);
        Icons.star(star, 0, 0, S(26));
        star.setScale(0);
        this.tweens.add({ targets: star, scale: 1, duration: 500, ease: 'Back.easeOut' });

        const label = PixelUI.addTitle(this, cx, cy + S(36), 'Dzielny pacjent!', S(14)).setDepth(30).setAlpha(0);
        this.tweens.add({ targets: label, alpha: 1, delay: 300, duration: 400 });

        this.tweens.add({
            targets: this.hamster,
            y: this.hamster.y - S(8),
            duration: 160,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeOut'
        });

        this.registry.set('stickers', (this.registry.get('stickers') || 0) + 1);
        PixelUI.pulse(this, this.mapButton);
    }

    goToMap() {
        this.registry.set('mapLocation', 'hospital');
        PixelUI.fadeTo(this, 'MapScene');
    }
}
