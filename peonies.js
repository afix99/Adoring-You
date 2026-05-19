/* ============================================================
   The Bouquet, 15 named peonies, zigzag arrangement
   ============================================================ */
(function(){

  // Each peony: name, description, a small handwritten note,
  // and visual params (hue / saturation / lightness for tint, fullness, openness).
  const PEONIES = [
    { name:'Liora',     desc:'the softest bloom',
      note:'no. 1, top left, where every story begins',
      hue:348, sat:32, light:84, fullness:0.85, rings:3 },
    { name:'Seraphine', desc:'dramatic petals, very angelic',
      note:'wings of a girl who is shy in capital letters',
      hue:344, sat:42, light:78, fullness:1.05, rings:4 },
    { name:'Valencia',  desc:'fullest and boldest one',
      note:'the one that stands tallest in the photo',
      hue:338, sat:48, light:70, fullness:1.10, rings:4 },
    { name:'Opaline',   desc:'pale and delicate, macam porcelain',
      note:'almost-white. you mistake her for shy.',
      hue:354, sat:18, light:90, fullness:0.92, rings:3 },
    { name:'Amorette',  desc:'fluffy and romantic',
      note:'the one that looks like a love letter',
      hue:345, sat:38, light:82, fullness:1.05, rings:4 },
    { name:'Elysia',    desc:'a dreamy garden type',
      note:'as if she grew somewhere you used to picnic',
      hue:342, sat:34, light:76, fullness:0.98, rings:3 },
    { name:'Rosavelle', desc:'a classic peony beauty',
      note:'the one a painter would choose to paint',
      hue:340, sat:44, light:74, fullness:1.00, rings:4 },
    { name:'Vivienne',  desc:'lively and blooming perfectly',
      note:'caught at her happiest moment',
      hue:343, sat:42, light:80, fullness:1.05, rings:4 },
    { name:'Aurielle',  desc:'glowing, soft pink',
      note:'lit from inside like a small lamp',
      hue:350, sat:36, light:84, fullness:0.95, rings:3 },
    { name:'Celestia',  desc:'looks expensive, somehow',
      note:'wears cream like she owns the season',
      hue:30,  sat:20, light:88, fullness:1.00, rings:4 },
    { name:'Fiora',     desc:'very "flower fairy" energy',
      note:'the one you swear you saw blink',
      hue:346, sat:40, light:82, fullness:0.95, rings:3 },
    { name:'Isabeau',   desc:'elegant and layered',
      note:'every petal in its own quiet sentence',
      hue:340, sat:38, light:76, fullness:1.05, rings:5 },
    { name:'Violette',  desc:'shy, with folded petals',
      note:'still deciding whether to bloom',
      hue:332, sat:32, light:78, fullness:0.88, rings:3 },
    { name:'Elowen',    desc:'a soft but strong bloom',
      note:'quietly held it together for the others',
      hue:344, sat:42, light:75, fullness:1.00, rings:4 },
    { name:'Evangeline',desc:'the last one, feels poetic, like a goodbye flower',
      note:'wilted gently. still loved the same.',
      hue:25,  sat:20, light:74, fullness:0.85, rings:3, wilted:true },
  ];

  // Render an SVG peony from a spec. The flower is built from concentric
  // rings of ellipses rotated around the center, simple primitives only.
  function makePeonySVG(p, idx){
    const cx = 100, cy = 100;
    const baseColor    = `hsl(${p.hue}, ${p.sat}%, ${p.light}%)`;
    const deepColor    = `hsl(${p.hue}, ${Math.max(p.sat-8,5)}%, ${Math.max(p.light-18,28)}%)`;
    const lightColor   = `hsl(${p.hue}, ${Math.max(p.sat-12,5)}%, ${Math.min(p.light+8,96)}%)`;
    const centerColor  = p.wilted ? `hsl(35, 25%, 50%)` : `hsl(${p.hue}, ${Math.max(p.sat-2,15)}%, ${Math.max(p.light-30,32)}%)`;
    const dotColor     = p.wilted ? `hsl(35, 28%, 38%)` : `hsl(40, 50%, 45%)`;
    const f = p.fullness;
    const wilt = p.wilted ? 1 : 0;
    const seed = idx * 31;

    const gradId = `g${idx}`;
    const gradInner = `gi${idx}`;

    const petals = [];

    // Outer ring (largest petals)
    if(p.rings >= 1){
      const N = 8;
      for(let i=0;i<N;i++){
        const angle = (360/N)*i + (seed % 9);
        const rx = 22 * f;
        const ry = 38 * f;
        const dy = 38 - wilt*4;
        petals.push(`<ellipse cx="${cx}" cy="${cy-dy}" rx="${rx}" ry="${ry}" fill="url(#${gradId})" opacity="${0.78 - wilt*0.15}" transform="rotate(${angle} ${cx} ${cy})"/>`);
      }
    }
    // Middle ring
    if(p.rings >= 2){
      const N = 8;
      for(let i=0;i<N;i++){
        const angle = (360/N)*i + 22 + (seed % 7);
        const rx = 17 * f;
        const ry = 30 * f;
        const dy = 28 - wilt*3;
        petals.push(`<ellipse cx="${cx}" cy="${cy-dy}" rx="${rx}" ry="${ry}" fill="url(#${gradInner})" opacity="${0.88 - wilt*0.12}" transform="rotate(${angle} ${cx} ${cy})"/>`);
      }
    }
    // Inner ring
    if(p.rings >= 3){
      const N = 6;
      for(let i=0;i<N;i++){
        const angle = (360/N)*i + ((seed*3) % 11);
        const rx = 12 * f;
        const ry = 22 * f;
        const dy = 18;
        petals.push(`<ellipse cx="${cx}" cy="${cy-dy}" rx="${rx}" ry="${ry}" fill="url(#${gradInner})" opacity="${0.95 - wilt*0.08}" transform="rotate(${angle} ${cx} ${cy})"/>`);
      }
    }
    // Crown ring (for very full ones)
    if(p.rings >= 4){
      const N = 6;
      for(let i=0;i<N;i++){
        const angle = (360/N)*i + 30;
        const rx = 8 * f;
        const ry = 14 * f;
        petals.push(`<ellipse cx="${cx}" cy="${cy-10}" rx="${rx}" ry="${ry}" fill="${lightColor}" opacity="${0.92}" transform="rotate(${angle} ${cx} ${cy})"/>`);
      }
    }
    // The very heart (densest)
    if(p.rings >= 5){
      const N = 5;
      for(let i=0;i<N;i++){
        const angle = (360/N)*i + 18;
        const rx = 6 * f;
        const ry = 10 * f;
        petals.push(`<ellipse cx="${cx}" cy="${cy-4}" rx="${rx}" ry="${ry}" fill="${lightColor}" opacity="0.95" transform="rotate(${angle} ${cx} ${cy})"/>`);
      }
    }

    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="peony-svg" aria-hidden="true">
        <defs>
          <radialGradient id="${gradId}" cx="50%" cy="50%" r="55%">
            <stop offset="0%"  stop-color="${baseColor}"/>
            <stop offset="100%" stop-color="${deepColor}"/>
          </radialGradient>
          <radialGradient id="${gradInner}" cx="50%" cy="40%" r="55%">
            <stop offset="0%"  stop-color="${lightColor}"/>
            <stop offset="100%" stop-color="${baseColor}"/>
          </radialGradient>
        </defs>
        <g>${petals.join('')}</g>
        <circle cx="${cx}" cy="${cy}" r="${10*f}" fill="${centerColor}" opacity="0.85"/>
        <circle cx="${cx}" cy="${cy}" r="${6*f}" fill="${dotColor}" opacity="0.75"/>
      </svg>
    `;
  }

  // Zigzag position: row 1 = 1..5 L→R, row 2 = 6..10 R→L, row 3 = 11..15 L→R
  function gridCoords(i /* 0-based */){
    const row = Math.floor(i / 5);            // 0..2
    const col = (row % 2 === 0)
      ? (i % 5)                                // L→R
      : (4 - (i % 5));                         // R→L
    return { row: row + 1, col: col + 1 };
  }

  function build(){
    const grid = document.getElementById('bouquet-grid');
    const detail = document.getElementById('peony-detail');
    if(!grid || !detail) return;

    // Cells
    PEONIES.forEach((p, i) => {
      const { row, col } = gridCoords(i);
      const cell = document.createElement('button');
      cell.className = 'peony-cell' + (p.wilted ? ' wilted' : '');
      cell.style.gridRow    = row;
      cell.style.gridColumn = col;
      cell.setAttribute('data-idx', i);
      cell.setAttribute('aria-label', `${p.name}, ${p.desc}`);
      cell.innerHTML = `
        <span class="peony-num">${i+1}</span>
        ${makePeonySVG(p, i)}
      `;
      cell.addEventListener('mouseenter', () => focusPeony(i));
      cell.addEventListener('focus',      () => focusPeony(i));
      cell.addEventListener('click',      () => focusPeony(i, true));
      grid.appendChild(cell);
    });

    // Auto-focus the wilted one first so the story registers immediately…
    // …actually, no. Open with Liora, the beginning.
    focusPeony(0);
  }

  let activeIdx = -1;
  function focusPeony(i, clicked){
    if(i === activeIdx && !clicked) return;
    activeIdx = i;
    const p = PEONIES[i];

    document.querySelectorAll('.peony-cell').forEach((c, idx) => {
      c.classList.toggle('active', idx === i);
    });

    const detail = document.getElementById('peony-detail');
    if(!detail) return;
    const nameHtml = p.wilted
      ? `<em>${p.name}</em>`
      : p.name;
    detail.innerHTML = `
      <div class="pd-num">No. ${String(i+1).padStart(2,'0')} of 15</div>
      <h3 class="pd-name">${nameHtml}</h3>
      <p class="pd-desc">${p.desc}</p>
      <div class="pd-note">${p.note}</div>
      <div class="pd-trail">${p.wilted ? 'wilted, gently' : 'still blooming'}</div>
    `;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  } else { build(); }

})();
