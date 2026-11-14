# Obrazki: `docs/assets/gfx/cukiernia/`

Cukiernia: dekorowanie babeczek i gablota. 30 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Ekran cukierni (BakeryScene): dzieci składają babeczkę na talerzu (papilotka, biszkopt, krem w wybranym kolorze, posypka, dodatek), a gotowe babeczki stoją w szklanej gablocie. Każdy element babeczki ma wersję dużą (na talerzu, szerokość babeczki 84 px) i `-mini` (w gablocie, szerokość 32 px); wszystkie warstwy jednej babeczki mają kotwicę w tym samym punkcie: środek spodu papilotki.

## `cukiernia/biszkopt.png`
71×33 px, kotwica (35, 51). Wierzch biszkoptu wystający z papilotki (warstwa bez kremu). ELIPSA(35, 16, 35, 16, O), potem ELIPSA(35, 16, 34, 15, `#f6d098`), potem pozioma linia O w wierszu 16 przez całą szerokość (cols 0..70) – brzeg papilotki dzielący elipsę na pół. Pojedyncze piksele O w (35, 0) i (35, 32) oraz piksel `#f6d098` w (35, 1) i (35, 31) wśród obrysu (czubki elips).

## `cukiernia/biszkopt-mini.png`
29×15 px, kotwica (14, 20). Mała wersja `cukiernia/biszkopt.png`: ELIPSA(14, 7, 14, 7, O), ELIPSA(14, 7, 13, 6, `#f6d098`), linia O w wierszu 7 cols 0..28.

## `cukiernia/gablota.png`
315×78 px, kotwica (0, 0). Szklana gablota na babeczki. BOX(0, 0, 315, 78, `#eef8ff`); półka `#d9ccf5` cols 2..312 × wiersze 69..74 (wiersz 75 znowu `#eef8ff`, wiersze 76..77 obrys). Odblask szyby: ukośna linia 12 pojedynczych białych pikseli `#ffffff` od (8, 18) do (19, 7) – piksel (8+i, 18−i) dla i = 0..11.

## `cukiernia/gwiazdka.png`
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

## `cukiernia/gwiazdka-mini.png`
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

## `cukiernia/krem-czekoladowy.png`
81×44 px, kotwica (40, 68). Krem na babeczkę: trzy piętra kremu (zawijas), z obrysem i białymi błyskami. Rodzina „krem” (kolejność): najpierw obrys O – ELIPSA(40, 30, 40, 13), ELIPSA(40, 19, 30, 11), ELIPSA(40, 9, 18, 9); potem kolor kremu – ELIPSA(40, 30, 39, 12), ELIPSA(40, 19, 29, 10), ELIPSA(40, 9, 17, 8); potem błyski `#ffffff` 2×1 px: cols 21..22 wiersz 25; cols 26..27 wiersz 15; cols 32..33 wiersz 6. Obrys zostaje tylko na zewnętrznej sylwetce (1 px, w załamaniach między piętrami 2–4 px poziomo), w wierszach 0 i 43 pojedynczy piksel O w col 40, a w wierszach 1 i 42 piksel koloru kremu w col 40 wśród obrysu. Kolor: `#d8b39c`.

## `cukiernia/krem-czekoladowy-mini.png`
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

## `cukiernia/krem-liliowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#d9ccf5`.

## `cukiernia/krem-liliowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#d9ccf5`.

## `cukiernia/krem-mietowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#bfe8d6`.

## `cukiernia/krem-mietowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#bfe8d6`.

## `cukiernia/krem-rozowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#f7b2cc`.

## `cukiernia/krem-rozowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#f7b2cc`.

## `cukiernia/krem-waniliowy.png`
81×44 px, kotwica (40, 68). Jak `cukiernia/krem-czekoladowy.png`, kolor `#fff1c9`.

## `cukiernia/krem-waniliowy-mini.png`
33×18 px, kotwica (16, 26). Jak `cukiernia/krem-czekoladowy-mini.png`, kolor `#fff1c9`.

## `cukiernia/lada-wzor.png`
72×8 px, kotwica (0, 0). Wzór powtarzany: front lady (powtarzany w poziomie i pionie). Cols 0..1 `#f0c2d6` (ciemniejsza szczelina między panelami), cols 2..71 `#f7d6e4`; wszystkie 8 wierszy jednakowe, więc w pionie łączy się bez szwu, a w poziomie co 72 px wychodzi pionowa ciemniejsza linia 2 px.

## `cukiernia/papilotka.png`
71×37 px, kotwica (35, 36). Papierowa papilotka babeczki – trapez szerszy u góry, w brzoskwiniowe pionowe prążki. Środek osi: col 35. Wiersz 0 i wiersz 36 to linie obrysu: wiersz 0 cols 0..70, wiersz 36 cols 9..61. Wiersze 1..35 (r = wiersz−1 = 0..34): half = round(33.6 − 0.24·r); O w col 35−half−1 i 35+half+1, wypełnienie `#ffd6b8` cols 35−half..35+half, a prążki `#f5c09a` (1 px) w cols 35−half+2, +4, +8 … (co 4 px) dopóki col < 35+half−1. Wartości half: wiersz 1 → 34, 2..5 → 33, 6..9 → 32, 10..13 → 31, 14..18 → 30, 19..22 → 29, 23..26 → 28, 27..30 → 27, 31..34 → 26, 35 → 25. Przykład wiersza 1: `OAABAAABAAAB…AAABAAO` (prążki w cols 3, 7, …, 67).

## `cukiernia/papilotka-mini.png`
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

## `cukiernia/posypka.png`
54×23 px, kotwica (25, 59). Kolorowa posypka na krem babeczki: 8 kresek 2×1 px na przezroczystym tle (lewy piksel kreski podany): (0, 21) `#f59bbd`; (43, 19) `#a6dcc4`; (18, 11) `#f6d98b`; (40, 7) `#c3b3ea`; (7, 9) `#f59bbd`; (27, 0) `#a6dcc4`; (52, 22) `#f6d98b`; (23, 19) `#c3b3ea`.

## `cukiernia/posypka-mini.png`
22×9 px, kotwica (10, 22). Mała posypka, 8 kresek 2×1 px: (0, 8) `#f59bbd`; (17, 7) `#a6dcc4`; (7, 4) `#f6d98b`; (16, 3) `#c3b3ea`; (3, 3) `#f59bbd`; (11, 0) `#a6dcc4`; (20, 8) `#f6d98b`; (9, 7) `#c3b3ea`.

## `cukiernia/serduszko.png`
28×24 px, kotwica (14, 86). Dodatek na babeczkę: różowe serduszko bez obrysu. SERCE(0, 0, 4, `#f59bbd`) – każda komórka wzoru 4×4 px.

## `cukiernia/serduszko-mini.png`
7×6 px, kotwica (3, 31). SERCE(0, 0, 1, `#f59bbd`) – wzór 1:1.

## `cukiernia/swieczka.png`
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

## `cukiernia/swieczka-mini.png`
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

## `cukiernia/talerz-na-babeczke.png`
93×15 px, kotwica (46, 7). Biały owalny talerz pod babeczką. ELIPSA(46, 7, 46, 7, O), potem ELIPSA(46, 7, 45, 6, `#ffffff`). Wiersze 0 i 14: pojedynczy piksel O w col 46; wiersze 1 i 13: O cols 22..70 z białym pikselem w col 46.

## `cukiernia/tapeta.png`
30×8 px, kotwica (0, 0). Wzór powtarzany: tapeta w pionowe pasy. Cols 0..14 `#fff1e6`, cols 15..29 `#ffe8ef`, wszystkie wiersze takie same; kafelkuje się w poziomie (pasy po 15 px na zmianę) i w pionie bez szwu.

## `cukiernia/truskawka.png`
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

## `cukiernia/truskawka-mini.png`
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

## `cukiernia/wisienka.png`
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

## `cukiernia/wisienka-mini.png`
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
