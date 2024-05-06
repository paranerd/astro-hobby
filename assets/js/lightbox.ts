document.addEventListener('DOMContentLoaded', () => {
  setupLightbox();
});

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const images = document.querySelectorAll('main img:not(#lightbox-img)');
  const lightboxImgWrapper = document.getElementById('lightbox-img-wrapper');
  const lightboxImg = document.getElementById(
    'lightbox-img'
  ) as HTMLImageElement;
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxFullscreen = document.getElementById('lightbox-fullscreen');
  const lightboxExitFullscreen = document.getElementById(
    'lightbox-exit-fullscreen'
  );
  const lightboxZoomIn = document.getElementById('lightbox-zoom-in');
  const lightboxZoomOut = document.getElementById('lightbox-zoom-out');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxImgWrapper)
    return;

  let mouseOrigin = { x: 0, y: 0 };
  let translateOrigin = { x: 0, y: 0 };
  let translate = {
    x: 0,
    y: 0,
  };

  // Prevent image dragging
  lightboxImg.draggable = false;

  // Close lightbox on click on img wrapper
  lightboxImgWrapper?.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) return;

    closeLightbox();
  });

  // Enter fullscreen
  lightboxFullscreen?.addEventListener('click', () => {
    toggleFullScreen();
  });

  // Exit fullscreen
  lightboxExitFullscreen?.addEventListener('click', () => {
    toggleFullScreen();
  });

  // Zoom in
  lightboxZoomIn?.addEventListener('click', () => {
    zoomIn();
  });

  // Zoom out
  lightboxZoomOut?.addEventListener('click', () => {
    zoomOut();
  });

  // Close
  lightboxClose?.addEventListener('click', () => {
    zoomOut();
    closeLightbox();
  });

  // Attach click event to all images in content
  images.forEach((img) => {
    img.addEventListener('click', (e) => {
      lightboxImg.src = (e.target as HTMLImageElement).src;
      lightboxImg.alt = (e.target as HTMLImageElement).title;
      lightboxTitle.innerText = (e.target as HTMLImageElement).title;

      openLightbox();
    });
  });

  function openLightbox() {
    lightbox?.classList.add('open');
  }

  function closeLightbox() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    lightbox?.classList.remove('open');
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      lightboxFullscreen?.classList.add('hidden');
      lightboxExitFullscreen?.classList.remove('hidden');
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      lightboxFullscreen?.classList.remove('hidden');
      lightboxExitFullscreen?.classList.add('hidden');
    }
  }

  function zoomIn() {
    lightboxImg.classList.add('zoom');
    lightboxZoomIn?.classList.add('hidden');
    lightboxZoomOut?.classList.remove('hidden');

    addMouseListeners();
  }

  function zoomOut() {
    lightboxImg.classList.remove('zoom');
    lightboxZoomIn?.classList.remove('hidden');
    lightboxZoomOut?.classList.add('hidden');
    lightboxImgWrapper!.style.transform = 'translate(0px, 0px)';

    removeMouseListeners();
  }

  function addMouseListeners() {
    lightboxImg.addEventListener('mousedown', mouseDown);
  }

  function removeMouseListeners() {
    lightboxImg.removeEventListener('mousedown', mouseDown);
  }

  function mouseDown(e: MouseEvent) {
    if (lightboxImgWrapper?.style.transform) {
      const translation = lightboxImgWrapper.style.transform.match(/-*\d+/g);
      translateOrigin = {
        x: parseInt(translation![0], 10),
        y: parseInt(translation![1], 10),
      };
    }

    mouseOrigin = { x: e.clientX, y: e.clientY };

    window.addEventListener('mousemove', moveImg, true);
    window.addEventListener('mouseup', mouseUp, false);
  }

  function mouseUp() {
    window.removeEventListener('mousemove', moveImg, true);
  }

  function moveImg(e: MouseEvent) {
    // Where are we now?
    const currentPos = lightboxImg.getBoundingClientRect();

    // Where would we go next?
    const nextTranslate = {
      x: translateOrigin.x + e.clientX - mouseOrigin.x,
      y: translateOrigin.y + e.clientY - mouseOrigin.y,
    };

    // How far would we move?
    const delta = {
      x: nextTranslate.x - translate.x,
      y: nextTranslate.y - translate.y,
    };

    // Where do we actually go next?
    // Only move if inside boundaries, otherwise re-use previous translate
    translate = {
      x:
        currentPos.x + delta.x >= 0 ||
        window.innerWidth - currentPos.x - delta.x >= currentPos.width
          ? translate.x
          : nextTranslate.x,
      y:
        currentPos.y + delta.y >= 0 ||
        window.innerHeight - currentPos.y - delta.y >= currentPos.height
          ? translate.y
          : nextTranslate.y,
    };

    lightboxImgWrapper!.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
  }
}
