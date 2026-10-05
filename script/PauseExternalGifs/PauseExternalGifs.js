function PAUSE_GIFS() {
 if (
  (
    (current_page == "only_mod_page" && (current_modTab == "posts" || current_modTab == "description")) ||
    SITE_URL.includes("/collections/") ||
    (current_page == "mod_pages_all"||current_page=="home_page")
  ) &&
  options['PauseExternalGifs'] == true &&
  !PAUSE_GIFS_BUSY
) {
    PAUSE_GIFS_BUSY = true;
    for (const gifElement of VISIBLE_ELEMENTS) {
      if (!gifElement.isConnected) {
        VISIBLE_ELEMENTS.delete(gifElement);
        continue;
      }
      //gifElement.src.includes("staticdelivery.nexusmods.com")
      if (!gifElement.matches || !gifElement.matches('img[src$=".gif"]:not([GIF_PAUSED]),' + 'img[src$="animated=true"]:not([GIF_PAUSED]),' + 'img[src$=".avif"]:not([GIF_PAUSED])')) {
        continue;
      }
      if (gifElement.closest("div#modPreviewThumbs")||gifElement.closest("div.lg")) {
        continue;
      }
      if (gifElement.complete) {
        if (gifElement.naturalWidth > 0) {
          setTimeout(() => {
            requestAnimationFrame(() => GIF_LOAD_LISTENER(gifElement));
          }, 20);
        }
      } else {
        gifElement.onload = () => {
          if (gifElement.naturalWidth > 0) {
            setTimeout(() => {
              requestAnimationFrame(() => GIF_LOAD_LISTENER(gifElement));
            }, 20);
          }
        };
      }
    }
    PAUSE_GIFS_BUSY = false;
  }
}

function GIF_LOAD_LISTENER(gifElement) {
  const gifUrl = new URL(gifElement.src);
  if (gifUrl.href.includes('/emoticons/') || (gifElement.closest("div.img-wrapper") && gifElement.closest("div.img-wrapper").querySelector("canvas")) || (gifElement.parentElement && gifElement.parentElement.querySelector("canvas"))) {
    return;
  }
  // Guarda a URL original antes de qualquer mexida (usado pra reiniciar no hover)
  const originalSrc = gifElement.src;
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d');
  canvasElement.classList.add("gif-canvas");
  const rect = gifElement.getBoundingClientRect();
  const renderedW = Math.max(1, Math.round(rect.width || gifElement.naturalWidth));
  const renderedH = Math.max(1, Math.round(rect.height || gifElement.naturalHeight));
  canvasElement.width = renderedW;
  canvasElement.height = renderedH;
  canvasElement.style.width = renderedW + 'px';
  canvasElement.style.height = renderedH + 'px';
  const imgStyle = getComputedStyle(gifElement);
  canvasElement.style.borderRadius = imgStyle.borderRadius;
  canvasElement.style.objectFit = imgStyle.objectFit;
  canvasElement.style.display = 'block';
  drawGifFrame(ctx, gifElement, renderedW, renderedH, imgStyle.objectFit);
  canvasElement.onmouseenter = () => {
    gifElement.removeAttribute('src');
    gifElement.setAttribute('src', originalSrc);
    gifElement.style.display = 'block';
    canvasElement.style.display = 'none';
  };
  gifElement.onmouseleave = () => {
    drawGifFrame(ctx, gifElement, renderedW, renderedH, imgStyle.objectFit);
    gifElement.style.display = 'none';
    canvasElement.style.display = 'block';
  };
  gifElement.parentNode.insertBefore(canvasElement, gifElement);
  gifElement.style.display = 'none';
  gifElement.setAttribute('GIF_PAUSED', 'true');
}

function drawGifFrame(ctx, img, targetW, targetH, objectFit) {
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;
  if (!imgW || !imgH) return;
  if (objectFit !== 'cover' && objectFit !== 'contain') {
    ctx.drawImage(img, 0, 0, targetW, targetH);
    return;
  }
  const imgAspect = imgW / imgH;
  const targetAspect = targetW / targetH;
  let sx, sy, sw, sh;
  if ((objectFit === 'cover' && imgAspect > targetAspect) || (objectFit === 'contain' && imgAspect < targetAspect)) {
    // corta/letterbox nas laterais
    sh = imgH;
    sw = sh * targetAspect;
    sx = (imgW - sw) / 2;
    sy = 0;
  } else {
    // corta/letterbox em cima e embaixo
    sw = imgW;
    sh = sw / targetAspect;
    sx = 0;
    sy = (imgH - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
}