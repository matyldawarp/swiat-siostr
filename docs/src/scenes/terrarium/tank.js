import { S } from '../../ui/pixel.js';
import { spriteHalf } from '../../gfx/hamster.js';
import { addImage } from '../../gfx/images.js';
import { HAMSTER_SCALE, P } from './config.js';

// Puts up the glass tank and its fixed furniture (stand, lid, bedding, wheel stand, house,
// bottle, bowl). The tank is { x, y, w, h, beddingH, floorY } in game pixels; the pictures
// are made for the tank TerrariumScene lays out on the stage.
// Returns where the wheel and the house are and the span the hamster may walk along.
export function drawTank(scene, { x, y, w, h, floorY }) {
    // Stand, glass, lid and bedding, with the glass reflections.
    addImage(scene, x, y, P + 'akwarium');

    // Wheel stand on the left; the wheel itself is the Wheel activity's, so it can spin.
    // The inside must fit the hamster sprite.
    const wr = Math.max(S(28), Math.min(S(36), Math.round(h * 0.2)));
    const wcx = x + S(10) + wr;
    const wcy = floorY - wr - S(6);
    addImage(scene, wcx, floorY, P + 'stojak-kolka');
    const wheel = { x: wcx, y: wcy, r: wr };

    // House on the right.
    const hw = S(40);
    const hh = S(28);
    const hx = x + w - hw - S(14);
    const hy = floorY - hh;
    addImage(scene, hx, hy, P + 'domek');
    const house = { x: hx, y: hy, w: hw, h: hh, doorX: Math.round(hx + hw / 2), doorBottom: hy + hh };

    // Water bottle hanging on the right wall.
    addImage(scene, x + w - S(11) - 1, y + S(7), P + 'poidelko');

    // Food bowl in the middle.
    addImage(scene, Math.round(x + w * 0.45), floorY, P + 'miska');

    const margin = spriteHalf(HAMSTER_SCALE) + S(6);
    const minX = wcx + wr + margin;
    const maxX = hx - margin;
    const walkArea = maxX - minX > S(20)
        ? { minX, maxX }
        : { minX: x + margin, maxX: x + w - margin };

    return { wheel, house, walkArea };
}
