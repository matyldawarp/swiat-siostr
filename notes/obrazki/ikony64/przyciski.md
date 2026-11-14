# Obrazki: `docs/assets/gfx/ikony64/przyciski/`

Ikony 64 na pozostałych przyciskach: ustawienia, muzyka, powrót, narzędzia szpitala i dentysty, pokoje Gabi, osobowości. 25 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](../README.md).

Ikony 64 – obrazki na przyciskach w całej grze (wstecz, ustawienia, muzyka, składniki w kuchni i cukierni, narzędzia w szpitalu i u dentysty, odznaki osobowości na ekranie postaci, przyciski pokoi w windzie Gabi). Płótno 64×64, kotwica w środku (32, 32), tło przezroczyste. Rysunek mieści się w środkowych 58×58 (środek rysunku = punkt (32, 32)); każdy ciemny piksel (jasność < 130: #6b4a5e, #7a3f63) po narysowaniu „rozlewa się” na sąsiadów z lewej, prawej, góry i dołu, więc ciemne linie mają 3 px grubości. Kolory: obrys #6b4a5e, ciemne ikony przycisków #7a3f63. Pod opisem siatka RLE (dokładna).

## `ikony64/przyciski/cofnij.png`
64×64 px, kotwica (32, 32). Przycisk „cofnij” w kolorowankach. Gruba strzałka zawracająca w lewo: łuk otwarty w dół (od prawego dołu przez górę) zakończony grotem skierowanym w lewo‑dół, cała jednolita #7a3f63, bez obrysu.

Siatka RLE wycinka x 7–52, y 18–42 (46×25; reszta płótna przezroczysta; legenda: A = #7a3f63 (536 px)):

```
21.9A
18.15A
16.19A
14.23A
13.25A
12.27A
11.29A
10.31A
9.33A
8.14A7.14A
8.12A11.12A
7.11A15.11A
7.10A17.10A
.19A15.10A
21A14.10A
.19A16.9A
2.17A17.10A
3.15A19.9A
4.13A20.9A
5.11A21.9A
6.9A22.9A
7.7A23.9A
8.5A25.7A
9.3A
10.A
```

## `ikony64/przyciski/drukarka.png`
64×64 px, kotwica (32, 32). Przycisk „drukuj” w kolorowankach. Drukarka: biała kartka wystająca u góry, lawendowy korpus #d9ccf5 z obrysem #6b4a5e, pod spodem wychodzi biała kartka #ffffff z różowym serduszkiem #f59bbd.

Siatka RLE wycinka x 8–55, y 11–61 (48×51; reszta płótna przezroczysta; legenda: A = #d9ccf5 (708 px), B = #6b4a5e (624 px), C = #ffffff (492 px), D = #f59bbd (108 px), E = #a6dcc4 (4 px)):

```
10.28B
9.30B
9.30B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
9.3B24C3B
.46B
48B
48B
3B42A3B
3B40A2E3B
3B40A2E3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B42A3B
3B7AB26AB7A3B
12B24C12B
12B24C12B
.11B24C11B
9.3B24C3B
9.3B7C4D2C4D7C3B
9.3B7C4D2C4D7C3B
9.3B5C14D5C3B
9.3B5C14D5C3B
9.3B5C14D5C3B
9.3B5C14D5C3B
9.3B7C10D7C3B
9.3B7C10D7C3B
9.3B9C6D9C3B
9.3B9C6D9C3B
9.3B11C2D11C3B
9.3B11C2D11C3B
9.3B24C3B
9.3B24C3B
9.30B
9.30B
10.28B
```

## `ikony64/przyciski/glosnik.png`
64×64 px, kotwica (32, 32). Przycisk „powtórz głos” w szkole. Głośnik: biały (#ffffff) prostokąt i lejek skierowany w prawo, gruby obrys #6b4a5e; po prawej łukowata fala dźwięku #6b4a5e.

Siatka RLE wycinka x 6–61, y 6–57 (56×52; reszta płótna przezroczysta; legenda: A = #6b4a5e (1039 px), B = #ffffff (442 px)):

```
32.A
31.3A
30.4A
28.6A
27.7A
26.8A
25.9A
23.11A14.4A
22.12A13.6A
21.13A13.6A
20.7A2B5A13.6A
18.8A3B5A13.8A
17.8A4B5A14.8A
16.7A6B5A16.6A
.21A7B5A10.4A2.6A
21A8B5A9.6A.6A
19A10B5A9.6A.6A
18A11B5A9.6A.6A
17A12B5A7.8A.6A
15A14B5A6.8A2.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
5A24B5A6.6A4.6A
15A14B5A6.8A2.6A
17A12B5A6.9A.6A
18A11B5A7.8A.6A
19A10B5A9.6A.6A
21A8B5A9.6A.6A
.21A7B5A10.4A2.6A
16.7A6B5A16.6A
17.8A4B5A16.6A
18.8A3B5A14.8A
20.7A2B5A13.8A
21.13A13.6A
22.12A13.6A
23.11A13.6A
25.9A14.4A
26.8A
27.7A
28.6A
30.4A
31.3A
32.A
```

## `ikony64/przyciski/ksiezyc.png`
64×64 px, kotwica (32, 32). Przycisk „odpoczynek” w szpitalu. Sierp księżyca otwarty w prawo, #fff1c9, obrys #6b4a5e, w prawym górnym rogu mały krzyżyk‑gwiazdka #f6d98b.

Siatka RLE wycinka x 3–53, y 8–56 (51×49; reszta płótna przezroczysta; legenda: A = #fff1c9 (690 px), B = #6b4a5e (417 px), C = #f6d98b (9 px)):

```
24.B
18.8B
15.12B
13.13B
12.6B4A3B
10.5B6A3B
9.4B7A4B24.C
8.4B8A3B25.C
7.4B8A3B24.5C
6.3B10A3B26.C
5.4B9A4B26.C
5.3B10A3B
4.3B11A3B
3.3B12A3B
3.3B12A3B
2.3B13A3B
2.3B12A3B
2.3B13A3B
.3B14A3B
.3B14A3B
.3B14A3B
.3B14A3B
.3B14A4B
.3B15A3B
3B16A3B
.3B16A3B
.3B16A4B
.3B17A3B
.3B18A3B
.3B19A3B
.3B20A4B
2.3B20A4B
2.3B21A6B11.3B
2.3B22A10B.9B
3.3B23A17B
3.3B25A15B
4.3B30AB4A3B
5.3B33A3B
5.4B31A4B
6.3B31A3B
7.4B27A4B
8.4B25A4B
9.4B23A4B
10.5B19A5B
12.6B13A6B
13.11BA11B
15.19B
18.13B
24.B
```

## `ikony64/przyciski/kubek.png`
64×64 px, kotwica (32, 32). Kubek do płukania u dentysty. Szeroki kubek lekko zwężający się w dół, obrys #6b4a5e, w środku miętowa woda #bfe8d6, nad nią jasnoniebieskie szkło #cfe8ff, białe błyski #ffffff.

Siatka RLE wycinka x 14–50, y 13–51 (37×39; reszta płótna przezroczysta; legenda: A = #bfe8d6 (558 px), B = #6b4a5e (392 px), C = #cfe8ff (307 px), D = #ffffff (30 px)):

```
.35B
37B
37B
3B31C3B
3BC2D28C3B
3BC2D28C3B
3BC2D28C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27C3B
.3B2D27A3B
.3B2D27A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3BD26A3B
2.3B27A3B
2.3B27A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
3.3B25A3B
4.3B23A3B
4.3B23A3B
4.3B23A3B
4.29B
4.29B
5.27B
```

## `ikony64/przyciski/lusterko.png`
64×64 px, kotwica (32, 32). Lusterko dentystyczne. Okrągłe lusterko #cfe8ff z białym błyskiem #ffffff i obrysem #6b4a5e w prawym górnym rogu, od niego ukośny cienki trzonek #6b4a5e w lewy dół.

Siatka RLE wycinka x 12–56, y 8–55 (45×48; reszta płótna przezroczysta; legenda: A = #cfe8ff (373 px), B = #6b4a5e (369 px), C = #ffffff (36 px)):

```
30.B
25.11B
23.15B
22.8BA8B
21.4B11A4B
20.3B15A3B
19.3B17A3B
18.3B19A3B
17.4B3A6C10A4B
17.3B4A6C11A3B
17.3B4A6C11A3B
16.3B5A6C12A3B
16.3B5A6C12A3B
16.3B5A6C12A3B
16.3B23A3B
16.3B23A3B
16.3B23A3B
16.3B23A3B
17.3B21A3B
17.3B21A3B
17.4B19A4B
18.3B19A3B
19.3B17A3B
20.3B15A3B
20.5B11A4B
19.11BA8B
18.20B
17.7B.11B
16.7B7.B
15.7B
14.7B
13.7B
12.7B
11.7B
10.7B
9.7B
8.7B
7.7B
6.7B
5.7B
4.7B
3.7B
2.7B
.7B
7B
6B
5B
.3B
```

## `ikony64/przyciski/lyzka.png`
64×64 px, kotwica (32, 32). Łyżka syropu w szpitalu. Łyżka leżąca poziomo: okrągła czerpak po lewej pełen różowego syropu #f59bbd (biały błysk 1 px), lawendowe brzegi #d9ccf5, w prawo długi lawendowy trzonek, wszystko z obrysem #6b4a5e.

Siatka RLE wycinka x 2–60, y 17–47 (59×31; reszta płótna przezroczysta; legenda: A = #6b4a5e (412 px), B = #f59bbd (400 px), C = #d9ccf5 (193 px), D = #ffffff (1 px)):

```
15.A
10.11A
8.15A
6.9AC9A
5.5A5CB5C5A
4.4A2C11B2C4A
3.4A2C13B2C4A
3.3AC17BC3A
2.3A2C17B2C3A
.3A2C19B2C3A
.3AC21BC31A
.3AC6BD14BC32A
3AC23BC31A
3AC23B29C3A
3AC23B29C3A
3AC23B29C3A
3AC23B29C3A
3AC23B2C30A
3AC23BC31A
.3AC21BC31A
.3AC21BC3A
.3A2C19B2C3A
2.3A2C17B2C3A
3.3AC17BC3A
3.4A2C13B2C4A
4.4A2C11B2C4A
5.5A5CB5C5A
6.9AC9A
8.15A
10.11A
15.A
```

## `ikony64/przyciski/mapa.png`
64×64 px, kotwica (32, 32). Przycisk „mapa” w terrarium. Złożona mapa z trzech pionowych pasów: miętowy #bfe8d6, brzoskwiniowy #ffe1c4 (środkowy, 2 px niżej), miętowy; obrys #6b4a5e; różowa kropkowana trasa #f59bbd z lewego dołu w prawo w górę do małego różowego serduszka w prawym pasie.

Siatka RLE wycinka x 3–62, y 9–56 (60×48; reszta płótna przezroczysta; legenda: A = #bfe8d6 (1245 px), B = #6b4a5e (844 px), C = #ffe1c4 (632 px), D = #f59bbd (43 px)):

```
.20B18.20B
22B16.22B
60B
3B16A22B16A3B
3B16A22B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B6A2DA2D5A3B
3B16A3B16C3B5A7D4A3B
3B16A3B16C3B5A7D4A3B
3B16A3B16C3B6A5D5A3B
3B16A3B15CD3B7A3D6A3B
3B16A3B15CD3B8AD7A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B7C2D7C3B16A3B
3B16A3B7C2D7C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3BD15C3B16A3B
3B16A3BD15C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B9A2D5A3B16C3B16A3B
3B9A2D5A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3B16A3B16C3B16A3B
3BA2D13A3B16C3B16A3B
3BA2D13A3B16C3B16A3B
3B16A3B16C3B16A3B
22B16C22B
22B16C22B
.58B
19.22B
20.20B
```

## `ikony64/przyciski/nowa-kartka.png`
64×64 px, kotwica (32, 32). Przycisk „nowa kartka” w pracowni Gabi. Pionowa biała kartka #ffffff z grubym obrysem #6b4a5e, w prawym górnym rogu mała gwiazdka #fff1c9 z obrysem.

Siatka RLE wycinka x 14–50, y 8–55 (37×48; reszta płótna przezroczysta; legenda: A = #ffffff (891 px), B = #6b4a5e (767 px), C = #fff1c9 (94 px)):

```
3.31B
2.33B
.35B
37B
4B29A4B
4B20A2B7A4B
4B19A4B6A4B
4B19A4B6A4B
4B18A6B5A4B
4B18A6B5A4B
4B17A3B2C3B4A4B
4B15A5B2C5B2A4B
4B10A9B4C10B
4B9A9B6C9B
4B10A5B12C6B
4B11A3B14C5B
4B12A3B12C6B
4B13A3B10C7B
4B14A3B8C3BA4B
4B14A3B8C3BA4B
4B14A3B8C3BA4B
4B14A3B3C2B3C3BA4B
4B14A3BC6BC3BA4B
4B13A20B
4B13A7B2A11B
4B13A5B6A9B
4B13A3B10A7B
4B14AB12ABA4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
4B29A4B
37B
.35B
2.33B
3.31B
```

## `ikony64/przyciski/nutka.png`
64×64 px, kotwica (32, 32). Przycisk muzyki (muzyka włączona). Nutka ósemka #7a3f63: okrągła główka w lewym dole, pionowy ogonek w górę, chorągiewka opadająca w prawo; bez obrysu.

Siatka RLE wycinka x 15–51, y 9–55 (37×47; reszta płótna przezroczysta; legenda: A = #7a3f63 (669 px)):

```
18.10A
17.12A
17.13A
17.13A
17.14A
17.14A
17.7A.7A
17.7A2.7A
17.7A2.7A
17.7A3.7A
17.7A3.7A
17.7A4.7A
17.7A5.7A
17.7A5.7A
17.7A6.7A
17.7A6.7A
17.7A7.5A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
17.7A
10.A6.7A
6.9A2.7A
4.20A
3.21A
2.22A
2.22A
.23A
.23A
24A
24A
23A
21A
21A
.19A
.19A
2.17A
2.17A
3.15A
4.13A
6.9A
10.A
```

## `ikony64/przyciski/nutka-wylaczona.png`
64×64 px, kotwica (32, 32). Przycisk muzyki (muzyka wyłączona). Nutka jak w `ikony64/przyciski/nutka.png` przekreślona grubym ukosem #7a3f63 z lewego górnego rogu do prawego dolnego, ukos obwiedziony białym #ffffff brzegiem.

Siatka RLE wycinka x 4–63, y 4–63 (60×60; reszta płótna przezroczysta; legenda: A = #7a3f63 (1265 px), B = #ffffff (311 px)):

```
10B
2B6A3B
B8A3B
B9A3B
B10A3B
B11A3B14.10A
B12A3B12.12A
B13A3B11.13A
2B13A3B10.13A
3B13A3B9.14A
.3B13A3B8.14A
2.3B13A3B7.7A.7A
3.3B13A3B6.7A2.7A
4.3B13A3B5.7A2.7A
5.3B13A3B4.7A3.7A
6.3B13A3B3.7A3.7A
7.3B13A3B2.7A4.7A
8.3B13A3B.7A5.7A
9.3B13A3B7A5.7A
10.3B13A2B7A6.7A
11.3B13A2B6A6.7A
12.3B13A2B5A7.5A
13.3B13A2B4A
14.3B13A2B3A
15.3B13A2BA
16.3B13A3B
17.3B13A3B
18.3B13A3B
19.3B13A3B
20.3B13A3B
21.3B13A3B
21.A3B13A3B
17.7A2B13A3B
15.10A2B13A3B
14.12A2B13A3B
13.14A2B13A3B
13.15A2B13A3B
12.17A2B13A3B
12.18A2B13A3B
11.20A2B13A3B
11.21A2B13A3B
11.21A3B13A3B
11.21A.3B13A3B
11.21A2.3B13A3B
12.19A4.3B13A3B
12.19A5.3B13A3B
13.17A7.3B13A3B
13.17A8.3B13A3B
14.15A10.3B13A3B
15.13A12.3B13A3B
17.9A15.3B13A3B
21.A20.3B13A2B
43.3B13AB
44.3B13A
45.3B12A
46.3B11A
47.3B10A
48.3B9A
49.3B8A
50.3B7A
```

## `ikony64/przyciski/odswiez.png`
64×64 px, kotwica (32, 32). Przycisk „wczytaj grę od nowa” w ustawieniach. Gruby okrąg #7a3f63 z przerwą u góry po prawej i grotem strzałki na końcu (strzałka zgodnie z ruchem wskazówek zegara).

Siatka RLE wycinka x 8–56, y 4–57 (49×54; reszta płótna przezroczysta; legenda: A = #7a3f63 (1141 px)):

```
27.A
26.3A
26.4A
26.5A
26.6A
20.13A
16.18A
14.21A
12.24A
11.26A
9.29A
8.29A
7.29A
6.29A
5.29A
5.16A5.7A
4.14A8.6A
3.13A10.5A
3.12A11.4A
2.12A12.3A
2.11A14.A18.A
.11A32.4A
.11A29.7A
.10A28.9A
.10A27.10A
11A27.11A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
10A29.10A
11A27.11A
.10A27.10A
.10A27.10A
.11A25.11A
.11A25.11A
2.11A23.11A
2.12A21.12A
3.12A19.12A
3.13A17.13A
4.14A13.14A
5.16A7.16A
5.39A
6.37A
7.35A
8.33A
9.31A
11.27A
12.25A
14.21A
16.17A
20.9A
```

## `ikony64/przyciski/osobowosc-czyscioszek.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „czyścioszek”. Trzy bańki mydlane różnej wielkości (duża po lewej, średnia po prawej u góry, mała na dole), #cfe8ff z obrysem #6b4a5e i białym kwadratowym błyskiem #ffffff w lewym górnym rogu każdej.

Siatka RLE wycinka x 5–59, y 11–59 (55×49; reszta płótna przezroczysta; legenda: A = #cfe8ff (1110 px), B = #6b4a5e (576 px), C = #ffffff (50 px)):

```
40.B
35.11B
33.15B
32.8BA8B
31.4B11A4B
30.3B15A3B
29.3B17A3B
28.3B19A3B
27.4B3A4C12A4B
27.3B4A4C13A3B
27.3B4A4C13A3B
17.B8.3B5A4C14A3B
11.13B2.3B23A3B
9.20B23A3B
8.9BA11B23A3B
6.6B11A6B23A3B
5.5B15A4B23A3B
4.4B18A3B23A3B
4.3B20A3B21A3B
3.3B21A3B21A3B
2.3B4A5C13A4B19A4B
2.3B4A5C14A3B19A3B
.3B5A5C15A3B17A3B
.3B5A5C16A3B15A3B
.3B5A5C17A4B11A4B
3B29A8BA8B
3B29A16B
3B29A14B
3B29A3B5.B
3B27A9B
3B25A13B
3B24A7BA7B
.3B22A4B9A4B
.3B22A3B11A3B
.3B21A3B2A3C8A3B
2.3B20A3B2A3C8A3B
2.3B19A3B3A3C9A3B
3.3B18A3B15A3B
4.3B17A3B15A3B
4.4B16A3B15A3B
5.5B14A3B15A3B
6.6B11A5B13A3B
8.9BA10B13A3B
9.20B11A3B
11.13B2.4B9A4B
17.B9.7BA7B
28.13B
30.9B
34.B
```

## `ikony64/przyciski/osobowosc-lasuch.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „łasuch”: ziarenko słonecznika (szara łupina #8d7f99, jasny pasek #f3eef8, gruby obrys #6b4a5e), większe niż `ikony64/torty-postaci/dodatek-mordka.png`.

Siatka RLE wycinka x 14–50, y 7–57 (37×51; reszta płótna przezroczysta; legenda: A = #6b4a5e (730 px), B = #8d7f99 (300 px), C = #f3eef8 (147 px)):

```
15.7A
14.9A
14.9A
14.9A
14.9A
14.9A
14.9A
8.21A
7.23A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
8.7A7C7A
8.7B7C7B
8.7B7C7B
8.7B7C7B
8.7B7C7B
8.7B7C7B
.7A7B7C7B7A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
9A6B7C6B9A
15A7C15A
.15A5B15A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.9A5B9A
7.23A
8.21A
14.9A
14.9A
14.9A
14.9A
14.9A
14.9A
15.7A
```

## `ikony64/przyciski/osobowosc-przytulas.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „przytulas”: serduszko, piksel w piksel jak `ikony64/torty-postaci/dodatek-harry.png`.

Piksel w piksel taki sam jak `ikony64/torty-postaci/dodatek-harry.png`.

## `ikony64/przyciski/osobowosc-spioch.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „śpioch”: księżyc, piksel w piksel jak `ikony64/przyciski/ksiezyc.png`.

Piksel w piksel taki sam jak `ikony64/przyciski/ksiezyc.png`.

## `ikony64/przyciski/osobowosc-wesolek.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „wesołek”: gwiazdka, piksel w piksel jak `ikony64/torty-postaci/dodatek-gabi.png`.

Piksel w piksel taki sam jak `ikony64/torty-postaci/dodatek-gabi.png`.

## `ikony64/przyciski/osobowosc-wiercipieta.png`
64×64 px, kotwica (32, 32). Odznaka osobowości „wiercipięta”. Zygzakowata błyskawica od góry do dołu (górny koniec w prawo od środka, dolny w lewo), #f6d98b z obrysem #6b4a5e.

Siatka RLE wycinka x 9–54, y 0–63 (46×64; reszta płótna przezroczysta; legenda: A = #f6d98b (512 px), B = #6b4a5e (430 px)):

```
26.3B
26.3B
25.4B
24.5B
24.5B
23.5B
22.5BA
21.6BA
21.5B2A
20.5B2A
19.6B2A
19.5B3A
18.5B4A
17.6B4A
17.5B4A
16.5B5A
15.6B5A
14.6B6A
14.5B7A
13.6B7A
12.6B7A
12.5B8A
11.6B8A
10.6B9A
9.6B9A
9.6B9A16.5B
8.6B25A7B
7.6B26A6B
7.6B25A6B
6.6B25A7B
5.6B26A6B
5.6B25A6B
4.6B25A6B
3.6B26A6B
2.7B25A6B
2.6B25A6B
.6B26A6B
7B25A6B
.5B16.9A6B
21.10A6B
21.9A6B
21.8A6B
21.8A5B
21.7A6B
20.7A6B
20.7A5B
20.6A6B
20.5A6B
20.5A5B
20.4A5B
19.4A6B
19.4A5B
19.3A5B
19.2A6B
18.3A5B
18.2A5B
18.A6B
18.A5B
18.5B
17.5B
17.5B
17.4B
17.3B
17.3B
```

## `ikony64/przyciski/plaster.png`
64×64 px, kotwica (32, 32). Plaster w szpitalu. Poziomy zaokrąglony prostokąt #ffd6b8 z obrysem #6b4a5e, w środku jaśniejsza poduszeczka #fff1e0, po obu stronach po trzy różowe kropki #f7b2cc (dziurki).

Siatka RLE wycinka x 2–61, y 19–44 (60×26; reszta płótna przezroczysta; legenda: A = #6b4a5e (600 px), B = #ffd6b8 (570 px), C = #fff1e0 (360 px), D = #f7b2cc (6 px)):

```
3.54A
2.56A
.58A
60A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4AD3BD11B20C11BD3BD4A
4A2BD13B20C13BD2B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
4A16B20C16B4A
60A
.58A
2.56A
3.54A
```

## `ikony64/przyciski/pokoj-kuchnia.png`
64×64 px, kotwica (32, 32). Przycisk kuchni w windzie Gabi. Babeczka: papierowa foremka #ffd6b8 w pionowe paski #f5c09a, na niej różowy krem #f59bd0 w trzech warstwach (zwężających się ku górze) z białymi błyskami, kolorowa posypka (#a6dcc4, #c3b3ea, #f59bbd, #f6d98b), obrys #6b4a5e.

Siatka RLE wycinka x 9–55, y 17–57 (47×41; reszta płótna przezroczysta; legenda: A = #f59bd0 (525 px), B = #6b4a5e (483 px), C = #ffd6b8 (281 px), D = #f5c09a (92 px), E = #ffffff (6 px), F = #a6dcc4 (4 px), G = #c3b3ea (4 px), H = #f59bbd (4 px), I = #f6d98b (4 px)):

```
23.B
17.13B
16.15B
14.9BA9B
13.5B11A5B
13.3B3A2E10A3B
11.4B17A4B
9.6B9A2F6A6B
8.6B19A6B
7.4B25A4B
6.3B6A2E21A3B
5.3B23A2G6A3B
5.3B5A2H24A3B
5.3B11A2I18A3B
3.5B31A5B
2.5B33A5B
.4B8A2E27A4B
3B19A2G9A2F9A3B
3B6A2H33A3B
3B35A2I4A3B
.4B37A4B
2.5B33A5B
3.8B25A8B
3.20BA20B
4.3BC31BC3B
4.3BCD3C23BCD3C3B
4.3BCD3CD3CD3CD2CBD3CD3CD3CD3C3B
4.3BCD3CD3CD3CD3CD3CD3CD3CD3C3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
5.3BCD3CD3CD3CD3CD3CD3CD3CDC3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
6.3BCD3CD3CD3CD3CD3CD3CD3C3B
7.3BCD3CD3CD3CD3CD3CD3CDC3B
7.33B
7.33B
8.31B
```

## `ikony64/przyciski/pokoj-pracownia.png`
64×64 px, kotwica (32, 32). Przycisk pracowni w windzie Gabi. Paleta malarska: owal #f3dcc4 z obrysem #6b4a5e, pięć kółek farby (#fff09a, #9fd0f5, #f28aa5, #7fcf9a, #c3b3ea) i otwór na kciuk w prawym dole (biały środek #fff7fb).

Siatka RLE wycinka x 3–61, y 9–55 (59×47; reszta płótna przezroczysta; legenda: A = #f3dcc4 (1098 px), B = #6b4a5e (525 px), C = #fff09a (89 px), D = #9fd0f5 (89 px), E = #f28aa5 (89 px), F = #7fcf9a (89 px), G = #c3b3ea (86 px), H = #fff7fb (60 px)):

```
29.B
21.17B
17.25B
15.14BA14B
13.8B17A8B
11.7B23A7B
10.5B29A5B
9.4B33A4B
7.5B35A5B
6.4B14AC24A4B
5.4B12A7C7AD14A4B
5.3B12A9C3A7D12A3B
4.3B12A11CA9D12A3B
3.3B13A11C11D12A3B
2.4B13A11C11D12A4B
2.3B14A11C11D13A3B
.4B11AE2A11C11D13A4B
.3B9A7E9CA11D2AG11A3B
.3B8A9E7C3A9D7G8A3B
3B8A11E2AC7A7D9G8A3B
3B8A11E13AD2A11G7A3B
3B8A11E16A11G7A3B
3B8A11E16A11G7A3B
3B8A11E16A11G7A3B
3B9A9E17AB10G7A3B
3B10A7E17A3B8G8A3B
3B13AE3AF15A3BH6GB9A3B
3B14A7F11A3B5HGH3B8A3B
.3B12A9F9A3B9H3B6A3B
.3B11A11F8A3B9H3B6A3B
.4B10A11F8A3B9H3B5A4B
2.3B10A11F8A3B9H3B5A3B
2.4B9A11F8A3B9H3B4A4B
3.3B9A11F9A3B7H3B5A3B
4.3B9A9F11A5BH5B5A3B
5.3B9A7F13A9B5A3B
5.4B11AF17A7B5A4B
6.4B31AB7A4B
7.5B35A5B
9.4B33A4B
10.5B29A5B
11.7B23A7B
13.8B17A8B
15.14BA14B
17.25B
21.17B
29.B
```

## `ikony64/przyciski/szczoteczka.png`
64×64 px, kotwica (32, 32). Szczoteczka do zębów u dentysty. Leży poziomo: długa różowa rączka #f7b2cc z ciemniejszym paskiem #f59bbd, z obrysem #6b4a5e; po prawej główka z białym włosiem #ffffff w pionowe paski i niebieskimi akcentami #cfe8ff.

Siatka RLE wycinka x 4–59, y 25–48 (56×24; reszta płótna przezroczysta; legenda: A = #6b4a5e (438 px), B = #f7b2cc (290 px), C = #ffffff (110 px), D = #cfe8ff (55 px), E = #f59bbd (26 px)):

```
36.19A
35.21A
35.21A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
35.3AD2CD2CD2CD2CD2C3A
.37AD2CD2CD2CD2CD2C3A
38AD2CD2CD2CD2CD2C3A
37A16B3A
3A50B3A
3A50B3A
3A50B3A
3AB26E23B3A
3A50B3A
3A50B3A
56A
56A
.54A
```

## `ikony64/przyciski/termometr.png`
64×64 px, kotwica (32, 32). Termometr w szpitalu. Pionowa biała rurka #ffffff z obrysem #6b4a5e, na dole okrągła różowa bańka #f59bbd, różowy słupek od bańki do ok. 1/4 wysokości, z prawej trzy lawendowe kreski skali #c3b3ea.

Siatka RLE wycinka x 19–45, y 1–62 (27×62; reszta płótna przezroczysta; legenda: A = #6b4a5e (433 px), B = #f59bbd (405 px), C = #ffffff (287 px), D = #c3b3ea (3 px)):

```
6.14A
5.16A
5.16A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A9CD3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A9CD3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A10C3A
5.3A2C6B2C3A
5.3A2C6BCD3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.3A2C6B2C3A
5.4A9B4A
4.4A11B4A
3.4A13B4A
2.4A15B4A
2.3A17B3A
.3A19B3A
.3A19B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
3A21B3A
.3A19B3A
.3A19B3A
2.3A17B3A
2.4A15B4A
3.4A13B4A
4.4A11B4A
5.8AB8A
6.15A
8.11A
13.A
```

## `ikony64/przyciski/wstecz.png`
64×64 px, kotwica (32, 32). Przycisk „wstecz” na każdym ekranie. Gruba strzałka w lewo: trójkątny grot po lewej i prostokątny trzon w prawo, #f59bbd z obrysem #6b4a5e.

Siatka RLE wycinka x 2–62, y 6–57 (61×52; reszta płótna przezroczysta; legenda: A = #f59bbd (1042 px), B = #6b4a5e (484 px)):

```
26.B
25.3B
24.5B
23.6B
22.3BA3B
21.3B2A3B
20.3B3A3B
19.3B4A3B
18.3B5A3B
17.3B6A3B
16.3B7A3B
15.3B8A3B
13.4B9A3B
12.4B10A3B
11.4B11A3B
10.3B13A33B
9.3B14A34B
8.3B16A34B
7.3B48A3B
6.3B49A3B
5.3B50A3B
4.3B51A3B
3.3B52A3B
2.3B53A3B
.3B54A3B
3B55A3B
3B55A3B
.3B54A3B
2.3B53A3B
3.3B52A3B
4.3B51A3B
5.3B50A3B
6.3B49A3B
7.3B48A3B
8.3B16A34B
9.3B14A34B
10.3B13A33B
11.4B11A3B
12.4B10A3B
13.4B9A3B
15.3B8A3B
16.3B7A3B
17.3B6A3B
18.3B5A3B
19.3B4A3B
20.3B3A3B
21.3B2A3B
22.3BA3B
23.6B
24.5B
25.3B
26.B
```

## `ikony64/przyciski/zebatka.png`
64×64 px, kotwica (32, 32). Przycisk ustawień. Zębatka #7a3f63: pierścień z 8 zębami dookoła i okrągłą dziurką w środku, bez obrysu.

Siatka RLE wycinka x 4–60, y 4–60 (57×57; reszta płótna przezroczysta; legenda: A = #7a3f63 (1720 px)):

```
24.9A
23.11A
24.9A
24.9A
24.9A
11.A12.9A12.A
10.3A11.9A11.3A
9.5A10.9A10.5A
8.7A9.9A9.7A
7.9A8.9A8.9A
6.10A5.15A5.10A
5.12A2.19A2.12A
6.45A
7.43A
8.41A
9.39A
11.35A
12.33A
12.33A
11.35A
11.35A
10.37A
10.16A5.16A
.A8.14A9.14A8.A
23A11.23A
23A11.23A
22A13.22A
22A13.22A
22A13.22A
22A13.22A
22A13.22A
23A11.23A
23A11.23A
.A8.14A9.14A8.A
10.16A5.16A
10.37A
11.35A
11.35A
12.33A
12.33A
11.35A
9.39A
8.41A
7.43A
6.45A
5.12A2.19A2.12A
6.10A5.15A5.10A
7.9A8.9A8.9A
8.7A9.9A9.7A
9.5A10.9A10.5A
10.3A11.9A11.3A
11.A12.9A12.A
24.9A
24.9A
24.9A
23.11A
24.9A
```
