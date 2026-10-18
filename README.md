# Świat Sióstr

Gra w przeglądarce oparta na [Phaser 4](https://phaser.io) (ładowanym z CDN, bez kroku budowania).

## Uruchomienie

```bash
python tools/dev_server.py 8080
```

Następnie otwórz http://localhost:8080. Serwer obserwuje pliki projektu i po każdej zmianie sam przeładowuje wszystkie podłączone przeglądarki. Na innym urządzeniu w tej samej sieci Wi-Fi (np. iPad) otwórz `http://<IP komputera>:8080`.

## Struktura

- `index.html` – strona gry, ładuje Phaser i skrypty
- `src/main.js` – konfiguracja `Phaser.Game`
- `src/scenes/StartScene.js` – ekran początkowy
