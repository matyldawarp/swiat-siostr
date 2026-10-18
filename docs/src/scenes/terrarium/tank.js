import { PALETTE, S } from '../../ui/pixel.js';
import { spriteHalf } from '../../gfx/hamster.js';
import { HAMSTER_SCALE, TERRARIUM_COLORS } from './config.js';

// Draws the glass tank and its fixed furniture (stand, lid, bedding, wheel stand, house,
// bottle, bowl). The tank is { x, y, w, h, beddingH, floorY } in game pixels.
// Returns where the wheel and the house are and the span the hamster may walk along.
export function drawTank(scene, { x, y, w, h, beddingH, floorY }) {
    const C = TERRARIUM_COLORS;
    const g = scene.add.graphics();
    const edge = S(2);

    // Stand under the tank.
    g.fillStyle(PALETTE.outline, 1);
    g.fillRect(x - S(6), y + h + 1, w + S(12), S(7));
    g.fillStyle(C.stand, 1);
    g.fillRect(x - S(5), y + h + 2, w + S(10), S(4));
    g.fillStyle(C.standShade, 1);
    g.fillRect(x - S(5), y + h + 1 + S(4), w + S(10), 1);

    // Glass with outline.
    g.fillStyle(PALETTE.outline, 1);
    g.fillRect(x - edge, y - edge, w + edge * 2, h + edge * 2);
    g.fillStyle(C.glass, 1);
    g.fillRect(x, y, w, h);
    g.fillStyle(C.glassTop, 1);
    g.fillRect(x, y, w, S(3));

    // Lid.
    g.fillStyle(PALETTE.outline, 1);
    g.fillRect(x - S(5), y - S(8), w + S(10), S(7));
    g.fillStyle(C.lid, 1);
    g.fillRect(x - S(4), y - S(7), w + S(8), S(4));
    g.fillStyle(C.lidShade, 1);
    g.fillRect(x - S(4), y - S(3), w + S(8), 1);

    // Bedding with a slightly uneven top edge and speckles.
    const beddingTop = y + h - beddingH;
    for (let i = 0; i < w; i++) {
        const top = beddingTop + Math.round(Math.sin(i / S(7)) * S(1) + Math.sin(i / S(3)) * 0.6);
        g.fillStyle(C.bedding, 1);
        g.fillRect(x + i, top, 1, y + h - top);
    }
    g.fillStyle(C.beddingDark, 1);
    for (let i = 0; i < w * beddingH / 14; i++) {
        g.fillRect(x + Phaser.Math.Between(0, w - 2), Phaser.Math.Between(beddingTop + S(3), y + h - 2), 2, 1);
    }

    // Wheel stand on the left; the wheel itself is drawn by the Wheel activity so it can spin.
    // The inside must fit the hamster sprite.
    const wr = Math.max(S(28), Math.min(S(36), Math.round(h * 0.2)));
    const wcx = x + S(10) + wr;
    const wcy = floorY - wr - S(6);
    g.fillStyle(C.wheelStand, 1);
    g.fillRect(wcx - 1, wcy, S(3), floorY - wcy);
    g.fillRect(wcx - S(8), floorY - S(2), S(17), S(2));
    const wheel = { x: wcx, y: wcy, r: wr };

    // House on the right.
    const hw = S(40);
    const hh = S(28);
    const hx = x + w - hw - S(14);
    const hy = floorY - hh;
    const roofRows = S(10);
    for (let r = 0; r < roofRows; r++) {
        g.fillStyle(r === 0 ? PALETTE.outline : C.roof, 1);
        g.fillRect(hx + hw / 2 - r * 2 - 2, hy - roofRows + r, r * 4 + 4, 1);
    }
    g.fillStyle(PALETTE.outline, 1);
    g.fillRect(hx - 1, hy, hw + 2, hh);
    g.fillStyle(C.house, 1);
    g.fillRect(hx, hy, hw, hh);
    g.fillStyle(C.houseShade, 1);
    g.fillRect(hx, hy, hw, S(2));
    g.fillStyle(C.door, 1);
    g.fillRect(hx + hw / 2 - S(5), hy + hh - S(15), S(10), S(15));
    g.fillRect(hx + hw / 2 - S(6), hy + hh - S(13), S(12), S(13));
    const house = { x: hx, y: hy, w: hw, h: hh, doorX: Math.round(hx + hw / 2), doorBottom: hy + hh };

    // Water bottle hanging on the right wall.
    const bx = x + w - S(11);
    g.fillStyle(PALETTE.outline, 1);
    g.fillRect(bx - 1, y + S(7), S(7) + 2, S(26));
    g.fillStyle(C.bottle, 1);
    g.fillRect(bx, y + S(8), S(7), S(24));
    g.fillStyle(C.water, 1);
    g.fillRect(bx, y + S(18), S(7), S(14));
    g.fillStyle(C.spout, 1);
    g.fillRect(bx + S(2), y + S(33), S(2), S(9));

    // Food bowl in the middle.
    const bowlX = Math.round(x + w * 0.45);
    g.fillStyle(C.bowlRim, 1);
    g.fillRect(bowlX - S(11), floorY - S(6), S(22), S(2));
    g.fillStyle(C.bowl, 1);
    g.fillRect(bowlX - S(10), floorY - S(4), S(20), S(4));
    g.fillStyle(C.seed, 1);
    [-6, -2, 3, 7].forEach((dx, i) => g.fillRect(bowlX + S(dx), floorY - S(7) - (i % 2), S(2), S(1)));

    // Glass reflections drawn last so they sit on top of the furniture.
    g.fillStyle(0xffffff, 0.8);
    for (let i = 0; i < S(12); i++) {
        g.fillRect(x + S(6) + i, y + S(18) - i, 1, 1);
    }
    for (let i = 0; i < S(6); i++) {
        g.fillRect(x + S(12) + i, y + S(18) - i, 1, 1);
    }

    const margin = spriteHalf(HAMSTER_SCALE) + S(6);
    const minX = wcx + wr + margin;
    const maxX = hx - margin;
    const walkArea = maxX - minX > S(20)
        ? { minX, maxX }
        : { minX: x + margin, maxX: x + w - margin };

    return { wheel, house, walkArea };
}
