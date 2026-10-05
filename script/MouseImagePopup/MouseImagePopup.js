 let IMAGE_POPUP_SETUP_TIMEOUT = null;

 function ImagePopupSetup() {
   if (options['showImagesPopup'] == true && document.body) {
     if (IMAGE_POPUP_SETUP_TIMEOUT) {
       clearTimeout(IMAGE_POPUP_SETUP_TIMEOUT);
     }
     IMAGE_POPUP_SETUP_TIMEOUT = setTimeout(() => {
       IMAGE_POPUP_SETUP_TIMEOUT = null;
       /*
        * ============================================================
        * CRIA O POPUP
        * ============================================================
        */
       if (!document.querySelector("img#imgPopupView")) {
         imgPopup = document.createElement("img");
         imgPopup.id = 'imgPopupView';
         imgPopup.classList = "popup-hidden";
         document.body.appendChild(imgPopup);
         /*
          * O listener de LOAD fica aqui e é criado apenas UMA vez.
          * Antes ele era criado uma vez para cada imagem encontrada.
          */
         imgPopup.addEventListener("load", () => {
           if (!imgPopup) return;
           const mouseX = GLOBAL_MOUSE_X;
           const mouseY = GLOBAL_MOUSE_Y;
           const windowWidth = window.innerWidth;
           const windowHeight = window.innerHeight;
           const imgWidth = imgPopup.width;
           const imgHeight = imgPopup.height;
           // Posição horizontal
           let imgLeft = mouseX + 20;
           if (imgLeft + imgWidth > windowWidth) {
             imgLeft = windowWidth - imgWidth - 240;
           }
           if (imgLeft < 0) {
             imgLeft = 10;
           }
           // Posição vertical
           let imgTop = mouseY + 20;
           if (imgTop + imgHeight > windowHeight) {
             imgTop = windowHeight - imgHeight - 140;
           }
           if (imgTop < 0) {
             imgTop = 10;
           }
           imgPopup.style.left = imgLeft + "px";
           imgPopup.style.top = imgTop + "px";
         });
         imgPopup.addEventListener('mouseout', function(ev) {
           zoomLevel = 1.0;
           imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
           imgPopup.classList = "popup-hidden";
           imgPopup.style.transform = "scale(" + zoomLevel + ")";
         });
         imgPopup.addEventListener('click', function(ev) {
           zoomLevel = 1.0;
           imgPopup.classList = "popup-hidden";
           imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
           imgPopup.style.transform = "scale(" + zoomLevel + ")";
         });
       }
       /*
        * ============================================================
        * PEGA SOMENTE ELEMENTOS DESCOBERTOS PELO VISIBLE_ELEMENTS
        * ============================================================
        */
       const IMAGE_SELECTOR = `
        div[data-e2eid='media-tile'],
        li.image-tile,
        ul.thumbgallery li.thumb,
        div.swiper-wrapper button.gallery__image-tile
      `;
       const images = [];
       for (const element of VISIBLE_ELEMENTS) {
         /*
          * Se o elemento foi removido da página,
          * não precisamos mais mantê-lo no Set.
          */
         if (!element.isConnected) {
           VISIBLE_ELEMENTS.delete(element);
           continue;
         }
         /*
          * Ignora tudo que não pertence ao ImagePopup.
          */
         if (!element.matches || !element.matches(IMAGE_SELECTOR)) {
           continue;
         }
         /*
          * Se não possui imagem, não há nada para processar.
          */
         if (!element.querySelector("img")) {
           continue;
         }
         /*
          * Se já foi processado pelo ImagePopup,
          * não fazemos nada novamente.
          */
         if (element.hasAttribute("POPUP_IMAGE")) {
           continue;
         }
         images.push(element);
       }
       /*
        * ============================================================
        * PROCESSA AS IMAGENS
        * ============================================================
        */
       images.forEach(function(img) {
         let img_li = null;
         /*
          * ----------------------------------------------------------
          * MEDIA TILE / IMAGE TILE
          * ----------------------------------------------------------
          */
         if (img.matches("div[data-e2eid='media-tile'], li.image-tile")) {
           const parent = img.closest("div[data-e2eid='media-tile'], li.image-tile");
           if (parent?.querySelector("a")) {
             img_li = parent.querySelector("a");
           } else {
             img_li = img;
           }
           img_li.setAttribute("POPUP_IMAGE", true);
         }
         /*
          * ----------------------------------------------------------
          * MARCA O ELEMENTO COMO PROCESSADO
          * ----------------------------------------------------------
          */
         img.setAttribute("POPUP_IMAGE", true);
         /*
          * ----------------------------------------------------------
          * EVENTOS DOS LINKS / MEDIA TILES
          * ----------------------------------------------------------
          */
         if (img_li) {
           img_li.addEventListener('mouseenter', async function(ev) {
             if (!options['showImagesPopup']) return;
             let img_id;
             if (!img_li.closest('div[data-e2eid="media-tile"]')) {
               img_id = img_li.href;
             } else {
               img_id = img_li.querySelector("img")?.src;
             }
             if (!img_id) return;
             let gameNameLink = GET_GAME_FROM_IMAGE_URL(img_li);
             let imageId = GET_IMAGE_ID_FROM_URL(img_li);
             if (Number(gameNameLink)) {
               gameNameLink = fingGameNameByID(gameNameLink);
             }
             imgPopup.setAttribute("image_id", imageId);
             imgPopup.setAttribute("gameName", gameNameLink);
             imgPopup.src = img_id;
             imgPopup.setAttribute("OriginalSrc", img_id.replaceAll("/thumbnails", ""));
             if (FIRST_IMAGE_POPUP) {
               CreateNotificationContainer(translate_strings.ImagePopup.description, "success");
               FIRST_IMAGE_POPUP = false;
             }
             imgPopup.classList.remove("popup-hidden");
             await loadImage(img_id.replaceAll("/thumbnails", ""));
           });
           img_li.addEventListener('mouseleave', function(ev) {
             /*
              * Se o mouse foi para o popup,
              * mantém a imagem aberta.
              */
             if (ev.relatedTarget === imgPopup || imgPopup.contains(ev.relatedTarget)) {
               return;
             }
             zoomLevel = 1.0;
             imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
             imgPopup.classList = "popup-hidden";
             imgPopup.style.transform = "scale(" + zoomLevel + ")";
           });
           /*
            * ----------------------------------------------------------
            * GALLERY / SWIPER
            * ----------------------------------------------------------
            */
         } else if (img.querySelector("img")) {
           img.addEventListener('mouseenter', async function(ev) {
               try {
                 if (!options['showImagesPopup']) {
                   return;
                 }
                 const currentUrl = ev.currentTarget.querySelector('img')?.src?.replace("/t/small", "").replace("/thumbnails", "");
                 if (!currentUrl) return;
                 if (lastImgUrl != currentUrl) {
                   lastImgUrl = currentUrl;
                   imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
                   imgPopup.src = lastImgUrl;
                   imgPopup.setAttribute("OriginalSrc", lastImgUrl);
                   imgPopup.classList.remove("popup-hidden");
                   await loadImage(lastImgUrl);
                 }
               } catch (E) {
                 console.error("NexusMods Advance Error:" + E);
               }
             },
             true);
           img.addEventListener('mouseleave', function(ev) {
             if (ev.relatedTarget === imgPopup || imgPopup.contains(ev.relatedTarget)) {
               return;
             }
             lastImgUrl = "";
             zoomLevel = 1.0;
             imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
             imgPopup.classList = "popup-hidden";
             imgPopup.style.transform = "scale(" + zoomLevel + ")";
           });
         }
         
       });
       /*
        * ============================================================
        * FIM
        * ============================================================
        */
    
     }, 100);
   }
 }
 async function loadImage(url) {
   if (controller) {
     controller.abort();
   }
   controller = new AbortController();
   await fetch(url, {
     signal: controller.signal
   }).then(response => {
     if (!response.ok) {
       throw new Error('Erro ao carregar a imagem');
     }
     return response.blob();
   }).then(blob => {
     const imgUrl = URL.createObjectURL(blob);
     imgPopup.src = imgUrl;
   }).catch(error => {
     if (error.name === 'AbortError') {} else {
       console.error('Falha no carregamento da imagem:', error);
       imgPopup.style.opacity = "1";
     }
   });
 }
 async function EndorseImageByPopup(element) {
   if (!element) return;
   let IMG_ID = element.getAttribute('image_id');
   let IMG_GAME = element.getAttribute('gameName');
   const response = await fetch("https://www.nexusmods.com/" + IMG_GAME + "/images/" + IMG_ID, {
     credentials: "include"
   });
   const html = await response.text();
   const parser = new DOMParser();
   const doc = parser.parseFromString(html, "text/html");
   const endorseButton = doc.querySelector("a#button-endorse");
   const csrfToken = endorseButton?.getAttribute("data-csrf-token");
   if (csrfToken) await EndorseImageByPopup_Stage2(IMG_ID, IMG_GAME, csrfToken);
 }
 async function EndorseImageByPopup_Stage2(PopUpimage_id, IMG_GAME, csrfToken) {
   if (SITE_URL.indexOf("/supporterimages/") == -1) {
     support = 0;
   } else {
     support = 1;
   }
   if (PopUpimage_id == null || PopUpimage_id == 'null') {
     return;
   }
   const gameId = fingGameIDBy_DomainName(IMG_GAME);
   const li_element = document.querySelector("div[data-e2eid='media-tile'] a[href*='" + PopUpimage_id + "']")?.closest('div[data-e2eid="media-tile"]').querySelector("svg path[d='M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z']");
   if (li_element) {
     console.log("Endorsando imagem " + PopUpimage_id + " do jogo " + gameId + " Supporter: " + support);
     fetch("https://www.nexusmods.com/images/" + PopUpimage_id + "/endorse", {
       "headers": {
         "accept": "*/*",
         "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
         "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
         "priority": "u=1, i",
         "sec-ch-ua": "\"Chromium\";v=\"152\", \"Not?A_Brand\";v=\"24\", \"Google Chrome\";v=\"152\"",
         "sec-ch-ua-mobile": "?0",
         "sec-ch-ua-platform": "\"Windows\"",
         "sec-fetch-dest": "empty",
         "sec-fetch-mode": "cors",
         "sec-fetch-site": "same-origin",
         "x-requested-with": "XMLHttpRequest"
       },
       "referrer": "https://www.nexusmods.com/" + IMG_GAME + "/images/" + PopUpimage_id,
       "body": "game_id=" + gameId + "&is_supporter=" + support + "&_token=" + encodeURIComponent(csrfToken),
       "method": "POST",
       "mode": "cors",
       "credentials": "include"
     }).then(response => {
       if (!response.ok) {
         CreateNotificationContainer("NexusMods Error: " + response.status, 'error');
         CreateNotificationContainer("Error: " + response.statusText, 'error');
         throw new Error('Erro na requisição: ' + response.statusText);
       }
       return response.json();
     }).then(data => {
       if (data.errors == '') {
         if (data.is_endorsed == 1) {
           CreateNotificationContainer(translate_strings.EndorsePopup_done.message, 'success', 'fa-solid fa-thumbs-up');
           li_element.style.fill = "#02cd21";
         } else if (data.is_endorsed == 0) {
           CreateNotificationContainer(translate_strings.EndorsePopup_undone.message, 'warning', 'fa-regular fa-thumbs-up');
           li_element.style.fill = "#8e8e8e";
         }
         if (li_element.closest("p")?.querySelector("span[data-e2eid*='media-tile-endorsements']")) {
           li_element.closest("p").querySelector("span[data-e2eid*='media-tile-endorsements']").textContent = data.endorsements;
         }
       } else {
         CreateNotificationContainer(data.errors, 'error');
       }
     }).catch(error => {
       CreateNotificationContainer("Endorse Error: " + error, 'error');
       console.error('Erro ao processar a requisição:', error);
     });
   } else {
     CreateNotificationContainer(translate_strings.EndorsePopup_cant.message, 'warning', 'fa-regular fa-thumbs-up');
   }
 }