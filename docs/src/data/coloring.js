// Coloring pages in the art studio. `image` is a grayscale PNG made by
// tools/make-coloring.mjs from a source kept in assets/coloring-src/; `title` is shown
// under its card on the shelf. `id` names the saved colors, so don't rename it later.
export const COLORING_PAGES = [
    {
        id: 'strus-pedziwiatr',
        title: 'Struś pędziwiatr',
        image: 'assets/coloring/strus-pedziwiatr.png'
    },
    {
        id: 'looney-tunes',
        title: 'Looney Tunes',
        image: 'assets/coloring/looney-tunes.png'
    }
];

export function getColoringPage(id) {
    return COLORING_PAGES.find((p) => p.id === id) || null;
}
