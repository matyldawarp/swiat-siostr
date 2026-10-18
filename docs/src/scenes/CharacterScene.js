import { PixelUI, S, TEXT_COLORS, textStyle } from '../ui/pixel.js';
import { CHARACTERS, CHARACTER_SLOTS, getCharacter } from '../data/characters.js';
import { createHamsterTextures } from '../gfx/hamster.js';
import { BaseScene } from './BaseScene.js';

const SLOT_COLORS = {
    fill: 0xfff7fb,
    border: 0xd9b8d0,
    selectedFill: 0xffe1ec,
    selectedBorder: 0xf59bbd,
    lockedFill: 0xf1ecf7,
    lockedBorder: 0xd9ccf5
};

export class CharacterScene extends BaseScene {
    constructor() {
        super('CharacterScene');
    }

    init(data) {
        super.init(data);
        this.slots = [];
    }

    build({ width, height }) {
        const cx = Math.round(width / 2);
        const portrait = height > width;
        CHARACTERS.forEach((c) => createHamsterTextures(this, c));

        PixelUI.drawSky(this, width, height);

        const slot = S(30);
        const gap = S(4);
        const cols = portrait ? 4 : 5;

        // The title sits just above the grid, so the grid starts low enough for both.
        const title = PixelUI.addTitle(this, cx, 0, 'Wybierz postać');
        const minGridY = Math.max(S(30), PixelUI.topClearY(width, title.width, title.height) + S(16));

        // Rows that fit below the title, above the preview panel (below the grid when upright)
        // and the back button. On small phone screens the locked "?" slots, which are only
        // a promise of more characters, are left out; every character always gets a slot.
        const freeH = height - minGridY - S(28) - (portrait ? S(20) + S(118) : 0);
        const rowsFit = Math.floor((freeH + gap) / (slot + gap));
        const rows = Math.max(Math.ceil(CHARACTERS.length / cols), Math.min(Math.ceil(CHARACTER_SLOTS / cols), rowsFit));
        const slotCount = Math.min(CHARACTER_SLOTS, rows * cols);
        const gridW = cols * slot + (cols - 1) * gap;
        const gridH = rows * slot + (rows - 1) * gap;

        let gridX;
        let gridY;
        let panelX;
        let panelY;
        if (portrait) {
            // Grid above the preview panel, centred as one block.
            const blockH = gridH + S(20) + S(118);
            gridX = Math.round((width - gridW) / 2);
            gridY = Math.max(minGridY, Math.round((height - S(28) - blockH) / 2));
            panelX = cx;
            panelY = gridY + gridH + S(20) + S(48);
        } else {
            gridX = Math.max(S(8), Math.round(width / 2 - S(8) - gridW));
            gridY = Math.max(minGridY, Math.round((height - gridH) / 2) + S(6));
            panelX = Math.round(width / 2 + S(8) + (width / 2 - S(16)) / 2);
            panelY = Math.round(height / 2);
        }
        title.setY(gridY - S(16));

        for (let i = 0; i < slotCount; i++) {
            const x = gridX + (i % cols) * (slot + gap);
            const y = gridY + Math.floor(i / cols) * (slot + gap);
            this.slots.push(this.createSlot(x, y, slot, CHARACTERS[i]));
        }

        this.createPreview(panelX, panelY);

        PixelUI.createButton(this, S(36), height - S(14), 'Wróć', () => this.back(), { width: S(56), height: S(18), fontSize: S(10) });

        const selectedId = this.registry.get('selectedCharacter') || CHARACTERS[0].id;
        this.select(CHARACTERS.indexOf(getCharacter(selectedId)));

        this.input.keyboard.on('keydown-LEFT', () => this.cycle(-1));
        this.input.keyboard.on('keydown-RIGHT', () => this.cycle(1));
        this.input.keyboard.on('keydown-ENTER', () => this.confirm());
        this.input.keyboard.on('keydown-ESC', () => this.back());
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
            PixelUI.addText(this, centerX, centerY + 1, '?', textStyle(S(12), { bold: true, color: '#c3b6d8' })).setOrigin(0.5);
            return { draw };
        }

        this.add.image(centerX, centerY, character.id).setScale(2);

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
        this.preview = this.add.image(x, y - S(16), CHARACTERS[0].id).setScale(6);
        this.tweens.add({
            targets: this.preview,
            y: y - S(18),
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Stepped',
            easeParams: [2]
        });

        this.previewName = PixelUI.addTitle(this, x, y + S(26), '');
        this.previewSpecies = PixelUI.addText(this, x, y + S(40), '', textStyle(S(8), { color: TEXT_COLORS.subtitle })).setOrigin(0.5);

        PixelUI.createButton(this, x, y + S(60), 'Wybierz', () => this.confirm(), { width: S(80), height: S(20), fontSize: S(11) });
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
