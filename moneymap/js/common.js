// Shared helpers: storage, theme, header/footer, glossary tooltips, formatting.
(function () {
  const MM = (window.MM = {});

  // ---- Storage (safe: works even if localStorage is blocked) ----
  const mem = {};
  MM.load = function (key, fallback) {
    try {
      const v = localStorage.getItem('mm.' + key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) { return key in mem ? mem[key] : fallback; }
  };
  MM.save = function (key, value) {
    try { localStorage.setItem('mm.' + key, JSON.stringify(value)); }
    catch (e) { mem[key] = value; }
  };

  // ---- Theme ----
  const root = document.documentElement;
  const saved = MM.load('theme', null);
  if (saved) root.setAttribute('data-theme', saved);
  function isDark() {
    const t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  MM.isDark = isDark;

  // ---- Formatting ----
  MM.money = (n, dp) => {
    const d = dp == null ? (Math.abs(n) >= 1000 ? 0 : 2) : dp;
    return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  MM.pct = (n, dp = 1) => (n > 0 ? '+' : '') + (n * 100).toFixed(dp) + '%';
  MM.date = (iso, opts) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric', year: 'numeric' });
  MM.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---- Icons ----
  const ICON = {
    logo: '<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b6b"/><stop offset="1" stop-color="#6c5ce7"/></linearGradient></defs><rect width="32" height="32" rx="10" fill="url(#lg)"/><path d="M7 22l6-7 4 4 8-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="25" cy="10" r="2.2" fill="#fff"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="flex:none;margin-top:2px"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };
  MM.ICON = ICON;

  // ---- Header & footer ----
  function header() {
    const page = document.body.dataset.page;
    const link = (href, id, label) => `<a href="${href}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`;
    const el = document.createElement('header');
    el.className = 'site-head';
    el.innerHTML = `<div class="wrap">
      <a class="brand" href="index.html">${ICON.logo}<span>MoneyMap</span></a>
      <nav class="nav" aria-label="Main">${link('index.html', 'home', 'Home')}${link('learn.html', 'learn', 'Learn')}${link('videos.html', 'videos', 'Videos')}${link('practice.html', 'practice', 'Practice')}</nav>
      <button class="theme-btn" type="button" aria-label="Toggle dark mode"></button>
    </div>`;
    document.body.prepend(el);
    const btn = el.querySelector('.theme-btn');
    const paint = () => { btn.innerHTML = isDark() ? ICON.sun : ICON.moon; };
    paint();
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      MM.save('theme', next);
      paint();
      document.dispatchEvent(new CustomEvent('mm:theme'));
    });
  }
  function footer() {
    const el = document.createElement('footer');
    el.className = 'site-foot';
    el.innerHTML = `<div class="wrap">
      <div class="disclaimer">${ICON.info}<div><strong>Educational only – not financial advice.</strong> MoneyMap teaches general ideas. Practice trades use fake money. Past prices do not predict future results. Talk to a licensed professional before making real money decisions.</div></div>
      <div>Practice prices: real weekly closing prices (split-adjusted) from Yahoo Finance. News summaries are simplified for learning.</div>
    </div>`;
    document.body.append(el);
  }

  // ---- Glossary tooltips for <span class="term" data-def="..."> ----
  let pop;
  function showTip(t) {
    hideTip();
    pop = document.createElement('div');
    pop.className = 'tip-pop';
    pop.setAttribute('role', 'tooltip');
    pop.textContent = t.dataset.def;
    document.body.append(pop);
    const r = t.getBoundingClientRect();
    const w = pop.offsetWidth;
    let left = r.left + window.scrollX + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, document.documentElement.clientWidth - w - 8));
    let top = r.top + window.scrollY - pop.offsetHeight - 8;
    if (r.top - pop.offsetHeight - 8 < 0) top = r.bottom + window.scrollY + 8;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }
  function hideTip() { if (pop) { pop.remove(); pop = null; } }
  MM.activateTerms = function (scope) {
    scope.querySelectorAll('.term[data-def]').forEach((t) => {
      t.tabIndex = 0;
      t.setAttribute('aria-label', t.textContent + ': ' + t.dataset.def);
      t.addEventListener('mouseenter', () => showTip(t));
      t.addEventListener('mouseleave', hideTip);
      t.addEventListener('focus', () => showTip(t));
      t.addEventListener('blur', hideTip);
      t.addEventListener('click', (e) => { e.stopPropagation(); pop ? hideTip() : showTip(t); });
    });
  };
  document.addEventListener('click', hideTip);
  window.addEventListener('scroll', hideTip, { passive: true });

  // ---- Lesson progress ----
  MM.progress = () => MM.load('progress', {});
  MM.markDone = (id, score) => { const p = MM.progress(); p[id] = { done: true, score, at: Date.now() }; MM.save('progress', p); };

  document.addEventListener('DOMContentLoaded', () => { header(); footer(); });
})();
