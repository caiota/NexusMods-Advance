let CREATE_MODS_BUTTONS_TIMEOUT = null;

function CREATE_MODS_BUTTONS() {
  try {
    if (CREATE_MODS_BUTTONS_TIMEOUT) {
      clearTimeout(CREATE_MODS_BUTTONS_TIMEOUT);
    }
    CREATE_MODS_BUTTONS_TIMEOUT = setTimeout(() => {
      CREATE_MODS_BUTTONS_TIMEOUT = null;
      /*
       * ============================================================
       * PEGA SOMENTE MOD-TILES DO VISIBLE_ELEMENTS
       * ============================================================
       */
      const mods_list = [];
      for (const element of VISIBLE_ELEMENTS) {
        /*
         * Elemento que já não existe mais no DOM.
         */
        if (!element.isConnected) {
          VISIBLE_ELEMENTS.delete(element);
          continue;
        }
        /*
         * Só queremos os blocos de mod.
         */
       if (!element.matches || !element.matches("div[class*='mod-tile']") && !element.matches("li[class~='mod-tile']")) {
    continue;
}
        /*
         * Já recebeu os botões.
         */
        if (element.hasAttribute("BUTTONS_SET")) {
          continue;
        }
        mods_list.push(element);
      }
      if (mods_list.length <= 0) {
        return;
      }
      /*
       * ============================================================
       * PROCESSA OS MOD-TILES
       * ============================================================
       */
      for (var i = 0; i < mods_list.length; i++) {
        var mod = mods_list[i];
        /*
         * ----------------------------------------------------------
         * CSS DO SHADOW ROOT
         * ----------------------------------------------------------
         */
        const MOD_ROOT = mod.getRootNode();
        if (MOD_ROOT instanceof ShadowRoot) {
          APPLY_NMA_MOD_BUTTONS_CSS(MOD_ROOT);
        }
        /*
         * Marca como processado.
         */
        mod.setAttribute('BUTTONS_SET', true);
        /*
         * ----------------------------------------------------------
         * ENCONTRA A ÁREA DOS BOTÕES
         * ----------------------------------------------------------
         */
        if (!mod.querySelector('div.relative, a.hover-overlay, div.fore_div_mods')) {
          continue;
        }
        if (mod.querySelector('a.hover-overlay') && mod.querySelector('a.hover-overlay').parentElement.nodeName.toLocaleLowerCase() == 'div') {
          mod = mod.querySelector('div.relative, a.hover-overlay').parentElement;
        }
        if (mod.querySelector('div.relative,div.fore_div_mods')) {
          mod = mod.querySelector('div.relative,div.fore_div_mods');
        }
        /*
         * ----------------------------------------------------------
         * FRAME DOS BOTÕES
         * ----------------------------------------------------------
         */
        const BUTTONS_FRAME = document.createElement('div');
        BUTTONS_FRAME.classList = 'BUTTONS_FRAME hiddenTile';
        BUTTONS_FRAME.addEventListener('click', ev => {
          ev.preventDefault();
          ev.stopPropagation();
        });
        /*
         * ----------------------------------------------------------
         * INFORMAÇÕES DO MOD
         * ----------------------------------------------------------
         */
        var MOD_MAIN = mod.closest("div[data-e2eid='mod-tile'],div[data-e2eid='mod-tile-teaser'], div[class*='group/mod-tile relative'], li.mod-tile");
        const MOD_DETAILS = ({
          MOD_ID,
          GAME_ID,
          MOD_HREF,
          MOD_NAME,
          GAME_NAME
        } = LOAD_MODBLOCK_INFO(MOD_MAIN));
        if (MOD_MAIN) {
          MOD_MAIN.id = 'MAIN_BLOCK';
          MOD_MAIN.setAttribute('MOD_ID', MOD_DETAILS.MOD_ID);
          MOD_MAIN.setAttribute('GAME_ID', MOD_DETAILS.GAME_ID);
          MOD_MAIN.setAttribute('MOD_HREF', MOD_DETAILS.MOD_HREF);
          MOD_MAIN.setAttribute('MOD_NAME', MOD_DETAILS.MOD_NAME);
          MOD_MAIN.setAttribute('GAME_NAME', MOD_DETAILS.GAME_NAME);
        }
        mod.append(BUTTONS_FRAME);
        /*
         * ==========================================================
         * BOTÃO IGNORE
         * ==========================================================
         */
        if (options['FastIgnoreButton'] == true && !mod.querySelector('i#removeContent')) {
          const IgnoreContainer = document.createElement('div');
          IgnoreContainer.classList = 'IgnoreContainer hiddenTile';
          const ignoreMod = document.createElement('i');
          ignoreMod.id = 'removeContent';
          ignoreMod.setAttribute('aria-hidden', true);
          ignoreMod.classList = 'viewMore fa-regular fa-eye-slash';
          IgnoreContainer.appendChild(ignoreMod);
          const popup = document.createElement('div');
          popup.classList = 'popupBox_Extension';
          popup.id = 'IgnoreContainer_PopUp';
          popup.innerText = translate_strings.popupTip_Ignore.message;
          IgnoreContainer.appendChild(popup);
          mod.append(IgnoreContainer);
          ignoreMod.addEventListener('click', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const TargetClick = ev.target.closest('div#MAIN_BLOCK,li#MAIN_BLOCK');
            const mode = TargetClick.getAttribute('MOD_ID');
            const MOD_ELEMENT = TargetClick;
            if (mode) {
              const mod_game = TargetClick.getAttribute('GAME_NAME');
              const mod_id = mode;
              const game_idNumber = TargetClick.getAttribute('GAME_ID');
              const modName = TargetClick.getAttribute('MOD_NAME');
              if (!modName) {
                return;
              }
              console.log(mod_game, game_idNumber, mod_id, modName);
              chrome.runtime.sendMessage({
                action: 'Save_HiddenMod',
                game: mod_game,
                gameId: game_idNumber,
                mod_id: mod_id,
                mod_name: modName
              }, function(response) {
                if (chrome.runtime.lastError) {
                  console.error('Error sending message:', chrome.runtime.lastError.message);
                } else if (response && response.success) {
                  if (!options['JustBlur_IgnoredMods']) {
                    MOD_ELEMENT.style.display = 'none';
                  } else {
                    MOD_ELEMENT.classList.add('blurIgnoredModBlock');
                  }
                } else {
                  console.error('Error in response:', response.error);
                }
              });
            }
          });
        }
        /*
         * ==========================================================
         * BOTÃO VIEW
         * ==========================================================
         */
        if (options['FastViewButton'] == true && !mod.querySelector('i#viewSvg')) {
          const viewMore_Container = document.createElement('div');
          viewMore_Container.classList = 'viewMoreContainer';
          const viewMore = document.createElement('i');
          viewMore.id = 'viewSvg';
          viewMore.setAttribute('aria-hidden', true);
          viewMore.classList = 'viewMore fa-solid fa-image';
          viewMore_Container.appendChild(viewMore);
          const popup = document.createElement('div');
          popup.classList = 'popupBox_Extension';
          popup.id = 'viewMorePopup';
          popup.innerText = translate_strings.popupTip_Image.message;
          viewMore_Container.appendChild(popup);
          BUTTONS_FRAME.append(viewMore_Container);
          viewMore.addEventListener('click', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const TargetClick = ev.target.closest('div#MAIN_BLOCK,li#MAIN_BLOCK');
            const mode = TargetClick.getAttribute('MOD_ID');
            const tile_game = TargetClick.getAttribute('GAME_ID');
            if (mode && tile_game) {
              CREATE_MOD_IMAGES(mode, tile_game, ev.clientX, ev.clientY);
            }
          });
        }
        /*
         * ==========================================================
         * BOTÃO DOWNLOAD
         * ==========================================================
         */
        if (options['FastDownloadButton'] == true && !mod.querySelector('i#fastDld')) {
          const viewFiles_Container = document.createElement('div');
          viewFiles_Container.classList = 'viewFilesContainer';
          const fastDownload = document.createElement('i');
          fastDownload.id = 'fastDld';
          fastDownload.setAttribute('aria-hidden', true);
          fastDownload.classList = 'downloadPage fa-solid fa-cloud-arrow-down';
          viewFiles_Container.appendChild(fastDownload);
          const popup = document.createElement('div');
          popup.classList = 'popupBox_Extension';
          popup.id = 'fastDldPopup';
          popup.innerText = translate_strings.popupTip_Files.message;
          viewFiles_Container.appendChild(popup);
          BUTTONS_FRAME.appendChild(viewFiles_Container);
          fastDownload.addEventListener('click', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const TargetClick = ev.target.closest('div#MAIN_BLOCK,li#MAIN_BLOCK');
            var mode = TargetClick.getAttribute('MOD_HREF');
            if (mode) {
              openCenteredPopup(mode + '?tab=files&popup=true', 'Loading Mod...', 1200, 800);
            }
          });
        }
        /*
         * ==========================================================
         * BOTÃO DESCRIPTION
         * ==========================================================
         */
        if (options['FastDescriptionButton'] == true && !mod.querySelector('i#fastDescription')) {
          const viewDescription_Container = document.createElement('div');
          viewDescription_Container.classList = 'viewDescriptionContainer';
          const fastDescription = document.createElement('i');
          fastDescription.id = 'fastDescription';
          fastDescription.setAttribute('aria-hidden', true);
          fastDescription.classList = 'fastDescription fa-solid fa-comment-dots';
          viewDescription_Container.appendChild(fastDescription);
          const popup = document.createElement('div');
          popup.classList = 'popupBox_Extension';
          popup.id = 'fastDescriptionPopup';
          popup.innerText = translate_strings.popupTip_Description.message;
          viewDescription_Container.appendChild(popup);
          BUTTONS_FRAME.append(viewDescription_Container);
          fastDescription.addEventListener('click', async function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const TargetClick = ev.target.closest('div#MAIN_BLOCK,li#MAIN_BLOCK');
            const mode = TargetClick.getAttribute('MOD_ID');
            const tile_game = TargetClick.getAttribute('GAME_ID');
            if (mode && tile_game) {
              await CREATE_MOD_DESCRIPTION(tile_game, mode, 'descricao');
            }
          });
        }
        /*
         * ==========================================================
         * BETTER MOD BLOCKS
         * ==========================================================
         */
        if (options['BetterModBlocks'] == true) {
          const paragraph = mod.closest("div[class*='mod-tile']").querySelector("div[data-e2eid='mod-tile-summary']:not(.tilesDesc_SCROLLABLE)");
          if (!paragraph) {
            continue;
          }
          paragraph.classList.add('tilesDesc_SCROLLABLE');
          paragraph.innerText += '\n\n';
          paragraph.closest("div[class*='mod-tile']").classList.add('tileInfo_REPADDIGN');
          const parent = paragraph.closest("div[class*='mod-tile']").parentElement;
          if (parent?.tagName === "DIV" && parent.attributes.length === 0) {
            paragraph.closest("div[class*='mod-tile']").parentElement.style.display = 'grid';
          }
          document.querySelectorAll('div.fadeoff').forEach(function(fadeDiv) {
            fadeDiv.remove();
          });
        }
      }
     }, 50);
  } catch (e) {
    throw e;
  }
}

function LOAD_MODBLOCK_INFO(MOD_BLOCK) {
  if (!MOD_BLOCK) {
    return
  }
  // MOD NUMBER ID
  const MOD_ID = Number(MOD_BLOCK.querySelector("a[href*='/mods/']")?.href.split('/mods/')[1]) || null
  //GAME NAME
  const GAME_NAME = MOD_BLOCK.querySelector("a[class^='nxm-link'][data-e2eid='mod-tile-game']")?.innerText || MOD_BLOCK.querySelector("div[data-e2eid='mod-tile-teaser'] a.nxm-link.nxm-link-info[href]")?.innerText || gameId
  // GAME NUMBER ID
  if (MOD_BLOCK.querySelector("img[src*='/mod-images/'][alt], img[src*='/mods/'][alt]")) {
    const srcUrl = MOD_BLOCK.querySelector("img[src*='/mod-images/'][alt], img[src*='/mods/'][alt]").src
    //MOD_BLOCK.querySelector("a[data-e2eid='mod-tile-title']")?.href
    const match = srcUrl.match(/(?:mods|mod-images)\/(\d+)\//)
    var GAME_ID = Number(match ? match[1] : null)
  } else {
    const srcUrl = MOD_BLOCK.querySelector("a[data-e2eid='mod-tile-title'],p.tile-name a")?.href
    const match = srcUrl.split("/mods/")[0].split(".com/")[1].toLowerCase();
    var GAME_ID = Number(findGameIdByName(match))
  }
  // MOD FULL HREF
  const MOD_HREF = MOD_BLOCK.querySelector("a[href*='/mods/']")?.href
  //MOD FULL NAME
  const MOD_NAME = MOD_BLOCK.querySelector("a[data-e2eid='mod-tile-title'], p.typography-body-md, a.typography-body-md,a.nxm-link[href],p.tile-name a")?.innerText
  return {
    MOD_ID,
    GAME_ID,
    MOD_HREF,
    MOD_NAME,
    GAME_NAME
  }
}

function APPLY_NMA_MOD_BUTTONS_CSS(root) {
  if (!root || root.querySelector('#NMA_ModButtons_CSS')) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'NMA_ModButtons_CSS';
  style.textContent = `

    .downloadPage,
    .fastDescription,
    .removeContent,
    .viewMore {
        display: -webkit-box;
        display: -ms-flexbox;
        z-index: 3;
        width: 24px;
        height: 24px;
        border: 1px solid #ffffff4d;
        font-size: 15px !important;
        text-align: center !important;
        color: #fff;
        background-size: contain;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        -ms-flex-direction: column;
        -ms-flex-line-pack: center;
        -ms-flex-pack: center;
        -webkit-box-direction: normal;
        -webkit-box-orient: vertical;
        -webkit-box-pack: center;
        background: #0000004d no-repeat center center;
        cursor: pointer;
        right: 7px;
    }

    .BUTTONS_FRAME {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 40px;
        right: 7px;
        gap: 2px;
        z-index: 3 !important;
    }

    div.hiddenTile {
        opacity: 0 !important;
        -o-transition: opacity .5s ease;
        -webkit-transition: opacity .5s ease;
        transition: opacity .5s ease;
    }

    div[class*="mod-tile"]:hover div.hiddenTile {
        opacity: 1 !important;
    }

    div.IgnoreContainer:hover .popupBox_Extension,
    div.viewDescriptionContainer:hover .popupBox_Extension,
    div.viewFilesContainer:hover .popupBox_Extension,
    div.viewMoreContainer:hover .popupBox_Extension {
        display: block;
    }

    #removeContent {
        display: flex;
        position: absolute !important;
        z-index: 999 !important;
        right: 40px;
        top: 7px;
    }

    .popupBox_Extension {
        display: none;
        position: absolute;
        z-index: 1000;
        width: -webkit-max-content;
        width: -moz-max-content;
        width: max-content;
        padding: 6px;
        font-weight: bolder;
        text-align: center;
        color: #fff;
        font-size: .875rem;
        background-color: var(--color-zinc-800);
        border-radius: 5px;
        max-width: 240px;
    }

    #IgnoreContainer_PopUp {
        right: 60px;
        top: 20px;
        z-index: 99999999 !important;
    }

    #viewMorePopup {
        right: 34px;
        z-index: 99999999 !important;
    }

    #fastDldPopup {
        right: 34px;
        z-index: 99999999 !important;
    }

    #fastDescriptionPopup {
        right: 34px;
        z-index: 99999999 !important;
    }

    #fastDld {
        top: 63px !important;
        z-index: 99999999;
    }

    #fastDescription {
        top: 90px !important;
    }

    #viewSvg {
        top: 35px;
    }

    .tileInfo_REPADDIGN {
        padding: 11px 4px 15px !important;
    }

    .tilesDesc_SCROLLABLE {
        overflow-y: visible !important;
        scrollbar-width: thin !important;
    }

  `;
  root.appendChild(style);
  const faLink = document.createElement('link');
  faLink.id = 'NMA_FontAwesome_ShadowRoot';
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
  root.appendChild(faLink);
}