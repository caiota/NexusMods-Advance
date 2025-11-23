async function CREATE_MODS_BUTTONS() {
    try{
    const mods_list = document.querySelectorAll("div[class*='mod-tile'][VISIBLE]:not([BUTTONS_SET])");
    if(mods_list.length<=0){
        return
    }
    for (var i = 0; i < mods_list.length; i++) {
        var mod = mods_list[i];
        mod.setAttribute("BUTTONS_SET", true);

        if (!mod.querySelector("div button, a.hover-overlay")) continue;

        if (mod.querySelector("div button, a.hover-overlay").parentElement.nodeName.toLocaleLowerCase() == "div") {
            mod = mod.querySelector("div button, a.hover-overlay").parentElement;
        }
    const BUTTONS_FRAME=document.createElement("div");
    BUTTONS_FRAME.classList="BUTTONS_FRAME hiddenTile";
    
    mod.append(BUTTONS_FRAME);
        // Criação do botão Ignore
        if (options['FastIgnoreButton'] == true && !mod.querySelector("i#removeContent")) {
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
                 const TargetClick=ev.target.closest("div[data-e2eid='mod-tile-list']")||ev.target.closest("div[class*='mod-tile']");
                  const mode = TargetClick.querySelector("div.relative a").href.split("/mods/")[1];
                  const MOD_ELEMENT=TargetClick;
                if (mode&&gameID_Number) {
                    const mod_game = gameId;
                    const mod_id = mode;
                    const modName = MOD_ELEMENT.querySelector("a[data-e2eid='mod-tile-title'], p.typography-body-md, a.typography-body-md").innerText;
                    if(!modName){
                        return;
                    }
                    chrome.runtime.sendMessage({
                        action: 'Save_HiddenMod',
                        game: mod_game,
                        gameId: gameID_Number,
                        mod_id: mod_id,
                        mod_name: modName
                    }, function (response) {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending message:", chrome.runtime.lastError.message);
                        } else if (response && response.success) {
                            if(!options['JustBlur_IgnoredMods']){
                          MOD_ELEMENT.style.display = 'none';
                                }else{
                                MOD_ELEMENT.classList.add("blurIgnoredModBlock");
                                }
                        } else {
                            console.error("Error in response:", response.error);
                        }
                    });
                }
            });
            IgnoreContainer.classList.add("hiddenTile");
        }

        // Criação do botão View
        if (options['FastViewButton'] == true && !mod.querySelector("i#viewSvg")) {
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
            BUTTONS_FRAME.append(viewMore_Container);

            viewMore.addEventListener("click", function (ev) {
                const TargetClick=ev.target.closest("div[data-e2eid='mod-tile-list']")||ev.target.closest("div[class*='mod-tile']");
                const mode = TargetClick.querySelector("div.relative a").href.split("/mods/")[1];
                const src = TargetClick.querySelector("div.relative img[alt]").src;
const match = src.match(/(?:mods|mod-images)\/(\d+)\//);
const tile_game = match ? match[1] : null;
                
                if (mode&&tile_game) {
                    CREATE_MOD_IMAGES(mode, tile_game, ev.clientX, ev.clientY);
                }
            });
            //mod.classList.add("hiddenTile");
        }

        // Criação do botão Download
        if (options['FastDownloadButton'] == true && !mod.querySelector("i#fastDld")) {
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
            BUTTONS_FRAME.appendChild(viewFiles_Container);

            fastDownload.addEventListener("click", function (ev) { 
                 const TargetClick=ev.target.closest("div[data-e2eid='mod-tile-list']")||ev.target.closest("div[class*='mod-tile']");
                const mode = TargetClick.querySelector("div.relative a").href;
                console.log(mode,gameID_Number)
                if (mode&&gameID_Number) {
                    openCenteredPopup(mode + "?tab=files&popup=true", "Loading Mod...", 1200, 800);
                }
            });
            //mod.classList.add("hiddenTile");
        }

        // Criação do botão Description
        if (options['FastDescriptionButton'] == true && !mod.querySelector("i#fastDescription")) {
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
            BUTTONS_FRAME.append(viewDescription_Container);

            fastDescription.addEventListener("click", async function (ev) {
                
                 const TargetClick=ev.target.closest("div[data-e2eid='mod-tile-list']")||ev.target.closest("div[class*='mod-tile']");
                 const mode = TargetClick.querySelector("div.relative a").href.split("/mods/")[1];
                //const tile_game = ev.target.closest("div[class*='mod-tile']").querySelector("div.relative a").href.split("/mods/")[0].replace("https://www.nexusmods.com/","");
  const src = TargetClick.querySelector("div.relative img[alt]").src;
const match = src.match(/(?:mods|mod-images)\/(\d+)\//);
const tile_game = match ? match[1] : null;
                if (mode&&tile_game) {
                    console.log(mode,tile_game)
                    await CREATE_MOD_DESCRIPTION(tile_game, mode, 'descricao');
                }
            });
            //mod.classList.add("hiddenTile");
        }
        if (options['BetterModBlocks'] == true) {
            const paragraph = mod.closest("div[class*='mod-tile']").querySelector("div[data-e2eid='mod-tile-summary']:not(.tilesDesc_SCROLLABLE)");
            if (!paragraph) {
                continue;
            }
            paragraph.classList.add("tilesDesc_SCROLLABLE");
            paragraph.innerText += "\n\n";
            paragraph.closest("div[class*='mod-tile']").classList.add("tileInfo_REPADDIGN");

            document.querySelectorAll("div.fadeoff").forEach(function (fadeDiv) {
                fadeDiv.remove();
            });
        }
    }
    
}catch(e){
    console.error("NexusMods Advance Error: "+e);
}
}