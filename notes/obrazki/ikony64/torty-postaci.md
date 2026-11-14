# Obrazki: `docs/assets/gfx/ikony64/torty-postaci/`

Ikony 64 tortu każdej postaci: cały tort, lukier i dodatek. 27 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](../README.md).

Ikony 64 – obrazki na przyciskach w całej grze (wstecz, ustawienia, muzyka, składniki w kuchni i cukierni, narzędzia w szpitalu i u dentysty, odznaki osobowości na ekranie postaci, przyciski pokoi w windzie Gabi). Płótno 64×64, kotwica w środku (32, 32), tło przezroczyste. Rysunek mieści się w środkowych 58×58 (środek rysunku = punkt (32, 32)); każdy ciemny piksel (jasność < 130: #6b4a5e, #7a3f63) po narysowaniu „rozlewa się” na sąsiadów z lewej, prawej, góry i dołu, więc ciemne linie mają 3 px grubości. Kolory: obrys #6b4a5e, ciemne ikony przycisków #7a3f63. Pod opisem siatka RLE (dokładna).

## `ikony64/torty-postaci/dodatek-gabi.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Gabi: gwiazdka. Duża pięcioramienna gwiazda, wnętrze #fff1c9, gruby obrys #6b4a5e.

Siatka RLE wycinka x 4–59, y 3–55 (56×53; reszta płótna przezroczysta; legenda: A = #fff1c9 (678 px), B = #6b4a5e (664 px)):

```
27.2B
26.4B
26.4B
25.6B
25.6B
25.6B
24.8B
24.8B
23.4B2A4B
23.4B2A4B
22.4B4A4B
22.4B4A4B
21.5B4A5B
21.4B6A4B
20.5B6A5B
20.4B8A4B
19.5B8A5B
14.9B10A9B
6.17B10A17B
.21B12A21B
21B14A21B
.13B28A13B
2.5B42A5B
3.5B40A5B
4.5B38A5B
5.5B36A5B
6.6B32A6B
8.5B30A5B
9.5B28A5B
10.5B26A5B
11.5B24A5B
12.5B22A5B
13.5B20A5B
14.4B20A4B
14.4B20A4B
13.4B22A4B
13.4B22A4B
13.4B22A4B
13.4B22A4B
13.4B22A4B
12.4B10A4B10A4B
12.4B8A8B8A4B
12.4B7A10B7A4B
12.4B5A14B5A4B
12.4B3A8B2.8B3A4B
11.4B2A8B6.8B2A4B
11.4BA7B10.7BA4B
11.10B14.10B
11.9B16.9B
11.7B20.7B
10.6B24.6B
10.4B28.4B
11.B32.B
```

## `ikony64/torty-postaci/dodatek-harbin.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Harbina: truskawka. Owoc jak odwrócony trójkąt z zaokrąglonym czubkiem na dole, #f28aa5, obrys #6b4a5e, kilka pestek #fff1c9 (pojedyncze piksele), na górze zielona szypułka #9fd6b8 (poziomy pasek i krótka łodyżka).

Siatka RLE wycinka x 13–51, y 19–57 (39×39; reszta płótna przezroczysta; legenda: A = #f28aa5 (649 px), B = #6b4a5e (243 px), C = #9fd6b8 (52 px), D = #fff1c9 (5 px)):

```
19.2C
19.2C
.6B25C6B
8B23C8B
7B25A7B
3B33A3B
3B33A3B
.3B31A3B
.3B31A3B
.3B31A3B
.3B31A3B
2.3B29A3B
2.3B7AD21A3B
2.3B19AD9A3B
3.3B27A3B
3.3B27A3B
4.3B25A3B
4.3B25A3B
5.3B23A3B
5.3B23A3B
6.3B21A3B
6.3B21A3B
7.3B9AD9A3B
7.3B16AD2A3B
8.3B17A3B
8.3B17A3B
9.3B15A3B
10.3B13A3B
10.3B13A3B
11.3B2AD8A3B
12.3B9A3B
12.3B9A3B
13.3B7A3B
14.3B5A3B
15.3B3A3B
15.3B3A3B
16.7B
17.5B
18.3B
```

## `ikony64/torty-postaci/dodatek-harry.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Harry’ego: serduszko. Duże pikselowe serce z bloków (maska 7×6), jednolite #f59bbd, bez obrysu.

Siatka RLE wycinka x 8–56, y 11–52 (49×42; reszta płótna przezroczysta; legenda: A = #f59bbd (1323 px)):

```
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
7.14A7.14A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
49A
7.35A
7.35A
7.35A
7.35A
7.35A
7.35A
7.35A
14.21A
14.21A
14.21A
14.21A
14.21A
14.21A
14.21A
21.7A
21.7A
21.7A
21.7A
21.7A
21.7A
21.7A
```

## `ikony64/torty-postaci/dodatek-karabilein.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Karabileina: świeczka. Wąska świeczka w biało‑różowe poziome paski (#ffffff, #f7b2cc), obrys #6b4a5e, na górze płomyk #f6d98b z jaśniejszym środkiem #fff7e0.

Siatka RLE wycinka x 25–38, y 9–53 (14×45; reszta płótna przezroczysta; legenda: A = #6b4a5e (208 px), B = #ffffff (129 px), C = #f6d98b (100 px), D = #f7b2cc (96 px), E = #fff7e0 (18 px)):

```
7.C
4.7C
4.7C
3.9C
2.11C
2.11C
2.11C
2.5C3E3C
2.5C3E3C
2.5C3E3C
2.5C3E3C
3.4C3E2C
4.3C3EC
.6AC5A
14A
7AB6A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8D3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
3A8B3A
.A10.A
```

## `ikony64/torty-postaci/dodatek-leili.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Leili: kwiatek. Cztery różowe płatki #f7b2cc z obrysem #6b4a5e wokół żółtego środka #f6d98b, w dół zielona łodyżka #9fd6b8.

Siatka RLE wycinka x 9–55, y 5–63 (47×59; reszta płótna przezroczysta; legenda: A = #f7b2cc (732 px), B = #6b4a5e (416 px), C = #f6d98b (213 px), D = #9fd6b8 (26 px)):

```
23.B
19.9B
17.13B
16.7BA7B
15.4B9A4B
14.3B13A3B
13.4B13A4B
13.3B15A3B
12.4B15A4B
12.3B17A3B
12.3B17A3B
12.3B17A3B
11.4B17A4B
7.8B17A8B
5.11B15A11B
4.7BA3B8AC8A3BA7B
3.4B12A9C12A4B
2.3B13A11C13A3B
.4B12A13C12A4B
.3B12A15C12A3B
4B12A15C12A4B
3B12A17C12A3B
3B12A17C12A3B
3B12A17C12A3B
3B12A17C12A3B
3B12A17C12A3B
4B12A15C12A4B
.3B12A15C12A3B
.4B12A13C12A4B
2.3B13A11C13A3B
3.4B12A9C12A4B
4.7BA3B8AC8A3BA7B
5.11B15A11B
7.8B17A8B
11.4B17A4B
12.3B17A3B
12.3B17A3B
12.3B17A3B
12.4B15A4B
13.3B15A3B
13.4B13A4B
14.3B13A3BD
15.4B9A4B
16.7BA7B
17.13B
19.9B
23.BD
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
23.2D
```

## `ikony64/torty-postaci/dodatek-lili.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Lili: wisienka. Okrągła wiśnia #f28aa5 z obrysem #6b4a5e i białym błyskiem #ffffff, z góry ukośna zielona szypułka #7fc49e w prawo do góry.

Siatka RLE wycinka x 16–48, y 2–54 (33×53; reszta płótna przezroczysta; legenda: A = #f28aa5 (559 px), B = #6b4a5e (256 px), C = #7fc49e (63 px), D = #ffffff (2 px)):

```
27.3C
27.3C
26.3C
26.3C
25.3C
25.3C
24.3C
24.3C
23.3C
23.3C
22.3C
22.3C
21.3C
21.3C
20.3C
20.3C
19.3C
19.3C
18.3C
18.3C
16.B3C
11.11B
9.15B
7.9BA9B
6.5B11A5B
5.4B15A4B
4.3B19A3B
3.3B21A3B
2.4B21A4B
2.3B4A2D17A3B
.3B25A3B
.3B25A3B
.3B25A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
3B27A3B
.3B25A3B
.3B25A3B
.3B25A3B
2.3B23A3B
2.4B21A4B
3.3B21A3B
4.3B19A3B
5.4B15A4B
6.5B11A5B
7.9BA9B
9.15B
11.11B
16.B
```

## `ikony64/torty-postaci/dodatek-mordka.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Mordki: ziarenko słonecznika (pionowe), szara łupina #8d7f99, jasny pasek środkiem #f3eef8, gruby obrys #6b4a5e.

Siatka RLE wycinka x 16–47, y 10–53 (32×44; reszta płótna przezroczysta; legenda: A = #6b4a5e (564 px), B = #8d7f99 (210 px), C = #f3eef8 (108 px)):

```
13.6A
12.8A
12.8A
12.8A
12.8A
12.8A
7.18A
6.20A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.8A4B8A
7.6A6C6A
7.6B6C6B
7.6B6C6B
7.6B6C6B
7.6B6C6B
.6A6B6C6B6A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
8A5B6C5B8A
13A6C13A
.13A4B13A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.8A4B8A
6.20A
7.18A
12.8A
12.8A
12.8A
12.8A
12.8A
13.6A
```

## `ikony64/torty-postaci/dodatek-mysia.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Mysi: trzy borówki (dwie na dole, jedna wyżej pośrodku), #9aa8e8 z obrysem #6b4a5e i pojedynczymi jasnymi błyskami #d9e0fa.

Siatka RLE wycinka x 9–55, y 13–50 (47×38; reszta płótna przezroczysta; legenda: A = #9aa8e8 (748 px), B = #6b4a5e (464 px), C = #d9e0fa (3 px)):

```
23.B
18.11B
17.13B
15.8BA8B
14.5B9A5B
14.3B13A3B
13.3B15A3B
12.3B17A3B
12.3B17A3B
11.3B19A3B
11.3B19A3B
11.3B8AC10A3B
11.3B19A3B
11.3B19A3B
7.7B19A7B
6.8B19A8B
4.11B17A11B
3.5B4A3B17A3B4A5B
3.3B7A3B15A3B7A3B
2.3B9A3B13A3B9A3B
.3B10A5B9A5B10A3B
.3B11A8BA8B11A3B
3B14A13B14A3B
3B15A11B15A3B
3B8AC10A3B8AC10A3B
3B19A3B19A3B
3B19A3B19A3B
3B19A3B19A3B
3B19A3B19A3B
.3B17A5B17A3B
.3B17A5B17A3B
2.3B15A3B.3B15A3B
3.3B13A3B3.3B13A3B
3.5B9A5B3.5B9A5B
4.8BA8B5.8BA8B
6.13B9.13B
7.11B11.11B
12.B21.B
```

## `ikony64/torty-postaci/dodatek-titi.png`
64×64 px, kotwica (32, 32). Dodatek do tortu Titi: gwiazdka, piksel w piksel jak `ikony64/torty-postaci/dodatek-gabi.png`.

Piksel w piksel taki sam jak `ikony64/torty-postaci/dodatek-gabi.png`.

## `ikony64/torty-postaci/lukier-gabi.png`
64×64 px, kotwica (32, 32). Lukier do tortu Gabi (kuchnia). Rękaw cukierniczy jak `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, lukier #f5b3dc.

Siatka RLE taka sama jak w `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #f5b3dc (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

## `ikony64/torty-postaci/lukier-harbin.png`
64×64 px, kotwica (32, 32). Lukier do tortu Harbina (kuchnia). Rękaw cukierniczy, lukier #f7b2cc; piksel w piksel jak `ikony64/kuchnia-i-cukiernia/krem-rozowy.png`.

Piksel w piksel taki sam jak `ikony64/kuchnia-i-cukiernia/krem-rozowy.png`.

## `ikony64/torty-postaci/lukier-harry.png`
64×64 px, kotwica (32, 32). Lukier do tortu Harry’ego (kuchnia). Rękaw cukierniczy jak `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, lukier #f6d098.

Siatka RLE taka sama jak w `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #f6d098 (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

## `ikony64/torty-postaci/lukier-karabilein.png`
64×64 px, kotwica (32, 32). Lukier do tortu Karabileina (kuchnia). Rękaw cukierniczy jak `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, lukier #cfe8ff.

Siatka RLE taka sama jak w `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #cfe8ff (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

## `ikony64/torty-postaci/lukier-leili.png`
64×64 px, kotwica (32, 32). Lukier do tortu Leili (kuchnia). Rękaw cukierniczy jak `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, lukier #8fdcea.

Siatka RLE taka sama jak w `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #8fdcea (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

## `ikony64/torty-postaci/lukier-lili.png`
64×64 px, kotwica (32, 32). Lukier do tortu Lili (kuchnia). Rękaw cukierniczy, lukier #bfe8d6; piksel w piksel jak `ikony64/kuchnia-i-cukiernia/krem-mietowy.png`.

Piksel w piksel taki sam jak `ikony64/kuchnia-i-cukiernia/krem-mietowy.png`.

## `ikony64/torty-postaci/lukier-mordka.png`
64×64 px, kotwica (32, 32). Lukier do tortu Mordki (kuchnia). Rękaw cukierniczy jak `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, lukier #ffd6b8.

Siatka RLE taka sama jak w `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #ffd6b8 (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

## `ikony64/torty-postaci/lukier-mysia.png`
64×64 px, kotwica (32, 32). Lukier do tortu Mysi (kuchnia). Rękaw cukierniczy, lukier #d9ccf5; piksel w piksel jak `ikony64/kuchnia-i-cukiernia/krem-liliowy.png`.

Piksel w piksel taki sam jak `ikony64/kuchnia-i-cukiernia/krem-liliowy.png`.

## `ikony64/torty-postaci/lukier-titi.png`
64×64 px, kotwica (32, 32). Lukier do tortu Titi (kuchnia). Rękaw cukierniczy jak `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, lukier #c3b3ea.

Siatka RLE taka sama jak w `ikony64/kuchnia-i-cukiernia/krem-czekoladowy.png`, ale wycinek x 13–51, y 9–57; legenda tego pliku: A = #c3b3ea (386 px), B = #ffffff (325 px), C = #6b4a5e (250 px).

## `ikony64/torty-postaci/tort-gabi.png`
64×64 px, kotwica (32, 32). Tort Gabi (przycisk „upiecz tort” w terrarium, tort w kuchni). Okrągły tort widziany z boku na białym talerzyku #ffffff (talerzyk szerszy od tortu, z obrysem #6b4a5e): biszkopt #f6d098, kremowa przekładka #fff7e8 w połowie wysokości, lukier #f5b3dc na górze ze zwisającymi kroplami, posypka kreseczkami (#a6dcc4, #f6d98b, #c3b3ea, #ffffff), na środku na górze gwiazdka #fff1c9 z obrysem.

Siatka RLE wycinka x 1–61, y 14–50 (61×37; reszta płótna przezroczysta; legenda: A = #6b4a5e (572 px), B = #f6d098 (496 px), C = #f5b3dc (167 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #fff1c9 (38 px), G = #f6d98b (6 px), H = #a6dcc4 (5 px), I = #c3b3ea (4 px)):

```
30.2A
29.4A
29.4A
28.6A
27.8A
23.7A2F7A
22.7A4F7A
23.4A8F4A
24.3A8F3A
25.3A6F3A
26.3A4F3A
7.22A4F22A
6.22AF4AF22A
6.50A
6.3AC2H10C2DC12A9C2G5C3A
6.3A16C4A4C4A16C3A
6.3A5C2G10CAH7CA2C2D10C2IC3A
6.3A44C3A
6.3A7B2C2I8B2C2G2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

## `ikony64/torty-postaci/tort-harbin.png`
64×64 px, kotwica (32, 32). Tort Harbina. Jak `ikony64/torty-postaci/tort-gabi.png`, lukier #f7b2cc, na górze truskawka (#f28aa5, szypułka #9fd6b8, pestki #fff1c9).

Siatka RLE wycinka x 1–61, y 17–50 (61×34; reszta płótna przezroczysta; legenda: A = #6b4a5e (525 px), B = #f6d098 (496 px), C = #f7b2cc (164 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #f28aa5 (42 px), G = #9fd6b8 (18 px), H = #a6dcc4 (6 px), I = #f6d98b (6 px), J = #fff1c9 (5 px), K = #c3b3ea (4 px)):

```
31.2G
31.2G
25.2A8G3A
24.4A6G5A
24.3A8F4A
24.3A9F3A
25.3AFJ3FJF3A
25.3A7F3A
7.22A5F21A
6.23A2FJFJ22A
6.24A3F23A
6.3AC2H10C2D3C3AJ2F3A10C2I5C3A
6.3A19C7A18C3A
6.3A5C2I10C2HC5A4C2D10C2KC3A
6.3A21C3A20C3A
6.3A7B2C2K8B2C2I2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

## `ikony64/torty-postaci/tort-harry.png`
64×64 px, kotwica (32, 32). Tort Harry’ego. Jak `ikony64/torty-postaci/tort-gabi.png`, ale biszkopt czekoladowy #d8b39c, lukier #f6d098, na górze różowe serduszko #f59bbd.

Siatka RLE wycinka x 1–61, y 17–50 (61×34; reszta płótna przezroczysta; legenda: A = #d8b39c (496 px), B = #6b4a5e (462 px), C = #f6d098 (188 px), D = #f59bbd (106 px), E = #ffffff (105 px), F = #fff7e8 (88 px), G = #a6dcc4 (6 px), H = #c3b3ea (6 px), I = #f6d98b (6 px)):

```
26.4D2.4D
26.4D2.4D
24.14D
24.14D
24.14D
24.14D
26.10D
26.10D
7.21B6D21B
6.23B4D23B
6.22B2C2D2C22B
6.3BC2G10C2E6C2D2C2H10C2I5C3B
6.3B44C3B
6.3B5C2I10C2G10C2E10C2HC3B
6.3B44C3B
6.3B7A2C2H8A2C2I2A2C4A2C2G2A2C5A3B
6.3B25A2C4A2C4A2C5A3B
6.3B25A2C4A2C4A2C5A3B
6.3B31A2C11A3B
6.3B31A2C11A3B
6.3B44F3B
6.3B44F3B
6.3B44A3B
6.3B44A3B
6.3B44A3B
6.3B44A3B
6.3B44A3B
.8B44A7B
9B44A8B
8B46E7B
3B55E3B
61B
61B
.59B
```

## `ikony64/torty-postaci/tort-karabilein.png`
64×64 px, kotwica (32, 32). Tort Karabileina. Jak `ikony64/torty-postaci/tort-gabi.png`, lukier #cfe8ff, na górze świeczka (paski #ffffff/#f7b2cc, płomyk #f6d98b z #fff7e0).

Siatka RLE wycinka x 1–61, y 17–50 (61×34; reszta płótna przezroczysta; legenda: A = #6b4a5e (515 px), B = #f6d098 (496 px), C = #cfe8ff (171 px), D = #ffffff (109 px), E = #fff7e8 (88 px), F = #f6d98b (19 px), G = #a6dcc4 (6 px), H = #c3b3ea (5 px), I = #f7b2cc (4 px), J = #fff7e0 (2 px)):

```
31.F
29.5F
29.2FJ2F
29.AFJFA
28.3AF3A
28.3AD3A
28.3AI3A
28.3AI3A
7.24AD23A
6.25AD24A
6.25AI24A
6.3AC2G10C2D4C3AI3AH10C2F5C3A
6.3A19C3AD3A18C3A
6.3A5C2F10C2GCA3CA4C2D10C2HC3A
6.3A44C3A
6.3A7B2C2H8B2C2F2B2C4B2C2G2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

## `ikony64/torty-postaci/tort-leili.png`
64×64 px, kotwica (32, 32). Tort Leili. Jak `ikony64/torty-postaci/tort-gabi.png`, lukier #8fdcea, na górze kwiatek (płatki #f7b2cc, środek #f6d98b, łodyżka #9fd6b8).

Siatka RLE wycinka x 1–61, y 14–50 (61×37; reszta płótna przezroczysta; legenda: A = #6b4a5e (561 px), B = #f6d098 (495 px), C = #8fdcea (168 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #f7b2cc (52 px), G = #f6d98b (22 px), H = #a6dcc4 (6 px), I = #9fd6b8 (5 px), J = #c3b3ea (4 px)):

```
31.A
28.7A
27.9A
27.4AF4A
25.4A5F4A
24.5A5F5A
24.4A3FG3F4A
23.3A3F5G3F3A
23.3A3F5G3F3A
23.3A3F5G3F3A
24.4A3FG3F4A
7.22A5F21A
6.23A5F22A
6.25AF24A
6.3AC2H10C2D3C9A10C2G5C3A
6.3A19C7A18C3A
6.3A5C2G10C2H3CAI5C2D10C2JC3A
6.3A22C2I20C3A
6.3A7B2C2J8B2CG2IB2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

## `ikony64/torty-postaci/tort-lili.png`
64×64 px, kotwica (32, 32). Tort Lili. Jak `ikony64/torty-postaci/tort-gabi.png`, lukier #bfe8d6, na górze wisienka #f28aa5 z szypułką #7fc49e.

Siatka RLE wycinka x 1–61, y 15–50 (61×36; reszta płótna przezroczysta; legenda: A = #6b4a5e (527 px), B = #f6d098 (496 px), C = #bfe8d6 (160 px), D = #ffffff (107 px), E = #fff7e8 (88 px), F = #f28aa5 (31 px), G = #a6dcc4 (6 px), H = #f6d98b (6 px), I = #7fc49e (5 px), J = #c3b3ea (4 px)):

```
34.I
34.I
33.I
33.I
31.AI
28.7A
27.9A
26.5AF5A
25.4A2D3F4A
25.3A7F3A
7.21A7F20A
6.22A7F21A
6.23A5F22A
6.3AC2G10C2D2C5AF5A9C2H5C3A
6.3A18C9A17C3A
6.3A5C2H10C2G7A3C2D10C2JC3A
6.3A22CA21C3A
6.3A7B2C2J8B2C2H2B2C4B2C2G2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

## `ikony64/torty-postaci/tort-mordka.png`
64×64 px, kotwica (32, 32). Tort Mordki. Jak `ikony64/torty-postaci/tort-gabi.png`, lukier #ffd6b8, na górze ziarenko słonecznika (#8d7f99, pasek #f3eef8).

Siatka RLE wycinka x 1–61, y 15–50 (61×36; reszta płótna przezroczysta; legenda: A = #6b4a5e (548 px), B = #f6d098 (496 px), C = #ffd6b8 (174 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #f3eef8 (12 px), G = #8d7f99 (10 px), H = #a6dcc4 (6 px), I = #c3b3ea (6 px), J = #f6d98b (6 px)):

```
30.2A
29.4A
28.6A
27.8A
27.8A
28.2A2F2A
26.2A2G2F2G2A
25.4AG2FG4A
25.4AG2FG4A
25.4AG2FG4A
7.23A2F23A
6.50A
6.50A
6.3AC2H10C2D4C6A2I10C2J5C3A
6.3A20C4A20C3A
6.3A5C2J10C2H2C2A6C2D10C2IC3A
6.3A44C3A
6.3A7B2C2I8B2C2J2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

## `ikony64/torty-postaci/tort-mysia.png`
64×64 px, kotwica (32, 32). Tort Mysi. Jak `ikony64/torty-postaci/tort-gabi.png`, lukier #d9ccf5, na górze trzy borówki #9aa8e8.

Siatka RLE wycinka x 1–61, y 16–50 (61×35; reszta płótna przezroczysta; legenda: A = #6b4a5e (572 px), B = #f6d098 (496 px), C = #d9ccf5 (158 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #9aa8e8 (32 px), G = #a6dcc4 (6 px), H = #f6d98b (6 px), I = #c3b3ea (4 px), J = #d9e0fa (1 px)):

```
31.A
28.7A
27.9A
27.4AF4A
26.3AFJ3F3A
25.4A5F4A
24.5A5F5A
24.7AF7A
23.3AF9AF3A
7.19A2F7A2F18A
6.20A3F3A5F19A
6.22AF5AF21A
6.3AC2G10C2D15A7C2H5C3A
6.3A16C13A15C3A
6.3A5C2H10C2GA5CA3C2D10C2IC3A
6.3A44C3A
6.3A7B2C2I8B2C2H2B2C4B2C2G2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```

## `ikony64/torty-postaci/tort-titi.png`
64×64 px, kotwica (32, 32). Tort Titi. Jak `ikony64/torty-postaci/tort-gabi.png`, lukier #c3b3ea, na górze gwiazdka #fff1c9.

Siatka RLE wycinka x 1–61, y 14–50 (61×37; reszta płótna przezroczysta; legenda: A = #6b4a5e (572 px), B = #f6d098 (496 px), C = #c3b3ea (171 px), D = #ffffff (105 px), E = #fff7e8 (88 px), F = #fff1c9 (38 px), G = #f6d98b (6 px), H = #a6dcc4 (5 px)):

```
30.2A
29.4A
29.4A
28.6A
27.8A
23.7A2F7A
22.7A4F7A
23.4A8F4A
24.3A8F3A
25.3A6F3A
26.3A4F3A
7.22A4F22A
6.22AF4AF22A
6.50A
6.3AC2H10C2DC12A9C2G5C3A
6.3A16C4A4C4A16C3A
6.3A5C2G10CAH7CA2C2D13C3A
6.3A44C3A
6.3A7B4C8B2C2G2B2C4B2C2H2B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A25B2C4B2C4B2C5B3A
6.3A31B2C11B3A
6.3A31B2C11B3A
6.3A44E3A
6.3A44E3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
6.3A44B3A
.8A44B7A
9A44B8A
8A46D7A
3A55D3A
61A
61A
.59A
```
