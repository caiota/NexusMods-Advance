async function START() {
  try {
    SITE_URL = window.location.href;
    if (document.readyState == "complete" || document.querySelector("div#mainContent")) {
      console.log("Iniciando NexusMods Advance");

      if (document.querySelector("[data-game-id]")) {
        gameId = document.querySelector("[data-game-id]").getAttribute("data-game-id");
      }
      if (!document.querySelector("link#fontAwesome")) {
        let faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.id = 'fontAwesome'
        faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        //faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css'; < OLD VERSION

        document.head.appendChild(faLink);
      }

      requestAnimationFrame(LoadLoop);
      if (SITE_URL.indexOf("https://next.nexusmods.com/") != -1 && document.querySelector('div#mainContent main')) {
        if (document.querySelector('div#mainContent main').childElementCount == 0) {
          const targetNode = document.querySelector('div#mainContent main');
          const config = {
            childList: true,
            subtree: true,
            attributes: true
          };

          let debounceTimeout; // Armazena o temporizador de debounce
          const debounceDelay = 2000; // Tempo em milissegundos para aguardar após a última mudança

          const callback = (mutationsList, observer) => {
            let hasChanges = false; // Flag para indicar se houve mudanças

            for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                hasChanges = true;
                observer.disconnect();
              }
            }

            // Se houve mudanças, reinicia o debounce
            if (hasChanges) {
              clearTimeout(debounceTimeout); // Reseta o timer se houver novas mudanças

              debounceTimeout = setTimeout(() => {
                console.log("Aplicando tweaks após período de inatividade.");
                NEED_UPDATE = true;
                NEXUS_TWEAKS();
              }, debounceDelay);
            }
          };

          const observer = new MutationObserver(callback);
          observer.observe(targetNode, config);
        } else {
          setTimeout(() => {
            NEED_UPDATE = true;
            NEXUS_TWEAKS();
          }, 2000);
        }
      }

      await NEXUS_TWEAKS();
      setInterval(RELOAD_SETTINGS, 500);
      if (SITE_URL.indexOf("/SSOauthorised?application=nmadvance") != -1) {
        console.log("NexusMods SSO Authorized, calling NexusMods Advance!");
        chrome.runtime.sendMessage({
          action: 'PopupConfig',
          type: 'mods'
        }, function (response) {
          if (response && response.success) {
            window.close();
          }
        });
      }

    } else {
      setTimeout(START,50);
    }
  } catch (e) {
    if (e.message.includes("Extension context invalidated")) {
      location.reload();
    } else {
      console.error(e);
    }

  }
}

async function RELOAD_SETTINGS() {
  chrome.runtime.sendMessage({
    action: 'LoadBox'
  }, async function (response) {
    if (chrome.runtime.lastError) {
      if (chrome.runtime.lastError.message.includes("Extension context invalidated")) {
        console.error("Extension context invalidated detected, reloading page.");
        location.reload();
      } else {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      }
    } else {
      if (response && response.success) {
        if (!COMPARE_SETTINGS(lastOptions, response.data)) {
          SITE_URL = window.location.href;
          options = response.data;
          lastOptions = options;
          NEED_UPDATE = true;
          await NEXUS_TWEAKS();
        }
      } else {
        console.error("Error in response:", response.error);
      }
    }
  });
}
async function NEXUS_TWEAKS() {
  if (NEED_UPDATE) {

    let inicio = performance.now();
    NEED_UPDATE = false;

    console.log("NexusTweaks");
    gameId = new URL(SITE_URL);
    gameId = findIdBydomainName(gameId.pathname.split("/")[1]);
    requestAnimationFrame(WIDER_WEBSITE);
    current_page = await ON_MOD_PAGES(SITE_URL);

    clearInterval(YOUTUBE_LOOP);
    YOUTUBE_LOOP = setInterval(CHECK_YOUTUBEIFRAMES, 500);

    await SCROLL_TO_UPDATE();
    LOAD_HIDDEN_WORDS(true);
    FloatingMenu();
    HideModsByList();
    YoutubeEnlarger();
    await ImagePopupSetup();
    await VideoPopupSetup();
    await HideMyMods();
    CustomModsBlockSize();
    BetterSearch();
    await EXTERNAL_LINKS_NEWTAB();
    PROFILE_ONMOUSE();
    ARTICLES_ONMOUSE();
    if (options['AllNotifications'] == true) {
      clearInterval(NOTIFICATION_OVERALL_LOOP);
      NotificationManager();
      NOTIFICATION_OVERALL_LOOP = setInterval(NotificationManager, 4000);
    }
    if (document.querySelector("div.nav-current-game a")) {
      console.log("GAME_ID: " + gameId);
      last24Hours = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:1,sort_by:date,show_game_filter:false,page_size:15"
      last30Days = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:30,sort_by:OLD_downloads,order:DESC,show_game_filter:false,page_size:15"
      lastWeek = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:7,sort_by:date,show_game_filter:false,page_size:15"
      popularAllTime = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,sort_by:OLD_downloads,order:DESC,show_game_filter:false,page_size:15"
      moreTrending = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:7,sort_by:one_week_ratings,order:DESC,show_game_filter:false,page_size:20"
      trendingAllTime = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,trackingCategory:,trackingAction:,sort_by:OLD_endorsements,order:DESC,page_size:20,show_game_filter:false,open:false,time:0,include_adult:false"
      recentUpdated = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,only_updated:true,sort_by:lastupdate,order:DESC,show_game_filter:false,page_size:20"
      searchLink = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,show_game_filter:false,page_size:20"
    }
    console.log("Trabalhando em " + current_page);
    GET_VISIBLE_BLOCKS();
    switch (current_page) {
      case 'home_page':
        canScroll = false;
        break;
      case 'mod_pages_all':
        PAGINA_ATUAL = 0;
        max_pages = 0;
        canScroll = true;
        break;
      case 'only_mod_page':
        pageID = await extrairID(SITE_URL);
        console.log("MOD_ID: " + pageID);
        if (pageID == null) {
          current_page = 'mod_pages_all';
          PAGINA_ATUAL = 0;
          max_pages = 1;
          canScroll = true;
        } else {
          await SELECTED_TAB();
          await FAST_DOWNLOAD();
          TAB_POSTS_OBSERVER();
          DESCRIPTION_TAB();
          DESCRIPTION_ONMOUSE();
          GENERATE_TRACK_BUTTONS();
          await STICKY_POSTS();
          CREATE_POSTS_BUTTONS();
          await PAUSE_GIFS();

        }
        if (SITE_URL.indexOf("popup=true") != -1) {
          setTimeout(function () {
            document.querySelector("body").style.marginTop = '0';
            document.querySelector("div#mainContent").style.padding = 0;
            document.querySelector("div#mainContent").style.margin = 0;
            document.querySelector("div#mainContent").style.maxWidth = 'none';
            document.querySelector("footer").style.display = 'none';
            document.querySelector("header#head").style.display = 'none';
            document.querySelector("header#mobile-head").style.display = 'none';
            document.querySelector("div.info-details").style.display = 'none';
            window.addEventListener("keydown", function (k) {
              if (k.key.toLowerCase() == "escape") {
                window.close();
              }
            })
          }, 10);
        }
        break;
    }

    const path = new URL(SITE_URL).pathname;
    if ((SITE_URL.indexOf("nexusmods.com/games") != -1 || path == "/" || path == "/games") && options['GameBlock_Render'] == true) {
      if (!BUSY_LIST_REMAKE) {
        BUSY_LIST_REMAKE = true;
        FETCH_FAVORITES_GAMES();
      }
    }
    CustomGameBlockSize();
    await CreateAdvancedSearchButton();
    await REMAKE_ADDMODS_LIST();
    await STICKY_EDIT_BUTTONS();
    await FIX_ARTICLE_EDIT_LINK();
    await Fix_Youtube_Thumbnails();
    clearInterval(FLOATING_MENU_TIMER);
    FLOATING_MENU_TIMER = setInterval(FLOATING_COMMENT_OPTIONS, 1000);
    clearTimeout(NOTIFICATION_WAITER_TIMER);
    NOTIFICATION_WAITER_TIMER = setInterval(NOTIFICATION_WAITER, 100);

    let fim = performance.now();
    let tempoExecucao = fim - inicio;
    console.log(`NEXUS_TWEAKS Executado em: ${tempoExecucao} ms`);
  }
}
async function LoadLoop() {
  try {
    const preloader = document.querySelector("div.mfp-preloader");
    if ((document.querySelector("div.loading") || document.querySelector("div.nexus-ui-blocker")) || preloader && window.getComputedStyle(preloader).display !== 'none') {

      NEED_OVERALLRELOAD = true;
      console.log("Loading...");
      if (YOUTUBE_STATUS == 'unlock') {
        chrome.runtime.sendMessage({
          action: 'lockYoutube'
        }, function (response) {
          if (response && response.success) {
            console.log(response.message);
            YOUTUBE_STATUS = response.YOUTUBE_STATUS;
          }
        });
      }
      if (modPreview_element) {
        modPreview_element.style.display = "none";
      }
      if (modPopup_element) {
        modPopup_element.style.display = "none";
      }
      if (modFiles_element) {
        modFiles_element.style.display = "none";
      }

      last_modTab = "";

    } else {
      if (NEED_OVERALLRELOAD == true) {
        NEED_OVERALLRELOAD = false

        SITE_URL = window.location.href;
        console.log("Re Loading...");
        NEED_UPDATE = true;
        max_pages = 0;
        hideStatus = false;
        PAGINA_ATUAL = 0;
        lastDescriptionID = 0;

        zoomLevel = 1.0
        if (imgPopup) {

          imgPopup.classList.add('popup-hidden');
          imgPopup.style.transform = "scale(" + zoomLevel + ")";
        }
        if (modPreview_element) {
          modPreview_element.style.transform = `scale(${zoomLevel})`;
        }
        if (modPopup_element) {
          modPopup_element.style.transform = `scale(${zoomLevel})`;
        }
        canScroll = true;
        NEXUS_TWEAKS();
      }
    }
    setTimeout(LoadLoop, 10);
  } catch (e) {
    console.error("NexusMods Advance Error:" + e);
  }
}

async function GET_GAMES() {
  chrome.runtime.sendMessage({
    action: 'SyncGameList',
  }, async function (response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
    } else {
      if (response.success == false) {
        console.error("No Loaded Games!");
        return;
      }
      if (response && response.success) {
        GAMES = response.message;
        GAMES.sort((a, b) => b.downloads - a.downloads);
        gameMap = new Map(GAMES.map(game => [game.id, game]));
        console.log(GAMES.length + " Games");
        if (SITE_URL.indexOf("next.nexusmods.com/") != -1) {
          setTimeout(START, 2500);
        } else {
          START();
        }
      } else {
        console.error("Error in response:", response.error);
      }
    }
  });
}

async function loadMessages(locale) {

  if (locale == 'portuguese') {
    locale = 'pt_BR';
  }
  if (locale == 'english') {
    locale = 'en';
  }
  if (locale == 'alemao') {
    locale = 'de';
  }
  if (locale == 'polones') {
    locale = 'pl';
  }

  chrome.runtime.sendMessage({
    action: 'Load_Messages',
    lang: locale
  }, async function (response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
    } else {
      if (response && response.success) {
        translate_strings = response.message;

        await GET_GAMES();

      } else {
        console.error("Error in response:", response.error);
      }
    }
  });
}
async function INIT() {
  if (STARTED == true) {
    return;
  }

  STARTED = true;
  console.log("Iniciando...");
  SITE_URL = window.location.href;
  chrome.runtime.sendMessage({
    action: 'LoadBox'
  }, async function (response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
      window.location.reload();
    } else {
      if (response && response.success) {
        options = response.data;
        lastOptions = options;
        YOUTUBE_STATUS = 'lock';
        loadMessages(options['language']);
      } else {
        console.error("Error in response:", response.error);
        window.location.reload();
      }
    }
  });
}
INIT();
setTimeout(INIT, 2000);
document.addEventListener("DOMContentLoaded", async () => {

  const mainContent = document.querySelector("div#mainContent");
  if (mainContent) {
    mainContent.classList.add("noPadding");
  }
  WIDER_WEBSITE();
});
window.addEventListener("load", async () => {
  if (GAMES.length > 0) {
    NEED_UPDATE = true;
    NEXUS_TWEAKS();
  }
  document.addEventListener("wheel", async function (ev) {

    if (ev.ctrlKey) {
      if (document.elementFromPoint(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y).id == "ImageView" || document.elementFromPoint(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y).closest("div#modPopup")) {
        ev.preventDefault();
        var delta = Math.max(-1, Math.min(1, (ev.deltaY || -ev.detail)));
        var zoomAmount = 0.1;
        delta = -delta;

        zoomLevel += delta * zoomAmount;

        zoomLevel = Math.max(0.1, Math.min(2.0, zoomLevel));
        if (modPreview_element) {
          modPreview_element.style.transform = `scale(${zoomLevel})`;
        }
        if (modPopup_element) {
          modPopup_element.style.transform = `scale(${zoomLevel})`;
        }
      }
    }
    if (ev.ctrlKey == true && imgPopup && !imgPopup.classList.contains("popup-hidden")) {
      ev.preventDefault();
      var delta = Math.max(-1, Math.min(1, (ev.deltaY || -ev.detail)));
      // Definir a quantidade de zoom
      var zoomAmount = 0.1; // Valor arbitrário de zoom
      // Inverter a direção do scroll
      delta = -delta;
      // Atualizar o nível de zoom
      zoomLevel += delta * zoomAmount;
      // Limitar o nível de zoom mínimo e máximo
      zoomLevel = Math.max(0.1, Math.min(2.0, zoomLevel)); // Zoom mínimo de 10% e máximo de 300%
      // Aplicar o zoom na imagem
      imgPopup.style.transform = "scale(" + zoomLevel + ")";

      mouseX = ev.clientX;
      mouseY = ev.clientY + window.scrollY;

      if (imgPopup && !imgPopup.classList.contains("popup-hidden")) {
        const mouseX = ev.clientX;
        const mouseY = ev.clientY;

        // Dimensões da janela e da imagem
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const imgWidth = imgPopup.width;
        const imgHeight = imgPopup.height;

        // Ajustar a posição da imagem horizontalmente (eixo X)
        let imgLeft = mouseX + 20;
        if (imgLeft + imgWidth > windowWidth) {
          imgLeft = windowWidth - imgWidth - 240; // Mantém a imagem dentro da tela à direita
        }
        if (imgLeft < 0) {
          imgLeft = 10; // Mantém a imagem dentro da tela à esquerda
        }

        // Ajustar a posição da imagem verticalmente (eixo Y)
        let imgTop = mouseY + 20;
        if (imgTop + imgHeight > windowHeight) {
          imgTop = windowHeight - imgHeight - 140; // Mantém a imagem dentro da tela na parte inferior
        }
        if (imgTop < 0) {
          imgTop = 10; // Mantém a imagem dentro da tela na parte superior
        }

        // Atualiza a posição da imagem
        imgPopup.style.left = imgLeft + "px";
        imgPopup.style.top = imgTop + "px";
      }

    }

  }, {
    passive: false
  });
});

async function MoveLoop(x, y, moveElement) {
  let popupX = x;
  let popupY = y + window.scrollY;

  // Obter as dimensões da viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (needMove) {
    if (moveElement) {
      moveElement.style.display = "flex";
      requestAnimationFrame(() => {
        const rect = moveElement.getBoundingClientRect();
        const popupWidth = rect.width;
        const popupHeight = rect.height;

        // Limitar o popup à viewport horizontalmente
        if (popupX + popupWidth > viewportWidth) {
          popupX = viewportWidth - popupWidth - 20;
        }
        if (popupX < 0) {
          popupX = 0;
        }

        // Limitar o popup à viewport verticalmente
        if (popupY + popupHeight > window.scrollY + viewportHeight) {
          popupY = window.scrollY + viewportHeight - popupHeight - 20;
        }
        if (popupY < window.scrollY) {
          popupY = window.scrollY;
        }

        // Aplicar a posição calculada ao popup
        moveElement.style.left = popupX + "px";
        moveElement.style.top = popupY + "px";
      });
    }
    needMove = false;
  }
}
document.addEventListener("mousemove", function (mouse) {
  try {
    GLOBAL_MOUSE_X = mouse.clientX;
    GLOBAL_MOUSE_Y = mouse.clientY;
    if (lastImg && document.elementFromPoint(mouse.clientX, mouse.clientY)) {
      currentImg = document.elementFromPoint(mouse.clientX, mouse.clientY).nodeName;
    }

    if (imgPopup && !imgPopup.classList.contains("popup-hidden")) {
      const mouseX = mouse.clientX;
      const mouseY = mouse.clientY;

      // Dimensões da janela e da imagem
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const imgWidth = imgPopup.width;
      const imgHeight = imgPopup.height;

      // Ajustar a posição da imagem horizontalmente (eixo X)
      let imgLeft = mouseX + 20;
      if (imgLeft + imgWidth > windowWidth) {
        imgLeft = windowWidth - imgWidth - 240; // Mantém a imagem dentro da tela à direita
      }
      if (imgLeft < 0) {
        imgLeft = 10; // Mantém a imagem dentro da tela à esquerda
      }

      // Ajustar a posição da imagem verticalmente (eixo Y)
      let imgTop = mouseY + 20;
      if (imgTop + imgHeight > windowHeight) {
        imgTop = windowHeight - imgHeight - 140; // Mantém a imagem dentro da tela na parte inferior
      }
      if (imgTop < 0) {
        imgTop = 10; // Mantém a imagem dentro da tela na parte superior
      }

      // Atualiza a posição da imagem
      imgPopup.style.left = imgLeft + "px";
      imgPopup.style.top = imgTop + "px";
    }
  } catch (e) {
    console.error("NexusMods Advance Error:" + E);
  }
});

document.addEventListener("keydown", async function (key) {
  if (key.ctrlKey == true && key.key == "f" && current_modTab == "posts" && current_page == "only_mod_page") {
    key.preventDefault();
    FocusSearchElement();
  }
  if (key.ctrlKey == true && key.key == "c" && hiddenInput) {
    setTimeout(function () {
      hiddenInput.style.display = 'none';

    }, 1000)
  }
  if (key.key == "Escape") {
    key.preventDefault();
    lastDescriptionID = 0;
    zoomLevel = 1.0;
    if (modPreview_element) {
      modPreview_element.style.display = "none";
    }
    if (modPopup_element) {
      modPopup_element.style.display = "none";
      modPopup_element.querySelector("div#descriptionContent").innerHTML = ""
    }
    if (modFiles_element) {
      modFiles_element.style.display = "none";
    }
    if (modPreview_element) {
      modPreview_element.style.transform = `scale(${zoomLevel})`;
    }
    if (modPopup_element) {
      modPopup_element.style.transform = `scale(${zoomLevel})`;
    }
    STILL_LOADING = false;
  }
  if (modPreview_element) {
    if ((key.key == "ArrowUp" || key.key == "ArrowLeft" || key.key == "a" && key.ctrlKey == false) && !isTextField(key.target) && modPreview_element.style.display == 'flex') {
      key.preventDefault();
      POPUP_IMAGES(GALLERY, 0);
    }
    if ((key.key == "ArrowDown" || key.key == "ArrowRight" || key.key == "d" && key.ctrlKey == false) && !isTextField(key.target) && modPreview_element.style.display == 'flex') {
      key.preventDefault();
      POPUP_IMAGES(GALLERY, 1);
    }
    if (modPreview_element && key.key == 's' && key.ctrlKey == true && modPreview_element.style.display != 'none' && GALLERY && GALLERY.length > 0) {
      key.preventDefault();
      window.open(GALLERY[currentImageIndex].imageUrl);

    }
  }
  if (imgPopup && key.key == 's' && key.ctrlKey == true && !imgPopup.classList.contains("popup-hidden")) {
    key.preventDefault();
    window.open(imgPopup.src);
  }

  if (imgPopup && key.key == '1' && !imgPopup.classList.contains("popup-hidden")) {
    await EndorseImageByPopup(imgPopup.getAttribute("image_id"));
  }
  else if (modPopup_element && key.key == '1' && modPopup_element.style.display != 'none') {

    await EndorseVideoByPopup(VIDEO_ID, elementView);
  }
});

document.addEventListener("scroll", async function (ev) {

  if (canScroll == true && current_page == "mod_pages_all" && options['InfiniteScroll'] == true) {
    // Altura da janela de visualização
    var windowHeight = window.innerHeight;

    // Distância do topo do documento até a parte superior da janela de visualização
    var scrollY = window.scrollY || window.pageYOffset;

    // Altura total do documento
    var documentHeight = document.documentElement.scrollHeight;

    // Distância até o final do documento
    var distanceToBottom = documentHeight - (scrollY + windowHeight);

    // Defina a distância em pixels a partir da qual deseja acionar a função
    var threshold = 1400;

    if (distanceToBottom < threshold && scrollPage >= 0 && options['InfiniteScroll'] == true) {
      canScroll = false;
      if (SITE_URL.indexOf("mods/trackingcentre") != -1) {
        setTimeout(GENERATE_INFINITE_SCROLL_TRACKCENTRE, 100);
      } else if (SITE_URL.indexOf("media/") != -1 || SITE_URL.indexOf("images/") != -1) {
        GENERATE_INFINITE_SCROLL_MEDIA();
      } else if (SITE_URL.indexOf("videos/") != -1) {
        GENERATE_INFINITE_SCROLL_VIDEOS();
      } else {
        await GENERATE_INFINITE_SCROLL();
      }
    }
  }

  clearTimeout(modBlocksTimeout);
  modBlocksTimeout = setTimeout(GET_VISIBLE_BLOCKS, 750);
});

function GET_VISIBLE_BLOCKS() {
  const mods_list = Array.from(document.querySelectorAll("li:not([id])[class~='mod-tile']:not([VISIBLE]), li:not([id])[class~='image-tile'] > div[data-mod-id]:not([VISIBLE]):not(.qs_result),dl.accordion dt div.stat a:not([VISIBLE])"));
  const images_list = Array.from(document.querySelectorAll("li.image-tile"));
  mods_list_general = mods_list.concat(images_list);

  if (mods_list_general.length === 0) return
  elementsToObserve += mods_list_general.length

  if (!observer) {
    const observerOptions = {
      root: null, // Usa a viewport como root
      rootMargin: '500px 0px', // Margem de proximidade para disparar o evento
      threshold: 0 // O evento será disparado assim que qualquer parte do elemento estiver visível
    };

    observer = new IntersectionObserver(async (entries, observer) => {
      let needUpdate = false;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const mod = entry.target;
          mod.setAttribute('VISIBLE', 'true');
          observer.unobserve(mod); // Para de observar o elemento
          elementsToObserve--; // Decrementa o contador de elementos sendo observados
          needUpdate = true;
        }
      });

      // Se algum elemento ficou visível, atualiza a página
      if (needUpdate) {
        await LOAD_HIDDEN_WORDS();
        await REMOVE_MOD_STATUSVIEW();
        await FAST_CHANGELOGS();
        await CREATE_MODS_BUTTONS();
        await LOAD_MOD_DETAILS();
        Fix_Youtube_Thumbnails();
        OriginalImageSetup();
        needUpdate = false;

      }

      // Encerra o observer se não houver mais elementos para observar
      if (elementsToObserve === 0) {
        observer.disconnect();
        observer = null; // Libera o observer para ser recriado no futuro se necessário
      }
    }, observerOptions);
  }

  // Adiciona os novos elementos para serem observados
  mods_list_general.forEach(mod => observer.observe(mod));
}