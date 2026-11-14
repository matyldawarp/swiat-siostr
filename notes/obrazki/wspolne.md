# Obrazki: `docs/assets/gfx/wspolne/`

Drobiazgi używane w wielu scenach: serce nagrody, ziarenko, kupka, dymek przeziębienia i kichnięcie, litery „z” snu, znaczki przy przyciskach, pole wyboru, wybór piosenki, ekran końca gry. 16 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Drobne obrazki z terrarium i efektów: serduszko, które wylatuje z zadowolonej postaci, ziarenko do karmienia i kupka do sprzątania palcem. Narysowane jako małe maski (7×6, 5×7, 9×7) i powiększone ×3 z wygładzeniem (ta sama metoda co chomiki, opisana w `postacie-male/`, z `line: 1`); niżej podana jest gotowa siatka wyniku.
Obrazki nakładki gry (OverlayScene): ekran końca gry (księżyc i gwiazdki), wybór piosenek, pola wyboru w ustawieniach, oraz literki „z” unoszące się nad śpiącą postacią (ui/effects.js).
Małe serduszka‑znaczki przyczepiane w rogu przycisków: w cukierni (wybrany dodatek) oraz w kuchni, szpitalu i u dentysty (narzędzie już użyte).
Dymki i efekty choroby chomika (pokazywane nad chorym chomikiem w różnych scenach, zwłaszcza w szpitalu).

## `wspolne/kupka.png`
27×21 px, kotwica (13, 10). Kupka w terrarium (trzy bobki w karmelowym kolorze), którą dziewczynki sprzątają palcem. Jeden bobek na górze, dwa obok siebie na dole; masa #d8b08c, jasny połysk #f3dcc4 w prawym górnym rogu każdego bobka, obrys #6b4a5e 1 px: kreska nad górnym bobkiem, jego boki, gruba pozioma linia pod nim (2–3 wiersze), linia między dolnymi bobkami, ich boki i spody; zaokrąglone rogi bez obrysu.

Siatka całego obrazka (27×21; legenda: A = #d8b08c (200 px), B = #6b4a5e (84 px), C = #f3dcc4 (36 px); `.` = przezroczyste):

```
...........................
..........BBBBBBB..........
..........AAAAACC..........
.........AAAAAACCC.........
.......BAAAAAAACCCCB.......
.......BAAAAAAAACCCB.......
.......BAAAAAAAAAAAB.......
.......BAAAAAAAAAAAB.......
......BBBAAAAAAAAABBB......
.....BBBBBAAAAAAABBBBB.....
....BBBBBBBBBBBBBBBBBBB....
....AAAAACCBBBBBAAAAACC....
...AAAAAACCCBBBAAAAAACCC...
.BAAAAAAACCCCBAAAAAAACCCCB.
.BAAAAAAAACCCBAAAAAAAACCCB.
.BAAAAAAAAAAABAAAAAAAAAAAB.
.BAAAAAAAAAAABAAAAAAAAAAAB.
..AAAAAAAAAAA.AAAAAAAAAAA..
...AAAAAAAAA...AAAAAAAAA...
....BBBBBBB.....BBBBBBB....
...........................
```

## `wspolne/serce.png`
21×18 px, kotwica (10, 9). Różowe serduszko wylatujące nad zadowoloną postacią. Jednolite #f59bbd, bez obrysu, dwa zaokrąglone łuki u góry i szpic na dole; 1 px pustego marginesu dookoła.

Siatka całego obrazka (21×18; legenda: A = #f59bbd (193 px); `.` = przezroczyste):

```
.....................
....AAAA.....AAAA....
...AAAAAA...AAAAAA...
..AAAAAAAA.AAAAAAAA..
.AAAAAAAAAAAAAAAAAAA.
.AAAAAAAAAAAAAAAAAAA.
.AAAAAAAAAAAAAAAAAAA.
.AAAAAAAAAAAAAAAAAAA.
..AAAAAAAAAAAAAAAAA..
...AAAAAAAAAAAAAAA...
....AAAAAAAAAAAAA....
.....AAAAAAAAAAA.....
......AAAAAAAAA......
.......AAAAAAA.......
........AAAAA........
.........AAA.........
..........A..........
.....................
```

## `wspolne/ziarenko.png`
15×21 px, kotwica (7, 10). Ziarenko słonecznika do karmienia postaci w terrarium (skraca się przy każdym gryzie). Pionowy owal zwężony w szpic na górze i na dole, szara łupina #8d7f99, jasny pasek środkiem #f3eef8 (3 px szerokości), obrys #6b4a5e 1 px tylko w górnym i dolnym szpicu oraz po bokach w dolnej połowie.

Siatka całego obrazka (15×21; legenda: A = #8d7f99 (92 px), B = #6b4a5e (35 px), C = #f3eef8 (26 px); `.` = przezroczyste):

```
...............
.......B.......
......BBB......
.....BBAAB.....
....BBAAAAB....
....AAAAAAA....
...AAAACCAAA...
...AAACCCAAA...
...AAACCCAAA...
...AAACCCAAA...
.BAAAACCCAAAAB.
.BAAAACCCAAAAB.
.BAAAACCCAAAAB.
.BAAAACCCAAAAB.
..BAAACCCAAABB.
...BAAAAAAABB..
....BAAAAABB...
.....BAAABB....
......BABB.....
.......BB......
...............
```

## `wspolne/koniec-gry-gwiazdka.png`
18×17 px, kotwica (9, 9). Mała gwiazdka rozrzucana po ekranie końca gry (dobranoc). Pięcioramienna gwiazda, wnętrze #fff1c9, obrys #6b4a5e grubości 1–2 px.

Siatka całego obrazka (18×17; legenda: A = #fff1c9 (92 px), B = #6b4a5e (60 px); `.` = przezroczyste):

```
........BB........
........BB........
.......BAAB.......
.......BAAB.......
......BAAAAB......
..BBBBBAAAABBBBB..
BBAAAAAAAAAAAAAABB
.BAAAAAAAAAAAAAAB.
..BBAAAAAAAAAABB..
...BBAAAAAAAABB...
....BAAAAAAAAB....
....BAAAAAAAAB....
....BAAAAAAAAB....
....BAAABBAAAB....
...BAABB..BBAAB...
...BBB......BBB...
...BB........BB...
```

## `wspolne/koniec-gry-ksiezyc.png`
60×57 px, kotwica (34, 28). Duży sierp księżyca na ekranie końca gry. Sierp otwarty w prawo (wycięte koło przesunięte w prawo i w górę), wnętrze #fff1c9, obrys #6b4a5e 1 px; w prawym górnym rogu mały krzyżyk‑gwiazdka #f6d98b (pionowa kreska 5 px x=57, y=6–10, pozioma 5 px y=8, x=55–59).

Siatka RLE wycinka x 0–59, y 0–56 (60×57; reszta płótna przezroczysta; legenda: A = #fff1c9 (1238 px), B = #6b4a5e (177 px), C = #f6d98b (9 px)):

```
28.B
21.7BA3B
18.3B8A2B
16.2B10AB
14.2B11AB
13.B12A2B
11.2B13AB30.C
10.2B13AB31.C
9.B14AB30.5C
8.B15AB32.C
7.B15AB33.C
6.2B15AB
6.B16AB
5.B16AB
4.B17AB
4.B17AB
3.B18AB
3.B18AB
2.B19AB
2.B18AB
2.B19AB
.B20AB
.B20AB
.B20AB
.B20AB
.B20AB
.B21AB
.B21AB
B22AB
.B22AB
.B22AB
.B23AB
.B24AB
.B24A2B
.B25AB
.B26AB
2.B26A2B
2.B27A2B
2.B29AB
3.B29A2B
3.B31A3B13.3B
4.B33A6B.6BAB
4.B39AB7AB
5.B45AB
6.B43AB
6.2B41A2B
7.B41AB
8.B39AB
9.B37AB
10.2B33A2B
11.2B31A2B
13.B29AB
14.2B25A2B
16.2B21A2B
18.3B15A3B
21.7BA7B
28.B
```

## `wspolne/litera-z-duza.png`
10×10 px, kotwica (5, 5). Duża litera „Z” unosząca się nad śpiącą postacią. Jednolity fiolet #8a5c9e: dwa pełne wiersze na górze i dwa na dole, między nimi ukośna kreska 3 px szerokości z prawej góry w lewy dół.

Siatka całego obrazka (10×10; legenda: A = #8a5c9e (58 px); `.` = przezroczyste):

```
AAAAAAAAAA
AAAAAAAAAA
......AAA.
.....AAA..
....AAA...
...AAA....
..AAA.....
.AAA......
AAAAAAAAAA
AAAAAAAAAA
```

## `wspolne/litera-z-mala.png`
7×7 px, kotwica (3, 3). Mała litera „z” unosząca się nad śpiącą postacią (wersja mniejsza dużej „Z”), kolor #8a5c9e.

Siatka całego obrazka (7×7; legenda: A = #8a5c9e (34 px); `.` = przezroczyste):

```
AAAAAAA
AAAAAAA
....AA.
...AA..
..AA...
AAAAAAA
AAAAAAA
```

## `wspolne/piosenki-nutka-wylaczona.png`
29×29 px, kotwica (13, 13). Przekreślona nutka przy pozycji „Cisza” w wyborze piosenek. Nutka #7a3f63 (okrągła główka w lewym dole, ogonek z chorągiewką) przecięta grubą ukośną kreską #7a3f63 z lewego górnego rogu do prawego dolnego, obwiedzioną 1–2 px białym (#ffffff) brzegiem.

Siatka całego obrazka (29×29; legenda: A = #7a3f63 (209 px), B = #ffffff (112 px); `.` = przezroczyste):

```
BBBBB........................
BAAABB.......................
BAAAABB......................
BAAAAABB.....AAAA............
BBAAAAABB....AA.AA...........
.BBAAAAABB...AA.AA...........
..BBAAAAABB..AA..AA..........
...BBAAAAABB.AA..AA..........
....BBAAAAABBAA...AA.........
.....BBAAAAABBA....AA........
......BBAAAAABB..............
.......BBAAAAABB.............
........BBAAAAABB............
.........BBAAAAABB...........
..........BBAAAAABB..........
..........ABBAAAAABB.........
.......AAAAABBAAAAABB........
.......AAAAAABBAAAAABB.......
......AAAAAAAABBAAAAABB......
......AAAAAAAAABBAAAAABB.....
......AAAAAAAAA.BBAAAAABB....
.......AAAAAAA...BBAAAAABB...
.......AAAAAAA....BBAAAAABB..
..........A........BBAAAAABB.
....................BBAAAAABB
.....................BBAAAAAB
......................BBAAAAB
.......................BBAAAB
........................BBBBB
```

## `wspolne/piosenki-serce.png`
21×18 px, kotwica (10, 9). Serduszko przy piosence, która teraz gra. Pikselowe serce z bloków 3×3 (maska 7×6 powiększona ×3), jednolite #f59bbd, bez obrysu.

Siatka całego obrazka (21×18; legenda: A = #f59bbd (243 px); `.` = przezroczyste):

```
...AAAAAA...AAAAAA...
...AAAAAA...AAAAAA...
...AAAAAA...AAAAAA...
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
...AAAAAAAAAAAAAAA...
...AAAAAAAAAAAAAAA...
...AAAAAAAAAAAAAAA...
......AAAAAAAAA......
......AAAAAAAAA......
......AAAAAAAAA......
.........AAA.........
.........AAA.........
.........AAA.........
```

## `wspolne/pole-wyboru.png`
27×27 px, kotwica (13, 13). Puste pole wyboru (checkbox) w ustawieniach. Kwadrat 27×27: obramowanie #7a3f63 grubości 2 px ze ściętymi rogami (wiersz 0 i 26: x 2–24; wiersz 1 i 25: x 1–25), wnętrze #ffffff.

Siatka całego obrazka (27×27; legenda: A = #ffffff (529 px), B = #7a3f63 (188 px); `.` = przezroczyste):

```
..BBBBBBBBBBBBBBBBBBBBBBB..
.BBBBBBBBBBBBBBBBBBBBBBBBB.
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
.BBBBBBBBBBBBBBBBBBBBBBBBB.
..BBBBBBBBBBBBBBBBBBBBBBB..
```

## `wspolne/pole-wyboru-zaznaczone.png`
27×27 px, kotwica (13, 13). Zaznaczone pole wyboru w ustawieniach: to samo pole co `wspolne/pole-wyboru.png` z grubym ptaszkiem #7a3f63 (krótka kreska w dół w prawo od lewej, długa w górę w prawo).

Siatka całego obrazka (27×27; legenda: A = #ffffff (446 px), B = #7a3f63 (271 px); `.` = przezroczyste):

```
..BBBBBBBBBBBBBBBBBBBBBBB..
.BBBBBBBBBBBBBBBBBBBBBBBBB.
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAABBBABB
BBAAAAAAAAAAAAAAAAAABBBBABB
BBAAAAAAAAAAAAAAAAABBBBBABB
BBAAAAAAAAAAAAAAAABBBBBAABB
BBAAAAAAAAAAAAAAABBBBBAAABB
BBAAAABBBAAAAAAABBBBBAAAABB
BBAAAABBBBAAAAABBBBBAAAAABB
BBAAAABBBBBAAABBBBBAAAAAABB
BBAAAAABBBBBABBBBBAAAAAAABB
BBAAAAAABBBBBBBBBAAAAAAAABB
BBAAAAAAABBBBBBBAAAAAAAAABB
BBAAAAAAAABBBBBAAAAAAAAAABB
BBAAAAAAAAABBBAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
BBAAAAAAAAAAAAAAAAAAAAAAABB
.BBBBBBBBBBBBBBBBBBBBBBBBB.
..BBBBBBBBBBBBBBBBBBBBBBB..
```

## `wspolne/serce-dodatek-wybrany.png`
14×12 px, kotwica (7, 6). Serduszko w rogu przycisku wybranego dodatku w cukierni. Maska serca 7×6 powiększona ×2, jednolite #f59bbd, bez obrysu.

Siatka całego obrazka (14×12; legenda: A = #f59bbd (108 px); `.` = przezroczyste):

```
..AAAA..AAAA..
..AAAA..AAAA..
AAAAAAAAAAAAAA
AAAAAAAAAAAAAA
AAAAAAAAAAAAAA
AAAAAAAAAAAAAA
..AAAAAAAAAA..
..AAAAAAAAAA..
....AAAAAA....
....AAAAAA....
......AA......
......AA......
```

## `wspolne/serce-narzedzie-uzyte.png`
21×18 px, kotwica (10, 9). Serduszko w rogu przycisku narzędzia, które już zostało użyte (kuchnia, szpital, dentysta). Maska serca 7×6 powiększona ×3, jednolite #f59bbd, bez obrysu.

Siatka całego obrazka (21×18; legenda: A = #f59bbd (243 px); `.` = przezroczyste):

```
...AAAAAA...AAAAAA...
...AAAAAA...AAAAAA...
...AAAAAA...AAAAAA...
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAA
...AAAAAAAAAAAAAAA...
...AAAAAAAAAAAAAAA...
...AAAAAAAAAAAAAAA...
......AAAAAAAAA......
......AAAAAAAAA......
......AAAAAAAAA......
.........AAA.........
.........AAA.........
.........AAA.........
```

## `wspolne/dymek-duzy.png`
41×47 px, kotwica (22, 20). Dymek „mam gorączkę” z termometrem. Ramka drawBox(2, 0, 39, 39) `#ffffff` z obrysem `#6b4a5e`, pod nią po lewej ukośny ogonek w dół-w-lewo (y39–46). W środku termometr (słupek `#f59bbd` wysoko, kreski podziałki `#c3b3ea`).

Siatka pikseli (41×47; . = przezroczysty, A = #6b4a5e, B = #ffffff, C = #f59bbd, D = #c3b3ea):

```
....AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA..
...AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.
..AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBAAAAAAABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABBBBBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABBBBBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABBBBBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABBBBBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCDDABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCDDABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCDDABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBABCCCBABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBACCCCCCCABBBBBBBBBBBBAA
..AABBBBBBBBBBBBBACCCCCCCCCABBBBBBBBBBBAA
..AABBBBBBBBBBBBACCCCCCCCCCCABBBBBBBBBBAA
..AABBBBBBBBBBBBACCCCCCCCCCCABBBBBBBBBBAA
..AABBBBBBBBBBBBACCCCCCCCCCCABBBBBBBBBBAA
..AABBBBBBBBBBBBACCCCCCCCCCCABBBBBBBBBBAA
..AABBBBBBBBBBBBACCCCCCCCCCCABBBBBBBBBBAA
..AABBBBBBBBBBBBBACCCCCCCCCABBBBBBBBBBBAA
..AABBBBBBBBBBBBBBACCCCCCCABBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBAAACAAABBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
...AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.
....AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA..
.......ABBBBBBBA.........................
......ABBBBBBA...........................
.....ABBBBBA.............................
....ABBBBA...............................
...ABBBA.................................
..ABBA...................................
.ABA.....................................
AA.......................................
```

## `wspolne/dymek-maly.png`
32×37 px, kotwica (17, 15). Mniejsza wersja `dymek-duzy`: ramka 30×30 od x2, ogonek y29–36, mniejszy termometr.

Siatka pikseli (32×37; . = przezroczysty, A = #6b4a5e, B = #ffffff, C = #c3b3ea, D = #f59bbd):

```
....AAAAAAAAAAAAAAAAAAAAAAAAAA..
...AAAAAAAAAAAAAAAAAAAAAAAAAAAA.
..AABBBBBBBBBBBBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBBBBBBBBBAA
..AABBBBBBBBBBAAAAAABBBBBBBBBBAA
..AABBBBBBBBBBABBBBABBBBBBBBBBAA
..AABBBBBBBBBBABBBBABBBBBBBBBBAA
..AABBBBBBBBBBABBBBABBBBBBBBBBAA
..AABBBBBBBBBBABBCCABBBBBBBBBBAA
..AABBBBBBBBBBABDDBABBBBBBBBBBAA
..AABBBBBBBBBBABDDBABBBBBBBBBBAA
..AABBBBBBBBBBABDDBABBBBBBBBBBAA
..AABBBBBBBBBBABDCCABBBBBBBBBBAA
..AABBBBBBBBBBABDDBABBBBBBBBBBAA
..AABBBBBBBBBBABDDBABBBBBBBBBBAA
..AABBBBBBBBBBABDCCABBBBBBBBBBAA
..AABBBBBBBBBBABDDBABBBBBBBBBBAA
..AABBBBBBBBBBABDDBAABBBBBBBBBAA
..AABBBBBBBBBADDDDDDDABBBBBBBBAA
..AABBBBBBBBAADDDDDDDAABBBBBBBAA
..AABBBBBBBBADDDDDDDDDABBBBBBBAA
..AABBBBBBBBADDDDDDDDDABBBBBBBAA
..AABBBBBBBBADDDDDDDDDABBBBBBBAA
..AABBBBBBBBAADDDDDDDAABBBBBBBAA
..AABBBBBBBBBADDDDDDDABBBBBBBBAA
..AABBBBBBBBBBAAADAAABBBBBBBBBAA
..AABBBBBBBBBBBBBABBBBBBBBBBBBAA
..AABBBBBBBBBBBBBBBBBBBBBBBBBBAA
...AAAAAAAAAAAAAAAAAAAAAAAAAAAA.
....AAAABBBBBBBAAAAAAAAAAAAAAA..
......ABBBBBBA..................
.....ABBBBBA....................
....ABBBBA......................
...ABBBA........................
..ABBA..........................
.ABA............................
AA..............................
```

## `wspolne/kichniecie.png`
7×7 px, kotwica (3, 3). Kropelka kichnięcia: białe koło r=3 `#ffffff`.

Siatka pikseli (7×7; . = przezroczysty, A = #ffffff):

```
...A...
.AAAAA.
AAAAAAA
AAAAAAA
AAAAAAA
.AAAAA.
...A...
```
