async function PAUSE_GIFS() {
    if ((current_modTab == "posts" || current_modTab == "description") && options['PauseExternalGifs'] == true && !PAUSE_GIFS_BUSY) {
      PAUSE_GIFS_BUSY = true;
      const gifElements = document.querySelectorAll('img[src$=".gif"]:not([GIF_PAUSED])');
  
      gifElements.forEach((gifElement) => {
        if (gifElement.complete) {
          setTimeout(() => {
            requestAnimationFrame(() => GIF_LOAD_LISTENER(gifElement));
          }, 20);
        } else {
          gifElement.onload = () => {
            setTimeout(() => {
              requestAnimationFrame(() => GIF_LOAD_LISTENER(gifElement));
            }, 20);
          };
        }
      });
  
      PAUSE_GIFS_BUSY = false;
    }
  }
  
  function GIF_LOAD_LISTENER(gifElement) {
    const gifUrl = new URL(gifElement.src);
    if (gifUrl.href.includes('/emoticons/') || (gifElement.closest("div.img-wrapper") && gifElement.closest("div.img-wrapper").querySelector("canvas"))) {
      return;
    }
    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    canvasElement.width = gifElement.width;
    canvasElement.height = gifElement.height;
    canvasElement.style.width = '100%';
    canvasElement.style.height = '100%';
    ctx.drawImage(gifElement, 0, 0, gifElement.width, gifElement.height);
  
    canvasElement.onmouseenter = () => {
      gifElement.style.display = 'block';
      canvasElement.style.display = 'none';
    };
    gifElement.onmouseleave = () => {
      ctx.drawImage(gifElement, 0, 0, gifElement.width, gifElement.height);
      gifElement.style.display = 'none';
      canvasElement.style.display = 'block';
    };
    gifElement.parentNode.insertBefore(canvasElement, gifElement);
    gifElement.style.display = 'none';
    gifElement.setAttribute('GIF_PAUSED', 'true');
  }