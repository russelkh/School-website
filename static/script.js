/* ========================================== */
/* SCROLL-TRIGGERED ANIMATIONS                */
/* Intersection Observer for performance      */
/* ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animateElements = document.querySelectorAll(
    '.animate, .slide-left, .slide-right, .slide-up, .slide-in-left, .slide-in-right, .zoom-in, .fade-in, .animate-stagger, .faculty-card'
  );

  animateElements.forEach(element => {
    observer.observe(element);
  });

  // Also set a timeout to observe elements that might be added dynamically
  setTimeout(() => {
    const dynamicElements = document.querySelectorAll(
      '.animate, .slide-left, .slide-right, .slide-up, .slide-in-left, .slide-in-right, .zoom-in, .fade-in, .animate-stagger, .faculty-card'
    );
    dynamicElements.forEach(element => {
      if (!element.classList.contains('show')) {
        observer.observe(element);
      }
    });
  }, 1000);
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

  // === About Section Carousel ===
  const carousel = document.querySelector('.about-image.carousel');
  const images = document.querySelectorAll('.carousel-img');
  if (carousel && images.length > 0) {
    let currentIndex = 0;
    const transitionTime = 2500;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-nav';
    carousel.appendChild(dotsContainer);

    images.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToImage(index));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function goToImage(index) {
      images.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      currentIndex = index;
      images[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');
    }

    function nextImage() {
      const nextIndex = (currentIndex + 1) % images.length;
      goToImage(nextIndex);
    }

    setInterval(nextImage, transitionTime);
  }

  // === Subject Toppers - iOS Wheel Picker Style ===
  document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-nav-btn.next-btn');
    const modal = document.getElementById('topper-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = modal?.querySelector('.close');

    const itemWidth = 280;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let currentScroll = 0;
    let currentIndex = 0;
    let momentumRequest = null;

    // Get current active index based on scroll position
    function getActiveIndex() {
      if (!carouselContainer) return 0;
      const containerCenter = carouselContainer.scrollLeft + carouselContainer.offsetWidth / 2;
      return Math.round((containerCenter - itemWidth / 2) / itemWidth);
    }

    // Function to update item styles based on scroll position
    function updateItemsStyle() {
      if (!carouselContainer) return;
      const containerCenter = carouselContainer.scrollLeft + carouselContainer.offsetWidth / 2;

      carouselItems.forEach((item, index) => {
        const itemCenter = index * itemWidth + itemWidth / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        const threshold = itemWidth * 1.5;

        item.classList.remove('active', 'near');

        if (distance < itemWidth * 0.6) {
          item.classList.add('active');
          currentIndex = index;
        } else if (distance < threshold) {
          item.classList.add('near');
        }
      });
    }

    // Snap to nearest item
    function snapToItem() {
      if (!carouselContainer) return;
      const containerCenter = carouselContainer.scrollLeft + carouselContainer.offsetWidth / 2;
      const nearestIndex = Math.round((containerCenter - itemWidth / 2) / itemWidth);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, carouselItems.length - 1));
      const targetScroll = clampedIndex * itemWidth + (carouselContainer.offsetWidth - itemWidth) / 2 - (carouselContainer.scrollWidth - carouselContainer.offsetWidth) / 2;

      carouselContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      updateItemsStyle();
    }

    // Scroll to specific item by index
    function scrollToIndex(index) {
      if (!carouselContainer || carouselItems.length === 0) return;
      const clampedIndex = Math.max(0, Math.min(index, carouselItems.length - 1));
      currentIndex = clampedIndex;

      const targetScroll = clampedIndex * itemWidth + (carouselContainer.offsetWidth - itemWidth) / 2 - (carouselContainer.scrollWidth - carouselContainer.offsetWidth) / 2;

      carouselContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      // Update classes manually for immediate feedback
      carouselItems.forEach((item, idx) => {
        item.classList.remove('active', 'near');
        if (idx === clampedIndex) {
          item.classList.add('active');
        } else if (Math.abs(idx - clampedIndex) === 1) {
          item.classList.add('near');
        }
      });
    }

    // Button navigation - direct index tracking
    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        currentIndex = Math.max(0, currentIndex - 1);
        scrollToIndex(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        currentIndex = Math.min(carouselItems.length - 1, currentIndex + 1);
        scrollToIndex(currentIndex);
      });
    }

  // Scroll event handlers
  if (carouselContainer) {
    carouselContainer.addEventListener('scroll', () => {
      currentScroll = carouselContainer.scrollLeft;
      updateItemsStyle();

      // Clear any pending momentum
      if (momentumRequest) {
        cancelAnimationFrame(momentumRequest);
      }

      // Start momentum check
      momentumRequest = requestAnimationFrame(() => {
        const afterScroll = carouselContainer.scrollLeft;
        if (Math.abs(afterScroll - currentScroll) < 1) {
          snapToItem();
        }
      });
    });

    // Touch/mouse drag handling
    carouselContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - carouselContainer.offsetLeft;
      scrollLeft = carouselContainer.scrollLeft;
      carouselContainer.style.cursor = 'grabbing';
    });

    carouselContainer.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        carouselContainer.style.cursor = 'grab';
        snapToItem();
      }
    });

    carouselContainer.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        carouselContainer.style.cursor = 'grab';
        snapToItem();
      }
    });

    carouselContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carouselContainer.offsetLeft;
      const walk = (startX - x) * 1.5;
      carouselContainer.scrollLeft = scrollLeft + walk;
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX - carouselContainer.offsetLeft;
      touchScrollLeft = carouselContainer.scrollLeft;
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - carouselContainer.offsetLeft;
      const walk = (touchStartX - x) * 1.5;
      carouselContainer.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
      snapToItem();
    }, { passive: true });
  }

  // Click on carousel item to view full image in modal
  carouselItems.forEach(item => {
    const preview = item.querySelector('.topper-preview');
    if (preview) {
      preview.addEventListener('click', () => {
        const imgUrl = preview.dataset.image || preview.querySelector('img')?.src;
        if (imgUrl && modalImg) {
          modalImg.src = imgUrl;
          if (modal) modal.classList.add('show');
        }
      });
    }
  });

  closeBtn?.addEventListener('click', () => {
    if (modal) modal.classList.remove('show');
    if (modalImg) modalImg.src = '';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      if (modalImg) modalImg.src = '';
    }
  });

  // Initialize
  setTimeout(() => {
    const centerIndex = Math.floor(carouselItems.length / 2);
    const initialScroll = centerIndex * itemWidth - (carouselContainer.offsetWidth - itemWidth) / 2;
    carouselContainer.scrollLeft = initialScroll;
    updateItemsStyle();
  }, 100);
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

    // Desktop Hover
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

    // Mobile Click
    if (window.innerWidth <= 768) {
      image.addEventListener("click", e => {
        e.stopPropagation();
        document.querySelectorAll(".tooltip-popup.active, .head-popup.active").forEach(el => {
          el.classList.remove("active");
        });

        if (tooltip) tooltip.classList.toggle("active");
        if (popup) popup.classList.toggle("active");
      });
    }
  });

  // Close mobile popups on outside click
  if (window.innerWidth <= 768) {
    document.addEventListener("click", () => {
      document.querySelectorAll(".tooltip-popup.active, .head-popup.active").forEach(el => {
        el.classList.remove("active");
      });
    });
  }
});

/* ========================================== */
/* HERO PARALLAX EFFECT                       */
/* ========================================== */

const hero = document.querySelector('.hero');
const bg = document.querySelector('.hero-background');

if (hero && bg) {
  let ticking = false;

  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    if (scrolled <= hero.offsetHeight) {
      const speed = 0.1;
      const translateY = scrolled * speed;
      bg.style.transform = `translateY(${translateY}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  updateParallax();
}

