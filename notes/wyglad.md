# Wygląd, skala i ekran

## Pixel art

- Grafika w stylu pixel art: niska rozdzielczość bazowa, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- Rozmiary interfejsu w scenach przechodzą przez `S()` (`UI_SCALE` w `docs/src/ui/pixel.js`), a sprite'y skalujemy całkowitymi krotnościami.
- Jasna, pastelowa paleta: jasne tła, miękkie pastele (róż, lawenda, mięta, brzoskwinia, błękit), bez ciemnych, nocnych ani nasyconych barw. Tekst w ciemniejszym odcieniu z tej samej palety, a nie w czerni.

## Scena i skala

- Gra ma zawsze poziomy kształt ekranu iPada dziewczynek: 1080×810 px CSS (4:3), zmierzone w trybie debug. Każda scena jest układana na stałej scenie 540×405 pikseli gry (`STAGE` w `docs/src/ui/pixel.js`).
- Na tym iPadzie trzymanym poziomo, uruchomionym z ekranu początkowego, scena wypełnia ekran przy 2 px CSS na piksel gry. W Safari z paskami narzędzi jest trochę mniejsza.
- W trybie aplikacji gra rysuje się pod paskiem stanu (`black-translucent`, `viewport-fit=cover`), ale iOS zgłasza wysokość okna bez paska, więc `fitToWindow` dolicza ją z powrotem. Przyciski overlaya omijają pasek dzięki `SAFE_AREA`. Pod samym paskiem leży jednolity `#status-bar` (`style.css`), bo bez niego iPadOS 27 rozmywa tam górę gry.
- Na innych ekranach, także w pionie, cała scena jest zmniejszana albo powiększana, żeby się zmieściła, i wyśrodkowana.
- Tła scen (niebo, ściany, podłoga, trawa) rysujemy na `view.bleed`, czyli na całym oknie, a nie tylko na scenie. Dzięki temu wokół sceny widać dalszy ciąg tła zamiast pustych pasów, także w nowych scenach.
- Tylko przyciski z `OverlayScene` (ustawienia, muzyka, przeładowanie) trzymają się rogów okna i mogą wystawać poza scenę.
- Skalę liczy `fitScale` (wywoływana z `fitToWindow` w `docs/src/main.js`): całkowitą liczbę pikseli urządzenia na piksel gry, a na ostrych ekranach (dpr ≥ 2), gdzie zaokrąglenie zabrałoby ponad 15%, dokładne dopasowanie.

## Kamera i tekst

- Canvas renderuje się w natywnej rozdzielczości urządzenia, a kamera każdej sceny ma zoom `RENDER_SCALE` i jest przesunięta tak, że scena stoi na środku okna. Ustawia ją `PixelUI.setupView(this)`, które wywołuje za scenę `BaseScene`.
- Tekst tworzymy przez `PixelUI.addText` (styl z `textStyle()`), nigdy przez `this.add.text`, bo tylko tak czcionka jest ostra i czytelna.
- Układ scen liczymy względem `width`/`height` przekazanych do `build()` (także `this.view`): to zawsze `STAGE`, niezależnie od urządzenia.
