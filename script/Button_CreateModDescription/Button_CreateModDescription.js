async function CREATE_MOD_DESCRIPTION(game_id, modId, tipo){
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
      divClose = document.createElement("i");
      divClose.classList = "fa-solid fa-circle-xmark";
      divClose.setAttribute("aria-hidden", true);
      divClose.id = "closePopButton";
      divClose.addEventListener("click", function (ev) {
        STILL_LOADING = false;
        ev.target.closest("div#modPopup").style.display = 'none';
        modPopup_element.querySelector("div#descriptionContent").innerHTML = ""
      });
      modPopup_element.appendChild(divClose);
      modPopup_element.appendChild(divContent);
      document.body.appendChild(modPopup_element);
      modPopup_element.addEventListener('mousedown', startDragging);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDragging);
    }

    const rect = modPopup_element.getBoundingClientRect();

    if (rect.bottom > window.innerHeight) {
      needMove = true;
    }

    // Verifica se o elemento está fora da tela na parte superior
    if (rect.top < 0) {
      needMove = true;
    }

    if (modPopup_element.style.display != 'flex') {
      needMove = true;
    }
    modPopup_element.style.display = "flex";
    modPopup_element.scrollTo(0, 0);
    console.warn(game_id,modId,tipo)
    await MoveLoop(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y, modPopup_element);
    await FETCH_MOD_DESCRIPTION(game_id, modId, tipo);

  }
  async function FETCH_MOD_TAGS(game_id, modId){

    const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModTaggingPopUp?mod_id=" + modId + "&game_id=" + game_id, http_headers);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mod_tags = doc.body.querySelectorAll("div.popup-mod-tagging li.tag:not(.neutral):not(.rejected):not(.not-confirmed)");
    mod_tags.forEach((item) => {
      item.querySelector("ul.tag-icons").remove();
      item.querySelectorAll("span[id]").forEach((obj) => { obj.remove(); })
      item.querySelectorAll("svg.tag-icon").forEach((obj) => { obj.remove(); })
    })
    if (mod_tags) {
      mod_tags.forEach((tag) => {
        tag.classList = "mod_tag"
        modPopup_element.querySelector("div#descriptionContent").prepend(tag)
      })
    }
  }
  
  async function FETCH_MOD_DESCRIPTION(game_id, modId, tipo = "descricao"){
    console.log("Carregando Informações do Tipo:" + tipo);
    console.log("Do jogo "+game_id)
    modPopup_element.querySelector("div#descriptionContent").innerHTML = "";
    modPopup_element.querySelector("div#descriptionContent").classList.add("modPreview_Rotating");
    const url = tipo === 'descricao' ?
      `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModDescriptionTab?id=${modId}&game_id=${game_id}` :
      tipo === 'translateMod' ?
        `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModFilesTab?id=${modId}&game_id=${game_id}` :
        tipo === 'videos' ?
          `https://www.nexusmods.com/${game_id}/videos/${modId}` :
          `${game_id}`;
    try {
      const response = await fetch(url, http_headers);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const selectors = [
        'svg.icon',
        'li.report-abuse-btn',
        'a.button-share',
        'div.manage-mod',
        'ul.actions',
        'div#comment-container'
      ];
      if (tipo == "descricao") {
        FETCH_MOD_TAGS(game_id, modId);
      }
      if (tipo == 'videos') {
        if (doc.body.querySelector("div.video-contain iframe")) {
          doc.body.innerHTML = doc.body.querySelector("div.video-contain iframe").outerHTML;
          doc.body.querySelector("iframe").setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
          doc.body.querySelector("iframe").setAttribute("frameborder", "0");
          doc.body.querySelector("iframe").src += "?autoplay=1&unlock=1"
        }

      }
      if (tipo !== 'descricao') {
        selectors.push('a#button-endorse');
        doc.body.querySelectorAll("div#pagetitle a").forEach(item => item.removeAttribute("href"));
      }
      if (tipo !== 'translateMod') {
        selectors.push('div.accordionitems');
      } else {
        doc.querySelectorAll("div.accordionitems").forEach((accordionItem) => {
          accordionItem.querySelectorAll("a").forEach((item) => {
            item.href = item.href.replaceAll(
              "Core/Libs/Common/Widgets/ModRequirementsPopUp?id=",
              gameId + "/mods/" + modId + "?tab=files&file_id="
            );
            //PREMIUM POP
            //https://www.nexusmods.com/Core/Libs/Common/Widgets/DownloadPopUp?id=385848&nmm=1&game_id=1704
            item.href = item.href.replaceAll(
              "Core/Libs/Common/Widgets/DownloadPopUp?id=",
              gameId + "/mods/" + modId + "?tab=files&file_id="
            );

          });
        });

        if (doc.querySelectorAll("div.accordionitems dt").length <= 1) {
          window.open(doc.querySelector("div.accordionitems ul.accordion-downloads a").href+"&popup=true");
          modPopup_element.style.display = "none";
          return;
      }else{
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
      modPopup_element.querySelector("div#descriptionContent").classList.remove("modPreview_Rotating");
      if (tipo != 'videos') {
        modPopup_element.querySelector("div#descriptionContent").innerHTML = doc.body.innerHTML;
        if (modPopup_element.querySelector("div#descriptionContent").querySelector("button.unblur-desc-btn")) {
          modPopup_element.querySelector("div#descriptionContent").querySelector("button.unblur-desc-btn").addEventListener("click", (ev) => {
            modPopup_element.querySelector("div#descriptionContent").querySelector("div.blur-description").classList.remove("blur-description");
            modPopup_element.querySelector("div#descriptionContent").querySelector("div.mod_adult_warning_wrapper").remove();
          });
        }
        modPopup_element.querySelectorAll("div.accordionitems dl.accordion dt").forEach((accordionItem) => {
          accordionItem.addEventListener("click", (i) => {
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

          })
        });
      } else {
        modPopup_element.querySelector("div#descriptionContent").innerHTML = doc.body.outerHTML;

      }
      await PAUSE_GIFS();
      await YoutubeEnlarger();

    } catch (error) {
      console.error('Erro ao buscar o HTML:', error);
    }
  }