const EMAILJS_PUBLIC_KEY  = 'WjOM1_h6avLJ8RiNT';   // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID  = 'WjOM1_h6avLJ8RiNT';   // e.g. 'service_spicymafia'
const EMAILJS_TEMPLATE_ID = 'template_lg64jps';  // e.g. 'template_feedback'
 
// Initialise EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
 
/* ── CURSOR FLAME ── */
const cursorFlame = document.getElementById('cursorFlame');
document.addEventListener('mousemove', (e) => {
  cursorFlame.style.left = e.clientX + 'px';
  cursorFlame.style.top  = e.clientY + 'px';
});
document.addEventListener('mouseleave', () => { cursorFlame.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursorFlame.style.opacity = '1'; });
 
/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});
 
/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
 
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
 
navLinks.querySelectorAll('.nav-link, .nav-insta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});
 
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});
 
/* ── GALLERY LIGHTBOX ── */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lbImg');
const lbClose      = document.getElementById('lbClose');
const lbPrev       = document.getElementById('lbPrev');
const lbNext       = document.getElementById('lbNext');
 
const galleryImgs = Array.from(galleryItems).map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt
}));
 
let currentLbIndex = 0;
 
function openLightbox(index) {
  currentLbIndex = index;
  lbImg.src = galleryImgs[index].src;
  lbImg.alt = galleryImgs[index].alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
 
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
 
function showLbSlide(dir) {
  currentLbIndex = (currentLbIndex + dir + galleryImgs.length) % galleryImgs.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = galleryImgs[currentLbIndex].src;
    lbImg.alt = galleryImgs[currentLbIndex].alt;
    lbImg.style.opacity = '1';
  }, 180);
}
 
lbImg.style.transition = 'opacity 0.18s';
galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => showLbSlide(-1));
lbNext.addEventListener('click',  () => showLbSlide(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showLbSlide(-1);
  if (e.key === 'ArrowRight') showLbSlide(1);
});
 
/* ── REVIEWS CAROUSEL ── */
const reviewCards = document.querySelectorAll('.review-card');
const dotsWrap    = document.getElementById('reviewDots');
let currentReview = 0;
let reviewTimer;
 
reviewCards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'review-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Review ' + (i + 1));
  dot.addEventListener('click', () => goToReview(i));
  dotsWrap.appendChild(dot);
});
 
function goToReview(index) {
  reviewCards[currentReview].classList.remove('active');
  dotsWrap.children[currentReview].classList.remove('active');
  currentReview = index;
  reviewCards[currentReview].classList.add('active');
  dotsWrap.children[currentReview].classList.add('active');
  resetReviewTimer();
}
 
function nextReview() {
  goToReview((currentReview + 1) % reviewCards.length);
}
 
function resetReviewTimer() {
  clearInterval(reviewTimer);
  reviewTimer = setInterval(nextReview, 4000);
}
 
reviewCards[0].classList.add('active');
resetReviewTimer();
 
/* ── STAR RATING ── */
const stars = document.querySelectorAll('.star');
let selectedRating = 0;
 
stars.forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = +star.dataset.val;
    stars.forEach(s => s.classList.toggle('hovered', +s.dataset.val <= val));
  });
  star.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hovered'));
  });
  star.addEventListener('click', () => {
    selectedRating = +star.dataset.val;
    stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= selectedRating));
  });
});
 
/* ── CHAR COUNT ── */
const fbText    = document.getElementById('fbText');
const charCount = document.getElementById('charCount');
fbText.addEventListener('input', () => {
  charCount.textContent = fbText.value.length;
});
 
/* ── TOAST ── */
const toast    = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
 
function showToast(msg, isError = false) {
  toastMsg.textContent = msg;
  toast.style.background = isError ? '#c0392b' : 'var(--fire)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
 
/* ── FEEDBACK SUBMIT + EMAILJS ── */
const submitBtn = document.getElementById('submitFeedback');
 
submitBtn.addEventListener('click', async () => {
  const name     = document.getElementById('fbName').value.trim();
  const feedback = fbText.value.trim();
 
  // Validation
  if (!name) {
    showToast('⚠️ Please enter your name!', true); return;
  }
  if (!selectedRating) {
    showToast('⚠️ Please select a star rating!', true); return;
  }
  if (feedback.length < 10) {
    showToast('⚠️ Write at least 10 characters!', true); return;
  }
 
  // Loading state
  submitBtn.textContent = '⏳ Sending…';
  submitBtn.disabled = true;
 
  const starEmojis = '⭐'.repeat(selectedRating);
 
  try {
    // ── Send email via EmailJS ──
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name : name,
      rating    : `${starEmojis} (${selectedRating}/5)`,
      message   : feedback,
      reply_to  : 'noreply@spicymafia.com',   // no customer email collected
    });
 
    showToast(`🔥 Thanks ${name}! Feedback sent to owner.`);
 
    // Inject new review into carousel
    const newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.innerHTML = `
      <div class="review-stars">${starEmojis}</div>
      <p>"${feedback}"</p>
      <span class="reviewer">— ${name}, Meerut</span>
    `;
    document.getElementById('reviewsTrack').appendChild(newCard);
 
    // Add a new dot for the new review card
    const allCards = document.querySelectorAll('.review-card');
    const newDot   = document.createElement('button');
    newDot.className = 'review-dot';
    newDot.setAttribute('aria-label', 'Review ' + allCards.length);
    const newIndex = allCards.length - 1;
    newDot.addEventListener('click', () => goToReview(newIndex));
    dotsWrap.appendChild(newDot);
 
    // Reset form
    document.getElementById('fbName').value = '';
    fbText.value = '';
    charCount.textContent = '0';
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active'));
 
  } catch (err) {
    console.error('EmailJS error:', err);
    showToast('❌ Could not send. Check your EmailJS keys.', true);
  } finally {
    submitBtn.textContent = 'Submit Feedback 🔥';
    submitBtn.disabled = false;
  }
});
 
/* ── SCROLL REVEAL ── */
document.querySelectorAll(
  '.menu-card, .about-img-stack, .about-text-col, .gallery-item, .reviews-col, .form-col, .loc-item'
).forEach(el => el.classList.add('reveal'));
 
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
 
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
 
/* ── ACTIVE NAV HIGHLIGHT ON SCROLL ── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
 
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--fire)' : '';
      });
    }
  });
}, { threshold: 0.4 });
 
sections.forEach(sec => sectionObserver.observe(sec));
 