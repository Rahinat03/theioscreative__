// ── Theios Creative – Global JS ─────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Page Transition ───────────────────────────────────────────
  const ptOverlay = document.getElementById('pageTransition');
  if (ptOverlay) {
    // Slide out on page load
    ptOverlay.classList.add('slide-out');
    ptOverlay.addEventListener('animationend', function handler() {
      ptOverlay.classList.remove('slide-out');
      ptOverlay.removeEventListener('animationend', handler);
    });

    // Intercept internal link clicks
    document.querySelectorAll('a[href]').forEach(function(link) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('http') ||
          link.getAttribute('target') === '_blank') return;
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const dest = href;
        ptOverlay.classList.add('slide-in');
        ptOverlay.addEventListener('animationend', function handler() {
          ptOverlay.removeEventListener('animationend', handler);
          window.location.href = dest;
        });
      });
    });
  }

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
    const links = navLinks.querySelectorAll(':scope > li > a');

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

  // ── Custom Cursor ─────────────────────────────────────────────
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotX = mouseX;
      dotY = mouseY;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top  = dotY + 'px';
    });

    (function animRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animRing);
    })();

    const interactives = document.querySelectorAll('a, button, [role="button"], .orbit-card, .portfolio-item, .team-card, .service-card, input, textarea, select');
    interactives.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', function() {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });

    document.addEventListener('mousedown', function() {
      cursorDot.classList.add('clicking');
      cursorRing.classList.add('clicking');
    });
    document.addEventListener('mouseup', function() {
      cursorDot.classList.remove('clicking');
      cursorRing.classList.remove('clicking');
    });

    document.addEventListener('mouseleave', function() {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  // ── 3D Card Tilt ──────────────────────────────────────────────
  const tiltCards = document.querySelectorAll('.service-card, .portfolio-item, .sp-card, .phil-card');

  tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -7;
      const rotY = ((x - cx) / cx) *  7;
      card.style.transform = 'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(6px)';
      // Edge glow
      const glowX = (x / rect.width)  * 100;
      const glowY = (y / rect.height) * 100;
      card.style.backgroundImage = 'radial-gradient(circle at ' + glowX + '% ' + glowY + '%, rgba(78,205,196,0.07) 0%, transparent 65%)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      card.style.backgroundImage = '';
      card.style.transition = 'transform 0.5s ease, background-image 0.5s ease';
      setTimeout(function() { card.style.transition = ''; }, 500);
    });
  });

  // ── Typewriter Effect on Hero H1 ─────────────────────────────
  const heroH1 = document.querySelector('.hero-headline, .page-hero h1, .contact-hero h1');
  if (heroH1) {
    heroH1.classList.add('typewriter-heading');
    // Insert a cursor element after the heading
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = '|';
    heroH1.insertAdjacentElement('afterend', cursor);
    // Remove cursor after 3.5 seconds
    setTimeout(function() {
      cursor.style.opacity = '0';
      cursor.style.transition = 'opacity 0.5s ease';
      setTimeout(function() { cursor.remove(); }, 500);
    }, 3500);
  }

  // ── Magnetic Buttons ─────────────────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn-accent, .btn-primary').forEach(function(btn) {
      var strength = 0.3;
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width  / 2);
        var y = e.clientY - (rect.top  + rect.height / 2);
        btn.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.45s cubic-bezier(0.23,1,0.32,1)';
        setTimeout(function() { btn.style.transition = ''; }, 450);
      });
    });
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
