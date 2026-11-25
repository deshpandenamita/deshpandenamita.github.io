// Home page: journey map, player stats, history teaser, explainers, badges.
(function () {
  const lessons = (window.LESSONS || []).slice().sort((a, b) => a.num - b.num);
  const p = MM.progress();
  const done = lessons.filter((l) => p[l.id]).length;
  const nextL = lessons.find((l) => !p[l.id]);

  document.querySelectorAll('[data-glyph]').forEach((el) => { el.innerHTML = MM.GLYPH[el.dataset.glyph] || ''; });
  const cta = document.getElementById('hero-cta');
  if (nextL && done) { cta.textContent = 'Continue: lesson ' + nextL.num; cta.href = 'learn.html#' + nextL.id; }
  else if (nextL) cta.href = 'learn.html#' + nextL.id;

  // ---- Player stats ----
  setTimeout(MM.celebrate, 600);
  const lv = MM.level();
  const { list } = MM.checkBadges();
  const earned = list.filter((b) => b.earned).length;
  document.getElementById('player').innerHTML = `
    <div class="stat-chip tone-${lv.tone}">${MM.GLYPH.star}<div><b>${lv.name}</b><span>${lv.next ? `${lv.toNext} lesson${lv.toNext === 1 ? '' : 's'} to ${lv.next.name}` : 'Top level reached'}</span></div></div>
    <div class="stat-chip tone-coral">${MM.GLYPH.flame}<div><b>${MM.streak.days} day${MM.streak.days === 1 ? '' : 's'}</b><span>streak</span></div></div>
    <div class="stat-chip tone-sun">${MM.GLYPH.medal}<div><b>${earned} / ${list.length}</b><span>badges</span></div></div>`;

  // ---- Journey map (desktop SVG + mobile list) ----
  const W = 1000, rows = [[100, 300, 500, 700, 900], [900, 700, 500, 300, 100]];
  const pos = lessons.map((l, k) => ({ x: rows[k < 5 ? 0 : 1][k % 5], y: k < 5 ? 70 : 245 }));
  const short = (t) => t.replace('How the stock market works', 'How the market works').replace('Index funds, ETFs, and diversification', 'Index funds & ETFs').replace(/, and why timing the market is hard/, '').replace('Reading a stock page', 'Reading a stock page').replace('What a stock is', 'What is a stock?');
  let svg = `<svg class="map" viewBox="0 0 ${W} 330" role="img" aria-label="Lesson journey map: ${done} of ${lessons.length} complete">
    <path d="M100 70 H900 C 990 70, 990 245, 900 245 H100" fill="none" style="stroke:var(--axis)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>`;
  lessons.forEach((l, k) => {
    const { x, y } = pos[k], look = MM.look(l.id), isDone = !!p[l.id], isNext = nextL && nextL.id === l.id;
    svg += `<a href="learn.html#${l.id}" class="stop tone-${look.tone}" tabindex="0" aria-label="Lesson ${l.num}: ${MM.esc(l.title)}${isDone ? ' (done)' : ''}">
      ${isNext ? `<circle class="pulse" cx="${x}" cy="${y}" r="30" style="fill:var(--tone)"/>` : ''}
      <circle class="ring" cx="${x}" cy="${y}" r="30" style="fill:${isDone ? 'var(--tone)' : 'var(--tone-wash)'};stroke:var(--tone)" stroke-width="3"/>
      <svg x="${x - 15}" y="${y - 15}" width="30" height="30" style="color:${isDone ? 'var(--on-tone, #fff)' : 'var(--tone-ink)'}">${look.icon.replace('<svg ', '<svg width="30" height="30" ')}</svg>
      ${isDone ? `<circle cx="${x + 22}" cy="${y - 22}" r="11" style="fill:var(--good)"/><path d="M${x + 17} ${y - 22} l3.5 3.5 6.5 -7" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
      <text x="${x}" y="${y + 52}" text-anchor="middle" font-size="13" font-weight="800" style="fill:var(--tone-ink);font-family:var(--font-head)">STOP ${l.num}</text>
      <text x="${x}" y="${y + 70}" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--ink)">${MM.esc(short(l.title))}</text>
    </a>`;
  });
  svg += '</svg>';
  const listHTML = `<ol class="journey-list">${lessons.map((l) => { const look = MM.look(l.id); return `<li class="tone-${look.tone}${p[l.id] ? ' is-done' : ''}"><a href="learn.html#${l.id}"><span class="icon-tile">${look.icon}</span><span><small>Stop ${l.num}${p[l.id] ? ' · done' : nextL && nextL.id === l.id ? ' · up next' : ''}</small><strong>${MM.esc(l.title)}</strong></span></a></li>`; }).join('')}</ol>`;
  document.getElementById('journey').innerHTML = svg + listHTML +
    `<div style="display:flex;align-items:center;gap:12px;margin-top:8px"><div class="progress-bar" style="flex:1"><i style="width:${(done / lessons.length) * 100}%"></i></div><strong class="num">${done}/${lessons.length}</strong></div>`;

  // ---- History teaser: real SPY sparkline ----
  (function () {
    const P = window.PRICES; if (!P) return;
    const v = P.close.SPY, d = P.dates, n = v.length;
    const Wd = 560, H = 280, pad = 14, base = H - 30;
    const lo = Math.min(...v), hi = Math.max(...v);
    const X = (i) => pad + (i / (n - 1)) * (Wd - pad * 2), Y = (x) => base - 50 - ((x - lo) / (hi - lo)) * (base - 80);
    const tag = (x, y, text, color, anchor) => {
      const w = text.length * 7.6 + 20, rx = anchor === 'end' ? x - w : x;
      return `<rect x="${rx}" y="${y - 17}" width="${w}" height="26" rx="13" style="fill:var(--surface)"/><text x="${rx + w / 2}" y="${y + 1}" text-anchor="middle" font-size="13" font-weight="800" style="fill:var(${color});font-family:var(--font-head)">${text}</text>`;
    };
    const path = v.map((x, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(x).toFixed(1)).join('');
    const iFeb = d.findIndex((x) => x >= '2020-02-17'), iMar = d.findIndex((x) => x >= '2020-03-16');
    const drop = v[iMar] / v[iFeb] - 1, total = v[n - 1] / v[iMar] - 1;
    const years = [...new Set(d.map((x) => x.slice(0, 4)))].filter((y, k) => k % 2 === 1);
    document.getElementById('spark').innerHTML = `<svg viewBox="0 0 ${Wd} ${H}" role="img" aria-label="SPY weekly price, ${d[0].slice(0, 4)} to today">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient></defs>
      <path d="${path}L${X(n - 1)} ${base}L${X(0)} ${base}Z" fill="url(#sg)"/>
      <path id="spk" d="${path}" fill="none" style="stroke:var(--accent)" stroke-width="3" stroke-linejoin="round"/>
      ${years.map((y) => { const i = d.findIndex((x) => x.startsWith(y)); return `<text x="${X(i)}" y="${H - 6}" text-anchor="middle" font-size="12" style="fill:var(--muted)">${y}</text>`; }).join('')}
      <line x1="${X(iMar)}" x2="${X(iMar)}" y1="${Y(v[iMar]) + 8}" y2="${base - 6}" style="stroke:var(--coral)" stroke-width="2" stroke-dasharray="3 3"/>
      <circle cx="${X(iMar)}" cy="${Y(v[iMar])}" r="7" style="fill:var(--coral);stroke:var(--surface)" stroke-width="3"/>
      ${tag(X(iMar) - 10, base - 8, `Mar 2020: ${MM.pct(drop, 0)} in 4 weeks`, '--coral-ink')}
      <circle cx="${X(n - 1)}" cy="${Y(v[n - 1])}" r="7" style="fill:var(--mint);stroke:var(--surface)" stroke-width="3"/>
      ${tag(X(n - 1), Y(v[n - 1]) + 58, `Today: ${MM.pct(total, 0)} since that low`, '--mint-ink', 'end')}
    </svg>`;
    const pk = document.getElementById('spk'), L = pk.getTotalLength();
    pk.style.strokeDasharray = L; pk.style.strokeDashoffset = L;
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { pk.style.transition = 'stroke-dashoffset 2.2s ease-out'; pk.style.strokeDashoffset = 0; io.disconnect(); } }, { threshold: 0.3 });
    io.observe(pk);
  })();

  // ---- Explainers ----
  const tabs = document.querySelector('.x-tabs'), stage = document.getElementById('x-stage');
  function show(k) {
    const [id, , lessonId] = MM.EXPLAINER_LIST[k];
    tabs.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-pressed', j === k));
    stage.innerHTML = `<div data-explainer="${id}"></div><p class="small"><a href="learn.html#${lessonId}">Read the full lesson</a></p>`;
    MM.mountInteractive(stage);
  }
  tabs.innerHTML = MM.EXPLAINER_LIST.map((x, k) => `<button type="button" aria-pressed="false" data-k="${k}">${x[1]}</button>`).join('');
  tabs.querySelectorAll('button').forEach((b) => (b.onclick = () => show(+b.dataset.k)));
  show(0);

  // ---- Badges ----
  document.getElementById('badges').innerHTML = list.map(MM.badgeHTML).join('');
  document.getElementById('badge-count').textContent = `${earned} of ${list.length} earned`;
})();
