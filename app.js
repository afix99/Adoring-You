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

  /* ---------- Floating birthday letter ---------- */
  const letterBtn     = document.getElementById('floating-letter-btn');
  const letterOverlay = document.getElementById('birthday-letter-overlay');
  const letterClose   = document.getElementById('letter-close-btn');

  function openLetter(){
    letterOverlay.classList.add('open');
    letterOverlay.setAttribute('aria-hidden','false');
    letterClose.focus();
    document.body.style.overflow = 'hidden';
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
