/* ===== Hero Typing Effect ===== */
(function initTypingEffect() {
  var title = document.querySelector('.hero-title');
  var subtitle = document.querySelector('.hero-subtitle');
  if (!title || !subtitle) return;

  var titleText = title.getAttribute('data-text') || title.textContent;
  var subtitleText = subtitle.getAttribute('data-text') || subtitle.textContent;

  title.textContent = '';
  subtitle.textContent = '';
  subtitle.style.visibility = 'hidden';

  var i = 0;
  function typeTitle() {
    if (i < titleText.length) {
      title.textContent += titleText.charAt(i);
      i++;
      setTimeout(typeTitle, 150);
    } else {
      subtitle.style.visibility = 'visible';
      typeSubtitle();
    }
  }

  var j = 0;
  function typeSubtitle() {
    if (j < subtitleText.length) {
      subtitle.textContent += subtitleText.charAt(j);
      j++;
      setTimeout(typeSubtitle, 60);
    }
  }

  setTimeout(typeTitle, 500);
})();

/* ===== Scroll Fade-In Animation ===== */
(function initScrollAnimation() {
  var observer = new IntersectionObserver(
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

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ===== Greeting Staggered Animation ===== */
(function initGreetingStagger() {
  var lines = document.querySelectorAll('.greeting-text .line');
  if (lines.length === 0) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          lines.forEach(function (line, i) {
            setTimeout(function () {
              line.classList.add('line-visible');
            }, i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(document.querySelector('.greeting-text'));
})();

/* ===== Gallery with Counter & Lightbox ===== */
(function initGallery() {
  var viewport = document.querySelector('.gallery-viewport');
  var dotsContainer = document.querySelector('.gallery-dots');
  var slides = document.querySelectorAll('.gallery-slide');
  var counterCurrent = document.getElementById('gallery-current');
  var btnPrev = document.querySelector('.gallery-prev');
  var btnNext = document.querySelector('.gallery-next');
  if (!viewport || !dotsContainer || slides.length === 0) return;

  // Create dots
  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', '사진 ' + (i + 1));
    dot.addEventListener('click', function () {
      goToSlide(i);
    });
    dotsContainer.appendChild(dot);
  });

  var dots = dotsContainer.querySelectorAll('.gallery-dot');
  var currentIndex = 0;

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    slides[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  // Arrow buttons
  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      goToSlide(currentIndex - 1);
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', function () {
      goToSlide(currentIndex + 1);
    });
  }

  // Touch swipe on gallery viewport
  var touchStartX = 0;
  var touchStartY = 0;
  viewport.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  viewport.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].screenX - touchStartX;
    var dy = e.changedTouches[0].screenY - touchStartY;
    // Only trigger if horizontal swipe is dominant and > 30px
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
    }
  }, { passive: true });

  // Update active dot and counter on scroll
  var scrollObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var index = Array.from(slides).indexOf(entry.target);
          currentIndex = index;
          dots.forEach(function (d, i) {
            d.classList.toggle('active', i === index);
          });
          if (counterCurrent) {
            counterCurrent.textContent = index + 1;
          }
        }
      });
    },
    { root: viewport, threshold: 0.6 }
  );

  slides.forEach(function (slide) {
    scrollObserver.observe(slide);
  });

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  var lightboxCurrent = document.getElementById('lightbox-current');
  var lightboxIndex = 0;
  var images = [];

  slides.forEach(function (slide) {
    var img = slide.querySelector('img');
    if (img) images.push(img.src);
  });

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = images[index];
    if (lightboxCurrent) lightboxCurrent.textContent = index + 1;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[lightboxIndex];
    if (lightboxCurrent) lightboxCurrent.textContent = lightboxIndex + 1;
  }

  function showNext() {
    lightboxIndex = (lightboxIndex + 1) % images.length;
    lightboxImg.src = images[lightboxIndex];
    if (lightboxCurrent) lightboxCurrent.textContent = lightboxIndex + 1;
  }

  if (lightbox) {
    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function () {
        openLightbox(i);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe for lightbox
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showPrev();
        else showNext();
      }
    }, { passive: true });
  }
})();

/* ===== D-Day Counter with Flip Animation ===== */
(function initDdayCounter() {
  var targetDate = new Date('2026-03-21T18:00:00+09:00');
  var prevValues = { days: '', hours: '', minutes: '', seconds: '' };

  function flipIfChanged(el, newVal) {
    if (el.textContent !== String(newVal)) {
      el.textContent = newVal;
      el.classList.remove('flip');
      // Force reflow to restart animation
      void el.offsetWidth;
      el.classList.add('flip');
    }
  }

  function update() {
    var now = new Date();
    var diff = targetDate - now;

    if (diff <= 0) {
      document.querySelector('.dday-label').textContent = '돌잔치 당일입니다!';
      document.querySelectorAll('.dday-num').forEach(function (el) {
        el.textContent = '0';
      });
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    flipIfChanged(document.getElementById('dday-days'), days);
    flipIfChanged(document.getElementById('dday-hours'), hours);
    flipIfChanged(document.getElementById('dday-minutes'), minutes);
    flipIfChanged(document.getElementById('dday-seconds'), seconds);
  }

  update();
  setInterval(update, 1000);
})();

/* ===== Parallax Floating Particles ===== */
(function initParallax() {
  var particles = document.querySelectorAll('.particle');
  if (particles.length === 0) return;

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    particles.forEach(function (p) {
      var speed = parseFloat(p.getAttribute('data-speed')) || 0.3;
      p.style.transform = 'translateY(' + (-scrollY * speed) + 'px)';
    });
  }, { passive: true });
})();


/* ===== Kakao Share ===== */
(function initKakaoShare() {
  var KAKAO_JS_KEY = 'YOUR_KAKAO_JS_KEY';

  var btn = document.getElementById('btn-kakao-share');
  if (!btn) return;

  if (KAKAO_JS_KEY !== 'YOUR_KAKAO_JS_KEY' && typeof Kakao !== 'undefined') {
    if (!Kakao.isInitialized()) {
      Kakao.init(KAKAO_JS_KEY);
    }

    btn.addEventListener('click', function () {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '조이겸 첫 번째 생일에 초대합니다',
          description: '2026년 3월 21일 토요일 오후 6시\n별내 차림',
          imageUrl: window.location.origin + '/images/og-image.jpg',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '초대장 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    });
  } else {
    btn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({
          title: '조이겸 첫 번째 생일에 초대합니다',
          text: '2026년 3월 21일 토요일 오후 6시, 별내 차림',
          url: window.location.href,
        });
      } else {
        alert('카카오 API 키를 설정한 후 사용할 수 있습니다.\n대신 링크 복사를 이용해주세요.');
      }
    });
  }
})();

/* ===== Copy Link ===== */
(function initCopyLink() {
  var btn = document.getElementById('btn-copy-link');
  var toast = document.getElementById('toast');
  if (!btn || !toast) return;

  btn.addEventListener('click', function () {
    var url = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(showToast);
    } else {
      var input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast();
    }
  });

  function showToast() {
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }
})();
