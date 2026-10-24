// Coloring pages in the art studio, in groups: the shelf shows a card per group, and a
// group's card opens a shelf of its pages. Each page is one picture in
// docs/assets/coloring/ (`<id>.png`), made from the original in assets/coloring/ by
// tools/clean-coloring.mjs (which takes out things like a printed title or a website
// address); the game finds the areas to paint in it when a finger taps (gfx/coloring.js).
// A group's `title` is shown under its card; its first page is the card's picture.
export const COLORING_GROUPS = [
    {
        id: 'looney-tunes',
        title: 'Looney Tunes',
        pages: ['strus-pedziwiatr', 'looney-tunes', 'baby-kojot', 'domek-strusia']
    },
    {
        id: 'wednesday',
        title: 'Wednesday',
        pages: ['wednesday', 'wednesday-parasol', 'wednesday-mala', 'rodzina-addamsow', 'herb-nevermore']
    }
];

// Every page, with its group (`group` id, `title` of the group).
export const COLORING_PAGES = COLORING_GROUPS.flatMap((group) =>
    group.pages.map((id) => ({ id, group: group.id, title: group.title })));

const DIR = 'assets/coloring';

// Path relative to docs/.
export const coloringImage = (page) => `${DIR}/${page.id}.png`;

export function getColoringGroup(id) {
    return COLORING_GROUPS.find((g) => g.id === id) || null;
}

export function getColoringPage(id) {
    return COLORING_PAGES.find((p) => p.id === id) || null;
}

export const groupPages = (group) => COLORING_PAGES.filter((p) => p.group === group.id);
