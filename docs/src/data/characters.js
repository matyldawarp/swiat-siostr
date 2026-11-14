// The character screen has room for this many characters; unfilled slots show as locked.
export const CHARACTER_SLOTS = 20;

export const CHARACTERS = [
    {
        id: 'mordka',
        name: 'Mordka',
        species: 'chomik',
        // Two warm, lower squeaks.
        sound: {
            wave: 'sine',
            gap: 0.06,
            chirps: [
                { from: 700, to: 1050, duration: 0.09 },
                { from: 760, to: 1150, duration: 0.12 }
            ]
        }
    },
    {
        id: 'mysia',
        name: 'Mysia',
        species: 'chomik',
        // Quick, high trill.
        sound: {
            wave: 'triangle',
            gap: 0.03,
            chirps: [
                { from: 1500, to: 1900, duration: 0.05 },
                { from: 1600, to: 2100, duration: 0.05 },
                { from: 1500, to: 2300, duration: 0.08 }
            ]
        }
    }
];

// Characters designed by the girls on paper (scanned in assets/scans/postacie-1-5.png),
// redrawn as 16x16 pixel pictures and, from those, with Scale2x/3x in every size. Every
// character's picture is docs/assets/gfx/postacie/<id>.png (and postacie-male, -duze); the
// hamsters also have <id>-blink and <id>-chew.
CHARACTERS.push(
    {
        id: 'postac1',
        name: 'Titi',
        species: '',
        // Low, round "boo-oop".
        sound: {
            wave: 'sine',
            gap: 0.04,
            chirps: [
                { from: 300, to: 420, duration: 0.15 },
                { from: 420, to: 300, duration: 0.2 }
            ]
        }
    },
    {
        id: 'postac2',
        name: 'Lili',
        species: '',
        // Cheerful rising giggle.
        sound: {
            wave: 'triangle',
            gap: 0.03,
            chirps: [
                { from: 600, to: 900, duration: 0.08 },
                { from: 700, to: 1100, duration: 0.08 },
                { from: 900, to: 1400, duration: 0.1 }
            ]
        }
    },
    {
        id: 'postac3',
        name: 'Harry',
        species: '',
        // Deep, wobbly rumble (soft, not scary).
        sound: {
            wave: 'triangle',
            gap: 0.02,
            chirps: [
                { from: 180, to: 260, duration: 0.12 },
                { from: 200, to: 300, duration: 0.12 },
                { from: 180, to: 350, duration: 0.18 }
            ]
        }
    },
    {
        id: 'postac4',
        name: 'Harbin',
        species: '',
        // Bright little tune.
        sound: {
            wave: 'sine',
            gap: 0.04,
            chirps: [
                { from: 880, to: 990, duration: 0.1 },
                { from: 990, to: 1320, duration: 0.15 }
            ]
        }
    },
    {
        id: 'postac5',
        name: 'Karabilein',
        species: '',
        // Airy, floating "woo".
        sound: {
            wave: 'sine',
            gap: 0.05,
            chirps: [
                { from: 500, to: 1000, duration: 0.3 },
                { from: 900, to: 600, duration: 0.2 }
            ]
        }
    }
);

// Character 6 was coloured square by square on grid paper (assets/scans/postac-6.jpg),
// so it is copied cell for cell with its own colours, softened to pastels.
CHARACTERS.push({
    id: 'postac6',
    name: 'Leili',
    species: '',
    // A little "miau".
    sound: {
        wave: 'triangle',
        gap: 0,
        chirps: [
            { from: 500, to: 900, duration: 0.15 },
            { from: 900, to: 550, duration: 0.25 }
        ]
    }
});

// Gabi, a mermaid doll with cat ears and curly blue, turquoise and pink hair, drawn after the
// photo assets/scans/gabi-syrena.jpg (32x32 in postacie-male, enlarged with Scale2x/3x).
CHARACTERS.push({
    id: 'gabi',
    name: 'Gabi',
    species: '',
    // A bubbly, splashy sing-song.
    sound: {
        wave: 'sine',
        gap: 0.03,
        chirps: [
            { from: 800, to: 1200, duration: 0.08 },
            { from: 1000, to: 1500, duration: 0.08 },
            { from: 1300, to: 900, duration: 0.15 }
        ]
    }
});

export function getCharacter(id) {
    return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
