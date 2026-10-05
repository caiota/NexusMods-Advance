function GENERATE_TRACK_BUTTONS() {
  if (current_modTab !== "files" || GeneratorBusy) {
    return;
  }
  GeneratorBusy = true;
  try {
    const modName = document.querySelector("section.modpage h1")?.innerText || "Error Loading Mod Name";
    const modCategory = document.querySelector('ul#breadcrumb a[href*="mods?categoryName="]')?.innerText || "Error Loading Category!";
    const thumbnailUrl = document.querySelector("ul.thumbgallery li img")?.src || "https://www.nexusmods.com/assets/images/default/noimage.svg";
    const match = thumbnailUrl.match(/mods\/(\d+)\//);
    const game_number = match ? match[1] : null;
    const currentTimeInMillis = Date.now();
    const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;
    for (const element of VISIBLE_ELEMENTS) {
      /*
       * Libera referências de elementos que saíram do DOM.
       */
      if (!element.isConnected) {
        VISIBLE_ELEMENTS.delete(element);
        continue;
      }
      /*
       * Agora processamos o próprio UL.
       */
      if (!element.matches || !element.matches("ul.accordion-downloads")) {
        continue;
      }
      /*
       * Já processado por esta função.
       */
      if (element.hasAttribute("TRACK_INJECTED")) {
        continue;
      }
      const buttonsDownload = element;
      /*
       * Encontramos o DD correspondente.
       */
      const mod = buttonsDownload.closest("dd[data-id]");
      if (!mod) {
        continue;
      }
      /*
       * O DT correspondente é o elemento imediatamente anterior
       * ao DD.
       */
      const modTitle = mod.previousElementSibling;
      if (!modTitle || modTitle.nodeName !== "DT") {
        continue;
      }
      /*
       * Dados do arquivo.
       */
      const fileId = modTitle.getAttribute("data-id");
      if (!fileId) {
        console.error("Erro ao encontrar ID de arquivo para o mod: " + modName);
        continue;
      }
      const unixTimestamp = modTitle.getAttribute("data-date");
      const timestampInMillis = parseInt(unixTimestamp, 10) * 1000;
      if (!Number.isFinite(timestampInMillis)) {
        continue;
      }
      const modElement = modTitle.querySelector("div.file-download-stats");
      if (!modElement) {
        continue;
      }
      const versionElement = modElement.querySelector("li.stat-version div.stat");
      const version = versionElement?.innerText || "";
      const modTitleText = modTitle.getAttribute("data-name") || "";
      const titleElement = modTitle.querySelector("p");
      const displayTitle = titleElement?.innerText || modTitleText;
      /*
       * Cria o botão.
       */
      const advanceIcon = document.createElement("i");
      advanceIcon.className = "advanceIcon fa-solid fa-thumbtack";
      advanceIcon.setAttribute("aria-hidden", "true");
      const btnSpan = document.createElement("span");
      btnSpan.classList.add("trackSpan");
      btnSpan.innerText = translate_strings.NexusModsAdvance_addFile.message;
      const newLi = document.createElement("li");
      newLi.appendChild(advanceIcon);
      newLi.appendChild(btnSpan);
      /*
       * Arquivo com mais de um ano.
       */
      if (currentTimeInMillis - timestampInMillis > oneYearInMillis && !options["MemoryMode"]) {
        newLi.id = "SaveMod_disabled";
        newLi.addEventListener("click", errorCallback);
        buttonsDownload.querySelectorAll("li").forEach(btn => {
          const listItem = btn.nodeName !== "LI" ? btn.closest("li") : btn;
          if (!listItem) {
            return;
          }
          listItem.addEventListener("click", IgnoreRequeriments);
        });
      } else {
        /*
         * Arquivo normal.
         */
        newLi.id = "SaveMod";
        newLi.setAttribute("modID", fileId);
        newLi.setAttribute("version", version);
        newLi.setAttribute("updated", unixTimestamp);
        newLi.setAttribute("modName", modName);
        newLi.setAttribute("game_number", game_number);
        newLi.setAttribute("modCategory", modCategory);
        if (thumbnailUrl) {
          newLi.setAttribute("thumbnail", thumbnailUrl);
        }
        newLi.setAttribute("modTitle", modTitleText);
        newLi.title = `${displayTitle} v.${version}`;
        /*
         * Configura os botões originais.
         */
        buttonsDownload.querySelectorAll("li").forEach(btn => {
          const listItem = btn.nodeName !== "LI" ? btn.closest("li") : btn;
          if (!listItem) {
            return;
          }
          listItem.setAttribute("modID", fileId);
          listItem.setAttribute("version", version);
          listItem.setAttribute("updated", unixTimestamp);
          listItem.setAttribute("modName", modName);
          listItem.setAttribute("game_number", game_number);
          listItem.setAttribute("modCategory", modCategory);
          if (thumbnailUrl) {
            listItem.setAttribute("thumbnail", thumbnailUrl);
          }
          listItem.setAttribute("modTitle", displayTitle);
          listItem.addEventListener("click", ClickCallback);
        });
        newLi.addEventListener("click", ev => TRACK_MOD(ev));
        /*
         * AutoTrackDownloaded
         */
        if (modElement.querySelector("li.stat-downloaded") && options["AutoTrackDownloaded"] === true && modElement.closest("div#file-container-main-files")) {
          newLi.click();
        }
      }
      /*
       * Se a opção estiver desativada, não precisamos
       * inserir o botão, mas o UL pode ser considerado
       * processado.
       */
      if (options["NotRenderTrackMods_Button"] === false) {
        /*
         * Procuramos o último LI existente.
         */
        const lastButton = buttonsDownload.querySelector("li:last-child");
        if (!lastButton) {
          /*
           * Ainda não existe nenhum local válido
           * para inserir o botão.
           *
           * NÃO marca TRACK_INJECTED.
           */
          continue;
        }
        lastButton.insertAdjacentElement("afterend", newLi);
      }
      /*
       * Só marcamos depois de tudo ter dado certo.
       */
      buttonsDownload.setAttribute("TRACK_INJECTED", "1");
      /*
       * Também marcamos o DD, caso ele esteja no cache.
       */
      mod.setAttribute("TRACK_INJECTED", "1");
    }
  } catch (e) {
    console.error("NexusMods Advance Error " + e);
  } finally {
    /*
     * Nunca deixa o GeneratorBusy preso em true.
     */
    GeneratorBusy = false;
  }
}
async function TRACK_MOD(ev) {
  if (ev.target.nodeName != "LI") {
    eve = ev.target.closest('li');
  } else {
    eve = ev.target;
  }
  if (!eve) {
    return;
  }
  if (eve.id == "SaveMod") {
    eve.classList.add("saved");
    eve.style.opacity = "0.6";
  }
  const modid = extrairID(SITE_URL);
  const updateDate = eve.getAttribute('updated');
  const version = eve.getAttribute('version');
  const mod_FileName = eve.getAttribute('modTitle');
  const thumbnail = eve.getAttribute('thumbnail');
  const game_numberId = eve.getAttribute('game_number');
  const moname = eve.getAttribute('modName');
  const mod_Category = eve.getAttribute('modCategory');
  const fileid = eve.getAttribute('modID');
  if (gameId == "Modding Tools") {
    gameId = "site";
  }
  const gameName = gameId;
  //console.log(game_numberId,modid,updateDate,version,mod_FileName,thumbnail,moname,mod_Category,fileid,gameName)
  chrome.runtime.sendMessage({
    action: 'TrackMod',
    file_id: fileid,
    game_number: game_numberId,
    mod: modid,
    mod_thumbnail: thumbnail,
    mod_name: mod_FileName,
    category: mod_Category,
    mod_Fullname: moname,
    version: version,
    updated: updateDate,
    game: gameId.replaceAll(" ", "").toLowerCase(),
    gameName: gameName
  }, function(response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
    } else {
      if (response && response.success) {
        CreateNotificationContainer(translate_strings.TrackMod_Success.message, 'success', 'fa-solid fa-thumbtack');
        console.log(response.message)
      } else {
        console.error("Error in response:", response.error);
      }
    }
  });
}