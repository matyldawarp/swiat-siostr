# Świat Sióstr

Gra w Phaser 4 z CDN, bez budowania. `npm start` uruchamia serwer; gra musi działać też na zwykłym serwerze HTTP. Pliki gry tylko w `docs/` (publikuje je GitHub Pages), notatki i narzędzia poza nim.

## Zasady

- Dwie siostry, 7 i 4 lata. Młodsza nie czyta: ikonki, dźwięki, animacje, duże pola. Bez porażek, kar i strasznych rzeczy; każda akcja kończy się czymś miłym.
- Pixel art w jasnych pastelach. Tekst tylko przez `PixelUI.addText`, w ciemniejszym odcieniu palety.
- Scena ma stały rozmiar `STAGE` (iPad 1080×810); tła rysuj na `view.bleed`.
- Kod to moduły ES importowane z `docs/src/main.js`. Nowa scena dziedziczy po `BaseScene` i implementuje `build()`; dopisz ją do listy w `main.js` przed `OverlayScene`, która musi być ostatnia.
- Narzędzia piszemy w Node (`tools/`), nie w Pythonie.
- Po zmianie kodu: `npm run check`, podgląd w przeglądarce, potem commit bez pytania.
- Link do YouTube = dodaj piosenkę (`notes/muzyka.md`). Muzyka startuje wyłączona.

## Więcej

- `notes/kod.md` – mapa plików i modułów, sceny, stan w `registry`.
- `notes/wyglad.md` – pixel art, skala, scena, pasek stanu iPada.
- `notes/uruchamianie.md` – serwer, publikacja, testy w przeglądarce.
- `notes/muzyka.md` – dodawanie piosenek.
