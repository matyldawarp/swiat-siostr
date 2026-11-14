# Obrazki: `docs/assets/gfx/kuchnia-lakotka/`

Kuchnia Łakotka w domku Gabi. 28 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Kuchnia w domku Gabi (scena GabiKitchenScene): kuchenka z okapem-kotkiem, szafka z tortem, lodówka-kotek i Łakotek – kotek-babeczka.

## `kuchnia-lakotka/babeczka.png`
21×22 px, kotwica (10, 13). Babeczka, która leci do postaci po upieczeniu. Kopułka kremu: koło r=10 w O o środku (10, 10), na nim koło r=9 w `#f59bd0`. Pod nią papilotka: prostokąt O x0–20, y12–21 (pod kołem), wnętrze `#c8b4f0` x2–18, y13–20 – widoczne tylko po bokach (rzędy 15–20), bo różowe koło je zakrywa w środku. Na kremie biały odblask 2×2 px x7–8, y5–6. Dół: pełny rząd O w y21 (x1–19).

## `kuchnia-lakotka/blacha-z-babeczkami.png`
78×29 px, kotwica (39, 29). Blacha z trzema babeczkami stojąca na kuchence. Blacha: pudełko 78×9 (x0–77, y20–28), wypełnienie `#c8b4f0`, obramowanie O. Trzy babeczki jak `babeczka.png` (kopułka r=9 `#f59bd0` z obrysem r=10, papilotka `#c8b4f0` z obrysem, odblask biały 2×2), środki kopułek x=15, 39, 63, y=10; prostokąty papilotek x(cx−9)–(cx+9), y12–22, ich dół wtapia się w blachę. Odblaski w y5–6, x(cx−3)–(cx−2).

## `kuchnia-lakotka/blat-szafki.png`
123×14 px, kotwica (0, 0). Biały blat nad szafką. Pudełko 123×14, wypełnienie `#ffffff`, obramowanie O 2 px, ścięte rogi.

## `kuchnia-lakotka/kawalek-tortu.png`
24×24 px, kotwica (11, 12). Kawałek tortu (trójkąt) – nagroda w kuchni. Biały `#ffffff` trójkąt prostokątny o wierzchołkach ok. (0, 22), (21, 22), (21, 5): przeciwprostokątna schodkami z lewego dołu do prawej góry. Obrys O tylko z prawej (kolumna x22, y6–22) i z dołu (rząd y23, x0–22); skos bez obrysu. Różowy pas kremu `#f59bd0` x9–20, y15–17. Na czubku wisienka `#f26a8a`: koło r=3 o środku (20, 3) (y0–6, x17–23), bez obrysu.

## `kuchnia-lakotka/kuchenka-z-piekarnikiem.png`
120×138 px, kotwica (0, 45). Kuchenka: tylna ścianka z trzema kocimi główkami, płyta z palnikami i miętowy korpus z piekarnikiem (szybka to osobny obrazek). Od góry:
1. Ścianka: pudełko x6–113, y0–47, wypełnienie `#e4e6f0`, obramowanie O. Na niej trzy kocie główki o środkach (27, 18), (60, 18), (93, 18): koło r=11 w `#c8cbdc` plus dwa trójkątne uszy w `#c8cbdc` (dla ucha lewego wierzchołki (cx−11, cy−2,2), (cx−8,8, cy−16,5), (cx−1,1, cy−8,8); prawe lustrzane), potem w środku koło r=8 w `#e4e6f0` – zostaje szary pierścień grubości 3 px z uszami, bez obrysu O.
2. Płyta: pudełko x0–119, y45–62, wypełnienie `#e4e6f0`. Trzy palniki o środkach (27, 54), (60, 54), (93, 54): koło r=5 w O, w nim koło r=3 `#c8cbdc`.
3. Korpus: pudełko x0–119, y62–137 (zachodzi 1 rząd na płytę), wypełnienie `#9fe6d4`. Uchwyt-pasek `#7fd2c0` x12–107, y69–73.

## `kuchnia-lakotka/lakotek-kotek-babeczka.png`
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

## `kuchnia-lakotka/lodowka.png`
108×222 px, kotwica (0, 0). Zamknięta lodówka z kocią buźką. Pudełko x0–107, y0–221, wypełnienie `#9fe6d4`, obramowanie O. Podział drzwi: linia O 1 px x2–105, y138. Buźka i detale w `#7fd2c0` (bez obrysu): oczy – kreski 12×3 x30–41 i x66–77, y56–58; nosek 6×3 x51–56, y65–67; pyszczek 12×1 x48–59, y71; wąsy po 2 z każdej strony, 12×1: x15–26 i x81–92 w rzędach y68 i y74; pionowy uchwyt górnych drzwi 5×24 x12–16, y101–124; poziomy uchwyt dolnych drzwi 21×5 x12–32, y153–157.

## `kuchnia-lakotka/lodowka-otwarta.png`
108×222 px, kotwica (0, 0). Lodówka z otwartą górną komorą. Korpus jak w `lodowka.png` (pudełko `#9fe6d4`, linia podziału O w y138, dolny uchwyt `#7fd2c0` x12–32, y153–157), bez buźki i górnego uchwytu. Wnętrze: pudełko x8–100, y8–133, wypełnienie `#ffffff`, obramowanie O. Półki `#c8cbdc` 2 px: x9–98, y62–63 i y110–111. Na górnej półce: butelka – pudełko x24–38, y35–61, wypełnienie `#eaf4ff`; truskawka jak `truskawka.png` o środku (75, 51). Na dolnej półce: pudełko x42–65, y92–109, wypełnienie `#c3b3ea`.

## `kuchnia-lakotka/lodowka-uszy.png`
110×35 px, kotwica (55, 19). Dwa kocie uszy sterczące nad lodówką. Dwa trójkąty `#9fe6d4` z obrysem (grow 1,5): lewy o wierzchołkach (1, 34), (9,6, 1), (42, 21), prawy lustrzany (109, 34), (100,4, 1), (68, 21). Między uszami pusto.

## `kuchnia-lakotka/lopatka.png`
15×30 px, kotwica (8, 0). Łopatka wisząca na relingu. Uchwyt: pionowa kreska O 2 px x7–8, y0–14. Pod nią pudełko 15×15 (x0–14, y15–29), wypełnienie `#9fe6d4`, obramowanie O.

## `kuchnia-lakotka/okap.png`
108×91 px, kotwica (54, 48). Okap w kształcie kociej głowy nad kuchenką (oczy i nosek to osobne obrazki). Komin: pionowy pas x39–68, y0–47 – kolumny x39 i x68 w O, środek x40–67 `#e4e6f0`. Uszy: trójkąty `#c4f2e6` z obrysem: lewy (10, 50), (16, 36), (33, 50), prawy lustrzany (98, 50), (92, 36), (75, 50). Korpus: trapez `#c4f2e6` z obrysem (grow 1,5), górna krawędź x22,5–85,5 w y48, dolna x1,5–106,5 w y90; boki to schodki co 2 rzędy, obrys 1–2 px. Dół: pasek `#f7a6c8` x1–106, y84–89 (przykrywa obrys boków), pod nim rząd O y90.

## `kuchnia-lakotka/okap-buzia-patrzy.png`
36×13 px, kotwica (18, 3). Buzia okapu, gdy patrzy. Dwa kwadratowe oczy O 6×6: x0–5 i x30–35, y0–5. Nosek `#f59bbd` 6×3: x15–20, y10–12.

## `kuchnia-lakotka/okap-buzia-spi.png`
39×10 px, kotwica (20, 0). Buzia okapu, gdy śpi. Zamknięte oczy – poziome kreski O 9×2: x0–8 i x30–38, y0–1. Nosek `#f59bbd` 6×3: x17–22, y7–9.

## `kuchnia-lakotka/para-duza.png`
19×19 px, kotwica (9, 9). Większy kłębek pary z garnka. Koło r=9 o środku (9, 9), kolor `#ffffff` z alfą 90% (w pliku 229/255), bez obrysu.

## `kuchnia-lakotka/para-mala.png`
13×13 px, kotwica (6, 6). Mniejszy kłębek pary: jak `para-duza.png`, ale koło r=6 o środku (6, 6).

## `kuchnia-lakotka/patelnia-fioletowa.png`
27×41 px, kotwica (13, 0). Patelnia wisząca na relingu (widok z góry, okrągła). Uchwyt: kreska O 2 px x12–13, y0–14. Patelnia: koło r=13 w O o środku (13, 27), na nim koło r=12 `#c3b3ea`.

## `kuchnia-lakotka/patelnia-szara.png`
27×41 px, kotwica (13, 0). Jak `patelnia-fioletowa.png`, ale wnętrze patelni `#c8cbdc`.

## `kuchnia-lakotka/podloga.png`
8×27 px, kotwica (0, 0). Podłoga kuchni – wzór powtarzany. Całość `#fff8ea`, jedna pozioma linia `#f0e4cc` przez całą szerokość w y21. Powtarzana w poziomie i pionie bez szwu (linie co 27 px).

## `kuchnia-lakotka/polka-z-kwiatkiem-i-kubkiem.png`
120×50 px, kotwica (60, 34). Półka na ścianie z doniczką i kubkiem-kotkiem. Półka: pudełko x0–119, y34–42, wypełnienie `#f7a6c8`. Doniczka: pudełko x15–32, y19–33, wypełnienie `#ffffff`. Łodyżka `#7fcf9a` 2 px x22–23, y7–18; dwa listki – koła `#7fcf9a` r=5 o środkach (18, 7) i (30, 5), bez obrysu. Kubek-kotek: koło r=9 `#f7c6e0` o środku (99, 23) z uszami (trójkąty `#f7c6e0`: (90, 21), (92, 9,5), (98, 16), prawe lustrzane względem x=99), w środku koło r=6 `#e4e6f0`; oczy O 2×2 w (95–96, 23–24) i (102–103, 23–24); bez obrysu sylwetki. Pod półką szyna `#c8cbdc` x9–110, y48–49.

## `kuchnia-lakotka/szafka.png`
114×81 px, kotwica (0, 0). Zamknięta szafka pod blatem, dwoje drzwiczek. Dwa pudełka `#f7a6c8` z obramowaniem O: x0–56 i x57–113, y0–80. W każdym płycina `#ee8fb8`: x8–49 i x65–106, y8–73. Uchwyty O 3×9: x46–48 i x65–67, y32–40.

## `kuchnia-lakotka/szafka-otwarta.png`
114×81 px, kotwica (0, 0). Otwarta szafka z pudełkami. Pudełko x0–113, y0–80, wypełnienie `#fbe4ef`. Półka – linia O 1 px x2–111, y45. Cztery pudełka z obramowaniem O: lewa kolumna `#d9b4f5`, prawa `#f59bd0`; górne x17–49 / x63–95, y24–44 (33×21); dolne x17–49 / x63–95, y57–76 (33×20).

## `kuchnia-lakotka/szybka-piekarnika.png`
96×36 px, kotwica (0, 0). Szybka piekarnika (zimny). Pudełko 96×36, wypełnienie `#7fd2c0`, obramowanie O. Trzy koła r=6 `#9fe6d4` (bez obrysu) o środkach (27, 21), (48, 21), (69, 21).

## `kuchnia-lakotka/szybka-piekarnika-goraca.png`
96×36 px, kotwica (0, 0). Szybka piekarnika w trakcie pieczenia. Jak `szybka-piekarnika.png`, ale wypełnienie `#ffd9a0`, koła `#f0b878`.

## `kuchnia-lakotka/tapeta.png`
84×84 px, kotwica (0, 0). Tapeta kuchni – wzór powtarzany: tło `#fbeee0` z sześcioma kreskami posypki, wszystkie w całości wewnątrz kafelka (łączy się bez szwu). Kreski: `#fff09a` pionowa 2×6 w (43, 9); `#ffc08a` pozioma 6×2 w (34, 39); `#f28aa5` pionowa 2×6 w (68, 45); `#fff09a` pozioma 6×2 w (22, 60); `#7fcf9a` pionowa 2×6 w (5, 38); `#ffc08a` pozioma 6×2 w (52, 12) (podano lewy górny róg).

## `kuchnia-lakotka/tort-pietrowy.png`
69×56 px, kotwica (35, 56). Dwupiętrowy tort na blacie. Dwa pudełka `#ffffff` z obramowaniem O: dolne x0–68, y26–55; górne x9–59, y0–26 (dolny rząd górnego i górny rząd dolnego zlewają się w podwójną linię O w y25–27). Na każdym piętrze: pas lukru `#f59bd0` od 2 px pod górą przez 8 rzędów (górne y2–9, dolne y28–35) na całą szerokość wnętrza, pod nim zacieki – kwadraty 3×3 `#f59bd0` co 8 px (górne: x12, 20, 28, 36, 44, 52 w y10–12; dolne: x3, 11, … 59 w y36–38). Posypka – kreski 5×2: dolne piętro `#f28aa5` x8, `#fff09a` x22, `#9fd0f5` x36 w y41–42 oraz `#ffc08a` x15, `#7fcf9a` x29, `#c3b3ea` x43 w y46–47; górne piętro te same kolory w x17, 31, 45 (y15–16) i x24, 38, 52 (y20–21).

## `kuchnia-lakotka/truskawka.png`
21×21 px, kotwica (10, 10). Truskawka (w lodówce i jako dodatek). Koło r=10 w O, koło r=9 `#f26a8a`, środek (10, 10). Szypułka: prostokąt `#7fcf9a` x4–15, y0–2 (bez obrysu, przykrywa górę koła). Pestki – pojedyncze piksele `#fff09a`: (13, 9), (7, 10), (15, 13), (6, 15), (10, 15).

## `kuchnia-lakotka/uszko-opaski.png`
32×20 px, kotwica (25, 1). Kocie uszko na miętowej opasce (gra je obraca/ustawia przy opasce). Trójkąt `#9fe6d4` z obrysem (grow 1,5) skierowany czubkiem w dół: wierzchołki (1, 1), (31, 1), (16, 19); górna krawędź – pełny rząd O w y0, boki ze schodkami O 1 px, czubek O w y18–19.

## `kuchnia-lakotka/wisienka.png`
13×13 px, kotwica (6, 6). Wisienka na tort (licznik wisienek). Koło r=6 w O, koło r=5 `#f26a8a`, środek (6, 6). Biały odblask 1 px w (5, 3).
