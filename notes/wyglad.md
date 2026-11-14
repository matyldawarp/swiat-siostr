# Wygląd, skala i ekran

## Pixel art

- Grafika w stylu pixel art: niska rozdzielczość bazowa, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- Rozmiary interfejsu w scenach przechodzą przez `S()` (`UI_SCALE` w `docs/src/ui/pixel.js`), a sprite'y skalujemy całkowitymi krotnościami.
- **Ikony 64** to wszystko, co ma stałą siatkę 64×64 pikseli (`docs/src/ui/icons64.js`: `ICON64_GRID`, `addIcon64`): ikony na przyciskach (`PixelUI.createIconButton`) i plakietki osobowości (`addPersonalityBadge`). Każda ikona 64 jest rysowana na takim płótnie i skalowana do swojego rozmiaru, więc wszystkie mają ten sam rozmiar piksela. Ciemne linie są pogrubiane do 3 pikseli siatki, a cienkie jasne linie w ikonach mają grubość `Icons.line(size)`. Nowa ikona 64 rysuje się tylko przez `fillStyle` i `fillRect`, w rozmiarze podanym do `drawIcon`.
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
- Tekst tworzymy przez `PixelUI.addText` (styl z `textStyle()`), nigdy przez `this.add.text`, bo tylko tak czcionka jest ostra i czytelna.
- Układ scen liczymy względem `width`/`height` przekazanych do `build()` (także `this.view`): to zawsze `STAGE`, niezależnie od urządzenia.
