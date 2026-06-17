// ── Theios Creative – Global JS ─────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ─────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Desktop nav — glass hover pill ──────────────────────────
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const links = navLinks.querySelectorAll('a');

    const movePill = (target) => {
      const navRect  = navLinks.getBoundingClientRect();
      const linkRect = target.getBoundingClientRect();
      navLinks.style.setProperty('--pill-left',  (linkRect.left  - navRect.left) + 'px');
      navLinks.style.setProperty('--pill-width', linkRect.width + 'px');
    };

    links.forEach(link => {
      link.addEventListener('mouseenter', () => movePill(link));
    });

    const pillStyle = document.createElement('style');
    pillStyle.textContent = `
      .nav-links::before {
        left: var(--pill-left, 0px) !important;
        width: var(--pill-width, 0px) !important;
      }
    `;
    document.head.appendChild(pillStyle);
  }

  // ── Mobile nav toggle ────────────────────────────────────────
  const toggle     = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  let backdrop = document.getElementById('mobile-menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'mobile-menu-backdrop';
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  if (toggle && mobileMenu) {

    const openMenu = () => {
      toggle.classList.add('open');
      mobileMenu.classList.add('open');
      backdrop.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      navbar && navbar.classList.add('menu-open');
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 80);
    };

    const closeMenu = () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      backdrop.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      navbar && navbar.classList.remove('menu-open');
      toggle.focus();
    };

    toggle.addEventListener('click', () => {
      toggle.classList.contains('open') ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.classList.contains('open')) closeMenu();
    });

    const focusable      = mobileMenu.querySelectorAll('a, button');
    const firstFocusable = focusable[0];
    const lastFocusable  = focusable[focusable.length - 1];

    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && toggle.classList.contains('open')) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  // ── Scroll reveal ─────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Count-up stats animation ──────────────────────────────────
  // Uses IntersectionObserver so the count fires when stats scroll into view.
  // Supports data-count (target number), data-suffix (e.g. "+" or "%"),
  // and data-prefix (e.g. "$") on each .stat-num element.
  const countUpEls = document.querySelectorAll('.stat-num[data-count]');

  if (countUpEls.length) {

    /**
     * Animate a single counter element from 0 → target.
     * Uses a smooth easing curve so it decelerates as it approaches the end.
     * @param {HTMLElement} el
     */
    const animateCounter = (el) => {
      const target   = parseInt(el.dataset.count, 10);
      const suffix   = el.dataset.suffix ?? '';
      const prefix   = el.dataset.prefix ?? '';
      const duration = target <= 10 ? 1200 : 1800;
      const startTime = performance.now();

      // Add CSS animation class for the pop + glow
      el.classList.add('counting');
      // Remove it after the CSS animation duration (450ms)
      setTimeout(() => el.classList.remove('counting'), 460);

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current  = Math.round(easeOut(progress) * target);

        el.textContent = prefix + current + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + target + suffix;
        }
      };

      requestAnimationFrame(tick);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small stagger so sibling counters don't all start at the same tick
          const el    = entry.target;
          const index = [...countUpEls].indexOf(el);
          setTimeout(() => animateCounter(el), index * 160);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 }); // fire when at least half the stat is visible

    countUpEls.forEach(el => statsObserver.observe(el));
  }

  // ── Active nav link (desktop + mobile) ───────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const desktopCtaButton = document.querySelector('.nav-cta');
  if (desktopCtaButton) {
    const href = desktopCtaButton.getAttribute('href');
    if (href === currentPage || (currentPage === 'contact.html' && href === 'contact.html')) {
      desktopCtaButton.classList.add('active');
    }
  }

  document.querySelectorAll('.mobile-menu a:not(.btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const mobileCtaButton = document.querySelector('.mobile-menu .btn');
  if (mobileCtaButton) {
    const href = mobileCtaButton.getAttribute('href');
    if (href === currentPage || (currentPage === 'contact.html' && href === 'contact.html')) {
      mobileCtaButton.classList.add('active');
    }
  }

});

/* ================================================================
   ORBIT UNIVERSE — Parallax, Connectors, Hover Effects
   ================================================================ */
(function initOrbitUniverse() {
  const universe = document.getElementById('orbitUniverse');
  const system   = document.getElementById('orbitSystem');
  const svgEl    = document.getElementById('orbitConnectors');
  if (!universe || !system) return;

  /* ── Mouse Parallax ──────────────────────────────────────── */
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  const MAX_SHIFT = 18;

  document.addEventListener('mousemove', function(e) {
    const r  = universe.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    targetX = ((e.clientX - cx) / r.width)  * MAX_SHIFT;
    targetY = ((e.clientY - cy) / r.height) * MAX_SHIFT;
  });

  /* reset on leave */
  universe.addEventListener('mouseleave', function() {
    targetX = 0; targetY = 0;
  });

  /* ── Lerp helper ─────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── Connector lines ─────────────────────────────────────── */
  function drawConnectors() {
    if (!svgEl) return;
    var cards   = system.querySelectorAll('.orbit-card');
    var sysRect = system.getBoundingClientRect();
    var cx = sysRect.width  / 2;
    var cy = sysRect.height / 2;
    var html = '';
    for (var i = 0; i < cards.length; i++) {
      var cr   = cards[i].getBoundingClientRect();
      var cardCx = cr.left - sysRect.left + cr.width  / 2;
      var cardCy = cr.top  - sysRect.top  + cr.height / 2;
      html += '<line x1="' + cx + '" y1="' + cy +
              '" x2="' + cardCx + '" y2="' + cardCy +
              '" stroke="rgba(78,205,196,0.07)" stroke-width="1"' +
              ' stroke-dasharray="3 7"/>';
    }
    svgEl.innerHTML = html;
  }

  /* ── Animation Loop ──────────────────────────────────────── */
  function tick() {
    curX = lerp(curX, targetX, 0.055);
    curY = lerp(curY, targetY, 0.055);
    system.style.transform = 'translate(' + curX + 'px, ' + curY + 'px)';
    drawConnectors();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ── Card Hover — ring emphasis ──────────────────────────── */
  var cards = system.querySelectorAll('.orbit-card');
  for (var i = 0; i < cards.length; i++) {
    (function(card) {
      var ring = card.closest('.orbit-ring');
      card.addEventListener('mouseenter', function() {
        if (ring) ring.classList.add('ring-active');
      });
      card.addEventListener('mouseleave', function() {
        if (ring) ring.classList.remove('ring-active');
      });
    })(cards[i]);
  }

})();
