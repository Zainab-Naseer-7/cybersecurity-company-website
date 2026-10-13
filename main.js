/**
 * NEXORA CYBER - Main Application Controller
 * Handles navigation, smooth scrolling, modal dialogs, counters, and form validation
 */

(function () {
  'use strict';

  // --- 1. Navbar Scroll State ---
  const navbar = document.getElementById('mainNavbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- 2. Mobile Drawer Navigation ---
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileClose = document.getElementById('mobileMenuClose');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  function openMobileMenu() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // --- 3. Active Nav Link on Scroll ---
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    navSections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNavigation, { passive: true });

  // --- 4. Modals Controller (Consultation & Case Studies) ---
  const consultationModal = document.getElementById('consultationModal');
  const caseStudyModal = document.getElementById('caseStudyModal');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetModal = this.closest('.modal-backdrop');
      closeModal(targetModal);
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', function (e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Global ESC key listener for modals & drawers
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(m => closeModal(m));
      closeMobileMenu();
    }
  });

  // Trigger buttons for Consultation modal
  const consultationTriggers = document.querySelectorAll('.trigger-consultation');
  consultationTriggers.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(consultationModal);
    });
  });

  // Case study detailed content mapping
  const caseStudyData = {
    'enterprise-network': {
      title: 'Enterprise Network Defense Architecture',
      category: 'Global Financial Institution',
      challenge: 'The enterprise experienced distributed perimeter vulnerabilities across 40+ international regional offices, resulting in latency issues and elevated attack surface exposure.',
      solution: 'Deployed Nexora Zero-Trust SASE architecture with decentralized edge inspection nodes and automated micro-segmentation, replacing legacy VPN concentrators.',
      results: [
        '99.999% network uptime achieved over 18 consecutive months',
        '84% reduction in external attack surface exposure',
        'Sub-1ms inspection latency across global financial transaction pipelines'
      ]
    },
    'cloud-transformation': {
      title: 'Multi-Cloud Security Transformation',
      category: 'SaaS Unicorn Platform',
      challenge: 'Rapid Kubernetes container expansion across AWS and GCP led to identity misconfigurations, unmonitored east-west traffic, and IAM credential drift.',
      solution: 'Implemented Nexora Cloud-Native Application Protection Platform (CNAPP) with continuous infrastructure-as-code (IaC) posture scanning and eBPF kernel runtime security.',
      results: [
        'Over 3,400 security misconfigurations remediated within 72 hours',
        'Real-time runtime container threat containment with zero production impact',
        'Achieved full SOC 2 Type II and ISO 27001 continuous audit readiness'
      ]
    },
    'threat-monitoring': {
      title: 'Autonomous Threat Hunting & Monitoring',
      category: 'Critical Infrastructure & Logistics',
      challenge: 'High alert fatigue in a 24/7 SOC processing over 2.4 million daily events manually, with slow mean-time-to-detect (MTTD) on sophisticated nation-state actors.',
      solution: 'Integrated Nexora Next-Gen SIEM/XDR with autonomous machine-learning correlation engines and automated playbooks for immediate zero-touch threat isolation.',
      results: [
        'Mean time to detect (MTTD) decreased from 4.2 hours to under 45 seconds',
        '91% decrease in false positive alerts, dramatically reducing analyst fatigue',
        'Neutralized 14 advanced persistent threat (APT) reconnaissance campaigns'
      ]
    }
  };

  const caseStudyTriggers = document.querySelectorAll('.trigger-case-study');
  caseStudyTriggers.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const studyKey = this.getAttribute('data-study');
      const data = caseStudyData[studyKey];

      if (data && caseStudyModal) {
        document.getElementById('caseModalCategory').textContent = data.category;
        document.getElementById('caseModalTitle').textContent = data.title;
        document.getElementById('caseModalChallenge').textContent = data.challenge;
        document.getElementById('caseModalSolution').textContent = data.solution;

        const resultsList = document.getElementById('caseModalResults');
        resultsList.innerHTML = '';
        data.results.forEach(res => {
          const li = document.createElement('li');
          li.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${res}</span>`;
          resultsList.appendChild(li);
        });

        openModal(caseStudyModal);
      }
    });
  });

  // --- 5. Contact Form Validation & Demo Submission ---
  const contactForm = document.getElementById('contactForm');
  const modalConsultForm = document.getElementById('modalConsultForm');

  function setupFormValidation(formElement) {
    if (!formElement) return;

    formElement.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Inputs to validate
      const nameInput = formElement.querySelector('[name="name"]');
      const emailInput = formElement.querySelector('[name="email"]');
      const serviceInput = formElement.querySelector('[name="service"]');
      const messageInput = formElement.querySelector('[name="message"]');

      // Helper validation function
      function validateField(input, condition) {
        if (!input) return true;
        const group = input.closest('.form-group');
        if (!condition) {
          if (group) group.classList.add('has-error');
          return false;
        } else {
          if (group) group.classList.remove('has-error');
          return true;
        }
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (nameInput) {
        if (!validateField(nameInput, nameInput.value.trim().length >= 2)) isValid = false;
      }
      if (emailInput) {
        if (!validateField(emailInput, emailPattern.test(emailInput.value.trim()))) isValid = false;
      }
      if (serviceInput) {
        if (!validateField(serviceInput, serviceInput.value.trim() !== '')) isValid = false;
      }
      if (messageInput) {
        if (!validateField(messageInput, messageInput.value.trim().length >= 5)) isValid = false;
      }

      if (isValid) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Button loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
          </svg>
          Securing Consultation...
        `;

        // Simulate secure API handshake
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          formElement.reset();

          // Close modal if form is in modal
          const parentModal = formElement.closest('.modal-backdrop');
          if (parentModal) closeModal(parentModal);

          // Show Toast notification
          showToast('Security consultation request transmitted securely. A Nexora Cyber Senior Architect will contact you within 2 business hours.');
        }, 1200);
      }
    });

    // Real-time error removal on input
    formElement.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', function () {
        const group = this.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  setupFormValidation(contactForm);
  setupFormValidation(modalConsultForm);

  // Toast Notification Manager
  function showToast(message) {
    let toast = document.getElementById('demoToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'demoToast';
      toast.className = 'demo-toast';
      toast.innerHTML = `
        <div class="toast-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
        </div>
        <div class="toast-message" style="font-size: 0.86rem; color: #fff;">${message}</div>
      `;
      document.body.appendChild(toast);
    } else {
      toast.querySelector('.toast-message').textContent = message;
    }

    setTimeout(() => toast.classList.add('active'), 50);
    setTimeout(() => toast.classList.remove('active'), 6000);
  }

  // --- 6. Animated Metric Counters ---
  const counterElements = document.querySelectorAll('[data-counter]');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter'));
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = (target * easeOut).toFixed(decimals);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // --- 7. Year update ---
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

})();
