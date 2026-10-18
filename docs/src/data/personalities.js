// Every character has a personality: one of these, picked at random the first time it is
// met on a device and remembered there (localStorage). It changes how the character behaves
// in the terrarium and shows as an icon next to its name, so it can be told without reading.
//
// Fields (missing ones fall back to DEFAULTS):
//   name        short label for the older sister
//   icon        draws the badge icon: (g, cx, cy, size) => ...
//   wander      how often a wander picks a stroll or each activity (relative weights)
//   walkSpeed   multiplies time spent walking (below 1 is faster)
//   seedHurry   multiplies time spent walking to a seed
//   stay        multiplies how long it stays at each activity
//   pokeHearts  hearts after a tap
//   pokeHop     multiplies the jump after a tap
//   eatHearts   hearts after eating a seed
//   poopChance  chance of a dropping a while after eating
//   happyHop    chance of a happy jump on its own each time it wanders

import { Icons, CAKE_TOPPINGS } from '../gfx/icons.js';

const STORAGE_KEY = 'swiat-siostr-personalities';

export const DEFAULTS = {
    wander: { stroll: 0.4, wheel: 0.3, house: 0.15, bath: 0.15 },
    walkSpeed: 1,
    seedHurry: 1,
    stay: { wheel: 1, bath: 1, house: 1 },
    pokeHearts: 1,
    pokeHop: 1,
    eatHearts: 1,
    poopChance: 0.5,
    happyHop: 0
};

export const PERSONALITIES = {
    energetic: {
        name: 'Wiercipięta',
        icon: (g, cx, cy, size) => Icons.lightning(g, cx, cy, size),
        wander: { stroll: 0.3, wheel: 0.55, house: 0.05, bath: 0.1 },
        walkSpeed: 0.65,
        stay: { wheel: 1.5, bath: 0.8, house: 0.6 }
    },
    sleepy: {
        name: 'Śpioch',
        icon: (g, cx, cy, size) => Icons.moon(g, cx, cy, size),
        wander: { stroll: 0.3, wheel: 0.1, house: 0.45, bath: 0.15 },
        walkSpeed: 1.5,
        stay: { wheel: 0.6, bath: 1, house: 1.7 }
    },
    clean: {
        name: 'Czyścioszek',
        icon: (g, cx, cy, size) => Icons.bubbles(g, cx, cy, size),
        wander: { stroll: 0.35, wheel: 0.15, house: 0.1, bath: 0.4 },
        stay: { wheel: 1, bath: 1.6, house: 1 },
        poopChance: 0.25
    },
    foodie: {
        name: 'Łasuch',
        icon: (g, cx, cy, size) => CAKE_TOPPINGS.seed(g, cx, cy, Math.round(size * 1.1)),
        seedHurry: 0.55,
        eatHearts: 3,
        poopChance: 0.8
    },
    cuddly: {
        name: 'Przytulas',
        icon: (g, cx, cy, size) => Icons.heart(g, cx, cy, Math.round(size * 0.9)),
        pokeHearts: 3
    },
    playful: {
        name: 'Wesołek',
        icon: (g, cx, cy, size) => Icons.star(g, cx, cy, Math.round(size * 0.42)),
        walkSpeed: 0.85,
        pokeHop: 1.6,
        happyHop: 0.4
    }
};

let saved = null;

function load() {
    if (!saved) {
        try {
            saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            // Storage blocked: personalities last until the page is closed.
            saved = {};
        }
    }
    return saved;
}

// The character's personality with every field filled in; picks and saves one if it has none.
export function getPersonality(character) {
    const all = load();
    let key = all[character.id];
    if (!PERSONALITIES[key]) {
        const keys = Object.keys(PERSONALITIES);
        key = keys[Math.floor(Math.random() * keys.length)];
        all[character.id] = key;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch {
            // Storage blocked: the personality just isn't remembered.
        }
    }
    const p = PERSONALITIES[key];
    return {
        ...DEFAULTS,
        ...p,
        key,
        wander: { ...DEFAULTS.wander, ...p.wander },
        stay: { ...DEFAULTS.stay, ...p.stay }
    };
}
