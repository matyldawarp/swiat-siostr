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

function getCharacter(id) {
    return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
