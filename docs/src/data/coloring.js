// Coloring pages in the art studio. Each page is one picture in docs/assets/coloring/, the
// original exactly as given (`<id>.png`); the game finds the areas to paint in it when a
// finger taps (gfx/coloring.js). `title` is shown under its card on the shelf.
//
// blank: boxes (x, y, w, h in the original's pixels) to hide things like a printed title
// or a website address: whited out in the lines shown, the areas and the printout.
export const COLORING_PAGES = [
    {
        id: 'strus-pedziwiatr',
        title: 'Struś pędziwiatr',
        blank: [[232, 30, 488, 68],[550, 910, 170, 20]]
    },
    {
        id: 'looney-tunes',
        title: 'Looney Tunes',
        blank: [[555, 910, 165, 20]]
    }
];

const DIR = 'assets/coloring';

// Path relative to docs/.
export const coloringOriginal = (page) => `${DIR}/${page.id}.png`;

export function getColoringPage(id) {
    return COLORING_PAGES.find((p) => p.id === id) || null;
}
