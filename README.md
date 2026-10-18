# Świat Sióstr

Gra w przeglądarce oparta na [Phaser 4](https://phaser.io) (ładowanym z CDN, bez kroku budowania).

## Uruchomienie

```bash
python -m http.server 8080 --bind 127.0.0.1
```

Następnie otwórz http://localhost:8080.

## Struktura

- `index.html` – strona gry, ładuje Phaser i skrypty
- `src/main.js` – konfiguracja `Phaser.Game`
- `src/scenes/StartScene.js` – ekran początkowy
