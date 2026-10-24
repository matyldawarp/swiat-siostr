// Coloring pages in the art studio. Each page has two files side by side in
// docs/assets/coloring/: the original picture as given (`<id>.png`) and the version the
// game colors in (`<id>.coloring.png`), made from it by tools/make-coloring.mjs with the
// page's `make` options. `title` is shown under its card on the shelf. `id` names the
// saved colors, so don't rename it later.
//
// make: { blank } – see tools/make-coloring.mjs; `blank` boxes (x, y, w, h in the
// original's pixels) hide things like a printed title or a website address. Lines get the
// same width on every page (LINE_RADIUS in gfx/coloring.js).
export const COLORING_PAGES = [
    {
        id: 'strus-pedziwiatr',
        title: 'Struś pędziwiatr',
        make: { blank: [[220, 20, 500, 90], [550, 910, 170, 20]] }
    },
    {
        id: 'looney-tunes',
        title: 'Looney Tunes',
        make: { blank: [[555, 910, 165, 20]] }
    }
];

const DIR = 'assets/coloring';

// Paths relative to docs/.
export const coloringOriginal = (page) => `${DIR}/${page.id}.png`;
export const coloringImage = (page) => `${DIR}/${page.id}.coloring.png`;

export function getColoringPage(id) {
    return COLORING_PAGES.find((p) => p.id === id) || null;
}
