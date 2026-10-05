var EXTENSION_VERSION = chrome.runtime.getManifest().version;
var options = {
  "LAST_MOD_UPDATE_CHECK": 0,
  "language": "english",
  "themeSelector": "dark_1",
  "TrackingMods_RenderBy": 'alfabetico_FileName',
  "Enable_Keyboard_Shortcuts": true,
  "FastViewButton": true,
  "FastDownloadButton": true,
  "FastDescriptionButton": true,
  "FastDownloadTranslates": true,
  "FastIgnoreButton": true,
  "PopupRightScreen": true,
  "transformTextLinks": true,
  "JustBlur_IgnoredMods": false,
  "Hide_BluredContent": false,
  "AwaysChangelogs": true,
  "NexusMenus_MouseHover": true,
  "OriginalImages": false,
  "FastDownloadModManager": true,
  "DescriptionOnMouse": true,
  "NotifyUpdates": true,
  "InfiniteScroll": true,
  "AutoTrackDownloaded": false,
  "NewTab_Messenger": true,
  "AutoRotate_ModPictures": true,
  "largerYoutubeVideos": true,
  "showImagesPopup": true,
  "showVideosPopup": true,
  "ProfileOnMouse": false,
  "BetterModBlocks": true,
  "NotRenderTrackMods_Button": false,
  "ArticlesOnMouse": true,
  "CollectionsOnMouse": true,
  "SimpleMode": false,
  "HideExternalImages_ModPage": false,
  "HideRequerimentsTab": false,
  "HideTranslationsTab": false,
  "HidePermissionsTab": false,
  "HideChangelogsTab": false,
  "HideDonationsTab": false,
  "HideModCollections": false,
  "HideModsUsingThisModTab": false,
  "HideStickyPosts": false,
  "hideContentWords": false,
  "WideWebsite": false,
  "HideHiddenMods": false,
  "FixedModMenu": true,
  "Endorsed": 0,
  "FIRST_RUN": false,
  "SharePostsLinks": true,
  "BlockYoutube": true,
  "HideModStatus": false,
  "HideCollections_ModPage": false,
  "ModBlock_Render": false,
  "BlockSize_input": "250px",
  "MemoryMode": false,
  "PauseExternalGifs": true,
  "Following_EditMenu": true,
  "WebSiteFadeEffect": true,
  "NewTab_ExternalURL": true,
  "Prevent_TrackOnDownload": false,
  "Hide_CurrentGame_Image": true,
  "FAIL_SAFE_ModOrganizer_Oppened": false,
  "ShowModSearch_Bar":true,
  "ShowDateOnImages":true
};
var NexusMods_SearchOptions = {
  "checkbox-filter-alchemy": false,
  "checkbox-filter-animation": false,
  "checkbox-filter-armour": false,
  "checkbox-filter-armour-shields": false,
  "checkbox-filter-audio": false,
  "checkbox-filter-body-face-and-hair": false,
  "checkbox-filter-bug-fixes": false,
  "checkbox-filter-buildings": false,
  "checkbox-filter-cheats-and-god-items": false,
  "checkbox-filter-cities-towns-villages-and-hamlets": false,
  "checkbox-filter-clothing-and-accessories": false,
  "checkbox-filter-collectables-treasure-hunts-and-puzzles": false,
  "checkbox-filter-combat": false,
  "checkbox-filter-crafting": false,
  "checkbox-filter-creatures-and-mounts": false,
  "checkbox-filter-dungeons": false,
  "checkbox-filter-environmental": false,
  "checkbox-filter-followers-companions": false,
  "checkbox-filter-followers-companions-creatures": false,
  "checkbox-filter-gameplay": false,
  "checkbox-filter-guildsfactions": false,
  "checkbox-filter-immersion": false,
  "checkbox-filter-items-and-objects-player": false,
  "checkbox-filter-items-and-objects-world": false,
  "checkbox-filter-locations-new": false,
  "checkbox-filter-locations-vanilla": false,
  "checkbox-filter-magic-gameplay": false,
  "checkbox-filter-magic-spells-enchantments": false,
  "checkbox-filter-miscellaneous": false,
  "checkbox-filter-modders-resources": false,
  "checkbox-filter-models-and-textures": false,
  "checkbox-filter-npc": false,
  "checkbox-filter-overhauls": false,
  "checkbox-filter-patches": false,
  "checkbox-filter-player-homes": false,
  "checkbox-filter-presets-enb-and-reshade": false,
  "checkbox-filter-quests-and-adventures": false,
  "checkbox-filter-races-classes-and-birthsigns": false,
  "checkbox-filter-save-games": false,
  "checkbox-filter-shouts": false,
  "checkbox-filter-skills-and-leveling": false,
  "checkbox-filter-stealth": false,
  "checkbox-filter-user-interface": false,
  "checkbox-filter-utilities": false,
  "checkbox-filter-visuals-and-graphics": false,
  "checkbox-filter-vr": false,
  "checkbox-filter-weapons": false,
  "checkbox-filter-weapons-and-armour": false,
  "checkbox-filter-czech": false,
  "checkbox-filter-dutch": false,
  "checkbox-filter-english": false,
  "checkbox-filter-french": false,
  "checkbox-filter-german": false,
  "checkbox-filter-hungarian": false,
  "checkbox-filter-italian": false,
  "checkbox-filter-japanese": false,
  "checkbox-filter-korean": false,
  "checkbox-filter-mandarin": false,
  "checkbox-filter-polish": false,
  "checkbox-filter-portuguese": false,
  "checkbox-filter-russian": false,
  "checkbox-filter-spanish": false,
  "checkbox-filter-turkish": false,
  "checkbox-filter-ukrainian": false
}
var hiddenContent = "";
var hiddenMods = {};
var NEXUS_API = 0;
var mods = {};
var MOD_CACHE = {};
var mods_data = {};
var YOUTUBE_STATUS = 'lock';
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      const {
        action,
        item,
        lang,
        modsData,
        modId,
        mod_id,
        fileId,
        game,
        mod_name,
        gameId,
        gameNumber,
        ModCategory,
        thumbnail,
        game_Name,
        modLink,
        option,
        backupItems
      } = message;
      switch (action) {
        case "SaveBox":
          await handleSaveBox(item, message.checado, sendResponse);
          break;
        case "Load_Messages":
          await handleLoadMessages(lang, sendResponse);
          break;
        case "LoadCustomCSS":
          await LoadCustomCSS(sendResponse);
          break;
        case "ExportConfig":
          await ExportConfig(sendResponse);
          break;
        case "ImportConfig":
          await ImportConfig(backupItems, sendResponse);
          break;
        case "NMA_WAIT_FOR_DOWNLOAD":
          NMA_WAITING_DOWNLOAD(message.url, sender.tab?.id);
          break;
        case "SaveMods_Cache":
          await handleSaveModsCache(modsData, sendResponse);
          break;
        case "SaveMods_Thumbnails":
          await handleSaveModsThumbnails(modId, fileId, message.item, sendResponse);
          break;
        case "LoadMods_Thumbnails":
          await handleLoadModsThumbnails(sendResponse);
          break;
        case "Favorite_Mod":
          await FAVORITE_MOD(modLink, modId, gameNumber, ModCategory, thumbnail, mod_name, game_Name, sendResponse)
          break;
        case "GET_FAVORITE_MODS":
          await GET_FAVORITE_MODS(modId, gameNumber, ModCategory, sendResponse)
          break;
        case "LoadBox":
          await handleLoadBox(sendResponse);
          break;
        case "Load_NEXUSAPI":
          await handleLoadNexusAPI(sendResponse);
          break;
        case "Load_WordList":
          await loadHiddenContent(sendResponse);
          break;
        case "Save_WordList":
          await saveHiddenContent(message.itens, sendResponse);
          break;
        case "Save_HiddenMod":
          await handleSaveHiddenMod(game, mod_id, mod_name, gameId, sendResponse);
          break;
        case "Load_HiddenMods":
          await handleLoadHiddenMods(sendResponse);
          break;
        case "Remove_HiddenMod":
          await delete_HiddenMod(game, message.mod, sendResponse);
          break;
        case "Delete_HiddenMods":
          await delete_HiddenMods(sendResponse);
          break;
        case "PopupConfig":
          await handlePopupConfig(message.type, sendResponse);
          break;
        case "TrackMod":
          await handleTrackMod(message, sendResponse);
          break;
        case "LoadMods":
          await Load_NEXUSAPI();
          if (NEXUS_API == 0 || NEXUS_API == "0" || !NEXUS_API) {
            sendResponse({
              success: false,
              error: "User Not Logget In on NexusMods API to NexusMods Advance"
            });
            return;
          }
          await LOAD_MODDATA();
          sendResponse({
            success: true,
            data: mods
          });
          break;
        case "LoadGameList":
          LOAD_GAMES();
          if (GAMES.length > 0 && GAME_LOADING_BUSY == false) {
            sendResponse({
              success: true,
              data: GAMES
            });
          } else {
            sendResponse({
              success: false,
              data: []
            });
          }
          break;
        case "DeleteMod":
          await LOAD_MODDATA();
          await deleteMod(message.mod_name, message.modId, message.fileId, sendResponse);
          break;
        case "CheckFilesUpdates":
          if (modLoader_Busy == true) {
            sendResponse({
              success: false,
              message: "Mod Loader Busy"
            });
          } else {
            
            SETUP_UPDATE_ALARM();
            UpdateStartUp();
            sendResponse({
              sucess: true
            });
          }
          break;
        case 'UnlockYoutube':
          await SETUP_YOUTUBE_DEFER("unlock");
          YOUTUBE_STATUS = 'unlock';
          await chrome.storage.local.set({
            "YOUTUBE_STATUS": YOUTUBE_STATUS
          })
          sendResponse({
            success: true,
            message: "Youtube Desbloqueado",
            YOUTUBE_STATUS: 'unlock'
          });
          break;
        case 'lockYoutube':
          await SETUP_YOUTUBE_DEFER("block");
          YOUTUBE_STATUS = 'lock';
          await chrome.storage.local.set({
            "YOUTUBE_STATUS": YOUTUBE_STATUS
          })
          sendResponse({
            success: true,
            message: "Youtube Bloqueado",
            YOUTUBE_STATUS: 'lock'
          });
          break;
        case 'ShowEndorsePopup':
          sendResponse({
            success: true,
            message: canShowEndorse
          });
          break;
        case 'GET_OUTDATED_MODLIST':
          if (modLoader_Busy == true) {
            sendResponse({
              success: false,
              message: "Mod Loader Busy"
            });
          } else {
            await LOAD_MODDATA();
            outdated_mods = 0;
            for (const modName of Object.keys(mods)) {
              const mod = mods[modName];
              const fileData = mods_data[mod.mod_id]?.["LAST_LOAD_" + mod.file_id];
              if (fileData && fileData.update_state === "outdated") {
                outdated_mods++;
              }
            }
            if (outdated_mods > 0 && options['NotifyUpdates'] == true) {
              await LOAD_OPTIONS();
              if (options['language'] == "english") {
                var mods_message = " Mods Outdated!"
              } else if (options['language'] == "portuguese") {
                var mods_message = " Mods Desatualizados!"
              } else if (options['language'] == "alemao") {
                var mods_message = " Veraltete Mods!"
              } else if (options['language'] == "polones") {
                var mods_message = " Przestarzałe mody!"
              } else if (options['language'] == "russo") {
                var mods_message = " Устаревшие моды!"
              } else if (options['language'] == "frances") {
                var mods_message = " Mods obsolètes !"
              }
              chrome.action.setBadgeText({
                text: String(outdated_mods)
              });
              chrome.action.setTitle({
                title: outdated_mods + mods_message
              });
              chrome.action.setBadgeBackgroundColor({
                color: '#e9c389'
              });
            } else {
              chrome.action.setBadgeText({
                text: ''
              });
            }
            sendResponse({
              success: true,
              message: outdated_mods
            });
          }
          break;
        case "CheckModLoaderBusy":
          sendResponse({
            busy: modLoader_Busy
          });
          break;
        case 'Block_InitialLoad':
          //BLOCK_GAME_IMAGES();
          sendResponse({
            success: true
          });
          break;
        case 'Unblock_InitialLoad':
          //UNBLOCK_GAME_IMAGES();
          sendResponse({
            success: true
          });
          break;
        case 'Update_NexusMods_SearchOptions':
          await updateOption_NexusMods_SearchOptions(option, sendResponse)
          break;
        case 'NexusMods_SearchOptions':
          await handle_NexusMods_SearchOptions(sendResponse)
          break;
        default:
          sendResponse({
            success: false,
            message: "Ação desconhecida"
          });
          break;
      }
    } catch (e) {
      console.error("Error in background.js:", e);
      sendResponse({
        success: false,
        message: e.message
      });
    }
  })();
  return true;
});
var NMA_PENDING_DOWNLOADS = [];
async function NMA_WAITING_DOWNLOAD(url, tabId) {
  if (!tabId || !url) {
    return;
  }
  let canClose = false;
  let openerTabId = null;
  try {
    const tab = await chrome.tabs.get(tabId);
    openerTabId = tab.openerTabId ?? null;
    // ========================================================
    // A aba precisa ter sido aberta por outra aba
    // ========================================================
    if (openerTabId != null) {
      try {
        const openerTab = await chrome.tabs.get(openerTabId);
        const openerUrl = openerTab.url || "";
        // ====================================================
        // Confirma que a aba que abriu esta é do Nexus
        // ====================================================
        canClose = openerUrl.startsWith("https://www.nexusmods.com/") || openerUrl.startsWith("https://next.nexusmods.com/");
      } catch (error) {
        console.warn("NMA: Não foi possível verificar a aba opener:", error);
        canClose = false;
      }
    }
  } catch (error) {
    console.warn("NMA: Não foi possível obter informações da aba:", error);
    canClose = false;
  }
  console.log("NMA: AGUARDANDO DOWNLOAD DA ABA:", tabId);
  console.log("NMA: URL ESPERADA:", url);
  console.log("NMA: OPENER TAB:", openerTabId);
  console.log("NMA: ABA PODE SER FECHADA:", canClose);
  // ========================================================
  // Remove qualquer espera anterior dessa mesma aba
  // ========================================================
  NMA_PENDING_DOWNLOADS = NMA_PENDING_DOWNLOADS.filter(item => item.tabId !== tabId);
  NMA_PENDING_DOWNLOADS.push({
    tabId: tabId,
    url: url,
    time: Date.now(),
    openerTabId: openerTabId,
    canClose: canClose
  });
}
chrome.downloads.onCreated.addListener(async (download) => {
  await LOAD_OPTIONS();
  if (options.FastDownloadModManager !== true) {
    return;
  }
  console.log("NMA: DOWNLOAD DETECTADO!");
  console.log("NMA: DOWNLOAD URL:", download.url);
  if (!NMA_PENDING_DOWNLOADS.length) {
    console.log("NMA: DOWNLOAD NÃO ESTÁ ASSOCIADO A UMA ABA DO NMA.");
    return;
  }
  // ==========================================================
  // PROCURA O DOWNLOAD CORRESPONDENTE
  // ==========================================================
  const pendingIndex = NMA_PENDING_DOWNLOADS.findIndex(item => {
    // URL exata
    if (item.url === download.url) {
      return true;
    }
    // Caso o Nexus faça alguma pequena alteração na URL
    try {
      const expected = new URL(item.url);
      const detected = new URL(download.url);
      return (expected.origin === detected.origin && expected.pathname === detected.pathname && expected.search === detected.search);
    } catch (e) {
      return false;
    }
  });
  if (pendingIndex === -1) {
    console.log("NMA: DOWNLOAD DETECTADO, MAS NÃO CORRESPONDE AO DOWNLOAD PENDENTE.");
    return;
  }
  const pending = NMA_PENDING_DOWNLOADS[pendingIndex];
  console.log("NMA: DOWNLOAD CORRESPONDE À ABA:", pending.tabId);
  console.log("NMA: ABA PODE SER FECHADA:", pending.canClose);
  // ==========================================================
  // REMOVE DA FILA
  // ==========================================================
  NMA_PENDING_DOWNLOADS.splice(pendingIndex, 1);
  // ==========================================================
  // NÃO FECHA A ABA PRINCIPAL
  // ==========================================================
  if (!pending.canClose) {
    console.log("NMA: DOWNLOAD DETECTADO, MAS A ABA NÃO É AUXILIAR.");
    chrome.tabs.sendMessage(pending.tabId, {
      action: "NMA_GO_BACK_AFTER_DOWNLOAD"
    }).catch(() => {});
    return;
  }
  // ==========================================================
  // FECHA SOMENTE ABA AUXILIAR
  // ==========================================================
  setTimeout(async () => {
    try {
      await chrome.tabs.remove(pending.tabId);
      console.log("NMA: ABA AUXILIAR FECHADA APÓS INÍCIO DO DOWNLOAD:", pending.tabId);
    } catch (error) {
      console.warn("NMA: NÃO FOI POSSÍVEL FECHAR A ABA:", error);
    }
  }, 1000);
});
var ExportConfig_Items = {}
async function ExportConfig(sendResponse) {
  await LOAD_OPTIONS();
  await LOAD_MODDATA();
  await LOAD_HIDDEN_MODS();
  await loadHiddenContent_export();
  options.LAST_MOD_UPDATE_CHECK = 0;
  options.FAIL_SAFE_ModOrganizer_Oppened = false;
  options.Endorsed = 0;
  options.FIRST_RUN=true;
  resetCustom_ModDataItem(mods_data);
  ExportConfig_Items = {
    extension_version: EXTENSION_VERSION,
    browser: navigator.userAgent.includes("Firefox") ? "Firefox" : "Chromium",
    exportedAt: new Date().toISOString(),
    data: {
      options,
      mods,
      mods_data,
      hiddenMods,
      hiddenContent
    }
  };
  sendResponse({
    success: true,
    data: ExportConfig_Items
  });
}
async function ImportConfig(backupItems, sendResponse) {
  if (!backupItems || typeof backupItems !== "object") {
    sendResponse({
      success: false,
      message: "Invalid backup."
    });
    return;
  }
  await LOAD_MODDATA();
  const importedOptions = backupItems.options ?? {};
  for (const key in importedOptions) {
    if (!(key in options)) continue;
    if (typeof importedOptions[key] !== typeof options[key]) continue;
    options[key] = importedOptions[key];
  }
  mods = backupItems.mods ?? {};
  mods_data = backupItems.mods_data ?? {};
  hiddenMods = backupItems.hiddenMods ?? {};
  hiddenContent = backupItems.hiddenContent ?? [];
  await saveHiddenContent(hiddenContent, nullFunc)
  await SAVE_HIDDEN_MOD();
  await SAVE_MODDATA();
  await saveMods();
  await SAVE_OPTIONS();
  await CheckModUpdates();
  sendResponse({
    success: true,
    message: "Resposta Recebida " + JSON.stringify(backupItems)
  });
}

function nullFunc() {}

function resetCustom_ModDataItem(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key in obj) {
    if (key.startsWith("LAST_LOAD_") && obj[key]?.Last_Load_Timestamp !== undefined) {
      obj[key].Last_Load_Timestamp = 0;
      obj[key].description = '';
    }
    if (typeof obj[key] === "object") {
      resetCustom_ModDataItem(obj[key]);
    }
  }
}
async function loadHiddenContent_export() {
  chrome.storage.local.get('hiddenContent', (result) => {
    if (result.hiddenContent) {
      hiddenContent = result.hiddenContent
    }
  });
}
async function handleSaveBox(item, checado = false, sendResponse) {
  if (item === 'NEXUS_API') {
    await chrome.storage.local.set({
      "nexususer": checado
    });
    NEXUS_API = checado;
    CheckModUpdates();
    sendResponse({
      success: true
    });
    return;
  }
  options[item] = checado;
  await SAVE_OPTIONS(item);
  await LOAD_OPTIONS();
  checkEndorseTimer();
  if (item === "NotifyUpdates" || item === 'NEXUS_API' || item === "LAST_MOD_UPDATE_CHECK") {
    
  SETUP_UPDATE_ALARM();
    UpdateStartUp();
  }
  sendResponse({
    success: true,
    message: `Opção ${item} Salvo`
  });
}
async function handleLoadMessages(lang, sendResponse) {
  const response = await fetch(`/_locales/${lang}/messages.json`);
  const messages = await response.json();
  sendResponse({
    success: true,
    message: messages
  });
}
async function LoadCustomCSS(sendResponse) {
  const response = await fetch(`/script/NexusMods_FadeEffect.css`);
  const messages = await response.text();
  sendResponse({
    success: true,
    message: messages
  });
}
async function handleSaveModsCache(modsData, sendResponse) {
  await LOAD_MODDATA();
  for (const [modId, fileData] of Object.entries(modsData)) {
    mods_data[modId] = mods_data[modId] || {
      'thumbnail': '0'
    };
    for (const [fileId, modData] of Object.entries(fileData)) {
      mods_data[modId][`LAST_LOAD_${fileId}`] = modData;
      mods_data[modId][`LAST_LOAD_${fileId}`]['size'] ||= 0;
    }
  }
  await saveMods();
  await SAVE_MODDATA();
  sendResponse({
    success: true,
    message: "Caches de Mods salvos!",
    data: mods
  });
}
async function handleSaveModsThumbnails(modId, fileId, item, sendResponse) {
  await LOAD_MODDATA();
  mods_data[modId] = mods_data[modId] || {
    "thumbnail": item,
    [`LAST_LOAD_${fileId}`]: {
      "Last_Load_Timestamp": 0,
      "changelog": 0,
      "description": 0,
      "mod_name": 0,
      "size": 0,
      "update_state": 'outdated'
    }
  };
  mods_data[modId]['thumbnail'] = item;
  await SAVE_MODDATA();
  sendResponse({
    success: true
  });
}
async function handleLoadModsThumbnails(sendResponse) {
  await LOAD_MODDATA();
  sendResponse({
    success: true,
    data: mods_data
  });
}
async function handleLoadBox(sendResponse) {
  await LOAD_OPTIONS();
  sendResponse({
    success: true,
    data: options
  });
}
async function handleLoadNexusAPI(sendResponse) {
  await Load_NEXUSAPI();
  sendResponse({
    success: true,
    data: NEXUS_API
  });
}
async function handleSaveHiddenMod(game, modId, mod_name, gameId, sendResponse) {
  await LOAD_HIDDEN_MODS();
  await HIDE_MOD(game, modId, mod_name, gameId, sendResponse);
}
async function handleLoadHiddenMods(sendResponse) {
  await LOAD_HIDDEN_MODS();
  sendResponse({
    success: true,
    data: hiddenMods
  });
}
async function delete_HiddenMods(sendResponse) {
  await LOAD_HIDDEN_MODS();
  hiddenMods = {}
  await SAVE_HIDDEN_MOD();
  sendResponse({
    success: true,
    message: "Mods Ocultos deletados!"
  });
}
async function handlePopupConfig(type, sendResponse) {
  if (popupWindowId !== null) {
    chrome.windows.get(popupWindowId, {
      populate: true
    }, (window) => {
      if (window) {
        const popupTab = window.tabs.find(tab => tab.url.includes("config.html?popup=true"));
        if (popupTab) {
          chrome.windows.remove(popupWindowId, () => {
            popupWindowId = null;
            openPopup(type);
          });
        } else {
          openPopup(type);
        }
      } else {
        popupWindowId = null;
        openPopup(type);
      }
    });
  } else {
    openPopup(type);
  }
  sendResponse({
    success: true,
    data: options
  });
}
async function updateOption_NexusMods_SearchOptions(option, sendResponse) {
  chrome.storage.local.set({
    'NexusMods_SearchOptions': option
  });
  sendResponse({
    success: true,
    message: option
  });
}
async function handle_NexusMods_SearchOptions(sendResponse) {
  chrome.storage.local.get('NexusMods_SearchOptions', async (result) => {
    if (result.NexusMods_SearchOptions) {
      NexusMods_SearchOptions = result.NexusMods_SearchOptions;
    } else {
      chrome.storage.local.set({
        'NexusMods_SearchOptions': NexusMods_SearchOptions
      });
    }
    sendResponse({
      success: true,
      message: NexusMods_SearchOptions
    });
  })
}
var favorite_mods = {}
async function GET_FAVORITE_MODS(modId, gameNumber, modCategory, sendResponse) {
  chrome.storage.local.get('favoriteMods', async (result) => {
    favorite_mods = result.favoriteMods;
    sendResponse({
      success: true,
      message: favorite_mods
    });
  })
}
async function FAVORITE_MOD(modLink, modId, gameNumber, modCategory, thumbnail, modName, game_Name, sendResponse) {
  chrome.storage.local.get('favoriteMods', async (result) => {
    let favorite_mods = result.favoriteMods;
    if (!favorite_mods || Array.isArray(favorite_mods)) {
      favorite_mods = {};
    }
    // cria o array do jogo se não existir
    if (!favorite_mods[gameNumber]) {
      favorite_mods[gameNumber] = [];
    }
    // verifica se já existe esse mod
    const exists = favorite_mods[gameNumber].some(mod => String(mod.modId) === String(modId));
    if (!exists) {
      favorite_mods[gameNumber].push({
        modLink,
        modId,
        modCategory,
        thumbnail,
        modName,
        game_Name
      });
    }
    favorite_mods = CLEAN_FAVORITES(favorite_mods);
    await SAVE_FAVORITE_MODS(favorite_mods);
    sendResponse({
      success: true,
      message: exists ? "Mod já estava favoritado" : "Mod favoritado",
      favoriteArray: favorite_mods
    });
  });
}

function CLEAN_FAVORITES(obj) {
  if (Array.isArray(obj)) {
    // converte array bugado pra objeto
    const newObj = {};
    obj.forEach((val, index) => {
      if (val) {
        newObj[index] = val;
      }
    });
    return newObj;
  }
  return obj;
}

function SAVE_FAVORITE_MODS(favorite_mods) {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      favoriteMods: favorite_mods
    }, () => {
      resolve();
    });
  });
}
async function handleTrackMod(message, sendResponse) {
  await LOAD_MODDATA();
  await SAVE_MOD(message.mod, message.mod_name, message.file_id, message.game, message.version, message.updated, message.category, message.mod_Fullname, message.mod_thumbnail, message.gameName, message.game_number);
  sendResponse({
    success: true,
    message: `Mod ${message.mod_name} Atualizado!`
  });
}
let popupWindowId = null;

function openPopup(tipo) {
  if (tipo == "mods") {
    var u = "config.html?popup=true&tab=myMods";
  } else if (tipo == "cdn_test") {
    var u = "config.html?popup=true&tab=settings&run=CdnTest";
  } else {
    var u = "config.html?popup=true&tab=settings";
  }
  chrome.windows.create({
    url: chrome.runtime.getURL(u),
    type: "popup",
    width: 810,
    height: 1000,
    focused: true
  }, (newWindow) => {
    popupWindowId = newWindow.id;
  });
}
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    popupWindowId = null;
  }
});
async function SAVE_MODDATA() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      mods_data: mods_data
    }, () => {
      resolve();
    });
  });
}
async function LOAD_MODDATA() {

  return new Promise((resolve, reject) => {

    chrome.storage.local.get(['mods', 'mods_data'], (result) => {

      if (result.mods) {
        mods = result.mods;
      }

      if (result.mods_data) {
        mods_data = result.mods_data;
      }

      resolve();

    });

  });

}
async function CLEAN_MODS_DATA() {

  const activeFileIds = new Set();

  // Todos os file_id atualmente existentes em mods
  for (const modName in mods) {

    const mod = mods[modName];

    if (mod.file_id != null) {
      activeFileIds.add(String(mod.file_id));
    }
  }

  let removedCount = 0;

  // Remove LAST_LOAD de arquivos que não existem mais em mods
  for (const modId in mods_data) {

    for (const key in mods_data[modId]) {

      if (!key.startsWith("LAST_LOAD_")) {
        continue;
      }

      const fileId = key.substring("LAST_LOAD_".length);

      if (!activeFileIds.has(String(fileId))) {

        // Mostra a mensagem somente no primeiro item removido
        if (removedCount == 0) {
          console.log(
            "%c[MOD_DATA] Verificando dados antigos...",
            "padding:2px;background:#2196F3;color:white;font-weight:bold"
          );
        }

        console.log(
          "%c[MOD_DATA] Removendo arquivo antigo:",
          "padding:2px;background:#ff9800;color:black;font-weight:bold",
          "Mod ID:", modId,
          "File ID:", fileId,
          "Chave:", key,
          mods_data[modId][key]
        );

        delete mods_data[modId][key];

        removedCount++;
      }
    }
  }

  // Só salva se alguma coisa realmente foi removida
  if (removedCount > 0) {

    console.log(
      "%c[MOD_DATA] Salvando limpeza: " + removedCount + " LAST_LOAD removidos.",
      "padding:2px;background:#4CAF50;color:white;font-weight:bold"
    );

    await SAVE_MODDATA();
  }

}

function saveMods() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      mods: mods
    }, () => {
      resolve();
    });
  });
}

function resetMods() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove('mods', () => {
      mods = {};
      mods_data = {};
      SAVE_MODDATA();
      saveMods();
      resolve();
    });
  });
}
async function SAVE_GAMES() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      "games_list": GAMES
    }, () => {
      resolve();
    });
  });
}
async function LOAD_GAMES() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("games_list", (data) => {
      if (data.games_list) {
        GAMES = Object.assign(GAMES, data.games_list);
        if (GAMES.length > 0) {
          GAME_LOADING_BUSY = false;
        }
      }
      resolve(GAMES);
    });
  });
}
async function SAVE_OPTIONS(item) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      "options_data": options
    }, () => {
      resolve();
    });
  });
}
async function LOAD_OPTIONS() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("options_data", (data) => {
      if (data.options_data) {
        options = Object.assign(options, data.options_data);
      }
      resolve(options);
    });
  });
}
async function Load_NEXUSAPI() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("nexususer", (data) => {
      if (data) {
        NEXUS_API = data.nexususer;
        api_headers = {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'apikey': NEXUS_API
          }
        }
      } else {
        NEXUS_API = 0;
      }
      resolve();
    });
  });
}
async function deleteMod(modName, modId, file_id, sendResponse) {
  chrome.storage.local.get('mods', (result) => {
    if (result.mods) {
      mods = result.mods;
      if (mods.hasOwnProperty(modName)) {
        delete mods[modName];
        delete mods_data[modId]["LAST_LOAD_" + file_id];
        console.log(`Mod "${modName}" removido com sucesso.`);
        sendResponse({
          success: true,
          message: "Mod " + modName + " Deletado"
        });
        SAVE_MODDATA();
        saveMods();
      } else {
        sendResponse({
          success: true,
          message: "Mod " + modName + " Não encontrado"
        });
        console.error(`Mod "${modName}" não encontrado.`);
      }
    }
  });
}
async function SAVE_MOD(mod, mod_name, file_id, game, version, updated, category, fullname, thumbnail, gameName, game_number) {
  console.log("==================================================");
  console.log("NMA: SAVE_MOD iniciado");
  console.log("NMA: Mod:", mod_name);
  console.log("NMA: Mod ID:", mod);
  console.log("NMA: File ID:", file_id);
  console.log("NMA: Version:", version);
  console.log("NMA: Game:", game);
  console.log("==================================================");
  return new Promise(async (resolve, reject) => {
    try {
      
      // =========================================================
      // CARREGA mods_data ANTES DE CRIAR O REGISTRO
      // =========================================================
      await LOAD_MODDATA();
      const MOD_CHANGED = !mods[mod] || mods[mod].mod_name !== mod_name || mods[mod].file_id !== file_id || mods[mod].game !== game || mods[mod].version !== version || mods[mod].updated !== updated || mods[mod].category !== category || mods[mod].fullname !== fullname || mods[mod].gameName !== gameName || mods[mod].game_number !== game_number;
      if (!MOD_CHANGED) {
        console.log("NMA: Mod já está salvo:", mods[mod]);
        resolve();
        return;
      }
      // =========================================================
      // PROCURA UM ARQUIVO ANTIGO QUE FOI SUBSTITUÍDO POR ESTE
      // =========================================================
      for (const oldModName of Object.keys(mods)) {
        if (oldModName === mod_name) {
          continue;
        }
        const oldMod = mods[oldModName];
        if (!oldMod || String(oldMod.mod_id) !== String(mod)) {
          continue;
        }
        const oldModData = mods_data[oldMod.mod_id];
        if (!oldModData) {
          continue;
        }
        const oldFileData = oldModData["LAST_LOAD_" + oldMod.file_id];
        if (oldFileData && Number(oldFileData.last_FileID) === Number(file_id)) {
          console.log("NMA: Arquivo antigo substituído:", oldModName, "→", mod_name, "file_id:", file_id);
          delete mods[oldModName];
          break;
        }
      }
      // =========================================================
      // SALVA O NOVO MOD
      // =========================================================
      mods[mod_name] = {
        mod_id: mod,
        game_number: game_number,
        game: game,
        file_id: file_id,
        updated: updated,
        updatedLegible: formatDate(updated),
        version: version,
        category: category,
        gameName: gameName,
        full_name: fullname
      };
      console.log("NMA: Novo registro criado em mods:", mods[mod_name]);
      if (!mods_data[mod]) {
        mods_data[mod] = {
          "thumbnail": thumbnail
        };
      } else if (thumbnail && (!mods_data[mod].thumbnail || mods_data[mod].thumbnail === "0")) {
        mods_data[mod].thumbnail = thumbnail;
      }
      // =========================================================
      // GARANTE QUE O LAST_LOAD DO NOVO FILE_ID EXISTE
      // =========================================================
      if (!mods_data[mod]["LAST_LOAD_" + file_id]) {
        mods_data[mod]["LAST_LOAD_" + file_id] = {
          "Last_Load_Timestamp": 0,
          "lastVersion": version,
          "last_FileID": file_id,
          "mod_id": mod,
          "mod_name": mod_name,
          "update_state": "outdated",
          "size": 0,
          "description": 0,
          "changelog": 0
        };
        console.log("NMA: LAST_LOAD criado para o novo arquivo:", "LAST_LOAD_" + file_id);
      }
      // Salva primeiro o mod e o registro inicial.
      console.log("NMA: Agora processando atualização diretamente pelo GetFileInfo...");
      console.log("NMA: --------------------------------------------------");
      // =========================================================
      // PROCESSA IMEDIATAMENTE O ARQUIVO RECÉM-SALVO
      // =========================================================
      await GetFileInfo(mod, game, version, updated, mod_name, Number(file_id), game_number);
      console.log("NMA: GetFileInfo finalizado para:", mod_name);
      console.log("NMA: Resultado:", mods_data[mod]?.["LAST_LOAD_" + file_id]);
      await SAVE_MODDATA();
      await saveMods();
      console.log("NMA: Mod salvo no storage.");
      console.log("NMA: SAVE_MOD concluído.");
      console.log("==================================================");
      resolve();
    } catch (error) {
      console.error("NMA: Erro ao salvar/processar mod:", mod_name, error);
      reject(error);
    }
  });
}
async function HIDE_MOD(game, modId, name, gameId, sendResponse) {
  return new Promise(async (resolve, reject) => {
    if (!hiddenMods[game]) {
      hiddenMods[game] = {};
    }
    if (!hiddenMods[game][modId] || hiddenMods[game][modId].mod_name !== name) {
      hiddenMods[game][modId] = {
        mod_name: name,
        mod_id: modId,
        game_id: gameId
      };
      // Salva as modificações
      SAVE_HIDDEN_MOD().then(() => {
        console.log('Mod Oculto:', hiddenMods[game][modId].mod_name, hiddenMods[game]);
        resolve();
      });
    } else {
      console.log('Mod já foi Oculto:', hiddenMods[game]);
      resolve();
    }
    // Envia a resposta com o status de sucesso
    sendResponse({
      success: true,
      data: hiddenMods
    });
  });
}
async function LOAD_HIDDEN_MODS() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('hiddenMods', (result) => {
      if (result.hiddenMods) {
        hiddenMods = result.hiddenMods;
      }
      resolve();
    });
  });
}
async function delete_HiddenMod(game, modId, sendResponse) {
  chrome.storage.local.get('hiddenMods', async (result) => {
    if (result.hiddenMods) {
      hiddenMods = result.hiddenMods;
      if (hiddenMods.hasOwnProperty(game)) {
        delete hiddenMods[game][modId];
        if (Object.entries(hiddenMods[game]).length <= 0) {
          delete hiddenMods[game];
        }
        await SAVE_HIDDEN_MOD();
        sendResponse({
          success: true,
          message: "Mod Deletado"
        });
      }
    }
  });
}

function SAVE_HIDDEN_MOD() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      hiddenMods: hiddenMods
    }, () => {
      resolve();
    });
  });
}
async function loadHiddenContent(sendResponse) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('hiddenContent', (result) => {
      if (result.hiddenContent) {
        hiddenContent = result.hiddenContent;
        sendResponse({
          success: true,
          message: hiddenContent
        });
      } else {
        sendResponse({
          success: false,
          message: "No Words Yet"
        });
      }
      resolve();
    });
  });
}
async function saveHiddenContent(word, sendResponse) {
  if (!word || !Array.isArray(word)) {
    chrome.storage.local.set({
      "hiddenContent": ''
    });
    sendResponse({
      success: true,
      message: "No Hidden Words Provided"
    });
    return;
  }
  return new Promise((resolve, reject) => {
    const dadosUnicos = [...new Set(word.filter(value => value.trim() !== ""))];
    const dadosFormatados = [dadosUnicos.join("#-#")];
    chrome.storage.local.get({
      hiddenContent: word
    }, data => {
      chrome.storage.local.set({
        "hiddenContent": dadosFormatados
      }, () => {
        sendResponse({
          success: true,
          message: dadosFormatados
        });
        resolve();
      });
    });
  });
}
var outdated_mods = 0;
var modLoader_Busy = false;
async function CheckModUpdates() {
  await Load_NEXUSAPI();
  if (NEXUS_API == 0 || NEXUS_API == "0" || !NEXUS_API) {
    console.error("Cant check Mod Updates: NexusMods Account not connected!");
    return;
  }
  if (modLoader_Busy == true) {
    return;
  }
  if (options['MemoryMode'] == true) {
    console.error("Can't Update Mods: Memory Mode Option Enabled")
    return;
  }
  modLoader_Busy = true;
  outdated_mods = 0;
  await LOAD_MODDATA();
  const modEntries = Object.entries(mods);
  const BATCH_SIZE = 10;
  for (let i = 0; i < modEntries.length; i += BATCH_SIZE) {
    const batch = modEntries.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async ([modName, modInfo]) => {
      const {
        mod_id,
        game,
        version,
        updated,
        category,
        game_number,
        full_name,
        file_id,
      } = modInfo;
      await GetFileInfo(mod_id, game, version, updated, modName, Number(file_id), game_number);
    }));
  }
  
      await saveMods();
      await SAVE_MODDATA();
  NotifyOutdatedCount();
  temp_FetchCache = {};
  modLoader_Busy = false;
}

function NotifyOutdatedCount(){
console.log(outdated_mods + " mods desatualizados")
  if (outdated_mods > 0 && options['NotifyUpdates'] == true) {
    if (options['language'] == "english") {
      var mods_message = " Mods Outdated!"
    } else if (options['language'] == "portuguese") {
      var mods_message = " Mods Desatualizados!"
    } else if (options['language'] == "alemao") {
      var mods_message = " Veraltete Mods!"
    } else if (options['language'] == "polones") {
      var mods_message = " Przestarzałe mody!"
    } else if (options['language'] == "russo") {
      var mods_message = " Устаревшие моды!"
    } else if (options['language'] == "frances") {
      var mods_message = " Mods obsolètes !"
    }
    chrome.notifications.create('ModUpdateCheck', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'NexusMods Advance',
      message: outdated_mods + mods_message,
      priority: 2
    });
    chrome.action.setBadgeText({
      text: String(outdated_mods)
    });
    chrome.action.setTitle({
      title: outdated_mods + mods_message
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#e9c389'
    });
  } else {
    chrome.action.setBadgeText({
      text: ''
    });
  }
}
var api_headers = {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'apikey': "0"
  }
}

function NORMALIZE_FILE_NAME(name) {
  return name.replace(/\bv?\d+(?:\.\d+)+\b/gi, '').replace(/\s+/g, ' ').trim();
}
var temp_FetchCache = {};
var activeRequests = {};
async function GetFileInfo(modIde, gameId, version, updated, title, file_id, game_number) {
  try {
    let DATA;
    // ============================================================
    // CACHE
    // ============================================================
    if (temp_FetchCache[gameId] && temp_FetchCache[gameId][modIde]) {
      DATA = temp_FetchCache[gameId][modIde].response;
      console.log("%cCarregando " + title + " do Cache de FetchCache", "padding:2px;background: #ff2f2f;font-weight:bold;color:black");
    }
    // ============================================================
    // REQUISIÇÃO JÁ EM ANDAMENTO
    // ============================================================
    else if (activeRequests[modIde]) {
      console.log("Aguardando requisição já em andamento para " + title);
      DATA = await activeRequests[modIde];
    }
    // ============================================================
    // NOVA REQUISIÇÃO
    // ============================================================
    else {
      activeRequests[modIde] = (async () => {
        const response = await fetch("https://api.nexusmods.com/v1/games/" + gameId + "/mods/" + modIde + "/files.json", api_headers);
        if (!response.ok) {
          console.error("Erro de Conexão: " + response.status);
          if (response.status == 403) {
            console.log("Error loading mod " + title + " MOD Doest not exist anymore.");
            outdated_mods++;
          }
          return null;
        }
        const DATA = await response.json();
        return DATA;
      })();
      DATA = await activeRequests[modIde];
      // A requisição terminou.
      delete activeRequests[modIde];
      if (!DATA) {
        return;
      }
      // Salva no cache para os próximos
      // arquivos do mesmo mod_id.
      if (!temp_FetchCache[gameId]) {
        temp_FetchCache[gameId] = {};
      }
      temp_FetchCache[gameId][modIde] = {
        response: DATA
      };
    }
    // ============================================================
    // GARANTE LAST_LOAD
    // ============================================================
    if (!mods_data[modIde]) {
      mods_data[modIde] = {
        thumbnail: "0"
      };
    }
    if (!mods_data[modIde]["LAST_LOAD_" + file_id]) {
      mods_data[modIde]["LAST_LOAD_" + file_id] = {};
    }
    // ============================================================
    // ANALISA DATA.FILES — UMA ÚNICA PASSAGEM
    // ============================================================
    let latestVersion = 0;
    let latestFile = null;
    let targetFile = null;
    const latestByName = new Map();
    const normalizedTitle = NORMALIZE_FILE_NAME(title);
    for (const file of DATA.files) {
      // --------------------------------------------------------
      // Descobre a versão mais nova do arquivo correspondente
      // ao título
      // --------------------------------------------------------
      if (
        (file.category_name === "MAIN" || file.category_name === "OPTIONAL" || file.category_name === "MISCELLANEOUS" || file.category_name === "UPDATE") && NORMALIZE_FILE_NAME(file.name) === normalizedTitle) {
        if (!latestVersion || file.version > latestVersion) {
          latestVersion = file.version;
          latestFile = file;
        }
      }
      // --------------------------------------------------------
      // Guarda o arquivo específico que estamos processando
      // --------------------------------------------------------
      if (Number(file.file_id) === Number(file_id)) {
        targetFile = file;
      }
      // --------------------------------------------------------
      // Guarda a maior versão encontrada para cada nome
      // --------------------------------------------------------
      const current = latestByName.get(file.name);
      if (!current || file.version > current.version) {
        latestByName.set(file.name, file);
      }
    }
    // ============================================================
    // PROCESSA O ARQUIVO ESPECÍFICO
    // ============================================================
    if (targetFile) {
      if (targetFile.category_name === "MAIN" || targetFile.category_name === "OPTIONAL" || targetFile.category_name === "MISCELLANEOUS" || targetFile.category_name === "UPDATE") {
        mods_data[modIde]["LAST_LOAD_" + file_id].update_state = 'updated';
      } else {
        outdated_mods++;
        if (latestVersion && targetFile.version < latestVersion) {
          console.log(targetFile.name + " desatualizado", "latestVersion " + latestVersion + " targetFile.version " + targetFile.version);
          mods_data[modIde]["LAST_LOAD_" + file_id].update_state = 'outdated';
        } else {
          const newestSameName = latestByName.get(targetFile.name);
          if (newestSameName && Number(newestSameName.file_id) !== Number(targetFile.file_id) && newestSameName.version > targetFile.version) {
            console.log("Arquivo antigo, mas existe uma versão mais nova com o mesmo nome:", targetFile.name);
            mods_data[modIde]["LAST_LOAD_" + file_id].update_state = 'outdated';
          } else {
            console.log("Arquivo antigo");
            mods_data[modIde]["LAST_LOAD_" + file_id].update_state = 'old_file';
          }
        }
      }
      // ========================================================
      // SALVA DADOS
      // ========================================================
      if (mods_data[modIde]) {
        if (mods_data[modIde]["LAST_LOAD_" + file_id]) {
          mods_data[modIde]["LAST_LOAD_" + file_id].Last_Load_Timestamp = Math.floor(Date.now() / 1000);
          let DESCRIPTION;
          let CHANGELOG;
          if (latestFile && latestFile.description) {
            DESCRIPTION = latestFile.description.replaceAll("\n", "<br>");
          } else {
            DESCRIPTION = 0;
          }
          if (latestFile && latestFile.changelog_html) {
            CHANGELOG = latestFile.changelog_html.replaceAll("\n", "<br>");
          } else {
            CHANGELOG = 0;
          }
          mods_data[modIde]["LAST_LOAD_" + file_id].lastVersion = latestVersion;
          mods_data[modIde]["LAST_LOAD_" + file_id].changelog = CHANGELOG;
          mods_data[modIde]["LAST_LOAD_" + file_id].description = DESCRIPTION;
          if (latestFile && latestFile.size_in_bytes) {
            mods_data[modIde]["LAST_LOAD_" + file_id].size = latestFile.size_in_bytes;
          } else if (latestFile && latestFile.size_kb) {
            mods_data[modIde]["LAST_LOAD_" + file_id].size = latestFile.size_kb * 1024;
          }
          mods_data[modIde]["LAST_LOAD_" + file_id].last_FileID = latestFile ? latestFile.file_id : file_id;
        }
      }
    }
  } catch (error) {
    delete activeRequests[modIde];
    console.error('Error Loading API Data:', error);
  }
}

function formatDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const formattedDate = date.toLocaleString();
  return formattedDate;
}
var GAMES = [];
var GAME_LOADING_BUSY = false;
async function LOAD_GAMES_LIST() {
  if (GAMES.length <= 0 && GAME_LOADING_BUSY == false) GAME_LOADING_BUSY = true;
  GAMES = [];
  let offset = 0;
  const count = 500; // pode aumentar pra acelerar
  let total = 5000;
  console.log("Carregando Lista de Jogos do NexusMods")
  while (GAMES.length < total) {
    const response = await fetch("https://api-router.nexusmods.com/graphql", {
      headers: {
        "accept": "*/*",
        "content-type": "application/json",
        "x-graphql-operationname": "Games"
      },
      body: JSON.stringify({
        query: `
          query Games($offset: Int, $count: Int = 25, $facets: GamesFacet, $filter: GamesSearchFilter, $sort: [GamesSearchSort!]) {
            games(offset: $offset, count: $count, facets: $facets, filter: $filter, sort: $sort) {
              totalCount
              nodes {
                artworkSchema
                collectionCount
                domainName
                downloadCount
                id
                modCount
                name
              }
            }
          }
        `,
        variables: {
          count,
          offset,
          facets: {
            genre: [],
            hasCollections: [],
            supportsVortex: []
          },
          filter: {
            filter: [],
            op: "AND"
          },
          sort: {
            downloads: {
              direction: "DESC"
            }
          }
        }
      }),
      method: "POST",
      credentials: "include"
    });
    const json = await response.json();
    const games = json.data.games.nodes;
    total = json.data.games.totalCount;
    GAMES.push(...games);
    SAVE_GAMES();
    offset += 20;
  }
  GAME_LOADING_BUSY = false;
  console.log("TOTAL FINAL:", GAMES.length);
  console.log(GAMES);
  SAVE_GAMES();
  return GAMES;
}
var NOTIFICATIONS_COUNT = 0;
async function UpdateStartUp() {
  await LOAD_GAMES();
  if (GAMES.length == 0) {
    LOAD_GAMES_LIST();
  }
  await LOAD_OPTIONS();
  await checkEndorseTimer();
  await SETUP_YOUTUBE_DEFER("block");
  await Load_NEXUSAPI();
  if (NEXUS_API == 0 || NEXUS_API == "0" || !NEXUS_API) {
    console.error("Cant check Mod Updates: NexusMods Account not connected!");
    clearInterval(UpdateLoop);
    return;
  }
  if (options.LAST_MOD_UPDATE_CHECK == undefined || options.LAST_MOD_UPDATE_CHECK == 0 || options.LAST_MOD_UPDATE_CHECK == '0') {
    options.LAST_MOD_UPDATE_CHECK = Math.floor(Date.now() / 1000);
    SAVE_OPTIONS();
  }
  const lastModUpdateCheck = options.LAST_MOD_UPDATE_CHECK;
  const currentTimeUnix = Math.floor(Date.now() / 1000);
  const twentyFourHoursInSeconds = 2 * 60 * 60;
  //const twentyFourHoursInSeconds = 20;
  const isMoreThan5Hours = (currentTimeUnix - lastModUpdateCheck) >= twentyFourHoursInSeconds;
  console.log("Checking Mod Updates, update timer: " + options.LAST_MOD_UPDATE_CHECK);
  console.log("More Than 2 hours? " + isMoreThan5Hours)
  if (options['MemoryMode'] == true) {
    console.error("Can't Update Mods: Memory Mode Option Enabled");
    options.LAST_MOD_UPDATE_CHECK = Math.floor(Date.now() / 1000);
    await SAVE_OPTIONS();
    return;
  }
  if (isMoreThan5Hours == true) {
    console.warn("Verificando atualizações de mods...");
    CheckModUpdates();
    options.LAST_MOD_UPDATE_CHECK = Math.floor(Date.now() / 1000);
    await SAVE_OPTIONS();
  }
}
chrome.webNavigation.onCommitted.addListener(function(details) {
  if (details.url) {
    SETUP_YOUTUBE_DEFER('block');
  }
}, {
  url: [{
    urlMatches: 'https://www.nexusmods.com'
  }]
});
async function BLOCK_GAME_IMAGES() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      "id": 2,
      "priority": 1,
      "action": {
        "type": "block"
      },
      "condition": {
        "urlFilter": "staticdelivery.nexusmods.com",
        "resourceTypes": ["image"]
      }
    }],
    removeRuleIds: []
  });
}
async function UNBLOCK_GAME_IMAGES() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [2]
  });
}
async function SETUP_YOUTUBE_DEFER(type) {
  await LOAD_OPTIONS();
  if (options['BlockYoutube'] == true) {
    if (type === "block") {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2]
      });
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
          "id": 1,
          "priority": 1,
          "action": {
            "type": "block"
          },
          "condition": {
            "urlFilter": "||youtube.com/",
            "resourceTypes": ["sub_frame"],
            "initiatorDomains": ["nexusmods.com"]
          }
        }, {
          "id": 2,
          "priority": 1,
          "action": {
            "type": "block"
          },
          "condition": {
            "urlFilter": "||youtube-nocookie.com/",
            "resourceTypes": ["sub_frame"],
            "initiatorDomains": ["nexusmods.com"]
          }
        }],
        removeRuleIds: []
      });
      chrome.storage.local.set({
        "YOUTUBE_STATUS": 'lock'
      });
    } else {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2]
      });
      chrome.storage.local.set({
        "YOUTUBE_STATUS": 'unlock'
      });
    }
  } else {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2]
    });
    chrome.storage.local.set({
      "YOUTUBE_STATUS": 'unlock'
    });
  }
}
var canShowEndorse = false;
async function checkEndorseTimer() {
  canShowEndorse = false;
  if (typeof options["Endorsed"] !== "number" || !Number.isFinite(options["Endorsed"])) {
    options["Endorsed"] = 0;
    await SAVE_OPTIONS();
  }
  if (options["Endorsed"] == 0) {
    // Primeiro popup: esperar 3 dias após instalação
    chrome.storage.local.get(["installTime"], (result) => {
      if (result.installTime) {
        const installTime = result.installTime;
        const threeDays = 3 * 24 * 60 * 60 * 1000;
        const currentTime = Date.now();
        if ((currentTime - installTime) >= threeDays) {
          console.log("NMA: Já se passaram 3 dias desde a instalação!");
          canShowEndorse = true;
        } else {
          const daysLeft = Math.ceil(
            (threeDays - (currentTime - installTime)) / (24 * 60 * 60 * 1000));
          canShowEndorse = false;
          console.log(`NMA: Ainda faltam ${daysLeft} dias para o primeiro Endorse Popup.`);
        }
      } else {
        console.log("NMA: Data de instalação não encontrada.");
        canShowEndorse = false;
        const installTime = Date.now();
        chrome.storage.local.set({
          installTime
        }, () => {
          console.log("NMA: Data de instalação salva:", new Date(installTime).toLocaleString());
        });
      }
    });
  } else {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    //const oneWeek = 60 * 1000;;
    const currentTime = Date.now();
    const lastEndorse = Number(options["Endorsed"]);
    if ((currentTime - lastEndorse) >= oneWeek) {
      canShowEndorse = true;
    } else {
      canShowEndorse = false;
      const daysLeft = Math.ceil(
        (oneWeek - (currentTime - lastEndorse)) / (24 * 60 * 60 * 1000));
      console.log(`NMA: Ainda faltam ${daysLeft} dias para o próximo Endorse Popup.`);
    }
  }
}


async function SETUP_UPDATE_ALARM() {

    const alarm = await chrome.alarms.get("NMA_UpdateLoop");

    if (!alarm) {

        await chrome.alarms.create("NMA_UpdateLoop", {
            periodInMinutes: 1
        });

        console.log("NMA: Update Alarm criado.");

    }

}
chrome.alarms.onAlarm.addListener(async (alarm) => {

    if (alarm.name === "NMA_UpdateLoop") {
          console.log("ALARME ALARMANTE!!!!!!!!")
        await UpdateStartUp();

    }

});


var UpdateLoop, NotificationLoop;
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const installTime = Date.now();
    chrome.storage.local.set({
      installTime
    }, () => {
      console.log('Data de instalação salva:', new Date(installTime).toLocaleString());
    });
    await LOAD_OPTIONS();
await LOAD_OPTIONS();

const userLanguage = chrome.i18n.getUILanguage();

switch (userLanguage) {

    case 'en':
    case 'en-US':
        options['language'] = 'english';
        break;

    case 'pt-BR':
        options['language'] = 'portuguese';
        break;

    case 'de':
    case 'de-DE':
        options['language'] = 'alemao';
        break;

    case 'pl':
    case 'pl-PL':
        options['language'] = 'polones';
        break;

    case 'fr':
    case 'fr-FR':
        options['language'] = 'frances';
        break;

    case 'ru':
    case 'ru-RU':
        options['language'] = 'russo';
        break;

    default:
        options['language'] = 'english';

        console.log(
            "Idioma não reconhecido ou não suportado:",
            userLanguage
        );

        break;
}

options["FIRST_RUN"] = false;

await SAVE_OPTIONS();
  }
  SETUP_UPDATE_ALARM();
  UpdateStartUp();
  chrome.action.setBadgeBackgroundColor({
    color: 'orange'
  });
});
chrome.runtime.onStartup.addListener(async () => {
  chrome.action.setBadgeBackgroundColor({
    color: 'orange'
  });
  await LOAD_MODDATA();
  await CLEAN_MODS_DATA();
  
  SETUP_UPDATE_ALARM();
  UpdateStartUp();
});
chrome.notifications.onClicked.addListener(notificationId => {
  if (notificationId === 'ModUpdateCheck') {
    chrome.windows.create({
      url: chrome.runtime.getURL('config.html?popup=true&tab=myMods'),
      type: 'popup',
      width: 810,
      height: 1000
    });
  }
});
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("config.html?tab=settings"),
    type: "popup",
    width: 1,
    height: 1
  });
});
var http_headers = {
  headers: {
    "accept": "text/html, */*; q=0.01",
    "accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  referrer: "https://www.nexusmods.com",
  referrerPolicy: "strict-origin-when-cross-origin",
  method: "GET",
  mode: "cors",
  credentials: "include"
};