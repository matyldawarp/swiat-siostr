# Obrazki: `docs/assets/gfx/pracownia/pompony/`

Pracownia: pompony w siedmiu kolorach, bez buzi, z oczami i z uszami. 21 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](../README.md).

Pracownia plastyczna w domku Gabi (scena GabiCraftScene): tablica korkowa z kartką do ozdabiania, półki z farbami brokatowymi, girlandy z koralików, stół z pomponami-kotkami i Tekturzątko.

## `pracownia/pompony/pompon-brzoskwiniowy.png`
27×27 px, kotwica (13, 13). Pompon (pierwszy etap robienia pompona-kotka): puchata kulka. Koło r=12 `#ffc08a` z obrysem (koło r=13 w O) o środku (13, 13). Puszystość: pojedyncze piksele jaśniejszego koloru `#ffd79b` w: (13,13) (10,16) (14,4) (14,14) (7,12) (22,8) (12,16) (10,7) (24,17) (9,15) (17,5) (13,14) (8,10) (22,11) (12,15) (12,6) (21,20) (10,13) (19,7) (10,9) (22,14) (12,14) (14,7).

## `pracownia/pompony/pompon-brzoskwiniowy-oczy.png`
27×27 px, kotwica (13, 13). Pompon z doklejonymi ruchomymi oczkami (drugi etap). Jak `pompon-brzoskwiniowy.png` (te same jaśniejsze piksele, część zakryta), plus dwoje wielkich oczu o środkach (8, 10) i (18, 10): koło r=5 w O, w nim koło r=3 `#ffffff`, źrenica O 3×3 przesunięta w prawo-dół (x8–10 / x18–20, y10–12). Obrysy oczu stykają się w x13.

## `pracownia/pompony/pompon-brzoskwiniowy-uszy.png`
27×32 px, kotwica (13, 18). Gotowy pompon-kotek (trzeci etap): z oczkami, uszami, uśmiechem i rumieńcami. Kulka i oczy jak w `-oczy`, przesunięte o 5 px w dół (środek kulki (13, 18), oczy (8, 15) i (18, 15)). Uszy w kolorze pompona z obrysem (grow 1,5), rysowane pod kulką: lewe – trójkąt (2,2, 14,4), (3,4, 1,2), (11,2, 7,8), prawe lustrzane względem x=13; wystają ponad kulkę w y0–6. Uśmiech O: piksele (10, 23) i (16, 23) oraz kreska x11–14, y24. Rumieńce `#f59bbd` 3×1: x5–7 i x19–21, y21. Wzorzec (O obrys, `#` kolor pompona, c jaśniejszy, b biały, d rumieniec):

```
...O..................O....
...#O................O#....
...##O..............O##....
...###O............O###....
...####OO........OO####....
..O#####OO...O..OO#####O...
..O#####OOOOO#OOOOO####O...
..O###OO###########OO##O...
..O##O###############O#O...
..O#O#########c#######OO...
..OO####O########cO####O...
..O##OOOOOOOc##OOOOOOO##O..
.OO#OOOObOOOO#OOOObOOOO#OO.
.O#OOObbbbbOOOOObbbbbOOO#O.
.O#OObbbbbbbOOObbbbbbbOO#O.
O##OObbbOOObOOObbbOOObOO##O
O##OObbbOOObOOObbbOOObOO##O
O##OOObbOOOOOOOObbOOOOOO##O
O###OOOObOOOOcOOOObOOOO###O
O####OOOOOOOcccOOOOOOOc###O
O#######Oc##c#####O#######O
O####ddd##c#c######ddd####O
.O######################cO.
.O########O#####O########O.
.OO########OOOO#########OO.
..O##################c##O..
...O###################O...
....O#################O....
.....O###############O.....
......OO###########OO......
........OOOOO#OOOOO........
.............O.............
```

## `pracownia/pompony/pompon-fioletowy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#c3b3ea`, jaśniejsze piksele `#dccaff`.

## `pracownia/pompony/pompon-fioletowy-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#c3b3ea`, jaśniejsze `#dccaff`.

## `pracownia/pompony/pompon-fioletowy-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#c3b3ea` (także uszy), jaśniejsze `#dccaff`.

## `pracownia/pompony/pompon-malinowy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#f28aa5`, jaśniejsze `#ff9bba`.

## `pracownia/pompony/pompon-malinowy-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#f28aa5`, jaśniejsze `#ff9bba`.

## `pracownia/pompony/pompon-malinowy-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#f28aa5`, jaśniejsze `#ff9bba`.

## `pracownia/pompony/pompon-niebieski.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#9fd0f5`, jaśniejsze `#b3eaff`.

## `pracownia/pompony/pompon-niebieski-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#9fd0f5`, jaśniejsze `#b3eaff`.

## `pracownia/pompony/pompon-niebieski-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#9fd0f5`, jaśniejsze `#b3eaff`.

## `pracownia/pompony/pompon-rozowy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#f7b2cc`, jaśniejsze `#ffc8e5`.

## `pracownia/pompony/pompon-rozowy-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#f7b2cc`, jaśniejsze `#ffc8e5`.

## `pracownia/pompony/pompon-rozowy-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#f7b2cc`, jaśniejsze `#ffc8e5` (rumieńce `#f59bbd` są tu tylko trochę ciemniejsze od futerka).

## `pracownia/pompony/pompon-zielony.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#7fcf9a`, jaśniejsze `#92eeb1`.

## `pracownia/pompony/pompon-zielony-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#7fcf9a`, jaśniejsze `#92eeb1`.

## `pracownia/pompony/pompon-zielony-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#7fcf9a`, jaśniejsze `#92eeb1`.

## `pracownia/pompony/pompon-zolty.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy.png`, kolor `#fff09a`, jaśniejsze `#ffffac`.

## `pracownia/pompony/pompon-zolty-oczy.png`
27×27 px, kotwica (13, 13). Jak `pompon-brzoskwiniowy-oczy.png`, kolor `#fff09a`, jaśniejsze `#ffffac`.

## `pracownia/pompony/pompon-zolty-uszy.png`
27×32 px, kotwica (13, 18). Jak `pompon-brzoskwiniowy-uszy.png`, kolor `#fff09a`, jaśniejsze `#ffffac`.
