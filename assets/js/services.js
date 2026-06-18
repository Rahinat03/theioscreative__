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

    // ── iOS card stack — scroll-driven reveal/hide (mobile) ─────
    (function initCardStack() {
        var mq        = window.matchMedia('(max-width: 968px)');
        var panels    = document.querySelector('.service-panels');
        if (!panels) return;

        var cards     = Array.from(panels.querySelectorAll(':scope > .sp-card'));
        if (cards.length < 3) return;

        var expandBtn = null;
        var scrollObs = null;

        // ── Collapse into stack (instant — no transition) ────────
        function buildStack() {
            cards.forEach(function(c) { c.removeAttribute('style'); });
            panels.classList.remove('stack-init', 'stack-open');

            void panels.offsetHeight; // flush reflow before measuring

            var h0 = cards[0].offsetHeight;
            var h1 = cards[1].offsetHeight;

            cards[0].style.cssText = 'position:relative;z-index:3;';
            cards[1].style.cssText =
                'position:relative;z-index:2;' +
                'margin-top:-' + (h0 - 20) + 'px;' +
                'margin-left:0.4rem;margin-right:0.4rem;' +
                'transform:scale(0.96);transform-origin:top center;';
            cards[2].style.cssText =
                'position:relative;z-index:1;' +
                'margin-top:-' + (h1 - 12) + 'px;' +
                'margin-left:0.8rem;margin-right:0.8rem;' +
                'transform:scale(0.92);transform-origin:top center;';

            panels.classList.add('stack-init');

            // Show or create the expand button
            if (expandBtn) {
                expandBtn.style.display = '';
                expandBtn.setAttribute('aria-expanded', 'false');
                if (!expandBtn.isConnected) {
                    panels.insertAdjacentElement('afterend', expandBtn);
                }
            } else {
                expandBtn = document.createElement('button');
                expandBtn.className = 'stack-expand-btn';
                expandBtn.setAttribute('aria-expanded', 'false');
                expandBtn.setAttribute('aria-label', 'View all services');
                expandBtn.innerHTML =
                    'View All Services' +
                    '&nbsp;<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
                    ' stroke-width="2.5" width="14" height="14" aria-hidden="true">' +
                    '<polyline points="6 9 12 15 18 9"/></svg>';
                panels.insertAdjacentElement('afterend', expandBtn);
                expandBtn.addEventListener('click', openStack);
            }
        }

        // ── Fan cards out (animated via CSS transition) ──────────
        function openStack() {
            if (!panels.classList.contains('stack-init')) return;

            panels.classList.remove('stack-init');
            panels.classList.add('stack-open');

            cards[0].style.position = '';
            cards[0].style.zIndex   = '';

            var props = ['marginTop','marginLeft','marginRight','transform','transformOrigin','zIndex','position'];
            props.forEach(function(p) {
                cards[1].style[p] = '';
                cards[2].style[p] = '';
            });

            if (expandBtn) {
                expandBtn.setAttribute('aria-expanded', 'true');
                expandBtn.style.display = 'none';
            }
        }

        // ── Scroll observer: reveal on scroll down, re-stack on scroll up ──
        function setupObserver() {
            if (scrollObs) scrollObs.disconnect();

            scrollObs = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                        // Stack scrolled 30 % into view → fan out
                        openStack();
                    } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                        // Fully out of view AND element is still below the viewport
                        // = user scrolled back up above the section → re-stack
                        buildStack();
                    }
                    // When scrolling PAST (top < 0) leave the cards expanded
                });
            }, { threshold: [0, 0.3] });

            scrollObs.observe(panels);
        }

        // ── Clean up all stack state ─────────────────────────────
        function destroyStack() {
            if (scrollObs) { scrollObs.disconnect(); scrollObs = null; }
            panels.classList.remove('stack-init', 'stack-open');
            cards.forEach(function(c) { c.removeAttribute('style'); });
            if (expandBtn) { expandBtn.remove(); expandBtn = null; }
        }

        // Tapping the stack also expands it (belt-and-braces)
        panels.addEventListener('click', function() {
            if (panels.classList.contains('stack-init')) openStack();
        });

        if (mq.matches) { buildStack(); setupObserver(); }

        mq.addEventListener('change', function(e) {
            if (e.matches) { buildStack(); setupObserver(); }
            else            { destroyStack(); }
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
