async function CREATE_MODS_BUTTONS() {
    try{
    const mods_list = document.querySelectorAll("li:not([id])[class~='mod-tile'][VISIBLE]:not([BUTTONS_SET]), li:not([id])[class~='image-tile'] > div[data-mod-id]:not(.qs_result)[VISIBLE]:not([BUTTONS_SET])");
    if(mods_list.length<=0){
        return
    }
    for (var i = 0; i < mods_list.length; i++) {
        var mod = mods_list[i];
        mod.setAttribute("BUTTONS_SET", true);

        if (!mod.querySelector("div.expandtile")) continue;

        if (mod.querySelector("div.expandtile").parentElement.nodeName.toLocaleLowerCase() == "div") {
            mod = mod.querySelector("div.expandtile").parentElement;
        }

        // Criação do botão Ignore
        if (options['FastIgnoreButton'] == true && !mod.querySelector("i#removeContent")) {
            mod.querySelector("div.expandtile").classList.add("hiddenTile");
            const IgnoreContainer = document.createElement("div");
            IgnoreContainer.classList = 'IgnoreContainer';
            const ignoreMod = document.createElement("i");
            ignoreMod.id = "removeContent";
            ignoreMod.setAttribute('aria-hidden', true);
            ignoreMod.classList = "viewMore fa-regular fa-eye-slash";
            IgnoreContainer.appendChild(ignoreMod);

            const popup = document.createElement("div");
            popup.classList = 'popupBox_Extension';
            popup.id = 'IgnoreContainer_PopUp';
            popup.innerText = translate_strings.popupTip_Ignore.message;
            IgnoreContainer.appendChild(popup);
            mod.append(IgnoreContainer);

            ignoreMod.addEventListener("click", function (ev) {
                const mode = ev.target.closest("li").querySelector("div.mod-tile-left");
                if (mode.getAttribute("data-mod-id")) {
                    const mod_game = fingGameNameByID(mode.getAttribute("data-game-id"));
                    const mod_id = mode.getAttribute("data-mod-id");
                    const modName = mode.querySelector("p.tile-name").innerText;

                    chrome.runtime.sendMessage({
                        action: 'Save_HiddenMod',
                        game: mod_game,
                        gameId: mod.getAttribute("data-game-id"),
                        mod_id: mod_id,
                        mod_name: modName
                    }, function (response) {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending message:", chrome.runtime.lastError.message);
                        } else if (response && response.success) {
                            mode.closest('li').style.display = 'none';
                        } else {
                            console.error("Error in response:", response.error);
                        }
                    });
                }
            });
        }

        // Criação do botão View
        if (options['FastViewButton'] == true && !mod.querySelector("i#viewSvg")) {
            mod.querySelector("div.expandtile").classList.add("hiddenTile");
            const viewMore_Container = document.createElement("div");
            viewMore_Container.classList = 'viewMoreContainer';
            const viewMore = document.createElement("i");
            viewMore.id = "viewSvg";
            viewMore.setAttribute('aria-hidden', true);
            viewMore.classList = "viewMore fa-solid fa-image";
            viewMore_Container.appendChild(viewMore);

            const popup = document.createElement("div");
            popup.classList = 'popupBox_Extension';
            popup.id = 'viewMorePopup';
            popup.innerText = translate_strings.popupTip_Image.message;
            viewMore_Container.appendChild(popup);
            mod.append(viewMore_Container);

            viewMore.addEventListener("click", function (ev) {
                const mode = ev.target.closest("li").querySelector("div.mod-tile-left");
                if (mode.getAttribute("data-mod-id")) {
                    CREATE_MOD_IMAGES(mode.getAttribute("data-mod-id"), mode.getAttribute("data-game-id"), ev.clientX, ev.clientY);
                }
            });
        }

        // Criação do botão Download
        if (options['FastDownloadButton'] == true && !mod.querySelector("i#fastDld")) {
            mod.querySelector("div.expandtile").classList.add("hiddenTile");
            const viewFiles_Container = document.createElement("div");
            viewFiles_Container.classList = 'viewFilesContainer';
            const fastDownload = document.createElement("i");
            fastDownload.id = "fastDld";
            fastDownload.setAttribute('aria-hidden', true);
            fastDownload.classList = "downloadPage fa-solid fa-cloud-arrow-down";
            viewFiles_Container.appendChild(fastDownload);

            const popup = document.createElement("div");
            popup.classList = 'popupBox_Extension';
            popup.id = 'fastDldPopup';
            popup.innerText = translate_strings.popupTip_Files.message;
            viewFiles_Container.appendChild(popup);
            mod.appendChild(viewFiles_Container);

            fastDownload.addEventListener("click", function (ev) {
                const mode = ev.target.closest("li").querySelector("div.mod-tile-left");
                if (mode.getAttribute("data-mod-id")) {
                    openCenteredPopup(mode.querySelector('a').href + "?tab=files&popup=true", "Loading Mod...", 1200, 800);
                }
            });
        }

        // Criação do botão Description
        if (options['FastDescriptionButton'] == true && !mod.querySelector("i#fastDescription")) {
            mod.querySelector("div.expandtile").classList.add("hiddenTile");
            const viewDescription_Container = document.createElement("div");
            viewDescription_Container.classList = 'viewDescriptionContainer';
            const fastDescription = document.createElement("i");
            fastDescription.id = "fastDescription";
            fastDescription.setAttribute('aria-hidden', true);
            fastDescription.classList = "fastDescription fa-solid fa-comment-dots";
            viewDescription_Container.appendChild(fastDescription);

            const popup = document.createElement("div");
            popup.classList = 'popupBox_Extension';
            popup.id = 'fastDescriptionPopup';
            popup.innerText = translate_strings.popupTip_Description.message;
            viewDescription_Container.appendChild(popup);
            mod.append(viewDescription_Container);

            fastDescription.addEventListener("click", async function (ev) {
                const mode = ev.target.closest("li").querySelector("div.mod-tile-left");
                if (mode.getAttribute("data-mod-id")) {
                    await CREATE_MOD_DESCRIPTION(mode.getAttribute("data-game-id"), mode.getAttribute("data-mod-id"), 'descricao');
                }
            });
        }
        if (options['BetterModBlocks'] == true) {
            const paragraph = mod.querySelector("div.tile-desc p.desc:not(.tilesDesc_SCROLLABLE)");
            if (!paragraph) {
                continue;
            }
            paragraph.classList.add("tilesDesc_SCROLLABLE");
            paragraph.innerText += "\n\n";
            paragraph.closest("div.tile-content").classList.add("tileInfo_REPADDIGN");

            document.querySelectorAll("div.fadeoff").forEach(function (fadeDiv) {
                fadeDiv.remove();
            });
        }
    }
    
}catch(e){
    console.error("NexusMods Advance Error: "+e);
}
}