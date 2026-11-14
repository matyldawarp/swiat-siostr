# Obrazki: `docs/assets/gfx/start-i-wybor-postaci/`

Ekran startowy i okienka siatki wyboru postaci. 10 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Okienka na ekranie wyboru postaci (CharacterScene): w każdym okienku stoi postać 64×64.
Ekran startowy (StartScene): niebo z gradientem (rysowane w kodzie), słońce z blaskiem, chmurki, iskierki i dwa pasma wzgórz.

## `start-i-wybor-postaci/okienko.png`
45×45 px, kotwica (0, 0). Okienko na postać na ekranie wyboru postaci. Kwadrat z obramowaniem o ściętych rogach: wnętrze #fff7fb, obramowanie #d9b8d0 grubości 2 px; wiersz 0 i 44 mają ramkę tylko na x 2–42, wiersz 1 i 43 na x 1–43, wiersze 2–42 mają ramkę na x 0–1 i 43–44 (piksele (0,0), (1,0), (0,1), (43,0), (44,0), (44,1) i symetrycznie na dole są przezroczyste). Wnętrze x 2–42, y 2–42.

## `start-i-wybor-postaci/okienko-wybrane.png`
45×45 px, kotwica (0, 0). Okienko wybranej postaci. Kształt jak `start-i-wybor-postaci/okienko.png`, wnętrze #ffe1ec, obramowanie #f59bbd 2 px; dodatkowo jasny pasek #ffffff w wierszach 2–3 na x 3–41 (piksele x=2 i x=42 w tych wierszach zostają #ffe1ec).

## `start-i-wybor-postaci/okienko-zamkniete.png`
45×45 px, kotwica (0, 0). Puste, zamknięte okienko (miejsce na postać, której jeszcze nie ma). Kształt jak `start-i-wybor-postaci/okienko.png`, wnętrze #f1ecf7, obramowanie #d9ccf5 2 px.

## `start-i-wybor-postaci/chmurka.png`
72×24 px, kotwica (36, 12). Płaska chmurka z prostokątów, bez obrysu. Cień `#e6eefc`: prostokąt x3–68, y15–23. Biel `#ffffff` (na cieniu): x6–65, y12–20; x12–32, y6–14; x30–53, y0–14; x51–62, y6–14. Widać cień jako pas 3 px po bokach (x3–5, x66–68) i na dole (y21–23).

## `start-i-wybor-postaci/iskierka-biala.png`
3×3 px, kotwica (1, 1). Mała iskierka-plusik migająca na niebie. Pięć pikseli `#ffffff` w kształcie „+”: (1,0), (0,1), (1,1), (2,1), (1,2); rogi przezroczyste.

## `start-i-wybor-postaci/iskierka-rozowa.png`
3×3 px, kotwica (1, 1). Jak `iskierka-biala.png`, kolor `#ffd6e5`.

## `start-i-wybor-postaci/iskierka-zolta.png`
3×3 px, kotwica (1, 1). Jak `iskierka-biala.png`, kolor `#fff1c9`.

## `start-i-wybor-postaci/slonce.png`
43×43 px, kotwica (21, 21). Słońce. Koło r=21 `#fff1c9` o środku (21, 21), bez obrysu.

## `start-i-wybor-postaci/slonce-blask.png`
61×61 px, kotwica (30, 30). Blask za słońcem. Koło r=30 `#fff7e0` o środku (30, 30), bez obrysu.

## `start-i-wybor-postaci/wzgorza-wzor.png`
1080×135 px, kotwica (0, 0). Dwa pasma wzgórz na dole ekranu startowego – wzór powtarzany w poziomie (fale okresowe na 1080 px). Dla kolumny x (k = 2π/1080):
- tylne wzgórze `#d9ccf5`: grzbiet yb = round(66 + 12·sin(3kx) + 3·sin(9kx)), wypełnione od yb do dołu (y134); linia cienia `#cbbcef` 1 px w yb+5;
- przednie wzgórze `#bfe8d6` (na tylnym): grzbiet yf = round(99 + 9·sin(2kx + 1,5)), wypełnione do dołu; jasny brzeg `#d4f2e4` w rzędach yf…yf+2.
Przy x=0: yb=66, yf=108. Fale biegną przez całą szerokość, x0–1079, więc kafelek łączy się bez szwu.
