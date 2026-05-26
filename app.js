/* ============================================================
   App — petals, scroll reveal, nav active state
   ============================================================ */
(function(){

  /* ---------- Falling petals (sparse, slow) ---------- */
  function spawnPetals(){
    const wrap = document.getElementById('petals');
    if(!wrap) return;
    wrap.innerHTML = '';
    const count = window.innerWidth < 700 ? 6 : 10;
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'petal';
      const size = 12 + Math.random()*12;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (Math.random()*100) + 'vw';
      const dur = 22 + Math.random()*22;
      p.style.animationDuration = dur + 's';
      p.style.animationDelay = (-Math.random()*dur) + 's';
      p.style.setProperty('--drift', (Math.random()*180-90) + 'px');
      p.style.opacity = 0.35 + Math.random()*0.35;
      const hue = Math.random()*24 - 12;
      p.style.filter = `drop-shadow(0 2px 3px rgba(90,46,69,0.12)) hue-rotate(${hue}deg)`;
      wrap.appendChild(p);
    }
  }
  spawnPetals();
  // Re-spawn on big resize so density matches viewport
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(spawnPetals, 400);
  });

  /* ---------- Reveal-on-scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Nav-dot active state ---------- */
  const sections = [...document.querySelectorAll('section[id]')];
  const dots = [...document.querySelectorAll('.nav-dot')];
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const id = e.target.id;
        dots.forEach(d => d.classList.toggle('active', d.dataset.target === id));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectionIO.observe(s));

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const tgt = document.getElementById(d.dataset.target);
      if(tgt) tgt.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  /* ---------- Petal burst (one-shot when modal opens) ---------- */
  function petalBurst(){
    const wrap = document.getElementById('petals');
    if(!wrap) return;
    const count = 36;
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'petal burst';
      const size = 10 + Math.random()*14;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (42 + Math.random()*16) + 'vw';
      p.style.top  = (38 + Math.random()*18) + 'vh';
      const angle = Math.random()*Math.PI*2;
      const dist  = 200 + Math.random()*420;
      p.style.setProperty('--burst-x', Math.cos(angle)*dist + 'px');
      p.style.setProperty('--burst-y', Math.sin(angle)*dist + 'px');
      p.style.animationDelay = (Math.random()*0.25) + 's';
      const hue = Math.random()*30 - 15;
      p.style.filter = `hue-rotate(${hue}deg)`;
      wrap.appendChild(p);
      setTimeout(() => p.remove(), 3500);
    }
  }

  /* ---------- Hour counter inside modal ---------- */
  function updateBirthdayCounter(){
    const counter = document.getElementById('birthday-counter');
    if(!counter) return;
    const now = new Date();
    const day = now.getDate(), month = now.getMonth()+1;
    let text;
    if(month === 5 && day === 27){
      const h = now.getHours();
      text = `${h} hour${h===1?'':'s'} into your 20th year`;
    } else if(month === 5 && day < 27){
      const days = 27 - day;
      text = `${days} day${days===1?'':'s'} until your 20th`;
    } else {
      text = 'Twenty looks beautiful on you';
    }
    counter.textContent = text;
  }

  /* ---------- Candles (blow them out for a wish) ---------- */
  function setupCandles(){
    const candles = document.querySelectorAll('#birthday-candles .candle');
    const hint    = document.getElementById('candle-hint');
    const wish    = document.getElementById('wish-made');
    if(!candles.length) return;
    candles.forEach(c => {
      c.addEventListener('click', () => {
        if(c.classList.contains('out')) return;
        c.classList.add('out');
        const allOut = [...candles].every(x => x.classList.contains('out'));
        if(allOut){
          hint && hint.classList.add('fade');
          wish && wish.classList.add('show');
        }
      });
    });
  }
  function resetCandles(){
    document.querySelectorAll('#birthday-candles .candle.out').forEach(c => c.classList.remove('out'));
    const hint = document.getElementById('candle-hint');
    const wish = document.getElementById('wish-made');
    hint && hint.classList.remove('fade');
    wish && wish.classList.remove('show');
  }

  /* ---------- Floating birthday letter ---------- */
  const letterBtn     = document.getElementById('floating-letter-btn');
  const letterOverlay = document.getElementById('birthday-letter-overlay');
  const letterClose   = document.getElementById('letter-close-btn');

  function openLetter(){
    letterOverlay.classList.add('open');
    letterOverlay.setAttribute('aria-hidden','false');
    letterClose.focus();
    document.body.style.overflow = 'hidden';
    updateBirthdayCounter();
    resetCandles();
    petalBurst();
  }
  function closeLetter(){
    letterOverlay.classList.remove('open');
    letterOverlay.setAttribute('aria-hidden','true');
    letterBtn.focus();
    document.body.style.overflow = '';
  }

  if(letterBtn && letterOverlay && letterClose){
    letterBtn.addEventListener('click', openLetter);
    letterClose.addEventListener('click', closeLetter);
    letterOverlay.addEventListener('click', (e) => {
      if(e.target === letterOverlay) closeLetter();
    });
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && letterOverlay.classList.contains('open')) closeLetter();
    });
    letterOverlay.setAttribute('aria-hidden','true');
    setupCandles();
    updateBirthdayCounter();
  }

  /* ---------- Night mode (after 8pm her time) ---------- */
  function checkNightMode(){
    const h = new Date().getHours();
    document.body.classList.toggle('night', h >= 20 || h < 6);
  }
  checkNightMode();
  setInterval(checkNightMode, 60*1000);

  /* ---------- Guestbook (localStorage) ---------- */
  const gbText  = document.getElementById('guestbook-text');
  const gbSave  = document.getElementById('guestbook-save');
  const gbSaved = document.getElementById('guestbook-saved');
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function renderGuestbook(){
    if(!gbSaved) return;
    const raw = localStorage.getItem('memey-guestbook-2026');
    if(!raw){ gbSaved.innerHTML = ''; return; }
    try {
      const data = JSON.parse(raw);
      const when = new Date(data.t).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
      gbSaved.innerHTML = '<div class="saved-note">' + escapeHtml(data.note) +
        '<span class="saved-meta">saved · ' + escapeHtml(when) + '</span></div>';
    } catch(e){
      gbSaved.innerHTML = '<div class="saved-note">' + escapeHtml(raw) + '</div>';
    }
  }
  if(gbSave && gbText){
    gbSave.addEventListener('click', () => {
      const text = gbText.value.trim();
      if(!text) return;
      localStorage.setItem('memey-guestbook-2026', JSON.stringify({ note: text, t: Date.now() }));
      renderGuestbook();
      gbText.value = '';
    });
    renderGuestbook();
  }

  /* ---------- Gentle hero parallax (peony bloom only) ---------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const bloom = document.querySelector('.hero-bloom-wrap');
      if(bloom && y < window.innerHeight){
        bloom.style.transform = `translateY(${y * 0.12}px)`;
      }
      ticking = false;
    });
  });

})();
