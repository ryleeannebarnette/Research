// ---------------------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('nav.links');
  if(toggle && links){
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // mark active nav link
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.links a').forEach(a => {
    if(a.getAttribute('href') === here) a.classList.add('active');
  });
});

// ---------------------------------------------------------------------------
// Crystal lattice canvas — animated nodes + bonds behind the hero
// ---------------------------------------------------------------------------
function initLattice(canvasId){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, points = [];
  const SPACING = 84;

  function resize(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    buildLattice();
  }

  function buildLattice(){
    points = [];
    const cols = Math.ceil(w / (SPACING * devicePixelRatio)) + 2;
    const rows = Math.ceil(h / (SPACING * devicePixelRatio)) + 2;
    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        const offset = (j % 2) * (SPACING * devicePixelRatio / 2);
        points.push({
          x: i * SPACING * devicePixelRatio + offset,
          y: j * (SPACING * devicePixelRatio * 0.87),
          baseX: i * SPACING * devicePixelRatio + offset,
          baseY: j * (SPACING * devicePixelRatio * 0.87),
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.4
        });
      }
    }
  }

  let t = 0;
  function draw(){
    ctx.clearRect(0, 0, w, h);
    t += reduceMotion ? 0 : 0.006;

    for(const p of points){
      p.x = p.baseX + Math.sin(t * p.speed + p.phase) * 6 * devicePixelRatio;
      p.y = p.baseY + Math.cos(t * p.speed + p.phase) * 6 * devicePixelRatio;
    }

    // bonds
    ctx.lineWidth = 1;
    for(let i = 0; i < points.length; i++){
      for(let j = i + 1; j < points.length; j++){
        const a = points[i], b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = SPACING * devicePixelRatio * 1.05;
        if(dist < maxDist){
          const alpha = (1 - dist / maxDist) * 0.14;
          ctx.strokeStyle = `rgba(82,216,224,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // nodes
    for(const p of points){
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(169,139,255,0.35)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ---------------------------------------------------------------------------
// Entangled photon-triplet demo (used on research.html)
// Click "entangle" -> three photons synchronize color + pulse in lockstep
// ---------------------------------------------------------------------------
function initEntangleDemo(){
  const btn = document.getElementById('entangle-btn');
  const photons = document.querySelectorAll('.photon');
  const status = document.getElementById('entangle-status');
  if(!btn || !photons.length) return;

  let entangled = false;

  btn.addEventListener('click', () => {
    entangled = !entangled;
    photons.forEach(p => p.classList.toggle('entangled', entangled));
    btn.textContent = entangled ? 'de-correlate photons' : 'entangle photons';
    if(status){
      status.textContent = entangled
        ? 'state: |ψ⟩ correlated — measuring one sets the other two instantly'
        : 'state: independent, uncorrelated photons';
    }
  });
}

// ---------------------------------------------------------------------------
// Expandable methodology pipeline (research.html)
// ---------------------------------------------------------------------------
function initPipeline(){
  const steps = document.querySelectorAll('.pipe-step');
  steps.forEach(step => {
    const head = step.querySelector('.pipe-head');
    head?.addEventListener('click', () => {
      const isOpen = step.classList.contains('open');
      steps.forEach(s => s.classList.remove('open'));
      if(!isOpen) step.classList.add('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLattice('lattice-canvas');
  initEntangleDemo();
  initPipeline();
});
