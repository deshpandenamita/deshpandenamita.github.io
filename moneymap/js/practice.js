// Time Machine paper-trading dashboard.
(function () {
  const app = document.getElementById('app');
  const D = window.PRICES.dates;
  const C = window.PRICES.close;
  const EVENTS = window.NEWS_EVENTS || [];
  const START_CASH = 10000;

  const CO = {
    SPY: ['S&P 500 index fund', 'One fund that holds about 500 large US companies.'],
    AAPL: ['Apple', 'iPhones, Macs, and services like the App Store.'],
    MSFT: ['Microsoft', 'Windows, Office, and the Azure cloud.'],
    AMZN: ['Amazon', 'Online shopping and AWS cloud computing.'],
    TSLA: ['Tesla', 'Electric cars and batteries.'],
    NKE: ['Nike', 'Sneakers and sportswear.'],
    KO: ['Coca-Cola', 'Soft drinks sold in 200+ countries.'],
    DIS: ['Disney', 'Movies, theme parks, and Disney+.'],
    NFLX: ['Netflix', 'Streaming TV and movies.'],
    NVDA: ['Nvidia', 'Computer chips for gaming and AI.'],
    WMT: ['Walmart', 'Big-box stores and groceries.']
  };
  const TICKERS = Object.keys(CO);
  const STARTS = [['2020-01-06', 'January 2020 (just before COVID)'], ['2021-01-04', 'January 2021'], ['2022-01-03', 'January 2022 (before the bear market)'], ['2023-01-02', 'January 2023 (AI boom begins)'], ['2024-01-01', 'January 2024']];
  const idxOf = (iso) => { const k = D.findIndex((d) => d >= iso); return k < 0 ? D.length - 1 : k; };
  const weekEnd = (i) => { const d = new Date(D[i] + 'T12:00:00'); d.setDate(d.getDate() + 4); return d.toISOString().slice(0, 10); };
  const eventWeek = (ev) => { for (let i = D.length - 1; i >= 0; i--) if (D[i] <= ev.date) return i; return 0; };
  const price = (t, i) => C[t][i];

  let S = MM.load('sim', null);
  let ui = { ticker: 'SPY', side: 'buy' };

  function save() { MM.save('sim', S); }
  function value(i = S.i) { return S.cash + TICKERS.reduce((s, t) => s + (S.hold[t] || 0) * price(t, i), 0); }
  function benchShares() { return START_CASH / price('SPY', S.start); }
  function bench(i = S.i) { return benchShares() * price('SPY', i); }

  // ---------- Setup ----------
  function setup() {
    const steps = [
      ['coral', 'cart', 'Buy real companies', 'Apple, Nike, Nvidia, and more, at their real past prices. You can buy part of a share.'],
      ['purple', 'rocket', 'Jump forward', 'Press +1 week or +1 month. You only see prices up to "today" in the game. No peeking!'],
      ['sun', 'news', 'Face real news', 'When real news broke, the game pauses: Buy, Hold, or Sell? Then see what happened next.'],
      ['mint', 'trophy', 'Beat the index?', 'Compare yourself to simply buying the S&P 500 index fund and waiting.']
    ];
    app.innerHTML = `<section class="page-hero">
        <div class="hero-bg" aria-hidden="true"></div>
        <span class="eyebrow">Real history · Fake money · Zero risk</span>
        <h1>The Time Machine</h1>
        <p class="lead">Travel back in time with <strong>$10,000 of pretend money</strong>. Make your moves, then fast-forward and see what really happened.</p>
      </section>
      <section style="margin-top:28px">
        <div class="grid grid-4">${steps.map(([t, g, h, p], k) => `<div class="card tone-${t} step-card"><div class="icon-tile">${MM.GLYPH[g]}</div><small>Step ${k + 1}</small><h3>${h}</h3><p class="muted">${p}</p></div>`).join('')}</div>
      </section>
      <section>
        <h2>Pick your starting point</h2>
        <div class="start-grid" role="radiogroup" aria-label="Start date">${STARTS.map(([d, l], k) => `<button type="button" class="start-opt lift tone-${['coral', 'purple', 'sun', 'mint', 'sky'][k]}" role="radio" aria-checked="${k === 0}" data-d="${d}"><b>${d.slice(0, 4)}</b><span>${l.replace(/^January \d{4}\s*/, '').replace(/[()]/g, '') || 'A fresh start'}</span></button>`).join('')}</div>
        <button class="btn primary lg" id="go" style="margin-top:20px">Start with $10,000 →</button>
      </section>`;
    let pick = STARTS[0][0];
    app.querySelectorAll('.start-opt').forEach((b) => (b.onclick = () => {
      pick = b.dataset.d;
      app.querySelectorAll('.start-opt').forEach((x) => x.setAttribute('aria-checked', x === b));
    }));
    app.querySelector('#go').onclick = () => {
      const i = idxOf(pick);
      S = { start: i, i, cash: START_CASH, hold: {}, cost: {}, hist: [[i, START_CASH]], trades: [], seen: [], decisions: [] };
      EVENTS.forEach((ev, k) => { if (eventWeek(ev) < i) S.seen.push(k); });
      save();
      render();
    };
  }

  // ---------- Trading ----------
  function trade(side, t, dollars) {
    const p = price(t, S.i);
    let shares;
    if (side === 'buy') {
      dollars = Math.min(dollars, S.cash);
      if (dollars < 1) return 'Not enough cash.';
      shares = dollars / p;
      S.cash -= dollars;
      S.hold[t] = (S.hold[t] || 0) + shares;
      S.cost[t] = (S.cost[t] || 0) + dollars;
    } else {
      const have = S.hold[t] || 0;
      if (have <= 0) return `You don't own any ${t}.`;
      shares = Math.min(have, dollars / p);
      if (have - shares < 1e-6) shares = have;
      const frac = shares / have;
      S.cost[t] = (S.cost[t] || 0) * (1 - frac);
      S.hold[t] = have - shares;
      if (S.hold[t] < 1e-6) { delete S.hold[t]; delete S.cost[t]; }
      dollars = shares * p;
      S.cash += dollars;
    }
    S.trades.unshift({ i: S.i, side, t, shares, price: p, dollars });
    save();
    return `${side === 'buy' ? 'Bought' : 'Sold'} ${shares.toFixed(4)} shares of ${t} at ${MM.money(p, 2)} (${MM.money(dollars, 2)}).`;
  }

  // ---------- Time travel ----------
  function advance(weeks) {
    if (document.querySelector('.modal-bg')) return;
    for (let w = 0; w < weeks; w++) {
      if (S.i >= D.length - 1) break;
      S.i++;
      S.hist.push([S.i, value()]);
      milestones();
      const k = EVENTS.findIndex((ev, k2) => !S.seen.includes(k2) && eventWeek(ev) === S.i);
      if (k >= 0) { S.seen.push(k); save(); render(); showEvent(k); return; }
    }
    save();
    render();
    MM.celebrate();
  }

  // Badge milestones: stayed invested through a 20%+ market drop; ahead of the index after 6 months.
  function milestones() {
    const invested = value() - S.cash > 1;
    const from = Math.max(0, S.i - 52);
    const peak = Math.max(...C.SPY.slice(from, S.i + 1));
    if (invested && price('SPY', S.i) <= peak * 0.8 && S.crashAt == null) S.crashAt = S.i;
    if (S.crashAt != null && !invested) S.crashAt = null;
    if (S.crashAt != null && invested && S.i - S.crashAt >= 13) S.survived = true;
    if (S.i - S.start >= 26 && invested && value() > bench()) S.beat = true;
  }

  // ---------- News decision ----------
  function showEvent(k, review) {
    const ev = EVENTS[k];
    const ei = eventWeek(ev);
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="ev-h">
      <div class="modal-band"><span class="icon-tile" style="background:#fff;color:var(--coral-ink)">${MM.GLYPH.news}</span><div class="kicker">Breaking news · ${ev.kicker}</div></div>
      <h2 id="ev-h">${MM.esc(ev.headline)}</h2>
      <p>${MM.esc(ev.body)}</p>
      <p class="small muted">${ev.ticker} closed this week at <strong class="num">${MM.money(price(ev.ticker, ei), 2)}</strong> (${pctChange(ev.ticker, ei - 4, ei)} over the past month).</p>
      <p><strong>${MM.esc(ev.ask)}</strong></p>
      <div class="choices">
        <button class="btn good" data-c="buy">Buy more</button>
        <button class="btn" data-c="hold">Hold</button>
        <button class="btn bad" data-c="sell">Sell</button>
      </div>
      <div class="reveal-slot"></div>
      <p class="small muted" style="margin-top:14px">This is a learning game based on real history, not financial advice.</p>
    </div>`;
    document.body.append(bg);
    const prior = S.decisions.find((d) => d.k === k);
    bg.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => reveal(b.dataset.c)));
    if (prior && review) reveal(prior.choice, true);

    function reveal(choice, isReview) {
      bg.querySelectorAll('[data-c]').forEach((b) => { b.disabled = true; if (b.dataset.c === choice) b.style.outline = '3px solid var(--ink)'; });
      if (!isReview && !S.decisions.find((d) => d.k === k)) { S.decisions.push({ k, choice, i: ei }); save(); }
      const after = (w) => (ei + w < D.length ? pctRaw(ev.ticker, ei, ei + w) : null);
      const cell = (label, v) => `<div><span class="small muted">${label}</span><b class="${v == null ? '' : v >= 0 ? 'up' : 'down'}">${v == null ? '—' : (v >= 0 ? '▲ ' : '▼ ') + MM.pct(v)}</b></div>`;
      const y1 = after(52);
      const verdict = y1 == null ? '' : y1 > 0.02
        ? (choice === 'sell' ? 'Selling here would have <strong>missed</strong> the gain over the next year.' : `Staying invested paid off over the next year${choice === 'buy' ? ', and buying more paid off even more' : ''}.`)
        : y1 < -0.02
          ? (choice === 'sell' ? 'Selling here <strong>avoided</strong> a further loss over the next year. But be honest: was that skill or luck?' : 'The price was lower a year later. Holding through a drop can be painful, and recovery can take a while.')
          : 'A year later the price was about the same. Sometimes nothing much happens.';
      bg.querySelector('.reveal-slot').innerHTML = `<div class="reveal">
        <strong>What actually happened to ${ev.ticker}</strong> (from this week's close):
        <div class="outcome">${cell('1 month later', after(4))}${cell('3 months later', after(13))}${cell('1 year later', y1)}</div>
        <p>${verdict}</p>
        <p><strong>Why:</strong> ${MM.esc(ev.why)}</p>
        <p><strong>How a long-term investor thinks:</strong> ${MM.esc(ev.longTerm)}</p>
        <p class="small muted">Your choice here is a reflection exercise. To actually trade, use the Buy/Sell box on the dashboard.</p>
        <button class="btn primary" data-close style="margin-top:6px">Back to the dashboard</button>
      </div>`;
      bg.querySelector('[data-close]').onclick = () => { bg.remove(); render(); MM.celebrate(); };
      bg.querySelector('[data-close]').focus();
    }
    bg.addEventListener('keydown', (e) => { if (e.key === 'Escape' && (review || S.decisions.find((d) => d.k === k))) { bg.remove(); render(); } });
    bg.querySelector('[data-c]').focus();
  }
  function pctRaw(t, a, b) { a = Math.max(0, a); return price(t, b) / price(t, a) - 1; }
  function pctChange(t, a, b) { return MM.pct(pctRaw(t, a, b)); }

  // ---------- Coach ----------
  function coach() {
    const v = value();
    const tips = [];
    const pos = TICKERS.filter((t) => S.hold[t]).map((t) => [t, (S.hold[t] * price(t, S.i)) / v]).sort((a, b) => b[1] - a[1]);
    const cashPct = S.cash / v;
    if (!pos.length) tips.push('You are 100% in cash. Cash is safe, but it does not grow. Try buying a little of the S&P 500 index fund (SPY) to see how the market moves.');
    if (pos.length && pos[0][0] !== 'SPY' && pos[0][1] > 0.4) tips.push(`<strong>${pos[0][0]}</strong> is ${Math.round(pos[0][1] * 100)}% of your portfolio. If that one company has a bad year, your whole portfolio feels it. That is called <em>concentration risk</em>.`);
    if (pos.length && cashPct > 0.5) tips.push(`${Math.round(cashPct * 100)}% of your money is sitting in cash. Over long periods, uninvested cash usually falls behind the market.`);
    const weeks = S.i - S.start;
    if (weeks >= 8) {
      const diff = v - bench();
      tips.push(diff >= 0
        ? `You are <strong>${MM.money(diff, 0)} ahead</strong> of simply buying the index fund on day one. Nice! Ask yourself: was it a repeatable plan, or a lucky pick?`
        : `You are <strong>${MM.money(-diff, 0)} behind</strong> simply buying the index fund on day one and waiting. This happens to many professional investors too. That is why index funds are so popular.`);
    }
    if (S.trades.length > 25) tips.push('You have made a lot of trades. In real life, frequent trading can mean more taxes and more chances to make emotional mistakes.');
    if (!tips.length) tips.push('Press +1 week or +1 month to travel forward and see how your choices play out.');
    return tips.map((t) => `<p style="margin:0 0 10px">${t}</p>`).join('');
  }

  // ---------- Render ----------
  let priceChart, pfChart;
  function render() {
    if (!S) return setup();
    const v = value(), b = bench();
    const gain = v - START_CASH;
    const atEnd = S.i >= D.length - 1;
    const t = ui.ticker;
    const p = price(t, S.i);
    app.innerHTML = `
      <div class="dash-top">
        <div><div class="eyebrow">Time Machine · started ${MM.date(D[S.start])}</div>
          <h1 style="margin:4px 0 0;font-size:clamp(26px,4vw,36px)">Week ending ${MM.date(weekEnd(S.i))}</h1></div>
        <div class="advance">
          <button class="btn primary" data-adv="1"${atEnd ? ' disabled' : ''}>+1 week</button>
          <button class="btn primary" data-adv="4"${atEnd ? ' disabled' : ''}>+1 month</button>
          <button class="btn" data-adv="13"${atEnd ? ' disabled' : ''}>+3 months</button>
        </div>
      </div>
      ${atEnd ? `<div class="card" style="margin-top:16px;border-color:var(--good)"><strong>You have reached the present day.</strong> Your $10,000 became ${MM.money(v, 0)}. Buying the index fund on day one and waiting would have given ${MM.money(b, 0)}. <button class="btn sm" data-reset>Start a new game</button></div>` : ''}
      <div class="stats">
        <div class="card stat tone-purple"><div class="icon-tile sm">${MM.GLYPH.star}</div><div class="label">Portfolio value</div><div class="value">${MM.money(v, 0)}</div><div class="delta ${gain >= 0 ? 'up' : 'down'}">${gain >= 0 ? '▲' : '▼'} ${MM.money(Math.abs(gain), 0)} (${MM.pct(gain / START_CASH)}) total</div></div>
        <div class="card stat tone-mint"><div class="icon-tile sm">${MM.GLYPH.cart}</div><div class="label">Cash available</div><div class="value">${MM.money(S.cash, 0)}</div><div class="delta muted">${Math.round((S.cash / v) * 100)}% of portfolio</div></div>
        <div class="card stat tone-coral"><div class="icon-tile sm">${MM.GLYPH.shield}</div><div class="label">If you'd bought only the index fund</div><div class="value">${MM.money(b, 0)}</div><div class="delta ${b >= START_CASH ? 'up' : 'down'}">${MM.pct(b / START_CASH - 1)} since start</div></div>
        <div class="card stat tone-sun"><div class="icon-tile sm">${MM.GLYPH.trophy}</div><div class="label">You vs the index</div><div class="value ${v - b >= 0 ? 'up' : 'down'}">${v - b >= 0 ? '+' : '-'}${MM.money(Math.abs(v - b), 0)}</div><div class="delta muted">${v - b >= 0 ? 'ahead' : 'behind'}</div></div>
      </div>
      <div class="dash-grid">
        <div class="grid">
          <div class="card">
            <div class="tickers" role="group" aria-label="Choose a company">${TICKERS.map((x) => `<button type="button" aria-pressed="${x === t}" data-t="${x}">${x}</button>`).join('')}</div>
            <div class="chart-head"><div><strong style="font-size:20px">${CO[t][0]}</strong> <span class="pill">${t}</span><div class="small muted">${CO[t][1]}</div></div>
              <div style="text-align:right"><div class="num" style="font-size:24px;font-weight:700">${MM.money(p, 2)}</div><div class="small num">${chg(t, 1, 'week')} · ${chg(t, 52, 'year')}</div></div></div>
            <div id="price-chart" style="margin-top:10px"></div>
            <p class="small muted" style="margin:6px 0 0">Showing the past 2 years up to your current date. Dotted lines mark news events. Hover or tap the chart for exact prices.</p>
          </div>
          <div class="card">
            <div class="chart-head"><strong>Your portfolio vs. just buying the index fund</strong></div>
            <div id="pf-chart" style="margin-top:10px"></div>
          </div>
          <div class="card">
            <strong>Your holdings</strong>
            <div class="table-scroll"><table class="holdings" style="margin-top:8px"><thead><tr><th>Company</th><th>Shares</th><th>Price</th><th>Value</th><th>Gain/loss</th></tr></thead><tbody>
            ${TICKERS.filter((x) => S.hold[x]).map((x) => { const val = S.hold[x] * price(x, S.i), gl = val - S.cost[x]; return `<tr><td><strong>${x}</strong> <span class="small muted">${CO[x][0]}</span></td><td>${S.hold[x].toFixed(3)}</td><td>${MM.money(price(x, S.i), 2)}</td><td>${MM.money(val, 2)}</td><td class="${gl >= 0 ? 'up' : 'down'}">${gl >= 0 ? '+' : '-'}${MM.money(Math.abs(gl), 2)} (${MM.pct(gl / S.cost[x])})</td></tr>`; }).join('') || '<tr><td colspan="5" class="muted" style="text-align:left">Nothing yet. Use the Buy box to make your first purchase.</td></tr>'}
            <tr><td><strong>Cash</strong></td><td></td><td></td><td>${MM.money(S.cash, 2)}</td><td></td></tr>
            </tbody></table></div>
          </div>
        </div>
        <div class="grid">
          <div class="card trade-box">
            <div class="seg" role="group" aria-label="Buy or sell"><button type="button" data-side="buy" aria-pressed="${ui.side === 'buy'}">Buy</button><button type="button" data-side="sell" aria-pressed="${ui.side === 'sell'}">Sell</button></div>
            <p style="margin:12px 0 4px"><strong>${ui.side === 'buy' ? 'Buy' : 'Sell'} ${t}</strong> <span class="cname">${CO[t][0]} at ${MM.money(p, 2)}/share</span></p>
            <label class="field">Amount in dollars<input type="number" id="amt" min="1" step="50" value="${ui.side === 'buy' ? Math.min(1000, Math.floor(S.cash)) : Math.floor((S.hold[t] || 0) * p)}" inputmode="decimal"></label>
            <div class="small muted" id="est" style="margin-top:4px"></div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
              ${ui.side === 'buy' ? `<button class="btn sm" data-q="500">$500</button><button class="btn sm" data-q="1000">$1,000</button><button class="btn sm" data-q="all">All cash</button>` : `<button class="btn sm" data-q="half">Half</button><button class="btn sm" data-q="all">Everything</button>`}
            </div>
            <button class="btn ${ui.side === 'buy' ? 'good' : 'bad'}" id="do" style="width:100%;margin-top:12px">${ui.side === 'buy' ? 'Buy' : 'Sell'} ${t}</button>
            <div class="trade-msg" aria-live="polite">${ui.msg || ''}</div>
          </div>
          <div class="card"><strong>Coach</strong><div style="margin-top:8px">${coach()}</div></div>
          <div class="card"><strong>News you've seen</strong>
            <div class="news-list">${S.seen.filter((k) => S.decisions.find((d) => d.k === k)).map((k) => { const ev = EVENTS[k], d = S.decisions.find((x) => x.k === k); return `<div class="item"><div class="when">${MM.date(ev.date)} · ${ev.ticker} · you chose ${d.choice.toUpperCase()}</div><a href="#" data-ev="${k}">${MM.esc(ev.headline)}</a></div>`; }).reverse().join('') || '<p class="small muted">Travel forward. When real news happened, it will pop up here.</p>'}</div>
          </div>
          <div class="card"><strong>Trade history</strong><div class="log" style="margin-top:6px">${S.trades.map((x) => `<div><span class="small muted">${MM.date(weekEnd(x.i))}</span><br>${x.side === 'buy' ? 'Bought' : 'Sold'} ${x.shares.toFixed(3)} ${x.t} @ ${MM.money(x.price, 2)}</div>`).join('') || '<p class="small muted">No trades yet.</p>'}</div></div>
          <button class="btn" data-reset>Reset and start over</button>
        </div>
      </div>`;
    wire();
    charts();
  }
  function chg(t, w, label) {
    if (S.i - w < 0) return '';
    const r = pctRaw(t, S.i - w, S.i);
    return `<span class="${r >= 0 ? 'up' : 'down'}">${MM.pct(r)}</span> ${label}`;
  }

  function charts() {
    const t = ui.ticker;
    const from = Math.max(0, S.i - 104);
    const labels = D.slice(from, S.i + 1);
    const markers = S.seen.filter((k) => EVENTS[k].ticker === t || EVENTS[k].ticker === 'SPY')
      .map((k) => ({ i: eventWeek(EVENTS[k]) - from, label: EVENTS[k].headline }));
    priceChart = MM.lineChart(document.getElementById('price-chart'), {
      labels, height: 280, area: true, markers,
      yFormat: (v) => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(v < 10 ? 2 : 0)),
      tipFormat: (v) => MM.money(v, 2), tipLabel: (i) => 'Week ending ' + MM.date(weekEnd(from + i)),
      series: [{ name: t + ' price', color: '--series-1', values: labels.map((_, k) => price(t, from + k)) }]
    });
    const hl = D.slice(S.start, S.i + 1);
    const pv = new Array(hl.length).fill(null);
    S.hist.forEach(([i, val]) => { if (i >= S.start) pv[i - S.start] = val; });
    for (let k = 1; k < pv.length; k++) if (pv[k] == null) pv[k] = pv[k - 1];
    pfChart = MM.lineChart(document.getElementById('pf-chart'), {
      labels: hl, height: 240,
      yFormat: (v) => '$' + (v / 1000).toFixed(v < 10000 ? 1 : 0) + 'k',
      tipFormat: (v) => MM.money(v, 0), tipLabel: (i) => 'Week ending ' + MM.date(weekEnd(S.start + i)),
      series: [{ name: 'Your portfolio', color: '--series-1', values: pv }, { name: 'Index fund only (SPY)', color: '--series-2', values: hl.map((_, k) => bench(S.start + k)), dash: true }]
    });
  }

  function wire() {
    app.querySelectorAll('[data-adv]').forEach((b) => (b.onclick = () => { ui.msg = ''; advance(+b.dataset.adv); }));
    app.querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => { ui.ticker = b.dataset.t; ui.msg = ''; render(); }));
    app.querySelectorAll('[data-side]').forEach((b) => (b.onclick = () => { ui.side = b.dataset.side; ui.msg = ''; render(); }));
    app.querySelectorAll('[data-reset]').forEach((b) => (b.onclick = () => { if (confirm('Start over? Your practice portfolio will be cleared.')) { S = null; MM.save('sim', null); render(); } }));
    app.querySelectorAll('[data-ev]').forEach((a) => (a.onclick = (e) => { e.preventDefault(); showEvent(+a.dataset.ev, true); }));
    const amt = app.querySelector('#amt'), est = app.querySelector('#est');
    const t = ui.ticker, p = price(t, S.i);
    const upd = () => { const d = +amt.value || 0; est.textContent = d > 0 ? `≈ ${(d / p).toFixed(4)} shares` + (ui.side === 'sell' ? ` (you own ${(S.hold[t] || 0).toFixed(4)})` : ` (cash: ${MM.money(S.cash, 2)})`) : ''; };
    amt.oninput = upd; upd();
    app.querySelectorAll('[data-q]').forEach((b) => (b.onclick = () => {
      const q = b.dataset.q, own = (S.hold[t] || 0) * p;
      amt.value = ui.side === 'buy' ? (q === 'all' ? Math.floor(S.cash * 100) / 100 : q) : (q === 'all' ? own.toFixed(2) : (own / 2).toFixed(2));
      upd();
    }));
    app.querySelector('#do').onclick = () => {
      const d = +amt.value || 0;
      if (d <= 0) { ui.msg = 'Enter an amount first.'; return render(); }
      const own = (S.hold[t] || 0) * p;
      ui.msg = trade(ui.side, t, ui.side === 'sell' && d >= own - 0.01 ? Infinity : d);
      S.hist[S.hist.length - 1] = [S.i, value()];
      save();
      render();
      MM.celebrate();
    };
  }

  render();
})();
