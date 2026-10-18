// Pixel-art icons drawn straight into a Graphics object, centred on (cx, cy).
// Sizes are in game pixels; callers pass S()-scaled values.

import { PALETTE, PixelUI } from '../ui/pixel.js';
import { SEED_PIXELS, SEED_COLORS } from './hamster.js';
import { getCake } from '../data/characters.js';

export const ICON_COLORS = {
    mint: 0xbfe8d6,
    mintDark: 0xa6dcc4,
    peach: 0xffe1c4,
    pink: 0xf7b2cc,
    pinkDark: 0xf59bbd,
    lavender: 0xd9ccf5,
    lavenderDark: 0xc3b3ea,
    sky: 0xcfe8ff,
    white: 0xffffff,
    cream: 0xfff7fb,
    gold: 0xfff1c9,
    goldDark: 0xf6d98b,
    plaster: 0xffd6b8,
    plasterPad: 0xfff1e0
};

export const Icons = {
    // Fills every pixel whose centre lies inside the polygon, so edges stay on the grid.
    fillPolygon(g, points) {
        const poly = new Phaser.Geom.Polygon(points);
        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
            for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++) {
                if (Phaser.Geom.Polygon.Contains(poly, x + 0.5, y + 0.5)) {
                    g.fillRect(x, y, 1, 1);
                }
            }
        }
    },

    // Folded three-panel map with a dotted route and a heart as the destination.
    map(g, cx, cy, size) {
        const w = Math.round(size / 3);
        const h = Math.round(size * 0.75);
        const left = Math.round(cx - w * 1.5);
        const top = Math.round(cy - h / 2);
        const fills = [ICON_COLORS.mint, ICON_COLORS.peach, ICON_COLORS.mint];

        fills.forEach((fill, i) => {
            const x = left + i * w;
            const y = top + (i === 1 ? 2 : 0);
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(x, y, w + 1, h);
            g.fillStyle(fill, 1);
            g.fillRect(x + 1, y + 1, w - 1, h - 2);
        });

        g.fillStyle(ICON_COLORS.pinkDark, 1);
        const steps = 5;
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            g.fillRect(Math.round(left + 3 + t * (w * 2.2)), Math.round(top + h - 5 - t * (h - 12)), 2, 2);
        }
        Icons.heart(g, left + Math.round(w * 2.5), top + Math.round(h * 0.28), Math.max(5, Math.round(size / 6)));
    },

    // Small pixel heart, roughly `size` pixels wide.
    heart(g, cx, cy, size) {
        const s = Math.max(1, Math.round(size / 7));
        const rows = ['.PP.PP.', 'PPPPPPP', 'PPPPPPP', '.PPPPP.', '..PPP..', '...P...'];
        g.fillStyle(ICON_COLORS.pinkDark, 1);
        rows.forEach((row, y) => {
            [...row].forEach((ch, x) => {
                if (ch === 'P') {
                    g.fillRect(Math.round(cx - 3.5 * s) + x * s, Math.round(cy - 3 * s) + y * s, s, s);
                }
            });
        });
    },

    // Little house with a pink roof: "home" on the map and on buttons.
    house(g, cx, cy, size) {
        const w = Math.round(size * 0.7);
        const wallH = Math.round(size * 0.42);
        const roofH = Math.round(size * 0.4);
        const left = Math.round(cx - w / 2);
        const wallTop = Math.round(cy - size / 2 + roofH);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, wallTop, w + 2, wallH + 1);
        g.fillStyle(ICON_COLORS.peach, 1);
        g.fillRect(left, wallTop, w, wallH);

        for (let r = 0; r < roofH; r++) {
            const half = Math.round(((r + 1) / roofH) * (w / 2 + 3));
            g.fillStyle(r === 0 || r === roofH - 1 ? PALETTE.outline : ICON_COLORS.pink, 1);
            g.fillRect(Math.round(cx - half), wallTop - roofH + r, half * 2, 1);
        }

        const doorW = Math.max(3, Math.round(w / 4));
        const doorH = Math.round(wallH * 0.6);
        g.fillStyle(ICON_COLORS.lavenderDark, 1);
        g.fillRect(Math.round(cx - doorW / 2), wallTop + wallH - doorH, doorW, doorH);
        g.fillStyle(ICON_COLORS.sky, 1);
        const win = Math.max(2, Math.round(w / 6));
        g.fillRect(left + 2, wallTop + 2, win, win);
        g.fillRect(left + w - 2 - win, wallTop + 2, win, win);
    },

    // Plus-shaped cross; arm thickness is a third of the size.
    cross(g, cx, cy, size, color = ICON_COLORS.pinkDark) {
        const arm = Math.max(2, Math.round(size / 3));
        g.fillStyle(color, 1);
        g.fillRect(Math.round(cx - arm / 2), Math.round(cy - size / 2), arm, size);
        g.fillRect(Math.round(cx - size / 2), Math.round(cy - arm / 2), size, arm);
    },

    // Hospital building; (cx, bottom) is the middle of its base.
    hospital(g, cx, bottom, w, h) {
        const left = Math.round(cx - w / 2);
        const top = bottom - h;
        const roofH = Math.round(h * 0.16);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, top - 1, w + 2, h + 1);
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(left, top, w, h);
        g.fillStyle(ICON_COLORS.lavender, 1);
        g.fillRect(left, top, w, roofH);
        g.fillStyle(ICON_COLORS.lavenderDark, 1);
        g.fillRect(left, top + roofH - 1, w, 1);

        // Sign with a big cross.
        const sign = Math.round(Math.min(w, h) * 0.38);
        const signTop = top + roofH + 3;
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(Math.round(cx - sign / 2) - 1, signTop - 1, sign + 2, sign + 2);
        g.fillStyle(ICON_COLORS.cream, 1);
        g.fillRect(Math.round(cx - sign / 2), signTop, sign, sign);
        Icons.cross(g, cx, signTop + sign / 2, Math.round(sign * 0.75));

        // Windows and door.
        const win = Math.max(3, Math.round(w * 0.12));
        const winY = signTop + Math.round(sign / 2) - Math.round(win / 2);
        g.fillStyle(ICON_COLORS.sky, 1);
        g.fillRect(left + 3, winY, win, win);
        g.fillRect(left + w - 3 - win, winY, win, win);

        const doorW = Math.round(w * 0.24);
        const doorH = Math.round(h * 0.3);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(Math.round(cx - doorW / 2) - 1, bottom - doorH - 1, doorW + 2, doorH + 1);
        g.fillStyle(ICON_COLORS.sky, 1);
        g.fillRect(Math.round(cx - doorW / 2), bottom - doorH, doorW, doorH);
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(Math.round(cx), bottom - doorH, 1, doorH);
    },

    // Puffy cloud; (cx, cy) is its middle.
    cloud(g, cx, cy, w, h) {
        const blobs = [
            { x: -0.28, y: 0.12, r: 0.32 },
            { x: 0.02, y: -0.08, r: 0.42 },
            { x: 0.3, y: 0.1, r: 0.32 }
        ];
        [[PALETTE.outline, 1], [ICON_COLORS.white, 0]].forEach(([color, grow]) => {
            g.fillStyle(color, 1);
            blobs.forEach((b) => PixelUI.fillCircle(g, Math.round(cx + b.x * w), Math.round(cy + b.y * h), Math.round(b.r * h) + grow));
            g.fillRect(Math.round(cx - w * 0.42) - grow, Math.round(cy + h * 0.12), Math.round(w * 0.84) + grow * 2, Math.round(h * 0.3) + grow);
        });
        g.fillStyle(PALETTE.cloudShade, 1);
        g.fillRect(Math.round(cx - w * 0.42), Math.round(cy + h * 0.36), Math.round(w * 0.84), 2);
    },

    // Upright thermometer; level 0..1 is how high the pink column has risen.
    thermometer(g, cx, cy, size, level = 0.25) {
        const tubeW = Math.max(4, Math.round(size / 5));
        const bulbR = Math.round(tubeW * 0.9);
        const tubeH = size - bulbR * 2;
        const top = Math.round(cy - size / 2);
        const left = Math.round(cx - tubeW / 2);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, top - 1, tubeW + 2, tubeH + 2);
        PixelUI.fillCircle(g, cx, top + tubeH + bulbR - 1, bulbR + 1);
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(left, top, tubeW, tubeH);
        g.fillStyle(ICON_COLORS.pinkDark, 1);
        PixelUI.fillCircle(g, cx, top + tubeH + bulbR - 1, bulbR);
        const colH = Math.round((tubeH - 2) * level);
        g.fillRect(Math.round(cx - tubeW / 4), top + tubeH - colH, Math.max(2, Math.round(tubeW / 2)), colH + 1);

        // Scale marks.
        g.fillStyle(ICON_COLORS.lavenderDark, 1);
        for (let i = 1; i < 4; i++) {
            g.fillRect(left + tubeW - 2, top + Math.round((tubeH * i) / 4), 2, 1);
        }
    },

    // Spoon lying sideways with pink syrup in the bowl (bowl on the left).
    spoon(g, cx, cy, size, full = true) {
        const bowlR = Math.round(size * 0.22);
        const bowlX = Math.round(cx - size / 2 + bowlR + 1);
        const handleH = Math.max(3, Math.round(size / 9));

        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, bowlX, cy, bowlR + 1);
        g.fillRect(bowlX, Math.round(cy - handleH / 2) - 1, Math.round(size - bowlR - 2), handleH + 2);
        g.fillStyle(ICON_COLORS.lavender, 1);
        PixelUI.fillCircle(g, bowlX, cy, bowlR);
        g.fillRect(bowlX + bowlR, Math.round(cy - handleH / 2), Math.round(size - bowlR * 2 - 3), handleH);
        if (full) {
            g.fillStyle(ICON_COLORS.pinkDark, 1);
            PixelUI.fillCircle(g, bowlX, cy, Math.max(1, bowlR - 2));
            g.fillStyle(ICON_COLORS.white, 1);
            g.fillRect(bowlX - Math.round(bowlR / 3), Math.round(cy - bowlR / 3), 1, 1);
        }
    },

    // Sticking plaster, `w` wide.
    plaster(g, cx, cy, w) {
        const h = Math.round(w * 0.42);
        const left = Math.round(cx - w / 2);
        const top = Math.round(cy - h / 2);
        PixelUI.drawBox(g, left, top, w, h, ICON_COLORS.plaster, PALETTE.outline);
        const pad = Math.round(w * 0.34);
        g.fillStyle(ICON_COLORS.plasterPad, 1);
        g.fillRect(Math.round(cx - pad / 2), top + 2, pad, h - 4);
        g.fillStyle(ICON_COLORS.pink, 1);
        for (let i = 0; i < 3; i++) {
            g.fillRect(left + 3 + i * 2, top + Math.round(h / 2) - 1 + (i % 2), 1, 1);
            g.fillRect(left + w - 4 - i * 2, top + Math.round(h / 2) - 1 + (i % 2), 1, 1);
        }
    },

    // Five-pointed star sticker.
    star(g, cx, cy, r, color = ICON_COLORS.gold, outline = PALETTE.outline) {
        const points = (radius) => {
            const pts = [];
            for (let i = 0; i < 10; i++) {
                const a = -Math.PI / 2 + (i * Math.PI) / 5;
                const rr = i % 2 === 0 ? radius : radius * 0.48;
                pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
            }
            return pts;
        };
        g.fillStyle(outline, 1);
        Icons.fillPolygon(g, points(r + 1.5));
        g.fillStyle(color, 1);
        Icons.fillPolygon(g, points(r));
    },

    // Crescent moon with a small star: "rest / sleep".
    moon(g, cx, cy, size) {
        const r = Math.round(size * 0.38);
        const cut = { x: Math.round(r * 0.6), y: -Math.round(r * 0.35), r: Math.round(r * 0.85) };
        const inside = (dx, dy, rr) => dx * dx + dy * dy <= rr * rr;

        for (let dy = -r - 1; dy <= r + 1; dy++) {
            for (let dx = -r - 1; dx <= r + 1; dx++) {
                const inMoon = inside(dx, dy, r) && !inside(dx - cut.x, dy - cut.y, cut.r);
                const inEdge = inside(dx, dy, r + 1) && !inside(dx - cut.x, dy - cut.y, cut.r - 1);
                if (inMoon) {
                    g.fillStyle(ICON_COLORS.gold, 1);
                } else if (inEdge) {
                    g.fillStyle(PALETTE.outline, 1);
                } else {
                    continue;
                }
                g.fillRect(cx - Math.round(size * 0.08) + dx, cy + dy, 1, 1);
            }
        }

        // Twinkle star top right.
        const sx = Math.round(cx + size * 0.32);
        const sy = Math.round(cy - size * 0.28);
        g.fillStyle(ICON_COLORS.goldDark, 1);
        g.fillRect(sx, sy - 2, 1, 5);
        g.fillRect(sx - 2, sy, 5, 1);
    },

    // Music note; crossed out when the music is off.
    note(g, cx, cy, size, on = true) {
        const headR = Math.max(2, Math.round(size * 0.16));
        const stemH = Math.round(size * 0.6);
        const headX = Math.round(cx - size * 0.12);
        const headY = Math.round(cy + size * 0.22);
        const stemX = headX + headR - 1;
        const stemTop = headY - stemH;
        const thick = Math.max(2, Math.round(size / 12));

        g.fillStyle(PALETTE.buttonBorder, 1);
        PixelUI.fillCircle(g, headX, headY, headR);
        g.fillRect(stemX, stemTop, thick, stemH);
        // Flag.
        for (let i = 0; i < Math.round(size * 0.25); i++) {
            g.fillRect(stemX + thick + Math.round(i * 0.6), stemTop + i, thick, 1);
        }

        if (!on) {
            // Thick dark slash so "off" is obvious at a glance.
            const half = Math.round(size * 0.45);
            const slash = Math.max(3, Math.round(size / 7));
            g.fillStyle(ICON_COLORS.white, 1);
            for (let i = -half; i <= half; i++) {
                g.fillRect(cx + i - 1, cy - i - 1, slash + 2, slash + 2);
            }
            g.fillStyle(PALETTE.buttonBorder, 1);
            for (let i = -half; i <= half; i++) {
                g.fillRect(cx + i, cy - i, slash, slash);
            }
        }
    },

    // Cog wheel: "settings". Eight teeth around a ring with a hole.
    gear(g, cx, cy, size, color = PALETTE.buttonBorder) {
        const r = size * 0.32;
        const tooth = size * 0.48;
        g.fillStyle(color, 1);
        for (let dy = -Math.ceil(tooth); dy <= Math.ceil(tooth); dy++) {
            for (let dx = -Math.ceil(tooth); dx <= Math.ceil(tooth); dx++) {
                const d = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                // Teeth: the outer edge is pushed out in 8 places.
                const onTooth = Math.cos(angle * 8) > 0.35;
                if ((d <= r || (onTooth && d <= tooth)) && d > size * 0.13) {
                    g.fillRect(cx + dx, cy + dy, 1, 1);
                }
            }
        }
    },

    // Square box, ticked or empty, for a setting that can be on or off.
    checkbox(g, cx, cy, size, checked) {
        const left = Math.round(cx - size / 2);
        const top = Math.round(cy - size / 2);
        PixelUI.drawBox(g, left, top, size, size, ICON_COLORS.white, PALETTE.buttonBorder);
        if (checked) {
            const t = Math.max(2, Math.round(size / 8));
            g.fillStyle(PALETTE.buttonBorder, 1);
            // Short stroke down to the right, then a long one up to the right.
            for (let i = 0; i < Math.round(size * 0.22); i++) {
                g.fillRect(left + Math.round(size * 0.22) + i, top + Math.round(size * 0.48) + i, t, t);
            }
            for (let i = 0; i < Math.round(size * 0.4); i++) {
                g.fillRect(left + Math.round(size * 0.42) + i, top + Math.round(size * 0.68) - i, t, t);
            }
        }
    },

    // Zig-zag lightning bolt: "full of energy".
    lightning(g, cx, cy, size) {
        const s = size / 10;
        const pts = (grow) => [
            { x: cx + 1 * s, y: cy - 5 * s - grow },
            { x: cx - 3 * s - grow, y: cy + 1 * s },
            { x: cx - 0.2 * s, y: cy + 1 * s },
            { x: cx - 1 * s, y: cy + 5 * s + grow },
            { x: cx + 3 * s + grow, y: cy - 1 * s },
            { x: cx + 0.2 * s, y: cy - 1 * s }
        ];
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillPolygon(g, pts(1));
        g.fillStyle(ICON_COLORS.goldDark, 1);
        Icons.fillPolygon(g, pts(0));
    },

    // Three soap bubbles of different sizes: "loves baths".
    bubbles(g, cx, cy, size) {
        [[-0.18, 0.12, 0.26], [0.22, -0.12, 0.2], [0.12, 0.3, 0.13]].forEach(([fx, fy, fr]) => {
            const x = Math.round(cx + fx * size);
            const y = Math.round(cy + fy * size);
            const r = Math.max(2, Math.round(fr * size));
            g.fillStyle(PALETTE.outline, 1);
            PixelUI.fillCircle(g, x, y, r + 1);
            g.fillStyle(ICON_COLORS.sky, 1);
            PixelUI.fillCircle(g, x, y, r);
            g.fillStyle(ICON_COLORS.white, 1);
            g.fillRect(x - Math.ceil(r / 2), y - Math.ceil(r / 2), Math.max(1, Math.round(r / 3)), Math.max(1, Math.round(r / 3)));
        });
    },

    // Little flower on a stem: the visitor's gift.
    flower(g, cx, cy, size) {
        const petalR = Math.max(2, Math.round(size * 0.16));
        const ring = Math.round(size * 0.2);
        const headY = Math.round(cy - size * 0.18);

        g.fillStyle(0x9fd6b8, 1);
        g.fillRect(cx, headY, 2, Math.round(size * 0.62));
        g.fillRect(cx + 2, Math.round(cy + size * 0.12), Math.round(size * 0.16), 2);

        const petals = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        g.fillStyle(PALETTE.outline, 1);
        petals.forEach(([dx, dy]) => PixelUI.fillCircle(g, cx + dx * ring, headY + dy * ring, petalR + 1));
        g.fillStyle(ICON_COLORS.pink, 1);
        petals.forEach(([dx, dy]) => PixelUI.fillCircle(g, cx + dx * ring, headY + dy * ring, petalR));
        g.fillStyle(ICON_COLORS.goldDark, 1);
        PixelUI.fillCircle(g, cx, headY, Math.max(1, petalR - 1));
    },

    // Filled ellipse made of 1px rows.
    fillEllipse(g, cx, cy, rx, ry) {
        for (let dy = -ry; dy <= ry; dy++) {
            const dx = Math.round(rx * Math.sqrt(1 - (dy * dy) / (ry * ry)));
            g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
        }
    },

    // --- Kitchen ----------------------------------------------------------------

    // Flour sack tied at the top, with a little wheat ear.
    flour(g, cx, cy, size) {
        const w = Math.round(size * 0.62);
        const h = Math.round(size * 0.66);
        const left = Math.round(cx - w / 2);
        const top = Math.round(cy - h / 2 + size * 0.1);
        PixelUI.drawBox(g, left, top, w, h, ICON_COLORS.cream, PALETTE.outline);
        // Gathered neck.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(Math.round(cx - w * 0.25) - 1, top - Math.round(size * 0.14), Math.round(w * 0.5) + 2, Math.round(size * 0.16));
        g.fillStyle(ICON_COLORS.cream, 1);
        g.fillRect(Math.round(cx - w * 0.25), top - Math.round(size * 0.14) + 1, Math.round(w * 0.5), Math.round(size * 0.16) - 1);
        g.fillStyle(ICON_COLORS.pinkDark, 1);
        g.fillRect(Math.round(cx - w * 0.3), top - 1, Math.round(w * 0.6), 2);
        // Wheat.
        g.fillStyle(ICON_COLORS.goldDark, 1);
        g.fillRect(cx, top + Math.round(h * 0.25), 1, Math.round(h * 0.55));
        for (let i = 0; i < 3; i++) {
            const y = top + Math.round(h * 0.28) + i * 3;
            g.fillRect(cx - 2, y, 2, 2);
            g.fillRect(cx + 1, y, 2, 2);
        }
    },

    egg(g, cx, cy, size) {
        const rx = Math.round(size * 0.28);
        const ry = Math.round(size * 0.38);
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillEllipse(g, cx, cy, rx + 1, ry + 1);
        g.fillStyle(0xfff7e8, 1);
        Icons.fillEllipse(g, cx, cy, rx, ry);
        // Narrower top.
        g.fillStyle(0xffffff, 1);
        g.fillRect(cx - Math.round(rx / 2), cy - Math.round(ry / 2), 2, 3);
    },

    // Glass jar of sugar cubes with a lavender lid.
    sugar(g, cx, cy, size) {
        const w = Math.round(size * 0.6);
        const h = Math.round(size * 0.62);
        const left = Math.round(cx - w / 2);
        const top = Math.round(cy - h / 2 + size * 0.08);
        PixelUI.drawBox(g, left, top, w, h, ICON_COLORS.sky, PALETTE.outline);
        PixelUI.drawBox(g, left - 2, top - Math.round(size * 0.14), w + 4, Math.round(size * 0.16), ICON_COLORS.lavender, PALETTE.outline);
        const cube = Math.max(3, Math.round(size * 0.14));
        g.fillStyle(0xffffff, 1);
        [[0.2, 0.55], [0.55, 0.55], [0.38, 0.25]].forEach(([fx, fy]) => {
            g.fillRect(left + Math.round(w * fx), top + Math.round(h * fy), cube, cube);
        });
    },

    // Milk carton with a pointed top.
    milk(g, cx, cy, size) {
        const w = Math.round(size * 0.46);
        const h = Math.round(size * 0.56);
        const left = Math.round(cx - w / 2);
        const top = Math.round(cy - h / 2 + size * 0.14);
        const roof = Math.round(size * 0.22);
        for (let r = 0; r < roof; r++) {
            const half = Math.round(((r + 1) / roof) * (w / 2));
            g.fillStyle(r === 0 ? PALETTE.outline : ICON_COLORS.sky, 1);
            g.fillRect(Math.round(cx - half), top - roof + r, half * 2, 1);
        }
        PixelUI.drawBox(g, left, top, w, h, 0xffffff, PALETTE.outline);
        g.fillStyle(ICON_COLORS.sky, 1);
        g.fillRect(left + 2, top + Math.round(h * 0.35), w - 4, Math.round(h * 0.25));
    },

    // Balloon whisk: handle at the bottom, wire loops on top.
    whisk(g, cx, cy, size) {
        const handleH = Math.round(size * 0.32);
        const loopRy = Math.round(size * 0.3);
        const loopCy = Math.round(cy - size * 0.12);
        g.fillStyle(ICON_COLORS.lavenderDark, 1);
        g.fillRect(cx - 1, Math.round(cy + size * 0.12), 3, handleH);
        g.fillStyle(0x9a94ad, 1);
        [0.3, 0.18].forEach((f) => {
            const rx = Math.round(size * f);
            for (let dy = -loopRy; dy <= loopRy; dy++) {
                const dx = Math.round(rx * Math.sqrt(1 - (dy * dy) / (loopRy * loopRy)));
                g.fillRect(cx - dx, loopCy + dy, 1, 1);
                g.fillRect(cx + dx, loopCy + dy, 1, 1);
            }
        });
        g.fillRect(cx, loopCy - loopRy, 1, loopRy * 2);
    },

    // Piping bag of icing in the given colour.
    icing(g, cx, cy, size, color = ICON_COLORS.pink) {
        const rows = Math.round(size * 0.7);
        const top = Math.round(cy - size * 0.38);
        for (let r = 0; r < rows; r++) {
            const half = Math.max(1, Math.round((1 - r / rows) * size * 0.3));
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(cx - half - 1, top + r, half * 2 + 3, 1);
            g.fillStyle(r < rows * 0.25 ? 0xffffff : color, 1);
            g.fillRect(cx - half, top + r, half * 2 + 1, 1);
        }
        g.fillStyle(color, 1);
        g.fillRect(cx, top + rows, 1, Math.round(size * 0.12));
    },

    // Shaker with colourful sprinkles falling out.
    sprinkles(g, cx, cy, size) {
        const w = Math.round(size * 0.42);
        const h = Math.round(size * 0.5);
        const left = Math.round(cx - w / 2);
        const top = Math.round(cy - size * 0.42);
        PixelUI.drawBox(g, left, top, w, h, ICON_COLORS.cream, PALETTE.outline);
        g.fillStyle(ICON_COLORS.lavender, 1);
        g.fillRect(left + 2, top + 2, w - 4, 3);
        const colors = [ICON_COLORS.pinkDark, ICON_COLORS.mintDark, ICON_COLORS.goldDark, ICON_COLORS.lavenderDark];
        for (let i = 0; i < 6; i++) {
            g.fillStyle(colors[i % colors.length], 1);
            g.fillRect(left + 2 + ((i * 5) % (w - 4)), top + h + 2 + (i % 3) * 3, 2, 1);
        }
    },

    strawberry(g, cx, cy, size) {
        const r = Math.round(size * 0.3);
        const top = Math.round(cy - r * 0.6);
        g.fillStyle(PALETTE.outline, 1);
        for (let row = 0; row <= r * 2; row++) {
            const half = Math.round(r * (1 - Math.pow(row / (r * 2), 1.6)) ) + 1;
            g.fillRect(cx - half, top + row, half * 2 + 1, 1);
        }
        g.fillStyle(0xf28aa5, 1);
        for (let row = 1; row < r * 2; row++) {
            const half = Math.round(r * (1 - Math.pow(row / (r * 2), 1.6)));
            g.fillRect(cx - half, top + row, half * 2 + 1, 1);
        }
        g.fillStyle(0xfff1c9, 1);
        [[-0.4, 0.5], [0.3, 0.6], [0, 1.1], [-0.2, 1.5], [0.4, 1.2]].forEach(([fx, fy]) => {
            g.fillRect(Math.round(cx + fx * r), Math.round(top + fy * r), 1, 1);
        });
        g.fillStyle(0x9fd6b8, 1);
        g.fillRect(cx - Math.round(r * 0.7), top - 1, Math.round(r * 1.4) + 1, 2);
        g.fillRect(cx, top - 3, 2, 3);
    },

    // A cake topping centred on (cx, cy): one of the keys of CAKE_TOPPINGS.
    topping(g, key, cx, cy, size) {
        const draw = CAKE_TOPPINGS[key];
        if (draw) {
            draw(g, cx, cy, size);
        }
    },

    // The character's own cake; by default fully decorated, as on the "bake" button.
    characterCake(g, character, cx, bottom, w, { icing = true, sprinkles = true, topping = true, bite = 0 } = {}) {
        const style = getCake(character);
        Icons.cake(g, cx, bottom, w, {
            sponge: style.sponge,
            icingColor: style.icing,
            icing,
            sprinkles,
            topping: topping ? style.topping : null,
            bite
        });
    },

    // Round layer cake on a plate; (cx, bottom) is the middle of the plate.
    // `bite` (0..1) is how much has been eaten from the right side. Colours and the topping
    // come from the character's cake (CHARACTER_CAKES).
    cake(g, cx, bottom, w, {
        sponge = 0xf6d098,
        icingColor = ICON_COLORS.pink,
        icing = false,
        sprinkles = false,
        topping = null,
        bite = 0
    } = {}) {
        const h = Math.round(w * 0.42);
        const left = Math.round(cx - w / 2);
        const right = Math.round(left + w * (1 - bite));
        const top = bottom - Math.round(w * 0.06) - h;
        const cw = right - left;

        // Plate.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - Math.round(w * 0.12) - 1, bottom - Math.round(w * 0.06) - 1, Math.round(w * 1.24) + 2, Math.round(w * 0.06) + 2);
        g.fillStyle(0xffffff, 1);
        g.fillRect(left - Math.round(w * 0.12), bottom - Math.round(w * 0.06), Math.round(w * 1.24), Math.round(w * 0.06));
        if (cw <= 2) {
            return;
        }

        // Sponge with a cream filling.
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, top - 1, cw + 2, h + 1);
        g.fillStyle(sponge, 1);
        g.fillRect(left, top, cw, h);
        g.fillStyle(0xfff7e8, 1);
        g.fillRect(left, top + Math.round(h * 0.5), cw, Math.max(2, Math.round(h * 0.12)));

        if (icing) {
            g.fillStyle(icingColor, 1);
            g.fillRect(left, top, cw, Math.round(h * 0.28));
            // Drips.
            for (let x = left + 2; x < right - 2; x += 6) {
                g.fillRect(x, top + Math.round(h * 0.28), 2, 2 + ((x / 6) % 2) * 2);
            }
        }
        if (sprinkles) {
            const colors = [ICON_COLORS.mintDark, ICON_COLORS.goldDark, ICON_COLORS.lavenderDark, 0xffffff];
            for (let x = left + 2, i = 0; x < right - 2; x += 4, i++) {
                g.fillStyle(colors[i % colors.length], 1);
                g.fillRect(x, top + 1 + (i % 3) * 2, 2, 1);
            }
        }
        if (topping && bite < 0.5) {
            Icons.topping(g, topping, Math.round(cx), top - Math.round(w * 0.08), Math.round(w * 0.36));
        }
    },

    // --- Bakery ------------------------------------------------------------------

    // Cupcake in a striped paper cup; (cx, bottom) is the middle of the cup's base.
    // design: { cream: colour or null, sprinkles: bool, topping: CAKE_TOPPINGS key or null }.
    // Without cream it shows the bare sponge top.
    cupcake(g, cx, bottom, w, { cream = null, sprinkles = false, topping = null } = {}) {
        const cupH = Math.round(w * 0.42);
        const cupTop = bottom - cupH;
        const topHalf = w * 0.4;
        const bottomHalf = w * 0.3;
        const halfAt = (r) => Math.round(topHalf + (bottomHalf - topHalf) * (r / cupH));

        // Paper cup with vertical pleats.
        g.fillStyle(PALETTE.outline, 1);
        for (let r = -1; r <= cupH; r++) {
            const half = halfAt(Math.max(0, r)) + 1;
            g.fillRect(Math.round(cx - half), cupTop + r, half * 2 + 1, 1);
        }
        for (let r = 0; r < cupH; r++) {
            const half = halfAt(r);
            g.fillStyle(ICON_COLORS.plaster, 1);
            g.fillRect(Math.round(cx - half), cupTop + r, half * 2 + 1, 1);
            g.fillStyle(0xf5c09a, 1);
            for (let x = -half + 2; x < half - 1; x += 4) {
                g.fillRect(Math.round(cx + x), cupTop + r, 1, 1);
            }
        }

        if (!cream) {
            // Bare sponge dome.
            g.fillStyle(PALETTE.outline, 1);
            Icons.fillEllipse(g, cx, cupTop, Math.round(topHalf) + 1, Math.round(w * 0.18) + 1);
            g.fillStyle(0xf6d098, 1);
            Icons.fillEllipse(g, cx, cupTop, Math.round(topHalf), Math.round(w * 0.18));
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(Math.round(cx - topHalf) - 1, cupTop, Math.round(topHalf * 2) + 3, 1);
            return;
        }

        // Swirl of cream: three blobs getting smaller towards the top.
        const blobs = [
            { y: cupTop - Math.round(w * 0.04), rx: Math.round(w * 0.46), ry: Math.round(w * 0.14) },
            { y: cupTop - Math.round(w * 0.17), rx: Math.round(w * 0.34), ry: Math.round(w * 0.12) },
            { y: cupTop - Math.round(w * 0.28), rx: Math.round(w * 0.2), ry: Math.round(w * 0.1) }
        ];
        g.fillStyle(PALETTE.outline, 1);
        blobs.forEach((b) => Icons.fillEllipse(g, cx, b.y, b.rx + 1, b.ry + 1));
        g.fillStyle(cream, 1);
        blobs.forEach((b) => Icons.fillEllipse(g, cx, b.y, b.rx, b.ry));
        g.fillStyle(ICON_COLORS.white, 1);
        blobs.forEach((b) => g.fillRect(Math.round(cx - b.rx * 0.5), b.y - Math.round(b.ry * 0.4), 2, 1));
        const creamTop = blobs[2].y - blobs[2].ry;

        if (sprinkles) {
            const colors = [ICON_COLORS.pinkDark, ICON_COLORS.mintDark, ICON_COLORS.goldDark, ICON_COLORS.lavenderDark];
            [[-0.3, -0.04], [0.22, -0.06], [-0.08, -0.16], [0.18, -0.2], [-0.22, -0.18], [0.02, -0.28], [0.32, -0.02], [-0.02, -0.06]]
                .forEach(([fx, fy], i) => {
                    g.fillStyle(colors[i % colors.length], 1);
                    g.fillRect(Math.round(cx + fx * w), Math.round(cupTop + fy * w), 2, 1);
                });
        }
        if (topping && CAKE_TOPPINGS[topping]) {
            CAKE_TOPPINGS[topping](g, cx, creamTop - Math.round(w * 0.08), Math.round(w * 0.42));
        }
    },

    // Little sweet shop for the map: striped awning and a cupcake sign; (cx, bottom) is the
    // middle of its base.
    bakery(g, cx, bottom, w, h) {
        const left = Math.round(cx - w / 2);
        const top = bottom - h;
        const roofH = Math.round(h * 0.14);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, top - 1, w + 2, h + 1);
        g.fillStyle(ICON_COLORS.cream, 1);
        g.fillRect(left, top, w, h);
        g.fillStyle(ICON_COLORS.mint, 1);
        g.fillRect(left, top, w, roofH);
        g.fillStyle(ICON_COLORS.mintDark, 1);
        g.fillRect(left, top + roofH - 1, w, 1);

        // Striped awning with a scalloped edge.
        const awnTop = top + roofH;
        const awnH = Math.round(h * 0.16);
        const stripe = Math.max(3, Math.round(w / 8));
        for (let x = 0; x < w; x++) {
            g.fillStyle(Math.floor(x / stripe) % 2 ? ICON_COLORS.white : ICON_COLORS.pink, 1);
            const scallop = Math.round(Math.abs(Math.sin((x / stripe) * Math.PI)) * 2);
            g.fillRect(left + x, awnTop, 1, awnH + scallop);
        }
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, awnTop - 1, w + 2, 1);

        // Shop window with a cupcake, and the door.
        const winY = awnTop + awnH + 4;
        const winW = Math.round(w * 0.42);
        const winH = bottom - winY - 3;
        PixelUI.drawBox(g, left + 3, winY, winW, winH, ICON_COLORS.sky, PALETTE.outline);
        Icons.cupcake(g, left + 3 + Math.round(winW / 2), winY + winH - 3, Math.round(winW * 0.55), { cream: ICON_COLORS.pink, topping: 'cherry' });
        const doorW = Math.round(w * 0.26);
        const doorX = left + w - doorW - 4;
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(doorX - 1, winY - 1, doorW + 2, bottom - winY + 1);
        g.fillStyle(ICON_COLORS.lavenderDark, 1);
        g.fillRect(doorX, winY, doorW, bottom - winY);
        g.fillStyle(ICON_COLORS.goldDark, 1);
        g.fillRect(doorX + doorW - 3, winY + Math.round((bottom - winY) / 2), 2, 2);

        // Cupcake sign on the roof.
        Icons.cupcake(g, cx, top + 2, Math.round(w * 0.3), { cream: ICON_COLORS.lavender, sprinkles: true, topping: 'cherry' });
    },

    // --- Dentist -----------------------------------------------------------------

    // Shiny white tooth with two little roots.
    tooth(g, cx, cy, size) {
        const rows = [
            '.OOOOOOO.',
            'OWWWWWLWO',
            'OWWWWWWLO',
            'OWWWWWWWO',
            'OWWWWWWWO',
            '.OWWWWWO.',
            '.OWWOWWO.',
            '.OWO.OWO.',
            '..O...O..'
        ];
        const colors = { O: PALETTE.outline, W: ICON_COLORS.white, L: ICON_COLORS.sky };
        const s = Math.max(1, Math.round(size / 9));
        rows.forEach((row, y) => [...row].forEach((ch, x) => {
            if (colors[ch] !== undefined) {
                g.fillStyle(colors[ch], 1);
                g.fillRect(Math.round(cx - 4.5 * s) + x * s, Math.round(cy - 4.5 * s) + y * s, s, s);
            }
        }));
    },

    // Toothbrush lying sideways, bristles up at the right end.
    toothbrush(g, cx, cy, size) {
        const len = Math.round(size * 0.9);
        const left = Math.round(cx - len / 2);
        const handleH = Math.max(3, Math.round(size * 0.13));
        const handleY = Math.round(cy + size * 0.12);
        const headW = Math.round(size * 0.3);
        const headX = left + len - headW;
        const bristleH = Math.round(size * 0.2);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, handleY - 1, len + 2, handleH + 2);
        g.fillStyle(ICON_COLORS.pink, 1);
        g.fillRect(left, handleY, len, handleH);
        g.fillStyle(ICON_COLORS.pinkDark, 1);
        g.fillRect(left + 2, handleY + Math.round(handleH / 2), Math.round(len * 0.5), 1);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(headX - 1, handleY - bristleH - 1, headW + 2, bristleH + 1);
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(headX, handleY - bristleH, headW, bristleH);
        g.fillStyle(ICON_COLORS.sky, 1);
        for (let x = headX + 1; x < headX + headW - 1; x += 3) {
            g.fillRect(x, handleY - bristleH, 1, bristleH);
        }
    },

    // Little round dentist's mirror on a long handle.
    dentalMirror(g, cx, cy, size) {
        const r = Math.max(3, Math.round(size * 0.2));
        const mx = Math.round(cx + size * 0.18);
        const my = Math.round(cy - size * 0.18);
        g.fillStyle(PALETTE.outline, 1);
        for (let i = 0; i < Math.round(size * 0.55); i++) {
            g.fillRect(Math.round(cx - size * 0.32) + i, Math.round(cy + size * 0.34) - i, 3, 3);
        }
        g.fillStyle(ICON_COLORS.lavenderDark, 1);
        for (let i = 1; i < Math.round(size * 0.55) - 1; i++) {
            g.fillRect(Math.round(cx - size * 0.32) + i + 1, Math.round(cy + size * 0.34) - i, 1, 1);
        }
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, mx, my, r + 1);
        g.fillStyle(ICON_COLORS.sky, 1);
        PixelUI.fillCircle(g, mx, my, r);
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(mx - Math.ceil(r / 2), my - Math.ceil(r / 2), Math.max(1, Math.round(r / 2)), Math.max(1, Math.round(r / 2)));
    },

    // Cup of water for rinsing.
    cup(g, cx, cy, size) {
        const h = Math.round(size * 0.6);
        const top = Math.round(cy - h / 2);
        const topHalf = Math.round(size * 0.28);
        const bottomHalf = Math.round(size * 0.2);
        for (let r = -1; r <= h; r++) {
            const half = Math.round(topHalf + (bottomHalf - topHalf) * (Math.max(0, r) / h));
            g.fillStyle(PALETTE.outline, 1);
            g.fillRect(cx - half - 1, top + r, half * 2 + 3, 1);
        }
        for (let r = 0; r < h; r++) {
            const half = Math.round(topHalf + (bottomHalf - topHalf) * (r / h));
            g.fillStyle(r < Math.round(h * 0.35) ? ICON_COLORS.sky : ICON_COLORS.mint, 1);
            g.fillRect(cx - half, top + r, half * 2 + 1, 1);
        }
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(cx - topHalf + 2, top + 2, 2, Math.round(h * 0.5));
    },

    // Dentist's surgery for the map: a tooth on the sign; (cx, bottom) is the base's middle.
    dentist(g, cx, bottom, w, h) {
        const left = Math.round(cx - w / 2);
        const top = bottom - h;
        const roofH = Math.round(h * 0.16);

        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, top - 1, w + 2, h + 1);
        g.fillStyle(ICON_COLORS.white, 1);
        g.fillRect(left, top, w, h);
        g.fillStyle(ICON_COLORS.sky, 1);
        g.fillRect(left, top, w, roofH);
        g.fillStyle(ICON_COLORS.mintDark, 1);
        g.fillRect(left, top + roofH - 1, w, 1);

        // Round sign with a big tooth.
        const signR = Math.round(Math.min(w, h) * 0.2);
        const signY = top + roofH + signR + 2;
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, cx, signY, signR + 1);
        g.fillStyle(ICON_COLORS.mint, 1);
        PixelUI.fillCircle(g, cx, signY, signR);
        Icons.tooth(g, cx, signY, Math.round(signR * 1.5));

        // Windows and door.
        const win = Math.max(3, Math.round(w * 0.14));
        const winY = signY - Math.round(win / 2);
        g.fillStyle(ICON_COLORS.sky, 1);
        g.fillRect(left + 3, winY, win, win);
        g.fillRect(left + w - 3 - win, winY, win, win);
        const doorW = Math.round(w * 0.24);
        const doorH = Math.round(h * 0.3);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(Math.round(cx - doorW / 2) - 1, bottom - doorH - 1, doorW + 2, doorH + 1);
        g.fillStyle(ICON_COLORS.mint, 1);
        g.fillRect(Math.round(cx - doorW / 2), bottom - doorH, doorW, doorH);
    },

    // Tiny tree for map decoration.
    tree(g, cx, bottom, size) {
        const trunkH = Math.round(size * 0.3);
        g.fillStyle(0xd8b39c, 1);
        g.fillRect(Math.round(cx - 1), bottom - trunkH, 3, trunkH);
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, cx, bottom - trunkH - Math.round(size * 0.3), Math.round(size * 0.36) + 1);
        g.fillStyle(ICON_COLORS.mintDark, 1);
        PixelUI.fillCircle(g, cx, bottom - trunkH - Math.round(size * 0.3), Math.round(size * 0.36));
        g.fillStyle(ICON_COLORS.mint, 1);
        PixelUI.fillCircle(g, cx - 2, bottom - trunkH - Math.round(size * 0.36), Math.round(size * 0.16));
    }
};

// Cake toppings by key, as used in CHARACTER_CAKES (data/characters.js). To add a topping,
// add a drawing function here; `npm run check` verifies every cake uses a known key.
export const CAKE_TOPPINGS = {
    strawberry(g, cx, cy, size) {
        Icons.strawberry(g, cx, cy, size);
    },

    // The sunflower seed hamsters eat in the terrarium.
    seed(g, cx, cy, size) {
        const s = Math.max(1, Math.round(size / 9));
        SEED_PIXELS.forEach((row, y) => [...row].forEach((ch, x) => {
            if (SEED_COLORS[ch] !== undefined) {
                g.fillStyle(SEED_COLORS[ch], 1);
                g.fillRect(Math.round(cx - 2.5 * s) + x * s, Math.round(cy - 3.5 * s) + y * s, s, s);
            }
        }));
    },

    blueberry(g, cx, cy, size) {
        const r = Math.max(2, Math.round(size * 0.17));
        [[-1, 0.5], [1, 0.5], [0, -0.6]].forEach(([fx, fy]) => {
            const bx = Math.round(cx + fx * r * 1.1);
            const by = Math.round(cy + fy * r * 1.1);
            g.fillStyle(PALETTE.outline, 1);
            PixelUI.fillCircle(g, bx, by, r + 1);
            g.fillStyle(0x9aa8e8, 1);
            PixelUI.fillCircle(g, bx, by, r);
            g.fillStyle(0xd9e0fa, 1);
            g.fillRect(bx - 1, by - 1, 1, 1);
        });
    },

    cherry(g, cx, cy, size) {
        const r = Math.max(2, Math.round(size * 0.24));
        const by = Math.round(cy + r * 0.4);
        g.fillStyle(0x9fd6b8, 1);
        for (let i = 0; i < Math.round(size * 0.4); i++) {
            g.fillRect(cx + Math.round(i * 0.5), by - r - i, 1, 1);
        }
        g.fillStyle(PALETTE.outline, 1);
        PixelUI.fillCircle(g, cx, by, r + 1);
        g.fillStyle(0xf28aa5, 1);
        PixelUI.fillCircle(g, cx, by, r);
        g.fillStyle(0xffffff, 1);
        g.fillRect(cx - Math.round(r / 2), by - Math.round(r / 2), 2, 1);
    },

    star(g, cx, cy, size) {
        Icons.star(g, cx, cy, Math.round(size * 0.42));
    },

    heart(g, cx, cy, size) {
        Icons.heart(g, cx, cy, Math.round(size * 0.8));
    },

    candle(g, cx, cy, size) {
        const w = Math.max(3, Math.round(size * 0.18));
        const h = Math.round(size * 0.5);
        const left = Math.round(cx - w / 2);
        const top = Math.round(cy - h / 2 + size * 0.12);
        g.fillStyle(PALETTE.outline, 1);
        g.fillRect(left - 1, top - 1, w + 2, h + 1);
        for (let y = 0; y < h; y++) {
            g.fillStyle(Math.floor(y / 2) % 2 ? ICON_COLORS.pink : 0xffffff, 1);
            g.fillRect(left, top + y, w, 1);
        }
        // Flame.
        g.fillStyle(ICON_COLORS.goldDark, 1);
        Icons.fillEllipse(g, cx, top - Math.round(size * 0.14), Math.max(1, Math.round(w / 2)), Math.round(size * 0.12));
        g.fillStyle(0xfff7e0, 1);
        g.fillRect(cx, top - Math.round(size * 0.14), 1, 2);
    },

    flower(g, cx, cy, size) {
        Icons.flower(g, cx, cy + Math.round(size * 0.1), size);
    }
};
