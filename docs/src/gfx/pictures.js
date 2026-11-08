// Pixel pictures of things and animals for the school (riddles and rebuses), 16 pixels
// wide and at most 16 tall. Each has the Polish `word` it shows; the game says it aloud
// when tapped. Letters: O outline, E eye, W white, and per picture colours in `colors`.
// To add one: an entry here (`npm run check` checks the sizes and letters).

import { PALETTE } from '../ui/pixel.js';
import { paintPixels } from './hamster.js';

const BASE_COLORS = { O: PALETTE.outline, E: 0x3d2b3d, W: 0xffffff };

export const PICTURES = {
    gora: {
        word: 'góra',
        colors: { G: 0xc3b3ea, D: 0xa898d8 },
        rows: [
            '.......OO.......',
            '......OWWO......',
            '......OWWO......',
            '.....OWWWWO.....',
            '.....OWGWWO.....',
            '....OGGWGWGO....',
            '....OGGGGGGO....',
            '...OGGGGGGGGO...',
            '...OGGGGGGDGO...',
            '..OGGGGGGGDDGO..',
            '..OGGDGGGGGDGO..',
            '.OGGDDGGGGGGGGO.',
            '.OGGGGGGGGGGDGO.',
            'OGGGGGGGGGGGDDGO',
            'OOOOOOOOOOOOOOOO'
        ]
    },
    mrowka: {
        word: 'mrówka',
        colors: { A: 0xc9a07a },
        rows: [
            '..O...O.........',
            '...O.O..........',
            '...OOOO.........',
            '..OAAAAO........',
            '..OAEAAO..OOOO..',
            '..OAAAAOOOAAAAO.',
            '...OOOOAAOAAAAAO',
            '....O.OAAOAAAAAO',
            '...O..OOOOAAAAO.',
            '...O.O.O.O.OOOO.',
            '....O..O..O.O...',
            '...O..O..O...O..'
        ]
    },
    zolw: {
        word: 'żółw',
        colors: { S: 0xf6d98b, D: 0xd8b39c, G: 0x9fd6b8 },
        rows: [
            '......OOOOO.....',
            '.....OSSDSSO....',
            '....OSDSSSDSO...',
            '...OSSSDSDSSSO..',
            '.OOOSDSSSSSDSO..',
            'OGGOSSSDSDSSSSO.',
            'OGEGOOOOOOOOOOOO',
            'OGGGGGGGGGGGGGO.',
            '.OOOGGOOOOGGOOO.',
            '...OGGO..OGGO...',
            '...OOOO..OOOO...'
        ]
    },
    kot: {
        word: 'kot',
        colors: { C: 0xf6c79a, P: 0xf59bbd },
        rows: [
            '..OO........OO..',
            '..OPO......OPO..',
            '..OCCOOOOOOCCO..',
            '..OCCCCCCCCCCO..',
            '..OCEECCCCEECO..',
            '..OCCCCPPCCCCO..',
            '..OCCCCWWCCCCO..',
            '...OCCCCCCCCO...',
            '....OOCCCCOO....',
            '...OCCCCCCCCO...',
            '..OCCCWWWWCCCO..',
            '..OCCCWWWWCCCOCO',
            '..OCCCCCCCCCCOCO',
            '..OCCOCCCCOCCOO.',
            '...OOOOOOOOOO...'
        ]
    },
    ryba: {
        word: 'ryba',
        colors: { B: 0x9fd0f5, L: 0xcfe8ff },
        rows: [
            '.....OOOOO......',
            '...OOBBBBBOO.OO.',
            '..OBBBBLBBBBOOBO',
            '.OBEBBBLBBBBBBBO',
            '.OBBBBBLBBBBBBBO',
            '..OBBBBLBBBBOOBO',
            '...OOBBBBBOO.OO.',
            '.....OOOOO......'
        ]
    },
    wiewiorka: {
        word: 'wiewiórka',
        colors: { R: 0xe8a882, L: 0xffe1c4, P: 0xf59bbd },
        rows: [
            '...O.O....OOOO..',
            '...OROO..ORRRRO.',
            '..ORRRRO.ORRLRRO',
            '..OERRRO.ORLRRRO',
            '.OPRRRRO..ORRRRO',
            '..OOLRRO..ORRRO.',
            '...OLLRROORRRO..',
            '..OLLRRRRORRRO..',
            '..OLLRRRRRRRO...',
            '..OLLRRRRRRO....',
            '..OOLRRRRRO.....',
            '...OOROOROO.....'
        ]
    },
    slimak: {
        word: 'ślimak',
        colors: { B: 0xf3dcc4, S: 0xf7b2cc, D: 0xe58fb0 },
        rows: [
            '..O.O...........',
            '..O.O....OOOO...',
            '..OOO...OSSSSO..',
            '.OBBBO.OSSDDSSO.',
            '.OBEBO.OSDSSDSO.',
            '.OBBBO.OSDSDDSO.',
            '.OBBBO.OSSDSSSO.',
            '.OBBBBOOOSSSSOO.',
            '.OBBBBBBBOOOOBBO',
            '..OBBBBBBBBBBBO.',
            '...OOOOOOOOOOO..'
        ]
    },
    roza: {
        word: 'róża',
        colors: { R: 0xf28aa5, P: 0xf7b2cc, G: 0x7fcf9a, L: 0xbfe8d6 },
        rows: [
            '.....OOOOOO.....',
            '....ORRPPRRO....',
            '...ORPRRRRPRO...',
            '...ORPRPPRPRO...',
            '...ORRPRRPRRO...',
            '....ORRPPRRO....',
            '.....OORROO.....',
            '.......OGO......',
            '..OOO..OGO......',
            '.OLLLO.OGO.OOO..',
            '..OLLLOOGOOLLLO.',
            '...OOOOOGOOOOO..',
            '.......OGO......',
            '.......OOO......'
        ]
    },
    wrobel: {
        word: 'wróbel',
        colors: { B: 0xd8b39c, D: 0xb8957c, W: 0xfff1e0, Y: 0xf6d98b },
        rows: [
            '....OOOO........',
            '...OBBBBO.......',
            '..OBEBBBBO......',
            '.OYOBBBBBOOO....',
            '..OOWWBBBBDDO...',
            '...OWWWBBDDDDO..',
            '...OWWWWBBDDDDOO',
            '....OWWWWBBBOODO',
            '.....OOOOOOO..OO',
            '.......O.O......',
            '......OO.OO.....'
        ]
    },
    jez: {
        word: 'jeż',
        colors: { S: 0xb8957c, F: 0xf3dcc4, P: 0xf59bbd },
        rows: [
            '......O.O.O.O...',
            '.....OSOSOSOSO..',
            '....OSSSSSSSSSO.',
            '...OSSSSSSSSSSSO',
            '..OFFSSSSSSSSSSO',
            '.OFEFFSSSSSSSSSO',
            'OPFFFFFSSSSSSSSO',
            '.OOFFFFFFFFFFFO.',
            '...OFO....OFO...',
            '...OOO....OOO...'
        ]
    },
    krolik: {
        word: 'królik',
        colors: { B: 0xece6f7, P: 0xf7b2cc },
        rows: [
            '....OO....OO....',
            '...OBPO..OPBO...',
            '...OBPO..OPBO...',
            '...OBPO..OPBO...',
            '...OBBOOOOBBO...',
            '..OBBBBBBBBBBO..',
            '..OBEBBBBBBEBO..',
            '..OBBBBPPBBBBO..',
            '..OBBBBBBBBBBO..',
            '...OOBBBBBBOO...',
            '...OBBBBBBBBO...',
            '..OBBBBBBBBBBO..',
            '..OBBBBBBBBBBOO.',
            '..OBBOBBBBOBBOBO',
            '...OOOOOOOOOOOO.'
        ]
    },
    zaba: {
        word: 'żaba',
        colors: { G: 0x9fd6b8, L: 0xd4f2e4, P: 0xf28aa5 },
        rows: [
            '...OOO....OOO...',
            '..OWEWO..OWEWO..',
            '..OWWWOOOOWWWO..',
            '.OGGGGGGGGGGGGO.',
            '.OGGGGGGGGGGGGO.',
            '.OGGPGGGGGGPGGO.',
            '.OGGGPPPPPPGGGO.',
            '..OGGGGGGGGGGO..',
            '.OGGOLLLLLLOGGO.',
            'OGGGOLLLLLLOGGGO',
            'OOOOOOOOOOOOOOOO'
        ]
    }
};

export const PICTURE_SIZE = 16;

// Texture key of a picture, made on first use; drawn centred in a 16x16 square.
export function pictureTexture(scene, id) {
    const key = `picture-${id}`;
    const picture = PICTURES[id];
    const top = Math.floor((PICTURE_SIZE - picture.rows.length) / 2);
    const rows = Array.from({ length: PICTURE_SIZE }, (_, y) => picture.rows[y - top] || '.'.repeat(PICTURE_SIZE));
    paintPixels(scene, key, rows, { ...BASE_COLORS, ...picture.colors });
    return key;
}
