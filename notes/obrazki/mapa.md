# Obrazki: `docs/assets/gfx/mapa/`

Mapa z budynkami i drogami. 11 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Mapa świata (scena MapScene): trawa, drogi z domu i budynki miejsc.

## `mapa/chmurka-nieodkryte-miejsce.png`
65×39 px, kotwica (31, 20). Biała chmurka zasłaniająca jeszcze nieodkryte miejsce na mapie. Trzy koła i prostokąt, wszystko `#ffffff` z obrysem 1 px O (najpierw cały kształt powiększony o 1 px w O, potem biały): koło r=12 o środku (13, 25), koło r=16 o środku (32, 17), koło r=12 o środku (51, 24), prostokąt x3–57, y25–36 (obrys też wokół niego, dolna linia O w y37). Cień `#e6eefc` x3–57, y34–35.

## `mapa/cukiernia.png`
92×102 px, kotwica (46, 102). Cukiernia: kremowy budynek z daszkiem w paski, oknem z babeczką, lawendowymi drzwiami i babeczką-szyldem na dachu.
- Budynek: wypełnienie `#fff7fb` x1–90, y27–101, obrys O 1 px po bokach (x0, x91) i u góry (y26); bez dolnej linii.
- Dach `#bfe8d6` y27–36; linia O w y37 (x0–91).
- Markiza: kolumny x1–90 w paski po 11 px na zmianę `#f7b2cc` (x1–11, 23–33, 45–55, 67–77, 89–90) i `#ffffff` (x12–22, 34–44, 56–66, 78–88), od y38 w dół 12 px + falbanka: kolumna wydłużona o round(|sin(π·i/11)|·2) px (i = 0…89), więc w środku każdego paska do y51.
- Okno: pudełko x4–41, y54–98, `#cfe8ff`, obramowanie O. W nim babeczka (środek x23, spód y96, szer. 21): papilotka `#ffd6b8` z fałdami `#f5c09a` co 4 px i obrysem O (trapez ok. x15–31, y88–96), krem `#f7b2cc` z trzech elips z obrysem (szersza na dole), białe odblaski 2×1, na czubku wisienka `#f28aa5` z obrysem i ogonkiem `#7fc49e` (y73–80).
- Drzwi: x63–87, y53–101 – obrys O 1 px, wnętrze `#c3b3ea` x64–86, y54–101; klamka `#f6d98b` 2×2 x84–85, y78–79.
- Szyld: babeczka (środek x46, spód y29, szer. 27) wychodząca ponad dach: papilotka `#ffd6b8` z fałdami `#f5c09a` (y21–28, obrys O), krem lawendowy `#d9ccf5` z trzech elips z obrysem (y8–20), posypka 2×1 w `#f59bbd`, `#a6dcc4`, `#f6d98b`, `#c3b3ea`, białe odblaski, wisienka `#f28aa5` (y3–8) z ogonkiem `#7fc49e` do y0.

## `mapa/dentysta.png`
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

## `mapa/dom-postaci.png`
52×55 px, kotwica (26, 60). Dom postaci (start na mapie): brzoskwiniowy domek z różowym dachem. Dach: trójkąt w rzędach y0–25, w rzędzie r szerokość 2(r+1) wycentrowana na x=25,5 (rząd 0: x25–26, rząd 24: x1–50); rzędy 0 i 25 w O (rząd 25 pełny x0–51), reszta `#f7b2cc` (bez obrysu boków). Ściany `#ffe1c4` x3–48, y26–53 z obrysem O 1 px po bokach (x2, x49) i na dole (y54). Okna `#cfe8ff` 8×8 bez obrysu: x5–12 i x39–46, y28–35. Drzwi `#c3b3ea` x20–31, y37–53.

## `mapa/domek-gabi.png`
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

## `mapa/drogi-z-domu.png`
463×270 px, kotwica (−22, −128). Wszystkie drogi z domu do miejsc na mapie (jedna warstwa). Piksel obrazka (x, y) = punkt sceny (x+22, y+128). Każda droga to krzywa Catmull-Rom (Phaser Spline) przez punkty sceny, od domu (86, 315):
- szpital: (243, 324), (356, 251), (432, 161);
- cukiernia: (216, 385), (346, 373), (454, 363);
- dentysta: (54, 227), (108, 170), (162, 145);
- pracownia: (162, 243), (243, 182), (302, 137);
- szkoła: (32, 235), (54, 181);
- domek Gabi: (243, 324), (367, 275), (475, 258).
Na krzywej punkty co ok. 2 px (getSpacedPoints, liczba = długość/2). Dla każdej drogi po kolei: w każdym punkcie koło r=9 `#e8cc9e` (brzeg), potem w każdym punkcie koło r=8 `#f6e3c4` (nawierzchnia), potem co 6. punkt kropka 2×2 `#fff7e0` w (x−1, y−1). Drogi rysowane jedna po drugiej w podanej kolejności, więc brzeg późniejszej drogi kładzie się na nawierzchnię wcześniejszej tam, gdzie się krzyżują. Droga ma 19 px szerokości, brzeg 1 px.

## `mapa/drzewko.png`
27×33 px, kotwica (13, 33). Drzewko – ozdoba mapy. Pień `#d8b39c` 3 px x12–14, y23–32 (u góry przykryty koroną). Korona: koło r=13 w O, koło r=12 `#a6dcc4`, środek (13, 13). Jaśniejsza plama: koło r=5 `#bfe8d6` o środku (11, 11).

## `mapa/pracownia.png`
92×96 px, kotwica (46, 96). Pracownia plastyczna na mapie: kremowy budynek z tęczową markizą, oknem ze sztalugą, różowymi drzwiami i paletą-szyldem.
- Budynek: `#fff7fb` x1–90, y21–95, obrys O 1 px po bokach (x0, x91) i u góry (y20); bez dołu.
- Dach `#d9ccf5` y21–31.
- Markiza y32–42: pasy po 15 px `#f28aa5` (x1–15), `#ffc08a` (16–30), `#fff09a` (31–45), `#7fcf9a` (46–60), `#9fd0f5` (61–75), `#c3b3ea` (76–90); linia O w y43 (x0–91).
- Okno: pudełko x4–44, y47–92, `#cfe8ff`. Sztaluga-obrazek: prostokąt O x16–33, y51–73, wnętrze `#ffffff` x17–32, y52–72; kropki farby: koło r=2 `#f28aa5` o środku (23, 59) i koło r=2 `#9fd0f5` o środku (28, 61).
- Drzwi: obrys O x64–87, y46–95 (bez dołu), wnętrze `#f7b2cc` x65–86, y47–95.
- Szyld-paleta (ponad dachem): elipsa `#f3dcc4` o środku (46, 15), półosie 17×14, z obrysem O 1 px (elipsa 18×15); otwór na kciuk: koło r=4 O, w nim r=3 `#fff7fb`, środek (54, 20). Plamy farby – koła r=3 bez obrysu: `#f28aa5` (38, 14), `#fff09a` (43, 9), `#9fd0f5` (50, 9), `#7fcf9a` (40, 21), `#c3b3ea` (55, 14).

## `mapa/szkola.png`
86×74 px, kotwica (43, 73). Szkoła: żółty budynek pod lawendowym trójkątnym dachem z zegarem.
- Ściany `#fff1c9` x4–81, y28–69; dół `#f6d98b` y70–72; obrys O 1 px: kolumny x3 i x82 (y28–73), rząd y73, oraz rząd y27 na całą szerokość x0–85 (to dół dachu).
- Dach: trójkąt `#d9ccf5` od (0, 27) przez szczyt (43, 0) do (86, 27); obrys O tylko w pojedynczych pikselach na skosach (obrys = trójkąt większy o 1 px, prawie cały przykryty), szczyt O x42–43, y0.
- Zegar: koło r=8 w O, r=7 `#ffffff`, środek (43, 17); wskazówki O: pionowa x43, y11–17, pozioma x43–48, y17.
- Drzwi: obrys O x34–51, y47–73, wnętrze `#f59bbd` x35–50, y48–72 (zachodzi na pas `#f6d98b`).
- Cztery okna – pudełka 11×11 `#cfe8ff` z obramowaniem O i pionowym szczeblem O w środku (x+5): x11–21, x25–35, x50–60, x64–74, y43–53.

## `mapa/szpital.png`
98×82 px, kotwica (49, 82). Szpital: biały budynek z lawendowym dachem i szyldem z różowym krzyżem.
- Budynek: obrys O 1 px – rząd y0 (x0–97), kolumny x0 i x97; bez dołu; wnętrze `#ffffff` x1–96, y1–81.
- Dach `#d9ccf5` y1–12, linia `#c3b3ea` w y13.
- Szyld: obrys O x33–65, y16–48, wnętrze `#fff7fb` x34–64, y17–47. Krzyż `#f59bbd`: pionowe ramię x45–52, y21–43; poziome x38–60, y29–36.
- Okna `#cfe8ff` 12×12 bez obrysu: x4–15 i x82–93, y27–38.
- Drzwi: obrys O x37–61, y57–81 (bez dołu), wnętrze `#cfe8ff` x38–60, y58–81, biała `#ffffff` szpara 1 px w x49.

## `mapa/trawa.png`
240×240 px, kotwica (0, 0). Trawa mapy – wzór powtarzany. Tło `#d4f2e4`. Jaśniejsze plamy `#e2f7ec` – koła (środek x, y, promień): (155, 217, 12), (24, 54, 18), (46, 78, 19), (81, 148, 19), (228, 124, 12), (108, 106, 16). Kwiatki – kwadraty 2×2 (lewy górny róg):
- `#fff1c9`: (194,28) (129,142) (207,20) (183,189) (49,120) (198,81) (233,116) (172,60) (86,73)
- `#ffffff`: (9,75) (9,14) (152,205) (184,195) (98,42) (22,205) (151,20) (146,135) (202,203) (15,183) (174,80)
- `#d9ccf5`: (176,89) (161,72) (113,178) (172,222) (8,18) (163,113) (107,169) (134,223) (67,68)
- `#f7b2cc`: (90,121) (172,42) (110,200) (140,109) (88,156) (24,232) (92,152) (122,68) (36,216)
Wszystko rysowane „zawinięte”: każdą plamę i kwiatek powtórz przesunięte o ±240 w poziomie i pionie, żeby to, co wystaje za brzeg, pojawiło się z drugiej strony – kafelek łączy się bez szwu (np. plama (228,124) wystaje z lewej strony w x0–1).
