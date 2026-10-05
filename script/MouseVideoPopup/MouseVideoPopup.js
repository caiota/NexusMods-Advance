 let VIDEO_POPUP_TIMEOUT = null;

 function VideoPopupSetup() {
   if (options['showVideosPopup'] != true || current_page == "only_mod_page") {
     return;
   }
   if (VIDEO_POPUP_TIMEOUT) {
     clearTimeout(VIDEO_POPUP_TIMEOUT);
   }
   VIDEO_POPUP_TIMEOUT = setTimeout(() => {
     VIDEO_POPUP_TIMEOUT = null;
     const VIDEO_SELECTOR = "div[data-e2eid='media-tile']";
     for (const mediaTile of VISIBLE_ELEMENTS) {
       if (!mediaTile.isConnected) {
         VISIBLE_ELEMENTS.delete(mediaTile);
         continue;
       }
       if (!mediaTile.matches || !mediaTile.matches(VIDEO_SELECTOR)) {
         continue;
       }
       const video = mediaTile.querySelector("a:has(svg[role='presentation'] path[d='M8,5.14V19.14L19,12.14L8,5.14Z'])");
       if (!video) {
         continue;
       }
       if (video.hasAttribute("POPUP_VIDEO")) {
         continue;
       }
       video.setAttribute("POPUP_VIDEO", true);
       video.addEventListener("mouseenter", function() {
         zoomLevel = 1.0;
         imgPopup.classList.add('popup-hidden');
         imgPopup.src = "";
         imgPopup.style.transform = "scale(" + zoomLevel + ")";
       });
       video.addEventListener("click", async function(ev) {
         ev.preventDefault();
         const clickedVideo = ev.target.closest('div[data-e2eid="media-tile"] a');
         if (!clickedVideo) {
           return;
         }
         gameId = new URL(clickedVideo.href);
         gameId = gameId.pathname.split("/")[1];
         VIDEO_ID = extrairID(clickedVideo.href);
         elementView = ev.target.closest('div[data-e2eid="media-tile"]');
         console.log("Video ID: " + VIDEO_ID);
         try {
           if (!options['showVideosPopup']) {
             return;
           }
           const videoHref = clickedVideo.href;
           const videoId = videoHref.match(/\d+$/);
           if (videoId) {
             zoomLevel = 1.0;
             imgPopup.classList.add('popup-hidden');
             imgPopup.src = "";
             imgPopup.style.transform = "scale(" + zoomLevel + ")";
             console.warn(gameId.replaceAll(" ", "").toLowerCase());
             CREATE_MOD_DESCRIPTION(gameId.replaceAll(" ", "").toLowerCase(), videoId[0], 'videos');
           } else {
             console.log("ID não encontrado.");
           }
         } catch (E) {
           console.error("NexusMods Advance Error:" + E);
         }
       });
     }
   }, 100);
 }
 async function EndorseVideoByPopup(video_id, element) {
   if (!element) return;
   if (video_id == null || video_id == 'null') {
     return;
   }
   const videoLink = element.querySelector("a[href*='" + video_id + "']");
   if (!videoLink) {
     CreateNotificationContainer(translate_strings.EndorsePopup_cant.message, 'warning', 'fa-regular fa-thumbs-up');
     return;
   }
   const videoUrl = videoLink.href;
   const gameName = GET_GAME_FROM_NEXUS_URL(videoUrl);
   const videoId = GET_ID_FROM_NEXUS_URL(videoUrl);
   const gameId = Number(gameName) ? fingGameNameByID(gameName) : fingGameIDBy_DomainName(gameName);
   const response = await fetch(videoUrl, {
     credentials: "include"
   });
   const html = await response.text();
   const parser = new DOMParser();
   const doc = parser.parseFromString(html, "text/html");
   const endorseButton = doc.querySelector("a#button-endorse");
   const csrfToken = endorseButton?.getAttribute("data-csrf-token");
   console.log("Vídeo:", videoId);
   console.log("Jogo:", gameName);
   console.log("Game ID:", gameId);
   console.log("CSRF Token:", csrfToken);
   await EndorseVideoByPopup_Stage2(videoId, gameName, gameId, csrfToken, element);
 }
 async function EndorseVideoByPopup_Stage2(video_id, gameName, gameId, csrfToken, element) {
   const support = SITE_URL.indexOf("/supporterimages/") == -1 ? 0 : 1;
   if (video_id == null || video_id == 'null') {
     return;
   }
   const li_element = element.querySelector("a[href*='" + video_id + "']")?.closest('div[data-e2eid="media-tile"]')?.querySelector("svg path[d='M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z']");
   if (li_element) {
     console.log("Endorsando vídeo " + video_id + " do jogo " + gameId + " Supporter: " + support);
     fetch("https://www.nexusmods.com/videos/" + video_id + "/endorse", {
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
       "referrer": "https://www.nexusmods.com/" + gameName + "/videos/" + video_id,
       "body": "game_id=" + gameId + "&_token=" + encodeURIComponent(csrfToken),
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
         const endorsementCount = li_element.closest("li.endorsecount")?.querySelector("span");
         if (endorsementCount) {
           endorsementCount.textContent = data.endorsements;
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