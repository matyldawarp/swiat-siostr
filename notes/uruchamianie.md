# Uruchamianie, publikacja i testy

## Serwer i publikacja

Gra w Phaser 4 (ładowany z CDN, bez kroku budowania). Uruchamiana przez `npm start` (Node.js, serwer `tools/dev-server.mjs`, bez zależności). Użytkownik serwuje grę także zwykłym, standardowym serwerem HTTP, więc gra nie może zależeć od niczego, co ustawia `dev-server.mjs` (typy MIME dla nietypowych rozszerzeń, nagłówki cache, wstrzykiwane skrypty). To ma być tylko wygoda przy pracy, a nie warunek działania. Skrypty narzędziowe piszemy w Node, nie w Pythonie. Serwer nasłuchuje w sieci lokalnej, żeby dało się grać z iPada.

Auto-przeładowanie (`npm run dev`, flaga `--livereload`) jest na razie wyłączone na życzenie użytkownika. Zamiast niego w prawym górnym rogu na każdym ekranie jest pikselowy przycisk przeładowania (`OverlayScene`, musi zostać ostatnia na liście scen).

Wszystkie pliki gry leżą w `docs/`. To jest dokładnie to, co serwuje `dev-server.mjs` i co publikuje GitHub Pages. Publikuje workflow `.github/workflows/pages.yml` po każdym pushu na `main`, więc w ustawieniach repozytorium źródłem Pages musi być „GitHub Actions”. Workflow dopisuje do `docs/` plik `version.json` (SHA commita i czas builda, poza repozytorium w `.gitignore`), który okno Ustawień pokazuje na dole (`ui/version.js`). Lokalnie ten plik podaje `dev-server.mjs` z `.git`, z dopiskiem „(lokalnie)”. Na innym serwerze wersja jest „nieznana”. Notatki (CLAUDE.md, README, `notes/`), skany rysunków (`assets/scans/`), oryginały kolorowanek (`assets/coloring/`), narzędzia (`tools/`) i konfiguracja zostają poza `docs/`, żeby nie trafiły na publiczną stronę.

## Sprawdzanie zmian

- `npm run check` (`tools/check.mjs`, bez przeglądarki) sprawdza importy (także użycie nazwy z innego modułu bez importu), ładowanie modułów, dane postaci, tortów, osobowości, cukierni i muzyki oraz zasady z CLAUDE.md.
- Potem sprawdź zmianę w podglądzie przeglądarki. W konsoli jest `window.game`, np. `game.scene.start('KitchenScene')`.
- Ukryty panel przeglądarki (albo okno aplikacji poza ekranem) wstrzymuje pętlę gry. Pokaż panel przed testami albo przepuszczaj klatki ręcznie: `game.step(czas, 16)`. Tweeny liczą wtedy czas z zegara ściennego, więc na czas testu podmień `scene.sys.tweens.getDelta = () => 16` w każdej scenie.
- Całe piksele: płótno i ikony 64 nigdy nie mają ułamkowych rozmiarów (w CSS ani na ekranie). Gra sprawdza to sama cały czas, gdy działa (`ui/wholePixels.js`: po każdej zmianie rozmiaru i co sekundę). Błąd „Ułamkowe piksele: …” trafia do konsoli i do rogu ekranu w trybie debug. Przy każdym uruchomieniu gry w testach sprawdź, że go nie ma (`checkWholePixels(game)` zwraca pustą listę). Najlepiej sprawdzać też inne gęstości ekranu (dpr 1, 1,25, 1,5, 2), np. w Puppeteer z Edge (`deviceScaleFactor`), bo panel przeglądarki ma zawsze dpr 1.
- Rozmiar iPada emuluj przez 1080×810. Zrzuty w emulacji pokazują grę pomniejszoną w rogu, to efekt przechwytywania, a nie błąd (sprawdź rozmiar canvasu liczbami).
