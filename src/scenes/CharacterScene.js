const SLOT_COLORS = {
    fill: 0xfff7fb,
    border: 0xd9b8d0,
    selectedFill: 0xffe1ec,
    selectedBorder: 0xf59bbd,
    lockedFill: 0xf1ecf7,
    lockedBorder: 0xd9ccf5
};

class CharacterScene extends Phaser.Scene {
    constructor() {
        super('CharacterScene');
    }

    init(data) {
        this.leaving = false;
        this.skipIntro = Boolean(data.resized);
        this.slots = [];
    }

    create() {
        const { width, height } = this.scale;
        const cx = Math.round(width / 2);
        const portrait = height > width;

        this.cameras.main.setSize(width, height);
        CHARACTERS.forEach((c) => createHamsterTextures(this, c));

        PixelUI.drawSky(this, width, height);

        const slot = 30;
        const gap = 4;
        const cols = portrait ? 4 : 5;
        const rows = Math.ceil(CHARACTER_SLOTS / cols);
        const gridW = cols * slot + (cols - 1) * gap;
        const gridH = rows * slot + (rows - 1) * gap;

        let gridX;
        let gridY;
        let panelX;
        let panelY;
        if (portrait) {
            // Grid above the preview panel (about 118px tall), centred as one block.
            const blockH = gridH + 20 + 118;
            gridX = Math.round((width - gridW) / 2);
            gridY = Math.max(30, Math.round((height - 28 - blockH) / 2));
            panelX = cx;
            panelY = gridY + gridH + 20 + 48;
        } else {
            gridX = Math.max(8, Math.round(width / 2 - 8 - gridW));
            gridY = Math.round((height - gridH) / 2) + 6;
            panelX = Math.round(width / 2 + 8 + (width / 2 - 16) / 2);
            panelY = Math.round(height / 2);
        }

        PixelUI.addTitle(this, cx, gridY - 16, 'Wybierz postać');

        for (let i = 0; i < CHARACTER_SLOTS; i++) {
            const x = gridX + (i % cols) * (slot + gap);
            const y = gridY + Math.floor(i / cols) * (slot + gap);
            this.slots.push(this.createSlot(x, y, slot, CHARACTERS[i]));
        }

        this.createPreview(panelX, panelY);

        PixelUI.createButton(this, 36, height - 14, 'Wróć', () => this.back(), { width: 56, height: 18, fontSize: 10 });

        const selectedId = this.registry.get('selectedCharacter') || CHARACTERS[0].id;
        this.select(CHARACTERS.indexOf(getCharacter(selectedId)));

        this.input.keyboard.on('keydown-LEFT', () => this.cycle(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.cycle(1));
        this.input.keyboard.on('keydown-ENTER', () => this.confirm());
        this.input.keyboard.on('keydown-ESC', () => this.back());

        if (!this.skipIntro) {
            PixelUI.fadeIn(this);
        }
        PixelUI.restartOnResize(this);
    }

    createSlot(x, y, size, character) {
        const g = this.add.graphics();
        const draw = (selected) => {
            g.clear();
            if (!character) {
                PixelUI.drawBox(g, x, y, size, size, SLOT_COLORS.lockedFill, SLOT_COLORS.lockedBorder);
            } else if (selected) {
                PixelUI.drawBox(g, x, y, size, size, SLOT_COLORS.selectedFill, SLOT_COLORS.selectedBorder, 0xffffff);
            } else {
                PixelUI.drawBox(g, x, y, size, size, SLOT_COLORS.fill, SLOT_COLORS.border);
            }
        };
        draw(false);

        const centerX = x + size / 2;
        const centerY = y + size / 2;

        if (!character) {
            this.add.text(centerX, centerY + 1, '?', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '12px',
                color: '#c3b6d8'
            }).setOrigin(0.5);
            return { draw };
        }

        this.add.image(centerX, centerY, character.id);

        const zone = this.add.zone(centerX, centerY, size, size).setInteractive({ useHandCursor: true });
        const index = CHARACTERS.indexOf(character);
        zone.on('pointerup', () => {
            if (this.selectedIndex === index) {
                this.confirm();
            } else {
                this.select(index);
            }
        });

        return { draw };
    }

    createPreview(x, y) {
        this.preview = this.add.image(x, y - 16, CHARACTERS[0].id).setScale(4);
        this.tweens.add({
            targets: this.preview,
            y: y - 18,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });

        this.previewName = PixelUI.addTitle(this, x, y + 26, '');
        this.previewSpecies = this.add.text(x, y + 40, '', {
            fontFamily: FONT,
            fontSize: '8px',
            color: TEXT_COLORS.subtitle
        }).setOrigin(0.5);

        PixelUI.createButton(this, x, y + 60, 'Wybierz', () => this.confirm(), { width: 80, height: 20, fontSize: 11 });
    }

    select(index) {
        const character = CHARACTERS[index];
        this.selectedIndex = index;
        this.registry.set('selectedCharacter', character.id);

        this.slots.forEach((s, i) => s.draw(i === index));

        this.preview.setTexture(character.id);
        this.previewName.setText(character.name);
        this.previewSpecies.setText(character.species);

        // Restart the blink loop for the newly shown character.
        this.blinkToken = (this.blinkToken || 0) + 1;
        const token = this.blinkToken;
        const blink = () => {
            if (token !== this.blinkToken || !this.preview.active) {
                return;
            }
            this.preview.setTexture(`${character.id}-blink`);
            this.time.delayedCall(140, () => {
                if (token === this.blinkToken) {
                    this.preview.setTexture(character.id);
                }
            });
            this.time.delayedCall(Phaser.Math.Between(1800, 4200), blink);
        };
        this.time.delayedCall(Phaser.Math.Between(800, 2000), blink);
    }

    cycle(step) {
        const count = CHARACTERS.length;
        this.select((this.selectedIndex + step + count) % count);
    }

    confirm() {
        PixelUI.fadeTo(this, 'TerrariumScene');
    }

    back() {
        PixelUI.fadeTo(this, 'StartScene');
    }
}
