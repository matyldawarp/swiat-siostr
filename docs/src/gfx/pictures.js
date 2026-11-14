// Pictures of things and animals for the school (riddles and rebuses): 16x16 PNG files in
// docs/assets/gfx/szkola/obrazki/<id>.png, anchored in the middle. Each has the Polish
// `word` it shows; the game says it aloud when tapped.
// To add one: draw the PNG, list it in images.json and add an entry here (`npm run check`
// checks that every entry has its PNG).

export const PICTURES = {
    gora: { word: 'góra' },
    mrowka: { word: 'mrówka' },
    zolw: { word: 'żółw' },
    kot: { word: 'kot' },
    ryba: { word: 'ryba' },
    wiewiorka: { word: 'wiewiórka' },
    slimak: { word: 'ślimak' },
    roza: { word: 'róża' },
    wrobel: { word: 'wróbel' },
    jez: { word: 'jeż' },
    krolik: { word: 'królik' },
    zaba: { word: 'żaba' }
};

// Every picture is drawn in two sizes, as scene pictures are never scaled: 64x64 game pixels,
// and 80x80 for the large one (rebus cards). PICTURE_SIZE is the size of the original sketch.
export const PICTURE_SIZE = 16;

// Picture key (gfx/images.js) of a picture, the 64x64 one or the large 80x80 one.
export function pictureImage(id, large = false) {
    return `szkola/${large ? 'obrazki-duze' : 'obrazki'}/${id}`;
}
