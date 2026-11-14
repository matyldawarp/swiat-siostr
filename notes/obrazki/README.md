# Obrazki gry: opisy do odtworzenia

Te pliki opisują każdy obrazek gry z `docs/assets/gfx/` tak dokładnie, żeby inny agent AI (albo człowiek) mógł go narysować od nowa bez patrzenia na oryginał. Opisy są po polsku, a przy każdym pliku są wymiary, punkt zaczepienia, kolory w hex i kształty w pikselach. Małe i nieregularne obrazki mają gotowe siatki pikseli (albo maski z legendą kolorów), a duże są opisane prostokątami, kołami i wielokątami ze współrzędnymi.

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
4. Porównaj z oryginałem z historii repozytorium (git), jeśli jest dostępny: siatki pikseli w tych plikach odpowiadają oryginałom piksel w piksel.

Każdy folder obrazków (`docs/assets/gfx/<folder>/`, od 10 do 30 plików) ma tu swój plik z opisami: `notes/obrazki/<folder>.md`. Opis obrazka zaczyna się nagłówkiem z jego ścieżką.

## Spis

| Opisy | Obrazków | Gdzie w grze |
|---|---|---|
| [`cukiernia/`](cukiernia.md) | 30 | Cukiernia: dekorowanie babeczek i gablota. |
| [`dentysta/`](dentysta.md) | 22 | Gabinet dentysty. |
| [`domek-gabi/`](domek-gabi.md) | 22 | Domek Gabi przed wejściem i kociwinda między pokojami. |
| [`ikony64/kuchnia-i-cukiernia/`](ikony64/kuchnia-i-cukiernia.md) | 18 | Ikony 64 na przyciskach kuchni (składniki, posypka, podanie tortu) i cukierni (kremy, dodatki, gotowa babeczka). |
| [`ikony64/przyciski/`](ikony64/przyciski.md) | 25 | Ikony 64 na pozostałych przyciskach: ustawienia, muzyka, powrót, narzędzia szpitala i dentysty, pokoje Gabi, osobowości. |
| [`ikony64/torty-postaci/`](ikony64/torty-postaci.md) | 27 | Ikony 64 tortu każdej postaci: cały tort, lukier i dodatek. |
| [`kolorowanki/`](kolorowanki.md) | 20 | Pracownia kolorowanek: narzędzia i farby. |
| [`kuchnia/`](kuchnia.md) | 26 | Kuchnia z pieczeniem tortu: składniki, miska, piekarnik, szafki, okno. |
| [`kuchnia-lakotka/`](kuchnia-lakotka.md) | 28 | Kuchnia Łakotka w domku Gabi. |
| [`kuchnia/dodatki-i-kawalki/`](kuchnia/dodatki-i-kawalki.md) | 27 | Kuchnia: dodatek na torcie i kawałek tortu każdej postaci. |
| [`kuchnia/lukier/`](kuchnia/lukier.md) | 27 | Kuchnia: lukier na torcie każdej postaci, też po kęsach. |
| [`kuchnia/torty/`](kuchnia/torty.md) | 27 | Kuchnia: biszkopt tortu każdej postaci, też po kęsach. |
| [`mapa/`](mapa.md) | 11 | Mapa z budynkami i drogami. |
| [`postacie/`](postacie.md) | 27 | Postacie 64×64: pokoje i podgląd przy wyborze postaci. |
| [`postacie-male/`](postacie-male.md) | 27 | Postacie 32×32: mapa i siatka wyboru postaci. |
| [`pracownia/`](pracownia.md) | 18 | Pracownia plastyczna Tekturzątka. |
| [`pracownia/pompony/`](pracownia/pompony.md) | 21 | Pracownia: pompony w siedmiu kolorach, bez buzi, z oczami i z uszami. |
| [`start-i-wybor-postaci/`](start-i-wybor-postaci.md) | 10 | Ekran startowy i okienka siatki wyboru postaci. |
| [`szkola/`](szkola.md) | 10 | Szkoła: tło klasy, ikony lekcji, gwiazdki. |
| [`szkola/obrazki/`](szkola/obrazki.md) | 12 | Szkoła: obrazki zwierząt i rzeczy 64×64 do zagadek. |
| [`szkola/obrazki-duze/`](szkola/obrazki-duze.md) | 12 | Szkoła: te same obrazki 80×80 do rebusów. |
| [`szpital/`](szpital.md) | 19 | Szpital. |
| [`terrarium/`](terrarium.md) | 17 | Terrarium chomika. |
| [`wspolne/`](wspolne.md) | 16 | Drobiazgi używane w wielu scenach: serce nagrody, ziarenko, kupka, dymek przeziębienia i kichnięcie, litery „z” snu, znaczki przy przyciskach, pole wyboru, wybór piosenki, ekran końca gry. |

## Konwencje rysowania

Opisy pisały cztery osobne części, każda ze swoimi definicjami (te same kształty, czasem innymi słowami). Opis obrazka odwołuje się do definicji części, z której pochodzi: postacie, drobiazgi i ikony 64 – część A; kuchnia i cukiernia – część B; domek Gabi, Łakotek, pracownia, mapa i ekran startowy – część C; szkoła, szpital, dentysta, terrarium, kolorowanki – część D.

### Część A: postacie, drobne, efekty, ikony

Jak czytać siatki: każdy znak to jeden piksel PNG, wiersze od góry, kolumny od lewej (x, y liczone od 0 w lewym górnym rogu). `.` = piksel w pełni przezroczysty; litery to kolory z legendy podanej przy siatce (każdy kolor jest w pełni kryjący, alfa 255 – w tych folderach nie ma półprzezroczystych pikseli). Legenda jest osobna dla każdego obrazka (litery nadane według liczby pikseli). Siatka **RLE**: w wierszu liczba przed znakiem mówi, ile razy go powtórzyć (`5.3A2B` = 5 przezroczystych, 3×A, 2×B; brak liczby = 1); koniec wiersza po ostatnim znaku jest przezroczysty, a wiersz zapisany jako sama `.` jest cały przezroczysty; wiersze RLE dotyczą wycinka podanego nad siatką, poza nim płótno jest przezroczyste.

### Część B: kuchnia, cukiernia

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

### Część C: domek Gabi, mapa, ekran startowy

#### Wspólne zasady rysowania (dotyczą wszystkich opisów poniżej)

- Współrzędne (x, y) liczone od lewego górnego piksela PNG, zakresy „x3–10” są włącznie. Tło zawsze przezroczyste, chyba że napisano inaczej. Wszystkie piksele są w pełni kryjące, chyba że podano alfę.
- **O** = kolor obrysu `#6b4a5e` (ciemna śliwka). Gdy piszę „z obrysem”, chodzi o ten kolor.
- **Pudełko** (`drawBox`) w×h: zewnętrzny pas 2 px w kolorze obramowania, wnętrze (od x+2 do x+w−3, od y+2 do y+h−3) w kolorze wypełnienia. Rogi ścięte: w każdym rogu brak 3 pikseli (sam narożnik i jego 2 sąsiedzi wzdłuż krawędzi), piksel ukośnie do środka (1,1) jest jeszcze obramowaniem. Wersja z „jaśniejszym paskiem”: dodatkowo pas 2 px od x+3 do x+w−4 w rzędach y+2, y+3.
- **Koło r** (`fillCircle`) o środku (cx, cy): dla każdego dy od −r do r rysuj poziomy pasek od cx−dx do cx+dx, gdzie dx = round(√(r²−dy²)). Średnica 2r+1; górny i dolny rząd to jeden piksel (mały „sutek”), to samo na lewym i prawym brzegu. „Koło z obrysem” = koło r+1 w O, na nim koło r w kolorze.
- **Wielokąt**: piksel jest wypełniony, gdy jego środek (x+0,5, y+0,5) leży w wielokącie. **Obrys wielokąta** (`grow 1,5`): ten sam wielokąt z każdym wierzchołkiem odsuniętym o 1,5 px od środka ciężkości wierzchołków, wypełniony O pod spodem – daje obrys 1–2 px, miejscami nierówny (na długich bokach czasem znika).
- `round` = Math.round z JS (połówki w górę, −1,5 → −1).
- **Generator pseudolosowy** używany we wzorach: `seed = (seed*9301 + 49297) % 233280`, wynik `floor(seed/233280 * n)` (wersja „0..n−1”) albo `min + floor(seed/233280 * (max−min+1))` (wersja „min..max”).

### Część D: szkola, szpital, dentysta, terrarium, choroba, kolorowanki

Konwencje tej części: współrzędne (x, y) liczone od lewego górnego piksela PNG (0, 0); „x10–45” = kolumny 10..45 włącznie. Obrys domyślnie `#6b4a5e`. **Ramka drawBox(x, y, w, h, wypełnienie, obrys)**: prostokąt w×h w kolorze obrysu bez czterech narożnych pikseli i z jednym pikselem ściętym ukośnie w każdym rogu (wiersz 0 i h−1 zajmują kolumny 2..w−3, wiersz 1 i h−2 kolumny 1..w−2), a w środku wypełnienie od (2, 2) do (w−3, h−3) – więc ramka ma 2 px grubości po bokach. **Koło r** (fillCircle): dla każdego dy = −r..r poziomy pasek od −dx do +dx, gdzie dx = round(√(r² − dy²)); średnica 2r+1, zawsze z pojedynczym pikselem na górze, dole, lewo i prawo. **Gwiazda r** (Icons.star): 10 wierzchołków na kątach −90° + 36°·i (szpic do góry), promień r dla parzystych i, 0,48·r dla nieparzystych; wypełnione piksele, których środek (x+0,5, y+0,5) leży w wielokącie; najpierw cała gwiazda obrysu o promieniu r + max(1,5; L/0,42) (L = max(1, round(r/10))), na niej gwiazda wypełnienia o promieniu r, obie o środku w kotwicy. Zaokrąglenia jak w JS: Math.round(x,5) w górę (np. round(−13,5) = −13).
