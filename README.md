# Auto Maki, Vranje (demo sajt)

Statičan sajt (HTML, CSS i vanilla JS) bez build koraka. Radi odmah na GitHub Pages i na Vercelu.

## Struktura
| Putanja | Šta je |
|---|---|
| `index.html`, `vozila.html`, `vozilo.html`, `dovoz-vozila.html`, `slep-sluzba.html`, `autoperionica.html`, `rent-a-car.html`, `kontakt.html` | stranice (generisane) |
| `data/vozila.json` | vozila na placu → [KAKO-DODATI-VOZILO.md](KAKO-DODATI-VOZILO.md) |
| `data/rent.json` | vozila za rent a car |
| `data/recenzije.json` | 3 mesta za prave Google recenzije (prazna se ne prikazuju) |
| `data/site.json` | podaci o firmi + sve TODO stavke |
| `assets/` | CSS, JS, fontovi, WebP slike, OG slike |
| `slike/` | izvorne slike + [INVENTAR.md](slike/INVENTAR.md) |
| `alati/generisi.mjs` | ponovo pravi HTML, sitemap, robots i llms.txt iz `data/site.json` |
| `alati/slike.mjs` | `slike/*.jpg` → `assets/img/*.webp` |

## Lokalno
```
python -m http.server 8000
```
Otvori http://localhost:8000. Direktno otvaranje `index.html` duplim klikom ne učitava vozila, jer pregledač ne dozvoljava `fetch` sa `file://`.

## Objava na GitHub Pages (demo)
```
git remote add origin https://github.com/cheef30/auto-maki.git
git push -u origin main
```
Na GitHub-u otvori **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
Za minut-dva sajt je na https://cheef30.github.io/auto-maki/.
Ako se repo zove drugačije, promeni `sajt_url` u `data/site.json` i pokreni `node alati/generisi.mjs`.

## Kasnije, na Vercelu sa pravim domenom
1. U `data/site.json` stavi `sajt_url` na pravi domen, pa pokreni `node alati/generisi.mjs`.
2. Vercel → Add New Project → izaberi repo → Framework: Other → Deploy. Build komanda nije potrebna.
3. `vercel.json` već uključuje `cleanUrls`, pa rade i `/vozila` i `/vozila.html`.
4. Na Google profilu zameni link ka Polovnim automobilima novim domenom.

## Pre slanja klijentu
- [ ] Zameni privremene fotografije pravim (vidi `slike/INVENTAR.md`)
- [ ] Zameni primere u `data/vozila.json` i `data/rent.json` pravim vozilima
- [ ] Prođi TODO stavke u `data/site.json`
