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
        var images = Array.from(document.querySelectorAll('li:not(.video-tile) a.mod-image:not([POPUP_SETUP])')).filter(function (link) {
            const foreDiv = link.querySelector('div.fore, div.fore_div');
            return foreDiv && foreDiv.querySelector('img');
        });

        if (SITE_URL.indexOf("next.nexusmods.com/") != -1) {
            const nextData = Array.from(document.querySelectorAll("div.swiper-wrapper div:not([POPUP_SETUP])"));
            images = images.concat(nextData);
        }

        images.forEach(function (img, index) {
            if (img.closest("li")) {
                var img_li = img.closest('li').querySelector('a.mod-image');
                img_li.setAttribute("POPUP_SETUP", true);
            }

            img.setAttribute("POPUP_SETUP", true);
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
                    try {
                        if (!options['showImagesPopup']) {
                            return;
                        }
                        const img_id = await extrairID(img_li.href) || null;
                        if (ev.currentTarget.querySelector('div.fore_div') && ev.currentTarget.querySelector('div.fore_div img').src) {

                            imgPopup.src = ev.currentTarget.querySelector('div.fore_div img').src;
                            loadImage(ev.currentTarget.querySelector('div.fore_div img').src.replace("/thumbnails", ""))
                        } else if (ev.currentTarget.querySelector('div.fore')) {
                            imgPopup.src = ev.currentTarget.querySelector('div.fore_div img').src;
                            loadImage(ev.currentTarget.querySelector('div.fore img').src.replace("/thumbnails", ""))
                        }

                        imgPopup.setAttribute("image_id", img_id);
                        if (FIRST_IMAGE_POPUP) {
                            CreateNotificationContainer(translate_strings.ImagePopup.description, "success");
                            FIRST_IMAGE_POPUP = false;
                        }
                        clearInterval(funcLoop);
                        lastImg = document.elementFromPoint(ev.clientX, ev.clientY).nodeName;
                        funcLoop = setInterval(PopUpImage_Check, 200);
                        imgPopup.classList.remove("popup-hidden");
                    } catch (E) {
                        console.error("NexusMods Advance Error:" + E);
                    }
                });

                img_li.addEventListener('mouseleave', function (ev) {
                    if (!img_li.closest("li").contains(ev.relatedTarget) && ev.relatedTarget !== imgPopup && !imgPopup.contains(ev.relatedTarget)) {
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
    if (SITE_URL.indexOf("/supporterimages/") == -1) {
        support = 0;
    } else {
        support = 1;
    }
    if (PopUpimage_id == null || PopUpimage_id == 'null') {
        return;
    }
    const li_element = document.querySelector("li a[href*='" + PopUpimage_id + "']").closest("li").querySelector("svg.icon-endorse");
    if (li_element) {
        console.log("Endorsando imagem " + PopUpimage_id + " do jogo " + gameId + " Supporter: " + support);
        fetch("https://www.nexusmods.com/Core/Libs/Common/Managers/Images?EndorseImage", {
            "headers": {
                "accept": "*/*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Brave\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.nexusmods.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "game_id=" + gameId + "&image_id=" + PopUpimage_id + "&is_supporter=" + support,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
            .then(response => {
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