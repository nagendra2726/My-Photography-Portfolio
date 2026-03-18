/* ============================================================
   script.js — Naini Stories
   Features: Loader · Nav scroll · Mobile menu · Reveal
             animations · Back-to-top · Active nav link
             · "Coming soon" toast · Ripple effects
   ============================================================ */
'use strict';

/* ── HELPERS ────────────────────────────────────────────────── */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ══════════════════════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════════════════════ */
const loader = $('loader');

window.addEventListener('load', () => {
  // Give the progress bar animation time to finish (1.1s) + small buffer
  setTimeout(() => {
    loader.classList.add('hidden');
    revealVisible(); // kick off initial reveals
  }, 1300);
});

/* ══════════════════════════════════════════════════════════════
   2. HEADER — scroll effect
══════════════════════════════════════════════════════════════ */
const header = $('site-header');

window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  const y = window.scrollY;

  // Sticky header shadow
  header.classList.toggle('scrolled', y > 40);

  // Back-to-top button
  backToTop.classList.toggle('visible', y > 400);

  // Active nav link highlight
  // Handled by HTML active class
}

/* ══════════════════════════════════════════════════════════════
   3. MOBILE MENU
══════════════════════════════════════════════════════════════ */
const hamburger  = $('hamburger');
const mobileMenu = $('mobile-menu');
const menuOverlay = $('mobile-menu-overlay');

function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  if (menuOverlay) menuOverlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  if (menuOverlay) menuOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

if (menuOverlay) {
  menuOverlay.addEventListener('click', closeMenu);
}

// Close on any mobile link click
$$('.mob-link, .mob-instagram').forEach(el => {
  el.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMenu();
});

/* ══════════════════════════════════════════════════════════════
   6. SCROLL-REVEAL (IntersectionObserver)
══════════════════════════════════════════════════════════════ */
const revealEls = $$('.reveal');

function revealVisible() {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) el.classList.add('visible');
  });
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible')); // fallback
}

/* ══════════════════════════════════════════════════════════════
   7. BACK TO TOP
══════════════════════════════════════════════════════════════ */
const backToTop = $('back-to-top');

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════════════════════════════
   8. COMING SOON TOAST
══════════════════════════════════════════════════════════════ */
// Create toast element
const toast = document.createElement('div');
toast.id = 'toast-notification';
toast.setAttribute('role', 'alert');
toast.setAttribute('aria-live', 'polite');
Object.assign(toast.style, {
  position: 'fixed',
  bottom: '32px',
  left: '50%',
  transform: 'translateX(-50%) translateY(90px)',
  background: 'rgba(26,26,26,0.93)',
  color: '#fff',
  padding: '12px 26px',
  borderRadius: '99px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.88rem',
  fontWeight: '500',
  letterSpacing: '0.02em',
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
  opacity: '0',
  zIndex: '9998',
  whiteSpace: 'nowrap',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.1)',
  pointerEvents: 'none',
});
document.body.appendChild(toast);

let toastTimer = null;

function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';
  toast.style.pointerEvents = 'auto';
  toastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(90px)';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
  }, 2600);
}

// Trigger toast on "coming soon" links
[].forEach(id => {
  const el = $(id);
  if (!el) return;
  el.addEventListener('click', e => {
    e.preventDefault();
    const name = el.querySelector('strong')?.textContent || 'This page';
    showToast(`✨ ${name} — Coming soon!`);
  });
});

// Collab link — scroll to contact instead
const collabLink = $('link-collab');
if (collabLink) {
  collabLink.addEventListener('click', e => {
    e.preventDefault();
    const contact = $('contact');
    if (contact) {
      const top = contact.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   9. RIPPLE EFFECT on interactive elements
══════════════════════════════════════════════════════════════ */
// Inject keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    from { transform: scale(0); opacity: 0.35; }
    to   { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

$$('.btn, .contact-card, .link-card').forEach(el => {
  el.addEventListener('click', function (e) {
    // Skip hash links handled elsewhere
    const href = this.getAttribute('href');
    if (href === '#') return; // already handled by specific listeners

    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.6;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');

    Object.assign(ripple.style, {
      position: 'absolute',
      borderRadius: '50%',
      width:  `${size}px`,
      height: `${size}px`,
      left:   `${x}px`,
      top:    `${y}px`,
      background: 'rgba(255,255,255,0.20)',
      animation: 'rippleAnim 0.6s ease-out forwards',
      pointerEvents: 'none',
      zIndex: '5',
    });

    const pos = window.getComputedStyle(this).position;
    if (!['relative','absolute','fixed','sticky'].includes(pos)) {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ══════════════════════════════════════════════════════════════
   10. HERO IMAGE — subtle parallax on mouse move (desktop)
══════════════════════════════════════════════════════════════ */
const heroImg = $('hero-main-img');
if (heroImg && window.matchMedia('(min-width: 900px)').matches) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) *  8;
    heroImg.style.transform = `scale(1.03) translate(${x}px, ${y}px)`;
  });
  document.addEventListener('mouseleave', () => {
    heroImg.style.transform = '';
  });
}

/* ══════════════════════════════════════════════════════════════
   11. IMAGE FALLBACKS — curated Unsplash images per section
══════════════════════════════════════════════════════════════ */
const fallbackMap = {
  'image0.png': 'https://images.unsplash.com/photo-1519741347686-c1e331fcb54a?w=900&q=85&auto=format&fit=crop',
  'image1.jpg': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&q=85&auto=format&fit=crop',
  'image2.jpg': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=700&q=85&auto=format&fit=crop',
  'image3.jpg': 'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=700&q=85&auto=format&fit=crop',
  'logo.png':   '', // hide if logo missing — text-only is fine
};

$$('img[src]').forEach(img => {
  const fname = img.getAttribute('src');
  if (fallbackMap.hasOwnProperty(fname)) {
    img.addEventListener('error', function () {
      const fb = fallbackMap[fname];
      if (fb) { this.src = fb; }
      else     { this.style.display = 'none'; }
      this.onerror = null;
    });
  }
});
