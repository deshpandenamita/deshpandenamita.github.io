(function () {
  var root = document.documentElement, motion = root.classList.contains('anim');
  function $(id) { return document.getElementById(id); }

  /* theme */
  try { var saved = localStorage.getItem('theme'); if (saved) root.dataset.theme = saved; } catch (e) {}
  $('theme').addEventListener('click', function () {
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  /* title words rise in */
  document.querySelectorAll('.split').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/); el.textContent = '';
    words.forEach(function (w, i) {
      var o = document.createElement('span'), n = document.createElement('span');
      o.className = 'w'; n.className = 'wi'; n.style.setProperty('--i', i); n.textContent = w;
      o.appendChild(n); el.appendChild(o); if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* reveals, only for what starts below the fold */
  if (motion) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pending'); io.unobserve(e.target); countUp(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add('pending'); io.observe(el); } });
  }

  /* numbers count up when they come into view */
  function countUp(scope) {
    if (!motion) return;
    scope.querySelectorAll('.stat b').forEach(function (b) {
      if (b.dataset.done) return; b.dataset.done = 1;
      if (/\d\s*[–-]\s*\d|→/.test(b.textContent)) return;   // ranges and before→after values stay as written
      var m = b.textContent.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/); if (!m) return;
      var target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].indexOf(',') > -1, t0 = null;
      function fmt(v) { var s = v.toFixed(dec); return comma ? Number(s).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s; }
      (function step(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3); b.textContent = m[1] + fmt(target * e) + m[3]; if (k < 1) requestAnimationFrame(step); })(performance.now());
    });
  }
  var stats = document.querySelector('.stats'); if (stats && stats.getBoundingClientRect().top < innerHeight) countUp(stats);

  /* reading progress + contents highlight + cover parallax */
  var bar = $('progress'), links = Array.prototype.slice.call(document.querySelectorAll('.toc a')), cover = document.querySelector('.cs-cover img'), ticking = false;
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    var cur = -1; secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('here', i === cur); });
    if (motion && cover && scrollY < innerHeight * 1.5) cover.style.translate = '0 ' + (scrollY * 0.12).toFixed(1) + 'px';
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* every figure opens large; arrows move through all figures on the page */
  var figs = Array.prototype.slice.call(document.querySelectorAll('.fig')), zoom = $('zoom'), zImg = $('zImg'), cur = 0;
  function show(i) {
    cur = (i + figs.length) % figs.length;
    var img = figs[cur].querySelector('img'), cap = figs[cur].querySelector('figcaption');
    zImg.classList.add('swap');
    var pre = new Image(); pre.onload = function () { zImg.src = pre.src; zImg.alt = img.alt; zImg.classList.remove('swap'); }; pre.src = img.currentSrc || img.src;
    $('zCap').textContent = cap ? cap.textContent : img.alt;
    $('zCount').textContent = (cur + 1) + ' / ' + figs.length;
  }
  figs.forEach(function (f, i) { f.querySelector('button').addEventListener('click', function () { if (zoom.showModal) zoom.showModal(); else zoom.setAttribute('open', ''); show(i); }); });
  function close() { if (zoom.close) zoom.close(); else zoom.removeAttribute('open'); }
  if (zoom) {
    $('zPrev').addEventListener('click', function () { show(cur - 1); });
    $('zNext').addEventListener('click', function () { show(cur + 1); });
    $('zClose').addEventListener('click', close);
    zoom.addEventListener('click', function (e) { if (e.target === zoom) close(); });
    zoom.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
    var sx = null, stage = zoom.querySelector('.z-stage');
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    stage.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
    if (figs.length < 2) { $('zPrev').hidden = $('zNext').hidden = true; }
  }
  $('yr').textContent = new Date().getFullYear();
})();
