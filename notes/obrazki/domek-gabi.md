# Obrazki: `docs/assets/gfx/domek-gabi/`

Domek Gabi przed wejściem i kociwinda między pokojami. 22 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Ekran z domkiem Gabi (scena GabiHouseScene): duży domek-kotek, którego okna, oczy, nosek i drzwi są osobnymi obrazkami, wzgórza i kwiatki w tle.
Winda-kotek łącząca pokoje domku Gabi (ui/catElevator.js).

## `domek-gabi/domek-bez-okien.png`
313×334 px, kotwica (156, 334). Domek Gabi: różowy dach-kocia głowa z uszami, miętowe trzy piętra, bez okien, oczu, noska i drzwi (te kładzie scena). Oś pionowa x=156. Od tyłu:
1. Uszy (pod dachem), trójkąty z obrysem: lewe `#d9bdf5` (36, 67), (70,5, 1), (127,5, 35); prawe `#ffe1d0` (276, 67), (241,5, 1), (184,5, 35). W prawym uchu okienko `#f59bd0` x224–240, y18–44, przecięte pionową kreską `#ffe1d0` 1 px w x233.
2. Dach-kopuła y34–127: w każdym rzędzie y półszerokość h(y) = round(142,5 · (1 − ((128−y)/94)^2,5)^0,4); kolor od x156−h do x155+h, po 1 px O z obu stron; nad najwyższym rzędem linia O w y33 szerokości 2·h(35). Przykładowe h: y39 → 63, y44 → 81, y54 → 104, y64 → 118, y74 → 127, y127 → 142. Kolor `#f8bfe6` w rzędach y34–52, niżej `#f2a6dc`.
3. Dachówki: kreski `#e892cf` 8×1 co 23 px w rzędach y57, 75, 93, 111, od x156−(h−2) (+12 w rzędach 57, 93, 111) do x156+h−2.
4. Wąsy `#c3b3ea` 29×2 wystające poza krawędź dachu (wycentrowane na krawędzi): x4–32 i x280–308 w y95–96; x0–28 i x284–312 w y112–113.
5. Gzyms: pudełko x28–284, y128–144, `#ffe1d0`. Ściany: pudełko x45–266, y145–320, `#c4eee2`. Podmurówka: pudełko x36–274, y321–333, `#ffe1d0`. Wszystko z obramowaniem O.
6. Stropy: pasy `#ffe1d0` 5 px na całą szerokość ścian (x45–266, przez obramowanie) w y204–208 i y262–266.
7. Daszek nad drzwiami – śpiąca kocia główka `#f59bd0`: półkole r=29 (obrys O r=30) o środku (156, 284), rysowane w górę (y254–284, x126–186); uszy trójkąty `#f59bd0` z obrysem (130, 272), (134, 249), (150, 264) i lustrzane; zamknięte oczka – kreski O 10×1 x136–145 i x166–175, y269.

## `domek-gabi/drzwi.png`
44×36 px, kotwica (0, 0). Zamknięte drzwi domku. Pudełko 44×36, wypełnienie `#9fd0f5`, obramowanie O; pionowa szpara O 1 px x22, y1–35.

## `domek-gabi/drzwi-otwarte.png`
44×36 px, kotwica (0, 0). Otwarte drzwi: pudełko 44×36, wypełnienie `#fff1c9` (ciepłe światło), obramowanie O; z lewej uchylone skrzydło `#9fd0f5` x2–9, y2–34.

## `domek-gabi/kwiatki-wzor.png`
84×42 px, kotwica (0, 0). Kwiatki na trawniku – wzór powtarzany (prawie przezroczysty kafelek). Cztery kwadraty 2×2: `#d9ccf5` w (74, 11), `#f7b2cc` w (18, 30) i (26, 32), `#fff1c9` w (50, 33) (lewy górny róg); reszta przezroczysta. Kwiatki nie dotykają brzegów, kafelki łączą się bez szwu.

## `domek-gabi/nosek.png`
28×24 px, kotwica (14, 12). Nosek-serduszko domku. Serce `#f59bbd` z bloków 4×4 według siatki 7×6:
```
.PP.PP.
PPPPPPP
PPPPPPP
.PPPPP.
..PPP..
...P...
```

## `domek-gabi/okno-fioletowe.png`
58×34 px, kotwica (0, 0). Okno domku (zgaszone). Pudełko 58×34, wypełnienie `#d8b4f5`, obramowanie O; pionowy szczebel O 1 px w x29, y1–33; dwa białe `#ffffff` odblaski 1×9 w x2 i x31, y2–10.

## `domek-gabi/okno-fioletowe-swieci.png`
70×46 px, kotwica (6, 6). To samo okno zapalone, z kotkiem w środku i poświatą. Tło: cały prostokąt 70×46 w kolorze okna z alfą 50% (w pliku `#d9b5f5`, alfa 127). Na nim w (6, 6) okno jak `okno-fioletowe.png`, ale wypełnienie `#fffbe8` (szczebel O w x35, odblaski białe w x8 i x37, y8–16). Kotek (przykrywa szczebel): uszy – trójkąty `#f7b2cc` z obrysem: lewe (23,6, 23,6), (25,4, 10,4), (33,2, 16,4), prawe lustrzane względem x=35; głowa – koło r=12 `#fff0f6` z obrysem r=13, środek (35, 26); obróżka w kolorze okna (`#d8b4f5`) x25–45, y30–32; oczy O 3×4 x29–31 i x39–41, y24–27; nosek `#f59bbd` 4×3 x34–37, y27–29.

## `domek-gabi/okno-pomaranczowe.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#ffc08a`.

## `domek-gabi/okno-pomaranczowe-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#ffc18b` z alfą 127, obróżka `#ffc08a`.

## `domek-gabi/okno-rozowe.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#f7a6c8`.

## `domek-gabi/okno-rozowe-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#f7a7c9` z alfą 127, obróżka `#f7a6c8`.

## `domek-gabi/okno-turkusowe.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#9fe8ec`.

## `domek-gabi/okno-turkusowe-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#9fe7eb` z alfą 127, obróżka `#9fe8ec`.

## `domek-gabi/okno-zielone.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#a8e6a0`.

## `domek-gabi/okno-zielone-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#a9e5a1` z alfą 127, obróżka `#a8e6a0`.

## `domek-gabi/okno-zolte.png`
58×34 px, kotwica (0, 0). Jak `okno-fioletowe.png`, kolor `#fff09a`.

## `domek-gabi/okno-zolte-swieci.png`
70×46 px, kotwica (6, 6). Jak `okno-fioletowe-swieci.png`, poświata `#ffef9b` z alfą 127, obróżka `#fff09a`.

## `domek-gabi/oko.png`
55×55 px, kotwica (27, 27). Okrągłe okno-oko w dachu. Środek (27, 27): koło r=27 w O, koło r=26 `#b8f0ea`, koło r=19 `#7cc8f2`. Błysk: ukośna biała `#ffffff` linia 1 px, piksele (27 + round(i/2), 27 + i) dla i = −9…9 (od (23, 18) do (32, 36)).

## `domek-gabi/oko-mruga.png`
55×55 px, kotwica (27, 27). Oko zamknięte (mrugnięcie). Koło r=27 w O, koło r=26 `#f2a6dc` (kolor dachu), pozioma kreska O x3–51, y27–28.

## `domek-gabi/wzgorza-wzor.png`
566×66 px, kotwica (0, 0). Liliowe wzgórza za domkiem – wzór powtarzany (jeden okres fali), jeden kolor `#d9ccf5`. Kafelek jest „zawinięty” w pionie: scena układa go tak, że wiersz kafelka = (y sceny) mod 66. Dla kolumny x grzbiet wzgórza ma y = 305 − round(sin(x/90)·15) (współrzędne sceny), a wzgórze wypełnia od grzbietu do y=355; każdy piksel sceny (x, y) trafia do wiersza y mod 66. W kafelku: w kolumnie x pełne są wiersze od (grzbiet mod 66) do 65 oraz 0–25, puste wiersze 26 … (grzbiet mod 66)−1. Przy x=0 grzbiet 305 → puste wiersze 26–40; na szczycie (x≈141) kolumna pełna; w dolinie (x≈424) puste 26–55. Okres sin ≈ 565,5 px, więc kafelek łączy się w poziomie prawie bez szwu.

## `domek-gabi/drzwi-windy.png`
6×114 px, kotwica (0, 0). Jedno przesuwane skrzydło drzwi windy w najwęższej postaci; scena rozciąga środkową kolumnę (3-slice). Pudełko 6×114, wypełnienie `#d9ccf5` (tylko x2–3, y2–111), obramowanie O 2 px, ścięte rogi.

## `domek-gabi/szyb-z-kocia-glowa.png`
73×182 px, kotwica (36, 182). Szyb windy z kocią głową na górze. Oś x=36.
1. Rama: pudełko x2–70, y38–181, wypełnienie `#9fe6d4`, obramowanie O.
2. Kabina: pudełko x10–63, y62–175, wypełnienie `#d8f0ff`; biały pasek-odblask `#ffffff` 2 px x16–17, y68–169.
3. Uszy (trójkąty `#f2a6dc` z obrysem): lewe (1, 38), (6, 1), (27, 12), prawe (71, 38), (66, 1), (45, 12).
4. Głowa: półelipsa `#f2a6dc` z obrysem O 1 px, podstawa w y44, w rzędzie 44−dy półszerokość round(35·√(1−(dy/26,25)²)) (obrys: round(36·√(1−(dy/27,25)²))); sięga do y17. Pod nią pas `#f2a6dc` x4–68, y40–45 zakrywający górę ramy.
5. Twarz: oczy – kwadraty O 5×5 x22–26 i x45–49, y29–33; nosek-serce `#f59bbd` z bloków 2×2 według siatki serca (jak `domek-gabi/nosek.png`), 14×12, x29–42, y30–41.
