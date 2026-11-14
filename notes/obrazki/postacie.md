# Obrazki: `docs/assets/gfx/postacie/`

Postacie 64×64: pokoje i podgląd przy wyborze postaci. 27 obrazków. Zasady wspólne i konwencje rysowania (pudełko, koło, siatki pikseli, algorytmy powiększania): [README](README.md).

Postacie 64×64 – główny rozmiar postaci w pokojach (terrarium, kuchnia, szpital, dentysta, ekran wyboru postaci). Każdy plik powstaje z tej samej maski co odpowiedni plik w `postacie-male/` (tam maski, zmiany wariantów i funkcja `redraw`).

## `postacie/gabi.png`
64×64 px, kotwica (32, 32). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. `redraw(postacie-male/gabi 32×32, { scale: 2, epx: true })` – jedno Scale2x obrazka 32×32 (obrys zostaje 2 px, bo przy ×2 nic się nie zwęża).

## `postacie/gabi-je.png`
64×64 px, kotwica (32, 32). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „je” (klatka żucia). `redraw(postacie-male/gabi-je 32×32, { scale: 2, epx: true })` – jedno Scale2x obrazka 32×32 (obrys zostaje 2 px, bo przy ×2 nic się nie zwęża).

## `postacie/gabi-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Gabi – lalka syrenka z kocimi uszkami: różowa opaska z uszami (#f28cc8, środek uszu #ffc6e6), duża kręcona niebieska fryzura #7f9cf0 z turkusowymi (#7fe0d4) i różowymi (#e08ad6) lokami, brązowa twarz #c98a62 z dużymi brązowymi oczami (#5a3426, #8a5a3a, błysk #ffffff), rumieńcami #e88e8e i uśmiechem #b8505e; różowy rybi ogon #e58ac8 z łuskami #c96fb4 i turkusowym serduszkiem, lawendowa płetwa #c8b8f5/#a898ea, w uniesionej prawej ręce żółta gwiazdka #ffd65a ze złotym obrysem #d9a53a; obrys #6a5a8c. Wariant „oczy zamknięte” (mrugnięcie). `redraw(postacie-male/gabi-oczy-zamkniete 32×32, { scale: 2, epx: true })` – jedno Scale2x obrazka 32×32 (obrys zostaje 2 px, bo przy ×2 nic się nie zwęża).

## `postacie/harbin.png`
64×64 px, kotwica (32, 32). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. `redraw(maska16 z postacie-male/harbin, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/harbin-je.png`
64×64 px, kotwica (32, 32). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/harbin-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/harbin-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Harbin – różowa postać podobna do ząbka (#fbd3e2) z dwiema nóżkami, oczami z kwadracików i uśmiechem #3d2b3d, stojąca pod łukiem z cienkiej ciemnej linii #6b4a5e (jak brama), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/harbin-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/harry.png`
64×64 px, kotwica (32, 32). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. `redraw(maska16 z postacie-male/harry, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/harry-je.png`
64×64 px, kotwica (32, 32). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/harry-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/harry-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Harry – brzoskwiniowa (#ffd6b8) kanciasta postać z jednym dużym okrągłym okiem (białe #ffffff w ciemnej obwódce #3d2b3d), z ciemnym zawijasem po prawej i ząbkowanym dolnym brzegiem (frędzle), obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/harry-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/karabilein.png`
64×64 px, kotwica (32, 32). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. `redraw(maska16 z postacie-male/karabilein, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/karabilein-je.png`
64×64 px, kotwica (32, 32). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/karabilein-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/karabilein-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Karabilein – jasnoniebieski (#cfe8ff) duszek w kształcie ząbka z dwiema nóżkami, bez twarzy, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/karabilein-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/leili.png`
64×64 px, kotwica (32, 32). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. `redraw(maska16 z postacie-male/leili, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/leili-je.png`
64×64 px, kotwica (32, 32). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/leili-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/leili-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Leili – kotek o kwadratowej głowie z niebieskim obrysem #4f74c8: futro w turkusowe (#8fdcea) i jasnozielone (#c4ecc8) łaty, uszy z wnętrzem #d9a6d6, oczy #3d5cb0 z białym błyskiem, różowa warga #f5bfd2 i ogromna otwarta różowa buzia #f4aaae. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/leili-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/lili.png`
64×64 px, kotwica (32, 32). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. `redraw(maska16 z postacie-male/lili, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/lili-je.png`
64×64 px, kotwica (32, 32). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/lili-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/lili-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Lili – miętowa (#bfe8d6) postać z postrzępionym czubkiem, ostrym wypustkiem po lewej, dwoma pionowymi kreskami oczu i szerokim uśmiechem #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/lili-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/mordka.png`
64×64 px, kotwica (32, 32). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. `redraw(maska16 z postacie-male/mordka, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

## `postacie/mordka-je.png`
64×64 px, kotwica (32, 32). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/mordka-je, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

## `postacie/mordka-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Mordka – chomik (pyszczek z przodu): rudawe futro #f2b880, jasny pyszczek i brzuszek #fff1e0, różowe uszka i policzki #f7a8b8, oczy #3d2b3d z białym błyskiem, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/mordka-oczy-zamkniete, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

## `postacie/mysia.png`
64×64 px, kotwica (32, 32). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. `redraw(maska16 z postacie-male/mysia, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

## `postacie/mysia-je.png`
64×64 px, kotwica (32, 32). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/mysia-je, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

## `postacie/mysia-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Mysia – chomik jak Mordka, ale szaroliliowy: futro #c9c3d6, pyszczek #fbf8ff, róż #f7a8c4, oczy #3d2b3d, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/mysia-oczy-zamkniete, { scale: 4 })` – wygładzanie gaussowskie ×4: kształty są zaokrąglone (rogi głowy i uszu ścięte łukiem, policzki i pyszczek jak owale), obrys #6b4a5e ma 2 px, oczy to zaokrąglone plamki ok. 8×8 px z białym błyskiem ok. 4×4 px w lewym górnym rogu.

## `postacie/titi.png`
64×64 px, kotwica (32, 32). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. `redraw(maska16 z postacie-male/titi, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/titi-je.png`
64×64 px, kotwica (32, 32). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „je” (klatka żucia). `redraw(maska16 z postacie-male/titi-je, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.

## `postacie/titi-oczy-zamkniete.png`
64×64 px, kotwica (32, 32). Titi – liliowa (#d9ccf5) postać bez twarzy: długa szyja z głową w prawym górnym rogu, korpus w lewym dole, trzy cienkie nóżki, obrys #6b4a5e. Wariant „oczy zamknięte” (mrugnięcie). `redraw(maska16 z postacie-male/titi-oczy-zamkniete, { scale: 4, epx: true })` – Scale2x dwa razy (każdy piksel maski → blok 4×4 z wygładzonymi schodkami), potem obrys ścieniony: obrys grubości 4 px zwęża się do 2 px, cienkie kreski (oczy, usta, nogi) zostają 2 px.
