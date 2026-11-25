// Generiše sve HTML stranice, sitemap.xml, robots.txt i llms.txt iz data/site.json.
// Pokretanje iz korena projekta:  node alati/generisi.mjs
// Sajt NEMA build korak za objavljivanje: generisani .html fajlovi se commit-uju i to je to.
// Ovo pokreni samo kad menjaš zajedničke delove (meni, futer, telefon, adresu, domen).
import { readFileSync, writeFileSync } from 'node:fs';

const S = JSON.parse(readFileSync('data/site.json', 'utf8'));
const BASE = S.sajt_url.replace(/\/?$/, '/');
const TEL = `tel:${S.telefon_link}`;
const WA = (txt) => `https://wa.me/${S.whatsapp_broj}?text=${encodeURIComponent(txt)}`;
const VIBER = `viber://chat?number=${encodeURIComponent(S.telefon_link)}`;
const OCENA = S.google_ocena.toLocaleString('sr-RS', { minimumFractionDigits: 1 });
const GODINA = new Date().getFullYear();

/* ---------- Ikonice (inline SVG, bez biblioteke) ---------- */
const I = {
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>',
  viber: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M11.4 2C9.2 2 5 2.3 3.4 3.8 2.2 5 1.8 6.8 1.7 9c-.1 2.2-.2 6.4 3.8 7.6v1.7s0 .7.4.8c.6.2.9-.4 1.4-.9l1-1.1c2.7.2 4.8-.3 5.1-.4.6-.2 3.7-.6 4.2-4.8.5-4.3-.2-7-1.6-8.3l-.1-.1C15.6 3 13.2 2 11.4 2zm.2 1.5c1.6 0 3.6.8 4.4 1.5 1.1 1 1.7 3.3 1.3 6.9-.4 3.4-2.9 3.6-3.4 3.8-.2.1-2.1.5-4.4.4l-2.5 2.6v-2.3C3.6 15.4 3.2 13 3.2 9.1c.1-1.9.4-3.4 1.3-4.3 1.4-1.2 4.9-1.3 7.1-1.3zm.1 1.8a.3.3 0 0 0 0 .6c1 0 1.8.4 2.5 1 .6.7 1 1.7 1 2.9a.3.3 0 1 0 .6 0c0-1.4-.4-2.5-1.2-3.3a4 4 0 0 0-2.9-1.2zm-2.8.6c-.2 0-.5 0-.7.2-.4.3-.9.8-.8 1.4.2.9.7 2 1.8 3.3 1.1 1.2 2.5 2.1 3.6 2.4.6.2 1.1-.3 1.4-.7.3-.4.2-.8-.2-1.1l-1.1-.8c-.4-.3-.8-.1-1 .1l-.3.4c-.2.2-.5.2-.5.2-1.6-.4-2.1-2-2.1-2s0-.3.2-.5l.4-.3c.2-.2.4-.6.1-1l-.7-1.1c-.1-.3-.4-.5-.7-.5zm3 .5a.3.3 0 0 0 0 .6c.6 0 1 .2 1.3.5.3.3.5.8.5 1.3a.3.3 0 0 0 .6 0c0-.7-.2-1.3-.6-1.7-.5-.5-1.1-.7-1.8-.7zm.1 1.2a.3.3 0 0 0 0 .6c.4 0 .6.3.6.7a.3.3 0 0 0 .6 0c0-.7-.5-1.3-1.2-1.3z"/></svg>',
  zvezda: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="m12 2 3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8l-6.6 3.9 1.8-7.3L1.5 9.5 9 8.9z"/></svg>',
  pola: '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="pz"><stop offset="40%" stop-color="currentColor"/><stop offset="40%" stop-color="currentColor" stop-opacity=".25"/></linearGradient></defs><path fill="url(#pz)" d="m12 2 3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8l-6.6 3.9 1.8-7.3L1.5 9.5 9 8.9z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
  sat: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  meni: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  info: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  filter: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
};
const zvezde = `<span class="zvezde" aria-hidden="true">${I.zvezda.repeat(4)}${I.pola}</span>`;

/* ---------- Delovi ---------- */
const NAV = [
  ['vozila.html', 'Vozila', 'Polovni automobili'],
  ['dovoz-vozila.html', 'Dovoz', 'Iz inostranstva'],
  ['autoperionica.html', 'Perionica', 'Samouslužna'],
  ['rent-a-car.html', 'Rent a car', 'Iznajmljivanje'],
  ['kontakt.html', 'Kontakt', S.telefon_prikaz],
];
const znak = `<svg class="logo__znak" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="5" fill="#ffb81c"/><path d="M6 24V8h4.2L16 17l5.8-9H26v16h-4.2v-9l-4.6 7h-2.4l-4.6-7v9z" fill="#141517"/></svg>`;

const header = (akt) => `
<a class="skip" href="#sadrzaj">Preskoči na sadržaj</a>
<header class="hdr">
  <div class="wrap hdr__in">
    <a class="logo" href="index.html" aria-label="Auto Maki, početna">${znak}<span class="logo__tekst">Auto <b>Maki</b></span></a>
    <nav class="nav" aria-label="Glavni meni">
      ${NAV.map(([h, t]) => `<a href="${h}"${akt === h ? ' aria-current="page"' : ''}>${t}</a>`).join('\n      ')}
    </nav>
    <a class="btn btn--signal hdr__slep" href="slep-sluzba.html"${akt === 'slep-sluzba.html' ? ' aria-current="page"' : ''}><span class="tacka" aria-hidden="true"></span>Šlep 24h</a>
    <button class="meni-btn" type="button" aria-expanded="false" aria-controls="meni" aria-label="Otvori meni">${I.meni}</button>
  </div>
</header>
<div class="meni" id="meni" hidden>
  <nav aria-label="Meni za telefon">
    <a href="index.html">Početna <span>Sve usluge</span></a>
    ${NAV.map(([h, t, s]) => `<a href="${h}">${t} <span>${s}</span></a>`).join('\n    ')}
    <a href="slep-sluzba.html">Šlep služba <span>24h</span></a>
  </nav>
  <div class="meni__kontakt">
    <a class="btn btn--signal" href="${TEL}">${I.tel}Pozovi ${S.telefon_prikaz}</a>
  </div>
</div>`;

const footer = (waTxt = 'Zdravo, pišem sa sajta Auto Maki.') => `
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__grid">
      <div>
        <a class="logo" href="index.html" aria-label="Auto Maki, početna">${znak}<span class="logo__tekst">Auto <b>Maki</b></span></a>
        <p style="margin-top:14px;max-width:34ch">Auto plac, dovoz vozila, šlep služba, samouslužna perionica i rent a car. Sve na jednoj adresi u Vranju.</p>
        <a class="ftr__tel num" href="${TEL}">${S.telefon_prikaz}</a>
        <address class="ftr__adresa">${S.adresa}, ${S.postanski_broj} ${S.grad}<br>${S.radno_vreme}</address>
      </div>
      <div>
        <h2>Usluge</h2>
        <ul>
          <li><a href="vozila.html">Polovni automobili</a></li>
          <li><a href="dovoz-vozila.html">Dovoz vozila iz inostranstva</a></li>
          <li><a href="slep-sluzba.html">Šlep služba 24h</a></li>
          <li><a href="autoperionica.html">Samouslužna autoperionica</a></li>
          <li><a href="rent-a-car.html">Rent a car</a></li>
        </ul>
      </div>
      <div>
        <h2>Javite se</h2>
        <ul>
          <li><a href="${TEL}">Poziv: ${S.telefon_prikaz}</a></li>
          <li><a href="${WA(waTxt)}" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="${VIBER}">Viber</a></li>
          <li><a href="${S.google_profil_url}" target="_blank" rel="noopener">Google mape</a></li>
          ${S.polovni_profil_url ? `<li><a href="${S.polovni_profil_url}" target="_blank" rel="noopener">Polovni automobili</a></li>` : ''}
          <li><a href="kontakt.html">Kontakt i mapa</a></li>
        </ul>
      </div>
    </div>
    <div class="ftr__dno">
      <p>© ${GODINA} Auto Maki, Vranje · <a class="ftr__izvori" href="izvori-fotografija.html">Izvori fotografija</a></p>
      <!-- ss-credit v1 -->
      <a class="ss-credit" href="https://stefanstevic.rs/" target="_blank" rel="noopener">
        <svg class="ss-credit__mark" viewBox="1 0 100 120" aria-hidden="true" focusable="false"><path d="M80 12 22 36 51 60"/><path class="ss-credit__accent" d="M51 60 80 84 22 108"/></svg>
        <span>Izrada sajta: <span class="ss-credit__name">Stefan Stević</span></span>
      </a>
    </div>
  </div>
</footer>
<div class="pozivna" role="region" aria-label="Brzi kontakt">
  <a class="btn btn--signal" href="${TEL}">${I.tel}Pozovi</a>
  <a class="btn btn--wa" href="${WA(waTxt)}" target="_blank" rel="noopener">${I.wa}WhatsApp</a>
</div>`;

const slika = (ime, alt, { sizes = '100vw', eager = false, cls = '', w = 1600, h = 1067 } = {}) =>
  `<img${cls ? ` class="${cls}"` : ''} src="assets/img/${ime}-800.webp" srcset="assets/img/${ime}-800.webp 800w, assets/img/${ime}-1600.webp 1600w" sizes="${sizes}" width="${w}" height="${h}" alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;

const adresaLD = { '@type': 'PostalAddress', streetAddress: S.adresa, addressLocality: S.grad, postalCode: S.postanski_broj, addressCountry: S.drzava };
const firmaRef = { '@type': 'AutoDealer', '@id': BASE + '#firma', name: S.naziv_tekst, telephone: S.telefon_link, address: adresaLD, url: BASE };
const sat24 = [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' }];

function strana({ fajl, title, opis, og, telo, ld = [], akt = fajl, waTxt, noindex = false, js = true, extraHead = '' }) {
  const url = BASE + (fajl === 'index.html' ? '' : fajl);
  const ldBlok = ld.map(o => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...o })}</script>`).join('\n');
  const html = `<!doctype html>
<html lang="sr-Latn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${opis}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta property="og:type" content="website">
<meta property="og:locale" content="sr_RS">
<meta property="og:site_name" content="Auto Maki Vranje">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${opis}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}assets/og/${og}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#141517">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/barlow-condensed-800-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/barlow-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
${extraHead}${ldBlok}
</head>
<body data-strana="${fajl.replace('.html', '')}">
${header(akt)}
<main id="sadrzaj">
${telo}
</main>
${footer(waTxt)}
${js ? '<script src="assets/js/app.js" defer></script>' : ''}
</body>
</html>
`;
  writeFileSync(fajl, html);
  return { url, noindex };
}

/* ---------- Zajednički blokovi ---------- */
const kontaktBlok = (naslov = 'Dođite na plac', nivo = 'h2') => `
<section class="sekcija" aria-labelledby="kontakt-n">
  <div class="wrap kontakt-blok">
    <div class="mapa">
      <p class="mapa__rez" aria-hidden="true">${I.pin}<span>${S.adresa}, ${S.grad}</span></p>
      <iframe src="${S.mapa_embed}" title="Mapa: Auto Maki, ${S.adresa}, ${S.grad}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div>
      <p class="nadnaslov">Kontakt</p>
      <${nivo} id="kontakt-n" style="margin-bottom:24px">${naslov}</${nivo}>
      <dl class="podaci">
        <div><dt>Adresa</dt><dd>${S.adresa}<br>${S.postanski_broj} ${S.grad}</dd></div>
        <div><dt>Telefon</dt><dd><a class="num" href="${TEL}">${S.telefon_prikaz}</a><br><span style="color:var(--siva);font-weight:400">Poziv, WhatsApp i Viber</span></dd></div>
        <div><dt>Radno vreme</dt><dd>${S.radno_vreme}</dd></div>
      </dl>
      <div class="dugmad">
        <a class="btn btn--signal" href="${TEL}">${I.tel}Pozovi</a>
        <a class="btn btn--wa" href="${WA('Zdravo, pišem sa sajta Auto Maki.')}" target="_blank" rel="noopener">${I.wa}WhatsApp</a>
        <a class="btn btn--viber" href="${VIBER}">${I.viber}Viber</a>
      </div>
      <p style="margin:18px 0 0"><a class="link-strelica" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`AUTO MAKI, ${S.adresa}, ${S.grad}`)}" target="_blank" rel="noopener">Uputstva za dolazak →</a></p>
    </div>
  </div>
</section>`;

const napomenaCena = (t) => `<p class="napomena-cena">${I.info}<span>${t}</span></p>`;

/* =========================================================
   STRANICE
   ========================================================= */
const sve = [];

/* ---------- Naslovna ---------- */
sve.push(strana({
  fajl: 'index.html',
  title: 'Auto Maki Vranje | Polovni automobili, šlep, rent a car, perionica',
  opis: `Auto plac u Vranju: polovni automobili, dovoz vozila iz inostranstva, šlep služba, samouslužna perionica i rent a car. ${S.adresa}. Pozovite ${S.telefon_prikaz}.`,
  og: 'naslovna',
  ld: [{
    '@type': 'AutoDealer', '@id': BASE + '#firma', name: S.naziv_tekst, url: BASE,
    image: BASE + 'assets/og/naslovna.jpg', telephone: S.telefon_link, address: adresaLD,
    areaServed: { '@type': 'City', name: 'Vranje' },
    openingHoursSpecification: sat24,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: S.google_ocena, reviewCount: S.google_broj_recenzija, bestRating: 5 },
    hasMap: S.google_profil_url,
    makesOffer: ['Prodaja polovnih vozila', 'Dovoz vozila iz inostranstva', 'Šlep služba', 'Samouslužna autoperionica', 'Rent a car']
      .map(n => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
  }],
  extraHead: '<link rel="preload" as="image" href="assets/img/hero-hala-800.webp" imagesrcset="assets/img/hero-hala-800.webp 800w, assets/img/hero-hala-1600.webp 1600w" imagesizes="100vw">\n',
  telo: `
<section class="hero" aria-labelledby="hero-n">
  <div class="hero__slika">${slika('hero-hala', '', { eager: true, w: 1600, h: 945 })}</div>
  <div class="wrap hero__in">
    <p class="nadnaslov">${S.adresa} · ${S.grad}</p>
    <h1 id="hero-n">Sve za vaš auto na jednom mestu <em>u Vranju</em></h1>
    <p class="hero__lead">Kod nas kupujete auto, dovozite ga iz inostranstva, perete ga, iznajmljujete i zovete šlep kad zatreba.</p>
    <div class="hero__cta">
      <a class="btn btn--signal" href="vozila.html">Pogledaj vozila</a>
      <a class="btn btn--obris" href="${TEL}">${I.tel}<span class="num">${S.telefon_prikaz}</span></a>
    </div>
    <ul class="hero__cinjenice">
      <li>${I.zvezda}${OCENA} na Google-u, ${S.google_broj_recenzija} recenzija</li>
      <li>${I.sat}${S.radno_vreme}</li>
    </ul>
  </div>
</section>

<section class="sekcija" aria-labelledby="usluge-n" style="padding-top:48px">
  <div class="wrap">
    <div class="zag">
      <div><p class="nadnaslov">Usluge</p><h2 id="usluge-n">Pet usluga, jedna adresa</h2></div>
      <p class="uvod" style="margin:0;max-width:44ch">Jedan broj za sve: <a class="num" href="${TEL}" style="color:var(--kreda);font-weight:700">${S.telefon_prikaz}</a>. Isti broj radi i na WhatsApp-u i Viberu.</p>
    </div>
    <ul class="usluge">
      <li><a class="usluga" href="vozila.html"><span class="usluga__slika">${slika('plac-red-vozila', '', { sizes: '(min-width:1100px) 240px, 116px', w: 1600, h: 1200 })}</span><span class="usluga__tekst"><span class="usluga__br">01</span><h3>Auto plac</h3><p>Polovna vozila na placu. Pogledajte ponudu ovde, pa dođite uživo.</p></span></a></li>
      <li><a class="usluga" href="dovoz-vozila.html"><span class="usluga__slika">${slika('dovoz-transporter', '', { sizes: '(min-width:1100px) 240px, 116px', w: 1600, h: 1205 })}</span><span class="usluga__tekst"><span class="usluga__br">02</span><h3>Dovoz vozila</h3><p>Recite koji auto tražite. Dovozimo ga iz inostranstva.</p></span></a></li>
      <li><a class="usluga usluga--slep" href="slep-sluzba.html"><span class="usluga__slika">${slika('slep-platforma', '', { sizes: '(min-width:1100px) 240px, 116px', w: 1600, h: 1067 })}</span><span class="usluga__tekst"><span class="usluga__br">03</span><h3>Šlep služba</h3><p>Auto stao na putu? Pozovite, dolazimo po njega.</p></span></a></li>
      <li><a class="usluga" href="autoperionica.html"><span class="usluga__slika">${slika('perionica-mlaz', '', { sizes: '(min-width:1100px) 240px, 116px', w: 1600, h: 900 })}</span><span class="usluga__tekst"><span class="usluga__br">04</span><h3>Perionica</h3><p>Samouslužni boksovi. Operete auto sami, kad vama odgovara.</p></span></a></li>
      <li><a class="usluga" href="rent-a-car.html"><span class="usluga__slika">${slika('rent-toyota-rav4', '', { sizes: '(min-width:1100px) 240px, 116px', w: 1600, h: 997 })}</span><span class="usluga__tekst"><span class="usluga__br">05</span><h3>Rent a car</h3><p>Pošaljite datume, javljamo koji auto je slobodan.</p></span></a></li>
    </ul>
  </div>
</section>

<section class="sekcija" aria-labelledby="ponuda-n" style="padding-top:0">
  <div class="wrap">
    <div class="zag">
      <div><p class="nadnaslov">Na placu</p><h2 id="ponuda-n">Vozila u ponudi</h2></div>
      <a class="link-strelica" href="vozila.html">Sva vozila →</a>
    </div>
    <div class="traka" data-vozila-traka aria-live="polite"><p style="color:var(--siva)">Učitavanje vozila…</p></div>
  </div>
</section>

<section class="sekcija" aria-labelledby="kupci-n" style="background:var(--grafit);border-block:1px solid var(--linija)">
  <div class="wrap dva">
    <div>
      <p class="nadnaslov">Google recenzije</p>
      <h2 id="kupci-n">Šta kažu kupci</h2>
      <div class="ocena">
        <span class="ocena__broj num" aria-hidden="true">${OCENA}</span>
        <div class="ocena__info">
          ${zvezde}
          <p><span class="sr-only">Ocena ${OCENA} od 5, </span>${S.google_broj_recenzija} recenzija na Google mapama</p>
        </div>
      </div>
      <p style="color:#d6d4ce;max-width:46ch">Kupci u recenzijama hvale prodavca ${S.prodavac} i pišu da je vlasnik pošten i fer.</p>
      <a class="link-strelica" href="${S.google_profil_url}" target="_blank" rel="noopener">Pročitajte recenzije na Google-u →</a>
      <div class="recenzije" data-recenzije hidden></div>
    </div>
    <div>
      <p class="nadnaslov">Zašto Auto Maki</p>
      <h2 style="margin-bottom:24px">Jedno mesto, jedan broj</h2>
      <ol class="zasto">
        <li><strong>Pet usluga na jednoj adresi</strong><span>Kupovina, dovoz, šlep, pranje i iznajmljivanje. Ne morate da tražite pet firmi.</span></li>
        <li><strong>${S.radno_vreme}</strong><span>Tako piše na Google mapama. Za šlep pozovite u bilo koje doba.</span></li>
        <li><strong>${OCENA} od ${S.google_broj_recenzija} recenzija</strong><span>Ocena kupaca na Google mapama.</span></li>
        <li><strong>Poziv, WhatsApp ili Viber</strong><span>Sve na broju ${S.telefon_prikaz}.</span></li>
      </ol>
    </div>
  </div>
</section>
${kontaktBlok('Partizanski put 70, Vranje')}`,
}));

/* ---------- Vozila ---------- */
sve.push(strana({
  fajl: 'vozila.html',
  title: 'Polovni automobili Vranje | Ponuda vozila | Auto Maki',
  opis: `Polovni automobili na placu Auto Maki u Vranju. Filtrirajte po marki, ceni, godištu, gorivu i menjaču. Pozovite ${S.telefon_prikaz}.`,
  og: 'vozila',
  waTxt: 'Zdravo, zanima me vozilo sa vašeg placa.',
  ld: [{ '@type': 'CollectionPage', name: 'Polovni automobili, Auto Maki Vranje', url: BASE + 'vozila.html', provider: firmaRef }],
  telo: `
<div class="stranica-zag">
  <div class="wrap">
    <ol class="mrvice"><li><a href="index.html">Početna</a></li><li aria-current="page">Vozila</li></ol>
    <h1>Polovni automobili u Vranju</h1>
    <p class="uvod" style="margin:0">Vozila sa placa na adresi ${S.adresa}. Ako ne vidite šta tražite, <a href="dovoz-vozila.html" style="color:var(--kreda)">možemo da ga dovezemo</a>.</p>
  </div>
</div>
<div class="wrap lista-vozila">
  <div>
    <button class="filteri-toggle" type="button" aria-expanded="false" aria-controls="filteri"><span>Filteri <span data-aktivni-filteri></span></span>${I.filter}</button>
    <form class="filteri" id="filteri" role="search" aria-label="Filteri vozila">
      <div class="polje"><label for="f-marka">Marka</label><select id="f-marka" name="marka"><option value="">Sve marke</option></select></div>
      <fieldset class="polje" style="border:0;padding:0;margin:0"><legend style="font-weight:600;font-size:15px;margin-bottom:6px">Cena (€)</legend>
        <div class="filteri__cena">
          <input id="f-od" name="od" type="number" inputmode="numeric" min="0" step="500" placeholder="Od" aria-label="Cena od, evra">
          <input id="f-do" name="do" type="number" inputmode="numeric" min="0" step="500" placeholder="Do" aria-label="Cena do, evra">
        </div>
      </fieldset>
      <div class="polje"><label for="f-godiste">Godište od</label><select id="f-godiste" name="godiste"><option value="">Bilo koje</option></select></div>
      <div class="polje"><label for="f-gorivo">Gorivo</label><select id="f-gorivo" name="gorivo"><option value="">Sva goriva</option></select></div>
      <div class="polje"><label for="f-menjac">Menjač</label><select id="f-menjac" name="menjac"><option value="">Svi menjači</option></select></div>
      <button class="btn-tekst" type="reset">Poništi filtere</button>
    </form>
  </div>
  <div>
    <div class="rezultati-bar">
      <p class="broj-rez" data-broj aria-live="polite" style="margin:0"></p>
      <div class="polje"><label for="f-sort">Sortiraj</label>
        <select id="f-sort" name="sort" form="filteri">
          <option value="novo">Najnovije</option>
          <option value="jeftino">Najjeftinije</option>
          <option value="skupo">Najskuplje</option>
        </select>
      </div>
    </div>
    <div class="vozila-grid" data-vozila-lista></div>
    <div class="prazno" data-prazno hidden>
      <h2>Nema vozila za ove filtere</h2>
      <p>Probajte širi raspon cene ili godišta. Ili nam recite šta tražite, pa ćemo ga dovesti iz inostranstva.</p>
      <div class="dugmad" style="max-width:420px;margin:0 auto">
        <button class="btn btn--obris" type="button" data-ponisti>Poništi filtere</button>
        <a class="btn btn--signal" href="dovoz-vozila.html">Dovoz po meri</a>
      </div>
    </div>
  </div>
</div>`,
}));

/* ---------- Jedno vozilo ---------- */
sve.push(strana({
  fajl: 'vozilo.html',
  title: 'Vozilo | Auto Maki Vranje',
  opis: `Polovno vozilo na placu Auto Maki, ${S.adresa}, ${S.grad}. Pozovite ${S.telefon_prikaz} ili pišite na WhatsApp.`,
  og: 'vozila',
  akt: 'vozila.html',
  telo: `
<div class="wrap" style="padding-top:20px">
  <ol class="mrvice"><li><a href="index.html">Početna</a></li><li><a href="vozila.html">Vozila</a></li><li aria-current="page" data-mrvica>Vozilo</li></ol>
</div>
<div class="wrap" data-vozilo aria-live="polite"><p style="padding:40px 0;color:var(--siva)">Učitavanje…</p></div>
<section class="sekcija" aria-labelledby="slicna-n" style="padding-top:0" data-slicna-sekcija hidden>
  <div class="wrap">
    <div class="zag"><h2 id="slicna-n">Slična vozila</h2><a class="link-strelica" href="vozila.html">Sva vozila →</a></div>
    <div class="traka" data-slicna></div>
  </div>
</section>`,
}));

/* ---------- Dovoz ---------- */
sve.push(strana({
  fajl: 'dovoz-vozila.html',
  title: 'Uvoz i dovoz automobila iz inostranstva Vranje | Auto Maki',
  opis: `Dovoz vozila iz inostranstva po vašoj želji. Javite koji auto tražite, Auto Maki iz Vranja ga pronalazi i dovozi. Pozovite ${S.telefon_prikaz}.`,
  og: 'dovoz',
  waTxt: 'Zdravo, zanima me dovoz vozila iz inostranstva.',
  ld: [{ '@type': 'Service', name: 'Dovoz vozila iz inostranstva', serviceType: 'Uvoz automobila', areaServed: { '@type': 'City', name: 'Vranje' }, provider: firmaRef, url: BASE + 'dovoz-vozila.html' }],
  telo: `
<section class="hero hero--usluga" aria-labelledby="hero-n">
  <div class="hero__slika">${slika('dovoz-transporter', '', { eager: true, w: 1600, h: 1205 })}</div>
  <div class="wrap hero__in">
    <ol class="mrvice"><li><a href="index.html">Početna</a></li><li aria-current="page">Dovoz vozila</li></ol>
    <p class="nadnaslov">Usluga 02</p>
    <h1 id="hero-n">Dovoz vozila iz inostranstva</h1>
    <p class="hero__lead">Recite nam koji auto tražite. Mi ga pronalazimo i dovozimo do Vranja.</p>
    <div class="hero__cta">
      <a class="btn btn--signal" href="#upit">Pošalji upit</a>
      <a class="btn btn--obris" href="${TEL}">${I.tel}<span class="num">${S.telefon_prikaz}</span></a>
    </div>
  </div>
</section>

<section class="sekcija" aria-labelledby="koraci-n">
  <div class="wrap">
    <div class="zag"><div><p class="nadnaslov">Kako ide</p><h2 id="koraci-n">Četiri koraka do vašeg auta</h2></div></div>
    <ol class="koraci koraci--4">
      <li><h3>Javite šta tražite</h3><p>Marka, model, godište, gorivo, menjač i koliko želite da potrošite.</p></li>
      <li><h3>Tražimo vozilo</h3><p>Javljamo vam se sa vozilima koja odgovaraju onome što ste tražili.</p></li>
      <li><h3>Vi birate</h3><p>Zajedno se dogovaramo oko vozila koje vam se dopalo.</p></li>
      <li><h3>Dovoz do Vranja</h3><p>Auto stiže na plac na ${S.adresa}, gde ga preuzimate.</p></li>
    </ol>
  </div>
</section>

<section class="sekcija" id="upit" aria-labelledby="upit-n" style="padding-top:0">
  <div class="wrap split">
    <div>
      <p class="nadnaslov">Upit za dovoz</p>
      <h2 id="upit-n" style="margin-bottom:18px">Šta nam treba od vas</h2>
      <ul class="lista">
        <li>Marka i model koji tražite</li>
        <li>Godište od kog krećete</li>
        <li>Gorivo i menjač</li>
        <li>Okvirni budžet</li>
      </ul>
      ${napomenaCena('Cena i rok dovoza zavise od vozila i zemlje iz koje stiže. Pozovite za procenu.')}
    </div>
    <form class="forma" data-wa-forma="dovoz" novalidate>
      <div class="red">
        <div class="polje"><label for="d-marka">Marka i model</label><input id="d-marka" name="Marka i model" required autocomplete="off" placeholder="npr. VW Golf 8"></div>
        <div class="polje"><label for="d-god">Godište od</label><input id="d-god" name="Godište od" inputmode="numeric" placeholder="npr. 2019"></div>
      </div>
      <div class="red">
        <div class="polje"><label for="d-gorivo">Gorivo</label><select id="d-gorivo" name="Gorivo"><option value="">Svejedno</option><option>Dizel</option><option>Benzin</option><option>Hibrid</option><option>Električni</option><option>Benzin + gas</option></select></div>
        <div class="polje"><label for="d-menjac">Menjač</label><select id="d-menjac" name="Menjač"><option value="">Svejedno</option><option>Manuelni</option><option>Automatski</option></select></div>
      </div>
      <div class="polje"><label for="d-budzet">Budžet (€)</label><input id="d-budzet" name="Budžet" inputmode="numeric" placeholder="npr. 15.000"></div>
      <div class="polje"><label for="d-ime">Vaše ime</label><input id="d-ime" name="Ime" autocomplete="name"></div>
      <p class="forma__napomena" data-forma-greska role="alert" hidden></p>
      <button class="btn btn--wa btn--blok" type="submit">${I.wa}Pošalji upit na WhatsApp</button>
      <p class="forma__napomena">Otvara se WhatsApp sa već upisanom porukom. Vi samo pritisnete „Pošalji”.</p>
    </form>
  </div>
</section>
${kontaktBlok('Dođite na razgovor')}`,
}));

/* ---------- Šlep ---------- */
sve.push(strana({
  fajl: 'slep-sluzba.html',
  title: 'Šlep služba Vranje 24h | Auto Maki',
  opis: `Šlep služba u Vranju, dostupni 24h. Auto stao na putu? Pozovite ${S.telefon_prikaz} ili pošaljite lokaciju na WhatsApp.`,
  og: 'slep',
  waTxt: 'Zdravo, treba mi šlep.',
  ld: [{ '@type': 'Service', name: 'Šlep služba Vranje', serviceType: 'Šlep služba / vuča vozila', areaServed: { '@type': 'City', name: 'Vranje' }, provider: firmaRef, url: BASE + 'slep-sluzba.html', availableChannel: { '@type': 'ServiceChannel', servicePhone: { '@type': 'ContactPoint', telephone: S.telefon_link, contactType: 'emergency', hoursAvailable: sat24 } } }],
  telo: `
<div class="pruge" aria-hidden="true"></div>
<section class="hitno" aria-labelledby="hero-n">
  <div class="wrap hitno__in">
    <div>
      <p class="nadnaslov">Šlep služba · Vranje</p>
      <h1 id="hero-n">Auto stao? Pozovite šlep.</h1>
      <p class="hitno__24"><span class="tacka" aria-hidden="true"></span>${S.slep.dostupnost}</p>
      <p>Recite gde ste i šta se desilo. Dolazimo po vas i vozilo.</p>
    </div>
    <div class="hitno__dugmad">
      <a class="btn btn--hitno" href="${TEL}">Pozovite šlep<small class="num">${S.telefon_prikaz}</small></a>
      <button class="btn btn--lok" type="button" data-lokacija>${I.pin}Pošalji moju lokaciju na WhatsApp</button>
      <p class="hitno__status" data-lokacija-status role="status"></p>
    </div>
  </div>
</section>
<div class="pruge" aria-hidden="true"></div>

<section class="sekcija" aria-labelledby="poziv-n">
  <div class="wrap split">
    <div>
      <p class="nadnaslov">Kad pozovete</p>
      <h2 id="poziv-n" style="margin-bottom:18px">Šta da nam kažete</h2>
      <ul class="lista">
        <li><strong>Gde ste.</strong> Ulica, put ili najbliže mesto. Najlakše je da pošaljete lokaciju.</li>
        <li><strong>Šta se desilo.</strong> Kvar, udes, ispražnjen akumulator, auto ne pali.</li>
        <li><strong>Koje je vozilo.</strong> Marka, model i da li je automatik.</li>
        <li><strong>Gde ga vozimo.</strong> Kući, u servis ili na plac.</li>
      </ul>
      ${napomenaCena('Cenu šlepanja dobijate odmah na telefonu, kad nam kažete odakle i dokle.')}
    </div>
    <div class="split__slika">${slika('slep-platforma', 'Šlep vozilo sa platformom i SUV-om na njoj', { sizes: '(min-width:900px) 50vw, 100vw', w: 1600, h: 1067 })}</div>
  </div>
</section>

<section class="sekcija" aria-labelledby="cekanje-n" style="padding-top:0">
  <div class="wrap">
    <div class="panel">
      <p class="nadnaslov">Dok čekate šlep</p>
      <h2 id="cekanje-n" style="margin-bottom:20px">Bezbednost na prvom mestu</h2>
      <ol class="koraci koraci--4">
        <li><h3>Svi migavci</h3><p>Uključite sva četiri pokazivača pravca.</p></li>
        <li><h3>Prsluk</h3><p>Obucite reflektujući prsluk pre nego što izađete iz auta.</p></li>
        <li><h3>Trougao</h3><p>Postavite sigurnosni trougao iza vozila, dovoljno daleko da ga drugi vozači vide na vreme.</p></li>
        <li><h3>Sklonite se</h3><p>Sačekajte van kolovoza, iza zaštitne ograde ako je ima.</p></li>
      </ol>
    </div>
  </div>
</section>
${kontaktBlok('Gde se nalazimo')}`,
}));

/* ---------- Perionica ---------- */
sve.push(strana({
  fajl: 'autoperionica.html',
  title: 'Samouslužna autoperionica Vranje | Auto Maki',
  opis: `Samouslužna autoperionica u Vranju, ${S.adresa}. Operite auto sami, kad vama odgovara.`,
  og: 'perionica',
  waTxt: 'Zdravo, imam pitanje za perionicu.',
  ld: [{ '@type': 'AutoWash', name: 'Auto Maki samouslužna autoperionica', address: adresaLD, telephone: S.telefon_link, url: BASE + 'autoperionica.html', image: BASE + 'assets/og/perionica.jpg', parentOrganization: firmaRef }],
  telo: `
<section class="hero hero--usluga" aria-labelledby="hero-n">
  <div class="hero__slika">${slika('perionica-mlaz', '', { eager: true, w: 1600, h: 900 })}</div>
  <div class="wrap hero__in">
    <ol class="mrvice"><li><a href="index.html">Početna</a></li><li aria-current="page">Autoperionica</li></ol>
    <p class="nadnaslov">Usluga 04</p>
    <h1 id="hero-n">Samouslužna autoperionica</h1>
    <p class="hero__lead">Dođete, uđete u boks i operete auto sami. Kad vama odgovara, koliko vam treba.</p>
    <div class="hero__cta">
      <a class="btn btn--signal" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`AUTO MAKI, ${S.adresa}, ${S.grad}`)}" target="_blank" rel="noopener">${I.pin}Kako do nas</a>
    </div>
  </div>
</section>

<section class="sekcija" aria-labelledby="kako-n">
  <div class="wrap">
    <div class="zag"><div><p class="nadnaslov">Kako radi</p><h2 id="kako-n">Pranje u četiri koraka</h2></div></div>
    <ol class="koraci koraci--4">
      <li><h3>Uđite u boks</h3><p>Uparkirajte u slobodan boks i ugasite motor.</p></li>
      <li><h3>Platite na aparatu</h3><p>Ako niste sigurni kako se plaća, pozovite nas pre nego što krenete.</p></li>
      <li><h3>Birate program</h3><p>Na aparatu birate program i perete pištoljem pod pritiskom.</p></li>
      <li><h3>Završite i krenite</h3><p>Isperite auto do kraja i oslobodite boks za sledećeg.</p></li>
    </ol>
  </div>
</section>

<section class="sekcija" aria-labelledby="gde-n" style="padding-top:0">
  <div class="wrap split">
    <div>
      <p class="nadnaslov">Lokacija</p>
      <h2 id="gde-n" style="margin-bottom:18px">Na istoj adresi kao plac</h2>
      <ul class="lista">
        <li>${S.adresa}, ${S.grad}</li>
        <li>${S.radno_vreme}</li>
        <li>Pitanja: <a class="num" href="${TEL}">${S.telefon_prikaz}</a></li>
      </ul>
      ${napomenaCena('Pitajte za cenu pranja i načine plaćanja.')}
    </div>
    <div class="foto-par">
      ${slika('perionica-mlaz', 'Pranje automobila mlazom vode pod pritiskom', { sizes: '(min-width:900px) 30vw, 100vw', w: 1600, h: 900 })}
      ${slika('perionica-rucno', 'Ručno pranje automobila sunđerom', { sizes: '(min-width:900px) 20vw, 100vw', w: 1600, h: 1067 })}
    </div>
  </div>
</section>
${kontaktBlok('Gde se nalazimo')}`,
}));

/* ---------- Rent a car ---------- */
sve.push(strana({
  fajl: 'rent-a-car.html',
  title: 'Rent a car Vranje | Iznajmljivanje automobila | Auto Maki',
  opis: `Rent a car u Vranju. Pošaljite datume preko WhatsApp-a i javljamo koji auto je slobodan. ${S.adresa}, ${S.telefon_prikaz}.`,
  og: 'rent',
  waTxt: 'Zdravo, zanima me iznajmljivanje automobila.',
  ld: [{ '@type': 'AutoRental', name: 'Auto Maki rent a car', address: adresaLD, telephone: S.telefon_link, url: BASE + 'rent-a-car.html', image: BASE + 'assets/og/rent.jpg', parentOrganization: firmaRef }],
  telo: `
<div class="stranica-zag">
  <div class="wrap">
    <ol class="mrvice"><li><a href="index.html">Početna</a></li><li aria-current="page">Rent a car</li></ol>
    <p class="nadnaslov">Usluga 05</p>
    <h1>Rent a car Vranje</h1>
    <p class="uvod" style="margin:0">Treba vam auto na dan, za vikend ili za put? Pošaljite datume, a mi javljamo šta je slobodno i koliko košta.</p>
  </div>
</div>
<section class="sekcija" aria-labelledby="flota-n" style="padding-top:40px">
  <div class="wrap">
    <h2 id="flota-n" class="sr-only">Vozila za iznajmljivanje</h2>
    <div class="rent-grid" data-rent><p style="color:var(--siva)">Učitavanje…</p></div>
  </div>
</section>
<section class="sekcija" id="upit" aria-labelledby="upit-n" style="padding-top:0">
  <div class="wrap split">
    <div>
      <p class="nadnaslov">Upit</p>
      <h2 id="upit-n" style="margin-bottom:18px">Pošaljite datume</h2>
      <p class="uvod">Upišite od kad do kad vam treba auto. Poruka se otvara u WhatsApp-u, a mi odgovaramo sa ponudom.</p>
      ${napomenaCena('Cenu po danu i uslove (depozit, dokumenta) dobijate u odgovoru.')}
    </div>
    <form class="forma" data-wa-forma="rent" novalidate>
      <div class="red">
        <div class="polje"><label for="r-od">Preuzimanje</label><input id="r-od" name="Od" type="date" required></div>
        <div class="polje"><label for="r-do">Vraćanje</label><input id="r-do" name="Do" type="date" required></div>
      </div>
      <div class="polje"><label for="r-auto">Vozilo</label><select id="r-auto" name="Vozilo"><option value="">Svejedno, šta je slobodno</option></select></div>
      <div class="polje"><label for="r-ime">Vaše ime</label><input id="r-ime" name="Ime" autocomplete="name"></div>
      <p class="forma__napomena" data-forma-greska role="alert" hidden></p>
      <button class="btn btn--wa btn--blok" type="submit">${I.wa}Pošalji upit na WhatsApp</button>
    </form>
  </div>
</section>
${kontaktBlok('Preuzimanje vozila')}`,
}));

/* ---------- Kontakt ---------- */
sve.push(strana({
  fajl: 'kontakt.html',
  title: `Kontakt | Auto Maki, ${S.adresa}, Vranje`,
  opis: `Auto Maki, ${S.adresa}, ${S.postanski_broj} ${S.grad}. Telefon, WhatsApp i Viber: ${S.telefon_prikaz}. ${S.radno_vreme}.`,
  og: 'naslovna',
  ld: [{ '@type': 'ContactPage', url: BASE + 'kontakt.html', about: firmaRef }],
  telo: `
<div class="stranica-zag">
  <div class="wrap">
    <ol class="mrvice"><li><a href="index.html">Početna</a></li><li aria-current="page">Kontakt</li></ol>
    <h1>Kontakt</h1>
    <p class="uvod" style="margin:0">Najbrže je da pozovete. Ako vam je lakše da pišete, poruka ide pravo na naš WhatsApp.</p>
  </div>
</div>
${kontaktBlok(`${S.adresa}, ${S.grad}`)}
<section class="sekcija" aria-labelledby="poruka-n" style="padding-top:0">
  <div class="wrap split">
    <div>
      <p class="nadnaslov">Poruka</p>
      <h2 id="poruka-n" style="margin-bottom:18px">Pišite nam</h2>
      <p class="uvod">Izaberite temu i napišite pitanje. Otvoriće se WhatsApp sa porukom, vi samo pritisnete „Pošalji”.</p>
    </div>
    <form class="forma" data-wa-forma="kontakt" novalidate>
      <div class="polje"><label for="k-tema">Tema</label>
        <select id="k-tema" name="Tema"><option>Kupovina vozila</option><option>Dovoz iz inostranstva</option><option>Šlep služba</option><option>Autoperionica</option><option>Rent a car</option><option>Nešto drugo</option></select>
      </div>
      <div class="polje"><label for="k-poruka">Poruka</label><textarea id="k-poruka" name="Poruka" required></textarea></div>
      <div class="polje"><label for="k-ime">Vaše ime</label><input id="k-ime" name="Ime" autocomplete="name"></div>
      <p class="forma__napomena" data-forma-greska role="alert" hidden></p>
      <button class="btn btn--wa btn--blok" type="submit">${I.wa}Pošalji na WhatsApp</button>
    </form>
  </div>
</section>`,
}));

/* ---------- Izvori fotografija ---------- */
sve.push(strana({
  fajl: 'izvori-fotografija.html',
  title: 'Izvori fotografija | Auto Maki',
  opis: 'Spisak izvora i licenci fotografija korišćenih na sajtu.',
  og: 'naslovna', noindex: true, akt: '',
  telo: `
<div class="wrap tekst-stranica" style="padding-block:56px 80px">
  <h1 style="font-size:clamp(40px,6vw,64px);margin-bottom:18px">Izvori fotografija</h1>
  <p class="uvod">Fotografije na ovoj verziji sajta su privremene ilustracije. Biće zamenjene fotografijama placa i vozila Auto Maki.</p>
  <table class="tabela izvori">
    <thead><tr><th scope="col">Fotografija</th><th scope="col">Autor i licenca</th></tr></thead>
    <tbody>
      <tr><td>Šlep sa platformom</td><td>Arths-at, Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener" target="_blank">CC BY-SA 4.0</a>, isečeno</td></tr>
      <tr><td>Red polovnih automobila</td><td>David Howard, geograph.org.uk preko Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/2.0/" rel="noopener" target="_blank">CC BY-SA 2.0</a></td></tr>
      <tr><td>Transporter sa automobilima</td><td>Syced, Wikimedia Commons, CC0</td></tr>
      <tr><td>Ostale fotografije vozila i perionice</td><td>Unsplash, <a href="https://unsplash.com/license" rel="noopener" target="_blank">Unsplash licenca</a></td></tr>
    </tbody>
  </table>
</div>`,
}));

/* ---------- 404 ---------- */
strana({
  fajl: '404.html', title: 'Stranica nije pronađena | Auto Maki', opis: 'Stranica nije pronađena.', og: 'naslovna', noindex: true, akt: '',
  telo: `
<div class="wrap" style="padding-block:80px 120px">
  <p class="nadnaslov">Greška 404</p>
  <h1 style="margin-bottom:18px">Ova stranica ne postoji</h1>
  <p class="uvod">Možda je vozilo prodato ili je link pogrešan.</p>
  <div class="hero__cta" style="margin-top:24px"><a class="btn btn--signal" href="index.html">Na početnu</a><a class="btn btn--obris" href="vozila.html">Pogledaj vozila</a></div>
</div>`,
});

/* ---------- sitemap, robots, llms ---------- */
const danas = new Date().toISOString().slice(0, 10);
const vozila = JSON.parse(readFileSync('data/vozila.json', 'utf8'));
const urls = [...sve.filter(s => !s.noindex).map(s => s.url).filter(u => !u.endsWith('vozilo.html')),
  ...vozila.filter(v => !v.prodato).map(v => `${BASE}vozilo.html?id=${encodeURIComponent(v.id)}`)];
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.replace(/&/g, '&amp;')}</loc><lastmod>${danas}</lastmod></url>`).join('\n')}
</urlset>
`);

writeFileSync('robots.txt', `# Auto Maki: pretraživači i AI asistenti su dobrodošli
User-agent: *
Allow: /
Disallow: /alati/
Disallow: /slike/izvorno/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${BASE}sitemap.xml
`);

writeFileSync('llms.txt', `# Auto Maki, Vranje

> Auto plac u Vranju (Srbija) sa pet usluga na jednoj adresi: prodaja polovnih vozila, dovoz vozila iz inostranstva, šlep služba, samouslužna autoperionica i rent a car.

- Adresa: ${S.adresa}, ${S.postanski_broj} ${S.grad}, Srbija
- Telefon, WhatsApp i Viber: ${S.telefon_prikaz} (${S.telefon_link})
- Radno vreme (prema Google mapama): ${S.radno_vreme}
- Google ocena: ${OCENA} od 5 (${S.google_broj_recenzija} recenzija)
- Cene usluga se ne objavljuju na sajtu; dobijaju se telefonom.

## Usluge

- [Polovni automobili](${BASE}vozila.html): ponuda vozila na placu, sa filterima po marki, ceni, godištu, gorivu i menjaču. Podaci o vozilima su u [data/vozila.json](${BASE}data/vozila.json).
- [Dovoz vozila iz inostranstva](${BASE}dovoz-vozila.html): kupac javlja koji auto traži, Auto Maki ga pronalazi i dovozi do Vranja.
- [Šlep služba](${BASE}slep-sluzba.html): vuča vozila u Vranju, poziv na ${S.telefon_prikaz}.
- [Samouslužna autoperionica](${BASE}autoperionica.html): boksovi za samostalno pranje na istoj adresi.
- [Rent a car](${BASE}rent-a-car.html): iznajmljivanje automobila, upit sa datumima preko WhatsApp-a.

## Kontakt

- [Kontakt i mapa](${BASE}kontakt.html)
`);

console.log('Generisano:', sve.length + 1, 'stranica + sitemap.xml, robots.txt, llms.txt');
