/* ── Main JS – HDFC Bank Loan Portal ──────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile Nav Toggle ────────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      // Animate hamburger
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // ── Auto-dismiss flash messages ──────────────────────────────────────
  const flashes = document.querySelectorAll('.flash');
  flashes.forEach(flash => {
    setTimeout(() => {
      flash.style.opacity = '0';
      flash.style.transform = 'translateX(100%)';
      flash.style.transition = 'all 0.4s ease';
      setTimeout(() => flash.remove(), 400);
    }, 5000);
  });

  // ── Smooth scroll to anchor ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Intersection Observer – animate elements into view ───────────────
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(
    '.loan-card, .step-card, .trust-item, .stat-card, .application-card, .result-card, .tip-item'
  ).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(el);
  });

  // CSS class to trigger animation
  const style = document.createElement('style');
  style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  // ── Navbar scroll effect ─────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 80) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,51,102,0.15)';
      } else {
        navbar.style.boxShadow = '';
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  // ── Form validation enhancements ─────────────────────────────────────
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('blur', function () {
      if (this.required && !this.value.trim()) {
        this.style.borderColor = 'var(--red)';
      } else {
        this.style.borderColor = '';
      }
    });

    input.addEventListener('input', function () {
      if (this.value.trim()) {
        this.style.borderColor = 'var(--green)';
      }
    });

    input.addEventListener('focus', function () {
      this.style.borderColor = 'var(--navy)';
    });
  });

  // ── Number formatting – add commas as user types ─────────────────────
  function addCommaFormatting(input) {
    input.addEventListener('blur', function () {
      const val = parseFloat(this.value.replace(/,/g, ''));
      if (!isNaN(val)) {
        // Keep raw number for form submission
      }
    });
  }

  document.querySelectorAll('input[name="annual_income"], input[name="loan_amount"]').forEach(addCommaFormatting);

  // ── Loan amount quick select buttons (if present) ────────────────────
  document.querySelectorAll('.quick-amount').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = document.getElementById(this.dataset.target);
      if (target) {
        target.value = this.dataset.value;
        target.dispatchEvent(new Event('input'));
      }
    });
  });

  // ── Ripple effect for buttons ─────────────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        transform: scale(0);
        animation: ripple-anim 0.5s ease-out forwards;
        pointer-events: none;
      `;
      if (getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Ripple keyframe
  if (!document.querySelector('#ripple-style')) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'ripple-style';
    rippleStyle.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(rippleStyle);
  }

  // ── Mobile nav styles ─────────────────────────────────────────────────
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    @media (max-width: 600px) {
      .nav-links.open {
        display: flex !important;
        flex-direction: column;
        position: fixed;
        top: 68px;
        left: 0; right: 0;
        background: white;
        padding: 16px 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        gap: 4px;
        z-index: 999;
        border-top: 3px solid var(--red);
      }
    }
  `;
  document.head.appendChild(mobileStyle);

});
