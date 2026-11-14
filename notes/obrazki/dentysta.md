# Obrazki: `docs/assets/gfx/dentysta/`

Gabinet dentysty. 22 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Ekran dentysty (gabinet z fotelem, lampą i plakatem; zbliżenie buzi z zębami, które się szczotkuje i płucze).

## `dentysta/podloga.png`
36×36 px, kotwica (0, 0). Wzór powtarzany – szachownica kafli 18×18 w kolorach `#ffffff` i `#e4f1ff`. Wiersze y0–14: x0–17 biały, x18–35 błękitny; y15–32: x0–17 błękitny, x18–35 biały; y33–35: x0–17 biały, x18–35 błękitny. Okres 36 px w obu kierunkach.

## `dentysta/plakat.png`
54×66 px, kotwica (27, 33). Plakat z zębem na ścianie. Ramka drawBox(0, 0, 54, 66) wypełnienie `#fff7fb`, obrys `#6b4a5e`. Ząb: maska 9×9 powiększona blokowo ×4, lewy górny róg (9, 12):

```
.OOOOOOO.
OWWWWWLWO
OWWWWWWLO
OWWWWWWWO
OWWWWWWWO
.OWWWWWO.
.OWWOWWO.
.OWO.OWO.
..O...O..
```
(O = `#6b4a5e`, W = `#ffffff`, L = `#cfe8ff`, . = nic). Na nim serduszko `#f59bbd`: maska 7×6 ×2, lewy górny róg (32, 45), rysowana na wierzchu (zasłania końcówkę korzenia):

```
.PP.PP.
PPPPPPP
PPPPPPP
.PPPPP.
..PPP..
...P...
```

## `dentysta/lampa.png`
37×37 px, kotwica (18, 18). Okrągła lampa nad fotelem. Koło r=18 `#6b4a5e`, na nim koło r=17 `#fff1c9`, blask: koło r=5 `#ffffff` o środku (13, 13).

## `dentysta/fotel.png`
123×111 px, kotwica (60, 111) – środek podstawy na podłodze. Różowy fotel dentystyczny w kształcie litery L (oparcie po lewej). Kolejno: podstawa drawBox(33, 93, 54, 18) `#d9ccf5`; kolumna – prostokąt `#6b4a5e` x54–65, y72–92; siedzisko drawBox(9, 60, 114, 18) `#f7b2cc`; oparcie drawBox(0, 0, 21, 72) `#f7b2cc`; pasek cienia `#eea0bd` x12–116, y72–74. Wszystkie ramki z obrysem `#6b4a5e`.

## `dentysta/buzia-z-zebami.png`
270×156 px, kotwica (143, 78). Zbliżenie otwartej buzi w dymku: wargi, dziąsła, 6 zębów u góry i 6 u dołu. Dymek: drawBox(15, 0, 255, 156) `#ffffff`, obrys `#6b4a5e`; z lewej ogonek w dół-w-lewo: w wierszach y117–131 trójkąt `#ffffff` przylegający do lewej ramki, ograniczony ukośną linią obrysu 2 px od (14–15, 117) do (0–1, 131) (każdy wiersz o 1 px dalej w lewo); kolumna x16 zostaje obrysem 1 px, kolumna x15 w tych wierszach jest biała. Wargi (środek elips (143, 78)): elipsa `#6b4a5e` rx=111, ry=62, na niej `#f28aa5` rx=110, ry=61, na niej wnętrze ust `#f0a0b4` rx=101, ry=52 (elipsy z poziomych pasków: dx = round(rx·√(1 − dy²/ry²))). Dziąsła `#f7b2cc`: x47–238, y28–35 i x47–238, y120–127. Zęby, każdy 30 px szeroki, x = 53 + 30·i (i = 0..5): górne y33–65 (33 px), dolne y96–122 (27 px). Ząb = prostokąt obrysu z wnętrzem `#ffffff`; dwa narożne piksele od strony środka ust (u górnych zębów dolne rogi, u dolnych górne rogi) w kolorze `#f0a0b4`; połysk `#cfe8ff` 2 px szeroki w x+22..x+23 od y+5, wysokości 11 (górne) / 9 (dolne).

## `dentysta/szczoteczka.png`
61×24 px, kotwica (30, 6). Szczoteczka leżąca poziomo, włosie u góry z prawej. Rączka: obrys x0–60, y13–23, wnętrze `#f7b2cc` x1–59, y14–22, linia `#f59bbd` x3–32 w y19. Główka: obrys x39–60, y0–13, wnętrze `#ffffff` x40–59, y1–13 (zachodzi na górny obrys rączki), pionowe paski włosia `#cfe8ff` 1 px w x = 41, 44, 47, 50, 53, 56 na y1–13.

## `dentysta/kubek.png`
31×33 px, kotwica (15, 16). Kubek z wodą do płukania, lekko zwężający się ku dołowi. Górne 11 wierszy wnętrza `#cfe8ff`, reszta `#bfe8d6`, biały połysk `#ffffff` 2 px po lewej.

Siatka pikseli (31×33; . = przezroczysty, A = #6b4a5e, B = #cfe8ff, C = #ffffff, D = #bfe8d6):

```
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCBBBBBBBBBBBBBBBBBBBBBBBBBA
.ABCCBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABCCBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABCCBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABCCBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABCCBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABCCBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABCCBBBBBBBBBBBBBBBBBBBBBBBBA.
.ADCCDDDDDDDDDDDDDDDDDDDDDDDDA.
..ACCDDDDDDDDDDDDDDDDDDDDDDDA..
..ACCDDDDDDDDDDDDDDDDDDDDDDDA..
..ACCDDDDDDDDDDDDDDDDDDDDDDDA..
..ACCDDDDDDDDDDDDDDDDDDDDDDDA..
..ACCDDDDDDDDDDDDDDDDDDDDDDDA..
..ACCDDDDDDDDDDDDDDDDDDDDDDDA..
..ADDDDDDDDDDDDDDDDDDDDDDDDDA..
..ADDDDDDDDDDDDDDDDDDDDDDDDDA..
...ADDDDDDDDDDDDDDDDDDDDDDDA...
...ADDDDDDDDDDDDDDDDDDDDDDDA...
...ADDDDDDDDDDDDDDDDDDDDDDDA...
...ADDDDDDDDDDDDDDDDDDDDDDDA...
...ADDDDDDDDDDDDDDDDDDDDDDDA...
...ADDDDDDDDDDDDDDDDDDDDDDDA...
...ADDDDDDDDDDDDDDDDDDDDDDDA...
...ADDDDDDDDDDDDDDDDDDDDDDDA...
....ADDDDDDDDDDDDDDDDDDDDDA....
....ADDDDDDDDDDDDDDDDDDDDDA....
....ADDDDDDDDDDDDDDDDDDDDDA....
....AAAAAAAAAAAAAAAAAAAAAAA....
```

## `dentysta/kubek-przechylony.png`
42×40 px, kotwica (20, 21). Kubek przechylony przy płukaniu: `dentysta/kubek.png` obrócony o 60° zgodnie z ruchem wskazówek zegara wokół swojej kotwicy, metodą najbliższego piksela (bez wygładzania), przycięty.

Siatka pikseli (42×40; . = przezroczysty, A = #6b4a5e, B = #cfe8ff, C = #ffffff, D = #bfe8d6):

```
..........................A...............
........................AAA...............
......................AABBBA..............
......................ABBBBA..............
.....................AABBBBBA.............
...................AABBCCCBBAA............
.................AABBCCCCBBBBA............
................ABBCCCCBBBBBBBA...........
................DBCCCCBBBBBBBBA...........
..............AACCCCBBBBBBBBBBBA..........
............AACCCCDBBBBBBBBBBBBA..........
..........AACCCCDDDBBBBBBBBBBBBBA.........
.........AADCCCDDDDDBBBBBBBBBBBBAA........
.........ADDCDDDDDDDBBBBBBBBBBBBBA........
.......AADDDDDDDDDDDDBBBBBBBBBBBBBA.......
......AADDDDDDDDDDDDDBBBBBBBBBBBBBA.......
....AADDDDDDDDDDDDDDDDBBBBBBBBBBBBBA......
...ADDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBA......
..AADDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBBA.....
.AADDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBAA....
ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBBA....
.ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBBA...
.ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBBA...
..ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBBA..
..AADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBA..
...ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBBA.
....ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBBAA
....ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBBBBBBAA.
.....ADDDDDDDDDDDDDDDDDDDDDDDBBBBBBAAAA...
.....ADDDDDDDDDDDDDDDDDDDDDDDDBBBAA.......
......ADDDDDDDDDDDDDDDDDDDDDDDBBAA........
......AADDDDDDDDDDDDDDDDDDDDAAAA..........
.......ADDDDDDDDDDDDDDDDDDAA..............
........ADDDDDDDDDDDDDDDAA................
........ADDDDDDDDDDDDADAA.................
.........ADDDDDDDDDAA.....................
.........ADDDDDDDAA.......................
..........ADDAAAA.........................
..........AAAA.A..........................
...........A..............................
```

## `dentysta/naklejka.png`
86×81 px, kotwica (43, 44). Naklejka-nagroda: gwiazda z zębem. Gwiazda r = 36 o środku (43, 44), wypełnienie `#fff1c9`, obrys `#6b4a5e` (gwiazda obrysu r ≈ 45,5). Na niej ząb – ta sama maska 9×9 co w `dentysta/plakat.png`, blokowo ×3, lewy górny róg (30, 33).

## `dentysta/okruszek-karmelowy.png`
25×21 px, kotwica (12, 9). Okruszek jedzenia na zębach do wyszczotkowania: grudka z czterech kół. Koła o środkach względem kotwicy (0,0) r=6, (−6,5) r=5, (6,−3) r=5, (3,6) r=3 – najpierw wszystkie w obrysie (r+1) `#6b4a5e`, potem w kolorze `#d8b39c`; biały połysk `#ffffff` 2×2 w (−3,−3).

Siatka pikseli (25×21; . = przezroczysty, A = #6b4a5e, B = #d8b39c, C = #ffffff):

```
..................A......
...............AAABAAA...
............A.ABBBBBBBA..
........AAAABABBBBBBBBBA.
.......AABBBBBBBBBBBBBBBA
......AABBBBBBBBBBBBBBBBA
......ABBCCBBBBBBBBBBBBBA
.....ABBBCCBBBBBBBBBBBBBA
.....ABBBBBBBBBBBBBBBBBBA
...AAABBBBBBBBBBBBBBBBBA.
..ABBBBBBBBBBBBBBBBBBBA..
.ABBBBBBBBBBBBBBBBBAAA...
ABBBBBBBBBBBBBBBBBA......
ABBBBBBBBBBBBBBBBBA......
ABBBBBBBBBBBBBBBBBBA.....
ABBBBBBBBBBBBBBBBBBA.....
ABBBBBBBBBBBBBBBBBBA.....
.ABBBBBBBBBAABBBBBA......
..ABBBBBBBA.AAABAAA......
...AAABAAA.....A.........
......A..................
```

## `dentysta/okruszek-rozowy.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#f59bbd`.

## `dentysta/okruszek-orzechowy.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#c9a07a`.

## `dentysta/okruszek-liliowy.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#c3b3ea`.

## `dentysta/okruszek-zolty.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#f6d98b`.

## `dentysta/piana-mala.png`
9×9 px, kotwica (4, 4). Kłębek piany pasty. Koło r=4 `#e4f1ff`, na nim koło r=3 `#ffffff`.

Siatka pikseli (9×9; . = przezroczysty, A = #e4f1ff, B = #ffffff):

```
....A....
.AAABAAA.
.ABBBBBA.
ABBBBBBBA
ABBBBBBBA
ABBBBBBBA
.ABBBBBA.
.AAABAAA.
....A....
```

## `dentysta/piana-srednia.png`
11×11 px, kotwica (5, 5). Jak `piana-mala`: koło r=5 `#e4f1ff`, na nim r=4 `#ffffff`.

## `dentysta/piana-duza.png`
13×13 px, kotwica (6, 6). Jak `piana-mala`: koło r=6 `#e4f1ff`, na nim r=5 `#ffffff`.

## `dentysta/piana-najwieksza.png`
15×15 px, kotwica (7, 7). Jak `piana-mala`: koło r=7 `#e4f1ff`, na nim r=6 `#ffffff`.

## `dentysta/iskierka-zolta.png`
7×7 px, kotwica (3, 3). Iskierka czystego zęba: plus z ramionami 2 px grubości. Pionowe ramię x2–3, y0–6; poziome x0–6, y2–3; kolor `#f6d98b`.

Siatka pikseli (7×7; . = przezroczysty, A = #f6d98b):

```
..AA...
..AA...
AAAAAAA
AAAAAAA
..AA...
..AA...
..AA...
```

## `dentysta/iskierka-rozowa.png`
7×7 px, kotwica (3, 3). Jak `iskierka-zolta`, kolor `#f59bbd`.

## `dentysta/iskierka-liliowa.png`
7×7 px, kotwica (3, 3). Jak `iskierka-zolta`, kolor `#c3b3ea`.

## `dentysta/iskierka-mietowa.png`
7×7 px, kotwica (3, 3). Jak `iskierka-zolta`, kolor `#9fd6b8`.
