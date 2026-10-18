# Świat Sióstr

Gra w Phaser 4 (ładowany z CDN, bez kroku budowania). Uruchamiana przez `python -m http.server 8080`.

## Praca z repo

- Po każdej zmianie rób commit, bez pytania o zgodę.

## Styl wizualny

- Grafika w stylu pixel art: niska rozdzielczość bazowa skalowana całkowitymi krotnościami, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- Gra zawsze wypełnia całe okno przeglądarki, bez pustych pasów. Zoom jest całkowity, a obszar gry rośnie ponad bazowe 384×216 (`fitToWindow` w `src/main.js`), więc układ scen liczymy względem `this.scale.width/height`, nie stałych współrzędnych.

- Używaj jasnej, pastelowej palety kolorów: jasne tła, miękkie pastele (róż, lawenda, mięta, brzoskwinia, błękit), bez ciemnych, nocnych ani nasyconych barw.
- Tekst musi pozostać czytelny na jasnym tle: dawaj mu ciemniejszy odcień z tej samej palety, a nie czerń.
