// tweaks.jsx — the in-page Tweaks panel for "A Peony Still Blooming"
// Controls: palette, type pairing, petals on/off, hero motion

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "blush",
  "typePair": "editorial",
  "petals": true,
  "petalDensity": 10,
  "letterTone": "warm"
}/*EDITMODE-END*/;

function PeonyTweaks(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply palette + type to <body> via data attrs so styles.css can swap tokens
  React.useEffect(() => {
    document.body.setAttribute('data-palette', t.palette);
    document.body.setAttribute('data-type',    t.typePair);
    document.body.setAttribute('data-petals',  t.petals ? 'on' : 'off');
    document.body.setAttribute('data-letter-tone', t.letterTone);
  }, [t.palette, t.typePair, t.petals, t.letterTone]);

  // Petal density — re-spawn with new count
  React.useEffect(() => {
    const wrap = document.getElementById('petals');
    if(!wrap) return;
    wrap.innerHTML = '';
    const count = Math.max(0, Math.round(t.petalDensity * (window.innerWidth < 700 ? 0.6 : 1)));
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
  }, [t.petalDensity, t.palette]);

  return (
    <TweaksPanel title="Tweaks">

      <TweakSection label="Palette" />
      <TweakRadio
        label="Mood"
        value={t.palette}
        options={[
          { value:'blush',     label:'Blush' },
          { value:'porcelain', label:'Porcelain' },
          { value:'dusk',      label:'Dusk' },
        ]}
        onChange={(v) => setTweak('palette', v)}
      />

      <TweakSection label="Typography" />
      <TweakSelect
        label="Pairing"
        value={t.typePair}
        options={[
          { value:'editorial', label:'Italiana + Cormorant (editorial)' },
          { value:'modern',    label:'Fraunces + EB Garamond (modern)' },
          { value:'classic',   label:'Playfair + Cormorant (classic)' },
        ]}
        onChange={(v) => setTweak('typePair', v)}
      />

      <TweakSection label="Atmosphere" />
      <TweakToggle
        label="Falling petals"
        value={t.petals}
        onChange={(v) => setTweak('petals', v)}
      />
      <TweakSlider
        label="Petal density"
        value={t.petalDensity}
        min={0} max={30} step={1}
        onChange={(v) => setTweak('petalDensity', v)}
      />

      <TweakSection label="Letters" />
      <TweakRadio
        label="Paper tone"
        value={t.letterTone}
        options={[
          { value:'warm',  label:'Warm' },
          { value:'cream', label:'Cream' },
        ]}
        onChange={(v) => setTweak('letterTone', v)}
      />

    </TweaksPanel>
  );
}

const __tweakRoot = document.createElement('div');
__tweakRoot.id = 'tweak-root';
document.body.appendChild(__tweakRoot);
ReactDOM.createRoot(__tweakRoot).render(<PeonyTweaks />);
