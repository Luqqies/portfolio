// Intersection Observer untuk animasi skrol (Reveal)
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if (e.isIntersecting) e.target.classList.add('visible'); 
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Smooth scrolling untuk pautan navigasi internal
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Portfolio filter tabs
const portfolioFilterButtons = document.querySelectorAll('.pf-btn');
const portfolioItems = document.querySelectorAll('.pig-item');
function applyPortfolioFilter(filter) {
  portfolioItems.forEach(item => {
    item.classList.toggle('hidden', filter !== 'all' && item.dataset.cat !== filter);
  });
}

portfolioFilterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    portfolioFilterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });

    const filter = isActive ? 'all' : btn.dataset.filter;
    if (!isActive) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }

    applyPortfolioFilter(filter);
  });
});

// Apply the selected default filter when the page first loads.
applyPortfolioFilter(document.querySelector('.pf-btn.active')?.dataset.filter || 'all');

// Lightbox: gather items (in current grid order)
const lbItems = Array.from(document.querySelectorAll('.pig-item'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbVideo = document.getElementById('lbVideo');
const lbPlaceholder = document.getElementById('lbPlaceholder');
const lbPhIcon = document.getElementById('lbPhIcon');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
let lbIndex = 0;

function getVisibleItems() {
  return lbItems.filter(i => !i.classList.contains('hidden'));
}

function openLightbox(item) {
  const visible = getVisibleItems();
  lbIndex = visible.indexOf(item);
  renderLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function stopVideo() {
  lbVideo.src = '';
  lbVideo.style.display = 'none';
  lbImg.style.display = 'none';
  lbPlaceholder.style.display = 'none';
}

function renderLightbox() {
  const visible = getVisibleItems();
  const item = visible[lbIndex];
  if (!item) return;

  stopVideo();

  const youtubeId = item.dataset.youtube;

  if (youtubeId) {
    lbImg.style.display = 'none';
    lbPlaceholder.style.display = 'none';
    lbVideo.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
    lbVideo.style.display = 'block';
  } else {
    const thumb = item.querySelector('.pig-thumb');
    const realImg = thumb.tagName === 'IMG' ? thumb : thumb.querySelector('img');

    if (realImg && realImg.src) {
      lbImg.src = realImg.src;
      lbImg.style.display = 'block';
      lbPlaceholder.style.display = 'none';
    } else {
      const icon = item.querySelector('.pig-icon');
      lbPhIcon.textContent = icon ? icon.textContent : '???';
      lbImg.style.display = 'none';
      lbPlaceholder.style.display = 'flex';
    }
  }

  lbTitle.textContent = item.dataset.title || '';
  lbDesc.textContent = item.dataset.desc || '';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  stopVideo();
}

function showPrev() {
  const visible = getVisibleItems();
  lbIndex = (lbIndex - 1 + visible.length) % visible.length;
  renderLightbox();
}

function showNext() {
  const visible = getVisibleItems();
  lbIndex = (lbIndex + 1) % visible.length;
  renderLightbox();
}

lbItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', showPrev);
document.getElementById('lbNext').addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// CV popup modal
const CV_PATH = 'cv/Luqman-AlHadee-CV.pdf';
const cvModal = document.getElementById('cvModal');
const cvOpenBtn = document.getElementById('cvOpenBtn');
const cvClose = document.getElementById('cvClose');
const cvFrame = document.getElementById('cvFrame');

function openCvModal() {
  cvFrame.src = CV_PATH;
  cvModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCvModal() {
  cvModal.classList.remove('active');
  document.body.style.overflow = '';
  cvFrame.src = '';
}

if (cvModal && cvOpenBtn) {
  cvOpenBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openCvModal();
  });
  cvClose.addEventListener('click', closeCvModal);
  cvModal.addEventListener('click', (e) => {
    if (e.target === cvModal) closeCvModal();
  });
  document.addEventListener('keydown', (e) => {
    if (cvModal.classList.contains('active') && e.key === 'Escape') closeCvModal();
  });
}

// Video resume popup modal (Google Drive embed)
// Paste the Google Drive FILE ID here (from the file's share link, not a folder link).
const VIDEO_RESUME_DRIVE_ID = '1JRlasOWBm1DQDvc7CCSuhwqTGP-4XWdK';
const vrModal = document.getElementById('videoResumeModal');
const vrOpenBtn = document.getElementById('vrOpenBtn');
const vrClose = document.getElementById('vrClose');
const vrFrame = document.getElementById('vrFrame');

function openVrModal() {
  vrFrame.src = `https://drive.google.com/file/d/${VIDEO_RESUME_DRIVE_ID}/preview`;
  vrModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVrModal() {
  vrModal.classList.remove('active');
  document.body.style.overflow = '';
  vrFrame.src = '';
}

if (vrModal && vrOpenBtn) {
  vrOpenBtn.addEventListener('click', openVrModal);
  vrClose.addEventListener('click', closeVrModal);
  vrModal.addEventListener('click', (e) => {
    if (e.target === vrModal) closeVrModal();
  });
  document.addEventListener('keydown', (e) => {
    if (vrModal.classList.contains('active') && e.key === 'Escape') closeVrModal();
  });
}

// Contact form: sends the message straight to your inbox via Web3Forms.
// Access key is already set below (from your Web3Forms dashboard).
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

const contactForm = document.getElementById('contactForm');
const contactFormStatus = document.getElementById('contactFormStatus');
const contactSubmitBtn = contactForm?.querySelector('button[type="submit"]');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);

  contactFormStatus.textContent = 'Sending…';
  if (contactSubmitBtn) contactSubmitBtn.disabled = true;

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      contactFormStatus.textContent = 'Thanks! Your message has been sent — I\'ll get back to you soon.';
      contactForm.reset();
    } else {
      contactFormStatus.textContent = data.message || 'Something went wrong. Please try again or email me directly.';
    }
  } catch (err) {
    contactFormStatus.textContent = 'Network error — please check your connection and try again.';
  } finally {
    if (contactSubmitBtn) contactSubmitBtn.disabled = false;
  }
});

// Scroll-spy: update active nav link based on which section is in view
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = sections[0].id;
  const scrollPos = window.scrollY + 120; // offset for fixed nav height

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);
// Hamburger menu - support both click and touch
const hamburger = document.getElementById('navHamburger');
const navMenu = document.getElementById('navLinks');

function toggleMenu(e) {
  e.preventDefault();
  e.stopPropagation();
  navMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
}

hamburger.addEventListener('click', toggleMenu);
hamburger.addEventListener('touchend', toggleMenu);

navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

document.addEventListener('touchstart', (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

// Hero title typing animation — starts once page has loaded
window.addEventListener('load', () => {
  setTimeout(typeHeroTitle, 300);
});

// Typing animation for hero title
function typeHeroTitle() {
  const beforeEl = document.getElementById('typeBefore');
  const nameEl = document.getElementById('typeName');
  if (!beforeEl || !nameEl) return;

  const beforeText = 'Hi, I am ';
  const nameText = 'Luqman';
  let i = 0;

  function typeBefore() {
    if (i <= beforeText.length) {
      beforeEl.textContent = beforeText.slice(0, i);
      i++;
      setTimeout(typeBefore, 55);
    } else {
      i = 0;
      typeName();
    }
  }

  function typeName() {
    if (i <= nameText.length) {
      nameEl.textContent = nameText.slice(0, i);
      i++;
      setTimeout(typeName, 90);
    }
  }

  typeBefore();
}