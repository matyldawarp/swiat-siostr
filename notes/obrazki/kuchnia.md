# Obrazki: `docs/assets/gfx/kuchnia/`

Kuchnia z pieczeniem tortu: składniki, miska, piekarnik, szafki, okno. 26 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Ekran kuchni (KitchenScene): dzieci wrzucają składniki do miski, mieszają, pieką ciasto w piekarniku i dekorują tort ulubionej postaci (lukier, posypka, dodatek), a potem postać zjada go kęs po kęsie.

## `kuchnia/cukier.png`
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

## `kuchnia/drzwiczki-szafki.png`
84×59 px, kotwica (0, 0). Drzwiczki szafki pod blatem. BOX(0, 0, 84, 59, `#d4f2e4`) (miętowe wypełnienie cols 2..81, wiersze 2..56). Uchwyt: prostokąt `#c3b3ea` cols 33..50, wiersze 9..13 (18×5 px), bez obrysu.

## `kuchnia/forma-do-ciasta.png`
48×12 px, kotwica (24, 6). Forma z ciastem lecąca do piekarnika. Cały prostokąt 48×12 w kolorze O; na nim wypełnienie `#ffe3a3` cols 1..46, wiersze 1..8. Wiersze 9..11 zostają całe w O (gruby spód formy), wiersz 0 oraz kolumny 0 i 47 to obrys 1 px. Rogi nie są ścięte.

## `kuchnia/jajko.png`
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

## `kuchnia/kafelki.png`
24×24 px, kotwica (0, 0). Wzór powtarzany: szachownica kafelków nad blatem, kafelek 12×12 px, kolory `#ffffff` i `#ffe1ec`. Szachownica jest przesunięta w pionie o 3 px: wiersze 0..2 – lewa połowa (cols 0..11) biała, prawa (12..23) różowa; wiersze 3..14 – lewa różowa, prawa biała; wiersze 15..23 – lewa biała, prawa różowa. Obrazek kładzie się obok siebie i jeden pod drugim bez szwu (wiersze 15..23 łączą się z wierszami 0..2 następnej kopii w pełny kafelek 12 px).

## `kuchnia/kleks-cukier.png`
11×11 px, kotwica (5, 5). Kleks składnika w misce, bez obrysu. Rodzina „kleks”: KOŁO(5, 5, 5) – szerokości wierszy od góry: 1, 7, 9, 11, 11, 11, 11, 11, 9, 7, 1 (wyśrodkowane). Kolor cukru: `#fff7f0`.

## `kuchnia/kleks-jajko.png`
11×11 px, kotwica (5, 5). Jak `kuchnia/kleks-cukier.png`, kolor żółtka `#ffd86b`.

## `kuchnia/kleks-maka.png`
11×11 px, kotwica (5, 5). Jak `kuchnia/kleks-cukier.png`, kolor `#ffffff`.

## `kuchnia/kleks-mleko.png`
11×11 px, kotwica (5, 5). Jak `kuchnia/kleks-cukier.png`, kolor `#e4f1ff`.

## `kuchnia/kratka-postepu.png`
10×10 px, kotwica (1, 1). Pusta kratka paska postępu (ile kroków przepisu zrobione). Kwadrat 10×10: obrys O 1 px dookoła (bez ściętych rogów), środek 8×8 (cols 1..8, wiersze 1..8) biały `#ffffff`.

## `kuchnia/kratka-postepu-pelna.png`
10×10 px, kotwica (1, 1). Jak `kuchnia/kratka-postepu.png`, środek 8×8 różowy `#f59bbd` (krok zrobiony).

## `kuchnia/maka.png`
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

## `kuchnia/miska.png`
93×47 px, kotwica (46, 46). Niebieska miska na blacie, widziana lekko z góry (owalny otwór). Kolejność (cx = 46, brzeg w wierszu 10):
1. Brzuch – obrys O: dla dy = 0..36: half = round(46·√(1 − (dy/37)²)), wiersz 10+dy, cols 46−half..46+half.
2. Brzuch – wypełnienie `#cfe8ff`: dla dy = 1..35: half = round(45·√(1 − (dy/36)²)) − 1, wiersz 10+dy, cols 46−half..46+half.
3. Błysk `#ffffff`: cols 19..21, wiersze 19..26.
4. ELIPSA(46, 10, 46, 10, O) – brzeg otworu.
5. ELIPSA(46, 10, 44, 8, `#b9d9f5`) – wnętrze miski.
Wychodzi: na dole obrys 2–3 px grubości po skosach, ostatni wiersz 46 to O cols 35..57; pojedynczy piksel O w (46, 0) i jasny piksel wnętrza w (46, 2) w linii obrysu, podobnie na dole elipsy: wiersz 18 ma piksel `#b9d9f5` w col 46 wśród O, a wiersz 20 ma pojedynczy piksel O w col 46 na tle `#cfe8ff`.

## `kuchnia/miska-ciasto.png`
89×17 px, kotwica (44, 44). Surowe ciasto w misce (kładzione na otwór miski). ELIPSA(44, 8, 44, 8, `#fff1c9`), bez obrysu. Szerokości wierszy od góry: 1, 43, 59, 69, 77, 83, 87, 89, 89, 89, 87, 83, 77, 69, 59, 43, 1 (wyśrodkowane).

## `kuchnia/miska-ciasto-wymieszane.png`
89×17 px, kotwica (44, 44). Wymieszane ciasto: ta sama elipsa co `kuchnia/miska-ciasto.png`, ale w kolorze `#ffe3a3`, plus trzy poziome smugi `#f6d098` 1 px wysokości: wiersz 6 cols 47..60; wiersz 8 cols 29..40; wiersz 10 cols 38..52.

## `kuchnia/mleko.png`
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

## `kuchnia/okno-z-polka.png`
102×81 px, kotwica (6, 0). Okno kuchni z chmurką oraz półka z różowym serduszkiem pod oknem. Kolejność:
1. BOX(6, 0, 90, 63, `#cfe8ff`) – szyba (niebo cols 8..93, wiersze 2..60).
2. Chmurka: najpierw obrys O – KOŁO(45, 35, 8), KOŁO(57, 30, 10), KOŁO(68, 34, 8) i prostokąt cols 39..73 × wiersze 35..41; potem biel `#ffffff` – KOŁO(45, 35, 7), KOŁO(57, 30, 9), KOŁO(68, 34, 7) i prostokąt cols 40..72 × wiersze 35..40; potem cień `#e6eefc` cols 40..72 × wiersze 40..41.
3. Szprosa: biały pasek `#ffffff` cols 50..51, wiersze 2..60 (przechodzi też przez chmurkę).
4. Półka: pasek O cols 0..101, wiersze 78..80.
5. Serce: SERCE(41, 60, 3, `#f59bbd`) – cols 41..61, wiersze 60..77; górne „uszy” serca zachodzą na dolną ramę okna (wiersze 60..62), w przerwie między nimi (cols 50..52) widać ramę/szybę.

## `kuchnia/piekarnik.png`
96×81 px, kotwica (48, 81). Biały piekarnik stojący na blacie (kotwica = środek dolnej krawędzi). BOX(0, 0, 96, 81, `#f7f9ff`). Panel sterowania `#d9ccf5` cols 2..93, wiersze 2..15. Dwa pokrętła O: KOŁO(15, 9, 3) i KOŁO(81, 9, 3) (szerokości wierszy 1, 5, 7, 7, 7, 5, 1 w wierszach 6..12). Uchwyt drzwiczek: pasek O cols 12..83, wiersze 21..22. Reszta korpusu `#f7f9ff` (szybkę dokłada osobny obrazek `kuchnia/szybka-piekarnika*.png`).

## `kuchnia/posypka-na-torcie.png`
78×5 px, kotwica (40, 39). Kolorowa posypka na wierzchu tortu (kładziona na lukier). 20 kresek 2×1 px: kreska i (i = 0..19) leży w cols 4i..4i+1, w wierszu 2·(i mod 3) (czyli 0, 2, 4, 0, 2, 4, …), kolor cyklicznie: `#a6dcc4`, `#f6d98b`, `#c3b3ea`, `#ffffff` (i mod 4 = 0, 1, 2, 3). Reszta przezroczysta.

## `kuchnia/posypka-na-torcie-kes-1.png`
50×5 px, kotwica (40, 39). Jak `kuchnia/posypka-na-torcie.png`, ale tylko kreski i = 0..12 (cols 0..49).

## `kuchnia/posypka-na-torcie-kes-2.png`
22×5 px, kotwica (40, 39). Jak `kuchnia/posypka-na-torcie.png`, ale tylko kreski i = 0..5 (cols 0..21).

## `kuchnia/szybka-piekarnika.png`
72×43 px, kotwica (0, 0). Szybka w drzwiczkach piekarnika, pusta. BOX(0, 0, 72, 43, `#c3b3ea`).

## `kuchnia/szybka-piekarnika-z-forma.png`
72×43 px, kotwica (0, 0). Szybka z formą ciasta w środku. BOX(0, 0, 72, 43, `#c3b3ea`); forma: prostokąt O cols 9..62 × wiersze 29..37, na nim ciasto `#ffe3a3` cols 10..61 × wiersze 30..35 (wiersze 36..37 zostają O – gruby spód).

## `kuchnia/szybka-piekarnika-z-forma-goraca.png`
72×43 px, kotwica (0, 0). Piekarnik grzeje: jak `kuchnia/szybka-piekarnika-z-forma.png`, ale wypełnienie szybki `#ffd6b8` (ciepłe światło), a ciasto w formie `#f6d098` (upieczone).

## `kuchnia/talerzyk-pusty.png`
106×7 px, kotwica (53, 6). Pusty talerzyk po zjedzeniu tortu. Prostokąt 106×7 w O, środek `#ffffff` cols 1..104 × wiersze 1..5 (obrys 1 px, rogi nieścięte).

## `kuchnia/trzepaczka.png`
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
