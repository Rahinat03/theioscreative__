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
