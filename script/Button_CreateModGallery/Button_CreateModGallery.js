let popupStrip = null;
let __lastGalleryRef = null;
let __lastRenderedCount = 0;
async function CREATE_MOD_IMAGES(modId, gameIDx) {
  if (modPopup_element) {
    modPopup_element.style.display = "none";
  }
  if (modFiles_element) {
    modFiles_element.style.display = "none";
  }
  if (modPreview_element) {
    document.querySelector("div#modPreview div").innerText = "Loading Gallery...";
    document.querySelector("div#modPreview div").style.display = "block";
    modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
    modPreview_element.style.display = 'flex';
    clearTimeout(messageLoop);
    messageLoop = setTimeout(function() {
      document.querySelector("div#modPreview div").style.display = "none";
    }, 6000);
  } else {
    modPreview_element = document.createElement("div");
    modPreview_element.id = "modPreview";
    modPreview_element.style.display = "none";
    divClose = document.createElement("i");
    divClose.classList = "fa-solid fa-circle-xmark";
    divClose.setAttribute("aria-hidden", true);
    divClose.id = "closePopButton";
    divClose.addEventListener("click", function(ev) {
      STILL_LOADING = false;
      ev.target.closest("div#modPreview").style.display = 'none';
      popupStrip.style.display = 'none';
      popupStrip.innerHTML = "";
      __lastGalleryRef = null;
      __lastRenderedCount = 0;
    });
    divTxt = document.createElement("div");
    divTxt.innerText = "Use the Arrow Keys Up and Down to change images, mouse to Move the Popup and ESC to close";
    divTxt.innerText = translate_strings.ImagePopup.message;
    divTxt.id = "divDesc";
    divDesc = document.createElement("div");
    divDesc.innerText = "Loading Images... (ESC to cancel)";
    divDesc.id = "divDescription";
    divImage = document.createElement("div");
    divImage.id = 'ImageView';
    modPreview_element.appendChild(divTxt);
    modPreview_element.appendChild(divDesc);
    modPreview_element.appendChild(divClose);
    modPreview_element.appendChild(divImage);
    modPreview_element.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.body.appendChild(modPreview_element);
    if (!window.__NMA_PREVIEW_RESIZE_OBSERVER__) {
      window.__NMA_PREVIEW_RESIZE_OBSERVER__ = new ResizeObserver(() => {
        SYNC_THUMB_STRIP_POSITION();
        UPDATE_THUMB_STRIP_ACTIVE();
      });
    }
    window.__NMA_PREVIEW_RESIZE_OBSERVER__.observe(modPreview_element);
    document.querySelector("div#modPreview div").innerText = "Loading Gallery...";
    document.querySelector("div#modPreview div").style.display = "block";
    modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
    clearTimeout(messageLoop);
    messageLoop = setTimeout(function() {
      document.querySelector("div#modPreview div").style.display = "none";
    }, 6000);
    UPDATE_THUMB_STRIP_ACTIVE();
    SYNC_THUMB_STRIP_POSITION();
  }
  if (!document.querySelector("div#modPreviewThumbs") && !popupStrip) {
    popupStrip = document.createElement("div");
    popupStrip.id = "modPreviewThumbs";
    popupStrip.style.display = "none";
    document.body.appendChild(popupStrip);
  } else {
    popupStrip.style.display = "flex";
  }
  needMove = true;
  MoveLoop(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y, modPreview_element);
  console.log("Carregando MOD " + modId + " do game " + gameIDx);
  STILL_LOADING = true;
  GALLERY_STARTED = false;
  curPage = 0;
  await GET_MOD_IMAGES_COUNT(modId, gameIDx);
}
async function GET_MOD_IMAGES_COUNT(modId, game_idx) {
  try {
    const response = await fetch(`https://www.nexusmods.com/Core/Libs/Common/Widgets/ModImagesTab?id=${modId}&game_id=${game_idx}&user_is_blocked=`, http_headers);
    if (response.ok) {
      const htmlString = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      LOAD_OTHER_IMAGEPAGES(doc.body, modId, game_idx);
    } else {
      console.error(`Erro na requisição: Status ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erro ao realizar a requisição:', error);
  }
}
async function FETCH_MOD_IMAGES(modId, page, tab, game_idx) {
  if (!STILL_LOADING) {
    return null;
  }
  const tabParam = tab === '2page' ? 'RH_ModImagesList2' : 'RH_ModImagesList1';
  const groupId = tab === '2page' ? 2 : 1;
  const fetchUrl = `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModImagesList?${tabParam}=game_id:${game_idx},id:${modId},page_size:24,${tab}:${page},rh_group_id:${groupId}`;
  try {
    const response = await fetch(fetchUrl, http_headers);
    if (response.ok) {
      const htmlString = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const resultElements = doc.querySelectorAll('a.mod-image');
      return Array.from(resultElements).map(img => {
        let ImgObject = {
          imageUrl: '',
          description: ''
        };
        const tileNameElement = img.querySelector('div.tile-desc p.tile-name');
        ImgObject.description = tileNameElement ? tileNameElement.innerText.trim() : '';
        ImgObject.imageUrl = img.querySelector('img[id^="mod-image-"]').src || '';
        ImgObject.thumbnailUrl = ImgObject.imageUrl;
        ImgObject.imageUrl = ImgObject.imageUrl.replace('/thumbnails', '');
        return ImgObject;
      });
    } else {
      console.error(`Erro na requisição: Status ${response.status} ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error('Erro ao realizar a requisição:', error);
    return null;
  }
}
async function LOAD_OTHER_IMAGEPAGES(element_Parse, modId, GameIDX) {
  function isNumberElement(element) {
    return element.tagName === 'LI' && !isNaN(parseInt(element.innerText.trim(), 10));
  }
  const firstPageSelect = element_Parse.querySelector("div.pagination select[id='1page_t']");
  if (firstPageSelect) {
    const part_1_document = firstPageSelect.closest("div.pagination");
    let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;
    while (part_1_pages && !isNumberElement(part_1_pages)) {
      part_1_pages = part_1_pages.previousElementSibling;
    }
    maxPages1 = part_1_pages ? parseInt(part_1_pages.innerText.trim(), 10) : 1;
    console.log("Primeira Paginação: " + maxPages1);
  }
  const secondPageSelect = element_Parse.querySelector("div.pagination select[id='2page_t']");
  if (secondPageSelect) {
    const part_2_document = secondPageSelect.closest("div.pagination");
    let part_2_pages = part_2_document.querySelector('ul.clearfix').lastElementChild;
    while (part_2_pages && !isNumberElement(part_2_pages)) {
      part_2_pages = part_2_pages.previousElementSibling;
    }
    maxPages2 = part_2_pages ? parseInt(part_2_pages.innerText.trim(), 10) : 1;
    console.log("Segunda Paginação: " + maxPages2);
  }
  GALLERY = [];
  for (let curPage = 1; curPage <= maxPages1; curPage++) {
    const images = await FETCH_MOD_IMAGES(modId, curPage, '1page', GameIDX);
    if (images == null || images.some(img => !img.imageUrl)) {
      console.log("Cancelando o loop: Encontrado `imageUrl` vazio.");
      STILL_LOADING = true;
      break;
    }
    GALLERY.push(...images);
    RENDER_THUMB_STRIP();
    if (!GALLERY_STARTED && GALLERY.length > 0) {
      await SHOW_MOD_IMAGES();
      GALLERY_STARTED = true;
    }
  }
  for (let curPage = 1; curPage <= maxPages2; curPage++) {
    const images = await FETCH_MOD_IMAGES(modId, curPage, '2page', GameIDX);
    if (images == null || images.some(img => !img.imageUrl)) {
      console.log("Cancelando o loop: Encontrado `imageUrl` vazio.");
      STILL_LOADING = true;
      break;
    }
    GALLERY.push(...images);
    RENDER_THUMB_STRIP();
  }
}
// ============================================================
// IMAGE DISPLAY
// ============================================================
async function SHOW_MOD_IMAGES() {
  currentImageIndex = 0;
  modPreview_element.querySelector("div#ImageView").classList.remove("modPreview_Rotating");
  modPreview_element.querySelector("div#ImageView").style.backgroundImage = "url(" + GALLERY[0].imageUrl + ")";
  modPreview_element.querySelector("div#divDescription").innerText = GALLERY[0].description;
  modPreview_element.style.display = "flex";
  document.querySelector("div#modPreview div").style.display = "block";
  document.querySelector("div#modPreview div").innerText = "Use as Setas do Teclado ou A/D para navegar entre as imagens, ESC para fechar o PopUp e Ctrl+S para salvar a imagem atual";
  divTxt.innerText = translate_strings.ImagePopup.message;
  clearTimeout(messageLoop);
  messageLoop = setTimeout(function() {
    document.querySelector("div#modPreview div").style.display = "none";
  }, 6000);
  UPDATE_THUMB_STRIP_ACTIVE();
  SYNC_THUMB_STRIP_POSITION();
}
async function POPUP_IMAGES(imageUrls, direction) {
  if (imageUrls.length > 0) {
    if (direction == 1) {
      if (imageUrls[currentImageIndex + 1]) {
        currentImageIndex++;
      } else {
        currentImageIndex = 0;
      }
    } else {
      if (imageUrls[currentImageIndex - 1]) {
        currentImageIndex--;
      } else {
        currentImageIndex = imageUrls.length - 1;
      }
    }
    if (imageUrls[currentImageIndex]) {
      modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
      const currentIndex = currentImageIndex + 1;
      document.querySelector("div#modPreview div").innerText = `Loading Image... [${currentIndex}/${imageUrls.length}]`;
      document.querySelector("div#modPreview div").style.display = "block";
      clearTimeout(messageLoop);
      const img = new Image();
      img.onload = function() {
        modPreview_element.querySelector("div#ImageView").style.backgroundImage = `url(${imageUrls[currentImageIndex].imageUrl})`;
        modPreview_element.querySelector("div#ImageView").classList.remove("modPreview_Rotating");
        messageLoop = setTimeout(function() {
          document.querySelector("div#modPreview div").style.display = "none";
        }, 200);
      };
      modPreview_element.querySelector("div#divDescription").innerText = imageUrls[currentImageIndex].description;
      img.src = imageUrls[currentImageIndex].imageUrl;
    }
  }
  UPDATE_THUMB_STRIP_ACTIVE();
}

function GOTO_IMAGE(index) {
  if (!GALLERY || GALLERY.length === 0) return;
  if (index < 0 || index >= GALLERY.length) return;
  currentImageIndex = index;
  modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
  const currentIndex = currentImageIndex + 1;
  document.querySelector("div#modPreview div").innerText = `Loading Image... [${currentIndex}/${GALLERY.length}]`;
  document.querySelector("div#modPreview div").style.display = "block";
  const img = new Image();
  img.onload = function() {
    modPreview_element.querySelector("div#ImageView").style.backgroundImage = `url(${GALLERY[currentImageIndex].imageUrl})`;
    modPreview_element.querySelector("div#ImageView").classList.remove("modPreview_Rotating");
    messageLoop = setTimeout(function() {
      document.querySelector("div#modPreview div").style.display = "none";
    }, 200);
  };
  modPreview_element.querySelector("div#divDescription").innerText = GALLERY[currentImageIndex].description;
  img.src = GALLERY[currentImageIndex].imageUrl;
  UPDATE_THUMB_STRIP_ACTIVE();
}
// ============================================================
// THUMB STRIP
// ============================================================
function RENDER_THUMB_STRIP() {
  const strip = document.querySelector("div#modPreviewThumbs");
  if (!strip || !modPreview_element || !GALLERY || GALLERY.length === 0) return;
  if (GALLERY !== __lastGalleryRef) {
    strip.innerHTML = "";
    __lastGalleryRef = GALLERY;
    __lastRenderedCount = 0;
  }
  for (let i = __lastRenderedCount; i < GALLERY.length; i++) {
    const item = GALLERY[i];
    const thumb = document.createElement("img");
    thumb.src = item.thumbnailUrl;
    thumb.loading = "lazy";
    thumb.decoding = "async";
    thumb.classList.add("modPreviewThumb");
    thumb.setAttribute("data-index", i);
    if (i === currentImageIndex) {
      thumb.classList.add("modPreviewThumb-active");
    }
    thumb.addEventListener("click", () => {
      GOTO_IMAGE(i);
    });
    strip.appendChild(thumb);
  }
  __lastRenderedCount = GALLERY.length;
  SYNC_THUMB_STRIP_POSITION();
}

function SYNC_THUMB_STRIP_POSITION() {
  const strip = document.querySelector("div#modPreviewThumbs");
  if (!strip || !modPreview_element) return;
  if (modPreview_element.style.display === "none" || !GALLERY || GALLERY.length === 0) {
    strip.style.display = "none";
    return;
  }
  const rect = modPreview_element.getBoundingClientRect();
  const docLeft = rect.left + window.scrollX;
  const docTop = rect.top + window.scrollY;
  strip.style.display = "flex";
  strip.style.left = docLeft + "px";
  strip.style.top = (docTop + rect.height) + "px";
  strip.style.width = rect.width + "px";
}

function UPDATE_THUMB_STRIP_ACTIVE() {
  const strip = document.querySelector("div#modPreviewThumbs");
  if (!strip) return;
  let activeThumb = null;
  strip.querySelectorAll(".modPreviewThumb").forEach((thumb) => {
    const idx = Number(thumb.getAttribute("data-index"));
    const isActive = idx === currentImageIndex;
    thumb.classList.toggle("modPreviewThumb-active", isActive);
    if (isActive) activeThumb = thumb;
  });
  if (!activeThumb) return;
  const thumbLeft = activeThumb.offsetLeft;
  const thumbRight = thumbLeft + activeThumb.offsetWidth;
  const stripScrollLeft = strip.scrollLeft;
  const stripWidth = strip.clientWidth;
  if (thumbLeft < stripScrollLeft) {
    strip.scrollTo({
      left: thumbLeft - 8,
      behavior: "smooth"
    });
  } else if (thumbRight > stripScrollLeft + stripWidth) {
    strip.scrollTo({
      left: thumbRight - stripWidth + 8,
      behavior: "smooth"
    });
  }
}