# Obrazki gry: opisy do odtworzenia

Ten plik opisuje każdy obrazek gry z `docs/assets/gfx/` tak dokładnie, żeby inny agent AI (albo człowiek) mógł go narysować od nowa bez patrzenia na oryginał. Opisy są po polsku, a przy każdym pliku są wymiary, punkt zaczepienia, kolory w hex i kształty w pikselach. Małe i nieregularne obrazki mają gotowe siatki pikseli (albo maski z legendą kolorów), a duże są opisane prostokątami, kołami i wielokątami ze współrzędnymi.

## Zasady wspólne dla wszystkich obrazków

- **Pixel art, jeden piksel PNG = jeden piksel gry.** Scena gry ma 540×405 pikseli (iPad 1080×810 przy 2 px CSS na piksel gry). Obrazki nigdy nie są skalowane ani obracane w grze: każdy rozmiar i każdy stan rzeczy to osobny plik (siatka pikseli sceny, `notes/wyglad.md`). Wyjątek: ikony 64 (`ikony64/`) są zawsze 64×64 i gra skaluje je do rozmiaru przycisku.
- **Tło przezroczyste**, ostre krawędzie, bez wygładzania i gradientów. Prawie wszystkie piksele są w pełni kryjące; półprzezroczystość jest tylko tam, gdzie opis ją podaje (np. para, bańki).
- **Kolory**: jasne pastele. Obrys prawie wszędzie ma kolor `#6b4a5e` (ciemna śliwka), zwykle 1–2 px; wyjątki (np. niebieski obrys Leili, złoty gwiazdki Gabi) są w opisach.
- **Punkt zaczepienia (kotwica)**: piksel obrazka, który gra stawia w podanym miejscu sceny, zapisany w `docs/assets/gfx/images.json` jako `anchor: [x, y]` i podany w opisie każdego pliku. Kotwice są liczbami całkowitymi.
- **Wzór powtarzany** oznacza kafelek, którym gra wykłada całe okno (`addPattern`); jego brzegi muszą się łączyć bez szwu, a kafelek jest wyrównany do punktu (0, 0) sceny.
- **Stany i warianty** (otwarte/zamknięte drzwi, zapalone okno, kęsy tortu, postać z zamkniętymi oczami albo jedząca) mają tę samą kotwicę co obrazek podstawowy, więc w grze leżą dokładnie jeden na drugim. Rodzina podobnych plików jest opisana raz dokładnie, a pozostałe pliki podają różnice.
- **Powiększanie małych rysunków**: postacie, Łakotek, Tekturzątko, obrazki szkoły i drobiazgi powstały z masek 16×16 (Gabi z 32×32), powiększonych algorytmem Scale2x (postacie) albo „przerysowaniem” z wygładzeniem gaussowskim i odchudzeniem obrysu (Łakotek, Tekturzątko, obrazki szkoły, chomiki, drobiazgi). Oba algorytmy są dokładnie opisane w częściach niżej, przy pierwszym pliku, który ich używa, razem z maskami źródłowymi.
- **Konwencje rysowania** (pudełko z obramowaniem i ściętymi rogami, koło z poziomych pasków, wielokąt wypełniany po środkach pikseli, generator pseudolosowy wzorów) są opisane na początku każdej części; części używają tych samych definicji.

## Jak sprawdzić odtworzony obrazek

1. Plik ma dokładnie wymiary z opisu i leży w `docs/assets/gfx/<folder>/<nazwa>.png`.
2. Kotwica w `images.json` się zgadza.
3. `npm run check` przechodzi, a gra w przeglądarce nie zgłasza błędu „Ułamkowe piksele”.
4. Porównaj z oryginałem z historii repozytorium (git), jeśli jest dostępny: siatki pikseli w tym pliku odpowiadają oryginałom piksel w piksel.

## Spis folderów

| Folder | Gdzie w grze |
|---|---|
| `postacie/`, `postacie-male/` | postacie 64×64 (pokoje, podgląd) i 32×32 (mapa, siatka wyboru), każda zwykła, `-oczy-zamkniete`, `-je` |
| `postacie-ekran/` | okienka siatki wyboru postaci |
| `drobne/` | serce nagrody, ziarenko, kupka |
| `efekty/` | litery „z” snu, pole wyboru w Ustawieniach, wybór piosenki, ekran końca gry |
| `ikony/`, `ikony64/` | znaczki przy przyciskach i ikony na przyciskach (64×64) |
| `start/` | ekran startowy |
| `mapa/` | mapa z budynkami i drogami |
| `terrarium/` | akwarium chomika, kołowrotek, wanna, domek |
| `kuchnia/` | kuchnia z pieczeniem tortu postaci |
| `cukiernia/` | dekorowanie babeczek i gablota |
| `szpital/`, `choroba/` | szpital i dymek przeziębienia |
| `dentysta/` | gabinet dentysty |
| `kolorowanki/` | narzędzia i farby pracowni kolorowanek |
| `szkola/` | klasa, lekcje i obrazki zwierząt do zagadek i rebusów |
| `domek-gabi/` | domek Gabi |
| `kuchnia-lakotka/` | kuchnia Łakotka w domku Gabi |
| `pracownia/` | pracownia plastyczna Tekturzątka |
| `winda/` | kociwinda między pokojami Gabi |

## Część A: postacie, drobne, efekty, ikony

Jak czytać siatki: każdy znak to jeden piksel PNG, wiersze od góry, kolumny od lewej (x, y liczone od 0 w lewym górnym rogu). `.` = piksel w pełni przezroczysty; litery to kolory z legendy podanej przy siatce (każdy kolor jest w pełni kryjący, alfa 255 – w tych folderach nie ma półprzezroczystych pikseli). Legenda jest osobna dla każdego obrazka (litery nadane według liczby pikseli). Siatka **RLE**: w wierszu liczba przed znakiem mówi, ile razy go powtórzyć (`5.3A2B` = 5 przezroczystych, 3×A, 2×B; brak liczby = 1); koniec wiersza po ostatnim znaku jest przezroczysty, a wiersz zapisany jako sama `.` jest cały przezroczysty; wiersze RLE dotyczą wycinka podanego nad siatką, poza nim płótno jest przezroczyste.

### drobne/

Drobne obrazki z terrarium i efektów: serduszko, które wylatuje z zadowolonej postaci, ziarenko do karmienia i kupka do sprzątania palcem. Narysowane jako małe maski (7×6, 5×7, 9×7) i powiększone ×3 z wygładzeniem (ta sama metoda co chomiki, opisana w `postacie-male/`, z `line: 1`); niżej podana jest gotowa siatka wyniku.

#### `drobne/kupka.png`
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

#### `drobne/serce.png`
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

#### `drobne/ziarenko.png`
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

### efekty/

Obrazki nakładki gry (OverlayScene): ekran końca gry (księżyc i gwiazdki), wybór piosenek, pola wyboru w ustawieniach, oraz literki „z” unoszące się nad śpiącą postacią (ui/effects.js).

#### `efekty/koniec-gry-gwiazdka.png`
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

#### `efekty/koniec-gry-ksiezyc.png`
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

#### `efekty/litera-z-duza.png`
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

#### `efekty/litera-z-mala.png`
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

#### `efekty/piosenki-nutka-wylaczona.png`
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

#### `efekty/piosenki-serce.png`
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

#### `efekty/pole-wyboru.png`
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

#### `efekty/pole-wyboru-zaznaczone.png`
27×27 px, kotwica (13, 13). Zaznaczone pole wyboru w ustawieniach: to samo pole co `efekty/pole-wyboru.png` z grubym ptaszkiem #7a3f63 (krótka kreska w dół w prawo od lewej, długa w górę w prawo).

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

### ikony/

Małe serduszka‑znaczki przyczepiane w rogu przycisków: w cukierni (wybrany dodatek) oraz w kuchni, szpitalu i u dentysty (narzędzie już użyte).

#### `ikony/serce-dodatek-wybrany.png`
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

#### `ikony/serce-narzedzie-uzyte.png`
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

### postacie-ekran/

Okienka na ekranie wyboru postaci (CharacterScene): w każdym okienku stoi postać 64×64.

#### `postacie-ekran/okienko.png`
45×45 px, kotwica (0, 0). Okienko na postać na ekranie wyboru postaci. Kwadrat z obramowaniem o ściętych rogach: wnętrze #fff7fb, obramowanie #d9b8d0 grubości 2 px; wiersz 0 i 44 mają ramkę tylko na x 2–42, wiersz 1 i 43 na x 1–43, wiersze 2–42 mają ramkę na x 0–1 i 43–44 (piksele (0,0), (1,0), (0,1), (43,0), (44,0), (44,1) i symetrycznie na dole są przezroczyste). Wnętrze x 2–42, y 2–42.

#### `postacie-ekran/okienko-wybrane.png`
45×45 px, kotwica (0, 0). Okienko wybranej postaci. Kształt jak `postacie-ekran/okienko.png`, wnętrze #ffe1ec, obramowanie #f59bbd 2 px; dodatkowo jasny pasek #ffffff w wierszach 2–3 na x 3–41 (piksele x=2 i x=42 w tych wierszach zostają #ffe1ec).

#### `postacie-ekran/okienko-zamkniete.png`
45×45 px, kotwica (0, 0). Puste, zamknięte okienko (miejsce na postać, której jeszcze nie ma). Kształt jak `postacie-ekran/okienko.png`, wnętrze #f1ecf7, obramowanie #d9ccf5 2 px.

### postacie-male/

Postacie w rozmiarze 32×32 (postać na mapie, ekran wyboru postaci, przyjaciel odwiedzający chorą postać w szpitalu). Każda postać ma trzy pliki: zwykły, `-oczy-zamkniete` (mrugnięcie, pokazywane na 140 ms co 1,8–4,2 s) i `-je` (klatka żucia). Wersje 64×64 są w `postacie/`.

**Jak powstały (sprawdzone: odtwarza wszystkie 54 pliki postaci piksel w piksel).** Źródłem każdej postaci jest mała maska (16×16, a dla Gabi 32×32) podana niżej jako siatka liter z legendą kolorów. Obrazek wynikowy to `redraw(maska, opcje)` – funkcja poniżej (JavaScript; maska to tablica wierszy, każdy wiersz to tablica kolorów `'#rrggbb'` albo `''` dla pustego piksela; wynik w tym samym formacie):

- Titi, Lili, Harry, Harbin, Karabilein, Leili: `postacie-male` = `redraw(maska16, { scale: 2, epx: true })` (czyste Scale2x), `postacie` = `redraw(maska16, { scale: 4, epx: true })` (Scale2x dwa razy, potem obrys zwężony o 1 px tam, gdzie jest gruby, i cienkie kreski dorysowane piórem 2 px).
- Gabi: `postacie-male/gabi` = maska 32×32 bez zmian, `postacie/gabi` = `redraw(maska32, { scale: 2, epx: true })`.
- Mordka i Mysia: `postacie-male` = `redraw(maska16, { scale: 2 })`, `postacie` = `redraw(maska16, { scale: 4 })` – bez Scale2x, czyli wygładzanie gaussowskie: każdy nowy piksel dostaje kolor, który ma największą sumę wag `exp(-d²/(2·0,45²))` wśród pikseli źródła w promieniu 2 (d mierzone w pikselach źródła od środka nowego piksela), a potem obrys (#6b4a5e) przy ×4 jest ścieniony do 2 px (przy ×2 zostaje 1 px). Efekt: krawędzie są zaokrąglone, a obrys ma stałą grubość.
- `drobne/*` = `redraw(maska, { scale: 3, line: 1 })`.

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

#### `postacie-male/gabi.png`
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

#### `postacie-male/gabi-je.png`
32×32 px, kotwica (16, 16). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „je” (klatka żucia).

Jak `postacie-male/gabi.png` ze zmianami (x,y)→litera: (13,14)→S, (18,14)→S, (14,15)→E, (15,15)→E, (16,15)→E, (17,15)→E, (14,16)→R, (15,16)→R, (16,16)→R, (17,16)→R.

#### `postacie-male/gabi-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „oczy zamknięte” (mrugnięcie).

Jak `postacie-male/gabi.png` ze zmianami (x,y)→litera: (11,10)→S, (12,10)→S, (13,10)→S, (18,10)→S, (19,10)→S, (20,10)→S, (11,12)→S, (12,12)→S, (13,12)→S, (18,12)→S, (19,12)→S, (20,12)→S.

#### `postacie-male/harbin.png`
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

#### `postacie-male/harbin-je.png`
32×32 px, kotwica (16, 16). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/harbin.png` ze zmianami (x,y)→litera: (6,7)→R, (7,7)→R, (8,7)→R, (6,8)→E, (7,8)→E, (8,8)→E. Nowe litery: R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/harbin-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/harbin.png` ze zmianami (x,y)→litera: (6,4)→B, (7,4)→B, (9,4)→B, (10,4)→B. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/harry.png`
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

#### `postacie-male/harry-je.png`
32×32 px, kotwica (16, 16). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/harry.png` ze zmianami (x,y)→litera: (6,12)→E, (7,12)→R, (8,12)→R, (9,12)→E, (7,13)→E, (8,13)→E. Nowe litery: R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/harry-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/harry.png` ze zmianami (x,y)→litera: (7,7)→B, (8,7)→B, (9,7)→B, (6,8)→B, (7,8)→B, (8,8)→B, (9,8)→B, (10,8)→B, (7,9)→E, (8,9)→E, (9,9)→E, (7,10)→B, (8,10)→B, (9,10)→B. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/karabilein.png`
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

#### `postacie-male/karabilein-je.png`
32×32 px, kotwica (16, 16). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/karabilein.png` ze zmianami (x,y)→litera: (6,8)→E, (7,8)→R, (8,8)→E, (7,9)→E. Nowe litery: E = #3d2b3d, R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/karabilein-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Identyczny z `postacie-male/karabilein.png` (ta postać nie ma oczu, więc mrugnięcie niczego nie zmienia).

#### `postacie-male/leili.png`
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

#### `postacie-male/leili-je.png`
32×32 px, kotwica (16, 16). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/leili.png` ze zmianami (x,y)→litera: (2,10)→G, (3,10)→T, (4,10)→T, (5,10)→T, (6,10)→T, (7,10)→T, (8,10)→T, (9,10)→T, (10,10)→T, (11,10)→T, (12,10)→T, (13,10)→T, (2,11)→T, (3,11)→T, (4,11)→T, (5,11)→T, (6,11)→T, (7,11)→T, (8,11)→T, (9,11)→T, (10,11)→T, (11,11)→T, (12,11)→T, (13,11)→T, (3,12)→T, (4,12)→T, (5,12)→T, (6,12)→T, (7,12)→T, (8,12)→T, (9,12)→T, (10,12)→T, (11,12)→T, (12,12)→T, (5,13)→T, (6,13)→T, (7,13)→T, (8,13)→T, (9,13)→T. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/leili-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/leili.png` ze zmianami (x,y)→litera: (3,6)→G, (4,6)→T, (11,6)→T, (12,6)→T. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/lili.png`
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

#### `postacie-male/lili-je.png`
32×32 px, kotwica (16, 16). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/lili.png` ze zmianami (x,y)→litera: (8,10)→R, (9,10)→R, (10,10)→R, (8,11)→E, (9,11)→E, (10,11)→E. Nowe litery: R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/lili-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/lili.png` ze zmianami (x,y)→litera: (6,7)→E, (10,7)→E, (7,8)→B, (11,8)→B. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/mordka.png`
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

#### `postacie-male/mordka-je.png`
32×32 px, kotwica (16, 16). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/mordka.png` ze zmianami (x,y)→litera: (1,8)→P, (14,8)→P, (6,9)→O, (7,9)→P, (8,9)→P, (9,9)→O. Obrazek = `redraw(maska, { scale: 2 })`.

#### `postacie-male/mordka-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/mordka.png` ze zmianami (x,y)→litera: (3,6)→B, (4,6)→B, (11,6)→B, (12,6)→B, (3,7)→O, (4,7)→O, (11,7)→O, (12,7)→O. Obrazek = `redraw(maska, { scale: 2 })`.

#### `postacie-male/mysia.png`
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

#### `postacie-male/mysia-je.png`
32×32 px, kotwica (16, 16). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/mysia.png` ze zmianami (x,y)→litera: (1,8)→P, (14,8)→P, (6,9)→O, (7,9)→P, (8,9)→P, (9,9)→O. Obrazek = `redraw(maska, { scale: 2 })`.

#### `postacie-male/mysia-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Maska = maska zwykła z `postacie-male/mysia.png` ze zmianami (x,y)→litera: (3,6)→B, (4,6)→B, (11,6)→B, (12,6)→B, (3,7)→O, (4,7)→O, (11,7)→O, (12,7)→O. Obrazek = `redraw(maska, { scale: 2 })`.

#### `postacie-male/titi.png`
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

#### `postacie-male/titi-je.png`
32×32 px, kotwica (16, 16). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „je” (klatka żucia).

Maska = maska zwykła z `postacie-male/titi.png` ze zmianami (x,y)→litera: (11,4)→E, (12,4)→R, (12,5)→E. Nowe litery: E = #3d2b3d, R = #e0708a. Obrazek = `redraw(maska, { scale: 2, epx: true })`.

#### `postacie-male/titi-oczy-zamkniete.png`
32×32 px, kotwica (16, 16). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie).

Identyczny z `postacie-male/titi.png` (ta postać nie ma oczu, więc mrugnięcie niczego nie zmienia).

### postacie/

Postacie 64×64 – główny rozmiar postaci w pokojach (terrarium, kuchnia, szpital, dentysta, ekran wyboru postaci). Każdy plik powstaje z tej samej maski co odpowiedni plik w `postacie-male/` (tam maski, zmiany wariantów i funkcja `redraw`).

#### `postacie/gabi.png`
64×64 px, kotwica (32, 32). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. `redraw(postacie-male/gabi 32×32, { scale: 2, epx: true })` – jedno Scale2x obrazka 32×32 (obrys zostaje 2 px, bo przy ×2 nic się nie zwęża).

#### `postacie/gabi-je.png`
64×64 px, kotwica (32, 32). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „je” (klatka żucia). `redraw(postacie-male/gabi-je 32×32, { scale: 2, epx: true })` – jedno Scale2x obrazka 32×32 (obrys zostaje 2 px, bo przy ×2 nic się nie zwęża).

#### `postacie/gabi-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „oczy zamknięte” (mrugnięcie). `redraw(postacie-male/gabi-oczy-zamkniete 32×32, { scale: 2, epx: true })` – jedno Scale2x obrazka 32×32 (obrys zostaje 2 px, bo przy ×2 nic się nie zwęża).

#### `postacie/harbin.png`
64×64 px, kotwica (32, 32). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. `redraw(maska16 z postacie-male/harbin, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/harbin-je.png`
64×64 px, kotwica (32, 32). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/harbin-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/harbin-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/harbin-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/harry.png`
64×64 px, kotwica (32, 32). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. `redraw(maska16 z postacie-male/harry, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/harry-je.png`
64×64 px, kotwica (32, 32). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/harry-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/harry-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/harry-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/karabilein.png`
64×64 px, kotwica (32, 32). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. `redraw(maska16 z postacie-male/karabilein, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/karabilein-je.png`
64×64 px, kotwica (32, 32). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/karabilein-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/karabilein-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/karabilein-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/leili.png`
64×64 px, kotwica (32, 32). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. `redraw(maska16 z postacie-male/leili, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/leili-je.png`
64×64 px, kotwica (32, 32). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/leili-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/leili-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/leili-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/lili.png`
64×64 px, kotwica (32, 32). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. `redraw(maska16 z postacie-male/lili, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/lili-je.png`
64×64 px, kotwica (32, 32). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/lili-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/lili-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/lili-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/mordka.png`
64×64 px, kotwica (32, 32). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. `redraw(maska16 z postacie-male/mordka, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

#### `postacie/mordka-je.png`
64×64 px, kotwica (32, 32). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/mordka-je, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

#### `postacie/mordka-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/mordka-oczy-zamkniete, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

#### `postacie/mysia.png`
64×64 px, kotwica (32, 32). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. `redraw(maska16 z postacie-male/mysia, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

#### `postacie/mysia-je.png`
64×64 px, kotwica (32, 32). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/mysia-je, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

#### `postacie/mysia-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/mysia-oczy-zamkniete, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

#### `postacie/titi.png`
64×64 px, kotwica (32, 32). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. `redraw(maska16 z postacie-male/titi, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/titi-je.png`
64×64 px, kotwica (32, 32). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/titi-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

#### `postacie/titi-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/titi-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

### ikony64/

Ikony 64 – obrazki na przyciskach w całej grze (wstecz, ustawienia, muzyka, składniki w kuchni i cukierni, narzędzia w szpitalu i u dentysty, odznaki osobowości na ekranie postaci, przyciski pokoi w windzie Gabi). Płótno 64×64, kotwica w środku (32, 32), tło przezroczyste. Rysunek mieści się w środkowych 58×58 (środek rysunku = punkt (32, 32)); każdy ciemny piksel (jasność < 130: #6b4a5e, #7a3f63) po narysowaniu „rozlewa się” na sąsiadów z lewej, prawej, góry i dołu, więc ciemne linie mają 3 px grubości. Kolory: obrys #6b4a5e, ciemne ikony przycisków #7a3f63. Pod opisem siatka RLE (dokładna).

#### `ikony64/cofnij.png`
64×64 px, kotwica (32, 32). Przycisk „cofnij” w kolorowankach. Gruba strzałka zawracająca w lewo: łuk otwarty w dół (od prawego dołu przez górę) zakończony grotem skierowanym w lewo‑dół, cała jednolita #7a3f63, bez obrysu.

Siatka RLE wycinka x 7–52, y 18–42 (46×25; reszta płótna przezroczysta; legenda: A = #7a3f63 (536 px)):

```
21.9A
18.15A
16.19A
14.23A
13.25A
12.27A
11.29A
10.31A
9.33A
8.14A7.14A
8.12A11.12A
7.11A15.11A
7.10A17.10A
.19A15.10A
21A14.10A
.19A16.9A
2.17A17.10A
3.15A19.9A
4.13A20.9A
5.11A21.9A
6.9A22.9A
7.7A23.9A
8.5A25.7A
9.3A
10.A
```

#### `ikony64/cukier.png`
64×64 px, kotwica (32, 32). Cukier (składnik w kuchni). Słoik: prostokąt z jasnoniebieskim szkłem #cfe8ff, obrys #6b4a5e 3 px, na górze szersza lawendowa pokrywka #d9ccf5 z obrysem; w środku trzy białe kostki cukru #ffffff (dwie na dole obok siebie, jedna wyżej pośrodku).

Siatka RLE wycinka x 12–52, y 10–55 (41×46; reszta płótna przezroczysta; legenda: A = #6b4a5e (741 px), B = #cfe8ff (678 px), C = #ffffff (192 px), D = #d9ccf5 (99 px)):

```
3.35A
2.37A
.39A
41A
4A33D4A
4A33D4A
4A33D4A
41A
.39A
2.37A
3.35A
2.37A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.4A10B8C11B4A
2.4A10B8C11B4A
2.4A10B8C11B4A
2.4A10B8C11B4A
2.4A10B8C11B4A
2.4A10B8C11B4A
2.4A10B8C11B4A
2.4A10B8C11B4A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.4A4B8C4B8C5B4A
2.4A4B8C4B8C5B4A
2.4A4B8C4B8C5B4A
2.4A4B8C4B8C5B4A
2.4A4B8C4B8C5B4A
2.4A4B8C4B8C5B4A
2.4A4B8C4B8C5B4A
2.4A4B8C4B8C5B4A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.4A29B4A
2.37A
3.35A
4.33A
5.31A
```

#### `ikony64/dodatek-gabi.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Gabi: gwiazdka. Duża pięcioramienna gwiazda, wnętrze #fff1c9, gruby obrys #6b4a5e.

Siatka RLE wycinka x 4–59, y 3–55 (56×53; reszta płótna przezroczysta; legenda: A = #fff1c9 (678 px), B = #6b4a5e (664 px)):

```
27.2B
26.4B
26.4B
25.6B
25.6B
25.6B
24.8B
24.8B
23.4B2A4B
23.4B2A4B
22.4B4A4B
22.4B4A4B
21.5B4A5B
21.4B6A4B
20.5B6A5B
20.4B8A4B
19.5B8A5B
14.9B10A9B
6.17B10A17B
.21B12A21B
21B14A21B
.13B28A13B
2.5B42A5B
3.5B40A5B
4.5B38A5B
5.5B36A5B
6.6B32A6B
8.5B30A5B
9.5B28A5B
10.5B26A5B
11.5B24A5B
12.5B22A5B
13.5B20A5B
14.4B20A4B
14.4B20A4B
13.4B22A4B
13.4B22A4B
13.4B22A4B
13.4B22A4B
13.4B22A4B
12.4B10A4B10A4B
12.4B8A8B8A4B
12.4B7A10B7A4B
12.4B5A14B5A4B
12.4B3A8B2.8B3A4B
11.4B2A8B6.8B2A4B
11.4BA7B10.7BA4B
11.10B14.10B
11.9B16.9B
11.7B20.7B
10.6B24.6B
10.4B28.4B
11.B32.B
```

#### `ikony64/dodatek-gwiazdka.png`
64×64 px, kotwica (32, 32). Dodatek „gwiazdka” w cukierni. Ta sama gwiazda co `ikony64/dodatek-gabi.png`, przesunięta o 6 px w dół.

Siatka RLE taka sama jak w `ikony64/dodatek-gabi.png`, ale wycinek x 4–59, y 9–61; legenda tego pliku: A = #fff1c9 (678 px), B = #6b4a5e (664 px).

#### `ikony64/dodatek-harbin.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Harbina: truskawka. Owoc jak odwrócony trójkąt z zaokrąglonym czubkiem na dole, #f28aa5, obrys #6b4a5e, kilka pestek #fff1c9 (pojedyncze piksele), na górze zielona szypułka #9fd6b8 (poziomy pasek i krótka łodyżka).

Siatka RLE wycinka x 13–51, y 19–57 (39×39; reszta płótna przezroczysta; legenda: A = #f28aa5 (649 px), B = #6b4a5e (243 px), C = #9fd6b8 (52 px), D = #fff1c9 (5 px)):

```
19.2C
19.2C
.6B25C6B
8B23C8B
7B25A7B
3B33A3B
3B33A3B
.3B31A3B
.3B31A3B
.3B31A3B
.3B31A3B
2.3B29A3B
2.3B7AD21A3B
2.3B19AD9A3B
3.3B27A3B
3.3B27A3B
4.3B25A3B
4.3B25A3B
5.3B23A3B
5.3B23A3B
6.3B21A3B
6.3B21A3B
7.3B9AD9A3B
7.3B16AD2A3B
8.3B17A3B
8.3B17A3B
9.3B15A3B
10.3B13A3B
10.3B13A3B
11.3B2AD8A3B
12.3B9A3B
12.3B9A3B
13.3B7A3B
14.3B5A3B
15.3B3A3B
15.3B3A3B
16.7B
17.5B
18.3B
```

#### `ikony64/dodatek-harry.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Harry’ego: serduszko. Duże pikselowe serce z bloków (maska 7×6), jednolite #f59bbd, bez obrysu.

Siatka RLE wycinka x 8–56, y 11–52 (49×42; reszta płótna przezroczysta; legenda: A = #f59bbd (1323 px)):

```
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
7.35A
7.35A
7.35A
7.35A
7.35A
7.35A
7.35A
14.21A
14.21A
14.21A
14.21A
14.21A
14.21A
14.21A
21.7A
21.7A
21.7A
21.7A
21.7A
21.7A
21.7A
```

#### `ikony64/dodatek-karabilein.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Karabileina: świeczka. Wąska świeczka w biało‑różowe poziome paski (#ffffff, #f7b2cc), obrys #6b4a5e, na górze płomyk #f6d98b z jaśniejszym środkiem #fff7e0.

Siatka RLE wycinka x 25–38, y 9–53 (14×45; reszta płótna przezroczysta; legenda: A = #6b4a5e (208 px), B = #ffffff (129 px), C = #f6d98b (100 px), D = #f7b2cc (96 px), E = #fff7e0 (18 px)):

```
7.C
4.7C
4.7C
3.9C
2.11C
2.11C
2.11C
2.5C3E3C
2.5C3E3C
2.5C3E3C
2.5C3E3C
3.4C3E2C
4.3C3EC
.6AC5A
14A
7AB6A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
.A10.A
```

#### `ikony64/dodatek-leili.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Leili: kwiatek. Cztery różowe płatki #f7b2cc z obrysem #6b4a5e wokół żółtego środka #f6d98b, w dół zielona łodyżka #9fd6b8.

Siatka RLE wycinka x 9–55, y 5–63 (47×59; reszta płótna przezroczysta; legenda: A = #f7b2cc (732 px), B = #6b4a5e (416 px), C = #f6d98b (213 px), D = #9fd6b8 (26 px)):

```
23.B
19.9B
17.13B
16.7BA7B
15.4B9A4B
14.3B13A3B
13.4B13A4B
13.3B15A3B
12.4B15A4B
12.3B17A3B
12.3B17A3B
12.3B17A3B
11.4B17A4B
7.8B17A8B
5.11B15A11B
4.7BA3B8AC8A3BA7B
3.4B12A9C12A4B
2.3B13A11C13A3B
.4B12A13C12A4B
.3B12A15C12A3B
4B12A15C12A4B
3B12A17C12A3B
3B12A17C12A3B
3B12A17C12A3B
3B12A17C12A3B
3B12A17C12A3B
4B12A15C12A4B
.3B12A15C12A3B
.4B12A13C12A4B
2.3B13A11C13A3B
3.4B12A9C12A4B
4.7BA3B8AC8A3BA7B
5.11B15A11B
7.8B17A8B
11.4B17A4B
12.3B17A3B
12.3B17A3B
12.3B17A3B
12.4B15A4B
13.3B15A3B
13.4B13A4B
14.3B13A3BD
15.4B9A4B
16.7BA7B
17.13B
19.9B
23.BD
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
```

#### `ikony64/dodatek-lili.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Lili: wisienka. Okrągła wiśnia #f28aa5 z obrysem #6b4a5e i białym błyskiem #ffffff, z góry ukośna zielona szypułka #7fc49e w prawo do góry.

Siatka RLE wycinka x 16–48, y 2–54 (33×53; reszta płótna przezroczysta; legenda: A = #f28aa5 (559 px), B = #6b4a5e (256 px), C = #7fc49e (63 px), D = #ffffff (2 px)):

```
27.3C
27.3C
26.3C
26.3C
25.3C
25.3C
24.3C
24.3C
23.3C
23.3C
22.3C
22.3C
21.3C
21.3C
20.3C
20.3C
19.3C
19.3C
18.3C
18.3C
16.B3C
11.11B
9.15B
7.9BA9B
6.5B11A5B
5.4B15A4B
4.3B19A3B
3.3B21A3B
2.4B21A4B
2.3B4A2D17A3B
.3B25A3B
.3B25A3B
.3B25A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
.3B25A3B
.3B25A3B
.3B25A3B
2.3B23A3B
2.4B21A4B
3.3B21A3B
4.3B19A3B
5.4B15A4B
6.5B11A5B
7.9BA9B
9.15B
11.11B
16.B
```

#### `ikony64/dodatek-mordka.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Mordki: ziarenko słonecznika (pionowe), szara łupina #8d7f99, jasny pasek środkiem #f3eef8, gruby obrys #6b4a5e.

Siatka RLE wycinka x 16–47, y 10–53 (32×44; reszta płótna przezroczysta; legenda: A = #6b4a5e (564 px), B = #8d7f99 (210 px), C = #f3eef8 (108 px)):

```
13.6A
12.8A
12.8A
12.8A
12.8A
12.8A
7.18A
6.20A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.8A4B8A
7.6A6C6A
7.6B6C6B
7.6B6C6B
7.6B6C6B
7.6B6C6B
.6A6B6C6B6A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
13A6C13A
.13A4B13A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.20A
7.18A
12.8A
12.8A
12.8A
12.8A
12.8A
13.6A
```

#### `ikony64/dodatek-mysia.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Mysi: trzy borówki (dwie na dole, jedna wyżej pośrodku), #9aa8e8 z obrysem #6b4a5e i pojedynczymi jasnymi błyskami #d9e0fa.

Siatka RLE wycinka x 9–55, y 13–50 (47×38; reszta płótna przezroczysta; legenda: A = #9aa8e8 (748 px), B = #6b4a5e (464 px), C = #d9e0fa (3 px)):

```
23.B
18.11B
17.13B
15.8BA8B
14.5B9A5B
14.3B13A3B
13.3B15A3B
12.3B17A3B
12.3B17A3B
11.3B19A3B
11.3B19A3B
11.3B8AC10A3B
11.3B19A3B
11.3B19A3B
7.7B19A7B
6.8B19A8B
4.11B17A11B
3.5B4A3B17A3B4A5B
3.3B7A3B15A3B7A3B
2.3B9A3B13A3B9A3B
.3B10A5B9A5B10A3B
.3B11A8BA8B11A3B
3B14A13B14A3B
3B15A11B15A3B
3B8AC10A3B8AC10A3B
3B19A3B19A3B
3B19A3B19A3B
3B19A3B19A3B
3B19A3B19A3B
.3B17A5B17A3B
.3B17A5B17A3B
2.3B15A3B.3B15A3B
3.3B13A3B3.3B13A3B
3.5B9A5B3.5B9A5B
4.8BA8B5.8BA8B
6.13B9.13B
7.11B11.11B
12.B21.B
```

#### `ikony64/dodatek-serduszko.png`
64×64 px, kotwica (32, 32). Dodatek „serduszko” w cukierni. To samo serce co `ikony64/dodatek-harry.png`, przesunięte o 6 px w dół.

Siatka RLE taka sama jak w `ikony64/dodatek-harry.png`, ale wycinek x 8–56, y 17–58; legenda tego pliku: A = #f59bbd (1323 px).

#### `ikony64/dodatek-swieczka.png`
64×64 px, kotwica (32, 32). Dodatek „świeczka” w cukierni. Ta sama świeczka co `ikony64/dodatek-karabilein.png`, przesunięta o 6 px w dół.

Siatka RLE taka sama jak w `ikony64/dodatek-karabilein.png`, ale wycinek x 25–38, y 15–59; legenda tego pliku: A = #6b4a5e (208 px), B = #ffffff (129 px), C = #f6d98b (100 px), D = #f7b2cc (96 px), E = #fff7e0 (18 px).

#### `ikony64/dodatek-titi.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Titi: gwiazdka, piksel w piksel jak `ikony64/dodatek-gabi.png`.

Piksel w piksel taki sam jak `ikony64/dodatek-gabi.png`.

#### `ikony64/dodatek-truskawka.png`
64×64 px, kotwica (32, 32). Dodatek „truskawka” w cukierni. Ta sama truskawka co `ikony64/dodatek-harbin.png`, przesunięta o 6 px w dół.

Siatka RLE taka sama jak w `ikony64/dodatek-harbin.png`, ale wycinek x 13–51, y 25–63; legenda tego pliku: A = #f28aa5 (649 px), B = #6b4a5e (243 px), C = #9fd6b8 (52 px), D = #fff1c9 (5 px).

#### `ikony64/dodatek-wisienka.png`
64×64 px, kotwica (32, 32). Dodatek „wisienka” w cukierni. Ta sama wiśnia co `ikony64/dodatek-lili.png`, przesunięta o 6 px w dół.

Siatka RLE taka sama jak w `ikony64/dodatek-lili.png`, ale wycinek x 16–48, y 8–60; legenda tego pliku: A = #f28aa5 (559 px), B = #6b4a5e (256 px), C = #7fc49e (63 px), D = #ffffff (2 px).

#### `ikony64/drukarka.png`
64×64 px, kotwica (32, 32). Przycisk „drukuj” w kolorowankach. Drukarka: biała kartka wystająca u góry, lawendowy korpus #d9ccf5 z obrysem #6b4a5e, pod spodem wychodzi biała kartka #ffffff z różowym serduszkiem #f59bbd.

Siatka RLE wycinka x 8–55, y 11–61 (48×51; reszta płótna przezroczysta; legenda: A = #d9ccf5 (708 px), B = #6b4a5e (624 px), C = #ffffff (492 px), D = #f59bbd (108 px), E = #a6dcc4 (4 px)):

```
10.28B
9.30B
9.30B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
.46B
48B
48B
3B42A3B
3B40A2E3B
3B40A2E3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B7AB26AB7A3B
12B24C12B
12B24C12B
.11B24C11B
9.3B24C3B
9.3B7C4D2C4D7C3B
9.3B7C4D2C4D7C3B
9.3B5C14D5C3B
9.3B5C14D5C3B
9.3B5C14D5C3B
9.3B5C14D5C3B
9.3B7C10D7C3B
9.3B7C10D7C3B
9.3B9C6D9C3B
9.3B9C6D9C3B
9.3B11C2D11C3B
9.3B11C2D11C3B
9.3B24C3B
9.3B24C3B
9.30B
9.30B
10.28B
```

#### `ikony64/glosnik.png`
64×64 px, kotwica (32, 32). Przycisk „powtórz głos” w szkole. Głośnik: biały (#ffffff) prostokąt i lejek skierowany w prawo, gruby obrys #6b4a5e; po prawej łukowata fala dźwięku #6b4a5e.

Siatka RLE wycinka x 6–61, y 6–57 (56×52; reszta płótna przezroczysta; legenda: A = #6b4a5e (1039 px), B = #ffffff (442 px)):

```
32.A
31.3A
30.4A
28.6A
27.7A
26.8A
25.9A
23.11A14.4A
22.12A13.6A
21.13A13.6A
20.7A2B5A13.6A
18.8A3B5A13.8A
17.8A4B5A14.8A
16.7A6B5A16.6A
.21A7B5A10.4A2.6A
21A8B5A9.6A.6A
19A10B5A9.6A.6A
18A11B5A9.6A.6A
17A12B5A7.8A.6A
15A14B5A6.8A2.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
15A14B5A6.8A2.6A
17A12B5A6.9A.6A
18A11B5A7.8A.6A
19A10B5A9.6A.6A
21A8B5A9.6A.6A
.21A7B5A10.4A2.6A
16.7A6B5A16.6A
17.8A4B5A16.6A
18.8A3B5A14.8A
20.7A2B5A13.8A
21.13A13.6A
22.12A13.6A
23.11A13.6A
25.9A14.4A
26.8A
27.7A
28.6A
30.4A
31.3A
32.A
```

#### `ikony64/jajko.png`
64×64 px, kotwica (32, 32). Jajko (składnik w kuchni). Pionowy owal #fff7e8 z obrysem #6b4a5e 3 px, mały biały błysk #ffffff w lewej górnej części.

Siatka RLE wycinka x 14–50, y 8–56 (37×49; reszta płótna przezroczysta; legenda: A = #fff7e8 (1035 px), B = #6b4a5e (352 px), C = #ffffff (6 px)):

```
18.B
13.11B
11.15B
10.8BA8B
8.5B11A5B
7.4B15A4B
6.4B17A4B
6.3B19A3B
5.3B21A3B
4.3B23A3B
4.3B23A3B
3.3B25A3B
2.4B25A4B
2.3B5A2C20A3B
2.3B5A2C20A3B
.3B6A2C21A3B
.3B29A3B
.3B29A3B
.3B29A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
3B31A3B
.3B29A3B
.3B29A3B
.3B29A3B
.3B29A3B
2.3B27A3B
2.3B27A3B
2.4B25A4B
3.3B25A3B
4.3B23A3B
4.3B23A3B
5.3B21A3B
6.3B19A3B
6.4B17A4B
7.4B15A4B
8.5B11A5B
10.8BA8B
11.15B
13.11B
18.B
```

#### `ikony64/krem-czekoladowy.png`
64×64 px, kotwica (32, 32). Krem czekoladowy w cukierni. Rękaw cukierniczy: odwrócony trójkąt (szeroki u góry, wąski na dole) z obrysem #6b4a5e, górna ćwiartka biała #ffffff, reszta w kolorze kremu #d8b39c, pod czubkiem wypływa pionowa strużka kremu 3 px szerokości.

Siatka RLE wycinka x 13–51, y 9–57 (39×49; reszta płótna przezroczysta; legenda: A = #d8b39c (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px)):

```
.C35.C
3C33B3C
3C33B3C
3C33B3C
.3C31B3C
.3C31B3C
2.3C29B3C
2.3C29B3C
3.3C27B3C
3.3C27B3C
3.3C27B3C
4.3C25B3C
4.3C25A3C
5.3C23A3C
5.3C23A3C
6.3C21A3C
6.3C21A3C
6.3C21A3C
7.3C19A3C
7.3C19A3C
8.3C17A3C
8.3C17A3C
9.3C15A3C
9.3C15A3C
9.3C15A3C
10.3C13A3C
10.3C13A3C
11.3C11A3C
11.3C11A3C
11.3C11A3C
12.3C9A3C
12.3C9A3C
13.3C7A3C
13.3C7A3C
14.3C5A3C
14.3C5A3C
14.3C5A3C
15.3C3A3C
15.3C3A3C
16.3CA3C
16.3CA3C
16.3CA3C
17.C.2AC
19.3A
19.3A
19.3A
19.3A
19.3A
19.3A
```

#### `ikony64/krem-liliowy.png`
64×64 px, kotwica (32, 32). Krem liliowy w cukierni. Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, krem #d9ccf5.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #d9ccf5 (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/krem-mietowy.png`
64×64 px, kotwica (32, 32). Krem miętowy w cukierni. Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, krem #bfe8d6.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #bfe8d6 (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/krem-rozowy.png`
64×64 px, kotwica (32, 32). Krem różowy w cukierni. Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, krem #f7b2cc.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #f7b2cc (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/krem-waniliowy.png`
64×64 px, kotwica (32, 32). Krem waniliowy w cukierni. Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, krem #fff1c9.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #fff1c9 (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/ksiezyc.png`
64×64 px, kotwica (32, 32). Przycisk „odpoczynek” w szpitalu. Sierp księżyca otwarty w prawo, #fff1c9, obrys #6b4a5e, w prawym górnym rogu mały krzyżyk‑gwiazdka #f6d98b.

Siatka RLE wycinka x 3–53, y 8–56 (51×49; reszta płótna przezroczysta; legenda: A = #fff1c9 (690 px), B = #6b4a5e (417 px), C = #f6d98b (9 px)):

```
24.B
18.8B
15.12B
13.13B
12.6B4A3B
10.5B6A3B
9.4B7A4B24.C
8.4B8A3B25.C
7.4B8A3B24.5C
6.3B10A3B26.C
5.4B9A4B26.C
5.3B10A3B
4.3B11A3B
3.3B12A3B
3.3B12A3B
2.3B13A3B
2.3B12A3B
2.3B13A3B
.3B14A3B
.3B14A3B
.3B14A3B
.3B14A3B
.3B14A4B
.3B15A3B
3B16A3B
.3B16A3B
.3B16A4B
.3B17A3B
.3B18A3B
.3B19A3B
.3B20A4B
2.3B20A4B
2.3B21A6B11.3B
2.3B22A10B.9B
3.3B23A17B
3.3B25A15B
4.3B30AB4A3B
5.3B33A3B
5.4B31A4B
6.3B31A3B
7.4B27A4B
8.4B25A4B
9.4B23A4B
10.5B19A5B
12.6B13A6B
13.11BA11B
15.19B
18.13B
24.B
```

#### `ikony64/kubek.png`
64×64 px, kotwica (32, 32). Kubek do płukania u dentysty. Szeroki kubek lekko zwężający się w dół, obrys #6b4a5e, w środku miętowa woda #bfe8d6, nad nią jasnoniebieskie szkło #cfe8ff, białe błyski #ffffff.

Siatka RLE wycinka x 14–50, y 13–51 (37×39; reszta płótna przezroczysta; legenda: A = #bfe8d6 (558 px), B = #6b4a5e (392 px), C = #cfe8ff (307 px), D = #ffffff (30 px)):

```
.35B
37B
37B
3B31C3B
3BC2D28C3B
3BC2D28C3B
3BC2D28C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27A3B
.3B2D27A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3B27A3B
2.3B27A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
4.3B23A3B
4.3B23A3B
4.3B23A3B
4.29B
4.29B
5.27B
```

#### `ikony64/lukier-gabi.png`
64×64 px, kotwica (32, 32). Lukier do tortu Gabi (kuchnia). Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, lukier #f5b3dc.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #f5b3dc (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/lukier-harbin.png`
64×64 px, kotwica (32, 32). Lukier do tortu Harbina (kuchnia). Rękaw cukierniczy, lukier #f7b2cc; piksel w piksel jak `ikony64/krem-rozowy.png`.

Piksel w piksel taki sam jak `ikony64/krem-rozowy.png`.

#### `ikony64/lukier-harry.png`
64×64 px, kotwica (32, 32). Lukier do tortu Harry’ego (kuchnia). Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, lukier #f6d098.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #f6d098 (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/lukier-karabilein.png`
64×64 px, kotwica (32, 32). Lukier do tortu Karabileina (kuchnia). Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, lukier #cfe8ff.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #cfe8ff (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/lukier-leili.png`
64×64 px, kotwica (32, 32). Lukier do tortu Leili (kuchnia). Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, lukier #8fdcea.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #8fdcea (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/lukier-lili.png`
64×64 px, kotwica (32, 32). Lukier do tortu Lili (kuchnia). Rękaw cukierniczy, lukier #bfe8d6; piksel w piksel jak `ikony64/krem-mietowy.png`.

Piksel w piksel taki sam jak `ikony64/krem-mietowy.png`.

#### `ikony64/lukier-mordka.png`
64×64 px, kotwica (32, 32). Lukier do tortu Mordki (kuchnia). Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, lukier #ffd6b8.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #ffd6b8 (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/lukier-mysia.png`
64×64 px, kotwica (32, 32). Lukier do tortu Mysi (kuchnia). Rękaw cukierniczy, lukier #d9ccf5; piksel w piksel jak `ikony64/krem-liliowy.png`.

Piksel w piksel taki sam jak `ikony64/krem-liliowy.png`.

#### `ikony64/lukier-titi.png`
64×64 px, kotwica (32, 32). Lukier do tortu Titi (kuchnia). Rękaw cukierniczy jak `ikony64/krem-czekoladowy.png`, lukier #c3b3ea.

Siatka RLE taka sama jak w `ikony64/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #c3b3ea (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

#### `ikony64/lusterko.png`
64×64 px, kotwica (32, 32). Lusterko dentystyczne. Okrągłe lusterko #cfe8ff z białym błyskiem #ffffff i obrysem #6b4a5e w prawym górnym rogu, od niego ukośny cienki trzonek #6b4a5e w lewy dół.

Siatka RLE wycinka x 12–56, y 8–55 (45×48; reszta płótna przezroczysta; legenda: A = #cfe8ff (373 px), B = #6b4a5e (369 px), C = #ffffff (36 px)):

```
30.B
25.11B
23.15B
22.8BA8B
21.4B11A4B
20.3B15A3B
19.3B17A3B
18.3B19A3B
17.4B3A6C10A4B
17.3B4A6C11A3B
17.3B4A6C11A3B
16.3B5A6C12A3B
16.3B5A6C12A3B
16.3B5A6C12A3B
16.3B23A3B
16.3B23A3B
16.3B23A3B
16.3B23A3B
17.3B21A3B
17.3B21A3B
17.4B19A4B
18.3B19A3B
19.3B17A3B
20.3B15A3B
20.5B11A4B
19.11BA8B
18.20B
17.7B.11B
16.7B7.B
15.7B
14.7B
13.7B
12.7B
11.7B
10.7B
9.7B
8.7B
7.7B
6.7B
5.7B
4.7B
3.7B
2.7B
.7B
7B
6B
5B
.3B
```

#### `ikony64/lyzka.png`
64×64 px, kotwica (32, 32). Łyżka syropu w szpitalu. Łyżka leżąca poziomo: okrągła czerpak po lewej pełen różowego syropu #f59bbd (biały błysk 1 px), lawendowe brzegi #d9ccf5, w prawo długi lawendowy trzonek, wszystko z obrysem #6b4a5e.

Siatka RLE wycinka x 2–60, y 17–47 (59×31; reszta płótna przezroczysta; legenda: A = #6b4a5e (412 px), B = #f59bbd (400 px), C = #d9ccf5 (193 px), D = #ffffff (1 px)):

```
15.A
10.11A
8.15A
6.9AC9A
5.5A5CB5C5A
4.4A2C11B2C4A
3.4A2C13B2C4A
3.3AC17BC3A
2.3A2C17B2C3A
.3A2C19B2C3A
.3AC21BC31A
.3AC6BD14BC32A
3AC23BC31A
3AC23B29C3A
3AC23B29C3A
3AC23B29C3A
3AC23B29C3A
3AC23B2C30A
3AC23BC31A
.3AC21BC31A
.3AC21BC3A
.3A2C19B2C3A
2.3A2C17B2C3A
3.3AC17BC3A
3.4A2C13B2C4A
4.4A2C11B2C4A
5.5A5CB5C5A
6.9AC9A
8.15A
10.11A
15.A
```

#### `ikony64/maka.png`
64×64 px, kotwica (32, 32). Mąka (składnik w kuchni). Worek: zaokrąglony prostokąt #fff7fb z obrysem #6b4a5e, u góry węższa związana szyjka, różowa tasiemka #f59bbd, na worku żółty kłos #f6d98b (pionowa łodyga z trzema parami ziaren).

Siatka RLE wycinka x 13–50, y 10–57 (38×48; reszta płótna przezroczysta; legenda: A = #fff7fb (995 px), B = #6b4a5e (610 px), C = #f6d98b (45 px), D = #f59bbd (20 px)):

```
9.20B
8.22B
8.22B
8.3B16A3B
8.3B16A3B
8.3B16A3B
8.3B16A3B
8.3B16A3B
3.5BDB18DBD5B
2.34B
.36B
38B
4B30A4B
4B30A4B
4B30A4B
4B30A4B
4B30A4B
4B30A4B
4B30A4B
4B15AC14A4B
4B13A5C12A4B
4B13A5C12A4B
4B15AC14A4B
4B13A5C12A4B
4B13A5C12A4B
4B15AC14A4B
4B13A5C12A4B
4B13A5C12A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B15AC14A4B
4B30A4B
4B30A4B
4B30A4B
4B30A4B
38B
.36B
2.34B
3.32B
```

#### `ikony64/mapa.png`
64×64 px, kotwica (32, 32). Przycisk „mapa” w terrarium. Złożona mapa z trzech pionowych pasów: miętowy #bfe8d6, brzoskwiniowy #ffe1c4 (środkowy, 2 px niżej), miętowy; obrys #6b4a5e; różowa kropkowana trasa #f59bbd z lewego dołu w prawo w górę do małego różowego serduszka w prawym pasie.

Siatka RLE wycinka x 3–62, y 9–56 (60×48; reszta płótna przezroczysta; legenda: A = #bfe8d6 (1245 px), B = #6b4a5e (844 px), C = #ffe1c4 (632 px), D = #f59bbd (43 px)):

```
.20B18.20B
22B16.22B
60B
3B16A22B16A3B
3B16A22B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B6A2DA2D5A3B
3B16A3B16C3B5A7D4A3B
3B16A3B16C3B5A7D4A3B
3B16A3B16C3B6A5D5A3B
3B16A3B15CD3B7A3D6A3B
3B16A3B15CD3B8AD7A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B7C2D7C3B16A3B
3B16A3B7C2D7C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3BD15C3B16A3B
3B16A3BD15C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B9A2D5A3B16C3B16A3B
3B9A2D5A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3BA2D13A3B16C3B16A3B
3BA2D13A3B16C3B16A3B
3B16A3B16C3B16A3B
22B16C22B
22B16C22B
.58B
19.22B
20.20B
```

#### `ikony64/mleko.png`
64×64 px, kotwica (32, 32). Mleko (składnik w kuchni). Karton: biały prostokąt #ffffff z obrysem #6b4a5e, jasnoniebieski pas #cfe8ff na środku, na górze trójkątny daszek #cfe8ff.

Siatka RLE wycinka x 18–46, y 10–56 (29×47; reszta płótna przezroczysta; legenda: A = #6b4a5e (424 px), B = #ffffff (378 px), C = #cfe8ff (325 px)):

```
13.2A
12.4A
12.C2AC
11.6C
10.8C
9.10C
8.12C
7.14C
6.16C
5.18C
4.20C
3.22C
2.24C
3C23A2C
2.25A
.27A
29A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21C4A
4A21C4A
4A21C4A
4A21C4A
4A21C4A
4A21C4A
4A21C4A
4A21C4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
4A21B4A
29A
.27A
2.25A
3.23A
```

#### `ikony64/nowa-kartka.png`
64×64 px, kotwica (32, 32). Przycisk „nowa kartka” w pracowni Gabi. Pionowa biała kartka #ffffff z grubym obrysem #6b4a5e, w prawym górnym rogu mała gwiazdka #fff1c9 z obrysem.

Siatka RLE wycinka x 14–50, y 8–55 (37×48; reszta płótna przezroczysta; legenda: A = #ffffff (891 px), B = #6b4a5e (767 px), C = #fff1c9 (94 px)):

```
3.31B
2.33B
.35B
37B
4B29A4B
4B20A2B7A4B
4B19A4B6A4B
4B19A4B6A4B
4B18A6B5A4B
4B18A6B5A4B
4B17A3B2C3B4A4B
4B15A5B2C5B2A4B
4B10A9B4C10B
4B9A9B6C9B
4B10A5B12C6B
4B11A3B14C5B
4B12A3B12C6B
4B13A3B10C7B
4B14A3B8C3BA4B
4B14A3B8C3BA4B
4B14A3B8C3BA4B
4B14A3B3C2B3C3BA4B
4B14A3BC6BC3BA4B
4B13A20B
4B13A7B2A11B
4B13A5B6A9B
4B13A3B10A7B
4B14AB12ABA4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
37B
.35B
2.33B
3.31B
```

#### `ikony64/nutka.png`
64×64 px, kotwica (32, 32). Przycisk muzyki (muzyka włączona). Nutka ósemka #7a3f63: okrągła główka w lewym dole, pionowy ogonek w górę, chorągiewka opadająca w prawo; bez obrysu.

Siatka RLE wycinka x 15–51, y 9–55 (37×47; reszta płótna przezroczysta; legenda: A = #7a3f63 (669 px)):

```
18.10A
17.12A
17.13A
17.13A
17.14A
17.14A
17.7A.7A
17.7A2.7A
17.7A2.7A
17.7A3.7A
17.7A3.7A
17.7A4.7A
17.7A5.7A
17.7A5.7A
17.7A6.7A
17.7A6.7A
17.7A7.5A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
10.A6.7A
6.9A2.7A
4.20A
3.21A
2.22A
2.22A
.23A
.23A
24A
24A
23A
21A
21A
.19A
.19A
2.17A
2.17A
3.15A
4.13A
6.9A
10.A
```

#### `ikony64/nutka-wylaczona.png`
64×64 px, kotwica (32, 32). Przycisk muzyki (muzyka wyłączona). Nutka jak w `ikony64/nutka.png` przekreślona grubym ukosem #7a3f63 z lewego górnego rogu do prawego dolnego, ukos obwiedziony białym #ffffff brzegiem.

Siatka RLE wycinka x 4–63, y 4–63 (60×60; reszta płótna przezroczysta; legenda: A = #7a3f63 (1265 px), B = #ffffff (311 px)):

```
10B
2B6A3B
B8A3B
B9A3B
B10A3B
B11A3B14.10A
B12A3B12.12A
B13A3B11.13A
2B13A3B10.13A
3B13A3B9.14A
.3B13A3B8.14A
2.3B13A3B7.7A.7A
3.3B13A3B6.7A2.7A
4.3B13A3B5.7A2.7A
5.3B13A3B4.7A3.7A
6.3B13A3B3.7A3.7A
7.3B13A3B2.7A4.7A
8.3B13A3B.7A5.7A
9.3B13A3B7A5.7A
10.3B13A2B7A6.7A
11.3B13A2B6A6.7A
12.3B13A2B5A7.5A
13.3B13A2B4A
14.3B13A2B3A
15.3B13A2BA
16.3B13A3B
17.3B13A3B
18.3B13A3B
19.3B13A3B
20.3B13A3B
21.3B13A3B
21.A3B13A3B
17.7A2B13A3B
15.10A2B13A3B
14.12A2B13A3B
13.14A2B13A3B
13.15A2B13A3B
12.17A2B13A3B
12.18A2B13A3B
11.20A2B13A3B
11.21A2B13A3B
11.21A3B13A3B
11.21A.3B13A3B
11.21A2.3B13A3B
12.19A4.3B13A3B
12.19A5.3B13A3B
13.17A7.3B13A3B
13.17A8.3B13A3B
14.15A10.3B13A3B
15.13A12.3B13A3B
17.9A15.3B13A3B
21.A20.3B13A2B
43.3B13AB
44.3B13A
45.3B12A
46.3B11A
47.3B10A
48.3B9A
49.3B8A
50.3B7A
```

#### `ikony64/odswiez.png`
64×64 px, kotwica (32, 32). Przycisk „wczytaj grę od nowa” w ustawieniach. Gruby okrąg #7a3f63 z przerwą u góry po prawej i grotem strzałki na końcu (strzałka zgodnie z ruchem wskazówek zegara).

Siatka RLE wycinka x 8–56, y 4–57 (49×54; reszta płótna przezroczysta; legenda: A = #7a3f63 (1141 px)):

```
27.A
26.3A
26.4A
26.5A
26.6A
20.13A
16.18A
14.21A
12.24A
11.26A
9.29A
8.29A
7.29A
6.29A
5.29A
5.16A5.7A
4.14A8.6A
3.13A10.5A
3.12A11.4A
2.12A12.3A
2.11A14.A18.A
.11A32.4A
.11A29.7A
.10A28.9A
.10A27.10A
11A27.11A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
11A27.11A
.10A27.10A
.10A27.10A
.11A25.11A
.11A25.11A
2.11A23.11A
2.12A21.12A
3.12A19.12A
3.13A17.13A
4.14A13.14A
5.16A7.16A
5.39A
6.37A
7.35A
8.33A
9.31A
11.27A
12.25A
14.21A
16.17A
20.9A
```

#### `ikony64/osobowosc-czyscioszek.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „czyścioszek”. Trzy bańki mydlane różnej wielkości (duża po lewej, średnia po prawej u góry, mała na dole), #cfe8ff z obrysem #6b4a5e i białym kwadratowym błyskiem #ffffff w lewym górnym rogu każdej.

Siatka RLE wycinka x 5–59, y 11–59 (55×49; reszta płótna przezroczysta; legenda: A = #cfe8ff (1110 px), B = #6b4a5e (576 px), C = #ffffff (50 px)):

```
40.B
35.11B
33.15B
32.8BA8B
31.4B11A4B
30.3B15A3B
29.3B17A3B
28.3B19A3B
27.4B3A4C12A4B
27.3B4A4C13A3B
27.3B4A4C13A3B
17.B8.3B5A4C14A3B
11.13B2.3B23A3B
9.20B23A3B
8.9BA11B23A3B
6.6B11A6B23A3B
5.5B15A4B23A3B
4.4B18A3B23A3B
4.3B20A3B21A3B
3.3B21A3B21A3B
2.3B4A5C13A4B19A4B
2.3B4A5C14A3B19A3B
.3B5A5C15A3B17A3B
.3B5A5C16A3B15A3B
.3B5A5C17A4B11A4B
3B29A8BA8B
3B29A16B
3B29A14B
3B29A3B5.B
3B27A9B
3B25A13B
3B24A7BA7B
.3B22A4B9A4B
.3B22A3B11A3B
.3B21A3B2A3C8A3B
2.3B20A3B2A3C8A3B
2.3B19A3B3A3C9A3B
3.3B18A3B15A3B
4.3B17A3B15A3B
4.4B16A3B15A3B
5.5B14A3B15A3B
6.6B11A5B13A3B
8.9BA10B13A3B
9.20B11A3B
11.13B2.4B9A4B
17.B9.7BA7B
28.13B
30.9B
34.B
```

#### `ikony64/osobowosc-lasuch.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „łasuch”: ziarenko słonecznika (szara łupina #8d7f99, jasny pasek #f3eef8, gruby obrys #6b4a5e), większe niż `ikony64/dodatek-mordka.png`.

Siatka RLE wycinka x 14–50, y 7–57 (37×51; reszta płótna przezroczysta; legenda: A = #6b4a5e (730 px), B = #8d7f99 (300 px), C = #f3eef8 (147 px)):

```
15.7A
14.9A
14.9A
14.9A
14.9A
14.9A
14.9A
8.21A
7.23A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
8.7A7C7A
8.7B7C7B
8.7B7C7B
8.7B7C7B
8.7B7C7B
8.7B7C7B
.7A7B7C7B7A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
15A7C15A
.15A5B15A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.23A
8.21A
14.9A
14.9A
14.9A
14.9A
14.9A
14.9A
15.7A
```

#### `ikony64/osobowosc-przytulas.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „przytulas”: serduszko, piksel w piksel jak `ikony64/dodatek-harry.png`.

Piksel w piksel taki sam jak `ikony64/dodatek-harry.png`.

#### `ikony64/osobowosc-spioch.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „śpioch”: księżyc, piksel w piksel jak `ikony64/ksiezyc.png`.

Piksel w piksel taki sam jak `ikony64/ksiezyc.png`.

#### `ikony64/osobowosc-wesolek.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „wesołek”: gwiazdka, piksel w piksel jak `ikony64/dodatek-gabi.png`.

Piksel w piksel taki sam jak `ikony64/dodatek-gabi.png`.

#### `ikony64/osobowosc-wiercipieta.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „wiercipięta”. Zygzakowata błyskawica od góry do dołu (górny koniec w prawo od środka, dolny w lewo), #f6d98b z obrysem #6b4a5e.

Siatka RLE wycinka x 9–54, y 0–63 (46×64; reszta płótna przezroczysta; legenda: A = #f6d98b (512 px), B = #6b4a5e (430 px)):

```
26.3B
26.3B
25.4B
24.5B
24.5B
23.5B
22.5BA
21.6BA
21.5B2A
20.5B2A
19.6B2A
19.5B3A
18.5B4A
17.6B4A
17.5B4A
16.5B5A
15.6B5A
14.6B6A
14.5B7A
13.6B7A
12.6B7A
12.5B8A
11.6B8A
10.6B9A
9.6B9A
9.6B9A16.5B
8.6B25A7B
7.6B26A6B
7.6B25A6B
6.6B25A7B
5.6B26A6B
5.6B25A6B
4.6B25A6B
3.6B26A6B
2.7B25A6B
2.6B25A6B
.6B26A6B
7B25A6B
.5B16.9A6B
21.10A6B
21.9A6B
21.8A6B
21.8A5B
21.7A6B
20.7A6B
20.7A5B
20.6A6B
20.5A6B
20.5A5B
20.4A5B
19.4A6B
19.4A5B
19.3A5B
19.2A6B
18.3A5B
18.2A5B
18.A6B
18.A5B
18.5B
17.5B
17.5B
17.4B
17.3B
17.3B
```

#### `ikony64/plaster.png`
64×64 px, kotwica (32, 32). Plaster w szpitalu. Poziomy zaokrąglony prostokąt #ffd6b8 z obrysem #6b4a5e, w środku jaśniejsza poduszeczka #fff1e0, po obu stronach po trzy różowe kropki #f7b2cc (dziurki).

Siatka RLE wycinka x 2–61, y 19–44 (60×26; reszta płótna przezroczysta; legenda: A = #6b4a5e (600 px), B = #ffd6b8 (570 px), C = #fff1e0 (360 px), D = #f7b2cc (6 px)):

```
3.54A
2.56A
.58A
60A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4AD3BD11B20C11BD3BD4A
4A2BD13B20C13BD2B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
60A
.58A
2.56A
3.54A
```

#### `ikony64/pokoj-kuchnia.png`
64×64 px, kotwica (32, 32). Przycisk kuchni w windzie Gabi. Babeczka: papierowa foremka #ffd6b8 w pionowe paski #f5c09a, na niej różowy krem #f59bd0 w trzech warstwach (zwężających się ku górze) z białymi błyskami, kolorowa posypka (#a6dcc4, #c3b3ea, #f59bbd, #f6d98b), obrys #6b4a5e.

Siatka RLE wycinka x 9–55, y 17–57 (47×41; reszta płótna przezroczysta; legenda: A = #f59bd0 (525 px), B = #6b4a5e (483 px), C = #ffd6b8 (281 px), D = #f5c09a (92 px), E = #ffffff (6 px), F = #a6dcc4 (4 px), G = #c3b3ea (4 px), H = #f59bbd (4 px), I = #f6d98b (4 px)):

```
23.B
17.13B
16.15B
14.9BA9B
13.5B11A5B
13.3B3A2E10A3B
11.4B17A4B
9.6B9A2F6A6B
8.6B19A6B
7.4B25A4B
6.3B6A2E21A3B
5.3B23A2G6A3B
5.3B5A2H24A3B
5.3B11A2I18A3B
3.5B31A5B
2.5B33A5B
.4B8A2E27A4B
3B19A2G9A2F9A3B
3B6A2H33A3B
3B35A2I4A3B
.4B37A4B
2.5B33A5B
3.8B25A8B
3.20BA20B
4.3BC31BC3B
4.3BCD3C23BCD3C3B
4.3BCD3CD3CD3CD2CBD3CD3CD3CD3C3B
4.3BCD3CD3CD3CD3CD3CD3CD3CD3C3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
7.3BCD3CD3CD3CD3CD3CD3CDC3B
7.33B
7.33B
8.31B
```

#### `ikony64/pokoj-pracownia.png`
64×64 px, kotwica (32, 32). Przycisk pracowni w windzie Gabi. Paleta malarska: owal #f3dcc4 z obrysem #6b4a5e, pięć kółek farby (#fff09a, #9fd0f5, #f28aa5, #7fcf9a, #c3b3ea) i otwór na kciuk w prawym dole (biały środek #fff7fb).

Siatka RLE wycinka x 3–61, y 9–55 (59×47; reszta płótna przezroczysta; legenda: A = #f3dcc4 (1098 px), B = #6b4a5e (525 px), C = #fff09a (89 px), D = #9fd0f5 (89 px), E = #f28aa5 (89 px), F = #7fcf9a (89 px), G = #c3b3ea (86 px), H = #fff7fb (60 px)):

```
29.B
21.17B
17.25B
15.14BA14B
13.8B17A8B
11.7B23A7B
10.5B29A5B
9.4B33A4B
7.5B35A5B
6.4B14AC24A4B
5.4B12A7C7AD14A4B
5.3B12A9C3A7D12A3B
4.3B12A11CA9D12A3B
3.3B13A11C11D12A3B
2.4B13A11C11D12A4B
2.3B14A11C11D13A3B
.4B11AE2A11C11D13A4B
.3B9A7E9CA11D2AG11A3B
.3B8A9E7C3A9D7G8A3B
3B8A11E2AC7A7D9G8A3B
3B8A11E13AD2A11G7A3B
3B8A11E16A11G7A3B
3B8A11E16A11G7A3B
3B8A11E16A11G7A3B
3B9A9E17AB10G7A3B
3B10A7E17A3B8G8A3B
3B13AE3AF15A3BH6GB9A3B
3B14A7F11A3B5HGH3B8A3B
.3B12A9F9A3B9H3B6A3B
.3B11A11F8A3B9H3B6A3B
.4B10A11F8A3B9H3B5A4B
2.3B10A11F8A3B9H3B5A3B
2.4B9A11F8A3B9H3B4A4B
3.3B9A11F9A3B7H3B5A3B
4.3B9A9F11A5BH5B5A3B
5.3B9A7F13A9B5A3B
5.4B11AF17A7B5A4B
6.4B31AB7A4B
7.5B35A5B
9.4B33A4B
10.5B29A5B
11.7B23A7B
13.8B17A8B
15.14BA14B
17.25B
21.17B
29.B
```

#### `ikony64/posypka.png`
64×64 px, kotwica (32, 32). Posypka (kuchnia i cukiernia). Solniczka: prostokąt #fff7fb z obrysem #6b4a5e i lawendowym paskiem #d9ccf5 u góry; pod nią spadające kolorowe kreseczki (#f59bbd, #a6dcc4, #f6d98b, #c3b3ea) w trzech rzędach.

Siatka RLE wycinka x 19–44, y 7–59 (26×53; reszta płótna przezroczysta; legenda: A = #fff7fb (378 px), B = #6b4a5e (368 px), C = #d9ccf5 (36 px), D = #a6dcc4 (36 px), E = #f59bbd (33 px), F = #c3b3ea (18 px), G = #f6d98b (15 px)):

```
3.20B
2.22B
.24B
26B
4B18C4B
4B18C4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
4B18A4B
26B
.24B
2.22B
3.20B
.
3.5E6F
3.5E6F
3.5E6F
.
.
.
.
.
.
3.6E9.6D
3.6E9.6D
3.6E9.6D
.
.
.
.
.
.
13.5G6D
13.5G6D
13.5G6D
```

#### `ikony64/serce-babeczka-gotowa.png`
64×64 px, kotwica (32, 32). Przycisk „babeczka gotowa” w cukierni: serduszko, piksel w piksel jak `ikony64/dodatek-harry.png`.

Piksel w piksel taki sam jak `ikony64/dodatek-harry.png`.

#### `ikony64/serce-podaj-tort.png`
64×64 px, kotwica (32, 32). Przycisk „podaj tort” w kuchni. Duże pikselowe serce z bloków (maska 7×6), jednolite #f59bbd, bez obrysu – większe niż `ikony64/dodatek-harry.png`.

Siatka RLE wycinka x 4–59, y 8–55 (56×48; reszta płótna przezroczysta; legenda: A = #f59bbd (1728 px)):

```
8.16A8.16A
8.16A8.16A
8.16A8.16A
8.16A8.16A
8.16A8.16A
8.16A8.16A
8.16A8.16A
8.16A8.16A
56A
56A
56A
56A
56A
56A
56A
56A
56A
56A
56A
56A
56A
56A
56A
56A
8.40A
8.40A
8.40A
8.40A
8.40A
8.40A
8.40A
8.40A
16.24A
16.24A
16.24A
16.24A
16.24A
16.24A
16.24A
16.24A
24.8A
24.8A
24.8A
24.8A
24.8A
24.8A
24.8A
24.8A
```

#### `ikony64/szczoteczka.png`
64×64 px, kotwica (32, 32). Szczoteczka do zębów u dentysty. Leży poziomo: długa różowa rączka #f7b2cc z ciemniejszym paskiem #f59bbd, z obrysem #6b4a5e; po prawej główka z białym włosiem #ffffff w pionowe paski i niebieskimi akcentami #cfe8ff.

Siatka RLE wycinka x 4–59, y 25–48 (56×24; reszta płótna przezroczysta; legenda: A = #6b4a5e (438 px), B = #f7b2cc (290 px), C = #ffffff (110 px), D = #cfe8ff (55 px), E = #f59bbd (26 px)):

```
36.19A
35.21A
35.21A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
.37AD2CD2CD2CD2CD2C3A
38AD2CD2CD2CD2CD2C3A
37A16B3A
3A50B3A
3A50B3A
3A50B3A
3AB26E23B3A
3A50B3A
3A50B3A
56A
56A
.54A
```

#### `ikony64/termometr.png`
64×64 px, kotwica (32, 32). Termometr w szpitalu. Pionowa biała rurka #ffffff z obrysem #6b4a5e, na dole okrągła różowa bańka #f59bbd, różowy słupek od bańki do ok. 1/4 wysokości, z prawej trzy lawendowe kreski skali #c3b3ea.

Siatka RLE wycinka x 19–45, y 1–62 (27×62; reszta płótna przezroczysta; legenda: A = #6b4a5e (433 px), B = #f59bbd (405 px), C = #ffffff (287 px), D = #c3b3ea (3 px)):

```
6.14A
5.16A
5.16A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A9CD3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A9CD3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A2C6B2C3A
5.3A2C6BCD3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.4A9B4A
4.4A11B4A
3.4A13B4A
2.4A15B4A
2.3A17B3A
.3A19B3A
.3A19B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
.3A19B3A
.3A19B3A
2.3A17B3A
2.4A15B4A
3.4A13B4A
4.4A11B4A
5.8AB8A
6.15A
8.11A
13.A
```

#### `ikony64/tort-gabi.png`
64×64 px, kotwica (32, 32). Tort Gabi (przycisk „upiecz tort” w terrarium, tort w kuchni). Okrągły tort widziany z boku na białym talerzyku #ffffff (talerzyk szerszy od tortu, z obrysem #6b4a5e): biszkopt #f6d098, kremowa przekładka #fff7e8 w połowie wysokości, lukier #f5b3dc na górze ze zwisającymi kroplami, posypka kreseczkami (#a6dcc4, #f6d98b, #c3b3ea, #ffffff), na środku na górze gwiazdka #fff1c9 z obrysem.

Siatka RLE wycinka x 1–61, y 14–50 (61×37; reszta płótna przezroczysta; legenda: A = #6b4a5e (572 px), B = #f6d098 (496 px), C = #f5b3dc (167 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #fff1c9 (38 px), G = #f6d98b (6 px), H = #a6dcc4 (5 px), I = #c3b3ea (4 px)):

```
30.2A
29.4A
29.4A
28.6A
27.8A
23.7A2F7A
22.7A4F7A
23.4A8F4A
24.3A8F3A
25.3A6F3A
26.3A4F3A
7.22A4F22A
6.22AF4AF22A
6.50A
6.3AC2H10C2DC12A9C2G5C3A
6.3A16C4A4C4A16C3A
6.3A5C2G10CAH7CA2C2D10C2IC3A
6.3A44C3A
6.3A7B2C2I8B2C2G2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/tort-harbin.png`
64×64 px, kotwica (32, 32). Tort Harbina. Jak `ikony64/tort-gabi.png`, lukier #f7b2cc, na górze truskawka (#f28aa5, szypułka #9fd6b8, pestki #fff1c9).

Siatka RLE wycinka x 1–61, y 17–50 (61×34; reszta płótna przezroczysta; legenda: A = #6b4a5e (525 px), B = #f6d098 (496 px), C = #f7b2cc (164 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #f28aa5 (42 px), G = #9fd6b8 (18 px), H = #a6dcc4 (6 px), I = #f6d98b (6 px), J = #fff1c9 (5 px), K = #c3b3ea (4 px)):

```
31.2G
31.2G
25.2A8G3A
24.4A6G5A
24.3A8F4A
24.3A9F3A
25.3AFJ3FJF3A
25.3A7F3A
7.22A5F21A
6.23A2FJFJ22A
6.24A3F23A
6.3AC2H10C2D3C3AJ2F3A10C2I5C3A
6.3A19C7A18C3A
6.3A5C2I10C2HC5A4C2D10C2KC3A
6.3A21C3A20C3A
6.3A7B2C2K8B2C2I2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/tort-harry.png`
64×64 px, kotwica (32, 32). Tort Harry’ego. Jak `ikony64/tort-gabi.png`, ale biszkopt czekoladowy #d8b39c, lukier #f6d098, na górze różowe serduszko #f59bbd.

Siatka RLE wycinka x 1–61, y 17–50 (61×34; reszta płótna przezroczysta; legenda: A = #d8b39c (496 px), B = #6b4a5e (462 px), C = #f6d098 (188 px), D = #f59bbd (106 px), E = #ffffff (105 px), F = #fff7e8 (88 px), G = #a6dcc4 (6 px), H = #c3b3ea (6 px), I = #f6d98b (6 px)):

```
26.4D2.4D
26.4D2.4D
24.14D
24.14D
24.14D
24.14D
26.10D
26.10D
7.21B6D21B
6.23B4D23B
6.22B2C2D2C22B
6.3BC2G10C2E6C2D2C2H10C2I5C3B
6.3B44C3B
6.3B5C2I10C2G10C2E10C2HC3B
6.3B44C3B
6.3B7A2C2H8A2C2I2A2C4A2C2G2A2C5A3B
6.3B25A2C4A2C4A2C5A3B
6.3B25A2C4A2C4A2C5A3B
6.3B31A2C11A3B
6.3B31A2C11A3B
6.3B44F3B
6.3B44F3B
6.3B44A3B
6.3B44A3B
6.3B44A3B
6.3B44A3B
6.3B44A3B
.8B44A7B
9B44A8B
8B46E7B
3B55E3B
61B
61B
.59B
```

#### `ikony64/tort-karabilein.png`
64×64 px, kotwica (32, 32). Tort Karabileina. Jak `ikony64/tort-gabi.png`, lukier #cfe8ff, na górze świeczka (paski #ffffff/#f7b2cc, płomyk #f6d98b z #fff7e0).

Siatka RLE wycinka x 1–61, y 17–50 (61×34; reszta płótna przezroczysta; legenda: A = #6b4a5e (515 px), B = #f6d098 (496 px), C = #cfe8ff (171 px), D = #ffffff (109 px), E = #fff7e8 (88 px), F = #f6d98b (19 px), G = #a6dcc4 (6 px), H = #c3b3ea (5 px), I = #f7b2cc (4 px), J = #fff7e0 (2 px)):

```
31.F
29.5F
29.2FJ2F
29.AFJFA
28.3AF3A
28.3AD3A
28.3AI3A
28.3AI3A
7.24AD23A
6.25AD24A
6.25AI24A
6.3AC2G10C2D4C3AI3AH10C2F5C3A
6.3A19C3AD3A18C3A
6.3A5C2F10C2GCA3CA4C2D10C2HC3A
6.3A44C3A
6.3A7B2C2H8B2C2F2B2C4B2C2G2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/tort-leili.png`
64×64 px, kotwica (32, 32). Tort Leili. Jak `ikony64/tort-gabi.png`, lukier #8fdcea, na górze kwiatek (płatki #f7b2cc, środek #f6d98b, łodyżka #9fd6b8).

Siatka RLE wycinka x 1–61, y 14–50 (61×37; reszta płótna przezroczysta; legenda: A = #6b4a5e (561 px), B = #f6d098 (495 px), C = #8fdcea (168 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #f7b2cc (52 px), G = #f6d98b (22 px), H = #a6dcc4 (6 px), I = #9fd6b8 (5 px), J = #c3b3ea (4 px)):

```
31.A
28.7A
27.9A
27.4AF4A
25.4A5F4A
24.5A5F5A
24.4A3FG3F4A
23.3A3F5G3F3A
23.3A3F5G3F3A
23.3A3F5G3F3A
24.4A3FG3F4A
7.22A5F21A
6.23A5F22A
6.25AF24A
6.3AC2H10C2D3C9A10C2G5C3A
6.3A19C7A18C3A
6.3A5C2G10C2H3CAI5C2D10C2JC3A
6.3A22C2I20C3A
6.3A7B2C2J8B2CG2IB2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/tort-lili.png`
64×64 px, kotwica (32, 32). Tort Lili. Jak `ikony64/tort-gabi.png`, lukier #bfe8d6, na górze wisienka #f28aa5 z szypułką #7fc49e.

Siatka RLE wycinka x 1–61, y 15–50 (61×36; reszta płótna przezroczysta; legenda: A = #6b4a5e (527 px), B = #f6d098 (496 px), C = #bfe8d6 (160 px), D = #ffffff (107 px), E = #fff7e8 (88 px), F = #f28aa5 (31 px), G = #a6dcc4 (6 px), H = #f6d98b (6 px), I = #7fc49e (5 px), J = #c3b3ea (4 px)):

```
34.I
34.I
33.I
33.I
31.AI
28.7A
27.9A
26.5AF5A
25.4A2D3F4A
25.3A7F3A
7.21A7F20A
6.22A7F21A
6.23A5F22A
6.3AC2G10C2D2C5AF5A9C2H5C3A
6.3A18C9A17C3A
6.3A5C2H10C2G7A3C2D10C2JC3A
6.3A22CA21C3A
6.3A7B2C2J8B2C2H2B2C4B2C2G2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/tort-mordka.png`
64×64 px, kotwica (32, 32). Tort Mordki. Jak `ikony64/tort-gabi.png`, lukier #ffd6b8, na górze ziarenko słonecznika (#8d7f99, pasek #f3eef8).

Siatka RLE wycinka x 1–61, y 15–50 (61×36; reszta płótna przezroczysta; legenda: A = #6b4a5e (548 px), B = #f6d098 (496 px), C = #ffd6b8 (174 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #f3eef8 (12 px), G = #8d7f99 (10 px), H = #a6dcc4 (6 px), I = #c3b3ea (6 px), J = #f6d98b (6 px)):

```
30.2A
29.4A
28.6A
27.8A
27.8A
28.2A2F2A
26.2A2G2F2G2A
25.4AG2FG4A
25.4AG2FG4A
25.4AG2FG4A
7.23A2F23A
6.50A
6.50A
6.3AC2H10C2D4C6A2I10C2J5C3A
6.3A20C4A20C3A
6.3A5C2J10C2H2C2A6C2D10C2IC3A
6.3A44C3A
6.3A7B2C2I8B2C2J2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/tort-mysia.png`
64×64 px, kotwica (32, 32). Tort Mysi. Jak `ikony64/tort-gabi.png`, lukier #d9ccf5, na górze trzy borówki #9aa8e8.

Siatka RLE wycinka x 1–61, y 16–50 (61×35; reszta płótna przezroczysta; legenda: A = #6b4a5e (572 px), B = #f6d098 (496 px), C = #d9ccf5 (158 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #9aa8e8 (32 px), G = #a6dcc4 (6 px), H = #f6d98b (6 px), I = #c3b3ea (4 px), J = #d9e0fa (1 px)):

```
31.A
28.7A
27.9A
27.4AF4A
26.3AFJ3F3A
25.4A5F4A
24.5A5F5A
24.7AF7A
23.3AF9AF3A
7.19A2F7A2F18A
6.20A3F3A5F19A
6.22AF5AF21A
6.3AC2G10C2D15A7C2H5C3A
6.3A16C13A15C3A
6.3A5C2H10C2GA5CA3C2D10C2IC3A
6.3A44C3A
6.3A7B2C2I8B2C2H2B2C4B2C2G2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/tort-titi.png`
64×64 px, kotwica (32, 32). Tort Titi. Jak `ikony64/tort-gabi.png`, lukier #c3b3ea, na górze gwiazdka #fff1c9.

Siatka RLE wycinka x 1–61, y 14–50 (61×37; reszta płótna przezroczysta; legenda: A = #6b4a5e (572 px), B = #f6d098 (496 px), C = #c3b3ea (171 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #fff1c9 (38 px), G = #f6d98b (6 px), H = #a6dcc4 (5 px)):

```
30.2A
29.4A
29.4A
28.6A
27.8A
23.7A2F7A
22.7A4F7A
23.4A8F4A
24.3A8F3A
25.3A6F3A
26.3A4F3A
7.22A4F22A
6.22AF4AF22A
6.50A
6.3AC2H10C2DC12A9C2G5C3A
6.3A16C4A4C4A16C3A
6.3A5C2G10CAH7CA2C2D13C3A
6.3A44C3A
6.3A7B4C8B2C2G2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

#### `ikony64/trzepaczka.png`
64×64 px, kotwica (32, 32). Trzepaczka w kuchni (mieszanie ciasta). Na dole lawendowa rączka #c3b3ea (pionowy prostokąt), u góry dwie zagnieżdżone pionowe pętle drutu i pionowy drut środkiem, szare #9a94ad, bez obrysu.

Siatka RLE wycinka x 15–51, y 8–57 (37×50; reszta płótna przezroczysta; legenda: A = #9a94ad (651 px), B = #c3b3ea (133 px)):

```
17.3A
11.15A
9.19A
7.23A
6.9A2.3A2.9A
5.9A3.3A3.9A
4.10A3.3A3.10A
3.5A.4A4.3A4.4A.5A
3.4A2.3A5.3A5.3A2.4A
2.4A2.4A5.3A5.4A2.4A
2.4A2.4A5.3A5.4A2.4A
.4A3.3A6.3A6.3A3.4A
.4A2.4A6.3A6.4A2.4A
4A3.4A6.3A6.4A3.4A
4A3.3A7.3A7.3A3.4A
3A4.3A7.3A7.3A4.3A
3A4.3A7.3A7.3A4.3A
3A4.3A7.3A7.3A4.3A
3A4.3A7.3A7.3A4.3A
3A4.3A7.3A7.3A4.3A
3A4.3A7.3A7.3A4.3A
3A4.3A7.3A7.3A4.3A
4A3.3A7.3A7.3A3.4A
4A3.4A6.3A6.4A3.4A
.4A2.4A6.3A6.4A2.4A
.4A3.3A6.3A6.3A3.4A
2.4A2.4A5.3A5.4A2.4A
2.4A2.4A5.3A5.4A2.4A
3.4A2.3A5.3A5.3A2.4A
3.5A.4A4.3A4.4A.5A
4.10A3.3A3.10A
5.9A3B3A3B9A
6.9A2B3A2B9A
7.23A
9.19A
11.15A
14.3B3A3B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
14.9B
```

#### `ikony64/wstecz.png`
64×64 px, kotwica (32, 32). Przycisk „wstecz” na każdym ekranie. Gruba strzałka w lewo: trójkątny grot po lewej i prostokątny trzon w prawo, #f59bbd z obrysem #6b4a5e.

Siatka RLE wycinka x 2–62, y 6–57 (61×52; reszta płótna przezroczysta; legenda: A = #f59bbd (1042 px), B = #6b4a5e (484 px)):

```
26.B
25.3B
24.5B
23.6B
22.3BA3B
21.3B2A3B
20.3B3A3B
19.3B4A3B
18.3B5A3B
17.3B6A3B
16.3B7A3B
15.3B8A3B
13.4B9A3B
12.4B10A3B
11.4B11A3B
10.3B13A33B
9.3B14A34B
8.3B16A34B
7.3B48A3B
6.3B49A3B
5.3B50A3B
4.3B51A3B
3.3B52A3B
2.3B53A3B
.3B54A3B
3B55A3B
3B55A3B
.3B54A3B
2.3B53A3B
3.3B52A3B
4.3B51A3B
5.3B50A3B
6.3B49A3B
7.3B48A3B
8.3B16A34B
9.3B14A34B
10.3B13A33B
11.4B11A3B
12.4B10A3B
13.4B9A3B
15.3B8A3B
16.3B7A3B
17.3B6A3B
18.3B5A3B
19.3B4A3B
20.3B3A3B
21.3B2A3B
22.3BA3B
23.6B
24.5B
25.3B
26.B
```

#### `ikony64/zebatka.png`
64×64 px, kotwica (32, 32). Przycisk ustawień. Zębatka #7a3f63: pierścień z 8 zębami dookoła i okrągłą dziurką w środku, bez obrysu.

Siatka RLE wycinka x 4–60, y 4–60 (57×57; reszta płótna przezroczysta; legenda: A = #7a3f63 (1720 px)):

```
24.9A
23.11A
24.9A
24.9A
24.9A
11.A12.9A12.A
10.3A11.9A11.3A
9.5A10.9A10.5A
8.7A9.9A9.7A
7.9A8.9A8.9A
6.10A5.15A5.10A
5.12A2.19A2.12A
6.45A
7.43A
8.41A
9.39A
11.35A
12.33A
12.33A
11.35A
11.35A
10.37A
10.16A5.16A
.A8.14A9.14A8.A
23A11.23A
23A11.23A
22A13.22A
22A13.22A
22A13.22A
22A13.22A
22A13.22A
23A11.23A
23A11.23A
.A8.14A9.14A8.A
10.16A5.16A
10.37A
11.35A
11.35A
12.33A
12.33A
11.35A
9.39A
8.41A
7.43A
6.45A
5.12A2.19A2.12A
6.10A5.15A5.10A
7.9A8.9A8.9A
8.7A9.9A9.7A
9.5A10.9A10.5A
10.3A11.9A11.3A
11.A12.9A12.A
24.9A
24.9A
24.9A
23.11A
24.9A
```

## Część B: kuchnia, cukiernia

Wspólne oznaczenia (dotyczą wszystkich opisów w tym pliku):

- Współrzędne to (kolumna, wiersz) w pikselach obrazka, liczone od 0 od lewego górnego rogu. Zakres „cols 3..7” obejmuje oba końce.
- `O` = obrys `#6b4a5e`, `W` = `#ffffff`, `.` = przezroczysty. Wszystkie kolory pełne (bez półprzezroczystości), bez wygładzania.
- `round` = zaokrąglenie jak w JS `Math.round` (x.5 w górę, także -19.5 → -19).
- ELIPSA(cx, cy, rx, ry, kolor): dla każdego dy od -ry do ry: dx = round(rx·√(1 − dy²/ry²)); zamaluj wiersz cy+dy od cx−dx do cx+dx. Na górze i na dole wychodzi pojedynczy piksel (dx = 0) – ten „czubek” jest częścią obrazka.
- KOŁO(cx, cy, r, kolor): dla dy od -r do r: dx = round(√(r² − dy²)); wiersz cy+dy od cx−dx do cx+dx.
- BOX(x, y, w, h, wypełnienie): prostokąt z obrysem O grubości 2 px i ściętymi rogami: wiersz y i y+h−1 → O w cols x+2..x+w−3; wiersz y+1 i y+h−2 → O w cols x+1..x+w−2; pozostałe wiersze → O w cols x, x+1 oraz x+w−2, x+w−1; środek cols x+2..x+w−3 × wiersze y+2..y+h−3 = wypełnienie.
- SERCE(x0, y0, s, kolor): wzór 7×6 komórek, każda komórka to kwadrat s×s, lewy górny róg w (x0, y0); `P` = kolor:
  ```
  .PP.PP.
  PPPPPPP
  PPPPPPP
  .PPPPP.
  ..PPP..
  ...P...
  ```
- Rysujemy w podanej kolejności; późniejsze warstwy przykrywają wcześniejsze.

### kuchnia/

Ekran kuchni (KitchenScene): dzieci wrzucają składniki do miski, mieszają, pieką ciasto w piekarniku i dekorują tort ulubionej postaci (lukier, posypka, dodatek), a potem postać zjada go kęs po kęsie.

#### `kuchnia/cukier.png`
27×29 px, kotwica (13, 14). Słoik kostek cukru – składnik lecący do miski. Najpierw BOX(2, 5, 23, 24, `#cfe8ff`) – szklany słoik (szkło cols 4..22, wiersze 7..26), potem pokrywka BOX(0, 0, 27, 6, `#d9ccf5`) (fiolet wiersze 2..3, cols 2..24), która zakrywa górny wiersz słoika – wiersz 6 to linia O cols 3..23. Trzy białe kostki 5×5 px `#ffffff`: cols 11..15 wiersze 11..15; cols 7..11 wiersze 18..22; cols 15..19 wiersze 18..22. Mapa:
```
..OOOOOOOOOOOOOOOOOOOOOOO..
.OOOOOOOOOOOOOOOOOOOOOOOOO.
OOAAAAAAAAAAAAAAAAAAAAAAAOO
OOAAAAAAAAAAAAAAAAAAAAAAAOO
.OOOOOOOOOOOOOOOOOOOOOOOOO.
..OOOOOOOOOOOOOOOOOOOOOOO..
...OOOOOOOOOOOOOOOOOOOOO...
..OOBBBBBBBBBBBBBBBBBBBOO..
..OOBBBBBBBBBBBBBBBBBBBOO..
..OOBBBBBBBBBBBBBBBBBBBOO..
..OOBBBBBBBBBBBBBBBBBBBOO..
..OOBBBBBBBWWWWWBBBBBBBOO..   (wiersze 11..15 tak samo)
..OOBBBBBBBBBBBBBBBBBBBOO..   (wiersze 16..17)
..OOBBBWWWWWBBBWWWWWBBBOO..   (wiersze 18..22 tak samo)
..OOBBBBBBBBBBBBBBBBBBBOO..   (wiersze 23..26)
...OOOOOOOOOOOOOOOOOOOOO...   (wiersz 27)
....OOOOOOOOOOOOOOOOOOO....   (wiersz 28)
```
A = `#d9ccf5`, B = `#cfe8ff`.

#### `kuchnia/dodatek-gabi.png`
28×26 px, kotwica (14, 61). Dodatek na tort Gabi: żółta gwiazdka. Identyczny piksel w piksel z `kuchnia/dodatek-titi.png` (ta sama mapa).

#### `kuchnia/dodatek-harbin.png`
21×22 px, kotwica (10, 55). Dodatek na tort Harbina: truskawka (różowy trójkąt z zaokrąglonym dołem, zielone listki, jasne pestki). A = `#9fd6b8` (szypułka i listki), B = `#f28aa5`, C = `#fff1c9` (pestki):
```
..........AA.........
..........AA.........
....AAAAAAAAAAAAAA...
OOOOAAAAAAAAAAAAAAOOO
OBBBBBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBBBBBO
.OBBBBBBBBBBBBBBBBBO.
.OBBBBBBBBBBBBBBBBBO.
.OBBBBCBBBBBBCBBBBBO.
..OBBBBBBBBBBBBBBBO..
..OBBBBBBBBBBBBBBBO..
..OBBBBBBBBBBBBBBBO..
...OBBBBBBBBBBBBBO...
....OBBBBBCBBBBBO....
....OBBBBBBBBBCBO....
.....OBBBBBBBBBO.....
.....OBBBBBBBBBO.....
......OBCBBBBBO......
.......OBBBBBO.......
.......OBBBBBO.......
........OBBBO........
.........OOO.........
```

#### `kuchnia/dodatek-harry.png`
21×18 px, kotwica (10, 56). Dodatek na tort Harry'ego: różowe serduszko bez obrysu. SERCE(0, 0, 3, `#f59bbd`) – każda komórka wzoru to 3×3 px.

#### `kuchnia/dodatek-karabilein.png`
7×23 px, kotwica (3, 59). Dodatek na tort Karabilein: świeczka w biało-różowe paski z płomykiem. A = `#f6d98b` (płomień), B = `#fff7e0` (środek płomienia), C = `#f7b2cc`:
```
...A...
.AAAAA.
AAAAAAA
AAAAAAA
AAABBAA
AAABBAA
AAABBAA
OAABBAO
OWWAWWO
OWWWWWO
OWWWWWO
OWWWWWO
OCCCCCO
OCCCCCO
OCCCCCO
OCCCCCO
OWWWWWO
OWWWWWO
OWWWWWO
OWWWWWO
OCCCCCO
OCCCCCO
OCCCCCO
```
(Świeczka nie ma dolnej linii obrysu – kończy się różowym paskiem.)

#### `kuchnia/dodatek-leili.png`
25×31 px, kotwica (12, 61). Dodatek na tort Leili: kwiatek – cztery różowe płatki (koła) wokół żółtego środka, na zielonej łodyżce. A = `#f7b2cc`, B = `#f6d98b`, C = `#9fd6b8`:
```
............O............
.........OOOAOOO.........
........OAAAAAAAO........
.......OAAAAAAAAAO.......
......OAAAAAAAAAAAO......
......OAAAAAAAAAAAO......
......OAAAAAAAAAAAO......
...OOOAAAAAAAAAAAAAOOO...
..OAAAAAAAAABAAAAAAAAAO..
.OAAAAAAABBBBBBBAAAAAAAO.
OAAAAAAAABBBBBBBAAAAAAAAO
OAAAAAAABBBBBBBBBAAAAAAAO
OAAAAAAABBBBBBBBBAAAAAAAO
OAAAAAAABBBBBBBBBAAAAAAAO
OAAAAAAAABBBBBBBAAAAAAAAO
.OAAAAAAABBBBBBBAAAAAAAO.
..OAAAAAAAAABAAAAAAAAAO..
...OOOAAAAAAAAAAAAAOOO...
......OAAAAAAAAAAAO......
......OAAAAAAAAAAAO......
......OAAAAAAAAAAAO......
.......OAAAAAAAAAOC......
........OAAAAAAAOCC......
.........OOOAOOO.........
............OC...........
............CC...........
............CC...........
............CC...........
............CC...........
............CC...........
............CC...........
```

#### `kuchnia/dodatek-lili.png`
17×27 px, kotwica (8, 62). Dodatek na tort Lili: wisienka – różowa kulka z białym błyskiem i ukośną zieloną szypułką w prawo do góry. A = `#7fc49e`, B = `#f28aa5`:
```
..............AA.
.............AA..
.............AA..
............AA...
............AA...
...........AA....
...........AA....
..........AA.....
..........AA.....
.........AA......
........OAA......
....OOOOBOOOO....
...OBBBBBBBBBO...
..OBBBBBBBBBBBO..
.OBBWWBBBBBBBBBO.
.OBBBBBBBBBBBBBO.
OBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBO
.OBBBBBBBBBBBBBO.
.OBBBBBBBBBBBBBO.
..OBBBBBBBBBBBO..
...OBBBBBBBBBO...
....OOOOBOOOO....
........O........
```

#### `kuchnia/dodatek-mordka.png`
15×21 px, kotwica (7, 57). Dodatek na tort Mordki: pestka słonecznika (ta sama co w terrarium), wzór 5×7 komórek powiększony 3× (każda komórka 3×3 px). Wzór: O = `#6b4a5e`, G = `#8d7f99`, L = `#f3eef8`:
```
..O..
.OGO.
.GLG.
OGLGO
OGLGO
.OGO.
..O..
```

#### `kuchnia/dodatek-mysia.png`
24×19 px, kotwica (11, 56). Dodatek na tort Mysi: trzy borówki (dwie na dole, jedna wyżej na środku), niebieskie z jasnym punktem. A = `#9aa8e8`, B = `#d9e0fa`:
```
...........O............
........OOOAOOO.........
.......OAAAAAAAO........
......OAAAAAAAAAO.......
.....OAAAAAAAAAAAO......
.....OAAAABAAAAAAO......
.....OAAAAAAAAAAAO......
...OOOAAAAAAAAAAAOOOO...
..OAAOAAAAAAAAAAAOAAAO..
.OAAAAOAAAAAAAAAOAAAAAO.
OAAAAAAOAAAAAAAOAAAAAAAO
OAAAABAAOOOAOOOABAAAAAAO
OAAAAAAAAAAOAAAAAAAAAAAO
OAAAAAAAAAAOAAAAAAAAAAAO
OAAAAAAAAAAOAAAAAAAAAAAO
.OAAAAAAAAAOOAAAAAAAAAO.
..OAAAAAAAO..OAAAAAAAO..
...OOOAOOO....OOOAOOO...
......O..........O......
```

#### `kuchnia/dodatek-titi.png`
28×26 px, kotwica (14, 61). Dodatek na tort Titi: pięcioramienna gwiazdka w kolorze `#fff1c9` z obrysem O (miejscami 2 px). A = `#fff1c9`:
```
.............OO.............
.............OO.............
............OAAO............
............OAAO............
...........OAAAAO...........
...........OAAAAO...........
..........OAAAAAAO..........
..........OAAAAAAO..........
......OOOOOAAAAAAOOOOO......
OOOOOOAAAAAAAAAAAAAAAAOOOOOO
.OAAAAAAAAAAAAAAAAAAAAAAAAO.
..OAAAAAAAAAAAAAAAAAAAAAAO..
...OAAAAAAAAAAAAAAAAAAAAO...
....OAAAAAAAAAAAAAAAAAAO....
.....OOAAAAAAAAAAAAAAOO.....
......OOAAAAAAAAAAAAOO......
.......OAAAAAAAAAAAAO.......
.......OAAAAAAAAAAAAO.......
.......OAAAAAAAAAAAAO.......
......OAAAAAAAAAAAAAAO......
......OAAAAAAAAAAAAAAO......
......OAAAAAOOOOAAAAAO......
......OAAAOO....OOAAAO......
......OAOO........OOAO......
.....OOO............OOO.....
.....OO..............OO.....
```

#### `kuchnia/drzwiczki-szafki.png`
84×59 px, kotwica (0, 0). Drzwiczki szafki pod blatem. BOX(0, 0, 84, 59, `#d4f2e4`) (miętowe wypełnienie cols 2..81, wiersze 2..56). Uchwyt: prostokąt `#c3b3ea` cols 33..50, wiersze 9..13 (18×5 px), bez obrysu.

#### `kuchnia/forma-do-ciasta.png`
48×12 px, kotwica (24, 6). Forma z ciastem lecąca do piekarnika. Cały prostokąt 48×12 w kolorze O; na nim wypełnienie `#ffe3a3` cols 1..46, wiersze 1..8. Wiersze 9..11 zostają całe w O (gruby spód formy), wiersz 0 oraz kolumny 0 i 47 to obrys 1 px. Rogi nie są ścięte.

#### `kuchnia/jajko.png`
25×33 px, kotwica (12, 16). Jajko – składnik. ELIPSA(12, 16, 12, 16, O), potem ELIPSA(12, 16, 11, 15, `#fff7e8`), potem biały błysk `#ffffff` 2×3 px w cols 6..7, wiersze 8..10. Mapa (A = `#fff7e8`):
```
............O............
........OOOOAOOOO........
......OOAAAAAAAAAOO......
.....OOAAAAAAAAAAAOO.....
....OAAAAAAAAAAAAAAAO....
...OOAAAAAAAAAAAAAAAOO...
...OAAAAAAAAAAAAAAAAAO...
..OAAAAAAAAAAAAAAAAAAAO..
..OAAAWWAAAAAAAAAAAAAAO..
.OAAAAWWAAAAAAAAAAAAAAAO.
.OAAAAWWAAAAAAAAAAAAAAAO.
.OAAAAAAAAAAAAAAAAAAAAAO.
OAAAAAAAAAAAAAAAAAAAAAAAO   (wiersze 12..20 tak samo)
.OAAAAAAAAAAAAAAAAAAAAAO.   (wiersze 21..23)
..OAAAAAAAAAAAAAAAAAAAO..   (wiersze 24..25)
...OAAAAAAAAAAAAAAAAAO...
...OOAAAAAAAAAAAAAAAOO...
....OAAAAAAAAAAAAAAAO....
.....OOAAAAAAAAAAAOO.....
......OOAAAAAAAAAOO......
........OOOOAOOOO........
............O............
```

#### `kuchnia/kafelki.png`
24×24 px, kotwica (0, 0). Wzór powtarzany: szachownica kafelków nad blatem, kafelek 12×12 px, kolory `#ffffff` i `#ffe1ec`. Szachownica jest przesunięta w pionie o 3 px: wiersze 0..2 – lewa połowa (cols 0..11) biała, prawa (12..23) różowa; wiersze 3..14 – lewa różowa, prawa biała; wiersze 15..23 – lewa biała, prawa różowa. Obrazek kładzie się obok siebie i jeden pod drugim bez szwu (wiersze 15..23 łączą się z wierszami 0..2 następnej kopii w pełny kafelek 12 px).

#### `kuchnia/kawalek-gabi.png`
17×14 px, kotwica (9, 7). Kawałek tortu Gabi lecący do buzi postaci. Rodzina „kawałek”: prostokąt 17×14 z obrysem O 1 px (bez ściętych rogów); środek cols 1..15: wiersze 1..5 = lukier, wiersze 6..12 = biszkopt; wiersz 13 = O. Kolory wg tabeli przy `kuchnia/tort-titi.png`: tu lukier `#f5b3dc`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-gabi-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-gabi.png`, ale wiersze 1..5 w kolorze `#fff7e8` (jasna góra ciasta zamiast lukru). Biszkopt `#f6d098`.

#### `kuchnia/kawalek-harbin.png`
17×14 px, kotwica (9, 7). Kawałek tortu Harbina, kształt jak `kuchnia/kawalek-gabi.png`: lukier `#f7b2cc`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-harbin-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-harbin.png`, góra `#fff7e8` zamiast lukru.

#### `kuchnia/kawalek-harry.png`
17×14 px, kotwica (9, 7). Kawałek tortu Harry'ego, kształt jak `kuchnia/kawalek-gabi.png`: lukier `#f6d098`, biszkopt czekoladowy `#d8b39c`.

#### `kuchnia/kawalek-harry-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-harry.png`, góra `#fff7e8`, biszkopt `#d8b39c`.

#### `kuchnia/kawalek-karabilein.png`
17×14 px, kotwica (9, 7). Kawałek tortu Karabilein: lukier `#cfe8ff`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-karabilein-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-karabilein.png`, góra `#fff7e8`.

#### `kuchnia/kawalek-leili.png`
17×14 px, kotwica (9, 7). Kawałek tortu Leili: lukier `#8fdcea`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-leili-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-leili.png`, góra `#fff7e8`.

#### `kuchnia/kawalek-lili.png`
17×14 px, kotwica (9, 7). Kawałek tortu Lili: lukier `#bfe8d6`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-lili-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-lili.png`, góra `#fff7e8`.

#### `kuchnia/kawalek-mordka.png`
17×14 px, kotwica (9, 7). Kawałek tortu Mordki: lukier `#ffd6b8`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-mordka-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-mordka.png`, góra `#fff7e8`.

#### `kuchnia/kawalek-mysia.png`
17×14 px, kotwica (9, 7). Kawałek tortu Mysi: lukier `#d9ccf5`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-mysia-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-mysia.png`, góra `#fff7e8`.

#### `kuchnia/kawalek-titi.png`
17×14 px, kotwica (9, 7). Kawałek tortu Titi: lukier `#c3b3ea`, biszkopt `#f6d098`.

#### `kuchnia/kawalek-titi-bez-lukru.png`
17×14 px, kotwica (9, 7). Jak `kuchnia/kawalek-titi.png`, góra `#fff7e8`.

#### `kuchnia/kleks-cukier.png`
11×11 px, kotwica (5, 5). Kleks składnika w misce, bez obrysu. Rodzina „kleks”: KOŁO(5, 5, 5) – szerokości wierszy od góry: 1, 7, 9, 11, 11, 11, 11, 11, 9, 7, 1 (wyśrodkowane). Kolor cukru: `#fff7f0`.

#### `kuchnia/kleks-jajko.png`
11×11 px, kotwica (5, 5). Jak `kuchnia/kleks-cukier.png`, kolor żółtka `#ffd86b`.

#### `kuchnia/kleks-maka.png`
11×11 px, kotwica (5, 5). Jak `kuchnia/kleks-cukier.png`, kolor `#ffffff`.

#### `kuchnia/kleks-mleko.png`
11×11 px, kotwica (5, 5). Jak `kuchnia/kleks-cukier.png`, kolor `#e4f1ff`.

#### `kuchnia/kratka-postepu.png`
10×10 px, kotwica (1, 1). Pusta kratka paska postępu (ile kroków przepisu zrobione). Kwadrat 10×10: obrys O 1 px dookoła (bez ściętych rogów), środek 8×8 (cols 1..8, wiersze 1..8) biały `#ffffff`.

#### `kuchnia/kratka-postepu-pelna.png`
10×10 px, kotwica (1, 1). Jak `kuchnia/kratka-postepu.png`, środek 8×8 różowy `#f59bbd` (krok zrobiony).

#### `kuchnia/lukier-gabi.png`
84×15 px, kotwica (42, 40). Warstwa lukru na torcie Gabi, kładziona na `kuchnia/tort-gabi.png`. Rodzina „lukier” (bez obrysu, jeden kolor): pas 84×10 px (wiersze 0..9, cols 0..83), pod nim 14 sopli 2 px szerokości w cols 2–3, 8–9, 14–15, … co 6 px aż do 80–81. Sople na zmianę krótki i długi, zaczynając od krótkiego: krótki = wiersze 10..12 (3 px), długi = wiersze 10..14 (5 px); długie są w cols 8, 20, 32, 44, 56, 68, 80. Kolor Gabi: `#f5b3dc`.

#### `kuchnia/lukier-gabi-kes-1.png`
56×15 px, kotwica (42, 40). Lukier Gabi po pierwszym kęsie: jak `kuchnia/lukier-gabi.png`, ale ucięty z prawej do szerokości 56 (pas cols 0..55) i tylko 9 pierwszych sopli (cols 2..51; długie w 8, 20, 32, 44). Kotwica bez zmian, więc lewy brzeg zostaje w tym samym miejscu.

#### `kuchnia/lukier-gabi-kes-2.png`
28×15 px, kotwica (42, 40). Lukier Gabi po drugim kęsie: pas cols 0..27, 4 sople (cols 2, 8, 14, 20; długie 8 i 20). Kolor `#f5b3dc`.

#### `kuchnia/lukier-harbin.png`
84×15 px, kotwica (42, 40). Lukier Harbina, kształt jak `kuchnia/lukier-gabi.png`, kolor `#f7b2cc`.

#### `kuchnia/lukier-harbin-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#f7b2cc`.

#### `kuchnia/lukier-harbin-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#f7b2cc`.

#### `kuchnia/lukier-harry.png`
84×15 px, kotwica (42, 40). Lukier Harry'ego, kształt jak `kuchnia/lukier-gabi.png`, kolor `#f6d098`.

#### `kuchnia/lukier-harry-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#f6d098`.

#### `kuchnia/lukier-harry-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#f6d098`.

#### `kuchnia/lukier-karabilein.png`
84×15 px, kotwica (42, 40). Lukier Karabilein, kształt jak `kuchnia/lukier-gabi.png`, kolor `#cfe8ff`.

#### `kuchnia/lukier-karabilein-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#cfe8ff`.

#### `kuchnia/lukier-karabilein-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#cfe8ff`.

#### `kuchnia/lukier-leili.png`
84×15 px, kotwica (42, 40). Lukier Leili, kształt jak `kuchnia/lukier-gabi.png`, kolor `#8fdcea`.

#### `kuchnia/lukier-leili-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#8fdcea`.

#### `kuchnia/lukier-leili-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#8fdcea`.

#### `kuchnia/lukier-lili.png`
84×15 px, kotwica (42, 40). Lukier Lili, kształt jak `kuchnia/lukier-gabi.png`, kolor `#bfe8d6`.

#### `kuchnia/lukier-lili-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#bfe8d6`.

#### `kuchnia/lukier-lili-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#bfe8d6`.

#### `kuchnia/lukier-mordka.png`
84×15 px, kotwica (42, 40). Lukier Mordki, kształt jak `kuchnia/lukier-gabi.png`, kolor `#ffd6b8`.

#### `kuchnia/lukier-mordka-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#ffd6b8`.

#### `kuchnia/lukier-mordka-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#ffd6b8`.

#### `kuchnia/lukier-mysia.png`
84×15 px, kotwica (42, 40). Lukier Mysi, kształt jak `kuchnia/lukier-gabi.png`, kolor `#d9ccf5`.

#### `kuchnia/lukier-mysia-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#d9ccf5`.

#### `kuchnia/lukier-mysia-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#d9ccf5`.

#### `kuchnia/lukier-titi.png`
84×15 px, kotwica (42, 40). Lukier Titi, kształt jak `kuchnia/lukier-gabi.png`, kolor `#c3b3ea`.

#### `kuchnia/lukier-titi-kes-1.png`
56×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-1.png`, kolor `#c3b3ea`.

#### `kuchnia/lukier-titi-kes-2.png`
28×15 px, kotwica (42, 40). Jak `kuchnia/lukier-gabi-kes-2.png`, kolor `#c3b3ea`.

#### `kuchnia/maka.png`
24×31 px, kotwica (12, 14). Worek mąki z różową przewiązką i złotym kłosem – składnik. A = `#fff7fb`, B = `#f59bbd` (tasiemka), C = `#f6d98b` (kłos):
```
.....OOOOOOOOOOOOOO.....
.....OAAAAAAAAAAAAO.....
.....OAAAAAAAAAAAAO.....
.....OAAAAAAAAAAAAO.....
.....BBBBBBBBBBBBBB.....
..OOOBBBBBBBBBBBBBBOOO..
.OOOOOOOOOOOOOOOOOOOOOO.
OOAAAAAAAAAAAAAAAAAAAAOO   (wiersze 7..11 tak samo)
OOAAAAAAAACCCCCAAAAAAAOO   (wiersze 12..13)
OOAAAAAAAAAACAAAAAAAAAOO   (wiersz 14)
OOAAAAAAAACCCCCAAAAAAAOO   (wiersze 15..16)
OOAAAAAAAAAACAAAAAAAAAOO   (wiersz 17)
OOAAAAAAAACCCCCAAAAAAAOO   (wiersze 18..19)
OOAAAAAAAAAACAAAAAAAAAOO   (wiersze 20..25)
OOAAAAAAAAAAAAAAAAAAAAOO   (wiersze 26..28)
.OOOOOOOOOOOOOOOOOOOOOO.   (wiersz 29)
..OOOOOOOOOOOOOOOOOOOO..   (wiersz 30)
```
Worek to BOX(0, 5, 24, 26, `#fff7fb`); szyjka cols 5..18 wiersze 0..4 (obrys 1 px), tasiemka 14×2 px w wierszach 4..5.

#### `kuchnia/miska.png`
93×47 px, kotwica (46, 46). Niebieska miska na blacie, widziana lekko z góry (owalny otwór). Kolejność (cx = 46, brzeg w wierszu 10):
1. Brzuch – obrys O: dla dy = 0..36: half = round(46·√(1 − (dy/37)²)), wiersz 10+dy, cols 46−half..46+half.
2. Brzuch – wypełnienie `#cfe8ff`: dla dy = 1..35: half = round(45·√(1 − (dy/36)²)) − 1, wiersz 10+dy, cols 46−half..46+half.
3. Błysk `#ffffff`: cols 19..21, wiersze 19..26.
4. ELIPSA(46, 10, 46, 10, O) – brzeg otworu.
5. ELIPSA(46, 10, 44, 8, `#b9d9f5`) – wnętrze miski.
Wychodzi: na dole obrys 2–3 px grubości po skosach, ostatni wiersz 46 to O cols 35..57; pojedynczy piksel O w (46, 0) i jasny piksel wnętrza w (46, 2) w linii obrysu, podobnie na dole elipsy: wiersz 18 ma piksel `#b9d9f5` w col 46 wśród O, a wiersz 20 ma pojedynczy piksel O w col 46 na tle `#cfe8ff`.

#### `kuchnia/miska-ciasto.png`
89×17 px, kotwica (44, 44). Surowe ciasto w misce (kładzione na otwór miski). ELIPSA(44, 8, 44, 8, `#fff1c9`), bez obrysu. Szerokości wierszy od góry: 1, 43, 59, 69, 77, 83, 87, 89, 89, 89, 87, 83, 77, 69, 59, 43, 1 (wyśrodkowane).

#### `kuchnia/miska-ciasto-wymieszane.png`
89×17 px, kotwica (44, 44). Wymieszane ciasto: ta sama elipsa co `kuchnia/miska-ciasto.png`, ale w kolorze `#ffe3a3`, plus trzy poziome smugi `#f6d098` 1 px wysokości: wiersz 6 cols 47..60; wiersz 8 cols 29..40; wiersz 10 cols 38..52.

#### `kuchnia/mleko.png`
18×31 px, kotwica (9, 15). Karton mleka z błękitnym spiczastym daszkiem i błękitnym paskiem. A = `#cfe8ff`:
```
........OO........
.......AAAA.......
......AAAAAA......
.....AAAAAAAA.....
....AAAAAAAAAA....
...AAAAAAAAAAAA...
..AAAAAAAAAAAAAA..
.AAAAAAAAAAAAAAAA.
AAAAAAAAAAAAAAAAAA
..OOOOOOOOOOOOOO..
.OOOOOOOOOOOOOOOO.
OOWWWWWWWWWWWWWWOO   (wiersze 11..16)
OOAAAAAAAAAAAAAAOO   (wiersze 17..22)
OOWWWWWWWWWWWWWWOO   (wiersze 23..28)
.OOOOOOOOOOOOOOOO.   (wiersz 29)
..OOOOOOOOOOOOOO..   (wiersz 30)
```
Karton to BOX(0, 9, 18, 22, `#ffffff`); daszek nie ma obrysu po bokach, tylko ciemny czubek 2 px u góry.

#### `kuchnia/okno-z-polka.png`
102×81 px, kotwica (6, 0). Okno kuchni z chmurką oraz półka z różowym serduszkiem pod oknem. Kolejność:
1. BOX(6, 0, 90, 63, `#cfe8ff`) – szyba (niebo cols 8..93, wiersze 2..60).
2. Chmurka: najpierw obrys O – KOŁO(45, 35, 8), KOŁO(57, 30, 10), KOŁO(68, 34, 8) i prostokąt cols 39..73 × wiersze 35..41; potem biel `#ffffff` – KOŁO(45, 35, 7), KOŁO(57, 30, 9), KOŁO(68, 34, 7) i prostokąt cols 40..72 × wiersze 35..40; potem cień `#e6eefc` cols 40..72 × wiersze 40..41.
3. Szprosa: biały pasek `#ffffff` cols 50..51, wiersze 2..60 (przechodzi też przez chmurkę).
4. Półka: pasek O cols 0..101, wiersze 78..80.
5. Serce: SERCE(41, 60, 3, `#f59bbd`) – cols 41..61, wiersze 60..77; górne „uszy” serca zachodzą na dolną ramę okna (wiersze 60..62), w przerwie między nimi (cols 50..52) widać ramę/szybę.

#### `kuchnia/piekarnik.png`
96×81 px, kotwica (48, 81). Biały piekarnik stojący na blacie (kotwica = środek dolnej krawędzi). BOX(0, 0, 96, 81, `#f7f9ff`). Panel sterowania `#d9ccf5` cols 2..93, wiersze 2..15. Dwa pokrętła O: KOŁO(15, 9, 3) i KOŁO(81, 9, 3) (szerokości wierszy 1, 5, 7, 7, 7, 5, 1 w wierszach 6..12). Uchwyt drzwiczek: pasek O cols 12..83, wiersze 21..22. Reszta korpusu `#f7f9ff` (szybkę dokłada osobny obrazek `kuchnia/szybka-piekarnika*.png`).

#### `kuchnia/posypka-na-torcie.png`
78×5 px, kotwica (40, 39). Kolorowa posypka na wierzchu tortu (kładziona na lukier). 20 kresek 2×1 px: kreska i (i = 0..19) leży w cols 4i..4i+1, w wierszu 2·(i mod 3) (czyli 0, 2, 4, 0, 2, 4, …), kolor cyklicznie: `#a6dcc4`, `#f6d98b`, `#c3b3ea`, `#ffffff` (i mod 4 = 0, 1, 2, 3). Reszta przezroczysta.

#### `kuchnia/posypka-na-torcie-kes-1.png`
50×5 px, kotwica (40, 39). Jak `kuchnia/posypka-na-torcie.png`, ale tylko kreski i = 0..12 (cols 0..49).

#### `kuchnia/posypka-na-torcie-kes-2.png`
22×5 px, kotwica (40, 39). Jak `kuchnia/posypka-na-torcie.png`, ale tylko kreski i = 0..5 (cols 0..21).

#### `kuchnia/szybka-piekarnika.png`
72×43 px, kotwica (0, 0). Szybka w drzwiczkach piekarnika, pusta. BOX(0, 0, 72, 43, `#c3b3ea`).

#### `kuchnia/szybka-piekarnika-z-forma.png`
72×43 px, kotwica (0, 0). Szybka z formą ciasta w środku. BOX(0, 0, 72, 43, `#c3b3ea`); forma: prostokąt O cols 9..62 × wiersze 29..37, na nim ciasto `#ffe3a3` cols 10..61 × wiersze 30..35 (wiersze 36..37 zostają O – gruby spód).

#### `kuchnia/szybka-piekarnika-z-forma-goraca.png`
72×43 px, kotwica (0, 0). Piekarnik grzeje: jak `kuchnia/szybka-piekarnika-z-forma.png`, ale wypełnienie szybki `#ffd6b8` (ciepłe światło), a ciasto w formie `#f6d098` (upieczone).

#### `kuchnia/talerzyk-pusty.png`
106×7 px, kotwica (53, 6). Pusty talerzyk po zjedzeniu tortu. Prostokąt 106×7 w O, środek `#ffffff` cols 1..104 × wiersze 1..5 (obrys 1 px, rogi nieścięte).

#### `kuchnia/tort-gabi.png`
106×42 px, kotwica (53, 41). Tort Gabi na talerzyku. Ten sam kształt co `kuchnia/tort-titi.png` (opis rodziny tam), biszkopt `#f6d098` – piksel w piksel taki sam jak `kuchnia/tort-titi.png`.

#### `kuchnia/tort-gabi-kes-1.png`
106×42 px, kotwica (53, 41). Jak `kuchnia/tort-titi-kes-1.png` (biszkopt `#f6d098`).

#### `kuchnia/tort-gabi-kes-2.png`
106×42 px, kotwica (53, 41). Jak `kuchnia/tort-titi-kes-2.png` (biszkopt `#f6d098`).

#### `kuchnia/tort-harbin.png`
106×42 px, kotwica (53, 41). Tort Harbina: identyczny z `kuchnia/tort-titi.png`.

#### `kuchnia/tort-harbin-kes-1.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-1.png`.

#### `kuchnia/tort-harbin-kes-2.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-2.png`.

#### `kuchnia/tort-harry.png`
106×42 px, kotwica (53, 41). Tort Harry'ego: jak `kuchnia/tort-titi.png`, ale biszkopt czekoladowy `#d8b39c` (kremowy pasek `#fff7e8` bez zmian).

#### `kuchnia/tort-harry-kes-1.png`
106×42 px, kotwica (53, 41). Jak `kuchnia/tort-titi-kes-1.png`, biszkopt `#d8b39c`.

#### `kuchnia/tort-harry-kes-2.png`
106×42 px, kotwica (53, 41). Jak `kuchnia/tort-titi-kes-2.png`, biszkopt `#d8b39c`.

#### `kuchnia/tort-karabilein.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi.png`.

#### `kuchnia/tort-karabilein-kes-1.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-1.png`.

#### `kuchnia/tort-karabilein-kes-2.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-2.png`.

#### `kuchnia/tort-leili.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi.png`.

#### `kuchnia/tort-leili-kes-1.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-1.png`.

#### `kuchnia/tort-leili-kes-2.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-2.png`.

#### `kuchnia/tort-lili.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi.png`.

#### `kuchnia/tort-lili-kes-1.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-1.png`.

#### `kuchnia/tort-lili-kes-2.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-2.png`.

#### `kuchnia/tort-mordka.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi.png`.

#### `kuchnia/tort-mordka-kes-1.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-1.png`.

#### `kuchnia/tort-mordka-kes-2.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-2.png`.

#### `kuchnia/tort-mysia.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi.png`.

#### `kuchnia/tort-mysia-kes-1.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-1.png`.

#### `kuchnia/tort-mysia-kes-2.png`
106×42 px, kotwica (53, 41). Identyczny z `kuchnia/tort-titi-kes-2.png`.

#### `kuchnia/tort-titi.png`
106×42 px, kotwica (53, 41). Upieczony, jeszcze nieudekorowany tort Titi na białym talerzyku (podstawa, na którą kładzie się lukier, posypkę i dodatek; kotwica = środek dolnej krawędzi talerzyka). Opis rodziny „tort”:
- Biszkopt: prostokąt cols 10..95 × wiersze 0..35 w O (obrys 1 px po bokach i u góry, rogi nieścięte); wnętrze cols 11..94 × wiersze 1..35 = biszkopt (`#f6d098`), z kremowym paskiem `#fff7e8` w wierszach 19..22 (przez całą szerokość wnętrza).
- Talerzyk: wiersz 35 – O w cols 0..10 i 95..105 (między nimi biszkopt); wiersze 36..40 – O w col 0 i col 105, `#ffffff` w cols 1..104; wiersz 41 – O cols 0..105.

Tabela postaci (kolory całej rodziny tort / lukier / kawałek / dodatek):

| postać | biszkopt | lukier | dodatek (`kuchnia/dodatek-…`) |
|---|---|---|---|
| titi | `#f6d098` | `#c3b3ea` | gwiazdka `#fff1c9` |
| lili | `#f6d098` | `#bfe8d6` | wisienka |
| harry | `#d8b39c` | `#f6d098` | serduszko `#f59bbd` |
| harbin | `#f6d098` | `#f7b2cc` | truskawka |
| karabilein | `#f6d098` | `#cfe8ff` | świeczka |
| leili | `#f6d098` | `#8fdcea` | kwiatek |
| mordka | `#f6d098` | `#ffd6b8` | pestka słonecznika |
| mysia | `#f6d098` | `#d9ccf5` | trzy borówki |
| gabi | `#f6d098` | `#f5b3dc` | gwiazdka `#fff1c9` |

Ułożenie warstw na scenie (wszystkie mają kotwicę w tym samym punkcie stołu): lukier (kotwica (42, 40)) leży dokładnie na wierzchu biszkoptu: col 0 lukru = col 11 tortu, wiersz 0 lukru = wiersz 1 tortu; posypka (kotwica (40, 39)) zaczyna się w col 13, wiersz 2 tortu.

#### `kuchnia/tort-titi-kes-1.png`
106×42 px, kotwica (53, 41). Tort po pierwszym kęsie (zjedzona prawa trzecia część): jak `kuchnia/tort-titi.png`, ale biszkopt węższy – obrys cols 10..67 (prawy bok obrysu w col 67), wnętrze cols 11..66; kremowy pasek tylko w cols 11..66. Talerzyk bez zmian, więc wiersz 35 = O cols 0..10, biszkopt cols 11..66, O cols 67..105.

#### `kuchnia/tort-titi-kes-2.png`
106×42 px, kotwica (53, 41). Tort po drugim kęsie (została lewa trzecia część): jak `kuchnia/tort-titi.png`, ale obrys biszkoptu cols 10..39, wnętrze cols 11..38; wiersz 35 = O cols 0..10, biszkopt 11..38, O 39..105. Talerzyk bez zmian.

#### `kuchnia/trzepaczka.png`
30×38 px, kotwica (14, 19). Trzepaczka balonowa: szare druty `#9a94ad` (dwie pary pętli i pionowy pręt, linie 2 px), lawendowa rączka `#c3b3ea` na dole; bez obrysu. A = `#9a94ad`, B = `#c3b3ea`:
```
..............AA..............
.........AAAA.AA.AAAA.........
.......AAAAAA.AA.AAAAAA.......
.....AAAAAAA..AA..AAAAAAA.....
....AAA.AAA...AA...AAA.AAA....
...AAA..AA....AA....AA..AAA...
...AA..AAA....AA....AAA..AA...
..AAA..AA.....AA.....AA..AAA..
.AAA...AA.....AA.....AA...AAA.
.AA....AA.....AA.....AA....AA.
.AA...AAA.....AA.....AAA...AA.
AAA...AA......AA......AA...AAA
AA....AA......AA......AA....AA   (wiersze 12..17 tak samo)
AAA...AA......AA......AA...AAA
.AA...AAA.....AA.....AAA...AA.
.AA....AA.....AA.....AA....AA.
.AAA...AA.....AA.....AA...AAA.
..AAA..AA.....AA.....AA..AAA..
...AA..AAA....AA....AAA..AA...
...AAA..AA..BBAABB..AA..AAA...
....AAA.AAA.BBAABB.AAA.AAA....
.....AAAAAAABBAABBAAAAAAA.....
.......AAAAAABAABAAAAAA.......
.........AAAABAABAAAA.........
............BBAABB............
............BBBBBB............   (wiersze 30..37 tak samo)
```

### cukiernia/

Ekran cukierni (BakeryScene): dzieci składają babeczkę na talerzu (papilotka, biszkopt, krem w wybranym kolorze, posypka, dodatek), a gotowe babeczki stoją w szklanej gablocie. Każdy element babeczki ma wersję dużą (na talerzu, szerokość babeczki 84 px) i `-mini` (w gablocie, szerokość 32 px); wszystkie warstwy jednej babeczki mają kotwicę w tym samym punkcie: środek spodu papilotki.

#### `cukiernia/biszkopt.png`
71×33 px, kotwica (35, 51). Wierzch biszkoptu wystający z papilotki (warstwa bez kremu). ELIPSA(35, 16, 35, 16, O), potem ELIPSA(35, 16, 34, 15, `#f6d098`), potem pozioma linia O w wierszu 16 przez całą szerokość (cols 0..70) – brzeg papilotki dzielący elipsę na pół. Pojedyncze piksele O w (35, 0) i (35, 32) oraz piksel `#f6d098` w (35, 1) i (35, 31) wśród obrysu (czubki elips).

#### `cukiernia/biszkopt-mini.png`
29×15 px, kotwica (14, 20). Mała wersja `cukiernia/biszkopt.png`: ELIPSA(14, 7, 14, 7, O), ELIPSA(14, 7, 13, 6, `#f6d098`), linia O w wierszu 7 cols 0..28.

#### `cukiernia/gablota.png`
315×78 px, kotwica (0, 0). Szklana gablota na babeczki. BOX(0, 0, 315, 78, `#eef8ff`); półka `#d9ccf5` cols 2..312 × wiersze 69..74 (wiersz 75 znowu `#eef8ff`, wiersze 76..77 obrys). Odblask szyby: ukośna linia 12 pojedynczych białych pikseli `#ffffff` od (8, 18) do (19, 7) – piksel (8+i, 18−i) dla i = 0..11.

#### `cukiernia/gwiazdka.png`
36×35 px, kotwica (18, 93). Dodatek na babeczkę: gwiazdka `#fff1c9` z grubym obrysem O (2–3 px). A = `#fff1c9`:
```
.................OO.................
.................OO.................
................OOOO................
................OOOO................
................OOOO................
...............OOAAOO...............
...............OOAAOO...............
..............OOAAAAOO..............
..............OOAAAAOO..............
.............OOAAAAAAOO.............
.............OOAAAAAAOO.............
...........OOOOAAAAAAOOOO...........
...OOOOOOOOOOOAAAAAAAAOOOOOOOOOOO...
OOOOOOOOOOOAAAAAAAAAAAAAAOOOOOOOOOOO
.OOOAAAAAAAAAAAAAAAAAAAAAAAAAAAAOOO.
..OOOAAAAAAAAAAAAAAAAAAAAAAAAAAOOO..
...OOOAAAAAAAAAAAAAAAAAAAAAAAAOOO...
....OOOAAAAAAAAAAAAAAAAAAAAAAOOO....
.....OOOAAAAAAAAAAAAAAAAAAAAOOO.....
......OOOAAAAAAAAAAAAAAAAAAOOO......
.......OOOAAAAAAAAAAAAAAAAOOO.......
.........OOAAAAAAAAAAAAAAOO.........
.........OOAAAAAAAAAAAAAAOO.........
.........OOAAAAAAAAAAAAAAOO.........
........OOOAAAAAAAAAAAAAAOOO........
........OOAAAAAAAAAAAAAAAAOO........
........OOAAAAAAAOOAAAAAAAOO........
........OOAAAAAAOOOOAAAAAAOO........
........OOAAAAOOOOOOOOAAAAOO........
.......OOOAAOOOO....OOOOAAOOO.......
.......OOAOOOO........OOOOAOO.......
.......OOOOOO..........OOOOOO.......
.......OOOO..............OOOO.......
.......OO..................OO.......
......O......................O......
```

#### `cukiernia/gwiazdka-mini.png`
12×12 px, kotwica (6, 34). Mała gwiazdka do babeczki w gablocie, obrys 1 px. A = `#fff1c9`:
```
.....OO.....
.....OO.....
....OAAO....
.OOOOAAOOOO.
OAAAAAAAAAAO
.OAAAAAAAAO.
..OAAAAAAO..
...OAAAAO...
..OAAAAAAO..
..OAOOOOAO..
..OO....OO..
..O......O..
```

#### `cukiernia/krem-czekoladowy.png`
81×44 px, kotwica (40, 68). Krem na babeczkę: trzy piętra kremu (zawijas), z obrysem i białymi błyskami. Rodzina „krem” (kolejność): najpierw obrys O – ELIPSA(40, 30, 40, 13), ELIPSA(40, 19, 30, 11), ELIPSA(40, 9, 18, 9); potem kolor kremu – ELIPSA(40, 30, 39, 12), ELIPSA(40, 19, 29, 10), ELIPSA(40, 9, 17, 8); potem błyski `#ffffff` 2×1 px: cols 21..22 wiersz 25; cols 26..27 wiersz 15; cols 32..33 wiersz 6. Obrys zostaje tylko na zewnętrznej sylwetce (1 px, w załamaniach między piętrami 2–4 px poziomo), w wierszach 0 i 43 pojedynczy piksel O w col 40, a w wierszach 1 i 42 piksel koloru kremu w col 40 wśród obrysu. Kolor: `#d8b39c`.

#### `cukiernia/krem-czekoladowy-mini.png`
33×18 px, kotwica (16, 26). Mała wersja kremu. Rodzina „krem-mini”: obrys O – ELIPSA(16, 12, 16, 5), ELIPSA(16, 8, 12, 5), ELIPSA(16, 4, 7, 4); kolor – ELIPSA(16, 12, 15, 4), ELIPSA(16, 8, 11, 4), ELIPSA(16, 4, 6, 3); błyski `#ffffff` 2×1 px: cols 9..10 wiersz 10; cols 11..12 wiersz 6; cols 13..14 wiersz 3. Kolor `#d8b39c`. Mapa (A = kolor kremu):
```
................O................
...........OOOOOAOOOOO...........
..........OOAAAAAAAAAOO..........
.........OAAAWWAAAAAAAAO.........
.........OAAAAAAAAAAAAAO.........
......OOOAAAAAAAAAAAAAAAOOO......
.....OAAAAAWWAAAAAAAAAAAAAAO.....
....OAAAAAAAAAAAAAAAAAAAAAAAO....
....OAAAAAAAAAAAAAAAAAAAAAAAO....
...OOAAAAAAAAAAAAAAAAAAAAAAAOO...
.OOAAAAAAWWAAAAAAAAAAAAAAAAAAAOO.
OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO
OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO
OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO
.OOAAAAAAAAAAAAAAAAAAAAAAAAAAAOO.
...OOOAAAAAAAAAAAAAAAAAAAAAOOO...
......OOOOOOOOOOAOOOOOOOOOO......
................O................
```

#### `cukiernia/krem-liliowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#d9ccf5`.

#### `cukiernia/krem-liliowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#d9ccf5`.

#### `cukiernia/krem-mietowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#bfe8d6`.

#### `cukiernia/krem-mietowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#bfe8d6`.

#### `cukiernia/krem-rozowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#f7b2cc`.

#### `cukiernia/krem-rozowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#f7b2cc`.

#### `cukiernia/krem-waniliowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#fff1c9`.

#### `cukiernia/krem-waniliowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#fff1c9`.

#### `cukiernia/lada-wzor.png`
72×8 px, kotwica (0, 0). Wzór powtarzany: front lady (powtarzany w poziomie i pionie). Cols 0..1 `#f0c2d6` (ciemniejsza szczelina między panelami), cols 2..71 `#f7d6e4`; wszystkie 8 wierszy jednakowe, więc w pionie łączy się bez szwu, a w poziomie co 72 px wychodzi pionowa ciemniejsza linia 2 px.

#### `cukiernia/papilotka.png`
71×37 px, kotwica (35, 36). Papierowa papilotka babeczki – trapez szerszy u góry, w brzoskwiniowe pionowe prążki. Środek osi: col 35. Wiersz 0 i wiersz 36 to linie obrysu: wiersz 0 cols 0..70, wiersz 36 cols 9..61. Wiersze 1..35 (r = wiersz−1 = 0..34): half = round(33.6 − 0.24·r); O w col 35−half−1 i 35+half+1, wypełnienie `#ffd6b8` cols 35−half..35+half, a prążki `#f5c09a` (1 px) w cols 35−half+2, +4, +8 … (co 4 px) dopóki col < 35+half−1. Wartości half: wiersz 1 → 34, 2..5 → 33, 6..9 → 32, 10..13 → 31, 14..18 → 30, 19..22 → 29, 23..26 → 28, 27..30 → 27, 31..34 → 26, 35 → 25. Przykład wiersza 1: `OAABAAABAAAB…AAABAAO` (prążki w cols 3, 7, …, 67).

#### `cukiernia/papilotka-mini.png`
29×15 px, kotwica (14, 14). Mała papilotka: jak `cukiernia/papilotka.png`, oś col 14, wiersz 0 = O cols 0..28, wiersz 14 = O cols 3..25; wiersze 1..13: half = round(12.8 − 0.246·r) (r = wiersz−1), czyli wiersze 1..2 → 13, 3..6 → 12, 7..10 → 11, 11..13 → 10; prążki `#f5c09a` od col 14−half+2 co 4 px. Mapa (A = `#ffd6b8`, B = `#f5c09a`):
```
OOOOOOOOOOOOOOOOOOOOOOOOOOOOO
OAABAAABAAABAAABAAABAAABAAAAO
OAABAAABAAABAAABAAABAAABAAAAO
.OAABAAABAAABAAABAAABAAABAAO.
.OAABAAABAAABAAABAAABAAABAAO.
.OAABAAABAAABAAABAAABAAABAAO.
.OAABAAABAAABAAABAAABAAABAAO.
..OAABAAABAAABAAABAAABAAAAO..
..OAABAAABAAABAAABAAABAAAAO..
..OAABAAABAAABAAABAAABAAAAO..
..OAABAAABAAABAAABAAABAAAAO..
...OAABAAABAAABAAABAAABAAO...
...OAABAAABAAABAAABAAABAAO...
...OAABAAABAAABAAABAAABAAO...
...OOOOOOOOOOOOOOOOOOOOOOO...
```

#### `cukiernia/posypka.png`
54×23 px, kotwica (25, 59). Kolorowa posypka na krem babeczki: 8 kresek 2×1 px na przezroczystym tle (lewy piksel kreski podany): (0, 21) `#f59bbd`; (43, 19) `#a6dcc4`; (18, 11) `#f6d98b`; (40, 7) `#c3b3ea`; (7, 9) `#f59bbd`; (27, 0) `#a6dcc4`; (52, 22) `#f6d98b`; (23, 19) `#c3b3ea`.

#### `cukiernia/posypka-mini.png`
22×9 px, kotwica (10, 22). Mała posypka, 8 kresek 2×1 px: (0, 8) `#f59bbd`; (17, 7) `#a6dcc4`; (7, 4) `#f6d98b`; (16, 3) `#c3b3ea`; (3, 3) `#f59bbd`; (11, 0) `#a6dcc4`; (20, 8) `#f6d98b`; (9, 7) `#c3b3ea`.

#### `cukiernia/serduszko.png`
28×24 px, kotwica (14, 86). Dodatek na babeczkę: różowe serduszko bez obrysu. SERCE(0, 0, 4, `#f59bbd`) – każda komórka wzoru 4×4 px.

#### `cukiernia/serduszko-mini.png`
7×6 px, kotwica (3, 31). SERCE(0, 0, 1, `#f59bbd`) – wzór 1:1.

#### `cukiernia/swieczka.png`
8×27 px, kotwica (4, 88). Dodatek na babeczkę: świeczka w biało-różowe paski z płomykiem (bez dolnego obrysu). A = `#f6d98b`, B = `#fff7e0`, C = `#f7b2cc`:
```
....A...
..AAAAA.
.AAAAAAA
.AAAAAAA
.AAABBAA
.AAABBAA
.AAABBAA
..AABBA.
OOOOAOOO
OWWWWWWO
OWWWWWWO
OWWWWWWO
OWWWWWWO
OCCCCCCO
OCCCCCCO
OCCCCCCO
OCCCCCCO
OWWWWWWO
OWWWWWWO
OWWWWWWO
OWWWWWWO
OCCCCCCO
OCCCCCCO
OCCCCCCO
OCCCCCCO
OWWWWWWO
OWWWWWWO
```

#### `cukiernia/swieczka-mini.png`
5×11 px, kotwica (2, 34). Mała świeczka:
```
..A..
AAAAA
AABAA
AABAA
OWAWO
OWWWO
OCCCO
OCCCO
OWWWO
OWWWO
OCCCO
```
A = `#f6d98b`, B = `#fff7e0`, C = `#f7b2cc`.

#### `cukiernia/talerz-na-babeczke.png`
93×15 px, kotwica (46, 7). Biały owalny talerz pod babeczką. ELIPSA(46, 7, 46, 7, O), potem ELIPSA(46, 7, 45, 6, `#ffffff`). Wiersze 0 i 14: pojedynczy piksel O w col 46; wiersze 1 i 13: O cols 22..70 z białym pikselem w col 46.

#### `cukiernia/tapeta.png`
30×8 px, kotwica (0, 0). Wzór powtarzany: tapeta w pionowe pasy. Cols 0..14 `#fff1e6`, cols 15..29 `#ffe8ef`, wszystkie wiersze takie same; kafelkuje się w poziomie (pasy po 15 px na zmianę) i w pionie bez szwu.

#### `cukiernia/truskawka.png`
25×26 px, kotwica (12, 84). Dodatek na babeczkę: truskawka. A = `#9fd6b8`, B = `#f28aa5`, C = `#fff1c9`:
```
............AA...........
............AA...........
....AAAAAAAAAAAAAAAA.....
OOOOAAAAAAAAAAAAAAAAOOOOO
OBBBBBBBBBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBBBBBBBBBO
.OBBBBBBBBBBBBBBBBBBBBBO.
.OBBBBBBBBBBBBBBBBBBBBBO.
.OBBBBBBCBBBBBBBBBBBBBBO.
..OBBBBBBBBBBBBCBBBBBBO..
..OBBBBBBBBBBBBBBBBBBBO..
...OBBBBBBBBBBBBBBBBBO...
...OBBBBBBBBBBBBBBBBBO...
....OBBBBBBBBBBBBBBBO....
....OBBBBBBBCBBBBBBBO....
.....OBBBBBBBBBBCBBO.....
.....OBBBBBBBBBBBBBO.....
......OBBBBBBBBBBBO......
.......OBBBBBBBBBO.......
.......OBBCBBBBBBO.......
........OBBBBBBBO........
.........OBBBBBO.........
.........OBBBBBO.........
..........OBBBO..........
...........OOO...........
```

#### `cukiernia/truskawka-mini.png`
11×12 px, kotwica (5, 33). Mała truskawka (kolory jak wyżej):
```
.....AA....
.....AA....
..AAAAAAA..
OOAAAAAAAOO
OBBBBBBBBBO
OBBCBBCBBBO
.OBBBBBBBO.
.OBBBCBBBO.
..OBBBBCO..
...OCBBO...
...OBBBO...
....OOO....
```

#### `cukiernia/wisienka.png`
19×31 px, kotwica (9, 92). Dodatek na babeczkę: wisienka z szypułką. A = `#7fc49e`, B = `#f28aa5`:
```
................AA.
...............AA..
...............AA..
..............AA...
..............AA...
.............AA....
.............AA....
............AA.....
............AA.....
...........AA......
...........AA......
..........AA.......
.........OAA.......
.....OOOOBOOOO.....
...OOBBBBBBBBBOO...
..OOBBBBBBBBBBBOO..
..OBBBBBBBBBBBBBO..
.OBBBWWBBBBBBBBBBO.
.OBBBBBBBBBBBBBBBO.
OBBBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBBBO
OBBBBBBBBBBBBBBBBBO
.OBBBBBBBBBBBBBBBO.
.OBBBBBBBBBBBBBBBO.
..OBBBBBBBBBBBBBO..
..OOBBBBBBBBBBBOO..
...OOBBBBBBBBBOO...
.....OOOOBOOOO.....
.........O.........
```

#### `cukiernia/wisienka-mini.png`
9×12 px, kotwica (4, 34). Mała wisienka (kolory jak wyżej):
```
......A..
......A..
.....A...
....OA...
.OOOBOOO.
.OWWBBBO.
OBBBBBBBO
OBBBBBBBO
OBBBBBBBO
.OBBBBBO.
.OOOBOOO.
....O....
```

## Część C: domek Gabi, mapa, ekran startowy

### Wspólne zasady rysowania (dotyczą wszystkich opisów poniżej)

- Współrzędne (x, y) liczone od lewego górnego piksela PNG, zakresy „x3–10” są włącznie. Tło zawsze przezroczyste, chyba że napisano inaczej. Wszystkie piksele są w pełni kryjące, chyba że podano alfę.
- **O** = kolor obrysu `#6b4a5e` (ciemna śliwka). Gdy piszę „z obrysem”, chodzi o ten kolor.
- **Pudełko** (`drawBox`) w×h: zewnętrzny pas 2 px w kolorze obramowania, wnętrze (od x+2 do x+w−3, od y+2 do y+h−3) w kolorze wypełnienia. Rogi ścięte: w każdym rogu brak 3 pikseli (sam narożnik i jego 2 sąsiedzi wzdłuż krawędzi), piksel ukośnie do środka (1,1) jest jeszcze obramowaniem. Wersja z „jaśniejszym paskiem”: dodatkowo pas 2 px od x+3 do x+w−4 w rzędach y+2, y+3.
- **Koło r** (`fillCircle`) o środku (cx, cy): dla każdego dy od −r do r rysuj poziomy pasek od cx−dx do cx+dx, gdzie dx = round(√(r²−dy²)). Średnica 2r+1; górny i dolny rząd to jeden piksel (mały „sutek”), to samo na lewym i prawym brzegu. „Koło z obrysem” = koło r+1 w O, na nim koło r w kolorze.
- **Wielokąt**: piksel jest wypełniony, gdy jego środek (x+0,5, y+0,5) leży w wielokącie. **Obrys wielokąta** (`grow 1,5`): ten sam wielokąt z każdym wierzchołkiem odsuniętym o 1,5 px od środka ciężkości wierzchołków, wypełniony O pod spodem – daje obrys 1–2 px, miejscami nierówny (na długich bokach czasem znika).
- `round` = Math.round z JS (połówki w górę, −1,5 → −1).
- **Generator pseudolosowy** używany we wzorach: `seed = (seed*9301 + 49297) % 233280`, wynik `floor(seed/233280 * n)` (wersja „0..n−1”) albo `min + floor(seed/233280 * (max−min+1))` (wersja „min..max”).

### kuchnia-lakotka/

Kuchnia w domku Gabi (scena GabiKitchenScene): kuchenka z okapem-kotkiem, szafka z tortem, lodówka-kotek i Łakotek – kotek-babeczka.

#### `kuchnia-lakotka/babeczka.png`
21×22 px, kotwica (10, 13). Babeczka, która leci do postaci po upieczeniu. Kopułka kremu: koło r=10 w O o środku (10, 10), na nim koło r=9 w `#f59bd0`. Pod nią papilotka: prostokąt O x0–20, y12–21 (pod kołem), wnętrze `#c8b4f0` x2–18, y13–20 – widoczne tylko po bokach (rzędy 15–20), bo różowe koło je zakrywa w środku. Na kremie biały odblask 2×2 px x7–8, y5–6. Dół: pełny rząd O w y21 (x1–19).

#### `kuchnia-lakotka/blacha-z-babeczkami.png`
78×29 px, kotwica (39, 29). Blacha z trzema babeczkami stojąca na kuchence. Blacha: pudełko 78×9 (x0–77, y20–28), wypełnienie `#c8b4f0`, obramowanie O. Trzy babeczki jak `babeczka.png` (kopułka r=9 `#f59bd0` z obrysem r=10, papilotka `#c8b4f0` z obrysem, odblask biały 2×2), środki kopułek x=15, 39, 63, y=10; prostokąty papilotek x(cx−9)–(cx+9), y12–22, ich dół wtapia się w blachę. Odblaski w y5–6, x(cx−3)–(cx−2).

#### `kuchnia-lakotka/blat-szafki.png`
123×14 px, kotwica (0, 0). Biały blat nad szafką. Pudełko 123×14, wypełnienie `#ffffff`, obramowanie O 2 px, ścięte rogi.

#### `kuchnia-lakotka/kawalek-tortu.png`
24×24 px, kotwica (11, 12). Kawałek tortu (trójkąt) – nagroda w kuchni. Biały `#ffffff` trójkąt prostokątny o wierzchołkach ok. (0, 22), (21, 22), (21, 5): przeciwprostokątna schodkami z lewego dołu do prawej góry. Obrys O tylko z prawej (kolumna x22, y6–22) i z dołu (rząd y23, x0–22); skos bez obrysu. Różowy pas kremu `#f59bd0` x9–20, y15–17. Na czubku wisienka `#f26a8a`: koło r=3 o środku (20, 3) (y0–6, x17–23), bez obrysu.

#### `kuchnia-lakotka/kuchenka-z-piekarnikiem.png`
120×138 px, kotwica (0, 45). Kuchenka: tylna ścianka z trzema kocimi główkami, płyta z palnikami i miętowy korpus z piekarnikiem (szybka to osobny obrazek). Od góry:
1. Ścianka: pudełko x6–113, y0–47, wypełnienie `#e4e6f0`, obramowanie O. Na niej trzy kocie główki o środkach (27, 18), (60, 18), (93, 18): koło r=11 w `#c8cbdc` plus dwa trójkątne uszy w `#c8cbdc` (dla ucha lewego wierzchołki (cx−11, cy−2,2), (cx−8,8, cy−16,5), (cx−1,1, cy−8,8); prawe lustrzane), potem w środku koło r=8 w `#e4e6f0` – zostaje szary pierścień grubości 3 px z uszami, bez obrysu O.
2. Płyta: pudełko x0–119, y45–62, wypełnienie `#e4e6f0`. Trzy palniki o środkach (27, 54), (60, 54), (93, 54): koło r=5 w O, w nim koło r=3 `#c8cbdc`.
3. Korpus: pudełko x0–119, y62–137 (zachodzi 1 rząd na płytę), wypełnienie `#9fe6d4`. Uchwyt-pasek `#7fd2c0` x12–107, y69–73.

#### `kuchnia-lakotka/lakotek-kotek-babeczka.png`
64×64 px, kotwica (32, 32). Łakotek – kotek-babeczka, kucharz w kuchni Gabi (biała głowa z posypką, uszy, uśmiech, niebieska papilotka). Narysowany jako maska 16×16 i powiększony ×4 (zasada poniżej). Maska (wiersze od góry, `.` = przezroczyste):

```
...O........O...
..OWO......OWO..
.OWKWOOOOOOWKWO.
.OWWWRWWWBWWYWO.
OWWGWWWWYWWWWRWO
OWWWWWWWWWWWWWWO
OWWWEWWWWWWEWWWO
OWWEWEWWWWEWEWWO
OWKKWWWNNWWWKKWO
OWWWWWWEEWWWWWWO
.OWWWWWWWWWWWWO.
OLLLLLLLLLLLLLLO
.OLSLSLSLSLSLSO.
..OLSLSLSLSLSO..
...OSSSSSSSSO...
....OOOOOOOO....
```

Legenda: O i E = `#6b4a5e` (E to kreski: zamknięte oczka „^” i pyszczek – ten sam kolor co obrys), W = `#ffffff`, K = `#f7b2cc` (wnętrze uszu i rumieńce), N = `#f59bbd` (nosek), R = `#f28aa5`, B = `#9fd0f5`, Y = `#ffd27a`, G = `#7fcf9a` (posypka), L = `#f7b2cc` (brzeg papilotki), S = `#a8d4f5` (papilotka).

Zasada powiększenia ×4 (tak samo dla Tekturzątka): (1) każdy nowy piksel (X, Y) bierze kolor, który wygrywa „głosowanie gaussowskie”: dla punktu źródłowego sx = (X+0,5)/4 − 0,5, sy = (Y+0,5)/4 − 0,5 sumuj po pikselach maski w promieniu ±2 wagi exp(−d²/(2·0,45²)) na ich kolor (przezroczystość też jest „kolorem”); wygrywa największa suma – krawędzie plam stają się gładkie zamiast schodków 4×4. (2) Kolor obrysu (ten, który najczęściej graniczy z przezroczystością, tu O) jest odchudzany: linie obrysu, które po powiększeniu mają 4 px, tracą po 1 px z każdej strony (piksel obrysu sąsiadujący z innym kolorem przejmuje ten kolor albo przezroczystość) – zostaje linia 2 px. Cienkich kresek (miejsc, gdzie obrys nie jest grubszy niż 2 px) nie odchudza się. (3) Piksele maski, które nie mają sąsiada tego samego koloru w poziomie ani w pionie (kreski ukośne, np. łuki oczu „^”), rysuje się od nowa „piórem” 2×2 px: kropka w środku powiększonego piksela ((x+0,5)·4, (y+0,5)·4) i odcinek tym piórem do środka każdego ukośnego sąsiada tego samego koloru – kreski się nie rozpadają. Efekt: obrys sylwetki 2 px, łagodne krzywe, oczy jako ciągłe łuki 2 px.

#### `kuchnia-lakotka/lodowka.png`
108×222 px, kotwica (0, 0). Zamknięta lodówka z kocią buźką. Pudełko x0–107, y0–221, wypełnienie `#9fe6d4`, obramowanie O. Podział drzwi: linia O 1 px x2–105, y138. Buźka i detale w `#7fd2c0` (bez obrysu): oczy – kreski 12×3 x30–41 i x66–77, y56–58; nosek 6×3 x51–56, y65–67; pyszczek 12×1 x48–59, y71; wąsy po 2 z każdej strony, 12×1: x15–26 i x81–92 w rzędach y68 i y74; pionowy uchwyt górnych drzwi 5×24 x12–16, y101–124; poziomy uchwyt dolnych drzwi 21×5 x12–32, y153–157.

#### `kuchnia-lakotka/lodowka-otwarta.png`
108×222 px, kotwica (0, 0). Lodówka z otwartą górną komorą. Korpus jak w `lodowka.png` (pudełko `#9fe6d4`, linia podziału O w y138, dolny uchwyt `#7fd2c0` x12–32, y153–157), bez buźki i górnego uchwytu. Wnętrze: pudełko x8–100, y8–133, wypełnienie `#ffffff`, obramowanie O. Półki `#c8cbdc` 2 px: x9–98, y62–63 i y110–111. Na górnej półce: butelka – pudełko x24–38, y35–61, wypełnienie `#eaf4ff`; truskawka jak `truskawka.png` o środku (75, 51). Na dolnej półce: pudełko x42–65, y92–109, wypełnienie `#c3b3ea`.

#### `kuchnia-lakotka/lodowka-uszy.png`
110×35 px, kotwica (55, 19). Dwa kocie uszy sterczące nad lodówką. Dwa trójkąty `#9fe6d4` z obrysem (grow 1,5): lewy o wierzchołkach (1, 34), (9,6, 1), (42, 21), prawy lustrzany (109, 34), (100,4, 1), (68, 21). Między uszami pusto.

#### `kuchnia-lakotka/lopatka.png`
15×30 px, kotwica (8, 0). Łopatka wisząca na relingu. Uchwyt: pionowa kreska O 2 px x7–8, y0–14. Pod nią pudełko 15×15 (x0–14, y15–29), wypełnienie `#9fe6d4`, obramowanie O.

#### `kuchnia-lakotka/okap.png`
108×91 px, kotwica (54, 48). Okap w kształcie kociej głowy nad kuchenką (oczy i nosek to osobne obrazki). Komin: pionowy pas x39–68, y0–47 – kolumny x39 i x68 w O, środek x40–67 `#e4e6f0`. Uszy: trójkąty `#c4f2e6` z obrysem: lewy (10, 50), (16, 36), (33, 50), prawy lustrzany (98, 50), (92, 36), (75, 50). Korpus: trapez `#c4f2e6` z obrysem (grow 1,5), górna krawędź x22,5–85,5 w y48, dolna x1,5–106,5 w y90; boki to schodki co 2 rzędy, obrys 1–2 px. Dół: pasek `#f7a6c8` x1–106, y84–89 (przykrywa obrys boków), pod nim rząd O y90.

#### `kuchnia-lakotka/okap-buzia-patrzy.png`
36×13 px, kotwica (18, 3). Buzia okapu, gdy patrzy. Dwa kwadratowe oczy O 6×6: x0–5 i x30–35, y0–5. Nosek `#f59bbd` 6×3: x15–20, y10–12.

#### `kuchnia-lakotka/okap-buzia-spi.png`
39×10 px, kotwica (20, 0). Buzia okapu, gdy śpi. Zamknięte oczy – poziome kreski O 9×2: x0–8 i x30–38, y0–1. Nosek `#f59bbd` 6×3: x17–22, y7–9.

#### `kuchnia-lakotka/para-duza.png`
19×19 px, kotwica (9, 9). Większy kłębek pary z garnka. Koło r=9 o środku (9, 9), kolor `#ffffff` z alfą 90% (w pliku 229/255), bez obrysu.

#### `kuchnia-lakotka/para-mala.png`
13×13 px, kotwica (6, 6). Mniejszy kłębek pary: jak `para-duza.png`, ale koło r=6 o środku (6, 6).

#### `kuchnia-lakotka/patelnia-fioletowa.png`
27×41 px, kotwica (13, 0). Patelnia wisząca na relingu (widok z góry, okrągła). Uchwyt: kreska O 2 px x12–13, y0–14. Patelnia: koło r=13 w O o środku (13, 27), na nim koło r=12 `#c3b3ea`.

#### `kuchnia-lakotka/patelnia-szara.png`
27×41 px, kotwica (13, 0). Jak `patelnia-fioletowa.png`, ale wnętrze patelni `#c8cbdc`.

#### `kuchnia-lakotka/podloga.png`
8×27 px, kotwica (0, 0). Podłoga kuchni – wzór powtarzany. Całość `#fff8ea`, jedna pozioma linia `#f0e4cc` przez całą szerokość w y21. Powtarzana w poziomie i pionie bez szwu (linie co 27 px).

#### `kuchnia-lakotka/polka-z-kwiatkiem-i-kubkiem.png`
120×50 px, kotwica (60, 34). Półka na ścianie z doniczką i kubkiem-kotkiem. Półka: pudełko x0–119, y34–42, wypełnienie `#f7a6c8`. Doniczka: pudełko x15–32, y19–33, wypełnienie `#ffffff`. Łodyżka `#7fcf9a` 2 px x22–23, y7–18; dwa listki – koła `#7fcf9a` r=5 o środkach (18, 7) i (30, 5), bez obrysu. Kubek-kotek: koło r=9 `#f7c6e0` o środku (99, 23) z uszami (trójkąty `#f7c6e0`: (90, 21), (92, 9,5), (98, 16), prawe lustrzane względem x=99), w środku koło r=6 `#e4e6f0`; oczy O 2×2 w (95–96, 23–24) i (102–103, 23–24); bez obrysu sylwetki. Pod półką szyna `#c8cbdc` x9–110, y48–49.

#### `kuchnia-lakotka/szafka.png`
114×81 px, kotwica (0, 0). Zamknięta szafka pod blatem, dwoje drzwiczek. Dwa pudełka `#f7a6c8` z obramowaniem O: x0–56 i x57–113, y0–80. W każdym płycina `#ee8fb8`: x8–49 i x65–106, y8–73. Uchwyty O 3×9: x46–48 i x65–67, y32–40.

#### `kuchnia-lakotka/szafka-otwarta.png`
114×81 px, kotwica (0, 0). Otwarta szafka z pudełkami. Pudełko x0–113, y0–80, wypełnienie `#fbe4ef`. Półka – linia O 1 px x2–111, y45. Cztery pudełka z obramowaniem O: lewa kolumna `#d9b4f5`, prawa `#f59bd0`; górne x17–49 / x63–95, y24–44 (33×21); dolne x17–49 / x63–95, y57–76 (33×20).

#### `kuchnia-lakotka/szybka-piekarnika.png`
96×36 px, kotwica (0, 0). Szybka piekarnika (zimny). Pudełko 96×36, wypełnienie `#7fd2c0`, obramowanie O. Trzy koła r=6 `#9fe6d4` (bez obrysu) o środkach (27, 21), (48, 21), (69, 21).

#### `kuchnia-lakotka/szybka-piekarnika-goraca.png`
96×36 px, kotwica (0, 0). Szybka piekarnika w trakcie pieczenia. Jak `szybka-piekarnika.png`, ale wypełnienie `#ffd9a0`, koła `#f0b878`.

#### `kuchnia-lakotka/tapeta.png`
84×84 px, kotwica (0, 0). Tapeta kuchni – wzór powtarzany: tło `#fbeee0` z sześcioma kreskami posypki, wszystkie w całości wewnątrz kafelka (łączy się bez szwu). Kreski: `#fff09a` pionowa 2×6 w (43, 9); `#ffc08a` pozioma 6×2 w (34, 39); `#f28aa5` pionowa 2×6 w (68, 45); `#fff09a` pozioma 6×2 w (22, 60); `#7fcf9a` pionowa 2×6 w (5, 38); `#ffc08a` pozioma 6×2 w (52, 12) (podano lewy górny róg).

#### `kuchnia-lakotka/tort-pietrowy.png`
69×56 px, kotwica (35, 56). Dwupiętrowy tort na blacie. Dwa pudełka `#ffffff` z obramowaniem O: dolne x0–68, y26–55; górne x9–59, y0–26 (dolny rząd górnego i górny rząd dolnego zlewają się w podwójną linię O w y25–27). Na każdym piętrze: pas lukru `#f59bd0` od 2 px pod górą przez 8 rzędów (górne y2–9, dolne y28–35) na całą szerokość wnętrza, pod nim zacieki – kwadraty 3×3 `#f59bd0` co 8 px (górne: x12, 20, 28, 36, 44, 52 w y10–12; dolne: x3, 11, … 59 w y36–38). Posypka – kreski 5×2: dolne piętro `#f28aa5` x8, `#fff09a` x22, `#9fd0f5` x36 w y41–42 oraz `#ffc08a` x15, `#7fcf9a` x29, `#c3b3ea` x43 w y46–47; górne piętro te same kolory w x17, 31, 45 (y15–16) i x24, 38, 52 (y20–21).

#### `kuchnia-lakotka/truskawka.png`
21×21 px, kotwica (10, 10). Truskawka (w lodówce i jako dodatek). Koło r=10 w O, koło r=9 `#f26a8a`, środek (10, 10). Szypułka: prostokąt `#7fcf9a` x4–15, y0–2 (bez obrysu, przykrywa górę koła). Pestki – pojedyncze piksele `#fff09a`: (13, 9), (7, 10), (15, 13), (6, 15), (10, 15).

#### `kuchnia-lakotka/uszko-opaski.png`
32×20 px, kotwica (25, 1). Kocie uszko na miętowej opasce (gra je obraca/ustawia przy opasce). Trójkąt `#9fe6d4` z obrysem (grow 1,5) skierowany czubkiem w dół: wierzchołki (1, 1), (31, 1), (16, 19); górna krawędź – pełny rząd O w y0, boki ze schodkami O 1 px, czubek O w y18–19.

#### `kuchnia-lakotka/wisienka.png`
13×13 px, kotwica (6, 6). Wisienka na tort (licznik wisienek). Koło r=6 w O, koło r=5 `#f26a8a`, środek (6, 6). Biały odblask 1 px w (5, 3).

### pracownia/

Pracownia plastyczna w domku Gabi (scena GabiCraftScene): tablica korkowa z kartką do ozdabiania, półki z farbami brokatowymi, girlandy z koralików, stół z pomponami-kotkami i Tekturzątko.

#### `pracownia/farba-fioletowa.png`
27×48 px, kotwica (14, 48). Butelka farby z brokatem – kotek z uszkami i zamkniętymi oczkami. Korpus: pudełko 27×33 (x0–26, y15–47) w kolorze farby `#c3a6f0`, obramowanie O. Zakrętka: pudełko 18×12 (x5–22, y4–15) w tym samym kolorze (dolny rząd obramowania nachodzi na górę korpusu). Uszy: dwa słupki O 3×5 – x6–8 i x19–21, y0–4. Zamknięte oczy: kreski O 5×1 – x8–12 i x17–21, y27. Brokat: białe piksele `#ffffff` w (11, 26), (20, 30), (22, 39), (7, 42).

#### `pracownia/farba-niebieska.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#8cc4f2`.

#### `pracownia/farba-pomaranczowa.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#ffb37a`.

#### `pracownia/farba-rozowa.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#f59bbd`.

#### `pracownia/farba-teczowa.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, ale korpus w poziome pasy (cała szerokość wnętrza x2–24): `#f59bbd` y17–21, `#ffb37a` y22–26, `#ffe066` y27–31, `#8fd9a0` y32–35, `#8cc4f2` y36–40, `#c3a6f0` y41–45; zakrętka `#f7b2cc`. Oczy (O, y27) i brokat (białe piksele) jak w rodzinie.

#### `pracownia/farba-zielona.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#8fd9a0`.

#### `pracownia/farba-zlota.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#ffd27a`.

#### `pracownia/farba-zolta.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#ffe066`.

#### `pracownia/girlanda-gorna.png`
574×38 px, kotwica (22, −6). Górna girlanda z koralików przez całą ścianę, lekko zwisająca. 44 koraliki co 13 px: środki x = 7 + 13k (k = 0…43, czyli 7…566), y = round(9 + sin((x−22)/540·π)·21) – od ok. 7 przy brzegach do ok. 30 w środku. Koralik: koło r=6 w kolorze z obrysem (koło r=7 w O), biały odblask 1 px w (x−1, y−2). Kolory po kolei, cyklicznie od pierwszego: `#f28aa5`, `#ffc08a`, `#fff09a`, `#7fcf9a`, `#9fd0f5`, `#c3b3ea`, `#f7b2cc`. Sąsiednie koraliki stykają się obrysami.

#### `pracownia/girlanda-dolna.png`
574×35 px, kotwica (22, −24). Dolna girlanda: jak `girlanda-gorna.png`, ale y = round(9 + sin((x−22)/540·π)·18) (zwis 18 px), a kolory zaczynają się od czwartego: `#7fcf9a`, `#9fd0f5`, `#c3b3ea`, `#f7b2cc`, `#f28aa5`, `#ffc08a`, `#fff09a`, …

#### `pracownia/iskierka-brokatu.png`
10×10 px, kotwica (5, 5). Iskierka, która leci z farby brokatowej. Biały `#ffffff` krzyżyk: poziomy rząd y5, x0–9 i pionowa kolumna x5, y0–9; w środku kwadrat `#fff09a` 3×3 x4–6, y4–6.

#### `pracownia/koszyk.png`
47×39 px, kotwica (23, 39). Koszyk pełen puchatych pomponów (z niego bierze się pompony). Kosz: pudełko x2–43, y19–38, wypełnienie `#f3c9a0`, obramowanie O; pionowe kreski wikliny `#e0ad80` 1 px w x5, 11, 17, 23, 29, 35, y22–35. Nad koszem pompony („puszki”: koło r=8 w kolorze z obrysem r=9 i jaśniejszymi pikselami jak w pomponach): zielony `#7fcf9a` środek (9, 10), żółty `#fff09a` (23, 10), niebieski `#9fd0f5` (37, 9); spod nich wystają tylko skrawki malinowego `#f28aa5` (środek (14, 18)) i brzoskwiniowego `#ffc08a` (środek (31, 16)) w rzędach 17–18. Kolejność rysowania: malinowy, brzoskwiniowy, żółty, zielony, niebieski, na końcu kosz (zasłania dolne części). Jaśniejsze piksele: `#92eeb1`, `#ffffac`, `#b3eaff`.

#### `pracownia/podloga.png`
8×18 px, kotwica (0, 0). Podłoga pracowni (deski) – wzór powtarzany. Całość `#f0dcc0`, jedna pozioma linia `#e2c9a8` w y15 przez całą szerokość; powtarza się bez szwu co 18 px.

#### `pracownia/polka-na-farby.png`
162×9 px, kotwica (0, 0). Żółta półka na butelki farby. Pudełko 162×9, wypełnienie `#fff09a`, obramowanie O; cieniowanie `#f6d98b` x3–158, y6–7.

#### `pracownia/pompon-brzoskwiniowy.png`
27×27 px, kotwica (13, 13). Pompon (pierwszy etap robienia pompona-kotka): puchata kulka. Koło r=12 `#ffc08a` z obrysem (koło r=13 w O) o środku (13, 13). Puszystość: pojedyncze piksele jaśniejszego koloru `#ffd79b` w: (13,13) (10,16) (14,4) (14,14) (7,12) (22,8) (12,16) (10,7) (24,17) (9,15) (17,5) (13,14) (8,10) (22,11) (12,15) (12,6) (21,20) (10,13) (19,7) (10,9) (22,14) (12,14) (14,7).

#### `pracownia/pompon-brzoskwiniowy-oczy.png`
27×27 px, kotwica (13, 13). Pompon z doklejonymi ruchomymi oczkami (drugi etap). Jak `pompon-brzoskwiniowy.png` (te same jaśniejsze piksele, część zakryta), plus dwoje wielkich oczu o środkach (8, 10) i (18, 10): koło r=5 w O, w nim koło r=3 `#ffffff`, źrenica O 3×3 przesunięta w prawo-dół (x8–10 / x18–20, y10–12). Obrysy oczu stykają się w x13.

#### `pracownia/pompon-brzoskwiniowy-uszy.png`
27×32 px, kotwica (13, 18). Gotowy pompon-kotek (trzeci etap): z oczkami, uszami, uśmiechem i rumieńcami. Kulka i oczy jak w `-oczy`, przesunięte o 5 px w dół (środek kulki (13, 18), oczy (8, 15) i (18, 15)). Uszy w kolorze pompona z obrysem (grow 1,5), rysowane pod kulką: lewe – trójkąt (2,2, 14,4), (3,4, 1,2), (11,2, 7,8), prawe lustrzane względem x=13; wystają ponad kulkę w y0–6. Uśmiech O: piksele (10, 23) i (16, 23) oraz kreska x11–14, y24. Rumieńce `#f59bbd` 3×1: x5–7 i x19–21, y21. Wzorzec (O obrys, `#` kolor pompona, c jaśniejszy, b biały, d rumieniec):

```
...O..................O....
...#O................O#....
...##O..............O##....
...###O............O###....
...####OO........OO####....
..O#####OO...O..OO#####O...
..O#####OOOOO#OOOOO####O...
..O###OO###########OO##O...
..O##O###############O#O...
..O#O#########c#######OO...
..OO####O########cO####O...
..O##OOOOOOOc##OOOOOOO##O..
.OO#OOOObOOOO#OOOObOOOO#OO.
.O#OOObbbbbOOOOObbbbbOOO#O.
.O#OObbbbbbbOOObbbbbbbOO#O.
O##OObbbOOObOOObbbOOObOO##O
O##OObbbOOObOOObbbOOObOO##O
O##OOObbOOOOOOOObbOOOOOO##O
O###OOOObOOOOcOOOObOOOO###O
O####OOOOOOOcccOOOOOOOc###O
O#######Oc##c#####O#######O
O####ddd##c#c######ddd####O
.O######################cO.
.O########O#####O########O.
.OO########OOOO#########OO.
..O##################c##O..
...O###################O...
....O#################O....
.....O###############O.....
......OO###########OO......
........OOOOO#OOOOO........
.............O.............
```

#### `pracownia/pompon-fioletowy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#c3b3ea`, jaśniejsze piksele `#dccaff`.

#### `pracownia/pompon-fioletowy-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#c3b3ea`, jaśniejsze `#dccaff`.

#### `pracownia/pompon-fioletowy-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#c3b3ea` (także uszy), jaśniejsze `#dccaff`.

#### `pracownia/pompon-malinowy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#f28aa5`, jaśniejsze `#ff9bba`.

#### `pracownia/pompon-malinowy-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#f28aa5`, jaśniejsze `#ff9bba`.

#### `pracownia/pompon-malinowy-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#f28aa5`, jaśniejsze `#ff9bba`.

#### `pracownia/pompon-niebieski.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#9fd0f5`, jaśniejsze `#b3eaff`.

#### `pracownia/pompon-niebieski-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#9fd0f5`, jaśniejsze `#b3eaff`.

#### `pracownia/pompon-niebieski-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#9fd0f5`, jaśniejsze `#b3eaff`.

#### `pracownia/pompon-rozowy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#f7b2cc`, jaśniejsze `#ffc8e5`.

#### `pracownia/pompon-rozowy-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#f7b2cc`, jaśniejsze `#ffc8e5`.

#### `pracownia/pompon-rozowy-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#f7b2cc`, jaśniejsze `#ffc8e5` (rumieńce `#f59bbd` są tu tylko trochę ciemniejsze od futerka).

#### `pracownia/pompon-zielony.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#7fcf9a`, jaśniejsze `#92eeb1`.

#### `pracownia/pompon-zielony-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#7fcf9a`, jaśniejsze `#92eeb1`.

#### `pracownia/pompon-zielony-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#7fcf9a`, jaśniejsze `#92eeb1`.

#### `pracownia/pompon-zolty.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#fff09a`, jaśniejsze `#ffffac`.

#### `pracownia/pompon-zolty-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#fff09a`, jaśniejsze `#ffffac`.

#### `pracownia/pompon-zolty-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#fff09a`, jaśniejsze `#ffffac`.

#### `pracownia/stol-z-pomponami.png`
168×45 px, kotwica (84, 0). Stół na jednej nodze, na którym robi się pompony (pompony to osobne obrazki). Blat: pudełko x0–167, y0–11, wypełnienie `#ffffff`. Noga: pudełko x60–107, y9–41, wypełnienie `#9fc4ee` (rysowana przed blatem, blat ją przykrywa u góry). Stopa: pudełko x45–122, y33–44, wypełnienie `#9fc4ee` (na nodze). Wszystko z obramowaniem O.

#### `pracownia/tablica-korkowa.png`
219×199 px, kotwica (0, 22). Tablica korkowa z kocimi uszami i ramką z guziczków; środek to ciemne pole, na które scena kładzie kartkę. Uszy (pod ramą): trójkąty `#c3a6f0` z obrysem – lewe (3, 24), (18, 1), (45, 24), prawe (174, 24), (201, 1), (216, 24). Rama: pudełko x0–218, y22–198, wypełnienie korka `#e0bf94` (120 pikseli `#cfa878` rozrzuconych wzorem x = 3 + (37i mod 213), y = 25 + (53i mod 171), większość zakryta). Guziczki: koło r=5 w kolorze z obrysem (r=6 O) i dwiema dziurkami O 1 px w (bx−1, by) i (bx+1, by). Środki: górny rząd y30 i dolny y191 dla x = 9, 24, 39, … 204 (co 15); boki x8 i x211 dla y = 45, 60, … 180 (co 15). Kolory cyklicznie `#f28aa5`, `#ffc08a`, `#fff09a`, `#7fcf9a`, `#9fd0f5`, `#c3b3ea`, `#f7b2cc` w kolejności: dla każdego x najpierw górny, potem dolny; potem dla każdego y lewy, potem prawy. Środek: pełny prostokąt O x16–203, y38–183 (188×146).

#### `pracownia/tekturzatko-kotek-z-kartonu.png`
64×64 px, kotwica (32, 32). Tekturzątko – kotek z kartonowego pudełka (różowa pokrywka z uszami, kremowa buzia, turkusowe pudełko z kropkami). Maska 16×16 powiększona ×4 tą samą zasadą co Łakotek (głosowanie gaussowskie σ=0,45, obrys odchudzony do 2 px, pojedyncze ukośne kreski dorysowane piórem 2 px – opis przy `kuchnia-lakotka/lakotek-kotek-babeczka.png`). Maska:

```
.OO..........OO.
.OKO........OKO.
.OPPOOOOOOOOPPO.
.OPPPPPPPPPPPPO.
.OPPCPPCCPPCPPO.
.OCCCCCCCCCCCCO.
.OCCECCCCCCECCO.
.OCKCCCEECCCKCO.
.OCCCCECCECCCCO.
.OCCCCCEECCCCCO.
.OOOOOOOOOOOOOO.
..OBBGBBBBYBBO..
..OBBBBMBBBBBO..
..OBYBBBBBGBBO..
..OBBBBBBBBBBO..
..OOOOOOOOOOOO..
```

Legenda: O i E = `#6b4a5e` (E: oczka – pojedyncze kropki, i pyszczek-pętelka pod noskiem), P = `#f7b2d8` (pokrywka), K = `#fbd3e8` (wnętrze uszu, rumieńce), C = `#fff1e0` (buzia z kartonu; C w rzędzie 4 to „kapanie” kremu z pokrywki), B = `#9fe0ec` (pudełko), G = `#c3a6f0`, Y = `#ffe08a`, M = `#9fe6a8` (kropki na pudełku).

#### `pracownia/wybrana-farba.png`
36×54 px, kotwica (0, 0). Podświetlenie za wybraną butelką farby. Pudełko 36×54, wypełnienie `#ffffff`, obramowanie `#f59bbd` (2 px, ścięte rogi).

### domek-gabi/

Ekran z domkiem Gabi (scena GabiHouseScene): duży domek-kotek, którego okna, oczy, nosek i drzwi są osobnymi obrazkami, wzgórza i kwiatki w tle.

#### `domek-gabi/domek-bez-okien.png`
313×334 px, kotwica (156, 334). Domek Gabi: różowy dach-kocia głowa z uszami, miętowe trzy piętra, bez okien, oczu, noska i drzwi (te kładzie scena). Oś pionowa x=156. Od tyłu:
1. Uszy (pod dachem), trójkąty z obrysem: lewe `#d9bdf5` (36, 67), (70,5, 1), (127,5, 35); prawe `#ffe1d0` (276, 67), (241,5, 1), (184,5, 35). W prawym uchu okienko `#f59bd0` x224–240, y18–44, przecięte pionową kreską `#ffe1d0` 1 px w x233.
2. Dach-kopuła y34–127: w każdym rzędzie y półszerokość h(y) = round(142,5 · (1 − ((128−y)/94)^2,5)^0,4); kolor od x156−h do x155+h, po 1 px O z obu stron; nad najwyższym rzędem linia O w y33 szerokości 2·h(35). Przykładowe h: y39 → 63, y44 → 81, y54 → 104, y64 → 118, y74 → 127, y127 → 142. Kolor `#f8bfe6` w rzędach y34–52, niżej `#f2a6dc`.
3. Dachówki: kreski `#e892cf` 8×1 co 23 px w rzędach y57, 75, 93, 111, od x156−(h−2) (+12 w rzędach 57, 93, 111) do x156+h−2.
4. Wąsy `#c3b3ea` 29×2 wystające poza krawędź dachu (wycentrowane na krawędzi): x4–32 i x280–308 w y95–96; x0–28 i x284–312 w y112–113.
5. Gzyms: pudełko x28–284, y128–144, `#ffe1d0`. Ściany: pudełko x45–266, y145–320, `#c4eee2`. Podmurówka: pudełko x36–274, y321–333, `#ffe1d0`. Wszystko z obramowaniem O.
6. Stropy: pasy `#ffe1d0` 5 px na całą szerokość ścian (x45–266, przez obramowanie) w y204–208 i y262–266.
7. Daszek nad drzwiami – śpiąca kocia główka `#f59bd0`: półkole r=29 (obrys O r=30) o środku (156, 284), rysowane w górę (y254–284, x126–186); uszy trójkąty `#f59bd0` z obrysem (130, 272), (134, 249), (150, 264) i lustrzane; zamknięte oczka – kreski O 10×1 x136–145 i x166–175, y269.

#### `domek-gabi/drzwi.png`
44×36 px, kotwica (0, 0). Zamknięte drzwi domku. Pudełko 44×36, wypełnienie `#9fd0f5`, obramowanie O; pionowa szpara O 1 px x22, y1–35.

#### `domek-gabi/drzwi-otwarte.png`
44×36 px, kotwica (0, 0). Otwarte drzwi: pudełko 44×36, wypełnienie `#fff1c9` (ciepłe światło), obramowanie O; z lewej uchylone skrzydło `#9fd0f5` x2–9, y2–34.

#### `domek-gabi/kwiatki-wzor.png`
84×42 px, kotwica (0, 0). Kwiatki na trawniku – wzór powtarzany (prawie przezroczysty kafelek). Cztery kwadraty 2×2: `#d9ccf5` w (74, 11), `#f7b2cc` w (18, 30) i (26, 32), `#fff1c9` w (50, 33) (lewy górny róg); reszta przezroczysta. Kwiatki nie dotykają brzegów, kafelki łączą się bez szwu.

#### `domek-gabi/nosek.png`
28×24 px, kotwica (14, 12). Nosek-serduszko domku. Serce `#f59bbd` z bloków 4×4 według siatki 7×6:
```
.PP.PP.
PPPPPPP
PPPPPPP
.PPPPP.
..PPP..
...P...
```

#### `domek-gabi/okno-fioletowe.png`
58×34 px, kotwica (0, 0). Okno domku (zgaszone). Pudełko 58×34, wypełnienie `#d8b4f5`, obramowanie O; pionowy szczebel O 1 px w x29, y1–33; dwa białe `#ffffff` odblaski 1×9 w x2 i x31, y2–10.

#### `domek-gabi/okno-fioletowe-swieci.png`
70×46 px, kotwica (6, 6). To samo okno zapalone, z kotkiem w środku i poświatą. Tło: cały prostokąt 70×46 w kolorze okna z alfą 50% (w pliku `#d9b5f5`, alfa 127). Na nim w (6, 6) okno jak `okno-fioletowe.png`, ale wypełnienie `#fffbe8` (szczebel O w x35, odblaski białe w x8 i x37, y8–16). Kotek (przykrywa szczebel): uszy – trójkąty `#f7b2cc` z obrysem: lewe (23,6, 23,6), (25,4, 10,4), (33,2, 16,4), prawe lustrzane względem x=35; głowa – koło r=12 `#fff0f6` z obrysem r=13, środek (35, 26); obróżka w kolorze okna (`#d8b4f5`) x25–45, y30–32; oczy O 3×4 x29–31 i x39–41, y24–27; nosek `#f59bbd` 4×3 x34–37, y27–29.

#### `domek-gabi/okno-pomaranczowe.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#ffc08a`.

#### `domek-gabi/okno-pomaranczowe-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#ffc18b` z alfą 127, obróżka `#ffc08a`.

#### `domek-gabi/okno-rozowe.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#f7a6c8`.

#### `domek-gabi/okno-rozowe-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#f7a7c9` z alfą 127, obróżka `#f7a6c8`.

#### `domek-gabi/okno-turkusowe.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#9fe8ec`.

#### `domek-gabi/okno-turkusowe-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#9fe7eb` z alfą 127, obróżka `#9fe8ec`.

#### `domek-gabi/okno-zielone.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#a8e6a0`.

#### `domek-gabi/okno-zielone-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#a9e5a1` z alfą 127, obróżka `#a8e6a0`.

#### `domek-gabi/okno-zolte.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#fff09a`.

#### `domek-gabi/okno-zolte-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#ffef9b` z alfą 127, obróżka `#fff09a`.

#### `domek-gabi/oko.png`
55×55 px, kotwica (27, 27). Okrągłe okno-oko w dachu. Środek (27, 27): koło r=27 w O, koło r=26 `#b8f0ea`, koło r=19 `#7cc8f2`. Błysk: ukośna biała `#ffffff` linia 1 px, piksele (27 + round(i/2), 27 + i) dla i = −9…9 (od (23, 18) do (32, 36)).

#### `domek-gabi/oko-mruga.png`
55×55 px, kotwica (27, 27). Oko zamknięte (mrugnięcie). Koło r=27 w O, koło r=26 `#f2a6dc` (kolor dachu), pozioma kreska O x3–51, y27–28.

#### `domek-gabi/wzgorza-wzor.png`
566×66 px, kotwica (0, 0). Liliowe wzgórza za domkiem – wzór powtarzany (jeden okres fali), jeden kolor `#d9ccf5`. Kafelek jest „zawinięty” w pionie: scena układa go tak, że wiersz kafelka = (y sceny) mod 66. Dla kolumny x grzbiet wzgórza ma y = 305 − round(sin(x/90)·15) (współrzędne sceny), a wzgórze wypełnia od grzbietu do y=355; każdy piksel sceny (x, y) trafia do wiersza y mod 66. W kafelku: w kolumnie x pełne są wiersze od (grzbiet mod 66) do 65 oraz 0–25, puste wiersze 26 … (grzbiet mod 66)−1. Przy x=0 grzbiet 305 → puste wiersze 26–40; na szczycie (x≈141) kolumna pełna; w dolinie (x≈424) puste 26–55. Okres sin ≈ 565,5 px, więc kafelek łączy się w poziomie prawie bez szwu.

### winda/

Winda-kotek łącząca pokoje domku Gabi (ui/catElevator.js).

#### `winda/drzwi-windy.png`
6×114 px, kotwica (0, 0). Jedno przesuwane skrzydło drzwi windy w najwęższej postaci; scena rozciąga środkową kolumnę (3-slice). Pudełko 6×114, wypełnienie `#d9ccf5` (tylko x2–3, y2–111), obramowanie O 2 px, ścięte rogi.

#### `winda/szyb-z-kocia-glowa.png`
73×182 px, kotwica (36, 182). Szyb windy z kocią głową na górze. Oś x=36.
1. Rama: pudełko x2–70, y38–181, wypełnienie `#9fe6d4`, obramowanie O.
2. Kabina: pudełko x10–63, y62–175, wypełnienie `#d8f0ff`; biały pasek-odblask `#ffffff` 2 px x16–17, y68–169.
3. Uszy (trójkąty `#f2a6dc` z obrysem): lewe (1, 38), (6, 1), (27, 12), prawe (71, 38), (66, 1), (45, 12).
4. Głowa: półelipsa `#f2a6dc` z obrysem O 1 px, podstawa w y44, w rzędzie 44−dy półszerokość round(35·√(1−(dy/26,25)²)) (obrys: round(36·√(1−(dy/27,25)²))); sięga do y17. Pod nią pas `#f2a6dc` x4–68, y40–45 zakrywający górę ramy.
5. Twarz: oczy – kwadraty O 5×5 x22–26 i x45–49, y29–33; nosek-serce `#f59bbd` z bloków 2×2 według siatki serca (jak `domek-gabi/nosek.png`), 14×12, x29–42, y30–41.

### mapa/

Mapa świata (scena MapScene): trawa, drogi z domu i budynki miejsc.

#### `mapa/chmurka-nieodkryte-miejsce.png`
65×39 px, kotwica (31, 20). Biała chmurka zasłaniająca jeszcze nieodkryte miejsce na mapie. Trzy koła i prostokąt, wszystko `#ffffff` z obrysem 1 px O (najpierw cały kształt powiększony o 1 px w O, potem biały): koło r=12 o środku (13, 25), koło r=16 o środku (32, 17), koło r=12 o środku (51, 24), prostokąt x3–57, y25–36 (obrys też wokół niego, dolna linia O w y37). Cień `#e6eefc` x3–57, y34–35.

#### `mapa/cukiernia.png`
92×102 px, kotwica (46, 102). Cukiernia: kremowy budynek z daszkiem w paski, oknem z babeczką, lawendowymi drzwiami i babeczką-szyldem na dachu.
- Budynek: wypełnienie `#fff7fb` x1–90, y27–101, obrys O 1 px po bokach (x0, x91) i u góry (y26); bez dolnej linii.
- Dach `#bfe8d6` y27–36; linia O w y37 (x0–91).
- Markiza: kolumny x1–90 w paski po 11 px na zmianę `#f7b2cc` (x1–11, 23–33, 45–55, 67–77, 89–90) i `#ffffff` (x12–22, 34–44, 56–66, 78–88), od y38 w dół 12 px + falbanka: kolumna wydłużona o round(|sin(π·i/11)|·2) px (i = 0…89), więc w środku każdego paska do y51.
- Okno: pudełko x4–41, y54–98, `#cfe8ff`, obramowanie O. W nim babeczka (środek x23, spód y96, szer. 21): papilotka `#ffd6b8` z fałdami `#f5c09a` co 4 px i obrysem O (trapez ok. x15–31, y88–96), krem `#f7b2cc` z trzech elips z obrysem (szersza na dole), białe odblaski 2×1, na czubku wisienka `#f28aa5` z obrysem i ogonkiem `#7fc49e` (y73–80).
- Drzwi: x63–87, y53–101 – obrys O 1 px, wnętrze `#c3b3ea` x64–86, y54–101; klamka `#f6d98b` 2×2 x84–85, y78–79.
- Szyld: babeczka (środek x46, spód y29, szer. 27) wychodząca ponad dach: papilotka `#ffd6b8` z fałdami `#f5c09a` (y21–28, obrys O), krem lawendowy `#d9ccf5` z trzech elips z obrysem (y8–20), posypka 2×1 w `#f59bbd`, `#a6dcc4`, `#f6d98b`, `#c3b3ea`, białe odblaski, wisienka `#f28aa5` (y3–8) z ogonkiem `#7fc49e` do y0.

#### `mapa/dentysta.png`
86×79 px, kotwica (43, 79). Gabinet dentysty: biały budynek z błękitnym dachem i okrągłym szyldem z zębem.
- Budynek: obrys O 1 px – rząd y0 (x0–85) i kolumny x0, x85 (bez dolnej linii); wnętrze `#ffffff` x1–84, y1–78.
- Dach `#cfe8ff` y1–11, linia `#a6dcc4` w y12.
- Szyld: koło r=17 w O, koło r=16 `#bfe8d6`, środek (43, 31). Na nim ząb: siatka 9×9 z bloków 3×3, lewy górny róg (30, 18):
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
  O = obrys, W = `#ffffff`, L = `#cfe8ff`, `.` = nic (widać miętowe tło szyldu).
- Okna `#cfe8ff` 12×12 (bez obrysu): x4–15 i x70–81, y25–36.
- Drzwi: obrys O x32–53, y55–78 (bez dołu), wnętrze `#bfe8d6` x33–52, y56–78.

#### `mapa/dom-postaci.png`
52×55 px, kotwica (26, 60). Dom postaci (start na mapie): brzoskwiniowy domek z różowym dachem. Dach: trójkąt w rzędach y0–25, w rzędzie r szerokość 2(r+1) wycentrowana na x=25,5 (rząd 0: x25–26, rząd 24: x1–50); rzędy 0 i 25 w O (rząd 25 pełny x0–51), reszta `#f7b2cc` (bez obrysu boków). Ściany `#ffe1c4` x3–48, y26–53 z obrysem O 1 px po bokach (x2, x49) i na dole (y54). Okna `#cfe8ff` 8×8 bez obrysu: x5–12 i x39–46, y28–35. Drzwi `#c3b3ea` x20–31, y37–53.

#### `mapa/domek-gabi.png`
75×88 px, kotwica (37, 88). Domek Gabi na mapie – ta sama budowa co `domek-gabi/domek-bez-okien.png`, ale mały i z oknami, oczami, noskiem i drzwiami. Oś x=37.
- Uszy: lewe `#d9bdf5` (ok. x9–28, y0–16), prawe `#ffe1d0` (x47–65) z okienkiem `#f59bd0` x54–57, y5–11, przedzielonym kreską `#ffe1d0` w x56.
- Dach-kopuła: linia O w y9, kolor w y10–33 (półszerokość rośnie do 34–35 px, obrys O 1 px po bokach), `#f8bfe6` y11–14, niżej `#f2a6dc`; dachówki – kreski `#e892cf` 2×1 co 6 px w rzędach y16, 21, 26, 31.
- Oczy-okna: koło r=7 w O, r=6 `#b8f0ea`, r=4 `#7cc8f2`, środki (23, 23) i (51, 23); błysk biały – piksele (x+round(i/2), y+i) dla i = −2…2.
- Nosek-serce `#f59bbd` 7×6 (siatka serca, bloki 1 px) x34–40, y24–29.
- Wąsy `#c3b3ea` 7×1: x0–6 i x68–74 w y25 oraz y30.
- Gzyms: pudełko x6–68, y34–38 `#ffe1d0`; ściany pudełko x10–63, y39–82 `#c4eee2`; podmurówka pudełko x8–65, y83–87 `#ffe1d0`; stropy `#ffe1d0` 1 px na całą szerokość ścian w y54 i y68.
- Okna 14×9 (pudełka z obramowaniem O, szczebel O w środku, białe odblaski 1×2 w x+2 i x+9): lewe x15–28, prawe x45–58; rzędy y43–51, y57–65, y72–80; kolory: góra `#f7a6c8` / `#a8e6a0`, środek `#9fe8ec` / `#d8b4f5`, dół `#fff09a` / `#ffc08a`.
- Drzwi: pudełko x32–42, y74–82, `#9fd0f5`, szpara O w x37.
- Daszek nad drzwiami: półkole `#f59bd0` r=7 (obrys r=8) nad drzwiami, środek (37, 73), z uszkami i dwoma kreskami O 2×1 (zamknięte oczka) w y69.

#### `mapa/drogi-z-domu.png`
463×270 px, kotwica (−22, −128). Wszystkie drogi z domu do miejsc na mapie (jedna warstwa). Piksel obrazka (x, y) = punkt sceny (x+22, y+128). Każda droga to krzywa Catmull-Rom (Phaser Spline) przez punkty sceny, od domu (86, 315):
- szpital: (243, 324), (356, 251), (432, 161);
- cukiernia: (216, 385), (346, 373), (454, 363);
- dentysta: (54, 227), (108, 170), (162, 145);
- pracownia: (162, 243), (243, 182), (302, 137);
- szkoła: (32, 235), (54, 181);
- domek Gabi: (243, 324), (367, 275), (475, 258).
Na krzywej punkty co ok. 2 px (getSpacedPoints, liczba = długość/2). Dla każdej drogi po kolei: w każdym punkcie koło r=9 `#e8cc9e` (brzeg), potem w każdym punkcie koło r=8 `#f6e3c4` (nawierzchnia), potem co 6. punkt kropka 2×2 `#fff7e0` w (x−1, y−1). Drogi rysowane jedna po drugiej w podanej kolejności, więc brzeg późniejszej drogi kładzie się na nawierzchnię wcześniejszej tam, gdzie się krzyżują. Droga ma 19 px szerokości, brzeg 1 px.

#### `mapa/drzewko.png`
27×33 px, kotwica (13, 33). Drzewko – ozdoba mapy. Pień `#d8b39c` 3 px x12–14, y23–32 (u góry przykryty koroną). Korona: koło r=13 w O, koło r=12 `#a6dcc4`, środek (13, 13). Jaśniejsza plama: koło r=5 `#bfe8d6` o środku (11, 11).

#### `mapa/pracownia.png`
92×96 px, kotwica (46, 96). Pracownia plastyczna na mapie: kremowy budynek z tęczową markizą, oknem ze sztalugą, różowymi drzwiami i paletą-szyldem.
- Budynek: `#fff7fb` x1–90, y21–95, obrys O 1 px po bokach (x0, x91) i u góry (y20); bez dołu.
- Dach `#d9ccf5` y21–31.
- Markiza y32–42: pasy po 15 px `#f28aa5` (x1–15), `#ffc08a` (16–30), `#fff09a` (31–45), `#7fcf9a` (46–60), `#9fd0f5` (61–75), `#c3b3ea` (76–90); linia O w y43 (x0–91).
- Okno: pudełko x4–44, y47–92, `#cfe8ff`. Sztaluga-obrazek: prostokąt O x16–33, y51–73, wnętrze `#ffffff` x17–32, y52–72; kropki farby: koło r=2 `#f28aa5` o środku (23, 59) i koło r=2 `#9fd0f5` o środku (28, 61).
- Drzwi: obrys O x64–87, y46–95 (bez dołu), wnętrze `#f7b2cc` x65–86, y47–95.
- Szyld-paleta (ponad dachem): elipsa `#f3dcc4` o środku (46, 15), półosie 17×14, z obrysem O 1 px (elipsa 18×15); otwór na kciuk: koło r=4 O, w nim r=3 `#fff7fb`, środek (54, 20). Plamy farby – koła r=3 bez obrysu: `#f28aa5` (38, 14), `#fff09a` (43, 9), `#9fd0f5` (50, 9), `#7fcf9a` (40, 21), `#c3b3ea` (55, 14).

#### `mapa/szkola.png`
86×74 px, kotwica (43, 73). Szkoła: żółty budynek pod lawendowym trójkątnym dachem z zegarem.
- Ściany `#fff1c9` x4–81, y28–69; dół `#f6d98b` y70–72; obrys O 1 px: kolumny x3 i x82 (y28–73), rząd y73, oraz rząd y27 na całą szerokość x0–85 (to dół dachu).
- Dach: trójkąt `#d9ccf5` od (0, 27) przez szczyt (43, 0) do (86, 27); obrys O tylko w pojedynczych pikselach na skosach (obrys = trójkąt większy o 1 px, prawie cały przykryty), szczyt O x42–43, y0.
- Zegar: koło r=8 w O, r=7 `#ffffff`, środek (43, 17); wskazówki O: pionowa x43, y11–17, pozioma x43–48, y17.
- Drzwi: obrys O x34–51, y47–73, wnętrze `#f59bbd` x35–50, y48–72 (zachodzi na pas `#f6d98b`).
- Cztery okna – pudełka 11×11 `#cfe8ff` z obramowaniem O i pionowym szczeblem O w środku (x+5): x11–21, x25–35, x50–60, x64–74, y43–53.

#### `mapa/szpital.png`
98×82 px, kotwica (49, 82). Szpital: biały budynek z lawendowym dachem i szyldem z różowym krzyżem.
- Budynek: obrys O 1 px – rząd y0 (x0–97), kolumny x0 i x97; bez dołu; wnętrze `#ffffff` x1–96, y1–81.
- Dach `#d9ccf5` y1–12, linia `#c3b3ea` w y13.
- Szyld: obrys O x33–65, y16–48, wnętrze `#fff7fb` x34–64, y17–47. Krzyż `#f59bbd`: pionowe ramię x45–52, y21–43; poziome x38–60, y29–36.
- Okna `#cfe8ff` 12×12 bez obrysu: x4–15 i x82–93, y27–38.
- Drzwi: obrys O x37–61, y57–81 (bez dołu), wnętrze `#cfe8ff` x38–60, y58–81, biała `#ffffff` szpara 1 px w x49.

#### `mapa/trawa.png`
240×240 px, kotwica (0, 0). Trawa mapy – wzór powtarzany. Tło `#d4f2e4`. Jaśniejsze plamy `#e2f7ec` – koła (środek x, y, promień): (155, 217, 12), (24, 54, 18), (46, 78, 19), (81, 148, 19), (228, 124, 12), (108, 106, 16). Kwiatki – kwadraty 2×2 (lewy górny róg):
- `#fff1c9`: (194,28) (129,142) (207,20) (183,189) (49,120) (198,81) (233,116) (172,60) (86,73)
- `#ffffff`: (9,75) (9,14) (152,205) (184,195) (98,42) (22,205) (151,20) (146,135) (202,203) (15,183) (174,80)
- `#d9ccf5`: (176,89) (161,72) (113,178) (172,222) (8,18) (163,113) (107,169) (134,223) (67,68)
- `#f7b2cc`: (90,121) (172,42) (110,200) (140,109) (88,156) (24,232) (92,152) (122,68) (36,216)
Wszystko rysowane „zawinięte”: każdą plamę i kwiatek powtórz przesunięte o ±240 w poziomie i pionie, żeby to, co wystaje za brzeg, pojawiło się z drugiej strony – kafelek łączy się bez szwu (np. plama (228,124) wystaje z lewej strony w x0–1).

### start/

Ekran startowy (StartScene): niebo z gradientem (rysowane w kodzie), słońce z blaskiem, chmurki, iskierki i dwa pasma wzgórz.

#### `start/chmurka.png`
72×24 px, kotwica (36, 12). Płaska chmurka z prostokątów, bez obrysu. Cień `#e6eefc`: prostokąt x3–68, y15–23. Biel `#ffffff` (na cieniu): x6–65, y12–20; x12–32, y6–14; x30–53, y0–14; x51–62, y6–14. Widać cień jako pas 3 px po bokach (x3–5, x66–68) i na dole (y21–23).

#### `start/iskierka-biala.png`
3×3 px, kotwica (1, 1). Mała iskierka-plusik migająca na niebie. Pięć pikseli `#ffffff` w kształcie „+”: (1,0), (0,1), (1,1), (2,1), (1,2); rogi przezroczyste.

#### `start/iskierka-rozowa.png`
3×3 px, kotwica (1, 1). Jak `iskierka-biala.png`, kolor `#ffd6e5`.

#### `start/iskierka-zolta.png`
3×3 px, kotwica (1, 1). Jak `iskierka-biala.png`, kolor `#fff1c9`.

#### `start/slonce.png`
43×43 px, kotwica (21, 21). Słońce. Koło r=21 `#fff1c9` o środku (21, 21), bez obrysu.

#### `start/slonce-blask.png`
61×61 px, kotwica (30, 30). Blask za słońcem. Koło r=30 `#fff7e0` o środku (30, 30), bez obrysu.

#### `start/wzgorza-wzor.png`
1080×135 px, kotwica (0, 0). Dwa pasma wzgórz na dole ekranu startowego – wzór powtarzany w poziomie (fale okresowe na 1080 px). Dla kolumny x (k = 2π/1080):
- tylne wzgórze `#d9ccf5`: grzbiet yb = round(66 + 12·sin(3kx) + 3·sin(9kx)), wypełnione od yb do dołu (y134); linia cienia `#cbbcef` 1 px w yb+5;
- przednie wzgórze `#bfe8d6` (na tylnym): grzbiet yf = round(99 + 9·sin(2kx + 1,5)), wypełnione do dołu; jasny brzeg `#d4f2e4` w rzędach yf…yf+2.
Przy x=0: yb=66, yf=108. Fale biegną przez całą szerokość, x0–1079, więc kafelek łączy się bez szwu.

## Część D: szkola, szpital, dentysta, terrarium, choroba, kolorowanki

Konwencje tej części: współrzędne (x, y) liczone od lewego górnego piksela PNG (0, 0); „x10–45” = kolumny 10..45 włącznie. Obrys domyślnie `#6b4a5e`. **Ramka drawBox(x, y, w, h, wypełnienie, obrys)**: prostokąt w×h w kolorze obrysu bez czterech narożnych pikseli i z jednym pikselem ściętym ukośnie w każdym rogu (wiersz 0 i h−1 zajmują kolumny 2..w−3, wiersz 1 i h−2 kolumny 1..w−2), a w środku wypełnienie od (2, 2) do (w−3, h−3) – więc ramka ma 2 px grubości po bokach. **Koło r** (fillCircle): dla każdego dy = −r..r poziomy pasek od −dx do +dx, gdzie dx = round(√(r² − dy²)); średnica 2r+1, zawsze z pojedynczym pikselem na górze, dole, lewo i prawo. **Gwiazda r** (Icons.star): 10 wierzchołków na kątach −90° + 36°·i (szpic do góry), promień r dla parzystych i, 0,48·r dla nieparzystych; wypełnione piksele, których środek (x+0,5, y+0,5) leży w wielokącie; najpierw cała gwiazda obrysu o promieniu r + max(1,5; L/0,42) (L = max(1, round(r/10))), na niej gwiazda wypełnienia o promieniu r, obie o środku w kotwicy. Zaokrąglenia jak w JS: Math.round(x,5) w górę (np. round(−13,5) = −13).

### szkola/

Ekran szkoły (klasa z ławkami, lekcje: rozsypanka, zagadki, rebusy, wykreślanka) – tło, ikony lekcji na ławkach, gwiazdki postępu i obrazki zwierząt do zagadek i rebusów.

#### `szkola/tapeta.png`
42×4 px, kotwica (0, 0). Wzór powtarzany – tapeta ściany klasy w pionowe pasy. Lewa połowa x0–20 (21 px) `#fff7e8`, prawa x21–41 (21 px) `#fcefd9`, wszystkie 4 wiersze takie same. Kafelek powtarzany w poziomie i pionie od x = 0 sceny; na brzegach pasy po 21 px na przemian.

#### `szkola/podloga.png`
4×12 px, kotwica (0, 0). Wzór powtarzany – drewniana podłoga klasy. Całość `#f3dcc4`, tylko wiersz y6 (cały, 4 px) `#e2c4a6` (linia deski). Powtarzany daje poziome linie co 12 px.

#### `szkola/lekcja-rozsypanka.png`
90×90 px, kotwica (45, 45). Ikona lekcji „rozsypanka” na ławce: trzy rozsypane kartoniki z wyrazami. Tło: ramka drawBox(0, 0, 90, 90) wypełnienie `#fff7fb`, obrys `#c3b3ea`. Trzy kartoniki, każdy drawBox z wypełnieniem `#ffffff` i obrysem `#7a3f63`, wysokość 22: (x7, y16, szer. 36), (x50, y16, szer. 27), (x12, y50, szer. 45). Na każdym poziomy pasek „tekstu” `#c3b3ea` 2 px wysokości: od x+3 do x+w−4, w wierszach y+10 i y+11 kartonika.

#### `szkola/lekcja-wykreslanka.png`
90×90 px, kotwica (45, 45). Ikona lekcji „wykreślanka”: siatka 4×4 z zaznaczonym jednym wierszem. Tło jak w rozsypance (drawBox 90×90, `#fff7fb`, obrys `#c3b3ea`). Drugi wiersz siatki wypełniony `#f7b2cc`: x9–80, y27–44. Linie siatki `#c3b3ea` 1 px: pionowe w x = 9, 27, 45, 63, 81 na wysokości y9–81 i poziome w y = 9, 27, 45, 63, 81 na szerokości x9–81 (komórki 18 px, linie rysowane na różowym).

#### `szkola/lekcja-rebusy.png`
90×90 px, kotwica (45, 45). Ikona lekcji „rebusy”: mała góra. Tło jak w rozsypance. Na nim maska `gora` (patrz `szkola/obrazki/gora.png`) narysowana blokowo ×3 (każdy piksel maski = kwadrat 3×3, bez wygładzania), lewy górny róg kwadratu 16×16 maski w (35, 21) – czyli rysunek zajmuje x35–82, y21–65.

#### `szkola/lekcja-zagadki.png`
90×90 px, kotwica (45, 45). Ikona lekcji „zagadki”: mała wiewiórka. Tło jak w rozsypance. Maska `wiewiorka` (patrz `szkola/obrazki/wiewiorka.png`) blokowo ×3, lewy górny róg kwadratu 16×16 maski w (12, 24) – rysunek zajmuje x15–59, y30–65.

#### `szkola/gwiazda-postepu.png`
26×24 px, kotwica (13, 13). Złota gwiazdka postępu rundy (jedna za każde zadanie). Gwiazda r = 12 (obrys r ≈ 14,4), wypełnienie `#f6d98b`, obrys `#6b4a5e` ok. 1–2 px.

Siatka pikseli (26×24; . = przezroczysty, A = #6b4a5e, B = #f6d98b):

```
............AA............
............AA............
...........ABBA...........
...........ABBA...........
..........ABBBBA..........
..........ABBBBA..........
.........ABBBBBBA.........
........AABBBBBBAA........
AAAAAAAABBBBBBBBBBAAAAAAAA
AABBBBBBBBBBBBBBBBBBBBBBAA
.AABBBBBBBBBBBBBBBBBBBBAA.
...ABBBBBBBBBBBBBBBBBBA...
....ABBBBBBBBBBBBBBBBA....
.....ABBBBBBBBBBBBBBA.....
......ABBBBBBBBBBBBA......
......ABBBBBBBBBBBBA......
......ABBBBBBBBBBBBA......
......ABBBBBBBBBBBBA......
......ABBBBBBBBBBBBA......
......ABBBBBAABBBBBA......
.....ABBBBAA..AABBBBA.....
.....ABBAA......AABBA.....
.....AAA..........AAA.....
.....AA............AA.....
```

#### `szkola/gwiazda-postepu-pusta.png`
26×24 px, kotwica (13, 13). Jeszcze nie zdobyta gwiazdka postępu. Identyczna jak `gwiazda-postepu.png`, tylko wypełnienie `#ffffff` zamiast `#f6d98b`.

#### `szkola/gwiazdka-na-lawce.png`
24×23 px, kotwica (12, 12). Mała złota gwiazdka zdobyta na ławce. Gwiazda r = 11, wypełnienie `#f6d98b`, obrys `#6b4a5e`.

Siatka pikseli (24×23; . = przezroczysty, A = #6b4a5e, B = #f6d98b):

```
...........AA...........
...........AA...........
..........ABBA..........
..........ABBA..........
.........ABBBBA.........
.........ABBBBA.........
........ABBBBBBA........
..AAAAAAABBBBBBAAAAAAA..
AABBBBBBBBBBBBBBBBBBBBAA
.AABBBBBBBBBBBBBBBBBBAA.
..AABBBBBBBBBBBBBBBBAA..
...AABBBBBBBBBBBBBBAA...
....AABBBBBBBBBBBBAA....
.....AABBBBBBBBBBAA.....
......ABBBBBBBBBBA......
......ABBBBBBBBBBA......
.....ABBBBBBBBBBBBA.....
.....ABBBBBBBBBBBBA.....
.....ABBBBAAAABBBBA.....
.....ABBAA....AABBA.....
.....AAA........AAA.....
....AAA..........AAA....
....A..............A....
```

#### `szkola/gwiazda-koniec-lekcji.png`
140×133 px, kotwica (70, 73). Duża gwiazda nagrody na końcu lekcji. Gwiazda r = 60 o środku (70, 73): obrys `#6b4a5e` – gwiazda o promieniu 74,3 (krawędzie ok. 6 px grubości), na niej gwiazda r = 60 w kolorze `#f6d98b` (zajmuje x13–126, y14–120). Szpic do góry.

#### `szkola/obrazki/gora.png`
64×64 px, kotwica (32, 32). Obrazek do zagadek/rebusów: fioletowa góra ze śnieżnym szczytem. Każdy plik z `szkola/obrazki/` (64×64) i `szkola/obrazki-duze/` (80×80) to maska 16×16 powiększona algorytmem „przerysuj” ×4 (64 px) lub ×5 (80 px), opisanym tutaj raz:

1. Etykiety: każdy kolor maski to osobna etykieta, 0 = pusto (także poza maską). Kolejność etykiet = kolejność pierwszego wystąpienia przy skanowaniu wierszami od lewej góry. Kolor obrysu = ten, który najczęściej sąsiaduje (4-sąsiedztwo) z pustym – zawsze `#6b4a5e`.
2. Głosowanie gaussowskie: dla każdego piksela wyniku (X, Y), sx = (X+0,5)/k − 0,5, sy = (Y+0,5)/k − 0,5; dla pikseli maski x ∈ [⌊sx⌋−2, ⌈sx⌉+2], y ∈ [⌊sy⌋−2, ⌈sy⌉+2] dodaj do wyniku ich etykiety exp(−d²/(2·0,45²)), d = odległość (x, y)–(sx, sy). Wygrywa największy wynik (przy remisie niższa etykieta). Daje to gładkie, zaokrąglone krawędzie zamiast bloków.
3. Odchudzenie obrysu: line = round(k/2) (k=4 → 2 px, k=5 → 3 px), cut = ⌊(k−line)/2⌋ = 1. Dla piksela obrysu: „głębokość” = odległość (kroki 4-sąsiedztwa) do najbliższego piksela nie-obrysu; „kandydat” = etykieta sąsiada nie-obrysu (sprawdzani w kolejności: prawy, lewy, dolny, górny sąsiad piksela źródłowego – pierwszy, który go dosięgnie), a piksel obrysu na brzegu obrazka ma kandydata „pusto”. Piksel obrysu zamienia się na swojego kandydata, jeśli w kwadracie ±k pikseli jest piksel obrysu o głębokości ≥ cut + ⌈line/2⌉ (czyli linia jest gruba); cienkie kreski zostają.
4. Cienkie kreski: każdy piksel maski bez sąsiada tego samego koloru w 4-sąsiedztwie (np. oko `E`, nóżki) – o ile ma sąsiada po skosie albo nie dotyka pustego – rysowany jest ponownie piórem line×line px: kwadrat o lewym górnym rogu (round(cx − line/2), round(cy − line/2)), cx = (x+0,5)·k, cy = (y+0,5)·k, oraz takie kwadraty co 1/(2k) wzdłuż odcinka do środka każdego sąsiada po skosie tego samego koloru. Ukośne kreski (nóżki, czułki) wychodzą jako ciągłe ukośne linie. Pojedyncze oko `E` po głosowaniu daje przy ×4 kwadrat 4×4 bez narożników (12 px), przy ×5 romb 5×5 (13 px: 1-3-5-3-1).

Obrazek 64×64 to więc ten algorytm z k = 4, kotwica w środku. Góra: trójkąt `#c3b3ea` z cieniami `#a898d8` i śniegiem `#ffffff` na szczycie, gruba podstawa z obrysu.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, W = #ffffff, G = #c3b3ea, D = #a898d8; 15 wierszy rysunku wyśrodkowanych w pionie, 0 pustych u góry):

```
.......OO.......
......OWWO......
......OWWO......
.....OWWWWO.....
.....OWGWWO.....
....OGGWGWGO....
....OGGGGGGO....
...OGGGGGGGGO...
...OGGGGGGDGO...
..OGGGGGGGDDGO..
..OGGDGGGGGDGO..
.OGGDDGGGGGGGGO.
.OGGGGGGGGGGDGO.
OGGGGGGGGGGGDDGO
OOOOOOOOOOOOOOOO
................
```

#### `szkola/obrazki/jez.png`
64×64 px, kotwica (32, 32). Jeż patrzący w lewo: brązowe kolce u góry z ząbkami na grzbiecie, jasny pyszczek z różowym noskiem, dwie nóżki. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, S = #b8957c, F = #f3dcc4, P = #f59bbd; 10 wierszy rysunku wyśrodkowanych w pionie, 3 pustych u góry):

```
................
................
................
......O.O.O.O...
.....OSOSOSOSO..
....OSSSSSSSSSO.
...OSSSSSSSSSSSO
..OFFSSSSSSSSSSO
.OFEFFSSSSSSSSSO
OPFFFFFSSSSSSSSO
.OOFFFFFFFFFFFO.
...OFO....OFO...
...OOO....OOO...
................
................
................
```

#### `szkola/obrazki/kot.png`
64×64 px, kotwica (32, 32). Siedzący rudy kotek z przodu: uszy z różowym środkiem, oczy-kreski, różowy nos, biały pyszczek i brzuszek, ogon po prawej. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, W = #ffffff, C = #f6c79a, P = #f59bbd; 15 wierszy rysunku wyśrodkowanych w pionie, 0 pustych u góry):

```
..OO........OO..
..OPO......OPO..
..OCCOOOOOOCCO..
..OCCCCCCCCCCO..
..OCEECCCCEECO..
..OCCCCPPCCCCO..
..OCCCCWWCCCCO..
...OCCCCCCCCO...
....OOCCCCOO....
...OCCCCCCCCO...
..OCCCWWWWCCCO..
..OCCCWWWWCCCOCO
..OCCCCCCCCCCOCO
..OCCOCCCCOCCOO.
...OOOOOOOOOO...
................
```

#### `szkola/obrazki/krolik.png`
64×64 px, kotwica (32, 32). Siedzący biało-liliowy królik z przodu: długie uszy z różowym środkiem, oczy, różowy nos, łapki, ogonek po prawej. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, B = #ece6f7, P = #f7b2cc; 15 wierszy rysunku wyśrodkowanych w pionie, 0 pustych u góry):

```
....OO....OO....
...OBPO..OPBO...
...OBPO..OPBO...
...OBPO..OPBO...
...OBBOOOOBBO...
..OBBBBBBBBBBO..
..OBEBBBBBBEBO..
..OBBBBPPBBBBO..
..OBBBBBBBBBBO..
...OOBBBBBBOO...
...OBBBBBBBBO...
..OBBBBBBBBBBO..
..OBBBBBBBBBBOO.
..OBBOBBBBOBBOBO
...OOOOOOOOOOOO.
................
```

#### `szkola/obrazki/mrowka.png`
64×64 px, kotwica (32, 32). Mrówka z boku (głowa z lewej): czułki, trzy człony w kolorze `#c9a07a`, sześć cienkich nóżek z obrysu. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, A = #c9a07a; 12 wierszy rysunku wyśrodkowanych w pionie, 2 pustych u góry):

```
................
................
..O...O.........
...O.O..........
...OOOO.........
..OAAAAO........
..OAEAAO..OOOO..
..OAAAAOOOAAAAO.
...OOOOAAOAAAAAO
....O.OAAOAAAAAO
...O..OOOOAAAAO.
...O.O.O.O.OOOO.
....O..O..O.O...
...O..O..O...O..
................
................
```

#### `szkola/obrazki/roza.png`
64×64 px, kotwica (32, 32). Różowa róża na zielonej łodydze z dwoma jasnymi liśćmi. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, R = #f28aa5, P = #f7b2cc, G = #7fcf9a, L = #bfe8d6; 14 wierszy rysunku wyśrodkowanych w pionie, 1 pustych u góry):

```
................
.....OOOOOO.....
....ORRPPRRO....
...ORPRRRRPRO...
...ORPRPPRPRO...
...ORRPRRPRRO...
....ORRPPRRO....
.....OORROO.....
.......OGO......
..OOO..OGO......
.OLLLO.OGO.OOO..
..OLLLOOGOOLLLO.
...OOOOOGOOOOO..
.......OGO......
.......OOO......
................
```

#### `szkola/obrazki/ryba.png`
64×64 px, kotwica (32, 32). Błękitna rybka płynąca w lewo, z jaśniejszym pionowym paskiem i ogonem po prawej. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, B = #9fd0f5, L = #cfe8ff; 8 wierszy rysunku wyśrodkowanych w pionie, 4 pustych u góry):

```
................
................
................
................
.....OOOOO......
...OOBBBBBOO.OO.
..OBBBBLBBBBOOBO
.OBEBBBLBBBBBBBO
.OBBBBBLBBBBBBBO
..OBBBBLBBBBOOBO
...OOBBBBBOO.OO.
.....OOOOO......
................
................
................
................
```

#### `szkola/obrazki/slimak.png`
64×64 px, kotwica (32, 32). Ślimak: beżowe ciało z czułkami po lewej, różowa muszla ze spiralą po prawej. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, B = #f3dcc4, S = #f7b2cc, D = #e58fb0; 11 wierszy rysunku wyśrodkowanych w pionie, 2 pustych u góry):

```
................
................
..O.O...........
..O.O....OOOO...
..OOO...OSSSSO..
.OBBBO.OSSDDSSO.
.OBEBO.OSDSSDSO.
.OBBBO.OSDSDDSO.
.OBBBO.OSSDSSSO.
.OBBBBOOOSSSSOO.
.OBBBBBBBOOOOBBO
..OBBBBBBBBBBBO.
...OOOOOOOOOOO..
................
................
................
```

#### `szkola/obrazki/wiewiorka.png`
64×64 px, kotwica (32, 32). Ruda wiewiórka patrząca w lewo, z różowym noskiem, jasnym brzuszkiem i dużym puszystym ogonem w górę po prawej. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, R = #e8a882, L = #ffe1c4, P = #f59bbd; 12 wierszy rysunku wyśrodkowanych w pionie, 2 pustych u góry):

```
................
................
...O.O....OOOO..
...OROO..ORRRRO.
..ORRRRO.ORRLRRO
..OERRRO.ORLRRRO
.OPRRRRO..ORRRRO
..OOLRRO..ORRRO.
...OLLRROORRRO..
..OLLRRRRORRRO..
..OLLRRRRRRRO...
..OLLRRRRRRO....
..OOLRRRRRO.....
...OOROOROO.....
................
................
```

#### `szkola/obrazki/wrobel.png`
64×64 px, kotwica (32, 32). Wróbel z boku, dziób (żółty) w lewo, jasny brzuszek, ciemniejsze skrzydło i ogon po prawej, dwie nóżki. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, W = #fff1e0, B = #d8b39c, D = #b8957c, Y = #f6d98b; 11 wierszy rysunku wyśrodkowanych w pionie, 2 pustych u góry):

```
................
................
....OOOO........
...OBBBBO.......
..OBEBBBBO......
.OYOBBBBBOOO....
..OOWWBBBBDDO...
...OWWWBBDDDDO..
...OWWWWBBDDDDOO
....OWWWWBBBOODO
.....OOOOOOO..OO
.......O.O......
......OO.OO.....
................
................
................
```

#### `szkola/obrazki/zaba.png`
64×64 px, kotwica (32, 32). Miętowa żaba z przodu: wyłupiaste białe oczy na górze, różowy uśmiech, jasny brzuszek, łapki po bokach. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, W = #ffffff, G = #9fd6b8, L = #d4f2e4, P = #f28aa5; 11 wierszy rysunku wyśrodkowanych w pionie, 2 pustych u góry):

```
................
................
...OOO....OOO...
..OWEWO..OWEWO..
..OWWWOOOOWWWO..
.OGGGGGGGGGGGGO.
.OGGGGGGGGGGGGO.
.OGGPGGGGGGPGGO.
.OGGGPPPPPPGGGO.
..OGGGGGGGGGGO..
.OGGOLLLLLLOGGO.
OGGGOLLLLLLOGGGO
OOOOOOOOOOOOOOOO
................
................
................
```

#### `szkola/obrazki/zolw.png`
64×64 px, kotwica (32, 32). Żółw z boku, głowa po lewej: żółta skorupa w łatki, miętowa głowa, brzuch i dwie nogi. Maska ×4 algorytmem z `szkola/obrazki/gora.png`.

Maska 16×16 (. = przezroczysty, O = #6b4a5e, E = #3d2b3d, S = #f6d98b, D = #d8b39c, G = #9fd6b8; 11 wierszy rysunku wyśrodkowanych w pionie, 2 pustych u góry):

```
................
................
......OOOOO.....
.....OSSDSSO....
....OSDSSSDSO...
...OSSSDSDSSSO..
.OOOSDSSSSSDSO..
OGGOSSSDSDSSSSO.
OGEGOOOOOOOOOOOO
OGGGGGGGGGGGGGO.
.OOOGGOOOOGGOOO.
...OGGO..OGGO...
...OOOO..OOOO...
................
................
................
```

#### `szkola/obrazki-duze/gora.png`
80×80 px, kotwica (40, 40). Ta sama góra co `szkola/obrazki/gora.png`, z tej samej maski 16×16, ale algorytmem „przerysuj” z k = 5 (obrys 3 px).

#### `szkola/obrazki-duze/jez.png`
80×80 px, kotwica (40, 40). Jeż – maska jak w `szkola/obrazki/jez.png`, powiększenie ×5 (k = 5).

#### `szkola/obrazki-duze/kot.png`
80×80 px, kotwica (40, 40). Kot – maska jak w `szkola/obrazki/kot.png`, powiększenie ×5.

#### `szkola/obrazki-duze/krolik.png`
80×80 px, kotwica (40, 40). Królik – maska jak w `szkola/obrazki/krolik.png`, powiększenie ×5.

#### `szkola/obrazki-duze/mrowka.png`
80×80 px, kotwica (40, 40). Mrówka – maska jak w `szkola/obrazki/mrowka.png`, powiększenie ×5.

#### `szkola/obrazki-duze/roza.png`
80×80 px, kotwica (40, 40). Róża – maska jak w `szkola/obrazki/roza.png`, powiększenie ×5.

#### `szkola/obrazki-duze/ryba.png`
80×80 px, kotwica (40, 40). Ryba – maska jak w `szkola/obrazki/ryba.png`, powiększenie ×5.

#### `szkola/obrazki-duze/slimak.png`
80×80 px, kotwica (40, 40). Ślimak – maska jak w `szkola/obrazki/slimak.png`, powiększenie ×5.

#### `szkola/obrazki-duze/wiewiorka.png`
80×80 px, kotwica (40, 40). Wiewiórka – maska jak w `szkola/obrazki/wiewiorka.png`, powiększenie ×5.

#### `szkola/obrazki-duze/wrobel.png`
80×80 px, kotwica (40, 40). Wróbel – maska jak w `szkola/obrazki/wrobel.png`, powiększenie ×5.

#### `szkola/obrazki-duze/zaba.png`
80×80 px, kotwica (40, 40). Żaba – maska jak w `szkola/obrazki/zaba.png`, powiększenie ×5.

#### `szkola/obrazki-duze/zolw.png`
80×80 px, kotwica (40, 40). Żółw – maska jak w `szkola/obrazki/zolw.png`, powiększenie ×5.

### szpital/

Ekran szpitala (sala z łóżkiem chorego chomika: termometr, syrop na łyżce, plaster, kwiatek od gościa).

#### `szpital/podloga.png`
36×36 px, kotwica (0, 0). Wzór powtarzany – szachownica podłogi z kafli 18×18, kolory `#d4f2e4` (mięta) i `#ffffff`. Wiersze y0–15: x0–17 miętowy, x18–35 biały; y16–33: x0–17 biały, x18–35 miętowy; y34–35: x0–17 miętowy, x18–35 biały (kafle przesunięte o 16 px w pionie, żeby zgrać je z linią podłogi). Kafelek łączy się bez szwu: okres 36 px w obu kierunkach.

#### `szpital/okno.png`
84×60 px, kotwica (0, 0). Okno sali z chmurką. Ramka drawBox(0, 0, 84, 60) wypełnienie `#cfe8ff` (niebo), obrys `#6b4a5e`. Chmurka: najpierw w kolorze obrysu koła r+1, potem w `#ffffff` koła r: (27, 33) r=7, (39, 28) r=9, (50, 32) r=7, plus prostokąt podstawy x22–54, y33–38 (obrys: x21–55, y33–39); pod chmurką pasek cienia `#e6eefc` x22–54, y38–39. Na koniec biały krzyż szprosów `#ffffff`: pionowy x41–42, y2–57 i poziomy x2–81, y29–30 (przechodzi przez chmurkę).

Siatka pikseli (84×60; . = przezroczysty, A = #6b4a5e, B = #cfe8ff, C = #ffffff, D = #e6eefc):

```
..AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA..
.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBABCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAAAACACCABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAACCCCCCCCCAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBACCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBAACCCCCCCCCCCCCCCAABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCABABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBABAACCCCCCCCCCCCCCCCCAACAAAABBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBAAAACAACCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBAA
AACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCAA
AACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCAA
AABBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCABBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBADDDDDDDDDDDDDDDDDDDCCDDDDDDDDDDDDABBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBADDDDDDDDDDDDDDDDDDDCCDDDDDDDDDDDDABBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBAAAACAAAABBBBBBBBBCCBBBBBBBABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBABBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA
.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.
..AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA..
```

#### `szpital/znak-krzyz.png`
45×45 px, kotwica (23, 22). Szyld szpitala z różowym krzyżem. Ramka drawBox 45×45, wypełnienie `#fff7fb`, obrys `#6b4a5e`. Krzyż `#f59bbd`: pionowe ramię x18–27, y7–37; poziome ramię x8–38, y17–26 (ramiona 10 px grubości).

#### `szpital/drzwi.png`
55×95 px, kotwica (27, 95) – środek dolnej krawędzi. Zamknięte drzwi sali. Prostokąt obrysu `#6b4a5e` x0–54, y0–94 (pełny, bez ściętych rogów, dołem bez obrysu – drzwi stoją na podłodze). Skrzydło `#f7b2cc` x2–52, y2–94. Górna szyba/panel `#fff7fb` x10–45, y11–31. Dolny panel `#f59bbd` x10–45, y41–82. Klamka: koło r=3 `#f6d98b` o środku (42, 53).

#### `szpital/drzwi-otwarte.png`
66×95 px, kotwica (38, 95). Te same drzwi otwarte: futryna i otwarte skrzydło z lewej. Obrys futryny `#6b4a5e` x11–65, y0–94; wnętrze przejścia `#d9ccf5` x13–63, y2–82, a na dole podłoga za drzwiami `#d4f2e4` x13–63, y83–94. Otwarte skrzydło widziane z boku po lewej: prostokąt obrysu x0–12, y2–94, w nim `#f7b2cc` x1–11, y3–93.

#### `szpital/lozko.png`
201×90 px, kotwica (6, 51) – lewy górny róg materaca. Łóżko szpitalne (bez kołdry). Wszystkie ramki drawBox z obrysem `#6b4a5e`, rysowane w tej kolejności: wezgłowie drawBox(0, 0, 18, 90) `#d9ccf5`; nogi: prostokąty obrysu (18, 63, 8×27) i (183, 63, 8×27) z wnętrzem `#c3b3ea` (19, 63, 6×26) i (184, 63, 6×26); rama drawBox(6, 63, 195, 9) `#d9ccf5`; materac drawBox(8, 51, 191, 14) `#ffffff`; poduszka drawBox(18, 39, 39, 15) `#fbd3e2`.

#### `szpital/koldra-na-lozko.png`
154×27 px, kotwica (0, 0). Kołdra przykrywająca chomika w łóżku (rysowana przed nim). Ramka drawBox(0, 0, 154, 27) wypełnienie `#ffe1c4`, obrys `#6b4a5e`. Pasek `#f7b2cc` x2–151, y6–8.

#### `szpital/termometr-slupek-0.png`
25×62 px, kotwica (12, 31). Termometr pod pachą; 7 klatek (0–6), w których różowy słupek rośnie. Rurka: obrys x5–18, y0–39, wnętrze `#ffffff` x6–17, y1–38. Bańka: koło r=12 obrysu, na nim koło r=11 `#f59bbd`, środek (12, 49). Słupek `#f59bbd` x9–14 od wiersza 32 (klatka 0) do bańki. Kreski podziałki `#c3b3ea` 2×1 w x16–17, y = 11, 20, 30.

Siatka pikseli (25×62; . = przezroczysty, A = #6b4a5e, B = #ffffff, C = #c3b3ea, D = #f59bbd):

```
.....AAAAAAAAAAAAAA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBCCA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBCCA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBBBA......
.....ABBBBBBBBBBCCA......
.....ABBBBBBBBBBBBA......
.....ABBBDDDDDDBBBA......
.....ABBBDDDDDDBBBA......
.....ABBBDDDDDDBBBA......
.....ABBBDDDDDDBBBA......
.....ABBBDDDDDDBBBA......
.....ABBBDDDDDDBBBA......
.....ABBBDDDDDDBBBA......
.....AADDDDDDDDDDDAA.....
....AADDDDDDDDDDDDDAA....
...ADDDDDDDDDDDDDDDDDA...
..AADDDDDDDDDDDDDDDDDAA..
..ADDDDDDDDDDDDDDDDDDDA..
.ADDDDDDDDDDDDDDDDDDDDDA.
.ADDDDDDDDDDDDDDDDDDDDDA.
ADDDDDDDDDDDDDDDDDDDDDDDA
ADDDDDDDDDDDDDDDDDDDDDDDA
ADDDDDDDDDDDDDDDDDDDDDDDA
ADDDDDDDDDDDDDDDDDDDDDDDA
ADDDDDDDDDDDDDDDDDDDDDDDA
ADDDDDDDDDDDDDDDDDDDDDDDA
ADDDDDDDDDDDDDDDDDDDDDDDA
.ADDDDDDDDDDDDDDDDDDDDDA.
.ADDDDDDDDDDDDDDDDDDDDDA.
..ADDDDDDDDDDDDDDDDDDDA..
..AADDDDDDDDDDDDDDDDDAA..
...ADDDDDDDDDDDDDDDDDA...
....AADDDDDDDDDDDDDAA....
.....AADDDDDDDDDDDAA.....
.......AAAAADAAAAA.......
............A............
```

#### `szpital/termometr-slupek-1.png`
25×62 px, kotwica (12, 31). Jak `termometr-slupek-0`, słupek `#f59bbd` (x9–14) zaczyna się w wierszu y28.

#### `szpital/termometr-slupek-2.png`
25×62 px, kotwica (12, 31). Jak `termometr-slupek-0`, słupek od y25.

#### `szpital/termometr-slupek-3.png`
25×62 px, kotwica (12, 31). Jak `termometr-slupek-0`, słupek od y22.

#### `szpital/termometr-slupek-4.png`
25×62 px, kotwica (12, 31). Jak `termometr-slupek-0`, słupek od y19.

#### `szpital/termometr-slupek-5.png`
25×62 px, kotwica (12, 31). Jak `termometr-slupek-0`, słupek od y15.

#### `szpital/termometr-slupek-6.png`
25×62 px, kotwica (12, 31). Jak `termometr-slupek-0`, słupek od y12 (najwyżej).

#### `szpital/lyzka-pelna.png`
59×29 px, kotwica (30, 14). Łyżka leżąca poziomo (czerpak po lewej) z różowym syropem. Czerpak: koło obrysu r=14 i koło `#d9ccf5` r=13 o środku (14, 14); syrop: koło `#f59bbd` r=11 w tym samym środku z białym pikselem `#ffffff` w (10, 10). Trzonek: obrys x14–58, y10–18, wnętrze `#d9ccf5` x27–57, y11–17.

Siatka pikseli (59×29; . = przezroczysty, A = #6b4a5e, B = #d9ccf5, C = #f59bbd, D = #ffffff):

```
..............A............................................
.........AAAAABAAAAA.......................................
.......AABBBBBBBBBBBAA.....................................
.....AABBBBBBBCBBBBBBBAA...................................
....AABBBCCCCCCCCCCCBBBAA..................................
...AABBBCCCCCCCCCCCCCBBBAA.................................
...ABBCCCCCCCCCCCCCCCCCBBA.................................
..ABBBCCCCCCCCCCCCCCCCCBBBA................................
.ABBBCCCCCCCCCCCCCCCCCCCBBBA...............................
.ABBCCCCCCCCCCCCCCCCCCCCCBBA...............................
.ABBCCCCCCDCCCCCCCCCCCCCCBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
ABBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBCCCCCCCCCCCCCCCCCCCCCCCBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
.ABBCCCCCCCCCCCCCCCCCCCCCBBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
.ABBCCCCCCCCCCCCCCCCCCCCCBBA...............................
.ABBBCCCCCCCCCCCCCCCCCCCBBBA...............................
..ABBBCCCCCCCCCCCCCCCCCBBBA................................
...ABBCCCCCCCCCCCCCCCCCBBA.................................
...AABBBCCCCCCCCCCCCCBBBAA.................................
....AABBBCCCCCCCCCCCBBBAA..................................
.....AABBBBBBBCBBBBBBBAA...................................
.......AABBBBBBBBBBBAA.....................................
.........AAAAABAAAAA.......................................
..............A............................................
```

#### `szpital/lyzka-pusta.png`
59×29 px, kotwica (30, 14). Ta sama łyżka po wypiciu syropu: bez różowego koła i białego punktu – czerpak cały `#d9ccf5` w obrysie `#6b4a5e`.

#### `szpital/plaster.png`
24×10 px, kotwica (12, 5). Plaster na ranę. Ramka drawBox 24×10, wypełnienie `#ffd6b8`, środkowa poduszeczka `#fff1e0` x8–15, y2–7, po bokach różowe kropki `#f7b2cc`.

Siatka pikseli (24×10; . = przezroczysty, A = #6b4a5e, B = #ffd6b8, C = #fff1e0, D = #f7b2cc):

```
..AAAAAAAAAAAAAAAAAAAA..
.AAAAAAAAAAAAAAAAAAAAAA.
AABBBBBBCCCCCCCCBBBBBBAA
AABBBBBBCCCCCCCCBBBBBBAA
AABDBBBDCCCCCCCCDBBBDBAA
AABBBDBBCCCCCCCCBBDBBBAA
AABBBBBBCCCCCCCCBBBBBBAA
AABBBBBBCCCCCCCCBBBBBBAA
.AAAAAAAAAAAAAAAAAAAAAA.
..AAAAAAAAAAAAAAAAAAAA..
```

#### `szpital/kwiatek.png`
25×31 px, kotwica (12, 17). Kwiatek od gościa: cztery różowe płatki `#f7b2cc` (koła r=5 w obrysie r=6, środki w (12, 6), (18, 12), (12, 18), (6, 12)), żółty środek `#f6d98b` (koło r=4 w (12, 12)), miętowa łodyga `#9fd6b8` 2 px w dół do y30 z listkiem po prawej.

Siatka pikseli (25×31; . = przezroczysty, A = #6b4a5e, B = #f7b2cc, C = #f6d98b, D = #9fd6b8):

```
............A............
.........AAABAAA.........
........ABBBBBBBA........
.......ABBBBBBBBBA.......
......ABBBBBBBBBBBA......
......ABBBBBBBBBBBA......
......ABBBBBBBBBBBA......
...AAABBBBBBBBBBBBBAAA...
..ABBBBBBBBBCBBBBBBBBBA..
.ABBBBBBBCCCCCCCBBBBBBBA.
ABBBBBBBBCCCCCCCBBBBBBBBA
ABBBBBBBCCCCCCCCCBBBBBBBA
ABBBBBBBCCCCCCCCCBBBBBBBA
ABBBBBBBCCCCCCCCCBBBBBBBA
ABBBBBBBBCCCCCCCBBBBBBBBA
.ABBBBBBBCCCCCCCBBBBBBBA.
..ABBBBBBBBBCBBBBBBBBBA..
...AAABBBBBBBBBBBBBAAA...
......ABBBBBBBBBBBA......
......ABBBBBBBBBBBA......
......ABBBBBBBBBBBA......
.......ABBBBBBBBBAD......
........ABBBBBBBADD......
.........AAABAAA.........
............AD...........
............DD...........
............DD...........
............DD...........
............DD...........
............DD...........
............DD...........
```

#### `szpital/naklejka.png`
92×86 px, kotwica (46, 47). Naklejka-gwiazda na nagrodę za wyleczenie. Gwiazda r = 39 o środku (46, 47), wypełnienie `#fff1c9`, obrys `#6b4a5e` (gwiazda obrysu r ≈ 48,5, krawędź ok. 4 px).

### dentysta/

Ekran dentysty (gabinet z fotelem, lampą i plakatem; zbliżenie buzi z zębami, które się szczotkuje i płucze).

#### `dentysta/podloga.png`
36×36 px, kotwica (0, 0). Wzór powtarzany – szachownica kafli 18×18 w kolorach `#ffffff` i `#e4f1ff`. Wiersze y0–14: x0–17 biały, x18–35 błękitny; y15–32: x0–17 błękitny, x18–35 biały; y33–35: x0–17 biały, x18–35 błękitny. Okres 36 px w obu kierunkach.

#### `dentysta/plakat.png`
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

#### `dentysta/lampa.png`
37×37 px, kotwica (18, 18). Okrągła lampa nad fotelem. Koło r=18 `#6b4a5e`, na nim koło r=17 `#fff1c9`, blask: koło r=5 `#ffffff` o środku (13, 13).

#### `dentysta/fotel.png`
123×111 px, kotwica (60, 111) – środek podstawy na podłodze. Różowy fotel dentystyczny w kształcie litery L (oparcie po lewej). Kolejno: podstawa drawBox(33, 93, 54, 18) `#d9ccf5`; kolumna – prostokąt `#6b4a5e` x54–65, y72–92; siedzisko drawBox(9, 60, 114, 18) `#f7b2cc`; oparcie drawBox(0, 0, 21, 72) `#f7b2cc`; pasek cienia `#eea0bd` x12–116, y72–74. Wszystkie ramki z obrysem `#6b4a5e`.

#### `dentysta/buzia-z-zebami.png`
270×156 px, kotwica (143, 78). Zbliżenie otwartej buzi w dymku: wargi, dziąsła, 6 zębów u góry i 6 u dołu. Dymek: drawBox(15, 0, 255, 156) `#ffffff`, obrys `#6b4a5e`; z lewej ogonek w dół-w-lewo: w wierszach y117–131 trójkąt `#ffffff` przylegający do lewej ramki, ograniczony ukośną linią obrysu 2 px od (14–15, 117) do (0–1, 131) (każdy wiersz o 1 px dalej w lewo); kolumna x16 zostaje obrysem 1 px, kolumna x15 w tych wierszach jest biała. Wargi (środek elips (143, 78)): elipsa `#6b4a5e` rx=111, ry=62, na niej `#f28aa5` rx=110, ry=61, na niej wnętrze ust `#f0a0b4` rx=101, ry=52 (elipsy z poziomych pasków: dx = round(rx·√(1 − dy²/ry²))). Dziąsła `#f7b2cc`: x47–238, y28–35 i x47–238, y120–127. Zęby, każdy 30 px szeroki, x = 53 + 30·i (i = 0..5): górne y33–65 (33 px), dolne y96–122 (27 px). Ząb = prostokąt obrysu z wnętrzem `#ffffff`; dwa narożne piksele od strony środka ust (u górnych zębów dolne rogi, u dolnych górne rogi) w kolorze `#f0a0b4`; połysk `#cfe8ff` 2 px szeroki w x+22..x+23 od y+5, wysokości 11 (górne) / 9 (dolne).

#### `dentysta/szczoteczka.png`
61×24 px, kotwica (30, 6). Szczoteczka leżąca poziomo, włosie u góry z prawej. Rączka: obrys x0–60, y13–23, wnętrze `#f7b2cc` x1–59, y14–22, linia `#f59bbd` x3–32 w y19. Główka: obrys x39–60, y0–13, wnętrze `#ffffff` x40–59, y1–13 (zachodzi na górny obrys rączki), pionowe paski włosia `#cfe8ff` 1 px w x = 41, 44, 47, 50, 53, 56 na y1–13.

#### `dentysta/kubek.png`
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

#### `dentysta/kubek-przechylony.png`
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

#### `dentysta/naklejka.png`
86×81 px, kotwica (43, 44). Naklejka-nagroda: gwiazda z zębem. Gwiazda r = 36 o środku (43, 44), wypełnienie `#fff1c9`, obrys `#6b4a5e` (gwiazda obrysu r ≈ 45,5). Na niej ząb – ta sama maska 9×9 co w `dentysta/plakat.png`, blokowo ×3, lewy górny róg (30, 33).

#### `dentysta/okruszek-karmelowy.png`
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

#### `dentysta/okruszek-rozowy.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#f59bbd`.

#### `dentysta/okruszek-orzechowy.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#c9a07a`.

#### `dentysta/okruszek-liliowy.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#c3b3ea`.

#### `dentysta/okruszek-zolty.png`
25×21 px, kotwica (12, 9). Jak `okruszek-karmelowy`, kolor `#f6d98b`.

#### `dentysta/piana-mala.png`
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

#### `dentysta/piana-srednia.png`
11×11 px, kotwica (5, 5). Jak `piana-mala`: koło r=5 `#e4f1ff`, na nim r=4 `#ffffff`.

#### `dentysta/piana-duza.png`
13×13 px, kotwica (6, 6). Jak `piana-mala`: koło r=6 `#e4f1ff`, na nim r=5 `#ffffff`.

#### `dentysta/piana-najwieksza.png`
15×15 px, kotwica (7, 7). Jak `piana-mala`: koło r=7 `#e4f1ff`, na nim r=6 `#ffffff`.

#### `dentysta/iskierka-zolta.png`
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

#### `dentysta/iskierka-rozowa.png`
7×7 px, kotwica (3, 3). Jak `iskierka-zolta`, kolor `#f59bbd`.

#### `dentysta/iskierka-liliowa.png`
7×7 px, kotwica (3, 3). Jak `iskierka-zolta`, kolor `#c3b3ea`.

#### `dentysta/iskierka-mietowa.png`
7×7 px, kotwica (3, 3). Jak `iskierka-zolta`, kolor `#9fd6b8`.

### terrarium/

Ekran terrarium (domowa klatka chomika: akwarium ze ściółką, domek, kołowrotek, miska, poidełko i wanienka z pianą).

#### `terrarium/akwarium.png`
522×330 px, kotwica (9, 12) – lewy górny róg szyby. Szklane terrarium z pokrywą, ściółką i podstawką. Kolejno: podstawka – prostokąt `#6b4a5e` x0–521, y319–329, w nim `#e9c9b5` x1–519, y320–324 i linia `#d8b39c` x1–519, y325. Szyba – prostokąt `#6b4a5e` x6–515, y9–320 (ramka 3 px), szkło `#eef8ff` x9–512, y12–317, górny pas `#ddeefa` x9–512, y12–16. Pokrywa – prostokąt `#6b4a5e` x1–519, y0–10, w nim `#d9ccf5` x3–518, y1–6 i linia `#c3b3ea` x3–518, y7. Ściółka `#f6e3c4`: dla każdej kolumny i = 0..503 (x = 9+i) od y = 257 + round(sin(i/11)·2 + sin(i/5)·0,6) do y317 (falista górna krawędź, y254–259). Drobinki `#e8cc9e` 2×1 px: 2196 sztuk z generatora seed = 5, wywołanie rand(min, max): seed = (seed·9301 + 49297) mod 233280, wynik min + ⌊seed/233280 · (max−min+1)⌋; dla każdej drobinki x = 9 + rand(0, 502), potem y = rand(262, 316). Odblask na szybie `#fcfeff` (biały 80% na szkle): ukośne linie 1 px – piksele (18+i, 39−i) dla i = 0..17 oraz (27+i, 39−i) dla i = 0..8. Rogi poza prostokątami przezroczyste.

#### `terrarium/domek-chomika.png`
62×57 px, kotwica (1, 15) – lewy górny róg ściany. Różowy domek ze spadzistym dachem i drzwiami. Dach (y0–14): wiersz y0 obrys `#6b4a5e` x29–32; wiersze r = 1..14 (y = r) `#d9a0c8` od x = 29−2r do x = 32+2r (w y14 x1–60). Ściany y15–56: kolumny x0 i x61 obrys, wnętrze `#f7b2cc` x1–60, z pasem `#eea0bd` y15–17 pod dachem. Drzwi `#8a5c9e`: prostokąt x23–37, y34–56 i szerszy x22–39, y37–56 (zaokrąglona góra). Dół bez obrysu.

#### `terrarium/kolo-obrot-0.png`
109×109 px, kotwica (54, 54) – oś. Kołowrotek; 6 klatek obrotu co 15°. Środek (54, 54): koło r=54 `#c9b8ef`, w nim koło r=49 `#eef8ff` (obręcz 5 px). Cztery szprychy `#c9b8ef` pod kątami a = kąt klatki + k·90° (k = 0..3; kąt rośnie zgodnie z ruchem wskazówek zegara, 0° = w prawo): dla t = 0..48 kwadrat 2×2 z lewym górnym rogiem (54 + round(cos a·t), 54 + round(sin a·t)). Oś: koło r=5 `#b8a6dc`. Bez obrysu `#6b4a5e`. Klatka 0: szprychy poziomo i pionowo.

#### `terrarium/kolo-obrot-15.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 15°.

#### `terrarium/kolo-obrot-30.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 30°.

#### `terrarium/kolo-obrot-45.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 45° (po przekątnych).

#### `terrarium/kolo-obrot-60.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 60°.

#### `terrarium/kolo-obrot-75.png`
109×109 px, kotwica (54, 54). Jak `kolo-obrot-0`, szprychy obrócone o 75°.

#### `terrarium/stojak-kolka.png`
26×63 px, kotwica (12, 63) – podłoga pod osią. Stojak kołowrotka w kolorze `#b8a6dc`, bez obrysu: pionowy słupek x11–15, y0–62 i pozioma stopka x0–25, y60–62 (odwrócone T).

#### `terrarium/miska-z-ziarnami.png`
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

#### `terrarium/poidelko.png`
13×53 px, kotwica (0, 0). Poidełko na ścianie terrarium. Prostokąt obrysu `#6b4a5e` x0–12, y0–38; butelka `#cfe8ff` x1–11, y1–15; woda `#9fd0f5` x1–11, y16–36 (y37–38 obrys dna); rurka `#b7b0c4` x4–6, y39–52 (bez obrysu).

#### `terrarium/wanna-woda-z-tylu.png`
74×5 px, kotwica (37, 5). Tafla wody w wanience, widoczna za chomikiem. Prostokąt `#6b4a5e` 74×5, wiersze y0–1 całe obrysem, w y2–4 wnętrze `#9fd0f5` x1–72.

#### `terrarium/wanna.png`
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

#### `terrarium/babelek-maly.png`
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

#### `terrarium/babelek-sredni.png`
9×9 px, kotwica (4, 4). Jak `babelek-maly`: koło r=4 `#dcd3f2`, r=3 `#ffffff`, piksel `#9fd0f5` w (2, 2).

#### `terrarium/babelek-duzy.png`
11×11 px, kotwica (5, 5). Jak `babelek-maly`: koło r=5 `#dcd3f2`, r=4 `#ffffff`, piksel `#9fd0f5` w (2, 2).

#### `terrarium/babelek-najwiekszy.png`
13×13 px, kotwica (6, 6). Jak `babelek-maly`: koło r=6 `#dcd3f2`, r=5 `#ffffff`, piksel `#9fd0f5` w (3, 3).

### choroba/

Dymki i efekty choroby chomika (pokazywane nad chorym chomikiem w różnych scenach, zwłaszcza w szpitalu).

#### `choroba/dymek-duzy.png`
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

#### `choroba/dymek-maly.png`
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

#### `choroba/kichniecie.png`
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

### kolorowanki/

Ekran pracowni kolorowania (strona do kolorowania, panel z farbami po boku i narzędzia: wiaderko i pędzel).

#### `kolorowanki/tapeta.png`
36×4 px, kotwica (0, 0). Wzór powtarzany – tapeta pracowni w pionowe pasy: x0–17 `#f3ecfb`, x18–35 `#ebe2f7`, 4 jednakowe wiersze. Powtarzany w obu kierunkach od x = 0 sceny.

#### `kolorowanki/farba-rozowa.png`
37×37 px, kotwica (18, 18). Kropla farby do wyboru na panelu (okrągła próbka). Koło r=18 `#6b4a5e` (obrys 1 px), w nim koło r=17 wypełnione farbą (piksel po pikselu: dla dy = −17..17, dx = round(√(289 − dy²)), piksele od −dx do dx). Tu kolor jednolity `#f7a8c4`. Połysk: kwadrat 2×2 w x9–10, y9–10 – biały 70% na farbie (tu `#fde5ed`; ogólnie kolor = 0,3·farba + 0,7·255). Wszystkie farby poniżej mają ten sam kształt.

Siatka pikseli (37×37; . = przezroczysty, A = #6b4a5e, B = #f28aa5, C = #fbdce4):

```
..................A..................
............AAAAAABAAAAAA............
..........AABBBBBBBBBBBBBAA..........
........AABBBBBBBBBBBBBBBBBAA........
.......ABBBBBBBBBBBBBBBBBBBBBA.......
......ABBBBBBBBBBBBBBBBBBBBBBBA......
.....ABBBBBBBBBBBBBBBBBBBBBBBBBA.....
....ABBBBBBBBBBBBBBBBBBBBBBBBBBBA....
...ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBA...
..AABBBBBCCBBBBBBBBBBBBBBBBBBBBBBAA..
..ABBBBBBCCBBBBBBBBBBBBBBBBBBBBBBBA..
.AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA.
.ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA.
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA
.ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA.
.ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA.
.AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA.
..ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA..
..AABBBBBBBBBBBBBBBBBBBBBBBBBBBBBAA..
...ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBA...
....ABBBBBBBBBBBBBBBBBBBBBBBBBBBA....
.....ABBBBBBBBBBBBBBBBBBBBBBBBBA.....
......ABBBBBBBBBBBBBBBBBBBBBBBA......
.......ABBBBBBBBBBBBBBBBBBBBBA.......
........AABBBBBBBBBBBBBBBBBAA........
..........AABBBBBBBBBBBBBAA..........
............AAAAAABAAAAAA............
..................A..................
```

(Siatka powyżej to `farba-czerwona`; inne jednolite farby różnią się tylko kolorami B i C.)

#### `kolorowanki/farba-czerwona.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#f28aa5`, połysk `#fbdce4`.

#### `kolorowanki/farba-pomaranczowa.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#ffc08a`, połysk `#ffecdc`.

#### `kolorowanki/farba-zolta.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#fff09a`, połysk `#fffae1`.

#### `kolorowanki/farba-limonkowa.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#b8e6a0`, połysk `#eaf7e2`.

#### `kolorowanki/farba-zielona.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#7fcf9a`, połysk `#d8f1e1`.

#### `kolorowanki/farba-blekitna.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#9fd0f5`, połysk `#e2f1fc`.

#### `kolorowanki/farba-niebieska.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#8aa8e8`, połysk `#dce5f8`.

#### `kolorowanki/farba-lawendowa.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#c3b3ea`, połysk `#ede8f9`.

#### `kolorowanki/farba-brazowa.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#c9a07a`, połysk `#efe2d7`.

#### `kolorowanki/farba-biala.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba `#ffffff` (połysk niewidoczny, też `#ffffff`).

#### `kolorowanki/farba-teczowa.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, ale farba to ukośne tęczowe pasy: piksel (x, y) obrazka ma kolor T[⌊(X+Y)/6⌋ mod 6], gdzie X = x + 82, Y = y + 82, T = [`#f28aa5`, `#ffc08a`, `#fff09a`, `#7fcf9a`, `#9fd0f5`, `#c3b3ea`] – pasy 6 px szerokie, biegnące z prawego górnego do lewego dolnego rogu. Połysk 2×2 w (9, 9) to 30% koloru pasa + 70% bieli.

#### `kolorowanki/farba-w-kropki.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, wzór kropek: przy X = x + 82, Y = y + 82 piksel jest `#ffffff`, gdy (X mod 6 < 2 i Y mod 6 < 2) albo ((X+3) mod 6 < 2 i (Y+3) mod 6 < 2), w przeciwnym razie `#f7a8c4` – białe kwadraty 2×2 w siatce co 6 px, z drugą siatką przesuniętą o (3, 3). Połysk jak w `farba-rozowa`.

#### `kolorowanki/farba-brokat.png`
37×37 px, kotwica (18, 18). Jak `farba-rozowa`, farba złota z brokatem: przy X = x + 82, Y = y + 82 i h = ((X·73856093) XOR (Y·19349663)) jako liczba 32-bitowa bez znaku (mnożenia i XOR jak w JS, z obcięciem do 32 bitów): h mod 23 = 0 → `#ffffff`, w przeciwnym razie h mod 7 = 0 → `#fff7d6`, inaczej `#f6d98b`. Połysk 2×2 w (9, 9): 70% bieli na kolorze piksela.

#### `kolorowanki/farba-wybrana.png`
43×43 px, kotwica (21, 21). Pierścień pod aktualnie wybraną farbą (próbka leży na nim). Koło r=21 `#7a3f63`, na nim koło r=20 `#ffffff` – zostaje cienki ciemny brzeg 1 px i białe tło wystające 3 px spod próbki.

#### `kolorowanki/wiaderko.png`
32×31 px, kotwica (14, 15). Narzędzie „wypełnij”: przechylone błękitne wiaderko `#cfe8ff` z grubym rantem, z którego wylewa się farba (strumień i kałuża) – tu farba biała `#ffffff`, w grze zabarwiana; obrys `#6b4a5e`.

Siatka pikseli (32×31; . = przezroczysty, A = #6b4a5e, B = #ffffff, C = #cfe8ff):

```
..............AAAAAAAAA.........
...........AAAABBBBBBBA.........
........AAAAAAAABBBBBBAA........
......AAAAAAAAAABBBBBBBA........
...AAAAAAAAAACCABBBBBBBA........
AAAAAAAAAACCCCCABBBBBBBA........
AAAAAAACCCCCCCCCBBBBBBBA........
AAAACCCCCCCCCCCCABBBBBBA........
.ACCCCCCCCCCCCCCABBBBBBBA.......
.ACCCCCCCCCCCCCCABBBBBBBA.......
..ACCCCCCCCCCCCCCBBBBBBBA.......
..ACCCCCCCCCCCCCCABBBBBBA.......
...ACCCCCCCCCCCCCABBBBBBA.......
...ACCCCCCCCCCCCCABBBBBBAA......
...ACCCCCCCCCCCCCCBBBBBBBA......
....ACCCCCCCCCCCCCABBBBBBA......
....ACCCCCCCCCCCCCABBBBBBA......
.....ACCCCCCCCCCCCABBBBBBA......
.....ACCCCCCCCCCAAABBBBBBA......
.....AACCCCCCAAA...ABBBBBBA.....
......ACCCCAA......ABBBBBBA.....
......AACA.........ABBBBBBA.....
.......A...........ABBBABBA.....
..................AAAAABAAAAA...
................AABBBBBBBBBBBAA.
...............ABBBBBBBBBBBBBBBA
...............ABBBBBBBBBBBBBBBA
...............ABBBBBBBBBBBBBBBA
................AABBBBBBBBBBBAA.
..................AAAAABAAAAA...
.......................A........
```

#### `kolorowanki/wiaderko-farba.png`
16×29 px, kotwica (−1, 14). Same piksele farby z `wiaderko.png` (strumień i kałuża) na biało `#ffffff`, nakładane z zabarwieniem na kolor wybranej farby. Piksel (0, 0) tego pliku leży na pikselu (15, 1) wiaderka.

Siatka pikseli (16×29; . = przezroczysty, A = #ffffff):

```
AAAAAAA.........
.AAAAAA.........
.AAAAAAA........
.AAAAAAA........
.AAAAAAA........
.AAAAAAA........
..AAAAAA........
..AAAAAAA.......
..AAAAAAA.......
..AAAAAAA.......
...AAAAAA.......
...AAAAAA.......
...AAAAAA.......
...AAAAAAA......
....AAAAAA......
....AAAAAA......
....AAAAAA......
....AAAAAA......
.....AAAAAA.....
.....AAAAAA.....
.....AAAAAA.....
.....AAA.AA.....
........A.......
...AAAAAAAAAAA..
.AAAAAAAAAAAAAAA
.AAAAAAAAAAAAAAA
.AAAAAAAAAAAAAAA
...AAAAAAAAAAA..
........A.......
```

#### `kolorowanki/pedzel.png`
30×31 px, kotwica (14, 16). Narzędzie „maluj palcem”: pędzel ukośnie (rączka w prawy górny róg). Rączka `#c9a07a`, metalowa skuwka `#c3b3ea`, włosie zakończone szpicem w lewym dolnym rogu w kolorze farby – tu `#ffffff` (zabarwiane w grze); obrys `#6b4a5e`.

Siatka pikseli (30×31; . = przezroczysty, A = #6b4a5e, B = #c9a07a, C = #c3b3ea, D = #ffffff):

```
............................A.
...........................BAA
..........................BBBA
.........................BBBB.
.......................ABBBB..
......................ABBBBA..
.....................ABBBBA...
....................ABBBBA....
...................ABBBBA.....
..................ABBBBA......
................AABBBBA.......
...............AABBBBA........
.............AAABBBBAA........
............AACABBBAA.........
..........A.ACCCABAA..........
.........AAD.ACCCAA...........
........AADDDDACAA............
........ADDDDDDBA.............
.......ADDDDDDDDA.............
......ADDDDDDDDDA.............
.....AADDDDDDDDAA.............
....AADDDDDDDDAA..............
....ADDDDDDDDAA...............
...ADDDDDDDDA.................
..ADDDDDDDDA..................
..ADDDDDDDA...................
..DDDDDDDA....................
.ADDDDDDA.....................
.ADDDDAA......................
.DDAAA........................
AAA...........................
```

#### `kolorowanki/pedzel-farba.png`
15×15 px, kotwica (13, 1). Same piksele farby (włosie) z `pedzel.png` na biało `#ffffff`, do zabarwienia. Piksel (0, 0) tego pliku leży na pikselu (1, 15) pędzla.

Siatka pikseli (15×15; . = przezroczysty, A = #ffffff):

```
..........A....
.........AAAA..
........AAAAAA.
.......AAAAAAAA
......AAAAAAAAA
......AAAAAAAA.
.....AAAAAAAA..
....AAAAAAAA...
...AAAAAAAA....
..AAAAAAAA.....
..AAAAAAA......
.AAAAAAA.......
.AAAAAA........
.AAAA..........
AA.............
```
