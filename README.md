# Świat Sióstr

Gra w przeglądarce oparta na [Phaser 4](https://phaser.io) (ładowanym z CDN, bez kroku budowania).

## Uruchomienie

Potrzebny jest Node.js (bez dodatkowych pakietów).

```bash
npm start
```

Następnie otwórz http://localhost:8080. Serwer ([tools/dev-server.mjs](tools/dev-server.mjs)) wyłącza cache, więc przycisk przeładowania w prawym górnym rogu gry zawsze wczytuje najnowsze pliki. `npm run dev` włącza auto-przeładowanie: serwer sam odświeża wszystkie podłączone przeglądarki po każdej zmianie pliku. Na innym urządzeniu w tej samej sieci Wi-Fi (np. iPad) otwórz `http://<IP komputera>:8080`.

## Struktura

- `index.html` – strona gry, ładuje Phaser i skrypty
- `src/main.js` – konfiguracja `Phaser.Game`
- `src/scenes/StartScene.js` – ekran początkowy
