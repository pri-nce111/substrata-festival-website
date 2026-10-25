(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==================================================
     DATA
     ================================================== */
  const ARTISTS = [
    { name:'VOID//MERIDIAN', genre:'ACID TECHNO', day:'fri' },
    { name:'KALTE FRONT',    genre:'INDUSTRIAL',   day:'fri' },
    { name:'NYX PATTERN',    genre:'DEEP TECHNO',  day:'fri' },
    { name:'RUNAR',          genre:'BREAKBEAT',    day:'fri' },
    { name:'HEXBLOOM',       genre:'ELECTRO',      day:'fri' },
    { name:'SVENSK NOIR',    genre:'MINIMAL',      day:'sat' },
    { name:'ORBIT 44',       genre:'TRANCE',       day:'sat' },
    { name:'FERAL SIGNAL',   genre:'EBM',          day:'sat' },
    { name:'DUST&CIRCUIT',   genre:'HARD TECHNO',  day:'sat' },
    { name:'MONO/CHROME',    genre:'DUB TECHNO',   day:'sat' },
    { name:'AXIS VELVET',    genre:'PROGRESSIVE',  day:'sun' },
    { name:'CTRL+GHOST',     genre:'IDM',          day:'sun' },
    { name:'PALE STATIC',    genre:'AMBIENT',      day:'sun' },
    { name:'RE:AGENT',       genre:'ACID TECHNO',  day:'sun' },
  ];

  const STAGES = [
    { name:'THE UNDERCARRIAGE', color:'var(--magenta)', detail:'Main room · <b>Hard techno / industrial</b>', time:'22:00 — 06:00' },
    { name:'SUBBASEMENT',       color:'var(--violet)',  detail:'Sound system built for sub-bass · <b>Dub / EBM</b>', time:'23:00 — 05:00' },
    { name:'CHROME ANNEX',      color:'var(--cyan)',    detail:'Intimate room · <b>Minimal / deep</b>', time:'21:00 — 04:00' },
    { name:'THE ROOFTOP SIGNAL',color:'var(--acid)',    detail:'Open air, weather permitting · <b>Breaks / electro</b>', time:'20:00 — 02:00' },
  ];

  const TICKETS = [
    {
      tier:'EARLY SIGNAL', price:'$65', period:'/ single night',
      desc:'One night, general entry. First tier, limited quantity, no re-release once sold.',
      status:'62 LEFT', low:true, featured:false
    },
    {
      tier:'FULL FREQUENCY', price:'$150', period:'/ 3-night pass',
      desc:'Full weekend access to all four rooms. The way SUBSTRATA is meant to be experienced.',
      status:'AVAILABLE', low:false, featured:true
    },
    {
      tier:'VIP ACCESS', price:'$320', period:'/ 3-night pass',
      desc:'Side-stage viewing, dedicated bar, and early venue entry before doors open to general.',
      status:'19 LEFT', low:true, featured:false
    },
  ];

  /* ==================================================
     NAV — scroll state + mobile toggle
     ================================================== */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(11,7,16,0.97)';
    navLinks.style.padding = '20px';
    navLinks.style.gap = '18px';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  /* ==================================================
     TICKER — build from artist list
     ================================================== */
  const tickerTrack = document.getElementById('tickerTrack');
  const tickerHTML = ARTISTS.map(a =>
    `<span class="ticker-item"><b>${a.name}</b> ${a.genre}<span class="sep">•</span></span>`
  ).join('');
  tickerTrack.innerHTML = tickerHTML + tickerHTML; // duplicate for seamless loop

  /* ==================================================
     LINEUP grid + filter
     ================================================== */
  const lineupGrid = document.getElementById('lineupGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function renderLineup(day){
    const list = day === 'all' ? ARTISTS : ARTISTS.filter(a => a.day === day);
    lineupGrid.innerHTML = list.map(a => `
      <div class="artist-card">
        <span class="artist-day">${a.day.toUpperCase()}</span>
        <span class="artist-name">${a.name}</span>
        <span class="artist-genre">${a.genre}</span>
      </div>
    `).join('');
  }
  renderLineup('all');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLineup(btn.dataset.day);
    });
  });

  /* ==================================================
     STAGES
     ================================================== */
  const stageList = document.getElementById('stageList');
  stageList.innerHTML = STAGES.map(s => `
    <div class="stage-row">
      <div class="stage-name"><span class="dot" style="background:${s.color}"></span>${s.name}</div>
      <div class="stage-detail">${s.detail}</div>
      <div class="stage-time">${s.time}</div>
    </div>
  `).join('');

  /* ==================================================
     TICKETS
     ================================================== */
  const ticketGrid = document.getElementById('ticketGrid');
  ticketGrid.innerHTML = TICKETS.map(t => `
    <div class="ticket-card ${t.featured ? 'featured' : ''}">
      <span class="ticket-tier">${t.tier}</span>
      <div class="ticket-price">${t.price} <span>${t.period}</span></div>
      <p class="ticket-desc">${t.desc}</p>
      <span class="ticket-status ${t.low ? 'low' : ''}">${t.status}</span>
      <a href="#" class="btn btn-primary" style="justify-content:center">RESERVE</a>
    </div>
  `).join('');

  /* ==================================================
     COUNTDOWN
     ================================================== */
  const countdownEl = document.getElementById('countdown');
  // Next Oct 16, from "now"
  function getTargetDate(){
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 9, 16, 22, 0, 0); // Oct is month index 9
    if (target < now) target = new Date(year + 1, 9, 16, 22, 0, 0);
    return target;
  }
  const targetDate = getTargetDate();

  function updateCountdown(){
    const now = new Date();
    let diff = Math.max(0, targetDate - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const pad = n => String(n).padStart(2,'0');
    countdownEl.textContent = `${pad(days)}D : ${pad(hours)}H : ${pad(mins)}M`;
  }
  updateCountdown();
  setInterval(updateCountdown, 60000);

  /* ==================================================
     BPM counter — subtle live drift
     ================================================== */
  const bpmEl = document.getElementById('bpmValue');
  let bpm = 128;
  if (!reduceMotion){
    setInterval(() => {
      bpm += (Math.random() > 0.5 ? 1 : -1);
      bpm = Math.min(140, Math.max(122, bpm));
      bpmEl.textContent = bpm;
    }, 1400);
  }

  /* ==================================================
     Glitch title — periodic trigger
     ================================================== */
  const glitchTitle = document.getElementById('glitchTitle');
  if (!reduceMotion){
    setInterval(() => {
      glitchTitle.classList.add('glitch');
      setTimeout(() => glitchTitle.classList.remove('glitch'), 650);
    }, 5000);
  }

  /* ==================================================
     Strobe layer — rare, brief, safe flashes
     Respects prefers-reduced-motion (layer removed via CSS/JS)
     ================================================== */
  const strobeLayer = document.querySelector('.strobe-layer');
  if (!reduceMotion && strobeLayer){
    function scheduleFlash(){
      const delay = 6000 + Math.random() * 7000; // infrequent: every 6-13s
      setTimeout(() => {
        strobeLayer.classList.remove('flash');
        void strobeLayer.offsetWidth; // restart animation
        strobeLayer.classList.add('flash');
        scheduleFlash();
      }, delay);
    }
    scheduleFlash();
  }

  /* ==================================================
     Scroll reveal
     ================================================== */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ==================================================
     Signal form
     ================================================== */
  const signalForm = document.getElementById('signalForm');
  const formNote = document.getElementById('formNote');
  signalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'SIGNAL REGISTERED — WATCH YOUR INBOX 48H BEFORE DOORS.';
    signalForm.reset();
  });

  /* ==================================================
     Footer year
     ================================================== */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ==================================================
     Canvas: Hero oscilloscope / waveform visualizer
     ================================================== */
  const waveCanvas = document.getElementById('waveCanvas');
  const wctx = waveCanvas.getContext('2d');
  let waveW, waveH, dpr;

  function resizeWave(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    waveW = waveCanvas.clientWidth;
    waveH = waveCanvas.clientHeight;
    waveCanvas.width = waveW * dpr;
    waveCanvas.height = waveH * dpr;
    wctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resizeWave);
  resizeWave();

  const BAR_COUNT = 64;
  const bars = new Array(BAR_COUNT).fill(0);
  const barTargets = new Array(BAR_COUNT).fill(0);

  function randomizeTargets(){
    for (let i = 0; i < BAR_COUNT; i++){
      const center = BAR_COUNT / 2;
      const falloff = 1 - Math.abs(i - center) / center * 0.55;
      barTargets[i] = Math.random() * falloff;
    }
  }
  randomizeTargets();
  setInterval(randomizeTargets, 260); // ~beat-synced re-target

  let waveTime = 0;
  function drawWave(){
    wctx.clearRect(0,0,waveW,waveH);

    // base grid
    wctx.strokeStyle = 'rgba(123,47,255,0.08)';
    wctx.lineWidth = 1;
    for (let x = 0; x < waveW; x += 48){
      wctx.beginPath();
      wctx.moveTo(x, 0);
      wctx.lineTo(x, waveH);
      wctx.stroke();
    }

    const baseline = waveH * 0.72;
    const gap = waveW / BAR_COUNT;
    const maxBarHeight = waveH * 0.5;

    for (let i = 0; i < BAR_COUNT; i++){
      bars[i] += (barTargets[i] - bars[i]) * 0.12;
      const h = Math.max(4, bars[i] * maxBarHeight);
      const x = i * gap + gap * 0.2;
      const w = gap * 0.6;

      const t = i / BAR_COUNT;
      const grad = wctx.createLinearGradient(0, baseline - h, 0, baseline);
      grad.addColorStop(0, t < 0.5 ? 'rgba(255,27,107,0.85)' : 'rgba(23,233,224,0.85)');
      grad.addColorStop(1, 'rgba(123,47,255,0.15)');
      wctx.fillStyle = grad;
      wctx.fillRect(x, baseline - h, w, h);
      // mirror, fainter
      wctx.globalAlpha = 0.25;
      wctx.fillRect(x, baseline, w, h * 0.4);
      wctx.globalAlpha = 1;
    }

    // sine sweep line
    wctx.beginPath();
    wctx.strokeStyle = 'rgba(212,255,61,0.35)';
    wctx.lineWidth = 1.5;
    for (let x = 0; x <= waveW; x += 4){
      const y = baseline + 90 + Math.sin(x * 0.02 + waveTime) * 14 * Math.sin(waveTime * 0.6);
      if (x === 0) wctx.moveTo(x,y); else wctx.lineTo(x,y);
    }
    wctx.stroke();

    waveTime += reduceMotion ? 0 : 0.02;
    if (!reduceMotion){
      requestAnimationFrame(drawWave);
    }
  }
  drawWave();
  if (reduceMotion){
    // draw a single static frame periodically instead of animating
    setInterval(drawWave, 2000);
  }

  /* ==================================================
     Canvas: location radar / map
     ================================================== */
  const mapCanvas = document.getElementById('mapCanvas');
  const mctx = mapCanvas.getContext('2d');
  let mapW, mapH;

  function resizeMap(){
    const d = Math.min(window.devicePixelRatio || 1, 2);
    mapW = mapCanvas.clientWidth;
    mapH = mapCanvas.clientHeight;
    mapCanvas.width = mapW * d;
    mapCanvas.height = mapH * d;
    mctx.setTransform(d,0,0,d,0,0);
  }
  window.addEventListener('resize', resizeMap);
  resizeMap();

  let radarAngle = 0;
  function drawMap(){
    mctx.clearRect(0,0,mapW,mapH);
    const cx = mapW / 2;
    const cy = mapH / 2;
    const maxR = Math.min(mapW, mapH) * 0.42;

    // grid rings
    mctx.strokeStyle = 'rgba(23,233,224,0.15)';
    for (let r = maxR/4; r <= maxR; r += maxR/4){
      mctx.beginPath();
      mctx.arc(cx, cy, r, 0, Math.PI*2);
      mctx.stroke();
    }
    // crosshair
    mctx.beginPath();
    mctx.moveTo(cx - maxR, cy); mctx.lineTo(cx + maxR, cy);
    mctx.moveTo(cx, cy - maxR); mctx.lineTo(cx, cy + maxR);
    mctx.stroke();

    // sweep
    const grad = mctx.createConicGradient ? mctx.createConicGradient(radarAngle, cx, cy) : null;
    mctx.save();
    mctx.beginPath();
    mctx.moveTo(cx, cy);
    mctx.arc(cx, cy, maxR, radarAngle, radarAngle + 0.6);
    mctx.closePath();
    if (grad){
      grad.addColorStop(0, 'rgba(255,27,107,0.35)');
      grad.addColorStop(1, 'rgba(255,27,107,0)');
      mctx.fillStyle = grad;
    } else {
      mctx.fillStyle = 'rgba(255,27,107,0.18)';
    }
    mctx.fill();
    mctx.restore();

    // center dot
    mctx.beginPath();
    mctx.fillStyle = '#D4FF3D';
    mctx.arc(cx, cy, 4, 0, Math.PI*2);
    mctx.fill();

    radarAngle += reduceMotion ? 0 : 0.012;
    if (!reduceMotion){
      requestAnimationFrame(drawMap);
    }
  }
  drawMap();
  if (reduceMotion){
    setInterval(drawMap, 3000);
  }

})();
