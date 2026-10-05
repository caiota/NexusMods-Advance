async function CREATE_MOD_DESCRIPTION(game_id, modId, tipo) {
  chrome.runtime.sendMessage({
    action: 'UnlockYoutube'
  }, function(response2) {
    console.log(response2);
  });
  if (modPreview_element) {
    modPreview_element.style.display = "none";
  }
  if (modFiles_element) {
    modFiles_element.style.display = "none";
  }
  if (!modPopup_element) {
    modPopup_element = document.createElement("div");
    modPopup_element.id = "modPopup";
    divContent = document.createElement("div");
    divContent.id = "descriptionContent";
    divArrasta = document.createElement("div");
    divArrasta.id = "divArrastaOverlay";
    divClose = document.createElement("i");
    divClose.classList = "fa-solid fa-circle-xmark";
    divClose.setAttribute("aria-hidden", true);
    divClose.id = "closePopButton";
    divClose.addEventListener("click", function(ev) {
      STILL_LOADING = false;
      ev.target.closest("div#modPopup").style.display = "none";
      modPopup_element.querySelector("div#descriptionContent").innerHTML = "";
    });
    modPopup_element.appendChild(divClose);
    modPopup_element.appendChild(divContent);
    document.body.appendChild(modPopup_element);
    if (options['PopupRightScreen'] == false) {
      modPopup_element.appendChild(divArrasta);
      modPopup_element.addEventListener('mousedown', startDragging);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDragging);
    } else {
      modPopup_element.classList.add("PopUp_RightFixed");
    }
  }
  const rect = modPopup_element.getBoundingClientRect();
  if (rect.bottom > window.innerHeight) {
    needMove = true;
  }
  if (rect.top < 0) {
    needMove = true;
  }
  if (modPopup_element.style.display != 'flex') {
    needMove = true;
  }
  modPopup_element.style.display = "flex";
  modPopup_element.scrollTo(0, 0);
  console.warn(game_id, modId, tipo);
  MoveLoop(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y, modPopup_element);
  if (tipo == "collection") {
    await CreateCollection_IframeWorker(game_id);
  } else {
    await FETCH_MOD_DESCRIPTION(game_id, modId, tipo);
  }
}
var firstFile_URL = null;
var iframe, iframe2;
async function CreateIframe_Worker() {
  if (!document.querySelector("iframe#youtubeIframeNMX")) {
    iframe = document.createElement("iframe");
    iframe.id = "youtubeIframeNMX";
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture,fullscreen");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("frameborder", "0");
  }
}
async function CreateCollection_IframeWorker(game_id) {
  const url23 = typeof game_id === 'string' && game_id.startsWith('http') ? game_id : `https://www.nexusmods.com/collections/${game_id}?popup=true`;
  if (popup) {
    popup.close();
  }
  CreateCollection_Popup(url23);
}
var popup;
var firstFile_URL = null;
var iframe, iframe2;
var YOUTUBE_LOAD_ID = 0;

function CreateCollection_Popup(url123) {
  const mouseX = GLOBAL_MOUSE_X || 0;
  const mouseY = GLOBAL_MOUSE_Y || 0;
  const width = 800;
  const height = 500;
  let left = mouseX - (width / 2);
  let top = mouseY - 50;
  if (left + width > window.innerWidth) {
    left = window.innerWidth - width - 10;
  }
  if (left < 10) {
    left = 10;
  }
  if (top + height > window.innerHeight) {
    top = window.innerHeight - height - 10;
  }
  if (top < 10) {
    top = 10;
  }
  const features = [`width=${width}`, `height=${height}`, `left=${left}`, `top=${top}`, 'menubar=no', 'toolbar=no', 'location=no', 'status=no', 'scrollbars=yes', 'resizable=yes'].join(',');
  modPopup_element.style.display = "none";
  popup = window.open(url123 + "?popup=true", '_blank', features);
}
async function FETCH_MOD_TAGS(game_id, modId) {
  const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModTaggingPopUp?mod_id=" + modId + "&game_id=" + game_id, http_headers);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const mod_tags = doc.body.querySelectorAll("div.popup-mod-tagging li.tag:not(.neutral):not(.rejected):not(.not-confirmed)");
  mod_tags.forEach((item) => {
    item.querySelector("ul.tag-icons").remove();
    item.querySelectorAll("span[id]").forEach((obj) => {
      obj.remove();
    });
    item.querySelectorAll("svg.tag-icon").forEach((obj) => {
      obj.remove();
    });
  });
  if (mod_tags) {
    mod_tags.forEach((tag) => {
      tag.classList = "mod_tag";
      modPopup_element.querySelector("div#descriptionContent").prepend(tag);
    });
  }
}
async function FETCH_MOD_DESCRIPTION(game_id, modId, tipo = "descricao") {
  const currentLoadId = ++YOUTUBE_LOAD_ID;
  console.log("Carregando Informações do Tipo:" + tipo);
  console.log("Do jogo " + game_id);
  modPopup_element.querySelector("div#descriptionContent").innerHTML = "";
  modPopup_element.querySelector("div#descriptionContent").classList.add("modPreview_Rotating");
  let url = tipo === 'descricao' ? `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModDescriptionTab?id=${modId}&game_id=${game_id}` : tipo === 'translateMod' ? `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModFilesTab?id=${modId}&game_id=${game_id}` : tipo === 'videos' ? `https://www.nexusmods.com/${game_id}/videos/${modId}` : `${game_id}`;
  try {
    const response = await fetch(url, http_headers);
    const html = await response.text();
    if (currentLoadId !== YOUTUBE_LOAD_ID) {
      console.log("Carregamento antigo ignorado:", currentLoadId);
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    var isAdultBlocked = false;
    const selectors = ['svg.icon', 'li.report-abuse-btn', 'a.button-share', 'div.manage-mod', 'ul.actions', 'div#comment-container'];
    if (tipo == "descricao") {
      FETCH_MOD_TAGS(game_id, modId);
    }
    if (tipo == 'videos') {
      await CreateIframe_Worker();
      if (doc.body.querySelector("div.info-content h3")) {
        isAdultBlocked = doc.body.querySelector("div.info-content h3")?.textContent == "Age verification required";
      }
      chrome.runtime.sendMessage({
        action: 'UnlockYoutube'
      }, async function(response2) {
        if (currentLoadId !== YOUTUBE_LOAD_ID) {
          console.log("Resposta antiga do YouTube ignorada:", currentLoadId);
          return;
        }
        if (!response2 || !response2.success) {
          console.error("NexusMods Advance: falha ao desbloquear YouTube.");
          modPopup_element.querySelector("div#descriptionContent").classList.remove("modPreview_Rotating");
          return;
        }
        YOUTUBE_STATUS = response2.YOUTUBE_STATUS;
        const originalIframe = doc.body.querySelector("div.video-contain iframe");
        if (originalIframe) {
          const videoSrc = originalIframe.src;
          console.log("YouTube URL original:", videoSrc);
          const separator = videoSrc.includes("?") ? "&" : "?";
          const frameSrc = videoSrc + separator + "autoplay=1&unlock=1";
          console.log("YouTube iframe URL:", frameSrc);
          const descriptionContent = modPopup_element.querySelector("div#descriptionContent");
          descriptionContent.innerHTML = "";
          descriptionContent.appendChild(iframe);
          iframe.src = frameSrc;
          let iframeRecreated = false;
          for (let i = 0; i < 100; i++) {
            if (currentLoadId !== YOUTUBE_LOAD_ID) {
              return;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
            if (!iframe.getAttribute("src")) {
              console.warn("NMA: src do YouTube desapareceu.");
              document.querySelector("iframe#youtubeIframeNMX")?.remove();
              if (iframeRecreated) {
                break;
              }
              iframeRecreated = true;
              const newIframe = document.createElement("iframe");
              newIframe.id = "youtubeIframeNMX";
              newIframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture,fullscreen");
              newIframe.setAttribute("allowfullscreen", "");
              newIframe.setAttribute("frameborder", "0");
              const noCookieSrc = frameSrc.replace("www.youtube.com", "www.youtube-nocookie.com");
              console.warn("NMA: recriando iframe com:", noCookieSrc);
              iframe.remove();
              iframe = newIframe;
              iframe.src = noCookieSrc;
              descriptionContent.appendChild(iframe);
              console.log("NMA: novo iframe criado:", iframe.outerHTML);
              break;
            }
            if (iframe.getAttribute("src")) {
              break;
            }
          }
          descriptionContent.classList.remove("modPreview_Rotating");
        }
        if (isAdultBlocked == true) {
          modPopup_element.querySelector("div#descriptionContent").innerHTML = doc.body.outerHTML;
          modPopup_element.querySelector("div#descriptionContent").classList.remove("modPreview_Rotating");
        }
      });
    }
    if (tipo !== 'descricao'&&tipo !== 'artigo') {
      selectors.push('a#button-endorse');
      selectors.push('ul[class="stats clearfix"]');
      

      doc.body.querySelectorAll("div#pagetitle a").forEach(item => item.removeAttribute("href"));
    }
    if(tipo=="artigo"){
      selectors.push("ul.modactions")
    }

    if (tipo !== 'translateMod') {
      selectors.push('div.accordionitems');
    } else {
      firstFile_URL = null;
      doc.querySelectorAll("div.accordionitems").forEach((accordionItem) => {
        accordionItem.querySelectorAll("a").forEach((item) => {
          item.href = item.href.replaceAll("Core/Libs/Common/Widgets/ModRequirementsPopUp?id=", gameId + "/mods/" + modId + "?tab=files&file_id=");
          item.href = item.href.replaceAll("Core/Libs/Common/Widgets/DownloadPopUp?id=", gameId + "/mods/" + modId + "?tab=files&file_id=");
        });
        if (accordionItem.querySelector("mod-download-modal")) {
          const element = accordionItem.querySelector("mod-download-modal");
          const fileAttr = element.getAttribute("file");
          const decoded = new DOMParser().parseFromString(fileAttr, "text/html").documentElement.textContent;
          const file = JSON.parse(decoded);
          firstFile_URL = file.downloadUrl;
          setTimeout(() => {
            IgnoreRequeriments(true);
          }, 1000);
        }
      });
      if (doc.querySelectorAll("div.accordionitems dt").length <= 1) {
        if (doc.querySelector("div.accordionitems ul.accordion-downloads a")) {
          window.open(doc.querySelector("div.accordionitems ul.accordion-downloads a").href + "&popup=true");
        } else {
          if (firstFile_URL) {
            window.open(firstFile_URL + "?popup=true");
          }
        }
        modPopup_element.style.display = "none";
        return;
      } else {
        doc.querySelectorAll("dd").forEach((dd) => {
          dd.style.display = 'block';
          dd.classList.add("open");
        });
      }
    }
    doc.body.querySelectorAll("a").forEach(item => item.setAttribute("target", "_blank"));
    doc.body.querySelectorAll("a").forEach(item => item.setAttribute("draggable", "false"));
    doc.body.querySelectorAll("img").forEach(item => item.setAttribute("draggable", "false"));
    doc.querySelectorAll(selectors.join(', ')).forEach(element => element.remove());
    if (tipo != 'videos') {
      modPopup_element.querySelector("div#descriptionContent").classList.remove("modPreview_Rotating");
      modPopup_element.querySelector("div#descriptionContent").innerHTML = doc.body.innerHTML;

      if (modPopup_element.querySelector("div#descriptionContent").querySelector("button.unblur-desc-btn")) {
        modPopup_element.querySelector("div#descriptionContent").querySelector("button.unblur-desc-btn").addEventListener("click",
          (ev) => {
            modPopup_element.querySelector("div#descriptionContent").querySelector("div.blur-description").classList.remove("blur-description");
            modPopup_element.querySelector("div#descriptionContent").querySelector("div.mod_adult_warning_wrapper").remove();
          });
      }
      modPopup_element.querySelectorAll("div.accordionitems dl.accordion dt").forEach((accordionItem) => {
        accordionItem.addEventListener("click",
          (i) => {
            i.currentTarget.classList.toggle("accopen");
            const dd = i.currentTarget.nextElementSibling;
            if (dd && dd.tagName === "DD") {
              if (dd.style.display === "block") {
                dd.style.display = "none";
                dd.style.overflow = "hidden";
              } else {
                dd.style.display = "block";
                dd.style.overflow = "visible";
              }
            }
          });
      });
    }
    APPLY_FUNCTIONS();
  } catch (error) {
    console.error('Erro ao buscar o HTML:', error);
    throw error;
  }
}
