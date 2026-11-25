# Auto Maki: dizajn

## Pravac
Auto plac kraj puta, noću pod reflektorima. Tamna, mat podloga, fotografije preko cele širine i jedna signalna boja koju zna svako ko je video šlep na putu. Nema ukrasa koji nisu informacija: oznake usluga su redni brojevi (01 do 05), a ne ikonice. Jedini „ukras” je traka žuto-crnih kosih linija i ona se javlja samo kod šlep službe, kao rotaciono svetlo.

## Boje
| Token | Vrednost | Upotreba |
|---|---|---|
| `--asfalt` | `#141517` | osnovna pozadina |
| `--grafit` | `#1d1f22` | kartice, paneli |
| `--grafit-2` | `#272a2e` | ivice, polja forme |
| `--kreda` | `#f1efe9` | glavni tekst (topla bela) |
| `--siva` | `#a7a59f` | sporedni tekst (≥ 4.5:1 na asfaltu) |
| `--signal` | `#ffb81c` | dugmad, cene, aktivni linkovi (crni tekst na žutom) |
| `--wa` | `#15803d` | samo WhatsApp dugme (5:1 sa belim tekstom) |
| `--prodato` | `#b83220` | traka „Prodato” |

## Tipografija
- Naslovi: **Barlow Condensed** 700/800, velika slova, gusto (line-height 0.95). Kondenzovan, „saobraćajni” izgled.
- Tekst: **Barlow** 400/600/700, 17 px osnovno.
- Cene, kilometraža, tabele: `font-variant-numeric: tabular-nums`.
- Fontovi su lokalni (assets/fonts, latin + latin-ext za č ć š ž đ), bez Google Fonts poziva.

## Raspored
- Mobile first, kontejner max 1240 px, margine 20 px na telefonu i 40 px na desktopu.
- Header: logo-tekst AUTO MAKI, meni, istaknuto žuto dugme „Šlep 24h”. Na telefonu: logo, Šlep 24h i dugme za meni.
- Na telefonu donja fiksna traka: Pozovi (žuto) | WhatsApp (zeleno).
- Naslovna: hero fotografija sa tamnim prelivom levo → pet usluga kao numerisane fotografske kartice → traka vozila (horizontalni skrol na telefonu) → ocena 4,4 + „Zašto Auto Maki” → recenzije (kad budu popunjene) → mapa i kontakt.
- Kartica vozila: fotografija 3:2, marka/model kondenzovano, red sa godištem, km, gorivom (tabularno), cena žuto i krupno.
- Stranica vozila: galerija sa scroll-snap (swipe bez biblioteke) i sličicama, desno lepljiva kolona sa cenom i dugmadima.

## Pokret
Minimalan: hover podiže kartice za 2 px, slike se blago uvećavaju. Sve isključeno uz `prefers-reduced-motion`.
