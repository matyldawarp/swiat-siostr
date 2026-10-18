# Świat Sióstr

Gra w Phaser 4 (ładowany z CDN, bez kroku budowania). Uruchamiana przez `npm start` (Node.js, serwer `tools/dev-server.mjs`, bez zależności). Skrypty narzędziowe piszemy w Node, nie w Pythonie. Serwer nasłuchuje w sieci lokalnej, żeby dało się grać z iPada. Auto-przeładowanie (`npm run dev`, flaga `--livereload`) jest na razie wyłączone na życzenie użytkownika. Zamiast niego w prawym górnym rogu na każdym ekranie jest pikselowy przycisk przeładowania (`OverlayScene`, musi zostać ostatnia na liście scen).

## Praca z repo

- Po każdej zmianie rób commit, bez pytania o zgodę.

## Dla kogo

- Grają dwie siostry: 7 i 4 lata. Młodsza nie czyta, więc wszystko musi dać się zrozumieć bez czytania: ikonki, dźwięki, animacje, duże pola do stukania. Krótkie napisy mogą być tylko dodatkiem dla starszej.
- Bez porażek, kar i strasznych rzeczy. Każda akcja kończy się czymś miłym.

## Muzyka

- Gdy użytkownik wkleja link do YouTube, oznacza to: dodaj tę muzyczkę do gry. Pobierz dźwięk jako plik MP3 do `assets/music/` (krótka nazwa pliku bez polskich znaków i spacji) i dopisz go do listy muzyki w grze.
- Zapisuj poprawnie autora i tytuł utworu. Ustal je z opisu filmu i nazwy kanału, a nie z samego tytułu filmu (pomiń dopiski typu „Official Video”, „HD”, „lyrics”) i zachowaj oryginalną pisownię z polskimi znakami. Zapisz je w trzech miejscach: w tagach ID3 pliku MP3 (`artist`, `title`), w nazwie pliku (`autor-tytul.mp3`, bez polskich znaków i spacji) i na liście muzyki w grze, razem z linkiem do filmu i licencją. Jeśli autor albo tytuł są niepewne, zapytaj.
- Przed pobraniem sprawdź licencję w opisie filmu. Muzykę na wolnej licencji (Creative Commons, „no copyright”, bez tantiem) albo własną użytkownika można normalnie dodać i zacommitować. Jeśli to muzyka chroniona prawem autorskim, powiedz o tym i zapytaj, zanim plik trafi do repozytorium na GitHubie.

## Styl wizualny

- Grafika w stylu pixel art: niska rozdzielczość bazowa skalowana całkowitymi krotnościami, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- Gra zawsze wypełnia całe okno przeglądarki, bez pustych pasów. Zoom jest całkowity i liczony względem bazowych 512×324 w dowolnej orientacji (`fitToWindow` w `src/main.js`), a obszar gry rośnie ponad tę bazę. Piksele nie mogą być zbyt grube: na iPadzie (użytkownik ma iPad Air 2025) zoom ma wynosić 2 w obu orientacjach. Elementy nie mogą też być malutkie, dlatego rozmiary interfejsu w scenach przechodzą przez `S()` (`UI_SCALE` w `src/ui/pixel.js`), a sprite'y skalujemy całkowitymi krotnościami.
- Canvas renderuje się w natywnej rozdzielczości urządzenia, a kamera każdej sceny ma całkowity zoom `RENDER_SCALE`. Każda scena zaczyna od `PixelUI.setupView(this)`, a tekst tworzymy przez `PixelUI.addText`, nigdy przez `this.add.text`, bo tylko tak czcionka jest ostra i czytelna. Obszar gry jest zmienny, więc układ scen liczymy względem `this.scale.width/height`, nie stałych współrzędnych.

- Używaj jasnej, pastelowej palety kolorów: jasne tła, miękkie pastele (róż, lawenda, mięta, brzoskwinia, błękit), bez ciemnych, nocnych ani nasyconych barw.
- Tekst musi pozostać czytelny na jasnym tle: dawaj mu ciemniejszy odcień z tej samej palety, a nie czerń.
