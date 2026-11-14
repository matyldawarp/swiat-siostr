# Obrazki: `docs/assets/gfx/pracownia/`

Pracownia plastyczna Tekturzątka. 18 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Pracownia plastyczna w domku Gabi (scena GabiCraftScene): tablica korkowa z kartką do ozdabiania, półki z farbami brokatowymi, girlandy z koralików, stół z pomponami-kotkami i Tekturzątko.

## `pracownia/farba-fioletowa.png`
27×48 px, kotwica (14, 48). Butelka farby z brokatem – kotek z uszkami i zamkniętymi oczkami. Korpus: pudełko 27×33 (x0–26, y15–47) w kolorze farby `#c3a6f0`, obramowanie O. Zakrętka: pudełko 18×12 (x5–22, y4–15) w tym samym kolorze (dolny rząd obramowania nachodzi na górę korpusu). Uszy: dwa słupki O 3×5 – x6–8 i x19–21, y0–4. Zamknięte oczy: kreski O 5×1 – x8–12 i x17–21, y27. Brokat: białe piksele `#ffffff` w (11, 26), (20, 30), (22, 39), (7, 42).

## `pracownia/farba-niebieska.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#8cc4f2`.

## `pracownia/farba-pomaranczowa.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#ffb37a`.

## `pracownia/farba-rozowa.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#f59bbd`.

## `pracownia/farba-teczowa.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, ale korpus w poziome pasy (cała szerokość wnętrza x2–24): `#f59bbd` y17–21, `#ffb37a` y22–26, `#ffe066` y27–31, `#8fd9a0` y32–35, `#8cc4f2` y36–40, `#c3a6f0` y41–45; zakrętka `#f7b2cc`. Oczy (O, y27) i brokat (białe piksele) jak w rodzinie.

## `pracownia/farba-zielona.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#8fd9a0`.

## `pracownia/farba-zlota.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#ffd27a`.

## `pracownia/farba-zolta.png`
27×48 px, kotwica (14, 48). Jak `farba-fioletowa.png`, kolor `#ffe066`.

## `pracownia/girlanda-gorna.png`
574×38 px, kotwica (22, −6). Górna girlanda z koralików przez całą ścianę, lekko zwisająca. 44 koraliki co 13 px: środki x = 7 + 13k (k = 0…43, czyli 7…566), y = round(9 + sin((x−22)/540·π)·21) – od ok. 7 przy brzegach do ok. 30 w środku. Koralik: koło r=6 w kolorze z obrysem (koło r=7 w O), biały odblask 1 px w (x−1, y−2). Kolory po kolei, cyklicznie od pierwszego: `#f28aa5`, `#ffc08a`, `#fff09a`, `#7fcf9a`, `#9fd0f5`, `#c3b3ea`, `#f7b2cc`. Sąsiednie koraliki stykają się obrysami.

## `pracownia/girlanda-dolna.png`
574×35 px, kotwica (22, −24). Dolna girlanda: jak `girlanda-gorna.png`, ale y = round(9 + sin((x−22)/540·π)·18) (zwis 18 px), a kolory zaczynają się od czwartego: `#7fcf9a`, `#9fd0f5`, `#c3b3ea`, `#f7b2cc`, `#f28aa5`, `#ffc08a`, `#fff09a`, …

## `pracownia/iskierka-brokatu.png`
10×10 px, kotwica (5, 5). Iskierka, która leci z farby brokatowej. Biały `#ffffff` krzyżyk: poziomy rząd y5, x0–9 i pionowa kolumna x5, y0–9; w środku kwadrat `#fff09a` 3×3 x4–6, y4–6.

## `pracownia/koszyk.png`
47×39 px, kotwica (23, 39). Koszyk pełen puchatych pomponów (z niego bierze się pompony). Kosz: pudełko x2–43, y19–38, wypełnienie `#f3c9a0`, obramowanie O; pionowe kreski wikliny `#e0ad80` 1 px w x5, 11, 17, 23, 29, 35, y22–35. Nad koszem pompony („puszki”: koło r=8 w kolorze z obrysem r=9 i jaśniejszymi pikselami jak w pomponach): zielony `#7fcf9a` środek (9, 10), żółty `#fff09a` (23, 10), niebieski `#9fd0f5` (37, 9); spod nich wystają tylko skrawki malinowego `#f28aa5` (środek (14, 18)) i brzoskwiniowego `#ffc08a` (środek (31, 16)) w rzędach 17–18. Kolejność rysowania: malinowy, brzoskwiniowy, żółty, zielony, niebieski, na końcu kosz (zasłania dolne części). Jaśniejsze piksele: `#92eeb1`, `#ffffac`, `#b3eaff`.

## `pracownia/podloga.png`
8×18 px, kotwica (0, 0). Podłoga pracowni (deski) – wzór powtarzany. Całość `#f0dcc0`, jedna pozioma linia `#e2c9a8` w y15 przez całą szerokość; powtarza się bez szwu co 18 px.

## `pracownia/polka-na-farby.png`
162×9 px, kotwica (0, 0). Żółta półka na butelki farby. Pudełko 162×9, wypełnienie `#fff09a`, obramowanie O; cieniowanie `#f6d98b` x3–158, y6–7.

## `pracownia/stol-z-pomponami.png`
168×45 px, kotwica (84, 0). Stół na jednej nodze, na którym robi się pompony (pompony to osobne obrazki). Blat: pudełko x0–167, y0–11, wypełnienie `#ffffff`. Noga: pudełko x60–107, y9–41, wypełnienie `#9fc4ee` (rysowana przed blatem, blat ją przykrywa u góry). Stopa: pudełko x45–122, y33–44, wypełnienie `#9fc4ee` (na nodze). Wszystko z obramowaniem O.

## `pracownia/tablica-korkowa.png`
219×199 px, kotwica (0, 22). Tablica korkowa z kocimi uszami i ramką z guziczków; środek to ciemne pole, na które scena kładzie kartkę. Uszy (pod ramą): trójkąty `#c3a6f0` z obrysem – lewe (3, 24), (18, 1), (45, 24), prawe (174, 24), (201, 1), (216, 24). Rama: pudełko x0–218, y22–198, wypełnienie korka `#e0bf94` (120 pikseli `#cfa878` rozrzuconych wzorem x = 3 + (37i mod 213), y = 25 + (53i mod 171), większość zakryta). Guziczki: koło r=5 w kolorze z obrysem (r=6 O) i dwiema dziurkami O 1 px w (bx−1, by) i (bx+1, by). Środki: górny rząd y30 i dolny y191 dla x = 9, 24, 39, … 204 (co 15); boki x8 i x211 dla y = 45, 60, … 180 (co 15). Kolory cyklicznie `#f28aa5`, `#ffc08a`, `#fff09a`, `#7fcf9a`, `#9fd0f5`, `#c3b3ea`, `#f7b2cc` w kolejności: dla każdego x najpierw górny, potem dolny; potem dla każdego y lewy, potem prawy. Środek: pełny prostokąt O x16–203, y38–183 (188×146).

## `pracownia/tekturzatko-kotek-z-kartonu.png`
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

## `pracownia/wybrana-farba.png`
36×54 px, kotwica (0, 0). Podświetlenie za wybraną butelką farby. Pudełko 36×54, wypełnienie `#ffffff`, obramowanie `#f59bbd` (2 px, ścięte rogi).
