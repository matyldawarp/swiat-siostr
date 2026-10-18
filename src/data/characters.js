// The character screen has room for this many characters; unfilled slots show as locked.
const CHARACTER_SLOTS = 20;

const CHARACTERS = [
    {
        id: 'mordka',
        name: 'Mordka',
        species: 'chomik',
        colors: { body: 0xf2b880, light: 0xfff1e0, pink: 0xf7a8b8 },
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
        colors: { body: 0xc9c3d6, light: 0xfbf8ff, pink: 0xf7a8c4 },
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
// redrawn as 16x16 masks: '#' body, 'E' pen detail, 'W' white, 'O' loose pen line.
CHARACTERS.push(
    {
        id: 'postac1',
        name: 'Titi',
        species: '',
        colors: { body: 0xd9ccf5 },
        pixels: [
            '........####....',
            '.......######...',
            '.......#######..',
            '.......########.',
            '........#######.',
            '........#######.',
            '........######..',
            '...##########...',
            '..###########...',
            '.###########....',
            '.###########....',
            '.##########.....',
            '.##########.....',
            '..#########.....',
            '..###.###.##....',
            '...#...#..#.....'
        ],
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
        colors: { body: 0xbfe8d6 },
        pixels: [
            '................',
            '................',
            '........#..##...',
            '.......###.####.',
            '......#########.',
            '......##########',
            '.##############.',
            '##.####E###E###.',
            '.######E###E###.',
            '..####E##E##E##.',
            '....###EEEEE###.',
            '.....#########..',
            '.....########...',
            '.....########...',
            '......##.###....',
            '......#...#.....'
        ],
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
        colors: { body: 0xffd6b8 },
        pixels: [
            '................',
            '................',
            '..........##....',
            '.........####...',
            '....##########..',
            '...###########..',
            '..############..',
            '..#####EEE####..',
            '.#####EWWWE##E#.',
            '.#####EWWWE#E#E.',
            '.######EEE###E#.',
            '.##############.',
            '.##############.',
            '.##############.',
            '.##############.',
            '.#.#.#.#.#.#.#..'
        ],
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
        colors: { body: 0xfbd3e2 },
        pixels: [
            '...OOOOOOOOOO...',
            '..O..........O..',
            '.O...######...O.',
            '.O..########..O.',
            'O..###EE#EE##..O',
            'O..###EE#EE##..O',
            'O..#####E####..O',
            'O..##EEEEE###..O',
            'O...########...O',
            'O..##########..O',
            'O..##########..O',
            'O..##########..O',
            'O...########...O',
            'O...###..###...O',
            'O...###..###...O',
            'O..............O'
        ],
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
        colors: { body: 0xcfe8ff },
        pixels: [
            '................',
            '................',
            '................',
            '.....###.###....',
            '....#########...',
            '...###########..',
            '...###########..',
            '...###########..',
            '...##########...',
            '...##########...',
            '...#########....',
            '...#########....',
            '...#########....',
            '...#########....',
            '...###.###......',
            '....#...#.......'
        ],
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
    colors: { body: 0x8fdcea },
    palette: {
        O: 0x4f74c8, // blue outline
        T: 0x8fdcea, // turquoise fur
        G: 0xc4ecc8, // light green fur
        M: 0xd9a6d6, // inside of the ears
        P: 0xf5bfd2, // pink lip
        S: 0xf4aaae, // big pink mouth
        E: 0x3d5cb0, // pupils and nose
        W: 0xffffff
    },
    pixels: [
        '................',
        '..OO........OO..',
        '.OMTO......OGMO.',
        '.OMTTOOOOOOGTMO.',
        '.OTTTGGTTGGGTTO.',
        'OGGGGGGTTGGGTTTO',
        'OGGWETTTTTTWETTO',
        'OGGEETTTTTTEETTO',
        'OGPPPPPPPPPPPPTO',
        'OGGSSSSEESSSSTTO',
        'OGSSSSSSSSSSSSTO',
        'OTSSSSSSSSSSSSGO',
        'OTTSSSSSSSSSSGGO',
        '.OTTPSSSSSPPGGO.',
        '..OOTGGGTTTTOO..',
        '....OOOOOOOO....'
    ],
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

// Every character has its own cake: sponge and icing colours and a topping on top.
// Shown on the "bake a cake" button and baked in the kitchen.
const CHARACTER_CAKES = {
    mordka: { sponge: 0xf6d098, icing: 0xffd6b8, topping: 'seed' },
    mysia: { sponge: 0xf6d098, icing: 0xd9ccf5, topping: 'blueberry' },
    postac1: { sponge: 0xf6d098, icing: 0xc3b3ea, topping: 'star' },
    postac2: { sponge: 0xf6d098, icing: 0xbfe8d6, topping: 'cherry' },
    postac3: { sponge: 0xd8b39c, icing: 0xf6d098, topping: 'heart' },
    postac4: { sponge: 0xf6d098, icing: 0xf7b2cc, topping: 'strawberry' },
    postac5: { sponge: 0xf6d098, icing: 0xcfe8ff, topping: 'candle' },
    postac6: { sponge: 0xf6d098, icing: 0x8fdcea, topping: 'flower' }
};
const DEFAULT_CAKE = { sponge: 0xf6d098, icing: 0xf7b2cc, topping: 'strawberry' };

function getCake(character) {
    return CHARACTER_CAKES[character.id] || DEFAULT_CAKE;
}

function getCharacter(id) {
    return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
