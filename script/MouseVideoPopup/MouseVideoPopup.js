async function VideoPopupSetup() {
    if (options['showVideosPopup'] == true && current_page != "only_mod_page") {
        var videos = Array.from(document.querySelectorAll('li.video-tile a.mod-image:not([POPUP_SETUP])'));

        for (let index = 0; index < videos.length; index++) {
            let video = videos[index];
            video.setAttribute("POPUP_SETUP", true);

            video.addEventListener('mouseenter', function (ev) {
                zoomLevel = 1.0;

                imgPopup.classList.add('popup-hidden');
                imgPopup.src = "";
                imgPopup.style.transform = "scale(" + zoomLevel + ")";
            });
            video.addEventListener('click', async function (ev) {
                ev.preventDefault();
                video = ev.target.closest('li.video-tile a.mod-image');
                VIDEO_ID = await extrairID(video.href);
                elementView = ev.target.closest("li.video-tile");
                console.log("Video ID: " + VIDEO_ID)
                try {
                    if (!options['showVideosPopup']) {
                        return;
                    }
                    let videoHref = video.href;
                    let videoId = videoHref.match(/\d+$/);
                    if (videoId) {
                        zoomLevel = 1.0;

                        imgPopup.classList.add('popup-hidden');
                        imgPopup.src = "";
                        imgPopup.style.transform = "scale(" + zoomLevel + ")";
                        CREATE_MOD_DESCRIPTION(gameId, videoId[0], 'videos');
                    } else {
                        console.log("ID não encontrado.");
                    }
                } catch (E) {

                    console.error("NexusMods Advance Error:" + E);
                }
            });
        }
    }
}
async function EndorseVideoByPopup(video_id, element) {
    if (SITE_URL.indexOf("/supporterimages/") == -1) {
        support = 0;
    } else {
        support = 1;
    }
    if (video_id == null || video_id == 'null') {
        return;
    }
    const li_element = element.querySelector("a[href*='" + video_id + "']").closest("li").querySelector("svg.icon-endorse");
    if (li_element) {
        console.log("Endorsando vídeo " + video_id + " do jogo " + gameId + " Supporter: " + support);
        fetch("https://www.nexusmods.com/Core/Libs/Common/Managers/Videos?EndorseVideo", {
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
            "body": "game_id=" + gameId + "&video_id=" + video_id + "&is_supporter=" + support,
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