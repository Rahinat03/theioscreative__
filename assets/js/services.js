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
