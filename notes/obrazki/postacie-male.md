# Obrazki: `docs/assets/gfx/postacie-male/`

Postacie 32×32: mapa i siatka wyboru postaci. 27 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Postacie w rozmiarze 32×32 (postać na mapie, ekran wyboru postaci, przyjaciel odwiedzający chorą postać w szpitalu). Każda postać ma trzy pliki: zwykły, `-oczy-zamkniete` (mrugnięcie, pokazywane na 140 ms co 1,8–4,2 s) i `-je` (klatka żucia). Wersje 64×64 są w `postacie/`.

**Jak powstały (sprawdzone: odtwarza wszystkie 54 pliki postaci piksel w piksel).** Źródłem każdej postaci jest mała maska (16×16, a dla Gabi 32×32) podana niżej jako siatka liter z legendą kolorów. Obrazek wynikowy to `redraw(maska, opcje)` – funkcja poniżej (JavaScript; maska to tablica wierszy, każdy wiersz to tablica kolorów `'#rrggbb'` albo `''` dla pustego piksela; wynik w tym samym formacie):

- Titi, Lili, Harry, Harbin, Karabilein, Leili: `postacie-male` = `redraw(maska16, { scale: 2, epx: true })` (czyste Scale2x), `postacie` = `redraw(maska16, { scale: 4, epx: true })` (Scale2x dwa razy, potem obrys zwężony o 1 px tam, gdzie jest gruby, i cienkie kreski dorysowane piórem 2 px).
- Gabi: `postacie-male/gabi` = maska 32×32 bez zmian, `postacie/gabi` = `redraw(maska32, { scale: 2, epx: true })`.
- Mordka i Mysia: `postacie-male` = `redraw(maska16, { scale: 2 })`, `postacie` = `redraw(maska16, { scale: 4 })` – bez Scale2x, czyli wygładzanie gaussowskie: każdy nowy piksel dostaje kolor, który ma największą sumę wag `exp(-d²/(2·0,45²))` wśród pikseli źródła w promieniu 2 (d mierzone w pikselach źródła od środka nowego piksela), a potem obrys (#6b4a5e) przy ×4 jest ścieniony do 2 px (przy ×2 zostaje 1 px). Efekt: krawędzie są zaokrąglone, a obrys ma stałą grubość.
- `wspolne/kupka`, `wspolne/serce`, `wspolne/ziarenko` = `redraw(maska, { scale: 3, line: 1 })`.

Kolejność kolorów ma znaczenie przy remisach: etykiety kolorów nadawane są w kolejności pierwszego wystąpienia przy skanowaniu maski wierszami od góry, od lewej – dlatego trzeba podać maskę dokładnie jak niżej. „Obrys” to kolor najczęściej stykający się z pustym tłem (w maskach: litera O).

```js
// Port of renderRedrawn from export-gfx.mjs, on grids of colour strings ('' = empty).
export function redraw(srcRows, { scale: k, epx = false, sigma = 0.45, line: lineOpt, noOutline = false }) {
    const h = srcRows.length, w = srcRows[0].length;
    const colors = [''];
    const index = { '': 0 };
    const src = new Int32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const key = srcRows[y][x];
        if (index[key] === undefined) { index[key] = colors.length; colors.push(key); }
        src[y * w + x] = index[key];
    }
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : src[y * w + x]);
    const edge = new Map();
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const l = at(x, y);
        if (l && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !at(x + dx, y + dy))) edge.set(l, (edge.get(l) || 0) + 1);
    }
    const outline = noOutline ? -1 : [...edge.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? -1;
    const W = w * k, H = h * k;
    const out = new Int32Array(W * H);
    const score = new Float64Array(colors.length);
    if (epx) {
        let grid = Int32Array.from(src); let gw = w, gh = h;
        const steps = { 2: [2], 3: [3], 4: [2, 2], 6: [3, 2] }[k];
        steps.forEach((f) => {
            const g = (x, y) => grid[Math.min(gh - 1, Math.max(0, y)) * gw + Math.min(gw - 1, Math.max(0, x))];
            const nw = gw * f; const next = new Int32Array(nw * gh * f);
            for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
                const [A, B, C, D, E, F, G, Hh, I] = [g(x - 1, y - 1), g(x, y - 1), g(x + 1, y - 1), g(x - 1, y), g(x, y), g(x + 1, y), g(x - 1, y + 1), g(x, y + 1), g(x + 1, y + 1)];
                let cells;
                if (f === 2) cells = [D === B && B !== F && D !== Hh ? D : E, B === F && B !== D && F !== Hh ? F : E, D === Hh && D !== B && Hh !== F ? D : E, Hh === F && D !== Hh && B !== F ? F : E];
                else throw new Error('f3');
                cells.forEach((v, i) => { next[(y * f + Math.floor(i / f)) * nw + x * f + (i % f)] = v; });
            }
            grid = next; gw = nw; gh *= f;
        });
        out.set(grid);
    } else {
        for (let Y = 0; Y < H; Y++) for (let X = 0; X < W; X++) {
            const sx = (X + 0.5) / k - 0.5, sy = (Y + 0.5) / k - 0.5;
            score.fill(0);
            for (let y = Math.floor(sy) - 2; y <= Math.ceil(sy) + 2; y++) for (let x = Math.floor(sx) - 2; x <= Math.ceil(sx) + 2; x++) {
                const d2 = (x - sx) ** 2 + (y - sy) ** 2;
                score[at(x, y)] += Math.exp(-d2 / (2 * sigma * sigma));
            }
            let best = 0;
            for (let l = 1; l < score.length; l++) if (score[l] > score[best]) best = l;
            out[Y * W + X] = best;
        }
    }
    const line = lineOpt || Math.max(1, Math.round(k / 2));
    const cut = Math.floor((k - line) / 2);
    if (outline > 0 && cut > 0) {
        let frontier = [];
        const label = Int32Array.from(out);
        const seen = new Uint8Array(W * H);
        for (let p = 0; p < W * H; p++) if (out[p] !== outline) { seen[p] = 1; frontier.push(p); }
        const border = [];
        for (let p = 0; p < W * H; p++) {
            const x = p % W, y = (p - x) / W;
            if (!seen[p] && (x === 0 || y === 0 || x === W - 1 || y === H - 1)) { seen[p] = 1; label[p] = 0; border.push(p); }
        }
        for (let step = 0; step < cut; step++) {
            const next = step === 0 ? border : [];
            frontier.forEach((p) => {
                const x = p % W, y = (p - x) / W;
                [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
                    const nx = x + dx, ny = y + dy;
                    if (nx < 0 || ny < 0 || nx >= W || ny >= H) return;
                    const q = ny * W + nx;
                    if (!seen[q]) { seen[q] = 1; label[q] = label[p]; next.push(q); }
                });
            });
            frontier = next;
        }
        const depth = new Int32Array(W * H).fill(-1);
        let ring = [];
        for (let p = 0; p < W * H; p++) if (out[p] !== outline) { depth[p] = 0; ring.push(p); }
        for (let d = 1; ring.length; d++) {
            const next = [];
            ring.forEach((p) => {
                const x = p % W, y = (p - x) / W;
                [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
                    const nx = x + dx, ny = y + dy;
                    if (nx >= 0 && ny >= 0 && nx < W && ny < H && depth[ny * W + nx] < 0) { depth[ny * W + nx] = d; next.push(ny * W + nx); }
                });
            });
            ring = next;
        }
        const need = cut + Math.ceil(line / 2);
        for (let p = 0; p < W * H; p++) {
            if (out[p] !== outline || label[p] === outline) continue;
            const x = p % W, y = (p - x) / W;
            let deep = false;
            for (let yy = Math.max(0, y - k); yy <= Math.min(H - 1, y + k) && !deep; yy++) for (let xx = Math.max(0, x - k); xx <= Math.min(W - 1, x + k); xx++) {
                if (out[yy * W + xx] === outline && depth[yy * W + xx] >= need) { deep = true; break; }
            }
            out[p] = deep ? label[p] : outline;
        }
    }
    const pen = line;
    const dab = (cx, cy, l) => {
        const x0 = Math.round(cx - pen / 2), y0 = Math.round(cy - pen / 2);
        for (let y = y0; y < y0 + pen; y++) for (let x = x0; x < x0 + pen; x++) if (x >= 0 && y >= 0 && x < W && y < H) out[y * W + x] = l;
    };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const l = at(x, y);
        if (!l || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => at(x + dx, y + dy) === l)) continue;
        const diagonal = [[1, 1], [1, -1], [-1, 1], [-1, -1]].some(([dx, dy]) => at(x + dx, y + dy) === l);
        if (!diagonal && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !at(x + dx, y + dy))) continue;
        const cx = (x + 0.5) * k, cy = (y + 0.5) * k;
        dab(cx, cy, l);
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dx, dy]) => {
            if (at(x + dx, y + dy) === l) for (let t = 0; t <= 1; t += 1 / (2 * k)) dab(cx + dx * k * t, cy + dy * k * t, l);
        });
    }
    const rows = [];
    for (let Y = 0; Y < H; Y++) { const r = []; for (let X = 0; X < W; X++) r.push(colors[out[Y * W + X]]); rows.push(r); }
    return rows;
}
```

Pomocniczo: maskę z liter zamienia się na kolory przez legendę (litera spoza legendy, w tym `.`, = pusty piksel).

## `postacie-male/gabi.png`
32×32 px, kotwica (16, 16). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c.

Maska 32×32 = gotowy obrazek (legenda: O = #6a5a8c, G = #d9a53a, H = #7f9cf0, T = #7fe0d4, M = #e08ad6, K = #f28cc8, k = #ffc6e6, S = #c98a62, s = #a86c4c, E = #5a3426, B = #8a5a3a, W = #ffffff, C = #e88e8e, R = #b8505e, P = #e58ac8, p = #c96fb4, F = #c8b8f5, f = #a898ea, Y = #ffd65a; `.` = puste):

```
.......O................O.......
.......OOO............OOO.......
.......OKKO....O.....OKKO.......
......OKkkKOOOOHOOOOOKkkKO......
......OkKKKKKKKKKKKKKKKKkO......
.....OKkkKKMHHHHHHTHHKKkkKO.....
.....OKKKHHHHHHHTHMHHHHKKKO.....
....OKTHHHHHSSSHSSSSHHHTHMO.....
....OHMHHHHSSSSSSSSSSHHHHHO.....
...OHHHTHSSSSSSSSSSSSSHHTHMG....
...OHTHMHSSWEESSSSWEESHHHHYYG...
...OHHHHTSSEEESSSSEEESHHYTYYG.G.
...OHHTHMSSEBBSSSSEBBSHYYYYYYGYG
...OHHHHHSCSSSSssSSSSCTHYYYOOYG.
..OHHHHTHMSSSRSSSSRSSHMHHYYYYG..
..OMHHHHHHTSSSRRRRSSHHHTSYYYYG..
..OHHHHHTHMHSSSSSSSHHTHSSYYHYG..
..OHMHHHHHHTHHSSSSHHHHSSTHHHO...
..OHHHHHHTHSSSSSSSSSSSSHMHHHO...
..OTHMHHHHPPPPTTTTPPPPHHHTHHO...
...OHHHHHOOPPPPTTPPPPOHTHMHO....
....OHMHO..OpPPpPPpPO.OHHHO.....
.....OOO...OPPPPPPPPO..OOO......
............OpPPpPPO............
............OPPPPPPO............
.............OpPPpO.............
.............OPPPPO.............
..........OOOPPPPPPOO...........
........OOFFFFFFFFFFFOO.........
.......OFFFFFFFFFFFFFFFO........
........OOfffffffffffOO.........
..........OOOOOOOOOOO...........
```

## `postacie-male/gabi-je.png`
32×32 px, kotwica (16, 16). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „je” (klatka żucia).

Jak `postacie-male/gabi.png` ze zmianami (x,y)→litera: (13,14)→S, (18,14)→S, (14,15)→E, (15,15)→E, (16,15)→E, (17,15)→E, (14,16)→R, (15,16)→R, (16,16)→R, (17,16)→R.

## `postacie-male/gabi-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „oczy zamknięte” (mrugnięcie).

Jak `postacie-male/gabi.png` ze zmianami (x,y)→litera: (11,10)→S, (12,10)→S, (13,10)→S, (18,10)→S, (19,10)→S, (20,10)→S, (11,12)→S, (12,12)→S, (13,12)→S, (18,12)→S, (19,12)→S, (20,12)→S.

## `postacie-male/harbin.png`
32×32 px, kotwica (16, 16). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e.

Maska 16×16 (legenda: O = #6b4a5e, B = #fbd3e2, E = #3d2b3d; `.` = puste):

```
...OOOOOOOOOO...
..O..........O..
.O...OOOOOO...O.
.O..OBBBBBBO..O.
O..OBBEEBEEBO..O
O..OBBEEBEEBO..O
O..OBBBBEBBBO..O
O..OBEEEEEBBO..O
O...OBBBBBBO...O
O..OBBBBBBBBO..O
O..OBBBBBBBBO..O
O..OBBBBBBBBO..O
O...OBBOOBBO...O
O...OBO..OBO...O
O...OOO..OOO...O
O..............O
```

Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/harbin-je.png`
32×32 px, kotwica (16, 16). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/harbin.png` ze zmianami (x,y)→litera: (6,7)→R, (7,7)→R, (8,7)→R, (6,8)→E, (7,8)→E, (8,8)→E. Nowe litery: R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/harbin-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/harbin.png` ze zmianami (x,y)→litera: (6,4)→B, (7,4)→B, (9,4)→B, (10,4)→B. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/harry.png`
32×32 px, kotwica (16, 16). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e.

Maska 16×16 (legenda: O = #6b4a5e, B = #ffd6b8, E = #3d2b3d, W = #ffffff; `.` = puste):

```
................
................
..........OO....
.........OBBO...
....OOOOOBBBBO..
...OBBBBBBBBBO..
..OBBBBBBBBBBO..
..OBBBBEEEBBBO..
.OBBBBEWWWEBBEO.
.OBBBBEWWWEBEBE.
.OBBBBBEEEBBBEO.
.OBBBBBBBBBBBBO.
.OBBBBBBBBBBBBO.
.OBBBBBBBBBBBBO.
.OOBOBOBOBOBOBO.
.O.O.O.O.O.O.O..
```

Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/harry-je.png`
32×32 px, kotwica (16, 16). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/harry.png` ze zmianami (x,y)→litera: (6,12)→E, (7,12)→R, (8,12)→R, (9,12)→E, (7,13)→E, (8,13)→E. Nowe litery: R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/harry-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/harry.png` ze zmianami (x,y)→litera: (7,7)→B, (8,7)→B, (9,7)→B, (6,8)→B, (7,8)→B, (8,8)→B, (9,8)→B, (10,8)→B, (7,9)→E, (8,9)→E, (9,9)→E, (7,10)→B, (8,10)→B, (9,10)→B. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/karabilein.png`
32×32 px, kotwica (16, 16). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e.

Maska 16×16 (legenda: O = #6b4a5e, B = #cfe8ff; `.` = puste):

```
................
................
................
.....OOO.OOO....
....OBBBOBBBO...
...OBBBBBBBBBO..
...OBBBBBBBBBO..
...OBBBBBBBBBO..
...OBBBBBBBBO...
...OBBBBBBBBO...
...OBBBBBBBO....
...OBBBBBBBO....
...OBBBBBBBO....
...OBBOBBBOO....
...OBO.OBO......
....O...O.......
```

Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/karabilein-je.png`
32×32 px, kotwica (16, 16). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/karabilein.png` ze zmianami (x,y)→litera: (6,8)→E, (7,8)→R, (8,8)→E, (7,9)→E. Nowe litery: E = #3d2b3d, R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/karabilein-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Identyczny z `postacie-male/karabilein.png` (ta postać nie ma oczu, więc mrugnięcie niczego nie zmienia).

## `postacie-male/leili.png`
32×32 px, kotwica (16, 16). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae.

Maska 16×16 (legenda: O = #4f74c8, E = #3d5cb0, W = #ffffff, T = #8fdcea, G = #c4ecc8, M = #d9a6d6, P = #f5bfd2, S = #f4aaae; `.` = puste):

```
................
..OO........OO..
.OMTO......OGMO.
.OMTTOOOOOOGTMO.
.OTTTGGTTGGGTTO.
OGGGGGGTTGGGTTTO
OGGWETTTTTTWETTO
OGGEETTTTTTEETTO
OGPPPPPPPPPPPPTO
OGGSSSSEESSSSTTO
OGSSSSSSSSSSSSTO
OTSSSSSSSSSSSSGO
OTTSSSSSSSSSSGGO
.OTTPSSSSSPPGGO.
..OOTGGGTTTTOO..
....OOOOOOOO....
```

Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/leili-je.png`
32×32 px, kotwica (16, 16). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/leili.png` ze zmianami (x,y)→litera: (2,10)→G, (3,10)→T, (4,10)→T, (5,10)→T, (6,10)→T, (7,10)→T, (8,10)→T, (9,10)→T, (10,10)→T, (11,10)→T, (12,10)→T, (13,10)→T, (2,11)→T, (3,11)→T, (4,11)→T, (5,11)→T, (6,11)→T, (7,11)→T, (8,11)→T, (9,11)→T, (10,11)→T, (11,11)→T, (12,11)→T, (13,11)→T, (3,12)→T, (4,12)→T, (5,12)→T, (6,12)→T, (7,12)→T, (8,12)→T, (9,12)→T, (10,12)→T, (11,12)→T, (12,12)→T, (5,13)→T, (6,13)→T, (7,13)→T, (8,13)→T, (9,13)→T. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/leili-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/leili.png` ze zmianami (x,y)→litera: (3,6)→G, (4,6)→T, (11,6)→T, (12,6)→T. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/lili.png`
32×32 px, kotwica (16, 16). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e.

Maska 16×16 (legenda: O = #6b4a5e, B = #bfe8d6, E = #3d2b3d; `.` = puste):

```
................
................
........O..OO...
.......OBO.OBOO.
......OBBBOBBBO.
......OBBBBBBBBO
.OOOOOBBBBBBBBO.
OO.OBBBEBBBEBBO.
.OOBBBBEBBBEBBO.
..OOBBEBBEBBEBO.
....OBBEEEEEBBO.
.....OBBBBBBBO..
.....OBBBBBBO...
.....OBBOBBBO...
......OO.OBO....
......O...O.....
```

Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/lili-je.png`
32×32 px, kotwica (16, 16). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/lili.png` ze zmianami (x,y)→litera: (8,10)→R, (9,10)→R, (10,10)→R, (8,11)→E, (9,11)→E, (10,11)→E. Nowe litery: R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/lili-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/lili.png` ze zmianami (x,y)→litera: (6,7)→E, (10,7)→E, (7,8)→B, (11,8)→B. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/mordka.png`
32×32 px, kotwica (16, 16). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e.

Maska 16×16 (legenda: O = #6b4a5e, E = #3d2b3d, W = #ffffff, B = #f2b880, L = #fff1e0, P = #f7a8b8; `.` = puste):

```
................
..OO........OO..
.OPBO......OBPO.
.OPBBOOOOOOBBPO.
.OBBBBBBBBBBBBO.
OBBBBBBBBBBBBBBO
OBBWEBBBBBBWEBBO
OBBEEBBBBBBEEBBO
OBPPLLLPPLLLPPBO
OBBLLLLOOLLLLBBO
OBLLLLLLLLLLLLBO
OBLLLLLLLLLLLLBO
OBBLLLLLLLLLLBBO
.OBBPPLLLLPPBBO.
..OOBBBBBBBBOO..
....OOOOOOOO....
```

Obrazek = `redraw(maska, { scale: 2 })` (wygładzanie gaussowskie).

## `postacie-male/mordka-je.png`
32×32 px, kotwica (16, 16). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/mordka.png` ze zmianami (x,y)→litera: (1,8)→P, (14,8)→P, (6,9)→O, (7,9)→P, (8,9)→P, (9,9)→O. Obrazek = `redraw(maska, { scale: 2 })`.

## `postacie-male/mordka-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/mordka.png` ze zmianami (x,y)→litera: (3,6)→B, (4,6)→B, (11,6)→B, (12,6)→B, (3,7)→O, (4,7)→O, (11,7)→O, (12,7)→O. Obrazek = `redraw(maska, { scale: 2 })`.

## `postacie-male/mysia.png`
32×32 px, kotwica (16, 16). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e.

Maska 16×16 (legenda: O = #6b4a5e, E = #3d2b3d, W = #ffffff, B = #c9c3d6, L = #fbf8ff, P = #f7a8c4; `.` = puste):

```
................
..OO........OO..
.OPBO......OBPO.
.OPBBOOOOOOBBPO.
.OBBBBBBBBBBBBO.
OBBBBBBBBBBBBBBO
OBBWEBBBBBBWEBBO
OBBEEBBBBBBEEBBO
OBPPLLLPPLLLPPBO
OBBLLLLOOLLLLBBO
OBLLLLLLLLLLLLBO
OBLLLLLLLLLLLLBO
OBBLLLLLLLLLLBBO
.OBBPPLLLLPPBBO.
..OOBBBBBBBBOO..
....OOOOOOOO....
```

Obrazek = `redraw(maska, { scale: 2 })` (wygładzanie gaussowskie).

## `postacie-male/mysia-je.png`
32×32 px, kotwica (16, 16). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/mysia.png` ze zmianami (x,y)→litera: (1,8)→P, (14,8)→P, (6,9)→O, (7,9)→P, (8,9)→P, (9,9)→O. Obrazek = `redraw(maska, { scale: 2 })`.

## `postacie-male/mysia-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/mysia.png` ze zmianami (x,y)→litera: (3,6)→B, (4,6)→B, (11,6)→B, (12,6)→B, (3,7)→O, (4,7)→O, (11,7)→O, (12,7)→O. Obrazek = `redraw(maska, { scale: 2 })`.

## `postacie-male/titi.png`
32×32 px, kotwica (16, 16). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e.

Maska 16×16 (legenda: O = #6b4a5e, B = #d9ccf5; `.` = puste):

```
........OOOO....
.......OBBBBO...
.......OBBBBBO..
.......OBBBBBBO.
........OBBBBBO.
........OBBBBBO.
........OBBBBO..
...OOOOOBBBBO...
..OBBBBBBBBBO...
.OBBBBBBBBBO....
.OBBBBBBBBBO....
.OBBBBBBBBO.....
.OBBBBBBBBO.....
..OBBOBBBOO.....
..OBO.OBO.OO....
...O...O..O.....
```

Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/titi-je.png`
32×32 px, kotwica (16, 16). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/titi.png` ze zmianami (x,y)→litera: (11,4)→E, (12,4)→R, (12,5)→E. Nowe litery: E = #3d2b3d, R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

## `postacie-male/titi-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Identyczny z `postacie-male/titi.png` (ta postać nie ma oczu, więc mrugnięcie niczego nie zmienia).
