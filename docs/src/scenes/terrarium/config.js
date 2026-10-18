// Colours, sizes and draw order shared by the terrarium scene and its activities.

import { CHARACTER_SCALE } from '../../gfx/hamster.js';

export const TERRARIUM_COLORS = {
    glass: 0xeef8ff,
    glassTop: 0xddeefa,
    lid: 0xd9ccf5,
    lidShade: 0xc3b3ea,
    stand: 0xe9c9b5,
    standShade: 0xd8b39c,
    bedding: 0xf6e3c4,
    beddingDark: 0xe8cc9e,
    house: 0xf7b2cc,
    houseShade: 0xeea0bd,
    roof: 0xd9a0c8,
    door: 0x8a5c9e,
    wheel: 0xc9b8ef,
    wheelStand: 0xb8a6dc,
    bowl: 0xbfe8d6,
    bowlRim: 0xa6dcc4,
    seed: 0xe0a46c,
    bottle: 0xcfe8ff,
    water: 0x9fd0f5,
    spout: 0xb7b0c4,
    tub: 0xffffff,
    tubShade: 0xe6eefc,
    tubRim: 0xf7f9ff,
    tubStripe: 0xf7b2cc,
    tubFeet: 0xd9a0c8,
    foam: 0xffffff,
    foamShade: 0xdcd3f2
};

// Whole-number sprite scale for the hamster inside the tank.
export const HAMSTER_SCALE = CHARACTER_SCALE;
export const MAX_SEEDS = 5;
export const SEED_SCALE = 3;
// Droppings left on the bedding at once, at most; then the hamster waits for a clean-up.
export const MAX_POOPS = 6;
export const POOP_SCALE = 3;

// Draw order inside the tank. The hamster drops to DEPTH.hamsterInBath while bathing so the
// front of the tub hides its body; otherwise it walks in front of the tub.
export const DEPTH = {
    bathBack: 2,
    poop: 3,
    hamsterInBath: 8,
    bathFront: 9,
    hamster: 10,
    seed: 12,
    effects: 13
};
