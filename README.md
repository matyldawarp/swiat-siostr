# Świat Sióstr

Gra w przeglądarce oparta na [Phaser 4](https://phaser.io) (ładowanym z CDN, bez kroku budowania).

## Uruchomienie

Potrzebny jest Node.js (bez dodatkowych pakietów).

```bash
npm start
```

Następnie otwórz http://localhost:8080. Serwer ([tools/dev-server.mjs](tools/dev-server.mjs)) wyłącza cache, więc przycisk przeładowania w prawym górnym rogu gry zawsze wczytuje najnowsze pliki. `npm run dev` włącza auto-przeładowanie: serwer sam odświeża wszystkie podłączone przeglądarki po każdej zmianie pliku. Na innym urządzeniu w tej samej sieci Wi-Fi (np. iPad) otwórz `http://<IP komputera>:8080`.

## Instalacja jako aplikacja

Gra ma manifest (`public/manifest.webmanifest`), service worker (`public/sw.js`) i ikony (`public/assets/icons/`, generowane przez `node tools/make-icons.mjs`). Chrome proponuje „Zainstaluj aplikację” tylko dla stron z HTTPS albo z `localhost`. Żeby zainstalować grę z telefonu w sieci domowej, w Chrome na Androidzie otwórz `chrome://flags`, w opcji **Insecure origins treated as secure** wpisz `http://<IP komputera>:8080`, ustaw **Enabled** i uruchom Chrome ponownie.

## GitHub Pages

Workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) publikuje grę przy każdym pushu do `main`. Na stronę trafia tylko folder `public/`, w którym są wszystkie pliki gry. Notatki, skany rysunków (`assets/scans/`) i narzędzia (`tools/`) leżą poza nim, więc zostają poza stroną. Muzyka chroniona prawami autorskimi nie jest w repozytorium, więc na stronie jej nie ma, a gra wtedy ukrywa przycisk nutki.

Jednorazowo w ustawieniach repozytorium: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Struktura

- `public/` – cała gra, publikowana na GitHub Pages
  - `index.html` – strona gry, ładuje Phaser i skrypty
  - `src/main.js` – konfiguracja `Phaser.Game`
  - `src/scenes/` – ekrany gry (start, postacie, terrarium, mapa, szpital, kuchnia)
  - `src/data/` – postacie i lista muzyki
  - `assets/icons/` – ikony aplikacji, `assets/music/` – muzyka (tylko lokalnie)
- `tools/` – serwer deweloperski i generator ikon
- `assets/scans/` – skany rysunków postaci (nie trafiają na stronę)
