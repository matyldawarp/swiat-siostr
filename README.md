# Świat Sióstr

Gra w przeglądarce oparta na [Phaser 4](https://phaser.io) (ładowanym z CDN, bez kroku budowania).

## Uruchomienie

Potrzebny jest Node.js (bez dodatkowych pakietów).

```bash
npm start
```

Następnie otwórz http://localhost:8080. Serwer ([tools/dev-server.mjs](tools/dev-server.mjs)) wyłącza cache, więc przycisk przeładowania w prawym górnym rogu gry zawsze wczytuje najnowsze pliki. `npm run dev` włącza auto-przeładowanie: serwer sam odświeża wszystkie podłączone przeglądarki po każdej zmianie pliku. Na innym urządzeniu w tej samej sieci Wi-Fi (np. iPad) otwórz `http://<IP komputera>:8080`.

## Instalacja jako aplikacja

Gra ma manifest (`manifest.webmanifest`), service worker (`sw.js`) i ikony (`assets/icons/`, generowane przez `node tools/make-icons.mjs`). Chrome proponuje „Zainstaluj aplikację” tylko dla stron z HTTPS albo z `localhost`. Żeby zainstalować grę z telefonu w sieci domowej, w Chrome na Androidzie otwórz `chrome://flags`, w opcji **Insecure origins treated as secure** wpisz `http://<IP komputera>:8080`, ustaw **Enabled** i uruchom Chrome ponownie.

## GitHub Pages

Workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) publikuje grę przy każdym pushu do `main`. Na stronę trafiają tylko pliki gry z jawnej listy (`index.html`, `style.css`, manifest, `sw.js`, `.nojekyll`, `src/`, `assets/icons/`, `assets/music/`). Notatki, skany rysunków i narzędzia zostają poza stroną. Muzyka chroniona prawami autorskimi nie jest w repozytorium, więc na stronie jej nie ma, a gra wtedy ukrywa przycisk nutki.

Jednorazowo w ustawieniach repozytorium: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Struktura

- `index.html` – strona gry, ładuje Phaser i skrypty
- `src/main.js` – konfiguracja `Phaser.Game`
- `src/scenes/StartScene.js` – ekran początkowy
