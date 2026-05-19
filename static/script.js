/* ========================================== */
/* SCROLL-TRIGGERED ANIMATIONS                */
/* Optimized for performance                   */
/* ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Throttle function for performance
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Batch DOM queries
  const animatedElements = document.querySelectorAll(
    '.animate, .animate-stagger, .about-text, .topper-card, .section-title'
  );

  // Use single observer for all elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
});

/* ========================================== */
/* EXISTING CODE - Keep all functionality    */
/* ========================================== */

document.addEventListener('DOMContentLoaded', function () {
  // === Mobile Menu Toggle ===
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
  }

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
    });
  });

  // === Smooth Scrolling ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // === About Section Vertical Wheel Carousel - iPhone Timer Style ===
  const wheelCarousel = document.querySelector('.wheel-carousel');
  const wheelItems = document.querySelectorAll('.wheel-item');
  if (wheelCarousel && wheelItems.length > 0) {
    let currentIndex = 0;
    const totalItems = wheelItems.length;
    const autoRotateInterval = 1600;

    function updateWheel() {
      wheelItems.forEach((item, index) => {
        item.classList.remove('active', 'prev', 'next');
        if (index === currentIndex) {
          item.classList.add('active');
        } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
          item.classList.add('prev');
        } else if (index === (currentIndex + 1) % totalItems) {
          item.classList.add('next');
        }
      });
    }

    function rotateWheel(direction) {
      currentIndex = (currentIndex + direction + totalItems) % totalItems;
      updateWheel();
    }

    // Auto rotate
    setInterval(() => rotateWheel(1), autoRotateInterval);

    // Initial state
    updateWheel();
  }

  // === Subject Toppers Carousel ===
  const yearTabs = document.querySelectorAll('.year-tab');
  const carouselItems = document.querySelectorAll('.carousel-items');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let currentYearIndex = 0;

  // Tab switching
  yearTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.dataset.year;
      const targetIndex = Array.from(yearTabs).indexOf(tab);

      yearTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      carouselItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.year === year) {
          item.classList.add('active');
        }
      });

      currentYearIndex = targetIndex;
    });
  });

  // Prev/Next buttons
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentYearIndex > 0) {
        yearTabs[currentYearIndex - 1].click();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentYearIndex < yearTabs.length - 1) {
        yearTabs[currentYearIndex + 1].click();
      }
    });
  }

  // Modal functionality
  const carouselContainers = document.querySelectorAll('.carousel-items');

  carouselContainers.forEach(container => {
    container.addEventListener('click', () => {
      const fullImage = container.dataset.fullImage;
      if (fullImage && modalImg) {
        modalImg.src = fullImage;
        modal.classList.add('show');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      modalImg.src = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        modalImg.src = '';
      }
    });
  }
});

/* ========================================== */
/* VIDEO PLAYER CONTROLS                     */
/* ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("csa-video");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const progressBar = document.getElementById("progressBar");
  const progressContainer = document.getElementById("progressContainer");
  const bufferedBar = document.getElementById("bufferedBar");
  const timeDisplay = document.getElementById("timeDisplay");
  const volumeSlider = document.getElementById("volumeSlider");
  const customPlay = document.getElementById("customPlay");

  if (video) {
    const formatTime = time => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60).toString().padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    video.addEventListener("timeupdate", () => {
      if (progressBar) progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
      if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    video.addEventListener("progress", () => {
      if (video.buffered.length && bufferedBar) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        bufferedBar.style.width = `${(bufferedEnd / video.duration) * 100}%`;
      }
    });

    const togglePlay = () => {
      if (video.paused) {
        video.play();
        if (playPauseBtn) playPauseBtn.classList.add("playing");
        if (customPlay) customPlay.style.display = "none";
      } else {
        video.pause();
        if (playPauseBtn) playPauseBtn.classList.remove("playing");
        if (customPlay) customPlay.style.display = "block";
      }
    };

    if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlay);
    if (customPlay) customPlay.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

    if (progressContainer) {
      progressContainer.addEventListener("click", e => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        video.currentTime = (clickX / rect.width) * video.duration;
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", () => {
        video.volume = volumeSlider.value;
      });
    }
  }
});

/* ========================================== */
/* HEAD CARDS INTERACTION                    */
/* ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const headCards = document.querySelectorAll(".head-card");

  headCards.forEach(card => {
    const image = card.querySelector(".head-image");
    const tooltip = card.querySelector(".tooltip-popup");
    const isMiddle = card.classList.contains("middle");
    const isLeft = card.classList.contains("left");
    const isRight = card.classList.contains("right");
    const popup = document.getElementById(isLeft ? "popup-left" : (isRight ? "popup-right" : null));

    // Desktop and Tablet Hover (breakpoint > 768px)
    if (!isMiddle && popup && window.innerWidth > 768) {
      popup.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      popup.style.position = "fixed";
      popup.style.top = "100px";
      popup.style.width = "50vw";
      popup.style.height = "calc(100vh - 100px)";
      popup.style.opacity = "0";
      popup.style.pointerEvents = "none";
      popup.style.zIndex = "2000";
      popup.style.boxShadow = "0 0 20px rgba(0,0,0,0.2)";
      popup.style.overflowY = "auto";

      if (isLeft) {
        popup.style.right = "0";
        popup.style.left = "auto";
        popup.style.transform = "translateX(100%)";
      } else if (isRight) {
        popup.style.left = "0";
        popup.style.right = "auto";
        popup.style.transform = "translateX(-100%)";
      }

      image.addEventListener("mouseenter", () => {
        popup.style.opacity = "1";
        popup.style.pointerEvents = "auto";
        popup.style.transform = "translateX(0)";
      });

      image.addEventListener("mouseleave", () => {
        popup.style.opacity = "0";
        popup.style.pointerEvents = "none";
        popup.style.transform = isLeft ? "translateX(100%)" : "translateX(-100%)";
      });
    }

    // Mobile view - no interactive popup
  });
});

/* ========================================== */
/* HERO PARALLAX EFFECT - Simple fixed background */
/* ========================================== */
