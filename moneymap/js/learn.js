// Lesson list + lesson reader (hash routing: learn.html#budgeting)
(function () {
  const app = document.getElementById('app');
  const lessons = (window.LESSONS || []).slice().sort((a, b) => a.num - b.num);

  function ytId(url) {
    const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  const local = (v) => typeof v === 'string' && /\.mp4$/i.test(v);

  function list() {
    const p = MM.progress();
    const done = lessons.filter((l) => p[l.id]).length;
    const lv = MM.level();
    const nextL = lessons.find((l) => !p[l.id]);
    document.title = 'Learn – MoneyMap';
    app.innerHTML = `
      <section class="page-hero">
        <div class="hero-bg" aria-hidden="true"></div>
        <span class="eyebrow">10 stops · about 4 minutes each</span>
        <h1>Learn the basics</h1>
        <p class="lead">Start at stop 1 and work your way down. Each lesson ends with key takeaways and a 3-question quiz.</p>
        <div class="player" style="margin-top:18px">
          <div class="stat-chip tone-${lv.tone}">${MM.GLYPH.star}<div><b>${lv.name}</b><span>${lv.next ? `${lv.toNext} more to ${lv.next.name}` : 'Top level reached'}</span></div></div>
          <div class="stat-chip tone-coral">${MM.GLYPH.flame}<div><b>${MM.streak.days} day${MM.streak.days === 1 ? '' : 's'}</b><span>streak</span></div></div>
          <div class="stat-chip tone-mint">${MM.GLYPH.book}<div><b>${done} / ${lessons.length}</b><span>lessons done</span></div></div>
        </div>
        <div class="progress-bar" style="margin-top:18px;max-width:560px"><i style="width:${(done / lessons.length) * 100}%"></i></div>
      </section>
      <section style="margin-top:28px">
        <div class="lesson-grid">${lessons.map((l) => {
          const look = MM.look(l.id), isDone = !!p[l.id], isNext = nextL && nextL.id === l.id;
          return `<a class="card lesson-card lift tone-${look.tone}${isDone ? ' is-done' : ''}${isNext ? ' is-next' : ''}" href="#${l.id}">
            <span class="icon-tile">${look.icon}</span>
            <span class="lc-body"><small>Stop ${l.num}${isNext ? ' · up next' : ''}</small><h4>${MM.esc(l.title)}</h4><p>${MM.esc(l.summary)}</p></span>
            <span class="lc-meta">${isDone ? `<span class="pill done">Done ✓</span>${p[l.id].score === 3 ? `<span class="stars" aria-label="3 out of 3">★★★</span>` : ''}` : `<span class="pill">${l.minutes} min</span>`}</span>
          </a>`; }).join('')}
        </div>
      </section>`;
    window.scrollTo(0, 0);
  }

  function lesson(l) {
    const idx = lessons.indexOf(l);
    const prev = lessons[idx - 1], next = lessons[idx + 1];
    const look = MM.look(l.id);
    const p = MM.progress();
    const raw = ((window.LESSON_VIDEOS || {})[l.id] || []).concat(l.videos || []);
    const vids = raw.map((v) => (local(v) ? { mp4: v } : ytId(v) ? { yt: ytId(v) } : null)).filter(Boolean);
    document.title = l.title + ' – MoneyMap';
    app.innerHTML = `
      <article class="lesson narrow tone-${look.tone}">
        <div class="crumbs"><a href="#">← All lessons</a></div>
        <header class="lesson-hero">
          <span class="icon-tile big">${look.icon}</span>
          <div>
            <div class="eyebrow" style="color:var(--tone-ink)">Stop ${l.num} of ${lessons.length} · ${l.minutes} min read${p[l.id] ? ' · done ✓' : ''}</div>
            <h1>${MM.esc(l.title)}</h1>
            <p class="lead">${MM.esc(l.summary)}</p>
          </div>
        </header>
        <p class="small muted tip-line">${MM.GLYPH.brain}<span>Words with a dotted underline have a plain-English definition. Hover or tap them.</span></p>
        <div class="lesson-body">${l.body}</div>
        <div class="takeaways"><h3>${MM.GLYPH.star} Key takeaways</h3><ul>${l.takeaways.map((t) => `<li>${t}</li>`).join('')}</ul></div>
        <div class="quiz card"><span class="eyebrow" style="color:var(--tone-ink)">Check yourself</span><h2 style="margin-top:4px">Quick quiz</h2><p class="muted small">Answer all 3 to complete this stop.</p>
          ${l.quiz.map((q, qi) => `<div class="q" data-q="${qi}"><strong>${qi + 1}. ${q.q}</strong>
            <div class="opts">${q.options.map((o, oi) => `<button type="button" class="opt" data-o="${oi}"><span class="opt-key">${'ABCD'[oi]}</span>${o}</button>`).join('')}</div>
            <div class="why" aria-live="polite"></div></div>`).join('')}
          <div class="quiz-result" aria-live="polite"></div>
        </div>
        <div class="videos"><h3>${MM.GLYPH.play} Watch more</h3>
          ${vids.length ? vids.map((v) => v.mp4
            ? `<div class="video-frame"><video controls preload="metadata" src="${v.mp4}"><track kind="captions" srclang="en" label="English" src="${v.mp4.replace(/\.mp4$/i, '.vtt')}" default></video></div>`
            : `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${v.yt}" title="Lesson video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`).join('')
            : `<div class="video-empty">A narrated video for this lesson is coming soon. In the meantime, try the animated explainers on the <a href="index.html#explainers">home page</a>.</div>`}
        </div>
        <div class="lesson-nav">
          ${prev ? `<a class="btn" href="#${prev.id}">← ${MM.esc(prev.title)}</a>` : '<span></span>'}
          ${next ? `<a class="btn primary" href="#${next.id}">Next stop: ${MM.esc(next.title)} →</a>` : `<a class="btn primary" href="practice.html">Try the Time Machine →</a>`}
        </div>
      </article>`;
    MM.activateTerms(app);
    MM.mountInteractive(app);

    const answered = {};
    let right = 0;
    app.querySelectorAll('.q').forEach((qel) => {
      const qi = +qel.dataset.q, q = l.quiz[qi];
      qel.querySelectorAll('.opt').forEach((b) => {
        b.addEventListener('click', () => {
          if (answered[qi] != null) return;
          const oi = +b.dataset.o;
          answered[qi] = oi;
          if (oi === q.answer) right++;
          qel.querySelectorAll('.opt').forEach((x, xi) => {
            x.disabled = true;
            if (xi === q.answer) x.classList.add('right');
            else if (xi === oi) x.classList.add('wrong');
          });
          qel.querySelector('.why').innerHTML = (oi === q.answer ? '<strong class="up">Correct!</strong> ' : '<strong class="down">Not quite.</strong> ') + q.why;
          if (Object.keys(answered).length === l.quiz.length) finish();
        });
      });
    });
    function finish() {
      const best = Math.max(right, (MM.progress()[l.id] || {}).score || 0);
      MM.markDone(l.id, best);
      const n = l.quiz.length;
      const msg = right === n ? 'Perfect score!' : right >= 2 ? 'Nice work!' : 'Stop complete. Review the takeaways and try again anytime.';
      app.querySelector('.quiz-result').innerHTML = `<div class="result-card">
        <div class="stars big" aria-label="${right} out of ${n}">${'★'.repeat(right)}<span>${'★'.repeat(n - right)}</span></div>
        <div><b>${msg}</b><div class="muted small">You got ${right} of ${n}. Stop ${l.num} is marked complete.</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">${right < n ? '<button class="btn sm" type="button" data-retry>Try again</button>' : ''}${next ? `<a class="btn sm primary" href="#${next.id}">Next stop →</a>` : ''}</div>
      </div>`;
      const rb = app.querySelector('[data-retry]');
      if (rb) rb.onclick = () => lesson(l);
      const fresh = MM.celebrate();
      if (right >= 2 && !fresh.length) MM.confetti();
    }
    window.scrollTo(0, 0);
  }

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const l = lessons.find((x) => x.id === id);
    l ? lesson(l) : list();
  }
  window.addEventListener('hashchange', route);
  route();
})();
