// Animated step-by-step explainers + interactive lesson widgets.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Explainer shell: Back / Play / Next, step dots, caption ----------
  function shell(el, { tag, title, steps, viewBox, build }) {
    el.className = 'explainer';
    el.innerHTML = `
      <div class="x-head"><div><div class="tag">${tag}</div><b>${title}</b></div></div>
      <svg class="stage" viewBox="${viewBox}" role="img" aria-label="${MM.esc(title)}"></svg>
      <p class="caption" aria-live="polite"></p>
      <div class="x-controls">
        <button class="btn sm" data-a="back" type="button">Back</button>
        <button class="btn sm primary" data-a="play" type="button">Play</button>
        <button class="btn sm" data-a="next" type="button">Next</button>
        <div class="x-dots">${steps.map(() => '<i></i>').join('')}</div>
      </div>`;
    const svg = el.querySelector('svg');
    const cap = el.querySelector('.caption');
    const dots = el.querySelectorAll('.x-dots i');
    const playBtn = el.querySelector('[data-a="play"]');
    const update = build(svg);
    let i = 0, timer = null;
    function go(k) {
      i = Math.max(0, Math.min(steps.length - 1, k));
      cap.innerHTML = `<strong>Step ${i + 1} of ${steps.length}.</strong> ${steps[i]}`;
      dots.forEach((d, j) => d.classList.toggle('on', j === i));
      update(i);
    }
    function stop() { clearInterval(timer); timer = null; playBtn.textContent = 'Play'; }
    function play() {
      if (i === steps.length - 1) go(0);
      playBtn.textContent = 'Pause';
      timer = setInterval(() => { if (i >= steps.length - 1) stop(); else go(i + 1); }, 3800);
    }
    el.querySelector('[data-a="back"]').onclick = () => { stop(); go(i - 1); };
    el.querySelector('[data-a="next"]').onclick = () => { stop(); go(i + 1); };
    playBtn.onclick = () => (timer ? stop() : play());
    go(0);
  }
  const T = reduce ? '' : 'transition: transform .8s cubic-bezier(.3,.7,.2,1), opacity .6s;';

  // ---------- 1. Compound interest ----------
  function compound(el) {
    const years = 30, rate = 0.08, P = 1000;
    const vals = Array.from({ length: years + 1 }, (_, y) => P * Math.pow(1 + rate, y));
    const max = vals[years];
    const shownAt = [1, 2, 11, 21, 31, 31];
    shell(el, {
      tag: 'Animated explainer', title: 'How $1,000 grows at 8% a year', viewBox: '0 0 640 300',
      steps: [
        'You invest <strong>$1,000</strong> one time. Blue is the money you put in.',
        'After year 1 it earns 8%, which is <strong>$80</strong>. Now you have $1,080. Orange is growth.',
        'After 10 years: about <strong>$2,159</strong>. Each year you earn 8% on a bigger pile, including past growth.',
        'After 20 years: about <strong>$4,661</strong>. The orange part is now bigger than what you put in.',
        'After 30 years: about <strong>$10,063</strong>. That is ten times your money, without adding a cent.',
        'The dashed line is <em>simple</em> interest (8% of the original $1,000 only): just $3,400. The gap is the power of compounding. Time is the secret ingredient.'
      ],
      build(svg) {
        const base = 260, top = 30, h = base - top, x0 = 40, bw = 16, gap = 2;
        let s = `<line x1="${x0 - 4}" x2="${x0 + (years + 1) * (bw + gap)}" y1="${base}" y2="${base}" style="stroke:var(--axis)"/>`;
        vals.forEach((v, y) => {
          const x = x0 + y * (bw + gap);
          const hp = (P / max) * h, hg = ((v - P) / max) * h;
          s += `<g class="yr" data-y="${y}" style="transform-box:fill-box;transform-origin:bottom;${T}transform:scaleY(0);opacity:0">
            <rect x="${x}" y="${base - hp}" width="${bw}" height="${hp}" rx="3" style="fill:var(--series-1)"/>
            ${hg > 0.5 ? `<rect x="${x}" y="${base - hp - hg - (hg > 2 ? 2 : 0)}" width="${bw}" height="${Math.max(0, hg - (hg > 2 ? 0 : 0))}" rx="3" style="fill:var(--series-2)"/>` : ''}
          </g>`;
          if (y % 5 === 0) s += `<text x="${x + bw / 2}" y="${base + 18}" text-anchor="middle" font-size="12" style="fill:var(--muted)">Yr ${y}</text>`;
        });
        const simpleY = base - ((P + P * rate * years) / max) * h;
        const sx0 = x0, sy0 = base - (P / max) * h, sx1 = x0 + years * (bw + gap) + bw;
        s += `<g class="simple" style="${T}opacity:0"><line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${simpleY}" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="6 5"/>
          <text x="${sx1 - 4}" y="${simpleY - 8}" text-anchor="end" font-size="13" font-weight="700" style="fill:var(--ink);stroke:var(--surface);stroke-width:5px;paint-order:stroke;stroke-linejoin:round">Simple interest: $3,400</text></g>`;
        s += `<text class="val" x="0" y="0" text-anchor="middle" font-size="15" font-weight="700" style="fill:var(--ink)"></text>`;
        s += `<g transform="translate(${x0},14)"><rect width="12" height="12" rx="3" style="fill:var(--series-1)"/><text x="18" y="11" font-size="13" style="fill:var(--ink-2)">Money you put in</text>
          <rect x="150" width="12" height="12" rx="3" style="fill:var(--series-2)"/><text x="168" y="11" font-size="13" style="fill:var(--ink-2)">Growth (interest on interest)</text></g>`;
        svg.innerHTML = s;
        const bars = svg.querySelectorAll('.yr');
        const val = svg.querySelector('.val');
        return (step) => {
          const n = shownAt[step];
          bars.forEach((b, y) => {
            const on = y < n;
            b.style.transform = on ? 'scaleY(1)' : 'scaleY(0)';
            b.style.opacity = on ? 1 : 0;
          });
          const yv = n - 1;
          const x = x0 + yv * (bw + gap) + bw / 2;
          val.setAttribute('x', Math.min(x, 600));
          val.setAttribute('y', base - (vals[yv] / max) * h - 10);
          val.textContent = MM.money(vals[yv], 0);
          svg.querySelector('.simple').style.opacity = step === 5 ? 1 : 0;
        };
      }
    });
  }

  // ---------- 2. Supply & demand moves the price ----------
  function supply(el) {
    const states = [
      { b: 5, s: 5, p: 50 }, { b: 9, s: 5, p: 54 }, { b: 9, s: 8, p: 58 },
      { b: 3, s: 10, p: 51 }, { b: 6, s: 6, p: 46 }
    ];
    shell(el, {
      tag: 'Animated explainer', title: 'Why stock prices move: buyers vs sellers', viewBox: '0 0 640 300',
      steps: [
        'A stock price is simply the <strong>last price</strong> a buyer and a seller agreed on. Right now, buyers and sellers are balanced at <strong>$50</strong>.',
        'Good news: the company sold more than expected. Suddenly <strong>more people want to buy</strong>. Buyers compete, so they offer more. Price climbs to $54.',
        'Higher prices tempt some owners to sell. The price keeps rising until enough sellers say "yes". It settles around <strong>$58</strong>.',
        'Bad news: a product problem. Now <strong>many owners want to sell</strong> and few want to buy. Sellers must accept lower prices. It drops fast.',
        'At $46, some buyers think it is a bargain. Buyers and sellers balance again. Nobody "sets" the price; it is a tug-of-war that never stops.'
      ],
      build(svg) {
        let s = '';
        const grid = (cx, color, cls) => {
          let out = '';
          for (let k = 0; k < 10; k++) {
            const x = cx + (k % 5) * 26, y = 70 + Math.floor(k / 5) * 34;
            out += `<g class="${cls}" style="${T}transform-box:fill-box;transform-origin:center"><circle cx="${x}" cy="${y}" r="9" style="fill:var(${color})"/><rect x="${x - 9}" y="${y + 11}" width="18" height="10" rx="5" style="fill:var(${color})"/></g>`;
          }
          return out;
        };
        s += `<text x="80" y="40" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--ink)">Want to buy</text>`;
        s += `<text x="560" y="40" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--ink)">Want to sell</text>`;
        s += grid(28, '--series-1', 'buyer') + grid(508, '--series-2', 'seller');
        s += `<rect x="230" y="50" width="180" height="96" rx="14" style="fill:var(--surface-2)"/>
          <text x="320" y="78" text-anchor="middle" font-size="13" style="fill:var(--ink-2)">Price</text>
          <text class="price num" x="320" y="122" text-anchor="middle" font-size="38" font-weight="700" style="fill:var(--ink)">$50</text>
          <text class="arrow" x="320" y="140" text-anchor="middle" font-size="13" style="fill:var(--ink-2)"></text>`;
        s += `<line x1="60" x2="580" y1="270" y2="270" style="stroke:var(--axis)"/>
          <text x="60" y="290" font-size="12" style="fill:var(--muted)">Price over time</text>
          <polyline class="hist" fill="none" style="stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>
          <circle class="histdot" r="4.5" style="fill:var(--ink)"/>`;
        svg.innerHTML = s;
        const buyers = svg.querySelectorAll('.buyer'), sellers = svg.querySelectorAll('.seller');
        const price = svg.querySelector('.price'), arrow = svg.querySelector('.arrow');
        const hist = svg.querySelector('.hist'), dot = svg.querySelector('.histdot');
        const py = (p) => 262 - (p - 42) * 5.2;
        return (step) => {
          const st = states[step];
          buyers.forEach((g, k) => { g.style.opacity = k < st.b ? 1 : 0.12; g.style.transform = k < st.b ? 'scale(1)' : 'scale(.7)'; });
          sellers.forEach((g, k) => { g.style.opacity = k < st.s ? 1 : 0.12; g.style.transform = k < st.s ? 'scale(1)' : 'scale(.7)'; });
          price.textContent = '$' + st.p;
          const prev = step ? states[step - 1].p : st.p;
          arrow.textContent = st.p > prev ? '▲ up $' + (st.p - prev) : st.p < prev ? '▼ down $' + (prev - st.p) : 'balanced';
          const pts = states.slice(0, step + 1).map((q, k) => `${80 + k * 120},${py(q.p)}`).join(' ');
          hist.setAttribute('points', pts);
          dot.setAttribute('cx', 80 + step * 120); dot.setAttribute('cy', py(st.p));
        };
      }
    });
  }

  // ---------- 3. Diversification ----------
  function diversify(el) {
    const R = [35, -40, 12, 8, 22, -15, 5, 18, -8, 30, 10, -5, 14, 13, 25, -20, 19, 15, -12, 34];
    shell(el, {
      tag: 'Animated explainer', title: 'Diversification: one basket vs many', viewBox: '0 0 640 300',
      steps: [
        'Here are <strong>20 companies</strong>. Nobody knows in advance which ones will do well this year.',
        'One year later, results are all over the place. Some went up 35%. One fell 40%.',
        'Put all $1,000 into <strong>one</strong> company and your result is luck: you might end with <strong>$1,350</strong>, or just <strong>$600</strong>.',
        'Spread it out: $50 into each of the 20. The wins and losses mostly cancel. You get the <strong>average: +8%</strong>, so $1,080.',
        'Diversifying does not stop the whole market from falling sometimes. But it removes the risk that <strong>one bad company</strong> sinks you.'
      ],
      build(svg) {
        let s = '';
        R.forEach((r, k) => {
          const x = 20 + (k % 5) * 76, y = 30 + Math.floor(k / 5) * 62;
          s += `<g class="tile" data-k="${k}" style="${T}transform-box:fill-box;transform-origin:center">
            <rect class="bg" x="${x}" y="${y}" width="68" height="54" rx="10" style="fill:var(--surface-2);stroke:var(--border)" stroke-width="2"/>
            <text x="${x + 34}" y="${y + 21}" text-anchor="middle" font-size="12" style="fill:var(--ink-2)">Co. ${k + 1}</text>
            <text class="r num" x="${x + 34}" y="${y + 42}" text-anchor="middle" font-size="16" font-weight="700" style="fill:var(--ink);opacity:0">${r > 0 ? '+' : ''}${r}%</text>
          </g>`;
        });
        s += `<g class="side" transform="translate(420,40)">
          <text class="h1" x="0" y="0" font-size="14" font-weight="700" style="fill:var(--ink)"></text>
          <text class="l1" x="0" y="34" font-size="14" style="fill:var(--ink-2)"></text>
          <text class="v1 num" x="0" y="64" font-size="26" font-weight="700" style="fill:var(--ink)"></text>
          <text class="l2" x="0" y="110" font-size="14" style="fill:var(--ink-2)"></text>
          <text class="v2 num" x="0" y="140" font-size="26" font-weight="700" style="fill:var(--ink)"></text>
          <text class="l3" x="0" y="190" font-size="14" style="fill:var(--ink-2)"></text>
          <text class="l4" x="0" y="210" font-size="14" style="fill:var(--ink-2)"></text>
        </g>`;
        svg.innerHTML = s;
        const tiles = svg.querySelectorAll('.tile');
        const q = (c) => svg.querySelector('.' + c);
        const set = (o) => ['h1', 'l1', 'v1', 'l2', 'v2', 'l3', 'l4'].forEach((c) => { q(c).textContent = o[c] || ''; });
        return (step) => {
          tiles.forEach((t, k) => {
            const r = R[k];
            const bg = t.querySelector('.bg'), rt = t.querySelector('.r');
            rt.style.opacity = step >= 1 ? 1 : 0;
            rt.style.fill = step >= 1 ? (r >= 0 ? 'var(--good)' : 'var(--bad)') : 'var(--ink)';
            bg.style.fill = step >= 1 ? (r >= 0 ? 'var(--good-wash)' : 'var(--bad-wash)') : 'var(--surface-2)';
            const pick = step === 2 && (k === 0 || k === 1);
            bg.style.stroke = pick ? 'var(--ink)' : step === 3 ? 'var(--accent)' : 'var(--border)';
            t.style.opacity = step === 2 && !pick ? 0.35 : 1;
            t.style.transform = pick ? 'scale(1.08)' : 'scale(1)';
          });
          if (step === 0) set({ h1: 'You have $1,000', l1: 'Which company will win?', v1: '???' });
          if (step === 1) set({ h1: 'After one year', l1: 'Best company', v1: '+35%', l2: 'Worst company', v2: '-40%' });
          if (step === 2) set({ h1: 'All in ONE company', l1: 'Lucky pick (Co. 1)', v1: '$1,350', l2: 'Unlucky pick (Co. 2)', v2: '$600', l3: 'Same choice,', l4: 'a $750 difference!' });
          if (step === 3) set({ h1: '$50 in EACH of 20', l1: 'Average of all 20', v1: '+8%', l2: 'You end with', v2: '$1,080', l3: 'No single company', l4: 'decides your fate.' });
          if (step === 4) set({ h1: 'The takeaway', l1: 'Concentrated: wide range', v1: '$600–$1,350', l2: 'Diversified: steadier', v2: '≈ $1,080', l3: 'Lower risk, similar', l4: 'average reward.' });
        };
      }
    });
  }

  // ---------- 4. How an index fund works ----------
  function indexFund(el) {
    shell(el, {
      tag: 'Animated explainer', title: 'How an index fund works', viewBox: '0 0 640 300',
      steps: [
        'The stock market has thousands of companies. An <strong>index</strong> is just a list of some of them. The S&amp;P 500 lists about 500 large US companies (the highlighted dots).',
        'An <strong>index fund</strong> buys every company on the list, automatically. No one has to guess winners.',
        'Bigger companies get a bigger slice. This is called being weighted by <strong>market cap</strong> (company size).',
        'You buy <strong>one share of the fund</strong>, and you own a tiny piece of every company inside it, all at once.',
        'Because a computer just follows the list, costs are tiny. On $10,000, a 0.05% fee is about <strong>$5 a year</strong>. A 0.75% fee on a typical actively managed fund would be about <strong>$75</strong>.'
      ],
      build(svg) {
        // 42 company dots; 21 are "on the list"
        const dots = [];
        let seed = 7;
        const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
        for (let k = 0; k < 42; k++) dots.push({ x: 30 + rnd() * 230, y: 50 + rnd() * 200, on: k % 2 === 0, w: k < 6 ? 2.2 - k * 0.2 : 1 });
        let s = `<rect x="14" y="30" width="262" height="236" rx="14" style="fill:none;stroke:var(--axis)" stroke-dasharray="5 5"/>
          <text x="145" y="22" text-anchor="middle" font-size="13" style="fill:var(--ink-2)">The whole stock market</text>
          <rect class="fund" x="370" y="40" width="250" height="160" rx="18" style="fill:var(--accent-wash);stroke:var(--accent);${T}opacity:0" stroke-width="2"/>
          <text class="fundlbl" x="495" y="30" text-anchor="middle" font-size="14" font-weight="700" style="fill:var(--accent-ink);${T}opacity:0">S&amp;P 500 index fund</text>`;
        let inFund = 0;
        dots.forEach((d) => {
          if (d.on) { d.fx = 400 + (inFund % 7) * 32; d.fy = 70 + Math.floor(inFund / 7) * 46; inFund++; }
          s += `<circle class="co${d.on ? ' on' : ''}" cx="0" cy="0" r="8" style="${T}transform:translate(${d.x}px,${d.y}px)"/>`;
        });
        s += `<g class="share" style="${T}opacity:0">
            <rect x="420" y="222" width="150" height="40" rx="20" style="fill:var(--accent)"/>
            <text x="495" y="247" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">You: 1 share</text>
            <path d="M495 220 V205" style="stroke:var(--accent)" stroke-width="2" marker-end="url(#arr)"/>
          </g>
          <defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>
          <g class="fees" style="${T}opacity:0">
            <rect x="300" y="210" width="330" height="80" rx="12" style="fill:var(--surface)"/>
            <text x="314" y="234" font-size="13" style="fill:var(--ink-2)">Yearly fee on $10,000</text>
            <rect x="314" y="244" width="9" height="16" rx="3" style="fill:var(--series-1)"/><text x="330" y="257" font-size="13" style="fill:var(--ink)">Index fund (0.05%): $5</text>
            <rect x="314" y="266" width="135" height="16" rx="3" style="fill:var(--series-2)"/><text x="456" y="279" font-size="13" style="fill:var(--ink)">Active fund (0.75%): $75</text>
          </g>`;
        svg.innerHTML = s;
        const circles = svg.querySelectorAll('.co');
        return (step) => {
          circles.forEach((c, k) => {
            const d = dots[k];
            const inside = d.on && step >= 1;
            const r = step >= 2 && d.on ? 8 * d.w : 8;
            c.setAttribute('r', r);
            c.style.transform = inside ? `translate(${d.fx}px,${d.fy}px)` : `translate(${d.x}px,${d.y}px)`;
            c.style.fill = d.on ? 'var(--accent)' : 'var(--axis)';
            c.style.opacity = d.on ? 1 : step >= 1 ? 0.35 : 0.8;
          });
          svg.querySelector('.fund').style.opacity = step >= 1 ? 1 : 0;
          svg.querySelector('.fundlbl').style.opacity = step >= 1 ? 1 : 0;
          svg.querySelector('.share').style.opacity = step === 3 ? 1 : 0;
          svg.querySelector('.fees').style.opacity = step === 4 ? 1 : 0;
        };
      }
    });
  }

  // ---------- Widgets ----------
  function budget(el) {
    el.className = 'widget';
    el.innerHTML = `<b>Try it: your 50/30/20 split</b>
      <div class="row" style="margin-top:10px"><label class="field">Monthly take-home pay (after tax)<input type="number" min="0" step="50" value="3000" inputmode="decimal"></label></div>
      <div class="stackbar" aria-hidden="true">
        <div style="flex:50;background:var(--series-1)">50%</div><div style="flex:30;background:var(--series-2)">30%</div><div style="flex:20;background:var(--series-3)">20%</div>
      </div>
      <div class="row out"></div>`;
    const inp = el.querySelector('input'), out = el.querySelector('.out');
    const draw = () => {
      const pay = Math.max(0, +inp.value || 0);
      const card = (c, t, v, ex) => `<div><div class="legend"><span><i style="background:var(${c})"></i>${t}</span></div><div class="bigstat">${MM.money(v, 0)}</div><div class="small muted">${ex}</div></div>`;
      out.innerHTML = card('--series-1', 'Needs (50%)', pay * 0.5, 'Rent, groceries, utilities, transport, minimum debt payments') +
        card('--series-2', 'Wants (30%)', pay * 0.3, 'Eating out, streaming, hobbies, travel') +
        card('--series-3', 'Savings & debt payoff (20%)', pay * 0.2, 'Emergency fund, retirement, extra debt payments');
    };
    inp.addEventListener('input', draw);
    draw();
  }

  function compoundCalc(el) {
    el.className = 'widget';
    el.innerHTML = `<b>Compound interest calculator</b>
      <div class="row" style="margin-top:10px">
        <label class="field">Starting amount<input type="number" data-k="start" value="1000" min="0" step="100" inputmode="decimal"></label>
        <label class="field">Added each month<input type="number" data-k="monthly" value="100" min="0" step="10" inputmode="decimal"></label>
        <label class="field">Yearly return: <span data-o="rate">7%</span><input type="range" data-k="rate" min="0" max="12" step="0.5" value="7"></label>
        <label class="field">Years: <span data-o="years">30</span><input type="range" data-k="years" min="1" max="50" step="1" value="30"></label>
      </div>
      <div class="row" style="margin:16px 0 8px">
        <div><div class="small muted">Final value</div><div class="bigstat" data-o="final"></div></div>
        <div><div class="small muted">Money you put in</div><div class="bigstat" data-o="put"></div></div>
        <div><div class="small muted">Growth from compounding</div><div class="bigstat up" data-o="growth"></div></div>
      </div>
      <div class="cc-chart"></div>
      <p class="small muted">Assumes the same return every year, compounded monthly. Real investments go up and down, and nothing is guaranteed.</p>`;
    const get = (k) => +el.querySelector(`[data-k="${k}"]`).value || 0;
    const out = (k, v) => { el.querySelector(`[data-o="${k}"]`).textContent = v; };
    let chart;
    function calc() {
      const start = get('start'), monthly = get('monthly'), rate = get('rate') / 100, years = Math.round(get('years'));
      out('rate', get('rate') + '%'); out('years', years);
      const r = rate / 12;
      let bal = start, put = start;
      const labels = [], total = [], contrib = [];
      const y0 = new Date().getFullYear();
      for (let m = 0; m <= years * 12; m++) {
        if (m > 0) { bal = bal * (1 + r) + monthly; put += monthly; }
        if (m % 12 === 0) { labels.push(`${y0 + m / 12}-01-01`); total.push(bal); contrib.push(put); }
      }
      out('final', MM.money(bal, 0)); out('put', MM.money(put, 0)); out('growth', MM.money(bal - put, 0));
      const opts = {
        labels, height: 240, zero: true, yFormat: (v) => '$' + (v >= 1000 ? Math.round(v / 1000) + 'k' : v),
        tipFormat: (v) => MM.money(v, 0), tipLabel: (i) => 'Year ' + i,
        series: [{ name: 'Total value', color: '--series-1', values: total }, { name: 'Money you put in', color: '--series-2', values: contrib, dash: true }]
      };
      chart ? chart.update(opts) : (chart = MM.lineChart(el.querySelector('.cc-chart'), opts));
    }
    el.querySelectorAll('input').forEach((i) => i.addEventListener('input', calc));
    calc();
  }

  function stockCard(el) {
    el.className = 'widget';
    const items = [
      ['Market cap', '$9.64B', '<strong>Market cap</strong> = share price × number of shares. Sunny has 200 million shares × $48.20 = about $9.64 billion. It tells you how big the company is, not whether it is cheap.'],
      ['P/E ratio', '20.1', '<strong>P/E (price-to-earnings)</strong> = price ÷ yearly profit per share. Sunny earned $2.40 per share. $48.20 ÷ $2.40 ≈ 20. Investors pay about $20 for every $1 of yearly profit. Higher P/E often means people expect fast growth.'],
      ['Dividend (yield)', '$1.20 (2.49%)', '<strong>Dividend</strong> = cash the company pays shareholders, here $1.20 per share per year. <strong>Yield</strong> = $1.20 ÷ $48.20 ≈ 2.49%. Many fast-growing companies pay no dividend at all.'],
      ['52-week range', '$36.10 – $52.75', '<strong>52-week range</strong> = the lowest and highest price in the past year. At $48.20, Sunny is closer to its high than its low.'],
      ['Volume', '3.1M', '<strong>Volume</strong> = how many shares changed hands today. Higher volume usually means it is easy to buy or sell quickly.'],
      ['Day change', '+$0.85 (+1.80%)', '<strong>Day change</strong> = how much the price moved since yesterday\'s close. One day tells you very little about a company.']
    ];
    el.innerHTML = `<b>Tap each number to learn what it means</b>
      <div class="quote" style="margin-top:10px">
        <div class="top"><div><strong>Sunny Lemonade Co.</strong> <span class="pill">LEMN</span><div class="small muted">Fictional company for learning</div></div>
        <div><span class="price num">$48.20</span> <span class="up num" style="font-weight:700">▲ +0.85 (+1.80%)</span></div></div>
        <dl>${items.map((it, k) => `<div tabindex="0" role="button" data-k="${k}"><dt>${it[0]}</dt><dd>${it[1]}</dd></div>`).join('')}</dl>
        <div class="quote-explain" aria-live="polite">Pick any box above.</div>
      </div>`;
    const boxes = el.querySelectorAll('dl div'), ex = el.querySelector('.quote-explain');
    const pick = (k) => { boxes.forEach((b, j) => b.classList.toggle('on', j === k)); ex.innerHTML = items[k][2]; };
    boxes.forEach((b, k) => { b.onclick = () => pick(k); b.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(k); } }; });
  }

  const EXPLAINERS = { compound, supply, diversify, index: indexFund };
  const WIDGETS = { 'budget-503020': budget, 'compound-calc': compoundCalc, 'stock-card': stockCard };
  MM.mountInteractive = function (scope) {
    scope.querySelectorAll('[data-explainer]').forEach((el) => { const f = EXPLAINERS[el.dataset.explainer]; if (f) f(el); });
    scope.querySelectorAll('[data-widget]').forEach((el) => { const f = WIDGETS[el.dataset.widget]; if (f) f(el); });
  };
  MM.EXPLAINER_LIST = [
    ['compound', 'How $1,000 grows at 8% a year', 'compound-interest'],
    ['supply', 'Why stock prices move', 'stock-market'],
    ['diversify', 'One basket vs many', 'index-funds'],
    ['index', 'How an index fund works', 'index-funds']
  ];
})();
