import { PALETTE, PixelUI, S, STAGE, TEXT_COLORS, textStyle } from '../ui/pixel.js';
import { ICON_COLORS, Icons } from '../gfx/icons.js';
import { PICTURES, PICTURE_SIZE, pictureTexture } from '../gfx/pictures.js';
import { LESSONS, SEARCH_SIZE, makeRound, rebusAnswer, trapsIn } from '../data/school.js';
import { floatHeart } from '../ui/effects.js';
import { say } from '../audio/speech.js';
import { playDing, playFanfare, playPat, playPlop, playSparkle, playStep } from '../audio/sfx.js';
import { BaseScene } from './BaseScene.js';

const SCHOOL_COLORS = {
    wall: 0xfff7e8,
    wallStripe: 0xfcefd9,
    floor: 0xf3dcc4,
    floorLine: 0xe2c4a6,
    slot: 0xf3ecfb,
    done: 0xd4f2e4,
    // Strips over the words found in the word search, one colour per word.
    found: [0xf7b2cc, 0xbfe8d6, 0xd9ccf5, 0xfff1c9, 0xcfe8ff, 0xffd6b8]
};

// The open lesson (its id) and its round: { lesson, tasks, index }, both in the registry
// so turning the iPad (a rebuild) keeps the same tasks.
const LESSON_KEY = 'schoolLesson';
const ROUND_KEY = 'schoolRound';
// Top of the wooden floor strip, under the lessons' stars.
const FLOOR_Y = STAGE.height - S(26);
// Stars for finished rounds, per lesson, remembered on the device.
const STARS_STORAGE = 'swiat-siostr-school-stars';

function loadStars() {
    try {
        return JSON.parse(localStorage.getItem(STARS_STORAGE)) || {};
    } catch {
        return {};
    }
}

function saveStars(stars) {
    try {
        localStorage.setItem(STARS_STORAGE, JSON.stringify(stars));
    } catch {
        // Storage blocked: the stars last until the page is closed.
    }
}

const shuffle = (list) => Phaser.Utils.Array.Shuffle([...list]);

// Positions for boxes of `widths` in rows no wider than maxW, each row centred on cx;
// rows are rowH apart starting at y.
function flow(widths, cx, y, maxW, gap, rowH) {
    const rows = [[]];
    let rowW = 0;
    widths.forEach((w, i) => {
        const row = rows[rows.length - 1];
        if (row.length && rowW + gap + w > maxW) {
            rows.push([i]);
            rowW = w;
        } else {
            rowW += (row.length ? gap : 0) + w;
            row.push(i);
        }
    });
    const at = [];
    rows.forEach((row, r) => {
        const total = row.reduce((sum, i) => sum + widths[i], 0) + gap * (row.length - 1);
        let x = cx - total / 2;
        row.forEach((i) => {
            at[i] = { x: Math.round(x + widths[i] / 2), y: y + r * rowH };
            x += widths[i] + gap;
        });
    });
    return at;
}

// The school: a classroom with four desks, one per kind of spelling task (data/school.js).
// A desk opens a round of a few tasks drawn at random; the stars at the bottom fill as
// they are done, and a finished round gives the desk a star to keep. Everything is done by
// tapping or dragging a finger; a wrong tap only wiggles. The speaker button (and opening
// a task) reads the task aloud, and tapping a picture says its name.
export class SchoolScene extends BaseScene {
    constructor() {
        super('SchoolScene');
    }

    init(data) {
        super.init(data);
        this.lesson = LESSONS.find((l) => l.id === this.registry.get(LESSON_KEY)) || null;
        this.busy = false;
    }

    // #szkola for the classroom, #szkola/<lesson id> during a lesson.
    route() {
        return this.lesson ? `${super.route()}/${this.lesson.id}` : super.route();
    }

    build({ width, height }) {
        this.drawRoom();
        if (this.lesson) {
            this.buildLesson(width, height);
        } else {
            this.buildClassroom(width, height);
        }
    }

    // Striped wallpaper and a wooden floor strip over the whole window (view.bleed).
    drawRoom() {
        const b = this.view.bleed;
        const g = this.add.graphics();
        const stripe = S(14);
        const firstX = Math.floor(b.x / stripe) * stripe;
        for (let x = firstX; x < b.x + b.width; x += stripe) {
            g.fillStyle(Math.abs(Math.floor(x / stripe)) % 2 ? SCHOOL_COLORS.wallStripe : SCHOOL_COLORS.wall, 1);
            g.fillRect(x, b.y, stripe, b.height);
        }
        const floorY = FLOOR_Y;
        g.fillStyle(SCHOOL_COLORS.floor, 1);
        g.fillRect(b.x, floorY, b.width, b.y + b.height - floorY);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(b.x, floorY, b.width, 1);
        g.fillStyle(SCHOOL_COLORS.floorLine, 1);
        for (let y = floorY + S(8); y < b.y + b.height; y += S(8)) {
            g.fillRect(b.x, y, b.width, 1);
        }
    }

    // --- Classroom ----------------------------------------------------------------------

    buildClassroom(width) {
        PixelUI.addTitle(this, Math.round(width / 2), S(24), 'Szkoła');
        const stars = loadStars();
        const w = S(150);
        const h = S(84);
        const gap = S(12);
        const left = Math.round((width - 2 * w - gap) / 2);
        LESSONS.forEach((lesson, i) => {
            const x = left + (i % 2) * (w + gap);
            const y = S(44) + Math.floor(i / 2) * (h + gap);
            this.createDesk(lesson, x, y, w, h, stars[lesson.id] || 0);
        });
    }

    // A card for a lesson: its picture on the left, its name and its stars on the right.
    createDesk(lesson, x, y, w, h, stars) {
        const g = this.add.graphics();
        PixelUI.drawBox(g, x, y, w, h, ICON_COLORS.white, PALETTE.buttonBorder, 0xffffff);
        const icon = S(60);
        const ix = x + S(8) + icon / 2;
        const iy = y + h / 2;
        PixelUI.drawBox(g, ix - icon / 2, iy - icon / 2, icon, icon, ICON_COLORS.cream, ICON_COLORS.lavenderDark);
        this.drawLessonIcon(lesson.id, ix, iy, icon);

        const tx = x + S(8) + icon + (w - S(16) - icon) / 2;
        PixelUI.addText(this, tx, y + h / 2 - S(10), lesson.title,
            textStyle(S(13), { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);
        if (stars > 0) {
            Icons.star(g, Math.round(tx - S(8)), Math.round(y + h / 2 + S(14)), S(7), ICON_COLORS.goldDark);
            PixelUI.addText(this, tx + S(2), y + h / 2 + S(14), `${stars}`,
                textStyle(S(12), { bold: true, color: TEXT_COLORS.subtitle })).setOrigin(0, 0.5);
        }

        const zone = this.add.zone(x + w / 2, y + h / 2, w, h).setInteractive({ useHandCursor: true });
        zone.on('pointerup', () => this.openLesson(lesson));
    }

    // Small picture of each lesson, for the girl who doesn't read yet.
    drawLessonIcon(id, cx, cy, size) {
        const g = this.add.graphics();
        if (id === 'rozsypanka') {
            [[-0.22, -0.2, 0.4], [0.2, -0.2, 0.3], [-0.12, 0.18, 0.5]].forEach(([fx, fy, fw]) => {
                const w = Math.round(size * fw);
                const h = Math.round(size * 0.24);
                const x = Math.round(cx + fx * size - w / 2);
                const y = Math.round(cy + fy * size - h / 2);
                PixelUI.drawBox(g, x, y, w, h, ICON_COLORS.white, PALETTE.buttonBorder);
                g.fillStyle(ICON_COLORS.lavenderDark, 1);
                g.fillRect(x + 3, y + Math.round(h / 2) - 1, w - 6, 2);
            });
        } else if (id === 'zagadki') {
            this.add.image(cx - S(6), cy + S(2), pictureTexture(this, 'wiewiorka')).setScale(Math.floor(size * 0.6 / PICTURE_SIZE));
            PixelUI.addText(this, cx + S(16), cy - S(12), '?', textStyle(S(22), { bold: true, color: TEXT_COLORS.title })).setOrigin(0.5);
        } else if (id === 'rebusy') {
            PixelUI.addText(this, cx - S(15), cy, 's+', textStyle(S(14), { bold: true, color: TEXT_COLORS.title })).setOrigin(0.5);
            this.add.image(cx + S(9), cy, pictureTexture(this, 'gora')).setScale(Math.floor(size * 0.6 / PICTURE_SIZE));
        } else {
            const n = 4;
            const cell = Math.floor(size * 0.8 / n);
            const left = Math.round(cx - (n * cell) / 2);
            const top = Math.round(cy - (n * cell) / 2);
            g.fillStyle(SCHOOL_COLORS.found[0], 1);
            g.fillRect(left, top + cell, n * cell, cell);
            g.fillStyle(ICON_COLORS.lavenderDark, 1);
            for (let i = 0; i <= n; i++) {
                g.fillRect(left + i * cell, top, 1, n * cell + 1);
                g.fillRect(left, top + i * cell, n * cell + 1, 1);
            }
            ['k', 'r', 'ó', 'l'].forEach((ch, i) => {
                PixelUI.addText(this, left + i * cell + cell / 2, top + cell * 1.5, ch,
                    textStyle(S(9), { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);
            });
        }
    }

    openLesson(lesson) {
        playPat(this);
        // Said from the tap itself: the iPad lets a page speak only after that.
        say(lesson.say);
        this.registry.set(LESSON_KEY, lesson.id);
        this.registry.set(ROUND_KEY, { lesson: lesson.id, tasks: makeRound(lesson.id), index: 0 });
        this.scene.restart({ resized: true });
    }

    backToClassroom() {
        playStep(this);
        this.registry.set(LESSON_KEY, null);
        this.registry.set(ROUND_KEY, null);
        this.scene.restart({ resized: true });
    }

    // --- A lesson -----------------------------------------------------------------------

    buildLesson(width, height) {
        let round = this.registry.get(ROUND_KEY);
        if (!round || round.lesson !== this.lesson.id) {
            round = { lesson: this.lesson.id, tasks: makeRound(this.lesson.id), index: 0 };
            this.registry.set(ROUND_KEY, round);
        }
        this.round = round;
        this.task = round.tasks[round.index];
        this.width = width;
        this.height = height;

        const title = PixelUI.addTitle(this, Math.round(width / 2), S(20), this.lesson.title);
        this.speech = this.lesson.say;
        PixelUI.createIconButton(this, Math.round(width / 2 + title.width / 2 + S(18)), S(20), S(22),
            (g, size) => Icons.speaker(g, 0, 0, size), () => say(this.speech));

        this.stars = this.add.graphics();
        this.drawProgress();

        const build = {
            rozsypanka: () => this.buildSentence(),
            zagadki: () => this.buildRiddle(),
            rebusy: () => this.buildRebus(),
            wykreslanka: () => this.buildWordSearch()
        }[this.lesson.id];
        build();
    }

    // One star per task at the bottom, gold once done.
    drawProgress(done = this.round.index) {
        const n = this.round.tasks.length;
        const r = S(8);
        const gap = S(22);
        const y = Math.round((FLOOR_Y + this.height) / 2);
        this.stars.clear();
        for (let i = 0; i < n; i++) {
            const x = Math.round(this.width / 2 + (i - (n - 1) / 2) * gap);
            Icons.star(this.stars, x, y, r, i < done ? ICON_COLORS.goldDark : ICON_COLORS.white);
        }
    }

    // A word tile at (x, y); `paint(color)` recolours it.
    makeTile(x, y, label, { fontSize = S(14), minW = S(22), h = S(26), fill = ICON_COLORS.white } = {}) {
        const text = PixelUI.addText(this, 0, 1, label, textStyle(fontSize, { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);
        const w = Math.max(minW, Math.round(text.width) + S(12));
        const bg = this.add.graphics();
        const tile = this.add.container(x, y, [bg, text]);
        tile.setSize(w, h);
        tile.tileW = w;
        tile.label = label;
        tile.text = text;
        tile.paint = (color) => {
            bg.clear();
            PixelUI.drawBox(bg, -w / 2, -h / 2, w, h, color, PALETTE.buttonBorder, color === ICON_COLORS.white ? 0xffffff : undefined);
        };
        tile.paint(fill);
        return tile;
    }

    // An empty place for a tile.
    drawSlot(g, x, y, w, h) {
        PixelUI.drawBox(g, Math.round(x - w / 2), Math.round(y - h / 2), w, h, SCHOOL_COLORS.slot, ICON_COLORS.lavenderDark);
    }

    wiggle(target) {
        if (target.wiggling) {
            return;
        }
        target.wiggling = true;
        playStep(this);
        const x = target.x;
        this.tweens.add({
            targets: target,
            x: x + S(3),
            duration: 60,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                target.x = x;
                target.wiggling = false;
            }
        });
    }

    // Tiles to tap in order into their slots: the shared part of sentences and rebuses.
    // `answer` is the labels in the right order; `extra` are tiles that fit nowhere.
    // Calls done() once all are in place.
    orderTiles(answer, extra, { slotY, tileY, fontSize, gap, rowH, onTile, done }) {
        const maxW = this.width - S(40);
        const all = [...answer, ...extra];
        // Made before the tiles so the slots lie under them.
        const g = this.add.graphics();
        const tiles = all.map((label) => this.makeTile(0, 0, label, { fontSize }));
        const slots = flow(answer.map((_, i) => tiles[i].tileW), this.width / 2, slotY, maxW, gap, rowH);
        slots.forEach((p, i) => this.drawSlot(g, p.x, p.y, tiles[i].tileW, S(26)));

        // Shuffled below, never already in the right order.
        let order = shuffle(all.map((_, i) => i));
        while (all.length > 1 && order.every((i, k) => i === k)) {
            order = shuffle(order);
        }
        const spots = flow(order.map((i) => tiles[i].tileW), this.width / 2, tileY, maxW, gap, rowH);
        order.forEach((i, k) => tiles[i].setPosition(spots[k].x, spots[k].y));

        let next = 0;
        tiles.forEach((tile) => {
            tile.setInteractive({ useHandCursor: true });
            tile.on('pointerup', () => {
                if (this.busy || tile.placed) {
                    return;
                }
                if (tile.label !== answer[next]) {
                    this.wiggle(tile);
                    return;
                }
                tile.placed = true;
                tile.disableInteractive();
                playPlop(this);
                tile.paint(SCHOOL_COLORS.done);
                this.tweens.add({ targets: tile, x: slots[next].x, y: slots[next].y, duration: 220, ease: 'Sine.easeOut' });
                if (onTile) {
                    onTile(tile);
                }
                next++;
                if (next === answer.length) {
                    this.busy = true;
                    tiles.filter((t) => !t.placed).forEach((t) => this.tweens.add({ targets: t, alpha: 0, duration: 300 }));
                    this.time.delayedCall(300, done);
                }
            });
        });
    }

    // Rozsypanka: the words of a sentence, shuffled, tapped in order.
    buildSentence() {
        const sentence = this.task.sentence;
        this.orderTiles(sentence.split(' '), [], {
            slotY: S(90), tileY: S(186), fontSize: S(14), gap: S(8), rowH: S(36),
            done: () => {
                say(sentence);
                this.taskDone(this.width / 2, S(90));
            }
        });
    }

    // Zagadki: the riddle, three pictures to choose from, then the tricky letters.
    buildRiddle() {
        const task = this.task;
        const { width } = this;
        this.speech = task.text.replace(/\n/g, ' ');
        // The first riddle comes after the lesson's instruction.
        say(this.speech, { after: this.round.index === 0 });
        this.chosen = false;

        const g = this.add.graphics();
        const panelW = width - S(100);
        PixelUI.drawBox(g, Math.round((width - panelW) / 2), S(36), panelW, S(52), ICON_COLORS.cream, PALETTE.buttonBorder);
        PixelUI.addText(this, width / 2, S(62), task.text,
            { ...textStyle(S(13), { bold: true, color: TEXT_COLORS.button }), align: 'center' }).setOrigin(0.5);

        const card = S(60);
        const gap = S(16);
        const y = S(124);
        const cards = task.options.map((id, i) => {
            const x = Math.round(width / 2 + (i - 1) * (card + gap));
            const bg = this.add.graphics();
            PixelUI.drawBox(bg, -card / 2, -card / 2, card, card, ICON_COLORS.white, PALETTE.buttonBorder, 0xffffff);
            const pic = this.add.image(0, 0, pictureTexture(this, id)).setScale(Math.floor((card - S(10)) / PICTURE_SIZE));
            const c = this.add.container(x, y, [bg, pic]).setSize(card, card).setInteractive({ useHandCursor: true });
            c.on('pointerup', () => {
                if (this.busy || this.chosen) {
                    return;
                }
                if (id !== task.pic) {
                    say(PICTURES[id].word);
                    this.wiggle(c);
                    return;
                }
                this.chosen = true;
                playDing(this);
                bg.clear();
                PixelUI.drawBox(bg, -card / 2, -card / 2, card, card, SCHOOL_COLORS.done, PALETTE.buttonBorder);
                cards.filter((other) => other !== c).forEach((other) => this.tweens.add({ targets: other, alpha: 0.35, duration: 250 }));
                floatHeart(this, x, y - card / 2);
                this.spellWord(PICTURES[id].word, S(176));
            });
            return c;
        });
    }

    // The word with its tricky letters left out; for each, two tiles to choose from.
    spellWord(word, y) {
        const traps = trapsIn(word);
        const parts = [];
        let i = 0;
        traps.forEach((t) => {
            [...word.slice(i, t.at)].forEach((ch) => parts.push({ text: ch }));
            parts.push({ text: t.text, trap: t });
            i = t.at + t.text.length;
        });
        [...word.slice(i)].forEach((ch) => parts.push({ text: ch }));

        const box = S(24);
        const widths = parts.map((p) => (p.trap ? box + (p.text.length - 1) * S(10) : S(12)));
        const at = flow(widths, this.width / 2, y, this.width, S(2), S(30));
        const g = this.add.graphics();
        const blanks = [];
        parts.forEach((p, k) => {
            if (p.trap) {
                this.drawSlot(g, at[k].x, at[k].y, widths[k], box + S(4));
                blanks.push({ ...p, x: at[k].x, w: widths[k] });
            } else {
                PixelUI.addText(this, at[k].x, at[k].y, p.text, textStyle(S(18), { bold: true, color: TEXT_COLORS.title })).setOrigin(0.5);
            }
        });

        const finish = () => {
            say(word);
            this.taskDone(this.width / 2, y);
        };
        if (!blanks.length) {
            this.time.delayedCall(500, finish);
            return;
        }
        this.speech = 'Uzupełnij brakujące literki.';
        say(`${word}. Uzupełnij brakujące literki.`);

        let next = 0;
        let choices = [];
        const offer = () => {
            choices.forEach((c) => c.destroy());
            const blank = blanks[next];
            const labels = shuffle([blank.text, blank.trap.other]);
            choices = labels.map((label, k) => {
                const tile = this.makeTile(Math.round(this.width / 2 + (k - 0.5) * S(60)), y + S(40), label,
                    { fontSize: S(18), minW: S(44), h: S(32) });
                tile.setInteractive({ useHandCursor: true });
                tile.on('pointerup', () => {
                    if (this.busy) {
                        return;
                    }
                    if (label !== blank.text) {
                        this.wiggle(tile);
                        return;
                    }
                    playPlop(this);
                    const filled = this.makeTile(blank.x, y, label, { fontSize: S(18), minW: blank.w, h: box + S(4), fill: SCHOOL_COLORS.done });
                    filled.setScale(0.5);
                    this.tweens.add({ targets: filled, scale: 1, duration: 200, ease: 'Back.easeOut' });
                    next++;
                    if (next === blanks.length) {
                        choices.forEach((c) => c.destroy());
                        choices = [];
                        this.busy = true;
                        this.time.delayedCall(300, finish);
                    } else {
                        offer();
                    }
                });
                return tile;
            });
        };
        offer();
    }

    // Rebusy: text and pictures in a row, then the answer from letter tiles (with a wrong
    // letter or two among them, like u next to ó).
    buildRebus() {
        const task = this.task;
        const { width } = this;
        const card = S(64);
        const gap = S(8);
        const y = S(90);

        // Parts with a "+" between them.
        const items = [];
        task.parts.forEach((part, i) => {
            if (i > 0) {
                items.push({ text: '+' });
            }
            items.push(typeof part === 'string' ? { text: part } : { part });
        });
        const measure = (item) => {
            if (item.part) {
                return card;
            }
            const t = PixelUI.addText(this, 0, 0, item.text, textStyle(S(24), { bold: true }));
            const w = Math.round(t.width) + S(4);
            t.destroy();
            return w;
        };
        const widths = items.map(measure);
        const total = widths.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
        let x = Math.round((width - total) / 2);
        const g = this.add.graphics();
        items.forEach((item, i) => {
            const cx = Math.round(x + widths[i] / 2);
            x += widths[i] + gap;
            if (!item.part) {
                PixelUI.addText(this, cx, y, item.text, textStyle(S(24), { bold: true, color: TEXT_COLORS.title })).setOrigin(0.5);
                return;
            }
            const { pic, drop, swap } = item.part;
            PixelUI.drawBox(g, cx - card / 2, y - card / 2, card, card, ICON_COLORS.white, PALETTE.buttonBorder, 0xffffff);
            const image = this.add.image(cx, y, pictureTexture(this, pic)).setScale(Math.floor((card - S(10)) / PICTURE_SIZE));
            image.setInteractive({ useHandCursor: true }).on('pointerup', () => say(PICTURES[pic].word));
            if (drop) {
                // Crossed out above the picture's left corner.
                const t = PixelUI.addText(this, cx - card / 2 + S(4), y - card / 2 - S(1), drop,
                    textStyle(S(20), { bold: true, color: TEXT_COLORS.title })).setOrigin(0, 1);
                const cross = this.add.graphics();
                cross.fillStyle(0xe2607f, 1);
                Icons.fillPolygon(cross, [
                    { x: t.x - S(2), y: t.y - S(4) }, { x: t.x + t.width + S(2), y: t.y - t.height + S(5) },
                    { x: t.x + t.width + S(2), y: t.y - t.height + S(7) }, { x: t.x - S(2), y: t.y - S(2) }
                ]);
            }
            if (swap) {
                PixelUI.addText(this, cx, y + card / 2 + S(11), `${swap[0]} = ${swap[1]}`,
                    textStyle(S(15), { bold: true, color: TEXT_COLORS.title })).setOrigin(0.5);
            }
        });

        const answer = rebusAnswer(task);
        const extra = [...new Set(trapsIn(answer).map((t) => t.other))];
        this.orderTiles([...answer], extra, {
            slotY: S(170), tileY: S(214), fontSize: S(18), gap: S(6), rowH: S(34),
            done: () => {
                say(answer);
                this.taskDone(width / 2, S(170));
            }
        });
    }

    // Wykreślanka: a grid of letters; a finger dragged across or down a hidden word marks
    // it, and it appears in the list on the right.
    buildWordSearch() {
        const { grid, words } = this.task;
        const { cols, rows } = SEARCH_SIZE;
        const cell = S(22);
        const left = S(20);
        const top = S(40);
        const g = this.add.graphics();
        PixelUI.drawBox(g, left - S(4), top - S(4), cols * cell + S(8), rows * cell + S(8), ICON_COLORS.white, PALETTE.buttonBorder);
        const marks = this.add.graphics();
        const selection = this.add.graphics();
        const lines = this.add.graphics();
        lines.fillStyle(ICON_COLORS.lavender, 1);
        for (let i = 1; i < cols; i++) {
            lines.fillRect(left + i * cell, top, 1, rows * cell);
        }
        for (let i = 1; i < rows; i++) {
            lines.fillRect(left, top + i * cell, cols * cell, 1);
        }
        grid.forEach((row, y) => row.forEach((ch, x) => {
            PixelUI.addText(this, left + x * cell + cell / 2, top + y * cell + cell / 2 + 1, ch,
                textStyle(S(14), { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);
        }));

        // The list: one row per word, empty until found.
        const listX = left + cols * cell + S(18);
        const listW = this.width - listX - S(12);
        const rowGap = S(30);
        const listTop = top + Math.round((rows * cell - rowGap * (words.length - 1)) / 2);
        const listG = this.add.graphics();
        words.forEach((_, i) => this.drawSlot(listG, listX + listW / 2, listTop + i * rowGap, listW, S(24)));

        const strip = (gfx, a, b, color) => {
            const x1 = Math.min(a.x, b.x);
            const y1 = Math.min(a.y, b.y);
            const x2 = Math.max(a.x, b.x);
            const y2 = Math.max(a.y, b.y);
            gfx.fillStyle(color, 1);
            gfx.fillRect(left + x1 * cell + 2, top + y1 * cell + 2, (x2 - x1 + 1) * cell - 3, (y2 - y1 + 1) * cell - 3);
        };
        const cellAt = (pointer) => {
            const p = pointer.positionToCamera(this.cameras.main);
            const x = Math.floor((p.x - left) / cell);
            const y = Math.floor((p.y - top) / cell);
            return x >= 0 && y >= 0 && x < cols && y < rows ? { x, y } : null;
        };
        // The end cell kept on the start's row or column, whichever the finger is nearer.
        const straight = (from, to) => (Math.abs(to.x - from.x) >= Math.abs(to.y - from.y)
            ? { x: to.x, y: from.y } : { x: from.x, y: to.y });

        let start = null;
        let end = null;
        const found = new Set();
        this.input.on('pointerdown', (pointer) => {
            start = this.busy ? null : cellAt(pointer);
            end = start;
            selection.clear();
            if (start) {
                strip(selection, start, end, ICON_COLORS.lavenderDark);
                selection.setAlpha(0.6);
            }
        });
        this.input.on('pointermove', (pointer) => {
            const at = start && pointer.isDown && cellAt(pointer);
            if (at) {
                end = straight(start, at);
                selection.clear();
                strip(selection, start, end, ICON_COLORS.lavenderDark);
            }
        });
        this.input.on('pointerup', () => {
            if (!start) {
                return;
            }
            selection.clear();
            const a = start;
            const b = end;
            start = null;
            if (a.x === b.x && a.y === b.y) {
                return;
            }
            const index = words.findIndex((w) => {
                const last = { x: w.x + (w.down ? 0 : w.word.length - 1), y: w.y + (w.down ? w.word.length - 1 : 0) };
                return (a.x === w.x && a.y === w.y && b.x === last.x && b.y === last.y)
                    || (b.x === w.x && b.y === w.y && a.x === last.x && a.y === last.y);
            });
            if (index < 0 || found.has(index)) {
                playStep(this);
                return;
            }
            const color = SCHOOL_COLORS.found[found.size % SCHOOL_COLORS.found.length];
            strip(marks, a, b, color);
            const row = listTop + found.size * rowGap;
            found.add(index);
            const word = words[index].word;
            listG.fillStyle(color, 1);
            listG.fillRect(listX + 2, row - S(12) + 2, listW - 4, S(24) - 4);
            PixelUI.addText(this, listX + listW / 2, row, word, textStyle(S(14), { bold: true, color: TEXT_COLORS.button })).setOrigin(0.5);
            playDing(this);
            say(word);
            floatHeart(this, left + ((a.x + b.x) / 2 + 0.5) * cell, top + ((a.y + b.y) / 2) * cell);
            if (found.size === words.length) {
                this.time.delayedCall(800, () => this.taskDone(this.width / 2, S(120)));
            }
        });
    }

    // A task is done: hearts, its star turns gold, then the next task or the end.
    taskDone(x, y) {
        this.busy = true;
        playSparkle(this);
        [-S(30), 0, S(30)].forEach((dx, i) => floatHeart(this, x + dx, y, { delay: i * 120 }));
        this.drawProgress(this.round.index + 1);
        this.time.delayedCall(1900, () => {
            this.round.index++;
            if (this.round.index < this.round.tasks.length) {
                this.scene.restart({ resized: true });
            } else {
                this.finishRound();
            }
        });
    }

    // The whole round is done: a big star, and the desk keeps one.
    finishRound() {
        playFanfare(this);
        // After the fanfare: speaking pauses the game's sounds.
        this.time.delayedCall(500, () => say('Brawo!'));
        const stars = loadStars();
        stars[this.lesson.id] = (stars[this.lesson.id] || 0) + 1;
        saveStars(stars);

        const g = this.add.graphics();
        Icons.star(g, 0, 0, S(40), ICON_COLORS.goldDark);
        const star = this.add.container(this.width / 2, this.height / 2 - S(10), [g]).setDepth(50).setScale(0);
        this.tweens.add({ targets: star, scale: 1, duration: 500, ease: 'Back.easeOut' });
        for (let i = 0; i < 6; i++) {
            floatHeart(this, this.width / 2 + Phaser.Math.Between(-S(60), S(60)), this.height / 2, { delay: i * 150, depth: 60 });
        }
        this.time.delayedCall(2400, () => this.backToClassroom());
    }

    // From a lesson back to the classroom; from the classroom to the map, in front of
    // the school.
    goBack() {
        if (this.lesson) {
            this.backToClassroom();
            return;
        }
        this.registry.set('mapLocation', 'school');
        super.goBack();
    }
}

