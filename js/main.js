/* ============================================
   CBTfit: Mind & Body — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---- Active Nav Link Highlight ---- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-header__nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Fade-in on Scroll (IntersectionObserver) ---- */
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show them
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---- Contact Form Validation ---- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const fields = {
      name: {
        el: document.getElementById('name'),
        validate: function (v) { return v.trim().length > 0; },
        error: 'Please enter your name.'
      },
      email: {
        el: document.getElementById('email'),
        validate: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
        error: 'Please enter a valid email address.'
      },
      subject: {
        el: document.getElementById('subject'),
        validate: function (v) { return v.trim().length > 0; },
        error: 'Please enter a subject.'
      },
      message: {
        el: document.getElementById('message'),
        validate: function (v) { return v.trim().length >= 10; },
        error: 'Please enter a message of at least 10 characters.'
      }
    };

    function showError(field) {
      field.el.classList.add('invalid');
      const errorEl = document.getElementById(field.el.id + '-error');
      if (errorEl) {
        errorEl.textContent = field.error;
        errorEl.classList.add('visible');
      }
    }

    function clearError(field) {
      field.el.classList.remove('invalid');
      const errorEl = document.getElementById(field.el.id + '-error');
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
    }

    // Clear errors on input
    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('input', function () {
        clearError(fields[key]);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      Object.keys(fields).forEach(function (key) {
        if (!fields[key].validate(fields[key].el.value)) {
          showError(fields[key]);
          isValid = false;
        }
      });

      if (!isValid) return;

      // Submit to Formspree
      const formData = new FormData(contactForm);
      const formAction = contactForm.getAttribute('action');

      fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.querySelector('.form-fields').style.display = 'none';
            document.getElementById('form-success').classList.add('visible');
            contactForm.reset();
          } else {
            alert('Something went wrong. Please try again later.');
          }
        })
        .catch(function () {
          alert('Network error. Please check your connection and try again.');
        });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
