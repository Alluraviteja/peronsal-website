// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// TOC sidebar scroll spy
const tocLinks = document.querySelectorAll('.toc-nav a');
if (tocLinks.length) {
  const tocObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.toc-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -70% 0px' });

  document.querySelectorAll('section[id]').forEach(el => tocObserver.observe(el));
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav-menu a[href^="#"]');

if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`#nav-menu a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
}

// URL hash update on scroll
const allSections = Array.from(document.querySelectorAll('section[id]'));
if (allSections.length) {
  let hashUpdateReady = false;
  setTimeout(() => { hashUpdateReady = true; }, 500);

  function updateHash() {
    if (!hashUpdateReady) return;
    const mid = window.scrollY + window.innerHeight / 2;
    let current = allSections[0];
    for (const section of allSections) {
      if (section.offsetTop <= mid) current = section;
    }
    const next = '#' + current.id;
    if (window.location.hash !== next) {
      history.replaceState(null, '', next);
    }
  }

  window.addEventListener('scroll', updateHash, { passive: true });
}

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });
}
