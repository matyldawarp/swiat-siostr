# Świat Sióstr

Gra w Phaser 4 (ładowany z CDN, bez kroku budowania). Uruchamiana przez `npm start` (Node.js, serwer `tools/dev-server.mjs`, bez zależności). Użytkownik serwuje grę także zwykłym, standardowym serwerem HTTP, więc gra nie może zależeć od niczego, co ustawia `dev-server.mjs` (typy MIME dla nietypowych rozszerzeń, nagłówki cache, wstrzykiwane skrypty). To ma być tylko wygoda przy pracy, a nie warunek działania. Skrypty narzędziowe piszemy w Node, nie w Pythonie. Serwer nasłuchuje w sieci lokalnej, żeby dało się grać z iPada. Auto-przeładowanie (`npm run dev`, flaga `--livereload`) jest na razie wyłączone na życzenie użytkownika. Zamiast niego w prawym górnym rogu na każdym ekranie jest pikselowy przycisk przeładowania (`OverlayScene`, musi zostać ostatnia na liście scen).

Wszystkie pliki gry leżą w `docs/`. To jest dokładnie to, co serwuje `dev-server.mjs` i co publikuje GitHub Pages (tryb „Deploy from a branch”: gałąź `main`, folder `/docs`, bez dodatkowego workflow). Notatki (CLAUDE.md, README), skany rysunków (`assets/scans/`), narzędzia (`tools/`) i konfiguracja zostają poza `docs/`, żeby nie trafiły na publiczną stronę. Nowe pliki gry dodawaj do `docs/`.

## Praca z repo

- Po każdej zmianie rób commit, bez pytania o zgodę.

## Dla kogo

- Grają dwie siostry: 7 i 4 lata. Młodsza nie czyta, więc wszystko musi dać się zrozumieć bez czytania: ikonki, dźwięki, animacje, duże pola do stukania. Krótkie napisy mogą być tylko dodatkiem dla starszej.
- Bez porażek, kar i strasznych rzeczy. Każda akcja kończy się czymś miłym.

## Muzyka

- Gdy użytkownik wkleja link do YouTube, oznacza to: dodaj tę muzyczkę do gry. Pobierz dźwięk jako plik MP3 do `docs/assets/music/` (krótka nazwa pliku bez polskich znaków i spacji) i dopisz go do listy muzyki w grze. Pliki muzyki w tym folderze mają rozszerzenie `.bin` zamiast `.mp3` (w środku to zwykły MP3), więc po pobraniu zmień rozszerzenie. Gra sama pobiera te pliki i odtwarza je jako `audio/mpeg` (`docs/src/audio/music.js`), więc działa na każdym serwerze.
- Zapisuj poprawnie autora i tytuł utworu. Ustal je z opisu filmu i nazwy kanału, a nie z samego tytułu filmu (pomiń dopiski typu „Official Video”, „HD”, „lyrics”) i zachowaj oryginalną pisownię z polskimi znakami. Zapisz je w trzech miejscach: w tagach ID3 pliku MP3 (`artist`, `title`), w nazwie pliku (`autor-tytul.bin`, bez polskich znaków i spacji) i na liście muzyki w grze (`docs/src/data/music.js`), razem z licencją i oryginalnym linkiem z YouTube, dokładnie takim, jaki wkleił użytkownik, w polu `youtubeUrl`. Pobierz też miniaturkę filmu, zmniejsz ją do 48×27 (`ffmpeg -vf scale=48:27:flags=area`) i zapisz obok pliku muzyki jako `autor-tytul.jpg`. W wyborze piosenek pokazuje się ona zamiast numeru. Jeśli autor albo tytuł są niepewne, zapytaj.
- Przed pobraniem sprawdź licencję w opisie filmu. Muzykę na wolnej licencji (Creative Commons, „no copyright”, bez tantiem) albo własną użytkownika można normalnie dodać i zacommitować. Muzyka chroniona prawem autorskim zostaje tylko lokalnie (jest w `.gitignore`) i nie trafia do publicznego repozytorium ani na GitHub Pages, niezależnie od rozszerzenia pliku.

## Styl wizualny

- Grafika w stylu pixel art: niska rozdzielczość bazowa skalowana całkowitymi krotnościami, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- Gra zawsze wypełnia całe okno przeglądarki, bez pustych pasów. Zoom jest całkowity i liczony względem bazowych 512×324 w dowolnej orientacji (`fitToWindow` w `docs/src/main.js`), a obszar gry rośnie ponad tę bazę. Piksele nie mogą być zbyt grube: na iPadzie (użytkownik ma iPad Air 2025) zoom ma wynosić 2 w obu orientacjach. Elementy nie mogą też być malutkie, dlatego rozmiary interfejsu w scenach przechodzą przez `S()` (`UI_SCALE` w `docs/src/ui/pixel.js`), a sprite'y skalujemy całkowitymi krotnościami.
- Canvas renderuje się w natywnej rozdzielczości urządzenia, a kamera każdej sceny ma całkowity zoom `RENDER_SCALE`. Każda scena zaczyna od `PixelUI.setupView(this)`, a tekst tworzymy przez `PixelUI.addText`, nigdy przez `this.add.text`, bo tylko tak czcionka jest ostra i czytelna. Obszar gry jest zmienny, więc układ scen liczymy względem `this.scale.width/height`, nie stałych współrzędnych.

- Używaj jasnej, pastelowej palety kolorów: jasne tła, miękkie pastele (róż, lawenda, mięta, brzoskwinia, błękit), bez ciemnych, nocnych ani nasyconych barw.
- Tekst musi pozostać czytelny na jasnym tle: dawaj mu ciemniejszy odcień z tej samej palety, a nie czerń.
