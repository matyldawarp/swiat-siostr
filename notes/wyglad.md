# Wygląd, skala i ekran

## Pixel art

- Grafika w stylu pixel art: niska rozdzielczość bazowa, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- **Obrazki to pliki PNG** w `docs/assets/gfx/<folder>/<nazwa>.png`, jeden piksel PNG to jeden piksel gry. Można je edytować w dowolnym programie graficznym. Folder to zwykle ekran (`kuchnia-lakotka/`, `szpital/`), a do tego `postacie/`, `ikony64/`, `drobne/`. Klucz obrazka to jego ścieżka bez `.png`, np. `kuchnia-lakotka/lodowka`.
  - `docs/assets/gfx/images.json` wymienia każdy obrazek z jego **kotwicą** (`anchor: [x, y]`): pikselem PNG, który gra stawia w podanym punkcie, np. środek podstawy tortu albo lewy górny róg szafki. Po zmianie rozmiaru płótna w programie graficznym trzeba poprawić kotwicę.
  - W kodzie: `addImage(scene, x, y, klucz)`, zmiana stanu (otwarta lodówka, gorący piekarnik) przez `setImage(obrazek, klucz)`, a powtarzający się wzór na całe okno (tapeta, podłoga) przez `addPattern` (`docs/src/gfx/images.js`). Gra wczytuje wszystkie obrazki z listy przed startem.
  - Nowy obrazek: plik PNG do folderu i wpis w `images.json`. `npm run check` sprawdza, że lista i pliki się zgadzają i że każdy klucz użyty w kodzie istnieje.
  - W kodzie zostają tylko jednolite kolory tła na całe okno, gradient nieba, ramki przycisków i okien o zmiennym rozmiarze, jednokolorowe drobinki efektów, warstwy farby w kolorowankach i obraz malowany w pracowni.
- **Siatka pikseli sceny** to jeden piksel gry (scena 540×405). Każdy obrazek w scenie musi się jej trzymać:
  - Obrazek pokazujemy zawsze w skali 1: jeden piksel PNG to jeden piksel gry. Nie skalujemy go ani nie obracamy, także w animacjach.
  - Lewy górny róg obrazka leży na pełnym pikselu gry: kotwice w `images.json` są liczbami całkowitymi, a obrazki stawiamy w całych pikselach.
  - Rzeczy narysowane grubszymi pikselami są zapisane w PNG już powiększone. Postacie mają rozmiary ×4 (`postacie/`, w pokojach), ×2 (`postacie-male/`, mapa i wybór postaci), ×6 (`postacie-duze/`, podgląd) i ×1 (`postacie-mini/`, w domku w terrarium); `createHamsterTextures(scene, postać, skala)`. Do tego serce, ziarenko i kupka ×3, Łakotek i Tekturzątko ×4, obrazki szkoły ×4 i ×5 (`szkola/obrazki-duze/`).
  - Inny rozmiar albo obrót to osobny obrazek, np. `dentysta/kubek-przechylony`.
  - Animacje przesuwają obrazki o pełne piksele: `BaseScene` zaokrągla w każdej klatce położenie wszystkiego, co przesuwa tween (`snapTweensToGrid`). Zamiast powiększania są `PixelUI.pulse` (podskok o kilka pikseli), `PixelUI.popIn` (pojawienie się z opadnięciem) i `PixelUI.popOut` (zniknięcie).
  - `ui/wholePixels.js` sprawdza to cały czas, gdy gra działa, i zgłasza błąd „Ułamkowe piksele: obrazek …”.
  - Wyjątki: ikony 64 mają własną siatkę 64×64, a kolorowanki to gładkie rysunki w dowolnym rozmiarze (`freeScale`). Tekst, ramki przycisków i jednokolorowe prostokąty nie są obrazkami.
- Rozmiary interfejsu w scenach przechodzą przez `S()` (`UI_SCALE` w `docs/src/ui/pixel.js`), a sprite'y skalujemy całkowitymi krotnościami.
- **Ikony 64** to wszystko, co ma stałą siatkę 64×64 pikseli (`docs/src/ui/icons64.js`: `ICON64_GRID`, `addIcon64`): ikony na przyciskach (`PixelUI.createIconButton`) i plakietki osobowości (`addPersonalityBadge`). Każda ikona 64 to obrazek 64×64 w `docs/assets/gfx/ikony64/`, skalowany do swojego rozmiaru, więc wszystkie mają ten sam rozmiar piksela. Rysunek zajmuje środkowe 58×58 pikseli, a kontury mają grubość 3 pikseli siatki.
- Jasna, pastelowa paleta: jasne tła, miękkie pastele (róż, lawenda, mięta, brzoskwinia, błękit), bez ciemnych, nocnych ani nasyconych barw. Tekst w ciemniejszym odcieniu z tej samej palety, a nie w czerni.

## Scena i skala

- Gra ma zawsze poziomy kształt ekranu iPada dziewczynek: 1080×810 px CSS (4:3), zmierzone w trybie debug. Każda scena jest układana na stałej scenie 540×405 pikseli gry (`STAGE` w `docs/src/ui/pixel.js`).
- Na tym iPadzie trzymanym poziomo, uruchomionym z ekranu początkowego, scena wypełnia ekran przy 2 px CSS (4 pikselach ekranu) na piksel gry. W Safari z paskami narzędzi jest mniejsza: 3 piksele ekranu na piksel gry, a wokół widać tło.
- W trybie aplikacji gra rysuje się pod paskiem stanu (`black-translucent`, `viewport-fit=cover`), ale iOS zgłasza wysokość okna bez paska, więc `fitToWindow` dolicza ją z powrotem. Przyciski overlaya omijają pasek dzięki `SAFE_AREA`. Pod samym paskiem leży jednolity `#status-bar` (`style.css`), bo bez niego iPadOS 27 rozmywa tam górę gry.
- Na innych ekranach, także w pionie, cała scena jest zmniejszana albo powiększana, żeby się zmieściła, i wyśrodkowana.
- Tła scen (niebo, ściany, podłoga, trawa) rysujemy na `view.bleed`, czyli na całym oknie, a nie tylko na scenie. Dzięki temu wokół sceny widać dalszy ciąg tła zamiast pustych pasów, także w nowych scenach.
- Tylko przyciski z `OverlayScene` (ustawienia, muzyka, przeładowanie) trzymają się rogów okna i mogą wystawać poza scenę.
- Skalę liczy `fitScale` (wywoływana z `fitToWindow` w `docs/src/main.js`): największą całkowitą liczbę pikseli urządzenia na piksel gry, przy której scena mieści się w oknie. Piksele scen gry mnożymy tylko przez liczby całkowite, także na ostrych ekranach i przy suwaku „Wielkość gry”. Resztę okna wypełnia tło (`view.bleed`). Pilnuje tego `ui/wholePixels.js`. Przyciski w rogach i Ustawienia (`OverlayScene`) mają osobną skalę `UI_RENDER_SCALE` (`uiFitScale`): nie zmienia jej suwak, a na ostrych ekranach może być ułamkowa, np. 3,65 na iPadzie w Safari.

## Kamera i tekst

- Canvas renderuje się w natywnej rozdzielczości urządzenia, a kamera każdej sceny ma zoom `RENDER_SCALE` i jest przesunięta tak, że scena stoi na środku okna. Ustawia ją `PixelUI.setupView(this)`, które wywołuje za scenę `BaseScene`.
- Tekst tworzymy przez `PixelUI.addText` (styl z `textStyle()`, tytuły przez `addTitle`), nigdy przez `this.add.text`. Tekst w czcionce gry to `BitmapText` w czcionce bitmapowej Leggie (`ui/pixelFont.js`, licencja CC BY, autor w README). Leggie ma rozmiary 12, 18 i 24 px, zwykły i pogrubiony. Gra wybiera rozmiar i pełne powiększenie najbliższe `fontSize` stylu, np. 18 ×2 dla 36 px. Kolor, obrys i cień są wrysowane co do piksela w czcionkę dla każdego stylu, przy jego pierwszym użyciu. Czcionka zna ASCII, Latin-1, Latin Extended-A (z polskimi literami) i kilka znaków typograficznych. Brakująca litera daje ostrzeżenie w konsoli. Leggie jest monospace i szersza od zwykłych czcionek: zbyt szeroki tekst zmniejsza `PixelUI.fitTextWidth`.
- Układ scen liczymy względem `width`/`height` przekazanych do `build()` (także `this.view`): to zawsze `STAGE`, niezależnie od urządzenia.
