// Spelling tasks for the school (scenes/SchoolScene.js), after a second-grade workbook on
// "ó niewymienne": sentences to put together from words, riddles, rebuses and a word
// search. Each lesson draws its tasks at random from the lists below, so every round is a
// little different. To add tasks, add to the lists; `npm run check` checks them.
// Pictures (`pic`) are the ids of PICTURES in gfx/pictures.js.

import { PICTURES } from '../gfx/pictures.js';

// The lessons, in the order of the desks in the classroom. `count` is how many tasks a
// round has; `say` is read aloud when the lesson opens (and from the speaker button).
export const LESSONS = [
    { id: 'rozsypanka', title: 'Ułóż zdanie', count: 3, say: 'Ułóż zdanie z wyrazów. Stukaj w nie po kolei.' },
    { id: 'zagadki', title: 'Zagadki', count: 3, say: 'Posłuchaj zagadki i wybierz obrazek.' },
    { id: 'rebusy', title: 'Rebusy', count: 3, say: 'Rozwiąż rebus. Ułóż słowo z literek.' },
    { id: 'wykreslanka', title: 'Wykreślanka', count: 1, say: 'Znajdź sześć słów z ó. Przeciągnij palcem po literkach.' }
];

// Sentences, written as they should come out: the words are shuffled for the child.
export const SENTENCES = [
    'Wróbel siedzi na żółtym płocie.',
    'Mała córka zbiera piękne róże.',
    'Żółw wędruje powoli przez ogród.',
    'Wiewiórka chowa orzechy w dziupli.',
    'Mrówki niosą okruszki do domu.',
    'Józek rysuje żółtym ołówkiem.',
    'Jaskółki latają wysoko nad łąką.',
    'Sójka siedzi na gałęzi.',
    'Na półce stoi mój kubek.',
    'Dobra wróżka spełnia życzenia.',
    'Ogórki rosną w ogródku babci.',
    'Kózka skacze po zielonej łące.',
    'Ślimak niesie swój domek.',
    'Córka króla lubi truskawki.',
    'Mój brat ma krótkie włosy.',
    'Pod górą mieszka mądra sowa.',
    'Królik chrupie słodką marchewkę.',
    'Król ma złotą koronę.'
];

// Riddles: the child picks the right picture out of three, then fills in the tricky
// letters of its name (TRAPS).
export const RIDDLES = [
    { pic: 'wiewiorka', text: 'Mam puszysty, rudy ogon.\nOrzeszki w dziupli chowam.' },
    { pic: 'slimak', text: 'Chodzę bardzo, bardzo wolno.\nDomek noszę na plecach.' },
    { pic: 'zolw', text: 'Mam twardą skorupę\ni krótkie łapki.' },
    { pic: 'mrowka', text: 'Jestem malutka, ale silna.\nBuduję kopiec w lesie.' },
    { pic: 'kot', text: 'Mruczę, gdy mnie głaszczesz.\nLubię mleko.' },
    { pic: 'ryba', text: 'Mieszkam w wodzie.\nMam łuski i płetwy.' },
    { pic: 'wrobel', text: 'Jestem mały i szary.\nĆwierkam na dachu.' },
    { pic: 'jez', text: 'Mam na plecach kolce.\nZwijam się w kulkę.' },
    { pic: 'krolik', text: 'Mam długie uszy.\nChrupię marchewkę.' },
    { pic: 'zaba', text: 'Jestem zielona i skaczę.\nKumkam w stawie.' },
    { pic: 'roza', text: 'Jestem pięknym kwiatem.\nUważaj na moje kolce.' },
    { pic: 'gora', text: 'Jestem bardzo wysoka.\nNa czubku mam śnieg.' }
];

// Rebuses: parts in a row, each a bit of text or a picture whose name is changed: `drop`
// crosses out letters, `swap: [from, to]` changes letters (shown as "from = to"). The
// answer is what the parts make (rebusAnswer).
export const REBUSES = [
    { parts: ['s', { pic: 'gora', swap: ['g', 'k'] }] },
    { parts: [{ pic: 'mrowka', drop: 'm', swap: ['ka', 'ny'] }] },
    { parts: [{ pic: 'zolw', swap: ['w', 'tko'] }] },
    { parts: [{ pic: 'kot', drop: 'o' }, 'ó', { pic: 'ryba', drop: 'ba' }] },
    { parts: [{ pic: 'roza', swap: ['ża', 'g'] }] },
    { parts: [{ pic: 'wrobel', swap: ['bel', 'g'] }] },
    { parts: [{ pic: 'krolik', drop: 'ik' }] },
    { parts: [{ pic: 'krolik', swap: ['ik', 'owa'] }] },
    { parts: [{ pic: 'zaba', swap: ['ba', 'r'] }] },
    { parts: [{ pic: 'zolw', drop: 'w' }, 'ty'] },
    { parts: [{ pic: 'gora', swap: ['a', 'al'] }] },
    { parts: ['b', { pic: 'roza', drop: 'r', swap: ['ża', 'l'] }] },
    { parts: ['s', { pic: 'roza', drop: 'r', swap: ['ża', 'l'] }] }
];

// Words hidden in the word search, all with ó that can't be explained by another form.
export const SEARCH_WORDS = [
    'krótki', 'żółty', 'róża', 'córka', 'który', 'mózg', 'góra', 'król', 'wróbel', 'mrówka',
    'skóra', 'żółw', 'ołówek', 'sójka', 'półka', 'chór', 'równy', 'ogórek', 'wróżka', 'ósmy',
    'góral', 'jaskółka'
];
export const SEARCH_SIZE = { cols: 9, rows: 8, words: 6 };

// Letters easy to mix up, and the wrong one offered next to each.
export const TRAPS = { 'rz': 'ż', 'ch': 'h', 'ó': 'u', 'ż': 'rz', 'h': 'ch', 'u': 'ó' };

// The tricky letters of a word: [{ at, text, other }], two-letter ones (rz, ch) first.
export function trapsIn(word) {
    const found = [];
    for (let i = 0; i < word.length; i++) {
        const two = word.slice(i, i + 2).toLowerCase();
        const one = word[i].toLowerCase();
        if (TRAPS[two] && two.length === 2) {
            found.push({ at: i, text: word.slice(i, i + 2), other: TRAPS[two] });
            i++;
        } else if (TRAPS[one]) {
            found.push({ at: i, text: word[i], other: TRAPS[one] });
        }
    }
    return found;
}

// A picture's name after a rebus part's changes.
export function rebusPart(part) {
    if (typeof part === 'string') {
        return part;
    }
    let word = PICTURES[part.pic].word;
    if (part.drop) {
        word = word.replace(part.drop, '');
    }
    if (part.swap) {
        word = word.replace(part.swap[0], part.swap[1]);
    }
    return word;
}

export const rebusAnswer = (rebus) => rebus.parts.map(rebusPart).join('');

const shuffle = (list) => Phaser.Utils.Array.Shuffle([...list]);
const pick = (list, n) => shuffle(list).slice(0, n);

// A word search: SEARCH_SIZE letters with `words` of SEARCH_WORDS hidden across (left to
// right) or down. Returns { grid: rows of letters, words: [{ word, x, y, down }] }.
export function makeWordSearch() {
    const { cols, rows, words: count } = SEARCH_SIZE;
    for (;;) {
        const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
        const placed = [];
        for (const word of shuffle(SEARCH_WORDS.filter((w) => w.length <= Math.max(cols, rows)))) {
            if (placed.length === count) {
                break;
            }
            const spots = [];
            for (const down of [false, true]) {
                for (let y = 0; y + (down ? word.length : 1) <= rows; y++) {
                    for (let x = 0; x + (down ? 1 : word.length) <= cols; x++) {
                        const fits = [...word].every((ch, i) => {
                            const cell = grid[y + (down ? i : 0)][x + (down ? 0 : i)];
                            return cell === null || cell === ch;
                        });
                        if (fits) {
                            spots.push({ x, y, down });
                        }
                    }
                }
            }
            if (spots.length) {
                const spot = Phaser.Utils.Array.GetRandom(spots);
                [...word].forEach((ch, i) => {
                    grid[spot.y + (spot.down ? i : 0)][spot.x + (spot.down ? 0 : i)] = ch;
                });
                placed.push({ word, ...spot });
            }
        }
        if (placed.length === count) {
            const filler = 'abcdeghijklłmnoprstuwyzśżó';
            return {
                grid: grid.map((row) => row.map((ch) => ch || filler[Math.floor(Math.random() * filler.length)])),
                words: placed
            };
        }
    }
}

// The tasks of one round of a lesson, as plain data (kept in the registry).
export function makeRound(lessonId) {
    const lesson = LESSONS.find((l) => l.id === lessonId);
    if (lessonId === 'rozsypanka') {
        return pick(SENTENCES, lesson.count).map((sentence) => ({ sentence }));
    }
    if (lessonId === 'zagadki') {
        return pick(RIDDLES, lesson.count).map((riddle) => ({
            ...riddle,
            options: shuffle([riddle.pic, ...pick(Object.keys(PICTURES).filter((id) => id !== riddle.pic), 2)])
        }));
    }
    if (lessonId === 'rebusy') {
        return pick(REBUSES, lesson.count);
    }
    return [makeWordSearch()];
}
