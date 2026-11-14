# Obrazki: `docs/assets/gfx/terrarium/`

Terrarium chomika. 17 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Ekran terrarium (domowa klatka chomika: akwarium ze ściółką, domek, kołowrotek, miska, poidełko i wanienka z pianą).

## `terrarium/akwarium.png`
522×330 px, kotwica (9, 12) – lewy górny róg szyby. Szklane terrarium z pokrywą, ściółką i podstawką. Kolejno: podstawka – prostokąt `#6b4a5e` x0–521, y319–329, w nim `#e9c9b5` x1–519, y320–324 i linia `#d8b39c` x1–519, y325. Szyba – prostokąt `#6b4a5e` x6–515, y9–320 (ramka 3 px), szkło `#eef8ff` x9–512, y12–317, górny pas `#ddeefa` x9–512, y12–16. Pokrywa – prostokąt `#6b4a5e` x1–519, y0–10, w nim `#d9ccf5` x3–518, y1–6 i linia `#c3b3ea` x3–518, y7. Ściółka `#f6e3c4`: dla każdej kolumny i = 0..503 (x = 9+i) od y = 257 + round(sin(i/11)·2 + sin(i/5)·0,6) do y317 (falista górna krawędź, y254–259). Drobinki `#e8cc9e` 2×1 px: 2196 sztuk z generatora seed = 5, wywołanie rand(min, max): seed = (seed·9301 + 49297) mod 233280, wynik min + ⌊seed/233280 · (max−min+1)⌋; dla każdej drobinki x = 9 + rand(0, 502), potem y = rand(262, 316). Odblask na szybie `#fcfeff` (biały 80% na szkle): ukośne linie 1 px – piksele (18+i, 39−i) dla i = 0..17 oraz (27+i, 39−i) dla i = 0..8. Rogi poza prostokątami przezroczyste.

## `terrarium/domek-chomika.png`
62×57 px, kotwica (1, 15) – lewy górny róg ściany. Różowy domek ze spadzistym dachem i drzwiami. Dach (y0–14): wiersz y0 obrys `#6b4a5e` x29–32; wiersze r = 1..14 (y = r) `#d9a0c8` od x = 29−2r do x = 32+2r (w y14 x1–60). Ściany y15–56: kolumny x0 i x61 obrys, wnętrze `#f7b2cc` x1–60, z pasem `#eea0bd` y15–17 pod dachem. Drzwi `#8a5c9e`: prostokąt x23–37, y34–56 i szerszy x22–39, y37–56 (zaokrąglona góra). Dół bez obrysu.

## `terrarium/kolo-obrot-0.png`
109×109 px, kotwica (54, 54) – oś. Kołowrotek; 6 klatek obrotu co 15°. Środek (54, 54): koło r=54 `#c9b8ef`, w nim koło r=49 `#eef8ff` (obręcz 5 px). Cztery szprychy `#c9b8ef` pod kątami a = kąt klatki + k·90° (k = 0..3; kąt rośnie zgodnie z ruchem wskazówek zegara, 0° = w prawo): dla t = 0..48 kwadrat 2×2 z lewym górnym rogiem (54 + round(cos a·t), 54 + round(sin a·t)). Oś: koło r=5 `#b8a6dc`. Bez obrysu `#6b4a5e`. Klatka 0: szprychy poziomo i pionowo.

## `terrarium/kolo-obrot-15.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 15°.

## `terrarium/kolo-obrot-30.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 30°.

## `terrarium/kolo-obrot-45.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 45° (po przekątnych).

## `terrarium/kolo-obrot-60.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 60°.

## `terrarium/kolo-obrot-75.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 75°.

## `terrarium/stojak-kolka.png`
26×63 px, kotwica (12, 63) – podłoga pod osią. Stojak kołowrotka w kolorze `#b8a6dc`, bez obrysu: pionowy słupek x11–15, y0–62 i pozioma stopka x0–25, y60–62 (odwrócone T).

## `terrarium/miska-z-ziarnami.png`
33×12 px, kotwica (17, 12) – podłoga pod środkiem. Miętowa miska z ziarenkami, bez obrysu: brzeg `#a6dcc4` x0–32, y3–5; misa `#bfe8d6` x2–31, y6–11; cztery ziarenka `#e0a46c` 3×2.

Siatka pikseli (33×12; . = przezroczysty, A = #e0a46c, B = #a6dcc4, C = #bfe8d6):

```
..............AAA...........AAA..
........AAA...AAA.....AAA...AAA..
........AAA...........AAA........
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
..CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC.
..CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC.
..CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC.
..CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC.
..CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC.
..CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC.
```

## `terrarium/poidelko.png`
13×53 px, kotwica (0, 0). Poidełko na ścianie terrarium. Prostokąt obrysu `#6b4a5e` x0–12, y0–38; butelka `#cfe8ff` x1–11, y1–15; woda `#9fd0f5` x1–11, y16–36 (y37–38 obrys dna); rurka `#b7b0c4` x4–6, y39–52 (bez obrysu).

## `terrarium/wanna-woda-z-tylu.png`
74×5 px, kotwica (37, 5). Tafla wody w wanience, widoczna za chomikiem. Prostokąt `#6b4a5e` 74×5, wiersze y0–1 całe obrysem, w y2–4 wnętrze `#9fd0f5` x1–72.

## `terrarium/wanna.png`
82×44 px, kotwica (41, 11). Przód wanienki z pianą (rysowany przed chomikiem): nóżki `#d9a0c8` (x10–17 i x65–72, y38–43), biała wanna `#ffffff` w ramce 2 px `#6b4a5e` z różowym paskiem `#f7b2cc` (y22–24) i cieniem `#e6eefc` (y30–34), rant `#f7f9ff` w obrysie, nad rantem pięć kłębków piany o środkach w y9 i x = 11, 25, 41, 57, 71 (koła r = 9, 7, 9, 7, 9 `#dcd3f2`, na nich r = 8, 6, 8, 6, 8 `#ffffff`).

Siatka pikseli (82×44; . = przezroczysty, A = #dcd3f2, B = #ffffff, C = #6b4a5e, D = #f7f9ff, E = #f7b2cc, F = #e6eefc, G = #d9a0c8):

```
...........A.............................A.............................A..........
.......AAAABAAAA.....................AAAABAAAA.....................AAAABAAAA......
.....AABBBBBBBBBAA.......A.........AABBBBBBBBBAA.........A.......AABBBBBBBBBAA....
....AABBBBBBBBBBBAA..AAAABAAAA....AABBBBBBBBBBBAA....AAAABAAAA..AABBBBBBBBBBBAA...
....ABBBBBBBBBBBBBA.AABBBBBBBAA...ABBBBBBBBBBBBBA...AABBBBBBBAA.ABBBBBBBBBBBBBA...
...ABBBBBBBBBBBBBBBAABBBBBBBBBAA.ABBBBBBBBBBBBBBBA.AABBBBBBBBBAABBBBBBBBBBBBBBBA..
...ABBBBBBBBBBBBBBBABBBBBBBBBBBA.ABBBBBBBBBBBBBBBA.ABBBBBBBBBBBABBBBBBBBBBBBBBBA..
..ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBA.
..ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBA.
..ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBA.
CCABBBBBBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBAC
CDABBBBBBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBAC
CDDABBBBBBBBBBBBBBBABBBBBBBBBBBADABBBBBBBBBBBBBBBADABBBBBBBBBBBABBBBBBBBBBBBBBBADC
CDDABBBBBBBBBBBBBBBAABBBBBBBBBAADABBBBBBBBBBBBBBBADAABBBBBBBBBAABBBBBBBBBBBBBBBADC
CDDDABBBBBBBBBBBBBADAABBBBBBBAADDDABBBBBBBBBBBBBADDDAABBBBBBBAADABBBBBBBBBBBBBADDC
CCCCAABBBBBBBBBBBAACCAAAABAAAACCCCAABBBBBBBBBBBAACCCCAAAABAAAACCAABBBBBBBBBBBAACCC
..CCBAABBBBBBBBBAABBBBBBBABBBBBBBBBAABBBBBBBBBAABBBBBBBBBABBBBBBBAABBBBBBBBBAACC..
..CCBBBAAAABAAAABBBBBBBBBBBBBBBBBBBBBAAAABAAAABBBBBBBBBBBBBBBBBBBBBAAAABAAAABBCC..
..CCBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEECC..
..CCEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEECC..
..CCEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEECC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
..CCFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCC..
..CCFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCC..
..CCFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCC..
..CCFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCC..
..CCFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFCC..
..CCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCC..
...CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC...
....CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC....
..........GGGGGGGG...............................................GGGGGGGG.........
..........GGGGGGGG...............................................GGGGGGGG.........
..........GGGGGGGG...............................................GGGGGGGG.........
..........GGGGGGGG...............................................GGGGGGGG.........
..........GGGGGGGG...............................................GGGGGGGG.........
..........GGGGGGGG...............................................GGGGGGGG.........
```

## `terrarium/babelek-maly.png`
7×7 px, kotwica (3, 3). Bąbelek piany z kąpieli. Koło r=3 `#dcd3f2`, na nim koło r=2 `#ffffff`, piksel `#9fd0f5` w (1, 1) (względem kotwicy (−2, −2)).

Siatka pikseli (7×7; . = przezroczysty, A = #dcd3f2, B = #9fd0f5, C = #ffffff):

```
...A...
.BACAA.
ACCCCCA
ACCCCCA
ACCCCCA
.AACAA.
...A...
```

## `terrarium/babelek-sredni.png`
9×9 px, kotwica (4, 4). Jak `babelek-maly`: koło r=4 `#dcd3f2`, r=3 `#ffffff`, piksel `#9fd0f5` w (2, 2).

## `terrarium/babelek-duzy.png`
11×11 px, kotwica (5, 5). Jak `babelek-maly`: koło r=5 `#dcd3f2`, r=4 `#ffffff`, piksel `#9fd0f5` w (2, 2).

## `terrarium/babelek-najwiekszy.png`
13×13 px, kotwica (6, 6). Jak `babelek-maly`: koło r=6 `#dcd3f2`, r=5 `#ffffff`, piksel `#9fd0f5` w (3, 3).
