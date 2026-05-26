(function() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;

  // Progress bar
  let progress = document.querySelector('.progress');
  if (!progress) {
    progress = document.createElement('div');
    progress.className = 'progress';
    document.body.appendChild(progress);
  }

  // Nav help overlay
  let help = document.querySelector('.nav-help');
  if (!help) {
    help = document.createElement('div');
    help.className = 'nav-help';
    help.innerHTML = '<kbd>←</kbd> <kbd>→</kbd> navigér &nbsp; <kbd>F</kbd> fullskjerm &nbsp; <kbd>Home</kbd> start';
    document.body.appendChild(help);
  }

  // Restore from URL hash
  const m = window.location.hash.match(/#(\d+)/);
  if (m) current = clamp(parseInt(m[1]) - 1, 0, total - 1);

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function updateFooterCounter(idx) {
    const slide = slides[idx];
    const counter = slide.querySelector('.counter');
    if (counter) {
      const n = String(idx + 1).padStart(2, '0');
      const t = String(total).padStart(2, '0');
      counter.textContent = `${n} / ${t}`;
    }
  }

  function go(idx) {
    current = clamp(idx, 0, total - 1);
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    progress.style.width = ((current + 1) / total * 100) + '%';
    window.location.hash = String(current + 1);
    updateFooterCounter(current);
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(total - 1);
        break;
      case 'f':
      case 'F':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen();
        }
        break;
      case '?':
        help.classList.toggle('visible');
        break;
    }
  });

  // Click navigation (avoid links)
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, kbd, code, .code')) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.65) next();
    else if (x < 0.35) prev();
  });

  // Init counters
  slides.forEach((_, i) => updateFooterCounter(i));

  // Show help briefly
  help.classList.add('visible');
  setTimeout(() => help.classList.remove('visible'), 3500);

  go(current);
})();
