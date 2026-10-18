# Świat Sióstr

Gra w Phaser 4 (ładowany z CDN, bez kroku budowania). Uruchamiana przez `npm start` (Node.js, serwer `tools/dev-server.mjs`, bez zależności). Użytkownik serwuje grę także zwykłym, standardowym serwerem HTTP, więc gra nie może zależeć od niczego, co ustawia `dev-server.mjs` (typy MIME dla nietypowych rozszerzeń, nagłówki cache, wstrzykiwane skrypty). To ma być tylko wygoda przy pracy, a nie warunek działania. Skrypty narzędziowe piszemy w Node, nie w Pythonie. Serwer nasłuchuje w sieci lokalnej, żeby dało się grać z iPada. Auto-przeładowanie (`npm run dev`, flaga `--livereload`) jest na razie wyłączone na życzenie użytkownika. Zamiast niego w prawym górnym rogu na każdym ekranie jest pikselowy przycisk przeładowania (`OverlayScene`, musi zostać ostatnia na liście scen).

Wszystkie pliki gry leżą w `docs/`. To jest dokładnie to, co serwuje `dev-server.mjs` i co publikuje GitHub Pages (tryb „Deploy from a branch”: gałąź `main`, folder `/docs`, bez dodatkowego workflow). Notatki (CLAUDE.md, README), skany rysunków (`assets/scans/`), narzędzia (`tools/`) i konfiguracja zostają poza `docs/`, żeby nie trafiły na publiczną stronę. Nowe pliki gry dodawaj do `docs/`.

## Praca z repo

- Po każdej zmianie kodu uruchom `npm run check` (`tools/check.mjs`, bez przeglądarki). Sprawdza importy (także użycie nazwy z innego modułu bez importu), ładowanie modułów, dane postaci, tortów i muzyki oraz zasady z tego pliku. Potem sprawdź zmianę w podglądzie przeglądarki. W konsoli jest `window.game`, np. `game.scene.start('KitchenScene')`. Ukryty panel przeglądarki wstrzymuje pętlę gry, więc pokaż go przed testami w podglądzie.
- Po każdej zmianie rób commit, bez pytania o zgodę.

## Mapa kodu (`docs/src/`)

Kod to moduły ES bez kroku budowania: `index.html` ładuje tylko `src/main.js`, a ten importuje resztę. Phaser i NoSleep są globalne z CDN. Nowy plik musi być zaimportowany przez któryś moduł, inaczej gra go nie wczyta (`npm run check` to wychwyci).

- `main.js` – konfiguracja gry, lista scen (`OverlayScene` ostatnia), `fitToWindow`.
- `scenes/BaseScene.js` – baza każdej sceny. Scena implementuje `build({ width, height })` zamiast `create()`, a `init(data)` zaczyna od `super.init(data)`. BaseScene ustawia kamerę na stałą scenę `STAGE`, robi fade-in (`intro()`, można nadpisać) i przebudowuje scenę po zmianie rozmiaru okna (wtedy zmienia się tylko skala). `this.selectedCharacter()` daje wybraną postać.
- `scenes/*Scene.js` – ekrany: start, wybór postaci, terrarium, mapa, szpital, kuchnia, cukiernia (`BakeryScene`: dekorowanie babeczek i wystawa zapamiętana w `localStorage`), dentysta (`DentistScene`: lusterko, szczotkowanie palcem okruszków słodyczy, płukanie i naklejka; okruszków jest tym więcej, im więcej słodyczy zjedzono, licznik w `ui/sweets.js`), overlay (przyciski ustawień, muzyki i przeładowania). Miejsca na mapie i drogi do nich opisuje `MAP_PLACES` w `MapScene.js`. Wszystkie drogi zaczynają się w domu. Przejście między scenami: `PixelUI.fadeTo(this, 'NazwaScene')`.
- `scenes/terrarium/` – części terrarium: `tank.js` rysuje akwarium, a `Wheel.js`, `Bath.js` i `House.js` to aktywności chomika. Cykl aktywności i sposób dodania nowej opisuje `Activity.js`.
- `ui/pixel.js` – paleta (`PALETTE`, `TEXT_COLORS`), `S()`, `textStyle()`, `PixelUI` (tekst, przyciski, ramki, kółka, podskok `hop`, `pulse`, przejścia).
- `ui/effects.js` – `floatHeart` (nagroda po stuknięciu), `floatZ` (sen), `floatAway`, `walkBob` (podskakiwanie w marszu).
- `ui/settings.js` – ustawienia z okna Ustawień (przycisk z zębatką w `OverlayScene`), zapamiętane w `localStorage`. Tryb debug pokazuje w lewym dolnym rogu rozmiar okna i ekranu. Przydaje się, gdy scena nie pasuje do jakiegoś urządzenia.
- `ui/illness.js` – przeziębienie chomika (stan w `registry`, dymek, kichanie).
- `gfx/hamster.js` – sprite'y postaci z tablic pikseli (`createHamsterTextures`), `addCharacter` (postać na scenie: kontener do ruchu i obrazek do stukania, z mruganiem), `CHARACTER_SCALE`, `spriteHalf()`.
- `gfx/icons.js` – rysowane ikony `Icons.*` (wycentrowane na `(cx, cy)`) i dodatki na torty `CAKE_TOPPINGS`.
- `audio/sfx.js` – syntezowane efekty `play*()` (bez plików dźwiękowych). `audio/music.js` – odtwarzacz muzyki.
- `data/characters.js` – postacie (`CHARACTERS`) i ich torty (`CHARACTER_CAKES`). `data/music.js` – lista piosenek.
- `data/personalities.js` – osobowości (`PERSONALITIES`). Każda postać dostaje losową osobowość przy pierwszym spotkaniu na danym urządzeniu, zapamiętaną w `localStorage`. Osobowość zmienia zachowanie w terrarium (częstość zajęć, szybkość, serduszka, podskoki, kupki) i widać ją jako ikonkę przy imieniu (`addPersonalityBadge`). Pola i wartości domyślne opisuje `DEFAULTS`.
- Stan między scenami trzymamy w `this.registry`: `selectedCharacter`, `mapLocation`, `sick`, `lastHealed`, `stickers`.

## Dla kogo

- Grają dwie siostry: 7 i 4 lata. Młodsza nie czyta, więc wszystko musi dać się zrozumieć bez czytania: ikonki, dźwięki, animacje, duże pola do stukania. Krótkie napisy mogą być tylko dodatkiem dla starszej.
- Bez porażek, kar i strasznych rzeczy. Każda akcja kończy się czymś miłym.

## Muzyka

- Po każdym uruchomieniu gry muzyka jest wyłączona. Gra nie zapamiętuje wybranej piosenki; włącza się ją przyciskiem nutki.
- Wszystkie kroki poniżej wykonuje `tools/add-song.mjs`. Najpierw `node tools/add-song.mjs <link>` wypisuje tytuł filmu, kanał i opis, z których ustalasz autora i tytuł. Potem `node tools/add-song.mjs <link> --artist "..." --title "..." [--album "..."]` pobiera piosenkę i miniaturkę, zapisuje tagi, dopisuje utwór do listy i uruchamia `npm run check`.
- Gdy użytkownik wkleja link do YouTube, oznacza to: dodaj tę muzyczkę do gry. Pobierz dźwięk jako plik MP3 do `docs/assets/music/` (krótka nazwa pliku bez polskich znaków i spacji) i dopisz go do listy muzyki w grze. Pliki muzyki w tym folderze mają rozszerzenie `.bin` zamiast `.mp3` (w środku to zwykły MP3), więc po pobraniu zmień rozszerzenie. Gra sama pobiera te pliki i odtwarza je jako `audio/mpeg` (`docs/src/audio/music.js`), więc działa na każdym serwerze.
- Zapisuj poprawnie autora i tytuł utworu. Ustal je z opisu filmu i nazwy kanału, a nie z samego tytułu filmu (pomiń dopiski typu „Official Video”, „HD”, „lyrics”) i zachowaj oryginalną pisownię z polskimi znakami. Zapisz je w trzech miejscach: w tagach ID3 pliku MP3 (`artist`, `title`), w nazwie pliku (`autor-tytul.bin`, bez polskich znaków i spacji) i na liście muzyki w grze (`docs/src/data/music.js`), razem z licencją (zawsze wpisujemy "Public domain") i oryginalnym linkiem z YouTube, dokładnie takim, jaki wkleił użytkownik, w polu `youtubeUrl`. Pobierz też miniaturkę filmu, zmniejsz ją do 48×27 (`ffmpeg -vf scale=48:27:flags=area`) i zapisz obok pliku muzyki jako `autor-tytul.jpg`. W wyborze piosenek pokazuje się ona zamiast numeru. Jeśli autor albo tytuł są niepewne, zapytaj.

## Styl wizualny

- Grafika w stylu pixel art: niska rozdzielczość bazowa skalowana całkowitymi krotnościami, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- Gra ma zawsze poziomy kształt ekranu iPada Air 11" (2025), czyli 1180×820 px CSS: każda scena jest układana na stałej scenie 590×410 pikseli gry (`STAGE` w `docs/src/ui/pixel.js`). Na iPadzie trzymanym poziomo w pełnym ekranie (z ekranu początkowego) wypełnia go przy 2 px CSS na piksel gry. W Safari z paskami narzędzi jest trochę mniejsza. Na innych ekranach, także w pionie, cała scena jest zmniejszana albo powiększana, żeby się zmieściła, i wyśrodkowana. Tła scen (niebo, ściany, podłoga, trawa) rysujemy na `view.bleed`, czyli na całym oknie, a nie tylko na scenie. Dzięki temu wokół sceny widać dalszy ciąg tła zamiast pustych pasów, także w nowych scenach. Tylko przyciski z `OverlayScene` (muzyka, przeładowanie) trzymają się rogów okna i mogą wystawać poza scenę. Skalę liczy `fitScale` (wywoływana z `fitToWindow` w `docs/src/main.js`): całkowitą liczbę pikseli urządzenia na piksel gry, a na ostrych ekranach (dpr ≥ 2), gdzie zaokrąglenie zabrałoby ponad 15%, dokładne dopasowanie. Rozmiary interfejsu w scenach przechodzą przez `S()` (`UI_SCALE`), a sprite'y skalujemy całkowitymi krotnościami.
- Canvas renderuje się w natywnej rozdzielczości urządzenia, a kamera każdej sceny ma zoom `RENDER_SCALE` i jest przesunięta tak, że scena stoi na środku okna. Ustawia ją `PixelUI.setupView(this)`, które wywołuje za scenę `BaseScene`. Tekst tworzymy przez `PixelUI.addText` (styl z `textStyle()`), nigdy przez `this.add.text`, bo tylko tak czcionka jest ostra i czytelna. Układ scen liczymy względem `width`/`height` przekazanych do `build()` (także `this.view`): to zawsze `STAGE`, niezależnie od urządzenia.

- Używaj jasnej, pastelowej palety kolorów: jasne tła, miękkie pastele (róż, lawenda, mięta, brzoskwinia, błękit), bez ciemnych, nocnych ani nasyconych barw.
- Tekst musi pozostać czytelny na jasnym tle: dawaj mu ciemniejszy odcień z tej samej palety, a nie czerń.
