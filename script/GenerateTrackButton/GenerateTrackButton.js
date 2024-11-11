async function GENERATE_TRACK_BUTTONS() {
    try{
    if (current_modTab === "files" && !GeneratorBusy) {
        GeneratorBusy = true;
        const modsLinks = Array.from(document.querySelectorAll("dd[data-id]:not([TRACK_INJECTED])"));
        const buttonsDownloads = document.querySelectorAll("div.tabbed-block ul.accordion-downloads");
        const modsTitles = Array.from(document.querySelectorAll("dl.accordion dt p"));

        const modName = document.querySelector("section.modpage h1").innerText || 'Null Mod Name';
        const modCategory = Array.from(document.querySelectorAll("section.modpage ul li")).find(a => a.querySelector('a') && a.querySelector('a').href.includes('/categories/'))?.innerText || 'No Category Found';
        const thumbnailUrl = document.querySelector("ul.thumbgallery li img")?.src || 'https://www.nexusmods.com/assets/images/default/noimage.svg';

        const currentTimeInMillis = Date.now();
        const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;

        for (const [index, mod] of modsLinks.entries()) {
            const modElement = mod.previousElementSibling.querySelector("div.file-download-stats");
            const unixTimestamp = mod.previousElementSibling.getAttribute("data-date");
            const timestampInMillis = parseInt(unixTimestamp, 10) * 1000;

            const downloadButton = buttonsDownloads[index];
            const fileLink = downloadButton.querySelector("li a");

            if (!fileLink) {
                console.log("Erro ao encontrar ID de arquivo, MOD provavelmente está em análise :D");
                continue;
            }

            const fileId = await getParameterByName("id", fileLink.href) || await getParameterByName("file_id", fileLink.href);

            const advanceIcon = document.createElement("i");
            advanceIcon.classList = "advanceIcon fa-solid fa-thumbtack";
            advanceIcon.setAttribute("aria-hidden", true);

            const btnSpan = document.createElement("span");
            btnSpan.classList.add("trackSpan");
            btnSpan.innerText = translate_strings.NexusModsAdvance_addFile.message;

            const newLi = document.createElement('li');
            newLi.appendChild(advanceIcon);
            newLi.appendChild(btnSpan);

            const version = modElement.querySelector("li.stat-version div.stat").innerText;

            if (currentTimeInMillis - timestampInMillis > oneYearInMillis && !options['MemoryMode']) {
                newLi.id = "SaveMod_disabled";
                newLi.addEventListener("click", errorCallback);

                buttonsDownloads[index].querySelectorAll("li").forEach(btn => {
                    const listItem = btn.nodeName !== "LI" ? btn.closest("li") : btn;
                    listItem.addEventListener("click", IgnoreRequeriments);
                });
                //IgnoreRequeriments
            } else {
                newLi.id = "SaveMod";
                newLi.setAttribute("modID", fileId);
                newLi.setAttribute("version", version);
                newLi.setAttribute("updated", unixTimestamp);
                newLi.setAttribute("modName", modName);
                newLi.setAttribute("modCategory", modCategory);
                if (thumbnailUrl) {
                    newLi.setAttribute("thumbnail", thumbnailUrl);
                }
                newLi.setAttribute("modTitle", mod.previousElementSibling.getAttribute("data-name"));
                newLi.title = `${modsTitles[index].innerText} v.${version}`;

                buttonsDownloads[index].querySelectorAll("li").forEach(btn => {
                    const listItem = btn.nodeName !== "LI" ? btn.closest("li") : btn;
                    listItem.setAttribute("modID", fileId);
                    listItem.setAttribute("version", version);
                    listItem.setAttribute("updated", unixTimestamp);
                    listItem.setAttribute("modName", modName);
                    listItem.setAttribute("modCategory", modCategory);
                    if (thumbnailUrl) {
                        listItem.setAttribute("thumbnail", thumbnailUrl);
                    }
                    listItem.setAttribute("modTitle", modsTitles[index].innerText);
                    listItem.addEventListener("click", ClickCallback);
                });

                newLi.addEventListener("click", (ev) => { TRACK_MOD(ev); });

                if (modElement.querySelector("li.stat-downloaded") && options['AutoTrackDownloaded']) {
                    newLi.click();
                }
            }

            mod.setAttribute("TRACK_INJECTED", true);

            if (!options['NotRenderTrackMods_Button']) {
                buttonsDownloads[index].querySelector("li:last-child").insertAdjacentElement('afterend', newLi);
            }
        }

        GeneratorBusy = false;
    }
}catch(e){
    console.error("NexusMods Advance Error "+e)
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
    const modid = await extrairID(SITE_URL);
    const updateDate = eve.getAttribute('updated');
    const version = eve.getAttribute('version');
    const mod_FileName = eve.getAttribute('modTitle');
    const thumbnail = eve.getAttribute('thumbnail');
    const moname = eve.getAttribute('modName');
    const mod_Category = eve.getAttribute('modCategory');
    const fileid = eve.getAttribute('modID');
    const gameName = findGameById(gameId);
    console.log("FullName " + moname, "File_Name " + mod_FileName)
    chrome.runtime.sendMessage({
      action: 'TrackMod',
      file_id: fileid,
      mod: modid,
      mod_thumbnail: thumbnail,
      mod_name: mod_FileName,
      category: mod_Category,
      mod_Fullname: moname,
      version: version,
      updated: updateDate,
      game: gameId,
      gameName: gameName
    }, function (response) {
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