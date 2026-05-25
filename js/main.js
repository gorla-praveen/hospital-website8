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

  const successMsg = document.getElementById('formSuccess');

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\-\s()]{10,15}$/;

  // Show error
  function setInvalid(field, message = '') {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');

    const feedback = field.parentElement.querySelector('.invalid-feedback');
    if (feedback && message) {
      feedback.textContent = message;
    }
  }

  // Show success
  function setValid(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
  }

  // Validate single field
  function validateField(field) {

    const value = field.value.trim();

    // Required fields
    if (field.hasAttribute('required')) {

      // Checkbox validation
      if (field.type === 'checkbox') {
        if (!field.checked) {
          setInvalid(field, 'You must agree before submitting.');
          return false;
        } else {
          setValid(field);
          return true;
        }
      }

      // Empty validation
      if (value === '') {
        setInvalid(field, 'This field is required.');
        return false;
      }
    }

    // Email validation
    if (field.type === 'email') {
      if (!emailPattern.test(value)) {
        setInvalid(field, 'Please enter a valid email address.');
        return false;
      }
    }

    // Phone validation
    if (field.id === 'phone') {
      if (!phonePattern.test(value)) {
        setInvalid(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    // Symptoms minimum length
    if (field.id === 'symptoms') {
      if (value.length < 10) {
        setInvalid(field, 'Please enter at least 10 characters.');
        return false;
      }
    }

    // Appointment date validation
    if (field.id === 'appointmentDate') {
      const selectedDate = new Date(value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setInvalid(field, 'Please select a future date.');
        return false;
      }
    }

    // DOB validation
    if (field.id === 'dob' && value !== '') {
      const dobDate = new Date(value);
      const today = new Date();

      if (dobDate > today) {
        setInvalid(field, 'Date of birth cannot be in the future.');
        return false;
      }
    }

    setValid(field);
    return true;
  }

  // Form submit
  apptForm.addEventListener('submit', function (e) {

    e.preventDefault();

    let isFormValid = true;

    const fields = apptForm.querySelectorAll('input, select, textarea');

    fields.forEach(field => {

      const valid = validateField(field);

      if (!valid) {
        isFormValid = false;
      }
    });

    // Success
    if (isFormValid) {

      successMsg.style.display = 'flex';

      apptForm.reset();

      // Remove validation classes after reset
      apptForm.querySelectorAll('.is-valid').forEach(field => {
        field.classList.remove('is-valid');
      });

      // Scroll to success message
      successMsg.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // Hide success message
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);

    } else {

      // Scroll to first invalid field
      const firstInvalid = apptForm.querySelector('.is-invalid');

      if (firstInvalid) {
        firstInvalid.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  });

  // Live validation
  apptForm.querySelectorAll('input, select, textarea').forEach(field => {

    field.addEventListener('input', () => {
      validateField(field);
    });

    field.addEventListener('blur', () => {
      validateField(field);
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
