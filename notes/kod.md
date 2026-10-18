# Mapa kodu (`docs/src/`)

Kod to moduły ES bez kroku budowania: `index.html` ładuje tylko `src/main.js`, a ten importuje resztę. Phaser i NoSleep są globalne z CDN. Nowy plik musi być zaimportowany przez któryś moduł, inaczej gra go nie wczyta (`npm run check` to wychwyci).

- `main.js` – konfiguracja gry, lista scen (`OverlayScene` ostatnia), `fitToWindow`.
- `scenes/BaseScene.js` – baza każdej sceny. Scena implementuje `build({ width, height })` zamiast `create()`, a `init(data)` zaczyna od `super.init(data)`. BaseScene ustawia kamerę na stałą scenę `STAGE`, robi fade-in (`intro()`, można nadpisać) i przebudowuje scenę po zmianie rozmiaru okna (wtedy zmienia się tylko skala). `this.selectedCharacter()` daje wybraną postać.
- `scenes/*Scene.js` – ekrany: start, wybór postaci, terrarium, mapa, szpital, kuchnia, cukiernia, dentysta i overlay (przyciski ustawień, muzyki i przeładowania). Przejście między scenami: `PixelUI.fadeTo(this, 'NazwaScene')`.
  - `BakeryScene` – dekorowanie babeczek i wystawa zapamiętana w `localStorage`.
  - `DentistScene` – lusterko, szczotkowanie palcem okruszków słodyczy, płukanie i naklejka. Okruszków jest tym więcej, im więcej słodyczy zjedzono (licznik w `ui/sweets.js`).
  - `MapScene` – miejsca na mapie i drogi do nich opisuje `MAP_PLACES`. Wszystkie drogi zaczynają się w domu.
  - `OverlayScene` – zębatka Ustawień tylko na ekranach z `SETTINGS_SCENES` (start, wybór postaci).
- `scenes/terrarium/` – części terrarium: `tank.js` rysuje akwarium, `Wheel.js`, `Bath.js` i `House.js` to aktywności chomika, a `Poops.js` to kupki do sprzątania palcem. Cykl aktywności i sposób dodania nowej opisuje `Activity.js`.
- `ui/pixel.js` – paleta (`PALETTE`, `TEXT_COLORS`), `S()`, `textStyle()`, `STAGE`, `fitScale`, `PixelUI` (tekst, przyciski, ramki, kółka, podskok `hop`, `pulse`, przejścia).
- `ui/effects.js` – `floatHeart` (nagroda po stuknięciu), `floatZ` (sen), `floatAway`, `walkBob` (podskakiwanie w marszu), `addPersonalityBadge`.
- `ui/settings.js` – ustawienia z okna Ustawień, zapamiętane w `localStorage`. Tryb debug pokazuje w lewym dolnym rogu rozmiar okna, gry i ekranu. Przydaje się, gdy scena nie pasuje do jakiegoś urządzenia.
- `ui/illness.js` – przeziębienie chomika (stan w `registry`, dymek, kichanie).
- `ui/sweets.js` – licznik słodyczy zjedzonych od ostatniej wizyty u dentysty.
- `gfx/hamster.js` – sprite'y postaci z tablic pikseli (`createHamsterTextures`), `addCharacter` (postać na scenie: kontener do ruchu i obrazek do stukania, z mruganiem), `CHARACTER_SCALE`, `spriteHalf()`.
- `gfx/icons.js` – rysowane ikony `Icons.*` (wycentrowane na `(cx, cy)`) i dodatki na torty `CAKE_TOPPINGS`.
- `audio/sfx.js` – syntezowane efekty `play*()` (bez plików dźwiękowych). `audio/music.js` – odtwarzacz muzyki.
- `data/characters.js` – postacie (`CHARACTERS`) i ich torty (`CHARACTER_CAKES`). `data/music.js` – lista piosenek.
- `data/personalities.js` – osobowości (`PERSONALITIES`). Każda postać dostaje losową osobowość przy pierwszym spotkaniu na danym urządzeniu, zapamiętaną w `localStorage`. Osobowość zmienia zachowanie w terrarium (częstość zajęć, szybkość, serduszka, podskoki, kupki) i widać ją jako ikonkę przy imieniu. Pola i wartości domyślne opisuje `DEFAULTS`.
- Stan między scenami trzymamy w `this.registry`: `selectedCharacter`, `mapLocation`, `sick`, `lastHealed`, `stickers`, `poops`, `sweetsEaten`.
