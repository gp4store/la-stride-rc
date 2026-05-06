  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Gallery: auto-scroll + manual controls
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const pauseBtn = document.getElementById('galleryPause');
  const pauseIcon = document.getElementById('galleryPauseIcon');

  if (track && prevBtn && nextBtn && pauseBtn) {
    let isPaused = false;
    let isHovering = false;
    const SCROLL_SPEED = 1; // pixels per tick
    const TICK_MS = 25;

    const getCardWidth = () => {
      const card = track.querySelector('.gallery-item');
      if (!card) return 400;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    };

    const playIconSVG = '<polygon points="6 4 20 12 6 20 6 4" fill="currentColor"/>';
    const pauseIconSVG = '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>';

    const setPaused = (paused) => {
      isPaused = paused;
      pauseIcon.innerHTML = paused ? playIconSVG : pauseIconSVG;
      pauseBtn.setAttribute('aria-label', paused ? 'Resume auto-scroll' : 'Pause auto-scroll');
    };

    pauseBtn.addEventListener('click', () => setPaused(!isPaused));

    // Manual nav: pause auto-scroll and step one card
    const manualScroll = (dir) => {
      setPaused(true);
      track.scrollBy({ left: dir * getCardWidth(), behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', () => manualScroll(-1));
    nextBtn.addEventListener('click', () => manualScroll(1));

    // Pause on hover for readability
    track.addEventListener('mouseenter', () => { isHovering = true; });
    track.addEventListener('mouseleave', () => { isHovering = false; });

    // Auto-scroll loop, with seamless wrap to start
    setInterval(() => {
      if (isPaused || isHovering) return;
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) {
        track.scrollTo({ left: 0, behavior: 'auto' });
      } else {
        track.scrollLeft += SCROLL_SPEED;
      }
    }, TICK_MS);
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
