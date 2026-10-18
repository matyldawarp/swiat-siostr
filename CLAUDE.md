# Świat Sióstr

Gra w Phaser 4 (ładowany z CDN, bez kroku budowania). Uruchamiana przez `python tools/dev_server.py 8080`. Ten serwer nasłuchuje w sieci lokalnej, żeby dało się grać z iPada, i po każdej zmianie pliku sam przeładowuje wszystkie podłączone przeglądarki, więc po zmianach nie trzeba niczego odświeżać ręcznie.

## Praca z repo

- Po każdej zmianie rób commit, bez pytania o zgodę.

## Styl wizualny

- Grafika w stylu pixel art: niska rozdzielczość bazowa skalowana całkowitymi krotnościami, `pixelArt: true` w konfiguracji gry, ostre krawędzie bez wygładzania i gradientów, czcionki pikselowe.
- Gra zawsze wypełnia całe okno przeglądarki, bez pustych pasów. Zoom jest całkowity i liczony względem bazowych 576×324 w dowolnej orientacji (`fitToWindow` w `src/main.js`), a obszar gry rośnie ponad tę bazę. Piksele nie mogą być zbyt grube: na iPadzie zoom ma wynosić 2, nie więcej. Obszar gry jest zmienny, więc układ scen liczymy względem `this.scale.width/height`, nie stałych współrzędnych.

- Używaj jasnej, pastelowej palety kolorów: jasne tła, miękkie pastele (róż, lawenda, mięta, brzoskwinia, błękit), bez ciemnych, nocnych ani nasyconych barw.
- Tekst musi pozostać czytelny na jasnym tle: dawaj mu ciemniejszy odcień z tej samej palety, a nie czerń.
