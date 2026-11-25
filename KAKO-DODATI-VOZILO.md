# Kako dodati vozilo (2 minuta)

## 1. Slike
1. Sačuvaj slike vozila u `slike/` pod imenom `vozilo-marka-model-godiste`, a sledeće sa `-2`, `-3`…
   Primer: `vozilo-vw-golf-2019.jpg`, `vozilo-vw-golf-2019-2.jpg`, `vozilo-vw-golf-2019-3.jpg`
   (samo mala slova, brojevi i crtice; prva slika je naslovna, najbolje 3:2, auto spreda-bočno)
2. U terminalu, u korenu projekta:
   ```
   node alati/slike.mjs
   ```
   Skripta pravi WebP verzije u `assets/img/` i preskače one koje već postoje.
   (Nema ffmpeg-a? `winget install ffmpeg`. Ili ručno na squoosh.app: WebP, širina 800 i 1600, imena `ime-800.webp` i `ime-1600.webp`.)

## 2. Podaci
Otvori `data/vozila.json`, kopiraj jedan blok `{ … }`, nalepi ga **na vrh** liste i promeni:

```json
{
  "id": "vw-golf-2-0-tdi-2019",
  "marka": "Volkswagen",
  "model": "Golf 2.0 TDI Highline",
  "godiste": 2019,
  "cena": 14500,
  "km": 128000,
  "gorivo": "Dizel",
  "kubikaza": 1968,
  "snaga_kw": 110,
  "menjac": "Manuelni",
  "karoserija": "Hečbek",
  "boja": "Siva",
  "registrovan_do": "2026-08",
  "opis": "Kratko: oprema, servisi, broj vlasnika.",
  "slike": ["vozilo-vw-golf-2019", "vozilo-vw-golf-2019-2", "vozilo-vw-golf-2019-3"],
  "polovni_link": "https://www.polovniautomobili.com/auto-oglasi/…",
  "istaknuto": false,
  "prodato": false,
  "dodato": "2026-12-01"
}
```

Pravila:
- `id`: jedinstven, mala slova i crtice. On je u linku (`vozilo.html?id=…`), pa ga ne menjaj posle objave.
- `cena`, `km`, `godiste`, `kubikaza`, `snaga_kw`: samo broj, bez tačaka i „€”.
- `gorivo` i `menjac` piši uvek isto (`Dizel`, `Benzin`, `Hibrid`, `Električni`, `Benzin + gas` / `Manuelni`, `Automatski`), jer se od toga prave filteri.
- `slike`: imena **bez** `-800.webp`.
- `polovni_link`: ostavi `""` ako nema oglasa, pa se link ne prikazuje.
- `istaknuto: true` stavlja vozilo na početak naslovne.
- `dodato`: današnji datum. Po njemu radi sortiranje „Najnovije”.
- Primer oglasa ima `"primer": true`. Kod pravih vozila to polje obriši.

## 3. Prodato
Ne briši vozilo, samo stavi `"prodato": true`. Dobija traku „Prodato” i ide na kraj liste.
Posle nekoliko nedelja ga možeš obrisati iz JSON-a.

## 4. Provera i objava
1. Proveri JSON (zarez između blokova, bez zareza posle poslednjeg). Najlakše je u VS Code-u: greška je podvučena crveno.
2. Lokalno: `python -m http.server 8000`, pa otvori http://localhost:8000/vozila.html
3. `git add . && git commit -m "Vozilo: VW Golf 2019" && git push` i GitHub Pages ga objavi za minut.
4. Jednom mesečno pokreni `node alati/generisi.mjs`, da se nova vozila nađu u `sitemap.xml`.
