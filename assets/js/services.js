// ── Services Page JS – Portfolio Filter ─────────────────────

document.addEventListener('DOMContentLoaded', () => {

    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.pf-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length && portfolioItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const filter = btn.dataset.filter;

                portfolioItems.forEach(item => {
                    const categories = item.dataset.category?.split(' ') || [];
                    if (filter === 'all' || categories.includes(filter)) {
                        item.classList.remove('hidden');
                        item.style.animation = 'fadeUp 0.5s ease forwards';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

  // ── Case Study Modal ─────────────────────────────────────────
  const caseStudies = {
    'portfolio-brunchbox': {
      img: 'assets/images/portfolio_brunchbox.png',
      alt: 'The Brunch Box branding by Theios Creative',
      category: 'Branding & Identity',
      title: 'The Brunch Box',
      desc: 'A luxury brunch delivery brand built from scratch. The Brunch Box needed a complete identity that communicated premium quality while staying warm and approachable for its urban customer base.',
      brief: 'Create a full brand identity for a luxury food delivery startup — from naming rationale and logo to packaging and social media assets.',
      deliverables: 'Logo suite, brand colour system, packaging design, social media templates, brand guidelines document.',
      industry: 'Food & Beverage / Delivery',
      result: 'Launched with a cohesive identity across all touchpoints. Brand recognition drove a 40% increase in repeat orders within the first quarter.',
      tags: ['Brand Identity', 'Packaging', 'Logo Design', 'Style Guide', 'Food Delivery']
    },
    'portfolio-roamcrew': {
      img: 'assets/images/portfolio_roamcrew.png',
      alt: 'Roam Crew website by Theios Creative',
      category: 'Web Development & Identity',
      title: 'Roam Crew',
      desc: 'An adventure travel and event curation platform that needed a vibrant online home. Roam Crew curates experiences for young professionals — the site had to feel as energetic as the brand.',
      brief: 'Design and develop a custom website and visual identity system for an adventure travel and event curation company.',
      deliverables: 'Custom website (HTML/CSS/JS), mobile-first responsive design, visual identity, colour palette, typography system.',
      industry: 'Travel & Events',
      result: 'Site launched with a mobile-first design that drove a 3x increase in online event bookings compared to their previous landing page.',
      tags: ['Web Development', 'UI/UX', 'Mobile-First', 'Events', 'Visual Identity']
    },
    'portfolio-ownersown': {
      img: 'assets/images/portfolio_ownersown.png',
      alt: 'Owners Own retail branding by Theios Creative',
      category: 'Brand Identity',
      title: 'Owners Own',
      desc: 'A general merchandise and electronics retailer that needed to project trust and authority. The brand had to work at scale — from in-store signage to product labels and digital ads.',
      brief: 'Develop a bold, scalable brand identity for a general merchandise and electronics retailer with both physical and digital presence.',
      deliverables: 'Logo, brand mark system, colour palette, typography, in-store signage concepts, digital ad templates, social media kit.',
      industry: 'Retail & Electronics',
      result: 'The new brand system was rolled out across the flagship store and online. Customer survey reported a 62% improvement in brand trust perception.',
      tags: ['Branding', 'Retail', 'Signage', 'Logo Design', 'Electronics']
    }
  };

  const backdrop = document.getElementById('csModalBackdrop');
  const closeBtn = document.getElementById('csModalClose');
  const closeBtnAlt = document.getElementById('csModalCloseBtn');

  function openModal(id) {
    const data = caseStudies[id];
    if (!data || !backdrop) return;
    document.getElementById('csModalImg').src = data.img;
    document.getElementById('csModalImg').alt = data.alt;
    document.getElementById('csModalCategory').textContent = data.category;
    document.getElementById('csModalTitle').textContent = data.title;
    document.getElementById('csModalDesc').textContent = data.desc;
    document.getElementById('csModalBrief').textContent = data.brief;
    document.getElementById('csModalDeliverables').textContent = data.deliverables;
    document.getElementById('csModalIndustry').textContent = data.industry;
    document.getElementById('csModalResult').textContent = data.result;
    const tagsEl = document.getElementById('csModalTags');
    tagsEl.innerHTML = data.tags.map(t => '<span>' + t + '</span>').join('');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-item').forEach(function(item) {
    item.addEventListener('click', function() { openModal(item.id); });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(item.id); }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View case study: ' + (item.querySelector('h4')?.textContent || ''));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeBtnAlt) closeBtnAlt.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', function(e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

    // ── iOS card stack — sticky scroll-through reveal (mobile) ──
    (function initCardStack() {
        var STICKY_TOP = 80; // px — clears the fixed nav

        var mq     = window.matchMedia('(max-width: 968px)');
        var panels = document.querySelector('.service-panels');
        if (!panels) return;

        var cards = Array.from(panels.querySelectorAll(':scope > .sp-card'));
        if (cards.length < 3) return;

        var wrapper        = null;
        var scrollListener = null;
        var rafPending     = false;
        var h0, h1, revealedH, revealDist;

        function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
        function lerp(a, b, t)    { return a + (b - a) * clamp(t, 0, 1); }

        // ── Measure cards in their natural revealed layout ───────
        function measureCards() {
            panels.style.cssText = '';
            cards.forEach(function(c) { c.removeAttribute('style'); });
            void panels.offsetHeight;
            h0        = cards[0].offsetHeight;
            h1        = cards[1].offsetHeight;
            revealedH = panels.offsetHeight;
        }

        // ── Drive card positions from scroll progress (0 → 1) ────
        //   progress 0 → 0.5 : card 2 slides out from behind card 1
        //   progress 0.5 → 1 : card 3 slides out from behind card 2
        function applyProgress(p) {
            var p2  = clamp(p / 0.5, 0, 1);
            var p3  = clamp((p - 0.5) / 0.5, 0, 1);

            var mt2 = lerp(-(h0 - 20), 16, p2);
            var s2  = lerp(0.96, 1, p2);
            var ml2 = lerp(0.4, 0, p2);

            var mt3 = lerp(-(h1 - 12), 16, p3);
            var s3  = lerp(0.92, 1, p3);
            var ml3 = lerp(0.8, 0, p3);

            cards[0].style.cssText =
                'position:relative;z-index:3;';
            cards[1].style.cssText =
                'position:relative;z-index:2;' +
                'margin-top:'   + mt2.toFixed(1) + 'px;' +
                'margin-left:'  + ml2.toFixed(3) + 'rem;' +
                'margin-right:' + ml2.toFixed(3) + 'rem;' +
                'transform:scale(' + s2.toFixed(4) + ');transform-origin:top center;';
            cards[2].style.cssText =
                'position:relative;z-index:1;' +
                'margin-top:'   + mt3.toFixed(1) + 'px;' +
                'margin-left:'  + ml3.toFixed(3) + 'rem;' +
                'margin-right:' + ml3.toFixed(3) + 'rem;' +
                'transform:scale(' + s3.toFixed(4) + ');transform-origin:top center;';
        }

        // ── Wrap panels in a scroll-track and make them sticky ───
        function buildScrollJack() {
            if (wrapper) return; // guard: prevent double-wrap on repeated mq changes
            measureCards();
            // ~65 % of viewport height per card reveal, cap at 320 px
            revealDist = Math.round(Math.min(window.innerHeight * 0.65, 320));

            wrapper = document.createElement('div');
            wrapper.className = 'sp-scroll-track';
            panels.parentNode.insertBefore(wrapper, panels);
            wrapper.appendChild(panels);

            // Track height: full revealed height + scroll room for 2 card reveals
            wrapper.style.position = 'relative';
            wrapper.style.height   = (revealedH + revealDist * 2) + 'px';

            panels.style.position = 'sticky';
            panels.style.top      = STICKY_TOP + 'px';

            // Set initial stacked state
            applyProgress(0);

            scrollListener = function() {
                if (rafPending) return;
                rafPending = true;
                requestAnimationFrame(function() {
                    rafPending = false;
                    if (!wrapper) return; // guard: destroyed between scroll event and rAF
                    // Progress 0 when wrapper.top === STICKY_TOP (just became sticky)
                    // Progress 1 after scrolling revealDist*2 past that point
                    var wt = wrapper.getBoundingClientRect().top;
                    applyProgress(clamp((STICKY_TOP - wt) / (revealDist * 2), 0, 1));
                });
            };
            window.addEventListener('scroll', scrollListener, { passive: true });
            scrollListener(); // apply based on current scroll position
        }

        // ── Remove all scroll-jack state ─────────────────────────
        function destroyScrollJack() {
            if (scrollListener) {
                window.removeEventListener('scroll', scrollListener);
                scrollListener = null;
            }
            if (wrapper && wrapper.parentNode) {
                wrapper.parentNode.insertBefore(panels, wrapper);
                wrapper.remove();
            }
            wrapper    = null;
            rafPending = false;
            panels.style.position = '';
            panels.style.top      = '';
            cards.forEach(function(c) { c.removeAttribute('style'); });
        }

        if (mq.matches) { buildScrollJack(); }

        mq.addEventListener('change', function(e) {
            if (e.matches) { buildScrollJack(); }
            else            { destroyScrollJack(); }
        });
    })();

    // Video play click feedback
    document.querySelectorAll('.vc-play').forEach(playBtn => {
        playBtn.addEventListener('click', () => {
            // Placeholder: display a coming soon tooltip
            const card = playBtn.closest('.video-card');
            if (card) {
                const existing = card.querySelector('.vc-coming-soon');
                if (existing) return;
                const tip = document.createElement('div');
                tip.className = 'vc-coming-soon';
                tip.textContent = '🎬 Reel Coming Soon';
                tip.style.cssText = `
          position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          background: rgba(13,31,30,0.9); color:#4ECDC4; font-weight:700;
          font-size:0.85rem; padding:0.75rem 1.5rem; border-radius:50px;
          white-space:nowrap; z-index:10; letter-spacing:0.08em;
          pointer-events:none;
          animation: fadeIn 0.3s ease;
        `;
                const thumb = playBtn.closest('.vc-thumbnail');
                if (thumb) {
                    thumb.style.position = 'relative';
                    thumb.appendChild(tip);
                    setTimeout(() => tip.remove(), 2500);
                }
            }
        });
    });

});
