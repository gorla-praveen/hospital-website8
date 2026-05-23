/* =============================================
   Hospital Management - Main JavaScript
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---- SCROLL TO TOP ----
  const scrollBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', function () {
    if (scrollBtn) {
      scrollBtn.classList.toggle('visible', window.scrollY > 300);
    }
  });
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- FADE UP ANIMATIONS ----
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ---- COUNTER ANIMATION ----
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const increment = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString() + suffix;
    }, 30);
  }
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ---- DOCTOR FILTER ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('[data-department]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      doctorCards.forEach(card => {
        if (filter === 'all' || card.dataset.department === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---- APPOINTMENT FORM VALIDATION ----
  const apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      const fields = apptForm.querySelectorAll('[required]');
      fields.forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          valid = false;
        } else {
          // Email validation
          if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            field.classList.add('is-invalid');
            valid = false;
          } else {
            field.classList.add('is-valid');
          }
        }
      });
      if (valid) {
        const successMsg = document.getElementById('formSuccess');
        if (successMsg) {
          successMsg.style.display = 'block';
          apptForm.reset();
          apptForm.querySelectorAll('.is-valid').forEach(f => f.classList.remove('is-valid'));
          setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        }
      }
    });
    // Live validation
    apptForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', function () {
        this.classList.remove('is-invalid', 'is-valid');
        if (!this.value.trim()) {
          this.classList.add('is-invalid');
        } else if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
          this.classList.add('is-invalid');
        } else {
          this.classList.add('is-valid');
        }
      });
    });
  }

  // ---- NAVBAR ACTIVE LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ---- SET MIN DATE FOR APPOINTMENT ----
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
