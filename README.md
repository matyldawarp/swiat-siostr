# Świat Sióstr

Gra w przeglądarce oparta na [Phaser 4](https://phaser.io) (ładowanym z CDN, bez kroku budowania).

## Uruchomienie

Potrzebny jest Node.js (bez dodatkowych pakietów).

```bash
npm start
```

Następnie otwórz http://localhost:8080. Serwer ([tools/dev-server.mjs](tools/dev-server.mjs)) wyłącza cache, więc przycisk przeładowania w prawym górnym rogu gry zawsze wczytuje najnowsze pliki. `npm run dev` włącza auto-przeładowanie (serwer sam odświeża podłączone przeglądarki po każdej zmianie pliku), ale na co dzień go nie używamy. Na innym urządzeniu w tej samej sieci Wi-Fi (np. iPad) otwórz `http://<IP komputera>:8080`.

## Instalacja jako aplikacja

Gra ma manifest (`docs/manifest.webmanifest`), service worker (`docs/sw.js`) i ikony (`docs/assets/icons/`, generowane przez `node tools/make-icons.mjs`). Chrome proponuje „Zainstaluj aplikację” tylko dla stron z HTTPS albo z `localhost`. Żeby zainstalować grę z telefonu w sieci domowej, w Chrome na Androidzie otwórz `chrome://flags`, w opcji **Insecure origins treated as secure** wpisz `http://<IP komputera>:8080`, ustaw **Enabled** i uruchom Chrome ponownie.

## GitHub Pages

GitHub Pages publikuje grę prosto z folderu `docs/` na gałęzi `main`, przy każdym pushu. Na stronę trafia tylko ten folder, w którym są wszystkie pliki gry. Notatki, skany rysunków (`assets/scans/`) i narzędzia (`tools/`) leżą poza nim, więc zostają poza stroną. Muzyka z `docs/assets/music/` jest w repozytorium, więc trafia też na stronę. Jeśli żadnego pliku piosenki nie ma, gra ukrywa przycisk nutki.

Jednorazowo w ustawieniach repozytorium: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, gałąź **main**, folder **/docs**.

## Struktura

- `docs/` – cała gra, publikowana na GitHub Pages
  - `index.html` – strona gry, ładuje Phaser i skrypty
  - `src/main.js` – konfiguracja `Phaser.Game`
  - `src/scenes/` – ekrany gry (start, postacie, terrarium, mapa, szpital, kuchnia)
  - `src/data/` – postacie i lista muzyki
  - `assets/icons/` – ikony aplikacji, `assets/music/` – muzyka (tylko lokalnie)
- `tools/` – serwer deweloperski i generator ikon
- `assets/scans/` – skany rysunków postaci (nie trafiają na stronę)
