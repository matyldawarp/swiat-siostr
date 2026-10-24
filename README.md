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

## Ekrany

Strzałki pokazują, dokąd można przejść z danego ekranu. Z każdego ekranu niżej przycisk powrotu prowadzi o poziom wyżej. W nawiasach jest adres ekranu po `#`.

```mermaid
flowchart TD
    start["Start (#start)"] --> postacie["Wybór postaci (#postacie)"]
    postacie --> terrarium["Terrarium (#terrarium)"]
    terrarium --> kuchnia["Kuchnia (#kuchnia)"]
    terrarium --> mapa["Mapa (#mapa)"]
    mapa --> szpital["Szpital (#szpital)"]
    mapa --> cukiernia["Cukiernia (#cukiernia)"]
    mapa --> dentysta["Dentysta (#dentysta)"]
    mapa --> kolorowanki["Kolorowanki: grupy (#kolorowanki)"]
    kolorowanki --> grupa["Grupa kolorowanek (#kolorowanki/grupa)"]
    grupa --> strona["Kolorowanka (#kolorowanki/grupa/nazwa-strony)"]
```

Z mapy da się też pójść z powrotem do domu, czyli do terrarium. Zębatka Ustawień jest tylko na ekranach Start i Wybór postaci. Przycisk przeładowania w prawym górnym rogu zawsze wraca na Start.

## Struktura

- `docs/` – cała gra, publikowana na GitHub Pages
  - `index.html` – strona gry, ładuje Phaser i skrypty
  - `src/main.js` – konfiguracja `Phaser.Game`, importuje resztę kodu (moduły ES)
  - `src/scenes/` – ekrany gry (start, postacie, terrarium, mapa, szpital, kuchnia), `terrarium/` – części terrarium
  - `src/ui/`, `src/gfx/`, `src/audio/` – wspólne elementy interfejsu, grafika i dźwięk
  - `src/data/` – postacie i lista muzyki
  - `assets/icons/` – ikony aplikacji, `assets/music/` – muzyka (tylko lokalnie)
- `tools/` – serwer deweloperski, generator ikon, `check.mjs` (`npm run check`: szybka kontrola kodu i danych) i `add-song.mjs` (dodawanie piosenki z YouTube)
- `assets/scans/` – skany rysunków postaci (nie trafiają na stronę)
