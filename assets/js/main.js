document.addEventListener(
  'DOMContentLoaded',
  () => {
    const header = document.getElementsByTagName('header')[0];
    const mastheadHomepage = document.getElementById('masthead-homepage');

    window.addEventListener('scroll', () => {
      if (mastheadHomepage) {
        mastheadHomepage.style.opacity =
          1 - window.scrollY / (window.innerHeight / 2);
        mastheadHomepage.style.marginTop = -window.scrollY / 2 + 'px';
      }

      if (window.scrollY > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    setupFlyoutMenu();
    setupCategories();
    setupLightbox();
  },
  false
);

function setupFlyoutMenu() {
  document.getElementById('nav-icon').addEventListener('click', (e) => {
    document.getElementById('nav-icon').classList.toggle('open');
    document.getElementById('flyout').classList.toggle('open');
  });
}

function setupCategories() {
  const categories = document.querySelectorAll('.category');

  categories.forEach((el) =>
    el.addEventListener('click', (event) => {
      // Remove 'active' class from all categories
      document
        .querySelectorAll('.category')
        .forEach((el) => el.classList.remove('active'));

      // Set current category active
      event.target.classList.add('active');
      showProjectsByCategory(event.target.dataset.category);
    })
  );

  function showProjectsByCategory(category) {
    document.querySelectorAll('.project').forEach((el) => {
      const elementCategories = el.dataset.categories
        .split(',')
        .filter((el) => el);

      if (category === 'all' || elementCategories.includes(category)) {
        el.classList.remove('soft-hide');
      } else {
        el.classList.add('soft-hide');
      }
    });
  }
}

window.onContactFormSubmit = function () {
  const form = document.getElementById('contact-form');
  form.submit();
  form.reset();

  const submitResponseEl = document.getElementById(
    'contact-form-submit-response'
  );

  submitResponseEl.classList.add('reveal');

  setTimeout(() => {
    submitResponseEl.classList.remove('reveal');
  }, 2000);
};

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');

  if (!lightbox) return;

  const images = document.querySelectorAll('main img');
  const lightboxImgWrapper = document.getElementById('lightbox-img-wrapper');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxFullscreen = document.getElementById('lightbox-fullscreen');
  const lightboxExitFullscreen = document.getElementById(
    'lightbox-exit-fullscreen'
  );
  const lightboxZoomIn = document.getElementById('lightbox-zoom-in');
  const lightboxZoomOut = document.getElementById('lightbox-zoom-out');
  const lightboxClose = document.getElementById('lightbox-close');

  let translateOrigin = { x: 0, y: 0 };
  let mouseOrigin = { x: 0, y: 0 };

  // Prevent image dragging
  lightboxImg.draggable = false;

  // Close lightbox on click on img wrapper
  lightboxImgWrapper.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) return;

    closeLightbox();
  });

  // Enter fullscreen
  lightboxFullscreen.addEventListener('click', () => {
    toggleFullScreen();
  });

  // Exit fullscreen
  lightboxExitFullscreen.addEventListener('click', () => {
    toggleFullScreen();
  });

  // Zoom in
  lightboxZoomIn.addEventListener('click', () => {
    lightboxImg.classList.add('zoom');
    lightboxZoomIn.classList.add('hidden');
    lightboxZoomOut.classList.remove('hidden');

    addMouseListeners();
  });

  // Zoom out
  lightboxZoomOut.addEventListener('click', () => {
    lightboxImg.classList.remove('zoom');
    lightboxZoomIn.classList.remove('hidden');
    lightboxZoomOut.classList.add('hidden');
    lightboxImgWrapper.style.transform = 'translate(0px, 0px)';

    removeMouseListeners();
  });

  // Close
  lightboxClose.addEventListener('click', () => {
    closeLightbox();
  });

  // Attach click event to all images in content
  images.forEach((img) => {
    img.addEventListener('click', (e) => {
      lightboxImg.src = e.target.src;
      lightboxTitle.innerText = e.target.title;

      showLightbox();
    });
  });

  function showLightbox() {
    lightbox.classList.add('show');
  }

  function closeLightbox() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    lightbox.classList.remove('show');
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      lightboxFullscreen.classList.add('hidden');
      lightboxExitFullscreen.classList.remove('hidden');
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      lightboxFullscreen.classList.remove('hidden');
      lightboxExitFullscreen.classList.add('hidden');
    }
  }

  function addMouseListeners() {
    lightboxImg.addEventListener('mousedown', mouseDown);
  }

  function removeMouseListeners() {
    lightboxImg.removeEventListener('mousedown', mouseDown);
  }

  function mouseDown(e) {
    if (lightboxImgWrapper.style.transform) {
      const translation = lightboxImgWrapper.style.transform.match(/-*\d+/g);
      translateOrigin = {
        x: parseInt(translation[0], 10),
        y: parseInt(translation[1], 10),
      };
    }

    mouseOrigin = { x: e.clientX, y: e.clientY };

    window.addEventListener('mousemove', moveImg, true);
    window.addEventListener('mouseup', mouseUp, false);
  }

  function mouseUp() {
    window.removeEventListener('mousemove', moveImg, true);
  }

  let prevTranslate = {
    x: 0,
    y: 0,
  };

  function moveImg(e) {
    // Get current position
    const currentPos = lightboxImg.getBoundingClientRect();

    const nextTranslate = {
      x: translateOrigin.x + e.clientX - mouseOrigin.x,
      y: translateOrigin.y + e.clientY - mouseOrigin.y,
    };

    const diff = {
      x: nextTranslate.x - prevTranslate.x,
      y: nextTranslate.y - prevTranslate.y,
    };

    prevTranslate = {
      x:
        currentPos.x + diff.x >= 0 ||
        -currentPos.x + window.innerWidth - diff.x >= currentPos.width
          ? prevTranslate.x
          : nextTranslate.x,
      y:
        currentPos.y + diff.y >= 0 ||
        -currentPos.y + window.innerHeight - diff.y >= currentPos.height
          ? prevTranslate.y
          : nextTranslate.y,
    };

    lightboxImgWrapper.style.transform = `translate(${prevTranslate.x}px, ${prevTranslate.y}px)`;
  }
}
