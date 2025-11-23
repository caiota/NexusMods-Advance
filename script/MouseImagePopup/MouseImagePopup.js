async function ImagePopupSetup() {
    if (options['showImagesPopup'] == true && document.body) {
        if (!document.querySelector("img#imgPopupView")) {
            imgPopup = document.createElement("img");
            imgPopup.id = 'imgPopupView';
            imgPopup.classList = "popup-hidden"
            document.body.appendChild(imgPopup);
        }
        imgPopup.addEventListener('mouseout', function (ev) {
            zoomLevel = 1.0;
            imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
            imgPopup.classList = "popup-hidden"
            imgPopup.style.transform = "scale(" + zoomLevel + ")";
        });
        imgPopup.addEventListener('click', function (ev) {
            zoomLevel = 1.0;
            imgPopup.classList = "popup-hidden"
            imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
            imgPopup.style.transform = "scale(" + zoomLevel + ")";
        });
        var images = Array.from(document.querySelectorAll('div[data-e2eid="media-tile"]:not([POPUP_IMAGE]),li.image-tile')).filter(function (link) {
            
            return link.querySelector('img');
        });

        images.forEach(function (img, index) {
            if (img.closest("div[data-e2eid='media-tile'],li.image-tile")) {
                if(img.closest("div[data-e2eid='media-tile'],li.image-tile").querySelector('a')){
                var img_li = img.closest("div[data-e2eid='media-tile'],li.image-tile").querySelector('a');
                }else{
                var img_li = img;
                }
                img_li.setAttribute("POPUP_IMAGE", true);
            }

            img.setAttribute("POPUP_IMAGE", true);
            const img_button = img;
            imgPopup.addEventListener("load", (ev) => {
                if (imgPopup) {
                    const mouseX = GLOBAL_MOUSE_X;
                    const mouseY = GLOBAL_MOUSE_Y;

                    // Dimensões da janela e da imagem
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
                    const imgWidth = imgPopup.width;
                    const imgHeight = imgPopup.height;

                    // Ajustar a posição da imagem horizontalmente (eixo X)
                    let imgLeft = mouseX + 20;
                    if (imgLeft + imgWidth > windowWidth) {
                        imgLeft = windowWidth - imgWidth - 240; // Mantém a imagem dentro da tela à direita
                    }
                    if (imgLeft < 0) {
                        imgLeft = 10; // Mantém a imagem dentro da tela à esquerda
                    }

                    // Ajustar a posição da imagem verticalmente (eixo Y)
                    let imgTop = mouseY + 20;
                    if (imgTop + imgHeight > windowHeight) {
                        imgTop = windowHeight - imgHeight - 140; // Mantém a imagem dentro da tela na parte inferior
                    }
                    if (imgTop < 0) {
                        imgTop = 10; // Mantém a imagem dentro da tela na parte superior
                    }

                    // Atualiza a posição da imagem
                    imgPopup.style.left = imgLeft + "px";
                    imgPopup.style.top = imgTop + "px";
                }
            })
            if (img_li) {
                img_li.addEventListener('mouseenter', async function (ev) {
                  
                        if (!options['showImagesPopup']) {
                            return;
                        }
                        if(!img_li.closest('div[data-e2eid="media-tile"]')){
                        var img_id = img_li.href;
                        }else{
                        var img_id = img_li.querySelector("img").src;
                        }
                        
                       

                            imgPopup.src = img_id;
                            loadImage(img_id.replace("/thumbnails", ""))
                       
                        if (FIRST_IMAGE_POPUP) {
                            CreateNotificationContainer(translate_strings.ImagePopup.description, "success");
                            FIRST_IMAGE_POPUP = false;
                        }
                        clearInterval(funcLoop);
                        lastImg = document.elementFromPoint(ev.clientX, ev.clientY).nodeName;
                        funcLoop = setInterval(PopUpImage_Check, 200);
                        imgPopup.classList.remove("popup-hidden");
                    
                });

                img_li.addEventListener('mouseleave', function (ev) {
                    if (!img_li.closest("div[data-e2eid='media-tile'],li.image-tile").contains(ev.relatedTarget) && ev.relatedTarget !== imgPopup && !imgPopup.contains(ev.relatedTarget)) {
                        zoomLevel = 1.0;
                        imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
                        imgPopup.classList = "popup-hidden"
                        imgPopup.style.transform = "scale(" + zoomLevel + ")";
                    }
                });
            } else if (img_button && img_button.querySelector("img")) {
                img_button.addEventListener('mouseenter', function (ev) {
                    try {
                        if (!options['showImagesPopup']) {
                            return;

                        }
                        if (lastImgUrl != ev.currentTarget.querySelector('img').src.replace("/t/small", "")) {
                            lastImgUrl = ev.currentTarget.querySelector('img').src.replace("/t/small", "");
                            imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
                            imgPopup.src = lastImgUrl;
                            lastImg = document.elementFromPoint(ev.clientX, ev.clientY).nodeName;
                            clearInterval(funcLoop);
                            funcLoop = setInterval(PopUpImage_Check, 200);
                            imgPopup.classList.remove("popup-hidden");
                        }
                    } catch (E) {
                        console.error("NexusMods Advance Error:" + E);
                    }
                }, true);

                img_button.addEventListener('mouseleave', function (ev) {
                    lastImgUrl = "";
                    if (!img_button.contains(ev.relatedTarget) && ev.relatedTarget !== imgPopup && !imgPopup.contains(ev.relatedTarget)) {
                        zoomLevel = 1.0;
                        imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
                        imgPopup.classList = "popup-hidden"
                        imgPopup.style.transform = "scale(" + zoomLevel + ")";
                    }
                });
            }
        })
    }
}
function PopUpImage_Check() {
    if (currentImg == "IMG") {
        lastImg = 'IMG';
    }
    if (currentImg != lastImg) {
        lastImg = null;
        currentImg = null;
        zoomLevel = 1.0;
        imgPopup.src = "https://www.nexusmods.com/assets/images/default/noimage.svg";
        imgPopup.classList = "popup-hidden"
        imgPopup.style.transform = "scale(" + zoomLevel + ")";
        clearInterval(funcLoop);
    }
}

function loadImage(url) {
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();

    fetch(url, { signal: controller.signal })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar a imagem');
            }
            return response.blob();
        })
        .then(blob => {
            const imgUrl = URL.createObjectURL(blob);
            imgPopup.src = imgUrl;
        })
        .catch(error => {
            if (error.name === 'AbortError') {

            } else {
                console.error('Falha no carregamento da imagem:', error);
            }
        });
}

async function EndorseImageByPopup(PopUpimage_id) {
    return;
    if (SITE_URL.indexOf("/supporterimages/") == -1) {
        support = 0;
    } else {
        support = 1;
    }
    if (PopUpimage_id == null || PopUpimage_id == 'null') {
        return;
    }
    console.log(PopUpimage_id)
    const li_element = document.querySelector("div[data-e2eid='media-tile'] a[href*='" + PopUpimage_id + "']").closest('div[data-e2eid="media-tile"]').querySelector("svg path[d='M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z']");
    if (li_element) {
        console.log("Endorsando imagem " + PopUpimage_id + " do jogo " + gameId + " Supporter: " + support);

        fetch("https://www.nexusmods.com/images/"+PopUpimage_id+"/endorse", {
  "headers": {
    "accept": "*/*",
    "accept-language": "pt-BR,pt;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Brave\";v=\"140\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://www.nexusmods.com/skyrimspecialedition/images/"+PopUpimage_id,
  "body": "game_id=" + gameId + "&image_id=" + PopUpimage_id + "&is_supporter=" + support,
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}) .then(response => {
                // Verifica se a resposta foi bem-sucedida
                if (!response.ok) {
                    CreateNotificationContainer("NexusMods Error: " + response.status, 'error')
                    CreateNotificationContainer("Error: " + response.statusText, 'error')
                    throw new Error('Erro na requisição: ' + response.statusText);
                }
                // Converte a resposta em JSON
                return response.json();
            })
            .then(data => {
                if (data.errors == '') {
                    if (data.is_endorsed == 1) {
                        CreateNotificationContainer(translate_strings.EndorsePopup_done.message, 'success', 'fa-solid fa-thumbs-up')
                        li_element.style.fill = "#02cd21";
                    }
                    else if (data.is_endorsed == 0) {
                        CreateNotificationContainer(translate_strings.EndorsePopup_undone.message, 'warning', 'fa-regular fa-thumbs-up')
                        li_element.style.fill = "#8e8e8e";
                    }
                    li_element.closest("li.endorsecount").querySelector("span").textContent = data.endorsements
                } else {
                    CreateNotificationContainer(data.errors, 'error')
                }
            })
            .catch(error => {
                // Trata possíveis erros
                CreateNotificationContainer("Endorse Error: " + error, 'error')
                console.error('Erro ao processar a requisição:', error);
            });


           

    } else {

        CreateNotificationContainer(translate_strings.EndorsePopup_cant.message, 'warning', 'fa-regular fa-thumbs-up')
    }
}