// Coloring pages in the art studio. Each page is one picture in docs/assets/coloring/
// (`<id>.png`), made from the original in assets/coloring/ by tools/clean-coloring.mjs
// (which takes out things like a printed title or a website address); the game finds the
// areas to paint in it when a finger taps (gfx/coloring.js). `title` is shown under its
// card on the shelf.
export const COLORING_PAGES = [
    {
        id: 'strus-pedziwiatr',
        title: 'Struś pędziwiatr'
    },
    {
        id: 'looney-tunes',
        title: 'Looney Tunes'
    },
    {
        id: 'baby-kojot',
        title: 'Looney Tunes'
    }
];

const DIR = 'assets/coloring';

// Path relative to docs/.
export const coloringImage = (page) => `${DIR}/${page.id}.png`;

export function getColoringPage(id) {
    return COLORING_PAGES.find((p) => p.id === id) || null;
}
