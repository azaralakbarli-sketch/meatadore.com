// Meatadore — shared site script: language switch, header/footer, branches, menu rendering.
(function () {
  // ---------- Config (edit here) ----------
  const CFG = {
    phone: '+994 50 770 99 66',
    whatsapp: '994507709966',
    instagram: 'https://www.instagram.com/meatadore/',
    tiktok: 'https://www.tiktok.com/@meatadore',
    wolt: 'https://wolt.com/az/aze/baku/restaurant/meatadore',
    bolt: '',                            // Bolt Food link — add when available
  };
  const BRANCHES = [
    {name:{az:"Sahil (Mərkəz)", en:"Sahil (Downtown)"}, addr:{az:"H. Z. Tağıyev küç. 6, Bakı", en:"6 Haji Zeynalabdin Taghiyev St, Baku"}, hours:{az:"B.e–Cü 12:00–01:00 · Ş–B 12:00–02:00", en:"Mon–Fri 12:00–01:00 · Sat–Sun 12:00–02:00"}, tel:"+994 50 770 99 66", wa:"994507709966", map:"https://maps.app.goo.gl/C61J2pLQvAEkerWWA", photos:["assets/web/branch-sahil-mural.jpg","assets/web/table-spread.jpg","assets/web/guest-eating.jpg"]},
    {name:{az:"Nizami (Caspian)", en:"Nizami (Caspian)"}, addr:{az:"Cəfər Cabbarlı küç. 38, Bakı", en:"38 Jafar Jabbarli St, Baku"}, hours:{az:"B.e–Ş 12:00–00:00 · B 12:00–02:00", en:"Mon–Sat 12:00–00:00 · Sun 12:00–02:00"}, tel:"+994 51 512 34 70", wa:"994515123470", map:"https://maps.app.goo.gl/xtfJTt7RzrqCkG1E8", photos:["assets/web/onion-rings.jpg","assets/web/table-spread.jpg","assets/web/foil-wrap-logo.jpg"]},
    {name:{az:"Nərimanov (Whitestone)", en:"Narimanov (Whitestone)"}, addr:{az:"İzzətdin Həsənoğlu küç. 11, Bakı", en:"11 Izzatdin Hasanoglu St, Baku"}, hours:{az:"B.e–Ş 12:00–00:00 · B 12:00–02:00", en:"Mon–Sat 12:00–00:00 · Sun 12:00–02:00"}, tel:"+994 10 712 99 66", wa:"994107129966", map:"https://maps.app.goo.gl/75RbXZXZXe6hat9G8", photos:["assets/web/branch-narimanov-sign.jpg","assets/web/burger-fries-menu.jpg","assets/web/triple-cheeseburger-hands.jpg"]},
    {name:{az:"Ağ Şəhər", en:"White City"}, addr:{az:"Mərkəzi Bulvar küç. 1, Bakı", en:"1 Markazi Bulvar St, Baku"}, hours:{az:"B.e–Ş 12:00–00:00 · B 12:00–02:00", en:"Mon–Sat 12:00–00:00 · Sun 12:00–02:00"}, tel:"+994 10 321 99 66", wa:"994103219966", map:"https://maps.app.goo.gl/FXAE962VdKrWjPwT6", photos:["assets/web/guest-eating.jpg","assets/web/onion-rings.jpg","assets/web/table-spread.jpg"]},
        {name:{az:"SABAH.city", en:"SABAH.city"}, addr:{az:"SABAH.city İnnovasiya Mərkəzi, Bakı", en:"SABAH.city Innovation Center, Baku"}, hours:{az:"Tezliklə", en:"Coming soon"}, tel:"", wa:"", map:"https://maps.google.com/?q=SABAH.city+Innovation+Center+Baku", photos:["assets/web/foil-wrap-logo.jpg","assets/web/burger-fries-menu.jpg","assets/web/table-spread.jpg"], soon:true},
  ];

  let lang = 'az';
  try { const s = localStorage.getItem('meatadore-lang'); if (s === 'en' || s === 'az') lang = s; } catch (e) {}
  const T = (o) => typeof o === 'string' ? o : (o ? (o[lang] ?? o.az ?? '') : '');
  const money = (v) => v.toFixed(2).replace('.', ',') + ' ₼';
  const SIZES = ['80 qr', '160 qr', '240 qr'];
  const wa = (msg) => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const page = document.body.dataset.page || 'home';
  let waText = '';

  // ---------- Header / WhatsApp bar / order strip / footer ----------
  function shell() {
    const nav = [
      ['index.html', {az:'Ana səhifə', en:'Home'}, 'home'],
      ['menu.html', {az:'Menyu', en:'Menu'}, 'menu'],
      ['index.html#branches', {az:'Filiallar', en:'Locations'}],
      ['index.html#story', {az:'Hekayəmiz', en:'Our story'}],
      ['index.html#corporate', {az:'Korporativ', en:'Corporate'}],
      ['index.html#contact', {az:'Əlaqə', en:'Contact'}],
    ];
    waText = lang==='az' ? 'Salam! Meatadore ' : 'Hi! Meatadore ';
    const waList = BRANCHES.filter(b=>b.wa).map(b=>`<a href="https://wa.me/${b.wa}?text=${encodeURIComponent(waText+T(b.name)+(lang==='az'?' — rezervasiya / öncədən sifariş üçün yazıram.':' — I\'d like to reserve a table / pre-order for pickup.'))}" target="_blank" rel="noopener"><b>${T(b.name)}</b><span>${b.tel}</span></a>`).join('');
    document.getElementById('shell-top').innerHTML = `
    <div class="wa-bar"><div class="wrap">
      <span><strong>${lang==='az'?'Rezervasiya və öncədən sifariş':'Reservations & pre-orders'}</strong> <span>${lang==='az'?'— filialın WhatsApp-ına yazın':'— message your branch on WhatsApp'}</span></span>
      <details class="wa-pick">
        <summary class="wa-btn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>
          <span>${lang==='az'?'WhatsApp — filialı seç':'WhatsApp — pick a branch'}</span>
        </summary>
        <div class="wa-menu">${waList}</div>
      </details>
    </div></div>
    <header class="site"><div class="wrap">
      <a class="brand" href="index.html"><img class="logo" src="assets/web/logo-circle.png" alt="Meatadore"><img class="word" src="assets/web/wordmark-white.png" alt=""></a>
      <nav class="main" aria-label="Site">${nav.map(n=>`<a href="${n[0]}" ${n[2]===page?'aria-current="page"':''}>${T(n[1])}</a>`).join('')}</nav>
      <div class="lang" role="group" aria-label="Dil / Language">
        <button type="button" data-lang="az" aria-pressed="${lang==='az'}">AZ</button>
        <button type="button" data-lang="en" aria-pressed="${lang==='en'}">EN</button>
      </div>
      <button class="burger" type="button" aria-label="Menu" aria-expanded="false">☰</button>
    </div>
    <nav class="mobile" hidden>${nav.map(n=>`<a href="${n[0]}">${T(n[1])}</a>`).join('')}</nav>
    </header>`;
    document.querySelectorAll('#shell-top [data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    const bb = document.querySelector('#shell-top .burger'), mob = document.querySelector('#shell-top nav.mobile');
    bb.addEventListener('click', () => { mob.hidden = !mob.hidden; bb.setAttribute('aria-expanded', String(!mob.hidden)); });

    const os = document.getElementById('order-strip');
    if (os) os.innerHTML = `<div class="wrap">
      <span class="label">${lang==='az'?'Sifariş:':'Order:'}</span>
      <a class="chip" href="${CFG.wolt}" target="_blank" rel="noopener"><b style="background:#00c2e8"></b>Wolt</a>
      ${CFG.bolt?`<a class="chip" href="${CFG.bolt}" target="_blank" rel="noopener"><b style="background:#34d186"></b>Bolt Food</a>`:''}
      <a class="chip" href="#branches"><b style="background:var(--wa)"></b>${lang==='az'?'WhatsApp — rezerv / öncədən sifariş':'WhatsApp — reserve / pre-order'}</a>
      <a class="chip" href="${CFG.instagram}" target="_blank" rel="noopener"><b style="background:#e1306c"></b>Instagram</a>
    </div>`;

    document.getElementById('shell-footer').innerHTML = `<div class="wrap">
      <div><h4>${lang==='az'?'Əlaqə':'Contact'}</h4><div class="phone"><a href="tel:${CFG.phone.replace(/\s/g,'')}" style="text-decoration:none">${CFG.phone}</a></div>
        <div style="margin-top:8px"><a href="index.html#branches">WhatsApp (${lang==='az'?'filiallar':'branches'})</a> · <a href="${CFG.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${CFG.tiktok}" target="_blank" rel="noopener">TikTok</a></div></div>
      <div><h4>${lang==='az'?'İş saatları':'Hours'}</h4><div>${lang==='az'?'Həftə içi 12:00 – 00:00':'Weekdays 12:00 – 00:00'}</div><div>${lang==='az'?'Həftə sonu 12:00 – 02:00':'Weekends 12:00 – 02:00'}</div>
        <div style="font-size:13px;color:#a8988e">${lang==='az'?'Business lunch: həftə içi 12:00–15:00':'Business lunch: weekdays 12:00–15:00'}</div></div>
      <div><h4>${lang==='az'?'Filiallar':'Locations'}</h4><div style="font-size:14px;line-height:1.8">${BRANCHES.filter(b=>b.tel).map(b=>`<div>${T(b.name)} · ${b.tel}</div>`).join('')}</div></div>
      <div class="fine"><span class="tags">#bestburgerintown · #özüdü · #dəhşətamiz · #theyloveit</span><br>© ${new Date().getFullYear()} Meatadore. ${lang==='az'?'Xidmət haqqı 6%. Qiymətlər QR menyu ilə eynidir.':'Service charge 6%. Prices match our QR menu.'}</div>
    </div>`;
  }

  // ---------- Menu ----------
  function card(it) {
    const desc = (it[lang] ?? it.az ?? '');
    let prices;
    if (it.p.length === 3) prices = `<div class="prices">` + it.p.map((v,k)=> v==null ? `<div class="na"><small>${SIZES[k]}</small><strong>—</strong></div>` : `<div><small>${SIZES[k]}</small><strong>${money(v)}</strong></div>`).join('') + `</div>`;
    else prices = `<div class="price1">${money(it.p[0])}</div>`;
    const tags = (it.hot?`<span class="tag hot">${lang==='az'?'acılı':'spicy'}</span>`:'') + (it.veg?`<span class="tag veg">veggie</span>`:'');
    return `<article class="card">${it.img?`<img src="assets/menu/${it.img}.jpg" alt="${T(it.n)}" loading="lazy">`:''}<div class="body"><div class="name">${T(it.n)}${tags}</div>${desc?`<p class="ing">${desc}</p>`:''}${prices}</div></article>`;
  }
  function renderMenu() {
    const root = document.getElementById('menuRoot'); if (!root) return; root.innerHTML = '';
    const tabs = document.getElementById('tabs'); tabs.innerHTML = '';
    MENU.forEach((c, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = T(c.cat); b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', () => { document.getElementById('cat' + i).scrollIntoView({ behavior: 'smooth', block: 'start' }); tabs.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); });
      tabs.appendChild(b);
      const sec = document.createElement('div'); sec.className = 'cat'; sec.id = 'cat' + i;
      sec.innerHTML = `<h3>${T(c.cat)}</h3>` + (c.note ? `<p class="note">${T(c.note)}</p>` : '');
      if (c.compact) {
        const g = document.createElement('div'); g.className = 'compact';
        c.items.forEach(it => { g.innerHTML += `<div><span>${T(it.n)}</span><strong>${money(it.p[0])}</strong></div>`; });
        sec.appendChild(g);
      } else {
        const g = document.createElement('div'); g.className = 'grid';
        c.items.forEach(it => { g.innerHTML += card(it); });
        sec.appendChild(g);
      }
      root.appendChild(sec);
    });
  }
  function renderTeaser() {
    const t = document.getElementById('teaser'); if (!t) return;
    const picks = ['Queen', 'Karma', 'Mary Jane', 'Lord Of The Rings', 'Philly Cheesesteak', 'Fancy'];
    const all = MENU.flatMap(c => c.items);
    t.innerHTML = picks.map(n => all.find(i => i.n === n)).filter(Boolean).map(card).join('');
  }

  // ---------- Branches ----------
  let slideTimer = null, slideIdx = 0;
  function openBranch(b) {
    const v = document.getElementById('bview'); v.hidden = false;
    document.getElementById('bvName').textContent = T(b.name);
    document.getElementById('bvAddr').textContent = T(b.addr);
    document.getElementById('bvHours').textContent = T(b.hours);
    document.getElementById('bvMap').href = b.map;
    document.getElementById('bvMap').textContent = lang === 'az' ? 'Xəritədə aç' : 'Open in Maps';
    const tel = document.getElementById('bvTel'); tel.hidden = !b.tel; tel.textContent = b.tel; tel.href = 'tel:' + b.tel.replace(/\s/g, '');
    const w = document.getElementById('bvWa'); w.hidden = !b.wa; w.href = `https://wa.me/${b.wa}?text=${encodeURIComponent(waText+T(b.name)+(lang==='az'?' — rezervasiya / öncədən sifariş üçün yazıram.':' — I\'d like to reserve a table / pre-order for pickup.'))}`; w.textContent = lang==='az'?'WhatsApp — rezerv / sifariş':'WhatsApp — reserve / pre-order';
    const s = document.getElementById('slides'); s.innerHTML = b.photos.map((p, i) => `<img src="${p}" alt="" class="${i === 0 ? 'on' : ''}">`).join('');
    const d = document.getElementById('dots'); d.innerHTML = b.photos.map((p, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
    clearInterval(slideTimer); slideIdx = 0;
    slideTimer = setInterval(() => { const imgs = s.querySelectorAll('img'); const dots = d.querySelectorAll('i'); imgs[slideIdx].classList.remove('on'); dots[slideIdx].classList.remove('on'); slideIdx = (slideIdx + 1) % imgs.length; imgs[slideIdx].classList.add('on'); dots[slideIdx].classList.add('on'); }, 3200);
    v.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function renderBranches() {
    const g = document.getElementById('bgrid'); if (!g) return; g.innerHTML = '';
    BRANCHES.forEach(b => {
      const el = document.createElement('button'); el.type = 'button'; el.className = 'bcard';
      el.innerHTML = `<span class="bn">${T(b.name)}</span><span class="ba">${T(b.addr)}</span><span class="bp">${b.tel||''}</span><span class="open">${b.soon ? (lang==='az'?'Tezliklə':'Coming soon') : (lang === 'az' ? 'Fotolar və xəritə →' : 'Photos & map →')}</span>`;
      el.addEventListener('click', () => openBranch(b));
      g.appendChild(el);
    });
    const c = document.getElementById('bclose'); if (c && !c.dataset.bound) { c.dataset.bound = 1; c.addEventListener('click', () => { document.getElementById('bview').hidden = true; clearInterval(slideTimer); }); }
  }


  // Guest reviews — reposted by @meatadore in the "#theyloveit" Instagram highlight
  const REVIEWS = [
    {who:"Rovshan Akbarov", q:{az:"Philly Cheesesteak-i sınadıq. Bu sendviçin vətənində yarım il yaşamış adam kimi deyirəm: dadı orijinaldan demək olar fərqlənmir. Gəlin, dadına baxın!", en:"We tried the Philly Cheesesteak. As someone who lived half a year where this sandwich comes from: the taste is almost indistinguishable from the original. Come and try it!"}, note:{az:"rus dilindən", en:"translated from Russian"}},
    {who:"@_hasanzadeh_p", q:{az:"Ləzzətli, doyumcul. Səhifədə gördük, getdik dadına baxmağa. Möhtəşəm.", en:"Delicious and filling. Saw it on the page, went to try it. Magnificent."}, note:{az:"", en:"translated from Azerbaijani"}},
    {who:"@whygo1", q:{az:"All I love: Burger & Cola.", en:"All I love: Burger & Cola."}},
    {who:"@gastrobaku__", q:{az:"Soooo good.", en:"Soooo good."}},
    {who:"@nigar.mammadli", q:{az:"So tasty.", en:"So tasty."}},
    {who:"Instagram", q:{az:"Adam bilmir hardan başlasın…", en:"You don’t know where to start…"}, note:{az:"", en:"translated from Azerbaijani"}},
    {who:"Instagram", q:{az:"Proper tasty hangover food! Make burgers even bigger plss!", en:"Proper tasty hangover food! Make burgers even bigger plss!"}},
  ];
  function renderReviews() {
    const g = document.getElementById('reviewsGrid'); if (!g) return;
    g.innerHTML = REVIEWS.map(r => `<div class="review"><div class="q">“${T(r.q)}”</div><div class="who">${r.who}${r.note && T(r.note) ? ` <span class="lang">· ${T(r.note)}</span>` : ''}</div></div>`).join('');
  }

  function setLang(l) { lang = l; try { localStorage.setItem('meatadore-lang', l); } catch (e) {} render(); }
  function render() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-az]').forEach(el => { el.textContent = el.getAttribute('data-' + lang); });
    shell(); renderMenu(); renderTeaser(); renderBranches(); renderReviews();
  }
  render();
})();
