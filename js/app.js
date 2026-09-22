/* ============================================================
   NEXUS ARCADE — app logic
   ============================================================ */
(() => {
  'use strict';

  const LS_FAV = 'nexus_arcade_favs';
  const LS_CUSTOM = 'nexus_arcade_custom';
  const LS_IP = 'nexus_arcade_moon_ip';

  let catalog = initCatalog();
  let favs = new Set(readJson(LS_FAV, []));
  let activeChip = 'All';
  let query = '';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  /* ---------- persistence ---------- */
  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function writeJson(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  function initCatalog() {
    const customs = readJson(LS_CUSTOM, []);
    const baseTitles = new Set(DEFAULT_CATALOG.map(g => g.title.toLowerCase()));
    const zoneAdds = (typeof ZONES !== 'undefined' ? ZONES : []).filter(g => !baseTitles.has(g.title.toLowerCase()));
    return [...DEFAULT_CATALOG, ...zoneAdds, ...customs];
  }

  /* ---------- palette + thumb styling ---------- */
  function gradFor(g) { return GRADS[g] || GRADS.violet; }
  function thumbStyle(game, sat = 0.9) {
    const [a, b] = gradFor(game.grad).map(c => hexToRgba(c, game.placeholder ? 0.4 : sat));
    return `background: linear-gradient(135deg, ${a}, ${b});`;
  }
  function hexToRgba(hex, a = 1) {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  const CAT_TAG = { cloud: 'cloud', quick: 'quick', retro: 'retro' };
  const CAT_BADGE = {
    cloud: { text: 'Cloud', cls: 'cloud' },
    quick: { text: 'Web', cls: 'quick' },
    retro: { text: 'Retro', cls: 'retro' },
  };

  /* ---------- dynamic resolvers ---------- */
  function resolveUrl(game) {
    if (game.dynamic === 'moonlight') {
      const ip = localStorage.getItem(LS_IP);
      if (ip) return `https://${ip}:47990/web/`;
      return '';
    }
    return game.url || '';
  }
  function resolveEmbed(game) {
    if (game.dynamic === 'moonlight') return ''; // refuse to iframe self-host UI
    return game.embed || '';
  }

  /* ---------- card rendering ---------- */
  function favIcon(id) {
    return favs.has(id)
      ? '<svg viewBox="0 0 24 24" style="fill:currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';
  }

  function cardHTML(game) {
    const badge = CAT_BADGE[game.category];
    const tags = game.genres.map(g => `<span class="tag ${CAT_TAG[game.category]}">${g}</span>`).join('');
    const isCustom = game.id.startsWith('custom-');
    return `
      <article class="game-card" data-id="${game.id}">
        <div class="card-thumb" style="${thumbStyle(game)}">
          <span class="card-badge ${badge.cls}">${badge.text}</span>
          <button class="card-fav ${favs.has(game.id) ? 'active' : ''}" data-fav="${game.id}" title="Favorite" aria-label="Favorite">${favIcon(game.id)}</button>
          ${isCustom ? `<button class="card-del" data-del="${game.id}" title="Remove game" aria-label="Remove">✕</button>` : ''}
          <span class="thumb-icon">${game.icon}</span>
        </div>
        <div class="card-body">
          <h4 class="card-title">${game.title}</h4>
          <p class="card-desc">${game.desc}</p>
          <div class="card-tags">${tags}</div>
        </div>
      </article>`;
  }

  /* ---------- filtering ---------- */
  function matches(game) {
    if (game.category === 'favorites') return false;
    if (activeChip !== 'All' && !game.genres.includes(activeChip)) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = `${game.title} ${game.desc} ${game.genres.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  function renderAll() {
    renderInto('#gridAll', catalog.filter(g => matches(g) && g.category !== 'favorites' && !g.placeholder));

    for (const cat of ['cloud', 'quick', 'retro']) {
      renderInto('#grid' + cap(cat), catalog.filter(g => g.category === cat && matches(g)));
    }
    const favList = catalog.filter(g => favs.has(g.id));
    renderInto('#gridFavorites', favList);

    $('#allCount').textContent = countText('#gridAll');
    $('#cloudCount').textContent = countText('#gridCloud');
    $('#quickCount').textContent = countText('#gridQuick');
    $('#retroCount').textContent = countText('#gridRetro');
    $('#favSectionCount').textContent = countText('#gridFavorites');
    $('#favCount').textContent = favs.size;
    $('#statTotal').textContent = catalog.length;
    $('#statCloud').textContent = catalog.filter(g => g.category === 'cloud').length;
    $('#statQuick').textContent = catalog.filter(g => g.category === 'quick').length;
    $('#statRetro').textContent = catalog.filter(g => g.category === 'retro').length;
    $('#favEmpty').style.display = favList.length ? 'none' : '';
  }

  function countText(sel) {
    const n = document.querySelectorAll(sel + ' .game-card').length;
    return `${n} title${n === 1 ? '' : 's'}`;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function renderInto(sel, games) {
    const grid = $(sel);
    grid.innerHTML = games.map(cardHTML).join('')
      || `<div class="empty-state"><div class="empty-art">🕸️</div><p>Nothing here yet${query ? ' — try a different search' : ''}.</p></div>`;
  }

  /* ---------- genre chips ---------- */
  function buildChips() {
    const counts = {};
    catalog.forEach(g => (g.genres || []).forEach(gen => { counts[gen] = (counts[gen] || 0) + 1; }));
    const genres = Object.keys(counts).sort();
    const html = ['<button class="chip active" data-chip="All">All</button>']
      .concat(genres.map(gen => `<button class="chip" data-chip="${gen}">${gen} <span class="chip-n">${counts[gen]}</span></button>`))
      .join('');
    $('#chipRow').innerHTML = html;
  }
  $('#chipRow').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $('#chipRow .chip').forEach(c => c.classList.toggle('active', c === chip));
    activeChip = chip.dataset.chip === 'All' ? 'All' : chip.dataset.chip;
    renderAll();
  });

  /* ---------- navigation ---------- */
  $$('.main-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      $$('.main-nav .nav-link').forEach(l => l.classList.toggle('active', l === link));
      const cat = link.dataset.category;
      const target = cat === 'favorites' ? '#favorites' : '#' + (cat === 'all' ? 'all' : cat);
      document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- search ---------- */
  const searchInput = $('#searchInput');
  searchInput.addEventListener('input', () => {
    query = searchInput.value.trim();
    $('#clearSearch').classList.toggle('show', !!query);
    renderAll();
  });
  $('#clearSearch').addEventListener('click', () => {
    searchInput.value = ''; query = ''; renderAll();
  });

  /* ---------- favorites ---------- */
  function toggleFav(id) {
    const game = catalog.find(g => g.id === id);
    if (!game) return;
    if (favs.has(id)) { favs.delete(id); toast(`Removed “${game.title}” from favorites`); }
    else { favs.add(id); toast(`★ “${game.title}” pinned to favorites`); }
    writeJson(LS_FAV, [...favs]);
    renderAll();
  }
  document.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav]');
    if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); }
    const del = e.target.closest('[data-del]');
    if (del) {
      e.stopPropagation();
      const id = del.dataset.del;
      catalog = catalog.filter(g => g.id !== id);
      writeJson(LS_CUSTOM, catalog.filter(g => g.id.startsWith('custom-')));
      toast('Game removed.');
      renderAll();
    }
    const card = e.target.closest('.game-card');
    if (card && !fav && !del) openPlay(card.dataset.id);
  });

  /* ---------- play modal ---------- */
  const playModal = $('#playModal');
  let currentGame = null;

  function openPlay(id) {
    const game = catalog.find(g => g.id === id);
    if (!game) return;
    currentGame = game;
    const url = resolveUrl(game);
    const embed = resolveEmbed(game);

    $('#modalTitle').textContent = game.title;
    $('#modalMeta').textContent = `${CAP[game.category]} · ${game.genres.join(' · ')}`;
    $('#modalFav').className = `icon-btn${favs.has(game.id) ? ' fav-on' : ''}`;
    syncModalFav(game);

    const frame = $('#embedFrame');
    if (embed) {
      frame.innerHTML = `
        <div class="embed-loading"><span class="spinner"></span> Loading ${game.title}…<br><span style="font-size:.7rem">If the feed is blank, use “open in new tab”.</span></div>
        <iframe src="${embed}" loading="lazy" allowfullscreen allow="autoplay; fullscreen; gamepad; pointer-lock; clipboard-write; encrypted-media; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups allow-modals"></iframe>`;
    } else if (url) {
      frame.innerHTML = `<div class="embed-loading"><span class="spinner"></span> No in-hub embed — use “open in new tab”.</div>`;
    } else {
      frame.innerHTML = `<div class="embed-loading">⚠️ No launch URL yet.<br><span style="font-size:.82rem">Connect one with <b>+ Add Game</b>, or edit <b>js/data.js</b>.<br>${game.dynamic === 'moonlight' ? 'Moonlight needs an IP — set it in <b>Settings</b>.' : ''}</span></div>`;
    }

    $('#modalNote').textContent = game.dynamic === 'moonlight'
      ? 'Tip: set your host IP in Settings to generate a clickable Sunshine link.'
      : 'Some sites block embedding (X-Frame-Options). If the player is blank, use “open in new tab”.';

    playModal.hidden = false;
    const iframe = frame.querySelector('iframe');
    if (iframe) iframe.addEventListener('load', () => {
      const ld = frame.querySelector('.embed-loading');
      if (ld) ld.remove();
    });
    document.body.style.overflow = 'hidden';
  }
  const CAP = { cloud: 'Cloud Stream', quick: 'Quick Play', retro: 'Retro & Ports', favorites: 'Favorites' };

  function syncModalFav(game) {
    const b = $('#modalFav');
    b.classList.toggle('fav-on', favs.has(game.id));
  }

  $('#modalClose').addEventListener('click', closePlay);
  $('#modalLaunch').addEventListener('click', () => {
    if (!currentGame) return;
    const url = resolveUrl(currentGame);
    if (!url) { toast('No launcher URL set for this game.'); return; }
    window.open(url, '_blank', 'noopener');
  });
  $('#modalFull').addEventListener('click', () => {
    const target = $('#embedFrame');
    if (!target) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (target.requestFullscreen) {
      target.requestFullscreen().catch(() => toast('Fullscreen blocked.'));
    }
  });
  $('#modalDownload').addEventListener('click', () => {
    if (!currentGame) return;
    const src = resolveEmbed(currentGame) || resolveUrl(currentGame);
    if (!src) { toast('No page to download for this game.'); return; }
    const slug = (currentGame.title || 'game').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'game';
    toast('Downloading…');
    fetch(src).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(html => {
      const blob = new Blob([html], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${slug}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(`Saved ${slug}.html`);
    }).catch(() => {
      window.open(src, '_blank', 'noopener');
      toast('Could not fetch (site blocks it) — opened page, use Save As.');
    });
  });
  $('#modalFav').addEventListener('click', () => {
    if (currentGame) { toggleFav(currentGame.id); syncModalFav(currentGame); }
  });
  playModal.addEventListener('click', (e) => { if (e.target === playModal) closePlay(); });
  function closePlay() { playModal.hidden = true; $('#embedFrame').innerHTML = ''; currentGame = null; document.body.style.overflow = ''; }

  /* ---------- settings ---------- */
  const settingsModal = $('#settingsModal');
  $('#settingsBtn').addEventListener('click', () => {
    $('#moonIp').value = localStorage.getItem(LS_IP) || '';
    $('#settingsStatus').textContent = '';
    settingsModal.hidden = false;
  });
  $('#saveSettings').addEventListener('click', () => {
    const ip = $('#moonIp').value.trim();
    if (ip && !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      $('#settingsStatus').textContent = '⚠️ Enter a valid IP like 192.168.1.50';
      $('#settingsStatus').style.color = 'var(--neon-pink)';
      return;
    }
    if (ip) localStorage.setItem(LS_IP, ip); else localStorage.removeItem(LS_IP);
    $('#settingsStatus').textContent = ip ? `Saved. Moonlight link → https://${ip}:47990/web/` : 'Cleared.';
    $('#settingsStatus').style.color = 'var(--neon-green)';
    renderAll();
  });

  /* ---------- add game ---------- */
  const addModal = $('#addModal');
  $('#openAddBtn').addEventListener('click', () => {
    ['#addTitle', '#addIcon', '#addGenre', '#addUrl', '#addEmbed', '#addDesc'].forEach(s => $(s).value = '');
    $('#addCat').value = 'quick'; $('#addErrors').textContent = '';
    addModal.hidden = false;
  });
  $('#saveAdd').addEventListener('click', () => {
    const title = $('#addTitle').value.trim();
    const url = $('#addUrl').value.trim();
    const embed = $('#addEmbed').value.trim();
    if (!title || !url) {
      $('#addErrors').textContent = '⚠️ Title and Launcher URL are required.';
      return;
    }
    const game = {
      id: 'custom-' + Date.now(),
      title,
      icon: $('#addIcon').value.trim() || '🎮',
      category: $('#addCat').value,
      genres: [($('#addGenre').value.trim() || 'Custom')],
      url, embed,
      desc: $('#addDesc').value.trim() || 'Added via the hub (custom).',
      grad: pickGrad($('#addCat').value),
      isCustom: true,
    };
    catalog.push(game);
    writeJson(LS_CUSTOM, catalog.filter(g => g.id.startsWith('custom-')));
    addModal.hidden = true;
    renderAll(); buildChips();
    toast(`“${title}” added to the hub.`);
  });
  function pickGrad(cat) { return { cloud: 'ice', quick: 'gold', retro: 'violet' }[cat] || 'cyan'; }

  /* ---------- generic modal open/close ---------- */
  $$('.modal-overlay').forEach(m => {
    m.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => { m.hidden = true; }));
    m.addEventListener('click', (e) => { if (e.target === m) m.hidden = true; });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $$('.modal-overlay').forEach(m => { if (!m.hidden) { m.hidden = true; if (m === playModal) closePlay(); } });
  });

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  /* ---------- hero animation ---------- */
  const heroLines = [
    ['CONNECTING TO CLOUD//CORE', 'handshake with streaming service…'],
    ['LOADING QUICK PLAY SLOT', 'firing up a lightweight web title…'],
    ['BOOTING RETRO EMULATOR', 'attaching cartridge reader…'],
    ['SYNCING FAVORITES', 'pinning your neon shelf…'],
  ];
  let li = 0;
  setInterval(() => {
    li = (li + 1) % heroLines.length;
    $('#heroScreenText').textContent = heroLines[li][0];
    $('#heroScreenSub').textContent = heroLines[li][1];
  }, 3200);

  /* ---------- init ---------- */
  buildChips();
  renderAll();
})();