// Tiny SVG line chart with crosshair + tooltip. Colors come from CSS variables.
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  function niceTicks(min, max, count) {
    const span = max - min || Math.abs(max) || 1;
    const step0 = span / count;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const norm = step0 / mag;
    const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const out = [];
    for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
    return out;
  }

  /**
   * opts: { labels: [iso dates], series: [{name, color:'--series-1', values:[], dash?:bool}],
   *         height, yFormat(v), area?:bool, markers?: [{i, label}] }
   */
  MM.lineChart = function (el, opts) {
    el.classList.add('chart');
    let state = opts;
    function draw() {
      const o = state;
      el.innerHTML = '';
      const W = Math.max(280, el.clientWidth || 600);
      const H = o.height || 300;
      const m = { t: 12, r: 12, b: 28, l: 56 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const n = o.labels.length;
      if (n < 1) return;
      const all = o.series.flatMap((s) => s.values.filter((v) => v != null));
      let lo = Math.min(...all), hi = Math.max(...all);
      if (o.zero) lo = Math.min(0, lo);
      const pad = (hi - lo) * 0.06 || hi * 0.05 || 1;
      const ticks = niceTicks(o.zero ? lo : lo - pad, hi + pad, H < 220 ? 3 : 4);
      const y0 = ticks[0], y1 = ticks[ticks.length - 1];
      const X = (i) => m.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
      const Y = (v) => m.t + ih - ((v - y0) / (y1 - y0)) * ih;
      const fmt = o.yFormat || ((v) => v.toLocaleString());

      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('height', H);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', o.aria || o.series.map((s) => s.name).join(' vs '));
      let g = '';
      ticks.forEach((t) => {
        g += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(t)}" y2="${Y(t)}" style="stroke:var(--grid)" stroke-width="1"/>`;
        g += `<text x="${m.l - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="12" style="fill:var(--muted)" class="num">${fmt(t)}</text>`;
      });
      // x ticks: years or months
      const xt = [];
      const span = n > 1 ? (new Date(o.labels[n - 1]) - new Date(o.labels[0])) / 864e5 : 0;
      let last = '';
      o.labels.forEach((d, i) => {
        const key = span > 500 ? d.slice(0, 4) : d.slice(0, 7);
        if (key !== last) { xt.push([i, key]); last = key; }
      });
      const maxLabels = Math.max(2, Math.floor(iw / 64));
      const every = Math.ceil(xt.length / maxLabels);
      xt.forEach(([i, key], k) => {
        if (k % every) return;
        const lab = span > 500 ? key : new Date(key + '-15').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        g += `<text x="${X(i)}" y="${H - 8}" text-anchor="middle" font-size="12" style="fill:var(--muted)">${lab}</text>`;
      });
      g += `<line x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}" style="stroke:var(--axis)"/>`;
      // markers (news events)
      (o.markers || []).forEach((mk) => {
        if (mk.i < 0 || mk.i >= n) return;
        g += `<line x1="${X(mk.i)}" x2="${X(mk.i)}" y1="${m.t}" y2="${m.t + ih}" style="stroke:var(--axis)" stroke-dasharray="3 3"/>`;
        g += `<circle cx="${X(mk.i)}" cy="${m.t + 4}" r="4" style="fill:var(--surface);stroke:var(--ink-2)" stroke-width="1.5"><title>${MM.esc(mk.label)}</title></circle>`;
      });
      o.series.forEach((s, si) => {
        let dpath = '';
        let started = false;
        s.values.forEach((v, i) => {
          if (v == null) { started = false; return; }
          dpath += (started ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1);
          started = true;
        });
        if (o.area && si === 0 && n > 1) {
          const firstI = s.values.findIndex((v) => v != null);
          g += `<path d="${dpath}L${X(n - 1)} ${m.t + ih}L${X(firstI)} ${m.t + ih}Z" style="fill:var(${s.color});opacity:.10"/>`;
        }
        g += `<path d="${dpath}" fill="none" style="stroke:var(${s.color})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"${s.dash ? ' stroke-dasharray="6 5"' : ''}/>`;
      });
      // end dots
      o.series.forEach((s) => {
        const li = s.values.length - 1;
        if (s.values[li] != null) g += `<circle cx="${X(li)}" cy="${Y(s.values[li])}" r="4" style="fill:var(${s.color});stroke:var(--surface)" stroke-width="2"/>`;
      });
      g += `<g class="hover" style="display:none"><line class="cx" y1="${m.t}" y2="${m.t + ih}" style="stroke:var(--ink-2)" stroke-width="1"/>${o.series.map((s) => `<circle r="4.5" style="fill:var(${s.color});stroke:var(--surface)" stroke-width="2"/>`).join('')}</g>`;
      g += `<rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent" class="hit"/>`;
      svg.innerHTML = g;
      el.append(svg);

      if (o.series.length > 1) {
        const lg = document.createElement('div');
        lg.className = 'legend';
        lg.style.marginTop = '6px';
        lg.innerHTML = o.series.map((s) => `<span><i style="background:var(${s.color})"></i>${MM.esc(s.name)}</span>`).join('');
        el.append(lg);
      }
      const tt = document.createElement('div');
      tt.className = 'tt';
      el.append(tt);

      const hov = svg.querySelector('.hover');
      const cx = hov.querySelector('.cx');
      const dots = hov.querySelectorAll('circle');
      function move(evt) {
        const pt = evt.touches ? evt.touches[0] : evt;
        const r = svg.getBoundingClientRect();
        const sx = ((pt.clientX - r.left) / r.width) * W;
        let i = Math.round(((sx - m.l) / iw) * (n - 1));
        i = Math.max(0, Math.min(n - 1, i));
        hov.style.display = '';
        cx.setAttribute('x1', X(i)); cx.setAttribute('x2', X(i));
        let rows = '';
        o.series.forEach((s, k) => {
          const v = s.values[i];
          if (v == null) { dots[k].style.display = 'none'; return; }
          dots[k].style.display = '';
          dots[k].setAttribute('cx', X(i)); dots[k].setAttribute('cy', Y(v));
          rows += `<div><span class="sw" style="background:var(${s.color})"></span>${MM.esc(s.name)}: <strong class="num">${(o.tipFormat || fmt)(v)}</strong></div>`;
        });
        tt.innerHTML = `<b>${o.tipLabel ? o.tipLabel(i) : MM.date(o.labels[i])}</b>${rows}`;
        tt.style.display = 'block';
        const px = (X(i) / W) * r.width;
        const left = px + 14 + tt.offsetWidth > r.width ? px - 14 - tt.offsetWidth : px + 14;
        tt.style.left = Math.max(0, left) + 'px';
        tt.style.top = '8px';
      }
      const hit = svg.querySelector('.hit');
      hit.addEventListener('mousemove', move);
      hit.addEventListener('touchstart', move, { passive: true });
      hit.addEventListener('touchmove', move, { passive: true });
      hit.addEventListener('mouseleave', () => { hov.style.display = 'none'; tt.style.display = 'none'; });
    }
    draw();
    let rt;
    const ro = new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(draw, 80); });
    ro.observe(el);
    return { update(next) { state = Object.assign({}, state, next); draw(); } };
  };
})();
