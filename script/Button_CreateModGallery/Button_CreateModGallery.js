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
        messageLoop = setTimeout(function () {
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
        divClose.addEventListener("click", function (ev) {
            STILL_LOADING = false;
            ev.target.closest("div#modPreview").style.display = 'none';
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
        document.querySelector("div#modPreview div").innerText = "Loading Gallery...";
        document.querySelector("div#modPreview div").style.display = "block";
        modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
        clearTimeout(messageLoop);
        messageLoop = setTimeout(function () {
            document.querySelector("div#modPreview div").style.display = "none";
        }, 6000);

    }
    needMove = true;
    await MoveLoop(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y, modPreview_element);
    console.log("Carregando MOD " + modId + " do game " + gameIDx)
    STILL_LOADING = true;
    GALLERY_STARTED = false;
    curPage = 0;
    await GET_MOD_IMAGES_COUNT(modId, gameIDx)

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

    // Constrói a URL de acordo com 'tab' e 'groupId'
    const fetchUrl = `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModImagesList?${tabParam}=game_id:${game_idx},id:${modId},page_size:24,${tab}:${page},rh_group_id:${groupId}`;

    try {
        const response = await fetch(fetchUrl, http_headers);

        if (response.ok) { // Verifica se o status HTTP está no intervalo 200-299
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
                ImgObject.imageUrl = ImgObject.imageUrl.replace('/thumbnails', '');
                return ImgObject;
            });
        } else {
            console.error(`Erro na requisição: Status ${response.status} ${response.statusText}`);
            // Aqui você pode tratar erros ou retornar um valor padrão se o status não for 200
            return null;
        }
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        // Aqui você pode tratar exceções ou erros de rede
        return null;
    }
}

async function LOAD_OTHER_IMAGEPAGES(element_Parse, modId, GameIDX) {

    // Função auxiliar para verificar se o elemento é um número
    function isNumberElement(element) {
        return element.tagName === 'LI' && !isNaN(parseInt(element.innerText.trim(), 10));
    }

    // Primeira paginação
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

    // Segunda paginação
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
    // Carrega as imagens da primeira paginação
    for (let curPage = 1; curPage <= maxPages1; curPage++) {
        const images = await FETCH_MOD_IMAGES(modId, curPage, '1page', GameIDX);
        if (images == null || images.some(img => !img.imageUrl)) {
            console.log("Cancelando o loop: Encontrado `imageUrl` vazio.");
            STILL_LOADING = true;
            break; // Encerra o loop se encontrar um `imageUrl` vazio
        }

        GALLERY.push(...images);

        // Chama SHOW_MOD_IMAGES assim que GALLERY tiver algum resultado
        if (!GALLERY_STARTED && GALLERY.length > 0) {
            await SHOW_MOD_IMAGES();
            GALLERY_STARTED = true;
        }
    }

    // Carrega as imagens da segunda paginação
    for (let curPage = 1; curPage <= maxPages2; curPage++) {

        const images = await FETCH_MOD_IMAGES(modId, curPage, '2page', GameIDX);
        if (images == null || images.some(img => !img.imageUrl)) {
            console.log("Cancelando o loop: Encontrado `imageUrl` vazio.");
            STILL_LOADING = true;
            break; // Encerra o loop se encontrar um `imageUrl` vazio
        }
        GALLERY.push(...images);

    }

}

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
    messageLoop = setTimeout(function () {
        document.querySelector("div#modPreview div").style.display = "none";
    }, 6000);
}

async function POPUP_IMAGES(imageUrls, direction){
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
        const currentIndex = currentImageIndex + 1; // Adiciona 1 para exibir como 1-based index
        document.querySelector("div#modPreview div").innerText = `Loading Image... [${currentIndex}/${imageUrls.length}]`;

        document.querySelector("div#modPreview div").style.display = "block";
        clearTimeout(messageLoop);

        const img = new Image();
        img.onload = function () {
          modPreview_element.querySelector("div#ImageView").style.backgroundImage = `url(${imageUrls[currentImageIndex].imageUrl})`;
          modPreview_element.querySelector("div#ImageView").classList.remove("modPreview_Rotating");
          messageLoop = setTimeout(function () {
            document.querySelector("div#modPreview div").style.display = "none";
          }, 200);
        };

        modPreview_element.querySelector("div#divDescription").innerText = imageUrls[currentImageIndex].description;
        img.src = imageUrls[currentImageIndex].imageUrl;

      }
    }
  }