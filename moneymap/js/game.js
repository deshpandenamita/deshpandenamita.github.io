// Lesson look (icons + colors), streaks, levels, and badges.
(function () {
  const s = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  MM.LESSON_LOOK = {
    'budgeting':         { tone: 'coral',  icon: s('<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M16 12h5v4h-5a2 2 0 0 1 0-4z"/><path d="M6 7l9-3.5 1.2 3.5"/>') },
    'emergency-fund':    { tone: 'mint',   icon: s('<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6.5a2 2 0 0 0 4 0"/>') },
    'debt-credit':       { tone: 'purple', icon: s('<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M6 15h4"/>') },
    'compound-interest': { tone: 'sun',    icon: s('<circle cx="12" cy="18.5" r="3"/><path d="M12 15.5V9"/><path d="M12 11C9 11 7 9 7 6c3 0 5 2 5 5z"/><path d="M12 9c0-3 2-5 5-5 0 3-2 5-5 5z"/>') },
    'what-is-a-stock':   { tone: 'sky',    icon: s('<path d="M11 3.1A9 9 0 1 0 20.9 13H11z"/><path d="M14 2.6A9 9 0 0 1 21.4 10H14z"/>') },
    'stock-market':      { tone: 'pink',   icon: s('<path d="M3 9l9-5 9 5"/><path d="M5.5 9v9M10 9v9M14 9v9M18.5 9v9"/><path d="M3 21h18"/>') },
    'index-funds':       { tone: 'mint',   icon: s('<path d="M3.5 10h17l-2.2 10H5.7z"/><path d="M8 10l4-6 4 6"/><path d="M9.5 14v3M14.5 14v3"/>') },
    'risk-reward':       { tone: 'coral',  icon: s('<path d="M12 4v16M8 20h8"/><path d="M4 7h16"/><path d="M4 7l-2.6 6h5.2zM20 7l-2.6 6h5.2z"/>') },
    'reading-a-stock':   { tone: 'purple', icon: s('<circle cx="10" cy="10" r="7"/><path d="M21 21l-6-6"/><path d="M6.5 12l2.2-2.4 2 1.8L13.5 8"/>') },
    'beginner-mistakes': { tone: 'sun',    icon: s('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>') }
  };
  MM.look = (id) => MM.LESSON_LOOK[id] || { tone: 'purple', icon: s('<circle cx="12" cy="12" r="8"/>') };

  MM.GLYPH = {
    flame: s('<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 1.5 2 2.5 2C11 7.5 11 5.5 12 3z"/>'),
    star: s('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
    medal: s('<circle cx="12" cy="15" r="5"/><path d="M8.5 11 6 3h4l2 5 2-5h4l-2.5 8"/><path d="M12 13v4"/>'),
    rocket: s('<path d="M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2"/><path d="M9 15l-3-3c2-6 7-9 15-9 0 8-3 13-9 15z"/><circle cx="15" cy="9" r="1.6"/>'),
    shield: s('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
    trophy: s('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M16 5h3a3 3 0 0 1-3 4M8 5H5a3 3 0 0 0 3 4"/><path d="M12 13v4M8 21h8M9 17h6v4H9z"/>'),
    news: s('<rect x="3" y="4" width="15" height="16" rx="2"/><path d="M18 8h3v10a2 2 0 0 1-2 2"/><path d="M7 8h7M7 12h7M7 16h4"/>'),
    play: s('<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>'),
    book: s('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>'),
    cart: s('<circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11L21 7H7"/>'),
    brain: s('<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>')
  };

  // ---- Streak: days in a row with a visit ----
  const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
  function touchStreak() {
    const st = MM.load('streak', { last: null, days: 0, best: 0 });
    const t = today();
    if (st.last !== t) {
      const y = new Date(t + 'T12:00:00'); y.setDate(y.getDate() - 1);
      st.days = st.last === y.toISOString().slice(0, 10) ? st.days + 1 : 1;
      st.last = t;
      st.best = Math.max(st.best, st.days);
      MM.save('streak', st);
    }
    return st;
  }
  MM.streak = touchStreak();

  // ---- Levels ----
  MM.LEVELS = [
    { name: 'Beginner', min: 0, tone: 'sky' },
    { name: 'Saver', min: 4, tone: 'mint' },
    { name: 'Investor', min: 8, tone: 'purple' }
  ];
  MM.level = function () {
    const done = Object.keys(MM.progress()).length;
    let k = 0;
    MM.LEVELS.forEach((l, i) => { if (done >= l.min) k = i; });
    const next = MM.LEVELS[k + 1];
    return { ...MM.LEVELS[k], index: k, done, next, toNext: next ? next.min - done : 0 };
  };

  // ---- Badges ----
  const sim = () => MM.load('sim', null);
  MM.BADGES = [
    { id: 'first-lesson', name: 'First step', desc: 'Finish your first lesson', glyph: 'book', tone: 'coral', test: (p) => Object.keys(p).length >= 1 },
    { id: 'perfect-quiz', name: 'Sharp mind', desc: 'Get 3 out of 3 on any quiz', glyph: 'brain', tone: 'pink', test: (p) => Object.values(p).some((x) => x.score === 3) },
    { id: 'halfway', name: 'Halfway there', desc: 'Finish 5 lessons', glyph: 'star', tone: 'sun', test: (p) => Object.keys(p).length >= 5 },
    { id: 'all-lessons', name: 'Graduate', desc: 'Finish all 10 lessons', glyph: 'medal', tone: 'purple', test: (p) => Object.keys(p).length >= 10 },
    { id: 'streak-3', name: 'On a roll', desc: 'Visit 3 days in a row', glyph: 'flame', tone: 'coral', test: () => MM.streak.best >= 3 },
    { id: 'first-trade', name: 'First trade', desc: 'Make your first practice trade', glyph: 'cart', tone: 'mint', test: (p, s) => !!(s && s.trades && s.trades.length) },
    { id: 'news-5', name: 'News reader', desc: 'Answer 5 Time Machine news moments', glyph: 'news', tone: 'sky', test: (p, s) => !!(s && s.decisions && s.decisions.length >= 5) },
    { id: 'survived-crash', name: 'Survived a crash', desc: 'Stay invested through a 20%+ market drop', glyph: 'shield', tone: 'purple', test: (p, s) => !!(s && s.survived) },
    { id: 'beat-index', name: 'Beat the index', desc: 'Be ahead of the index fund after 6+ months', glyph: 'trophy', tone: 'sun', test: (p, s) => !!(s && s.beat) },
    { id: 'time-traveler', name: 'Time traveler', desc: 'Play the Time Machine for 2 years', glyph: 'rocket', tone: 'pink', test: (p, s) => !!(s && s.i - s.start >= 104) }
  ];
  // Returns badges with .earned, and records any newly earned ones (for a celebration toast).
  MM.checkBadges = function () {
    const p = MM.progress(), s = sim();
    const got = MM.load('badges', {});
    const fresh = [];
    const list = MM.BADGES.map((b) => {
      const earned = !!got[b.id] || b.test(p, s);
      if (earned && !got[b.id]) { got[b.id] = Date.now(); fresh.push(b); }
      return { ...b, earned };
    });
    if (fresh.length) MM.save('badges', got);
    return { list, fresh };
  };
  // ---- Confetti (tiny canvas burst, skipped for reduced motion) ----
  MM.confetti = function () {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('canvas');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:200';
    document.body.append(c);
    const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const colors = ['#ff6b6b', '#6c5ce7', '#fdcb6e', '#00b894', '#4dabf7', '#f783ac'];
    const bits = Array.from({ length: 140 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.45,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 15 - 5,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, c: colors[(Math.random() * colors.length) | 0]
    }));
    let t = 0;
    (function tick() {
      ctx.clearRect(0, 0, W, H);
      bits.forEach((b) => {
        b.vy += 0.42; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.r * 2))); ctx.restore();
      });
      if (++t < 150) requestAnimationFrame(tick); else c.remove();
    })();
  };

  // ---- Toasts for new badges / level ups ----
  MM.toast = function (html, tone = 'purple') {
    let box = document.querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.append(box); }
    const t = document.createElement('div');
    t.className = 'toast tone-' + tone;
    t.innerHTML = html;
    box.append(t);
    setTimeout(() => t.classList.add('out'), 4200);
    setTimeout(() => t.remove(), 4700);
  };
  MM.celebrate = function () {
    const before = MM.load('lastLevel', 0);
    const { fresh } = MM.checkBadges();
    const lv = MM.level();
    fresh.forEach((b) => MM.toast(`<div class="icon-tile" style="background:var(--tone);color:var(--on-tone, #fff)">${MM.GLYPH[b.glyph]}</div><div><small>Badge earned</small><b>${MM.esc(b.name)}</b></div>`, b.tone));
    if (lv.index > before) { MM.toast(`<div class="icon-tile" style="background:var(--tone);color:var(--on-tone, #fff)">${MM.GLYPH.star}</div><div><small>Level up!</small><b>You're now a ${lv.name}</b></div>`, lv.tone); }
    if (lv.index !== before) MM.save('lastLevel', lv.index);
    if (fresh.length || lv.index > before) MM.confetti();
    return fresh;
  };

  MM.badgeHTML = (b) => `<div class="badge tone-${b.tone}${b.earned ? ' earned' : ''}" title="${MM.esc(b.desc)}">
      <div class="badge-ico">${MM.GLYPH[b.glyph]}</div><b>${MM.esc(b.name)}</b><small>${MM.esc(b.desc)}</small></div>`;
})();
