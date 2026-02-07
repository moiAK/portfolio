(function () {
  'use strict';

  let artworks = [];
  let currentFilter = 'all';
  let lastFocusedCard = null;

  const galleryGrid = document.getElementById('gallery-grid');
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalYear = document.getElementById('modal-year');
  const modalDescription = document.getElementById('modal-description');
  const modalBadge = document.getElementById('modal-badge');
  const modalClose = document.querySelector('.modal__close');
  const modalOverlay = document.querySelector('.modal__overlay');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const navToggle = document.getElementById('nav-toggle');

  async function init() {
    await fetchArtworks();
    renderGallery();
    setupFilters();
    setupModal();
    setupNavigation();
    setupAutoScroll();
  }

  async function fetchArtworks() {
    try {
      const response = await fetch('data/artworks.json');
      if (!response.ok) throw new Error('Failed to load artworks');
      artworks = await response.json();
    } catch (err) {
      console.error('Error loading artworks:', err);
      galleryGrid.innerHTML = '<p class="gallery__error">Unable to load gallery. Please try again later.</p>';
    }
  }

  function renderGallery() {
    const filtered = currentFilter === 'all'
      ? artworks
      : artworks.filter(function (a) { return a.available; });

    if (filtered.length === 0) {
      galleryGrid.innerHTML = '<p class="gallery__empty">No artworks to display.</p>';
      return;
    }

    galleryGrid.innerHTML = filtered.map(createCard).join('');

    galleryGrid.querySelectorAll('.gallery-card').forEach(function (card) {
      card.addEventListener('click', handleCardClick);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick.call(this, e);
        }
      });
    });
  }

  function createCard(artwork) {
    var badgeClass = artwork.available ? 'gallery-card__badge--available' : 'gallery-card__badge--sold';
    var badgeText = artwork.available ? 'Available' : 'Sold';
    var shortDesc = artwork.description.length > 100
      ? artwork.description.substring(0, 100) + '...'
      : artwork.description;

    return '<article class="gallery-card" role="listitem" tabindex="0" data-id="' + artwork.id + '">' +
      '<div class="gallery-card__image-wrapper">' +
        '<img src="' + artwork.image + '" alt="' + artwork.title + '" class="gallery-card__image" loading="lazy">' +
        '<span class="gallery-card__badge ' + badgeClass + '">' + badgeText + '</span>' +
      '</div>' +
      '<div class="gallery-card__content">' +
        '<h3 class="gallery-card__title">' + artwork.title + '</h3>' +
        '<p class="gallery-card__description">' + shortDesc + '</p>' +
      '</div>' +
    '</article>';
  }

  function handleCardClick() {
    var id = parseInt(this.dataset.id, 10);
    var artwork = artworks.find(function (a) { return a.id === id; });
    if (!artwork) return;

    lastFocusedCard = this;

    modalImage.src = artwork.image;
    modalImage.alt = artwork.title;
    modalTitle.textContent = artwork.title;
    modalYear.textContent = artwork.year;
    modalDescription.textContent = artwork.description;

    var badgeClass = artwork.available ? 'modal__badge--available' : 'modal__badge--sold';
    var badgeText = artwork.available ? 'Available' : 'Sold';
    modalBadge.className = 'modal__badge ' + badgeClass;
    modalBadge.textContent = badgeText;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedCard) {
      lastFocusedCard.focus();
      lastFocusedCard = null;
    }
  }

  function setupModal() {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });

    // Trap focus inside modal
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  function setupFilters() {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('filter-btn--active'); });
        this.classList.add('filter-btn--active');
        currentFilter = this.dataset.filter;
        renderGallery();
      });
    });
  }

  function setupNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile nav if open
          if (navToggle) navToggle.checked = false;
        }
      });
    });
  }

  function setupAutoScroll() {
    var scrollBox = document.querySelector('.about__statement-scroll');
    if (!scrollBox) return;

    var speed = 0.5; // pixels per frame
    var paused = false;

    scrollBox.addEventListener('mouseenter', function () { paused = true; });
    scrollBox.addEventListener('mouseleave', function () { paused = false; });
    scrollBox.addEventListener('touchstart', function () { paused = true; });
    scrollBox.addEventListener('touchend', function () {
      setTimeout(function () { paused = false; }, 2000);
    });

    function step() {
      if (!paused) {
        scrollBox.scrollTop += speed;
        // Loop back to top when reaching the end
        if (scrollBox.scrollTop >= scrollBox.scrollHeight - scrollBox.clientHeight) {
          scrollBox.scrollTop = 0;
        }
      }
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
