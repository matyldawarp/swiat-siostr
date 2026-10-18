# Muzyka

- Po każdym uruchomieniu gry muzyka jest wyłączona. Gra nie zapamiętuje wybranej piosenki; włącza się ją przyciskiem nutki.
- Gdy użytkownik wkleja link do YouTube, oznacza to: dodaj tę muzyczkę do gry.
- Wszystkie kroki poniżej wykonuje `tools/add-song.mjs`. Najpierw `node tools/add-song.mjs <link>` wypisuje tytuł filmu, kanał i opis, z których ustalasz autora i tytuł. Potem `node tools/add-song.mjs <link> --artist "..." --title "..." [--album "..."]` pobiera piosenkę i miniaturkę, zapisuje tagi, dopisuje utwór do listy i uruchamia `npm run check`.
- Pliki muzyki leżą w `docs/assets/music/` i mają rozszerzenie `.bin` zamiast `.mp3` (w środku to zwykły MP3). Gra sama pobiera te pliki i odtwarza je jako `audio/mpeg` (`docs/src/audio/music.js`), więc działa na każdym serwerze.
- Zapisuj poprawnie autora i tytuł utworu. Ustal je z opisu filmu i nazwy kanału, a nie z samego tytułu filmu (pomiń dopiski typu „Official Video”, „HD”, „lyrics”) i zachowaj oryginalną pisownię z polskimi znakami. Jeśli autor albo tytuł są niepewne, zapytaj.
- Autor i tytuł trafiają w trzy miejsca: tagi ID3 pliku (`artist`, `title`), nazwa pliku (`autor-tytul.bin`, bez polskich znaków i spacji) i lista muzyki w grze (`docs/src/data/music.js`). Na liście jest też licencja (zawsze "Public domain") i oryginalny link z YouTube, dokładnie taki, jaki wkleił użytkownik, w polu `youtubeUrl`.
- Miniaturka filmu zmniejszona do 48×27 (`ffmpeg -vf scale=48:27:flags=area`) leży obok pliku muzyki jako `autor-tytul.jpg`. W wyborze piosenek pokazuje się ona zamiast numeru.
