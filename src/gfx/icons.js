// Pixel-art icons drawn straight into a Graphics object, centred on (cx, cy).
// Sizes are in game pixels; callers pass S()-scaled values.

const ICON_COLORS = {
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

const Icons = {
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
