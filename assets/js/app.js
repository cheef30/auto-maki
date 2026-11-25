/* Auto Maki · vanilla JS, bez biblioteka */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const strana = document.body.dataset.strana;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const broj = (n) => Number(n).toLocaleString('sr-RS');
  const cena = (n) => `${broj(n)}<small>€</small>`;
  const getJSON = (p) => fetch(p, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(p); return r.json(); });

  const IK = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>',
    viber: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3c-4.6 0-8 1.4-8 7 0 3.3 1.2 5 3 5.9V20l3-2.6c.6.1 1.3.1 2 .1 4.6 0 8-1.4 8-7.5S16.6 3 12 3z"/><path d="M9.5 8.5c.3 2.6 2.4 4.7 5 5"/></svg>',
  };
  let SITE = null;
  const site = () => SITE ??= getJSON('data/site.json');
  const waUrl = (s, txt) => `https://wa.me/${s.whatsapp_broj}?text=${encodeURIComponent(txt)}`;
  const otvoriWA = (url) => { const w = window.open(url, '_blank', 'noopener'); if (!w) location.href = url; };

  /* ---------- Meni ---------- */
  const meniBtn = $('.meni-btn'), meni = $('#meni');
  if (meniBtn && meni) {
    const postavi = (otv) => {
      meni.hidden = !otv; meni.classList.toggle('otvoren', otv);
      meniBtn.setAttribute('aria-expanded', otv); meniBtn.setAttribute('aria-label', otv ? 'Zatvori meni' : 'Otvori meni');
      document.documentElement.style.overflow = otv ? 'hidden' : '';
    };
    meniBtn.addEventListener('click', () => { const o = meni.hidden; postavi(o); if (o) $('a', meni).focus(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !meni.hidden) { postavi(false); meniBtn.focus(); } });
    matchMedia('(min-width:1000px)').addEventListener('change', e => e.matches && postavi(false));
  }

  /* ---------- Kartica vozila ---------- */
  const img = (ime, alt, sizes, eager) =>
    `<img src="assets/img/${ime}-800.webp" srcset="assets/img/${ime}-800.webp 800w, assets/img/${ime}-1600.webp 1600w" sizes="${sizes}" width="800" height="533" alt="${esc(alt)}"${eager ? '' : ' loading="lazy" decoding="async"'}>`;
  const naziv = (v) => `${v.marka} ${v.model}`;
  const kartica = (v) => `
    <a class="auto${v.prodato ? ' auto--prodato' : ''}" href="vozilo.html?id=${encodeURIComponent(v.id)}">
      <div class="auto__slika">
        ${img(v.slike[0], `${naziv(v)}, ${v.godiste}.`, '(min-width:1000px) 380px, (min-width:640px) 46vw, 82vw')}
        <div class="auto__oznake">${v.primer ? '<span class="oznaka oznaka--primer">Primer oglasa</span>' : ''}</div>
        ${v.prodato ? '<span class="prodato-traka">Prodato</span>' : ''}
      </div>
      <div class="auto__telo">
        <h3 class="auto__naziv">${esc(v.marka)}</h3>
        <p class="auto__model">${esc(v.model)}</p>
        <ul class="auto__podaci num">
          <li>${v.godiste}.</li><li>${broj(v.km)} km</li><li>${esc(v.gorivo)}</li><li>${esc(v.menjac)}</li>
        </ul>
        <div class="auto__dno">
          <span class="cena num">${v.prodato ? '<span class="sr-only">Prodato, bila je cena </span>' : ''}${cena(v.cena)}</span>
          <span class="auto__vise" aria-hidden="true">Detalji →</span>
        </div>
      </div>
    </a>`;
  const redosled = (a, b) => (a.prodato - b.prodato) || (b.istaknuto - a.istaknuto) || String(b.dodato).localeCompare(String(a.dodato));
  const greska = (el, msg) => { if (el) el.innerHTML = `<p style="color:var(--siva)">${msg}</p>`; };

  /* ---------- Naslovna: traka ---------- */
  const traka = $('[data-vozila-traka]');
  if (traka) getJSON('data/vozila.json')
    .then(v => { traka.innerHTML = v.slice().sort(redosled).slice(0, 6).map(kartica).join(''); })
    .catch(() => greska(traka, 'Vozila trenutno ne mogu da se učitaju. <a href="vozila.html">Otvorite ponudu</a>.'));

  /* ---------- Recenzije ---------- */
  const rec = $('[data-recenzije]');
  if (rec) getJSON('data/recenzije.json').then(d => {
    const pune = (d.recenzije || []).filter(r => r.ime?.trim() && r.tekst?.trim());
    if (!pune.length) return;
    rec.innerHTML = pune.map(r => `<blockquote class="recenzija"><p>„${esc(r.tekst.trim())}”</p><footer>${esc(r.ime.trim())}, Google</footer></blockquote>`).join('');
    rec.hidden = false;
  }).catch(() => {});

  /* ---------- Lista vozila ---------- */
  if (strana === 'vozila') {
    const forma = $('#filteri'), lista = $('[data-vozila-lista]'), brojEl = $('[data-broj]'), prazno = $('[data-prazno]');
    const sort = $('#f-sort'), toggle = $('.filteri-toggle'), aktivni = $('[data-aktivni-filteri]');
    toggle.addEventListener('click', () => { const o = !forma.classList.contains('otvoreni'); forma.classList.toggle('otvoreni', o); toggle.setAttribute('aria-expanded', o); });

    getJSON('data/vozila.json').then(svi => {
      const opcije = (sel, vals) => vals.forEach(v => sel.insertAdjacentHTML('beforeend', `<option value="${esc(v)}">${esc(v)}</option>`));
      const uniq = (k) => [...new Set(svi.map(v => v[k]))].sort((a, b) => String(a).localeCompare(String(b), 'sr'));
      opcije($('#f-marka'), uniq('marka'));
      opcije($('#f-gorivo'), uniq('gorivo'));
      opcije($('#f-menjac'), uniq('menjac'));
      const god = svi.map(v => v.godiste), maxG = Math.max(...god), minG = Math.min(...god);
      for (let g = maxG; g >= minG; g--) $('#f-godiste').insertAdjacentHTML('beforeend', `<option value="${g}">${g}.</option>`);

      // stanje iz URL-a
      const q = new URLSearchParams(location.search);
      ['marka', 'od', 'do', 'godiste', 'gorivo', 'menjac'].forEach(k => { if (q.has(k)) forma.elements[k].value = q.get(k); });
      if (q.has('sort')) sort.value = q.get('sort');

      const primeni = () => {
        const f = Object.fromEntries(['marka', 'od', 'do', 'godiste', 'gorivo', 'menjac'].map(k => [k, forma.elements[k].value.trim()]));
        const od = f.od ? Number(f.od) : 0, doo = f.do ? Number(f.do) : Infinity;
        let r = svi.filter(v => (!f.marka || v.marka === f.marka) && v.cena >= od && v.cena <= doo &&
          (!f.godiste || v.godiste >= Number(f.godiste)) && (!f.gorivo || v.gorivo === f.gorivo) && (!f.menjac || v.menjac === f.menjac));
        const s = sort.value;
        r.sort((a, b) => (a.prodato - b.prodato) || (s === 'jeftino' ? a.cena - b.cena : s === 'skupo' ? b.cena - a.cena : String(b.dodato).localeCompare(String(a.dodato))));
        lista.innerHTML = r.map(kartica).join('');
        prazno.hidden = r.length > 0;
        const n = r.filter(v => !v.prodato).length;
        brojEl.textContent = r.length ? `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'vozilo' : 'vozila'} u ponudi` : '';
        const brAkt = Object.values(f).filter(Boolean).length;
        aktivni.textContent = brAkt ? `(${brAkt})` : '';
        const p = new URLSearchParams(Object.entries({ ...f, sort: s === 'novo' ? '' : s }).filter(([, v]) => v));
        history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
      };
      forma.addEventListener('input', primeni);
      forma.addEventListener('change', primeni);
      forma.addEventListener('submit', e => e.preventDefault());
      forma.addEventListener('reset', () => setTimeout(primeni));
      sort.addEventListener('change', primeni);
      $('[data-ponisti]').addEventListener('click', () => { forma.reset(); });
      primeni();
    }).catch(() => greska(lista, 'Vozila trenutno ne mogu da se učitaju. Pozovite nas: 063 828 0780.'));
  }

  /* ---------- Jedno vozilo ---------- */
  if (strana === 'vozilo') {
    const box = $('[data-vozilo]');
    const id = new URLSearchParams(location.search).get('id');
    Promise.all([getJSON('data/vozila.json'), site()]).then(([svi, s]) => {
      const v = svi.find(x => x.id === id);
      if (!v) {
        box.innerHTML = `<div style="padding:40px 0 80px"><h1 style="font-size:clamp(40px,6vw,64px);margin-bottom:14px">Vozilo nije pronađeno</h1><p class="uvod">Možda je oglas uklonjen. Pogledajte šta je trenutno na placu.</p><a class="btn btn--signal" href="vozila.html">Sva vozila</a></div>`;
        document.title = 'Vozilo nije pronađeno | Auto Maki';
        return;
      }
      const ime = `${naziv(v)} ${v.godiste}.`;
      const msg = `Zdravo, zanima me ${v.marka} ${v.model} ${v.godiste} sa sajta.\n${location.href}`;
      const tel = `tel:${s.telefon_link}`;
      const opis = `${ime}, ${broj(v.km)} km, ${v.gorivo.toLowerCase()}, ${v.menjac.toLowerCase()} menjač. Cena ${broj(v.cena)} €. Auto Maki, Vranje.`;
      document.title = `${ime} | ${broj(v.cena)} € | Auto Maki Vranje`;
      $('meta[name="description"]').content = opis;
      $('meta[property="og:title"]').content = document.title;
      $('meta[property="og:description"]').content = opis;
      $('[data-mrvica]').textContent = naziv(v);
      const canon = document.createElement('link'); canon.rel = 'canonical'; canon.href = `${s.sajt_url.replace(/\/?$/, '/')}vozilo.html?id=${encodeURIComponent(v.id)}`; document.head.append(canon);

      const red = (k, val) => val ? `<tr><th scope="row">${k}</th><td>${val}</td></tr>` : '';
      const reg = v.registrovan_do ? (() => { const [g, m] = v.registrovan_do.split('-'); return m ? `${m}/${g}` : g; })() : '';
      box.innerHTML = `
      <div class="vozilo">
          <div class="galerija" aria-roledescription="galerija" aria-label="Fotografije: ${esc(naziv(v))}">
            <div class="galerija__traka" tabindex="0">
              ${v.slike.map((sl, i) => `<figure>${img(sl, `${ime} fotografija ${i + 1} od ${v.slike.length}`, '(min-width:1000px) 60vw, 100vw', i === 0)}</figure>`).join('')}
            </div>
            <span class="galerija__brojac num" aria-hidden="true"><span data-g-br>1</span> / ${v.slike.length}</span>
            ${v.slike.length > 1 ? `<button class="galerija__str galerija__str--l" type="button" aria-label="Prethodna fotografija"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <button class="galerija__str galerija__str--d" type="button" aria-label="Sledeća fotografija"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>` : ''}
            ${v.slike.length > 1 ? `<div class="galerija__palci">${v.slike.map((sl, i) => `<button type="button" aria-label="Fotografija ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}><img src="assets/img/${sl}-800.webp" alt="" width="88" height="59" loading="lazy"></button>`).join('')}</div>` : ''}
          </div>
        <aside class="vozilo__info" aria-label="Cena i kontakt">
          ${v.primer ? '<p class="primer-baner"><strong>Primer oglasa.</strong> Podaci i fotografije služe samo za prikaz sajta.</p>' : ''}
          ${v.prodato ? '<p class="prodato-baner">Ovo vozilo je prodato. Pozovite nas, možda imamo slično.</p>' : ''}
          <h1>${esc(v.marka)} <span class="vozilo__model">${esc(v.model)}</span></h1>
          <div class="vozilo__cena"><span class="cena num">${cena(v.cena)}</span></div>
          <dl class="vozilo__brzo">
            <div><dt>Godište</dt><dd>${v.godiste}.</dd></div>
            <div><dt>Km</dt><dd>${broj(v.km)}</dd></div>
            <div><dt>Gorivo</dt><dd>${esc(v.gorivo)}</dd></div>
          </dl>
          <div class="dugmad" style="grid-template-columns:1fr">
            <a class="btn btn--signal btn--xl" href="${tel}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>Pozovi ${esc(s.telefon_prikaz)}</a>
            <div class="dugmad" style="grid-template-columns:1fr 1fr">
              <a class="btn btn--wa" href="${waUrl(s, msg)}" target="_blank" rel="noopener" data-wa-vozilo>${IK.wa}WhatsApp</a>
              <a class="btn btn--viber" href="viber://chat?number=${encodeURIComponent(s.telefon_link)}">${IK.viber}Viber</a>
            </div>
          </div>
          <p style="margin:0;color:var(--siva);font-size:15px">Auto je na placu: ${esc(s.adresa)}, ${esc(s.grad)}. Javite se pre dolaska.</p>
          ${v.polovni_link ? `<a class="link-strelica" href="${esc(v.polovni_link)}" target="_blank" rel="noopener" style="justify-self:start">Oglas na Polovnim automobilima →</a>` : ''}
        </aside>
        <div class="vozilo__detalji">
          <div class="vozilo__podaci">
            <h2>Podaci o vozilu</h2>
            <table class="tabela num">
              ${red('Godište', `${v.godiste}.`)}${red('Kilometraža', `${broj(v.km)} km`)}${red('Gorivo', esc(v.gorivo))}
              ${red('Kubikaža', v.kubikaza ? `${broj(v.kubikaza)} cm³` : '')}${red('Snaga', v.snaga_kw ? `${v.snaga_kw} kW (${Math.round(v.snaga_kw * 1.36)} KS)` : '')}
              ${red('Menjač', esc(v.menjac))}${red('Karoserija', esc(v.karoserija))}${red('Boja', esc(v.boja))}${red('Registrovan do', reg)}
            </table>
          </div>
          ${v.opis ? `<div class="vozilo__opis" style="margin-top:40px"><h2>Opis</h2><p style="color:#d6d4ce;max-width:65ch">${esc(v.opis)}</p></div>` : ''}
        </div>

      </div>`;

      // pozivna traka na dnu nosi poruku za ovo vozilo
      const donjiWA = $('.pozivna .btn--wa'); if (donjiWA) donjiWA.href = waUrl(s, msg);

      // galerija
      const tr = $('.galerija__traka', box), brEl = $('[data-g-br]', box), palci = $$('.galerija__palci button', box);
      const idi = (i) => tr.scrollTo({ left: i * tr.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      const tren = () => Math.round(tr.scrollLeft / tr.clientWidth);
      tr.addEventListener('scroll', () => { const i = tren(); brEl.textContent = i + 1; palci.forEach((b, j) => b.setAttribute('aria-current', j === i)); }, { passive: true });
      palci.forEach((b, i) => b.addEventListener('click', () => idi(i)));
      $('.galerija__str--l', box)?.addEventListener('click', () => idi(Math.max(0, tren() - 1)));
      $('.galerija__str--d', box)?.addEventListener('click', () => idi(Math.min(v.slike.length - 1, tren() + 1)));
      tr.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); idi(Math.min(v.slike.length - 1, tren() + 1)); } if (e.key === 'ArrowLeft') { e.preventDefault(); idi(Math.max(0, tren() - 1)); } });

      // schema.org Car + Offer
      const base = s.sajt_url.replace(/\/?$/, '/');
      const ld = {
        '@context': 'https://schema.org', '@type': 'Car', name: ime, brand: { '@type': 'Brand', name: v.marka }, model: v.model,
        vehicleModelDate: String(v.godiste), mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.km, unitCode: 'KMT' },
        fuelType: v.gorivo, vehicleTransmission: v.menjac, bodyType: v.karoserija, color: v.boja,
        vehicleEngine: { '@type': 'EngineSpecification', engineDisplacement: { '@type': 'QuantitativeValue', value: v.kubikaza, unitCode: 'CMQ' }, enginePower: { '@type': 'QuantitativeValue', value: v.snaga_kw, unitCode: 'KWT' } },
        image: v.slike.map(sl => `${base}assets/img/${sl}-1600.webp`), description: v.opis, itemCondition: 'https://schema.org/UsedCondition',
        offers: { '@type': 'Offer', price: v.cena, priceCurrency: 'EUR', availability: v.prodato ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock', url: canon.href,
          seller: { '@type': 'AutoDealer', name: 'Auto Maki', telephone: s.telefon_link, address: { '@type': 'PostalAddress', streetAddress: s.adresa, addressLocality: s.grad, postalCode: s.postanski_broj, addressCountry: s.drzava } } },
      };
      const sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.textContent = JSON.stringify(ld); document.head.append(sc);

      // slična vozila
      const sl = svi.filter(x => x.id !== v.id && !x.prodato)
        .map(x => ({ x, d: (x.karoserija === v.karoserija ? 0 : 1) + Math.abs(x.cena - v.cena) / Math.max(v.cena, 1) }))
        .sort((a, b) => a.d - b.d).slice(0, 3).map(o => o.x);
      if (sl.length) { $('[data-slicna]').innerHTML = sl.map(kartica).join(''); $('[data-slicna-sekcija]').hidden = false; }
    }).catch(() => greska(box, 'Vozilo trenutno ne može da se učita. Pozovite nas: 063 828 0780.'));
  }

  /* ---------- Rent a car ---------- */
  const rentBox = $('[data-rent]');
  if (rentBox) getJSON('data/rent.json').then(lista => {
    rentBox.innerHTML = lista.map(r => `
      <article class="auto rent">
        <div class="auto__slika">${img(r.slika, r.naziv, '(min-width:760px) 33vw, 100vw')}
          <div class="auto__oznake">${r.primer ? '<span class="oznaka oznaka--primer">Primer</span>' : ''}</div></div>
        <div class="auto__telo">
          <h3 class="auto__naziv">${esc(r.naziv)}</h3>
          <p class="auto__model">${esc(r.klasa)}</p>
          <ul class="auto__podaci"><li>${esc(r.gorivo)}</li><li>${esc(r.menjac)}</li><li>${r.sedista} sedišta</li></ul>
          <div class="auto__dno" style="margin-bottom:16px">
            <span style="font-weight:700">${r.cena_dan ? `<span class="cena num">${cena(r.cena_dan)}</span> / dan` : 'Pozovite za cenu'}</span>
          </div>
          <button class="btn btn--obris btn--blok" type="button" data-rent-izbor="${esc(r.naziv)}">Izaberi ovaj auto</button>
        </div>
      </article>`).join('');
    const sel = $('#r-auto');
    lista.forEach(r => sel.insertAdjacentHTML('beforeend', `<option>${esc(r.naziv)}</option>`));
    $$('[data-rent-izbor]').forEach(b => b.addEventListener('click', () => { sel.value = b.dataset.rentIzbor; $('#upit').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#r-od').focus({ preventScroll: true }), 400); }));
  }).catch(() => greska(rentBox, 'Ponuda trenutno ne može da se učita. Pozovite nas: 063 828 0780.'));

  // današnji datum kao minimum
  const danas = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $$('input[type=date]').forEach(i => { i.min = danas; });
  const rOd = $('#r-od'), rDo = $('#r-do');
  if (rOd && rDo) rOd.addEventListener('change', () => { rDo.min = rOd.value || danas; if (rDo.value && rDo.value < rOd.value) rDo.value = rOd.value; });

  /* ---------- WhatsApp forme ---------- */
  const fmtDat = (d) => { const [g, m, dan] = d.split('-'); return `${dan}.${m}.${g}.`; };
  const UVOD = { dovoz: 'Zdravo, zanima me dovoz vozila iz inostranstva.', rent: 'Zdravo, zanima me iznajmljivanje automobila.', kontakt: 'Zdravo, pišem sa sajta Auto Maki.' };
  $$('[data-wa-forma]').forEach(f => f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gr = $('[data-forma-greska]', f);
    const prvi = $$('[required]', f).find(el => !el.value.trim());
    $$('[aria-invalid]', f).forEach(el => el.removeAttribute('aria-invalid'));
    const javi = (el, t) => { el.setAttribute('aria-invalid', 'true'); if (gr) { gr.textContent = t; gr.hidden = false; } el.focus(); };
    if (prvi) return javi(prvi, `Popunite polje „${$(`label[for="${prvi.id}"]`, f).textContent}”.`);
    if (f.dataset.waForma === 'rent' && rOd.value && rDo.value && rDo.value < rOd.value) return javi(rDo, 'Datum vraćanja mora biti posle preuzimanja.');
    if (gr) gr.hidden = true;
    const linije = [UVOD[f.dataset.waForma] || UVOD.kontakt, ''];
    $$('input, select, textarea', f).forEach(el => {
      const v = el.value.trim(); if (!v) return;
      linije.push(`${el.name}: ${el.type === 'date' ? fmtDat(v) : v}`);
    });
    otvoriWA(waUrl(await site(), linije.join('\n')));
  }));

  /* ---------- Šlep: pošalji lokaciju ---------- */
  const lokBtn = $('[data-lokacija]'), lokSt = $('[data-lokacija-status]');
  if (lokBtn) lokBtn.addEventListener('click', async () => {
    const s = await site();
    const posalji = (txt) => otvoriWA(waUrl(s, txt));
    if (!('geolocation' in navigator)) { lokSt.textContent = 'Telefon ne daje lokaciju. Pozovite nas i recite gde ste.'; return; }
    lokBtn.disabled = true; lokSt.textContent = 'Tražim vašu lokaciju…';
    navigator.geolocation.getCurrentPosition(p => {
      const { latitude: la, longitude: lo } = p.coords;
      lokSt.textContent = 'Lokacija pronađena. Otvaram WhatsApp…';
      lokBtn.disabled = false;
      posalji(`Zdravo, treba mi šlep. Moja lokacija:\nhttps://maps.google.com/?q=${la.toFixed(6)},${lo.toFixed(6)}`);
    }, () => {
      lokBtn.disabled = false;
      lokSt.textContent = 'Lokacija nije dozvoljena. Pozovite nas ili u poruci napišite gde ste.';
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  });
})();
