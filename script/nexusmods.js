var isItDone = false;
var constInterval = null;

function START() {
  try {
    SITE_URL = window.location.href
    LAST_URL = SITE_URL
    if (document.readyState == 'complete' || document.querySelector('div#mainContent')) {
      console.log('Iniciando NexusMods Advance')
      GET_GAME_ID()
      if (!document.querySelector('link#fontAwesome')) {
        let faLink = document.createElement('link')
        faLink.rel = 'stylesheet'
        faLink.id = 'fontAwesome'
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
        //faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css'; < OLD VERSION
        document.head.appendChild(faLink);
        LOAD_GAMES_LIST();
        LoadLoop();
        //await NEXUS_TWEAKS()
        setInterval(RELOAD_SETTINGS, 500)
      }
      if (SITE_URL.indexOf('/SSOauthorised?application=nmadvance') != -1) {
        console.log('NexusMods SSO Authorized, calling NexusMods Advance!')
        chrome.runtime.sendMessage({
          action: 'PopupConfig',
          type: 'mods'
        }, function(response) {
          if (response && response.success) {
            window.close()
          }
        })
      }
    } else {
      setTimeout(START, 50)
    }
  } catch (e) {
    if (e.message.includes('Extension context invalidated')) {
      location.reload()
    } else {
      console.error(e)
    }
  }
}

function GET_GAME_ID() {
  gameID_Number = document.querySelector('div[data-e2eid="desktop-header"] img,div.nav-current-game img')?.src
  if (gameID_Number && gameID_Number.indexOf('/images/games/') != -1) {
    gameID_Number = gameID_Number.split('/v2/')[1].split('/')[0]
  } else {
    gameID_Number = document.querySelector("section[aria-labelledby='game-header'] img[src]")?.src.split('/v2/')[1].split('/')[0] || 1704
  }
}

function RELOAD_SETTINGS() {
  chrome.runtime.sendMessage({
    action: 'LoadBox'
  }, async function(response) {
    if (chrome.runtime.lastError) {
      if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
        console.error('Extension context invalidated detected, reloading page.')
        location.reload()
      } else {
        console.error('Error sending message:', chrome.runtime.lastError.message)
      }
    } else {
      if (response && response.success) {
        if (!COMPARE_SETTINGS(lastOptions, response.data)) {
          SITE_URL = window.location.href
          options = response.data
          lastOptions = options
          console.log(options)
          NEED_UPDATE = true
          NEXUS_TWEAKS()
        }
        LOAD_HIDDEN_WORDS()
      } else {
        console.error('Error in response:', response.error)
      }
    }
  })
}

function encontrarContainer() {
  // Primeiro tenta achar o .media-grid
  let container = document.querySelector('div.media-grid')
  if (container) return container
  // Se não achar, procura qualquer div que tenha filhos com o atributo desejado
  const candidatos = document.querySelectorAll('section div.grid')
  for (const div of candidatos) {
    if (div.querySelector('div[data-e2eid="media-tile"]')) {
      return div
    }
  }
  return null
}
var WATCHER_BUSY = false

function MEDIA_WATCHER() {
  const target = encontrarContainer()
  if (target && current_page == 'mod_pages_all' && !target.getAttribute('WATCHING')) {
    // Cria o observer
    const observerContainer = new MutationObserver(mutationsList => {
      //for (const mutation of mutationsList) {}
      if (WATCHER_BUSY == false) {
        WATCHER_BUSY = true
        maxPage = getMaxPages()
        GET_VISIBLE_BLOCKS()
      }
      WATCHER_BUSY = false
    })
    // Configura o que observar
    observerContainer.observe(target, {
      childList: true, // Mudanças na lista de filhos
      subtree: false, // Inclui elementos dentro do target
      attributes: false, // Mudanças nos atributos
      characterData: false // Mudanças no texto
    })
    target.setAttribute('WATCHING', true)
  }
}

function CONTAINER_OBSERVER() {
  if (current_page !== 'mod_pages_all' || !window.location.href.includes('/collections/')) {
    return;
  }
  const target = document.querySelector("div#mainContent");
  if (target && current_page == 'mod_pages_all' && !target.getAttribute('WATCHING')) {
    // Cria o observer
    const observerContainer = new MutationObserver(mutationsList => {
      clearTimeout(debouncerChance);
      debouncerChance = setTimeout(() => {
        handleLoadingStart(true);
      }, 600);
    })
    // Configura o que observar
    observerContainer.observe(target, {
      childList: true, // Mudanças na lista de filhos
      subtree: true, // Inclui elementos dentro do target
      attributes: false, // Mudanças nos atributos
      characterData: false // Mudanças no texto
    })
    target.setAttribute('WATCHING', true)
  }
}
var MOD_HIDER_LOOP = null
async function NEXUS_TWEAKS() {
  if (NEED_UPDATE == true) {
    let inicio = performance.now()
    NEED_UPDATE = false
    console.log('NexusTweaks')
    SITE_URL = window.location.href;
    const gameIdFromUrl = getGameId(SITE_URL);
    const gameIdFromDom = findIdBydomainName();
    GET_VISIBLE_BLOCKS();
    // Usa a URL como principal
    gameId = gameIdFromUrl;
    if (gameId == "Home") {
      // fallback caso o usuario esteja numa página que nao tenha um jogo específico
      gameId = "";
    }
    // Se por algum motivo a URL falhar, usa o DOM
    if (!gameId && gameId != "") {
      gameId = gameIdFromDom;
    }
    // Tratamento especial
    if (gameId === "Mods" || gameId === "mods") {
      gameId = "site";
    }
    WIDER_WEBSITE();
    console.warn('Game Name ' + gameId);
    console.warn("gameIdFromUrl " + gameIdFromUrl);
    console.warn("gameIdFromDom " + gameIdFromDom);
    GET_GAME_ID()
    current_page = ON_MOD_PAGES(SITE_URL)
    clearInterval(YOUTUBE_LOOP)
    YOUTUBE_LOOP = setInterval(CHECK_YOUTUBEIFRAMES, 500)
    SET_PROFILE_OPTIONS_MOUSEHOVER();
    ShortCut_Availability()
    SCROLL_TO_UPDATE()
    setTimeout(GET_VISIBLE_BLOCKS, 150)
    LOAD_HIDDEN_WORDS(true)
    FloatingMenu()
    YoutubeEnlarger()
    HideModsByList()
    OriginalImageSetup()
    ImagePopupSetup()
    VideoPopupSetup()
    HideMyMods()
    CustomModsBlockSize()
    EXTERNAL_LINKS_NEWTAB()
    PROFILE_ONMOUSE()
    ARTICLES_ONMOUSE()
    COLLECTIONS_ONMOUSE();
    NEW_TAB_MESSENGER_HANDLER();
    //CARREGAR QUANTIDADE DE MODS DESATUALIZADOS DIRETO NO SITE VIA NOTIFICACAO
    setTimeout(LOAD_OUTDATED_MODLIST, 2000);
    //CRIAR BOTAO DA EXTENSAO NO SITE NEXUSMODS
    var MAIN_DIV1 = document.querySelector("button#profile-menu")?.parentElement;
    var MAIN_DIV2 = document.querySelector("div[class='nav-interact rj-profile']")?.parentElement;
    if ((MAIN_DIV1 || MAIN_DIV2) && !document.querySelector("button#NexusModsAdvance_Menu")) {
      var bt = document.createElement("button");
      bt.id = "NexusModsAdvance_Menu"
      bt.classList = "NexusMods_Advance_B64LOGO";
      bt.addEventListener("click", () => {
        openExtensionUI();
      })
      if (MAIN_DIV1) {
        MAIN_DIV1.insertBefore(bt, MAIN_DIV1.children[1]);
      } else if (MAIN_DIV2) {
        MAIN_DIV2.prepend(bt);
      }
    }
    console.log('Trabalhando em ' + current_page)
    switch (current_page) {
      case 'home_page':
        canScroll = false
        break
      case 'mod_pages_all':
        canScroll = true
        break
      case 'only_mod_page':
        pageID = extrairID(SITE_URL)
        console.log('MOD_ID: ' + pageID)
        // DESCRIPTION_ONMOUSE();
        if (pageID == null) {
          current_page = 'mod_pages_all'
          canScroll = true
          console.log('Correção de area de atuação para ' + current_page)
          if (SITE_URL.indexOf('trackingcentre') != -1) {
            console.warn("trackingCentre")
            DESCRIPTION_ONMOUSE(true)
          }
        } else {
          ITEM_LOAD_EXECUTED = false;
          SELECTED_TAB()
          TAB_POSTS_OBSERVER();
          FAST_CHANGELOGS()
          DESCRIPTION_TAB();
          highlightOutdatedMods();
          HIDE_IMAGES();
          Search_RequiringFileTab()
          DESCRIPTION_ONMOUSE()
          GENERATE_TRACK_BUTTONS()
          STICKY_POSTS()
          CREATE_POSTS_BUTTONS()
          PAUSE_GIFS()
          LOGS_PAGE_PRELOADDATA();
          if (FORCE_LOAD_PAGE == 0) {
            FORCE_LOAD_PAGE = 1;
          }
          AutoRotate_ModsPortifolio();
          PAGINATION_FIX();
        }
        break
    }
    if (window.location.href.indexOf("NMA_Endorse=true") != -1 && isItDone == false) {
      clearInterval(constInterval);
      constInterval = setInterval(() => {
        if (document.querySelector("li#action-endorse-2295-1018 a") && document.querySelector("li[id*='action-endorse']").style.display != 'none') {
          isItDone = true
          document.querySelector("li#action-endorse-2295-1018 a").click();
          clearInterval(constInterval);
        }
      }, 1000);
    }
    if (window.location.href.indexOf('popup=true') != -1 || window.innerWidth == 600) {
      if (!window.location.search.includes('popup=true')) {
        const url = new URL(window.location.href)
        url.searchParams.set('popup', 'true')
        window.history.replaceState({}, '', url)
      }
      css('body', {
        marginTop: '0'
      })
      css('#mainContent', {
        padding: 0,
        margin: 0,
        maxWidth: 'none'
      })
      css('footer', {
        display: 'none'
      })
      css('header#head', {
        display: 'none'
      })
      css('header', {
        display: 'none'
      })
      css('#mobile-head', {
        display: 'none'
      })
      css('.info-details', {
        display: 'none'
      })
      window.addEventListener('keydown', function(k) {
        if (k.key.toLowerCase() == 'escape') {
          popup?.close();
          window.close()
        }
      });
      if (!window.CanCloseNotification) {
        window.CanCloseNotification = true;
        CreateNotificationContainer(translate_strings.popUpClose_Notification.message, 'success', 'fa-solid fa-window-restore', 6000)
      }
    }
    FAVORITE_MOD();
    REMAKE_ADDMODS_LIST()
    setTimeout(TRANSFORM_TEXT_LINKS, 3000);
    Fix_Youtube_Thumbnails()
    REMOVE_NEXUSMODS_ImageBackground();
    MEDIA_WATCHER()
    CONTAINER_OBSERVER();
    MEDIA_TILE_DATE();
    BetterSearch();
    clearInterval(uiFunctionLoop)
    uiFunctionLoop = setInterval(SearchUi_Camper, 1000);
    clearInterval(FLOATING_MENU_TIMER)
    FLOATING_MENU_TIMER = setInterval(FLOATING_COMMENT_OPTIONS, 1000)
    let fim = performance.now()
    let tempoExecucao = parseInt(fim - inicio)
    console.log(`NEXUS_TWEAKS Executado em: ${tempoExecucao} ms`);
    CreateNotificationContainer(`NEXUS_TWEAKS Executado em: ${tempoExecucao} ms`, 'success', 'fa-solid fa-circle-down', 1200)
  }
}
var debouncerChance;
var uiFunctionLoop;

function SearchUi_Camper() {
  const searchSettings = QUERY_ALL_WITH_SHADOW_ROOTS('div[aria-label="Search Nexus mods"]')[0];
  if (!searchSettings) {
    return;
  }
  if (searchSettings.hasAttribute("OBSERVER_HANDLER")) {
    return;
  }
  const observer = new MutationObserver((mutations) => {
    clearTimeout(debouncerChance);
    debouncerChance = setTimeout(() => {
      handleLoadingStart(true);
    }, 700);
  });
  observer.observe(searchSettings, {
    childList: true,
    subtree: true
  });
  searchSettings.setAttribute("OBSERVER_HANDLER", "true");
}

function HAS_VISIBLE_ANIMATE_PULSE() {
  const elements = QUERY_ALL_WITH_SHADOW_ROOTS('.animate-pulse');
  for (const el of elements) {
    // ========================================================
    // VERIFICA SE O ELEMENTO ESTÁ OCULTO
    // ========================================================
    let current = el;
    let hidden = false;
    while (current && current !== document.body) {
      if (current.nodeType !== 1) {
        current = current.parentElement;
        continue;
      }
      const style = getComputedStyle(current);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        hidden = true;
        break;
      }
      current = current.parentElement;
    }
    if (hidden) {
      continue;
    }
    // ========================================================
    // VERIFICA SE TEM ÁREA RENDERIZADA
    // ========================================================
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      continue;
    }
    // ========================================================
    // VERIFICA SE ESTÁ DENTRO DA VIEWPORT
    // ========================================================
    const isInViewport = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
    if (isInViewport) {
      return true;
    }
  }
  return false;
}
var LAST_URL = ''
let loadingDetected = false;

function LoadLoop() {
  setInterval(() => {
    const url = location.href;
    if (url !== LAST_URL) {
      LAST_URL = url;
      handleLoadingStart();
    }
  }, 100);
  // ============================================================
  // FUNÇÃO: VERIFICA SE EXISTE LOADING VISÍVEL
  // ============================================================
  let animatePulseScrollCheck = false;
  window.addEventListener('scroll', () => {
    if (animatePulseScrollCheck) return;
    animatePulseScrollCheck = true;
    requestAnimationFrame(() => {
      animatePulseScrollCheck = false;
      const hasAnimatePulse = HAS_VISIBLE_ANIMATE_PULSE();
      if (hasAnimatePulse) {
        if (!animatePulseLoading) {
          animatePulseLoading = true;
        }
      } else if (animatePulseLoading) {
        animatePulseLoading = false;
        handleLoadingStart(true);
      }
    });
  }, {
    passive: true
  });

  function HAS_VISIBLE_LOADING() {
    const elements = document.querySelectorAll('.loading, .nexus-ui-blocker, .mfp-preloader, .loading-text');
    for (const el of elements) {
      const style = getComputedStyle(el);
      if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.getClientRects().length > 0) {
        return true;
      }
    }
    return false;
  }
  // ============================================================
  // AGUARDA O LOADING TERMINAR
  // ============================================================
  let loadingWaitTimer = null;

  function WAIT_LOADING_FINISH() {
    if (loadingWaitTimer) {
      clearTimeout(loadingWaitTimer);
    }
    const checkLoading = () => {
      // Ainda existe loading visível
      if (HAS_VISIBLE_LOADING()) {
        loadingWaitTimer = setTimeout(checkLoading, 100);
        return;
      }
      // Loading terminou
      loadingDetected = false;
      revealSite();
      handleLoadingStart();
      if (PAGINATION_UPDATE_PENDING == true) {
        PAGINATION_UPDATE_PENDING = false;
        PAGINATION_WATCHER();
      }
    };
    checkLoading();
  }
  // ============================================================
  // OBSERVER PARA ELEMENTOS DE LOADING
  // ============================================================
  let animatePulseLoading = false;
  const domObserver = new MutationObserver((mutations) => {
    let animatePulseAdded = false;
    let normalLoadingDetected = false;
    // ========================================================
    // PROCESSA MUTAÇÕES
    // ========================================================
    for (const mutation of mutations) {
      // ====================================================
      // NÓS ADICIONADOS
      // ====================================================
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          // ====================================================
          // SHADOW ROOT
          // ====================================================
          if (node.shadowRoot) {
            domObserver.observe(node.shadowRoot, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeOldValue: true,
              attributeFilter: ['class', 'style']
            });
          }
          // ====================================================
          // ANIMATE-PULSE
          // ====================================================
          if (node.matches?.('.animate-pulse') || node.querySelector?.('.animate-pulse')) {
            animatePulseAdded = true;
          }
          // ====================================================
          // LOADINGS NORMAIS
          // ====================================================
          if (node.matches?.('.loading, .nexus-ui-blocker, .mfp-preloader, .loading-text') || node.querySelector?.('.loading, .nexus-ui-blocker, .mfp-preloader, .loading-text')) {
            normalLoadingDetected = true;
          }
        }
      }
      // ====================================================
      // ATRIBUTOS ALTERADOS
      // ====================================================
      if (mutation.type === 'attributes') {
        const target = mutation.target;
        if (target.nodeType !== 1) continue;
        // ====================================================
        // ANIMATE-PULSE
        //
        // Detecta:
        // 1. elemento que possui animate-pulse agora
        // 2. elemento que possuía animate-pulse antes
        //    e perdeu a classe
        // ====================================================
        if (target.matches?.('.animate-pulse') || (mutation.attributeName === 'class' && mutation.oldValue?.split(/\s+/).includes('animate-pulse'))) {
          animatePulseAdded = true;
        }
        // ====================================================
        // LOADING NORMAL
        // ====================================================
        if (target.matches?.('.loading, .nexus-ui-blocker, .mfp-preloader, .loading-text')) {
          normalLoadingDetected = true;
        }
      }
    }
    // ============================================================
    // ANIMATE-PULSE DETECTADO
    // ============================================================
    if (animatePulseAdded) {
      if (!animatePulseLoading) {
        animatePulseLoading = true;
      }
    }
    // ============================================================
    // VERIFICA SE O ANIMATE-PULSE TERMINOU
    // ============================================================
    if (animatePulseLoading === true) {
      const hasAnimatePulse = HAS_VISIBLE_ANIMATE_PULSE('.animate-pulse')
      if (!hasAnimatePulse) {
        animatePulseLoading = false;
        handleLoadingStart(true);
      }
    }
    // ============================================================
    // LOADINGS NORMAIS
    // ============================================================
    if (normalLoadingDetected && !animatePulseLoading && !loadingDetected) {
      loadingDetected = true;
      WAIT_LOADING_FINISH();
    }
  });
  // ============================================================
  // CONFIGURAÇÃO DO OBSERVER
  // ============================================================
  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class', 'style']
  });
  // ============================================================
  // FALLBACK
  //
  // Verificação periódica para capturar loadings rápidos.
  // NÃO executa handleLoadingStart imediatamente.
  // Apenas inicia a espera pelo fim do loading.
  // ============================================================
  setInterval(() => {
    const hasLoading = HAS_VISIBLE_LOADING();
    if (hasLoading && !loadingDetected && !animatePulseLoading) {
      loadingDetected = true;
      WAIT_LOADING_FINISH();
    }
  }, 500);
  // ============================================================
  // EXECUTA UMA VEZ AO INICIAR
  // ============================================================
  handleLoadingStart(true);
}

function handlePageChange(ignoreStableContent = false) {
  NEED_OVERALLRELOAD = true;
  resetStates();
  APPLY_FUNCTIONS();
}
async function APPLY_FUNCTIONS() {
  console.log("REAPLICANDO FUNÇÕES");
  BackTopButton = document.querySelector("div#rj-back-to-top");
  if (options['WideWebsite'] == true && BackTopButton) {
    BackTopButton.style.left = "10px";
  }
  WIDER_WEBSITE();
  GET_VISIBLE_BLOCKS();
  DESCRIPTION_TAB();
  ImagePopupSetup();
  STICKY_POSTS();
  PAUSE_GIFS();
  DESCRIPTION_ONMOUSE();
  PROFILE_ONMOUSE();
  CREATE_POSTS_BUTTONS();
  EXTERNAL_LINKS_NEWTAB();
  await CHECK_YOUTUBEIFRAMES();
  YoutubeEnlarger();
  ARTICLES_ONMOUSE();
  COLLECTIONS_ONMOUSE();
  TRANSFORM_TEXT_LINKS();
  MEDIA_TILE_DATE();
  LOGS_PAGE_PRELOADDATA();
  runUpdates();
  BetterSearch();
  await NEXUS_TWEAKS();
}

function handleLoadingStart(ignoreStableContent = false) {
  console.log('Loading detected...');
  chrome.runtime.sendMessage({
    action: 'lockYoutube'
  }, (response) => {
    if (response?.success) {
      console.log(response.message);
      YOUTUBE_STATUS = response.YOUTUBE_STATUS;
    }
  });
  // Esconde elementos
  [modPreview_element, modPopup_element, modFiles_element].forEach(el => {
    if (el) el.style.display = 'none';
  });
  last_modTab = '';
  handlePageChange(ignoreStableContent);
}

function resetStates() {
  canScroll = true;
  NEED_UPDATE = true;
  hideStatus = false;
  lastDescriptionID = 0;
  requerimentsCache = null;
  zoomLevel = 1.0;
  if (imgPopup) {
    imgPopup.classList.add('popup-hidden');
    imgPopup.style.transform = 'scale(' + zoomLevel + ')';
  }
  if (modPreview_element) {
    modPreview_element.style.transform = `scale(${zoomLevel})`;
  }
  if (modPopup_element) {
    modPopup_element.style.transform = `scale(${zoomLevel})`;
    modPopup_element.style.display = 'none';
    const descContent = modPopup_element.querySelector('div#descriptionContent');
    if (descContent) descContent.innerHTML = '';
  }
}

function REMOVE_NEXUSMODS_ImageBackground() {
  if (
    (current_page == "mod_pages_all" || current_page == "home_page") && !SITE_URL.includes("/images/") && !SITE_URL.includes("nexusmods.com/sso?id=")) {
    const imgHeader = Array.from(document.querySelectorAll("div#mainContent img")).find(img => {
      const src = img.src || "";
      return (/^https:\/\/next\.nexusmods\.com\/assets\/images\/home\/.+-hero-bg\.webp$/i.test(src) || /^https:\/\/images\.nexusmods\.com\/images\/games\/v2\/\d+\/hero\.jpg$/i.test(src));
    });
    if (imgHeader) {
      if (options['Hide_CurrentGame_Image'] == true && imgHeader.style.display != 'none') {
        imgHeader.style.display = 'none';
      } else if (options['Hide_CurrentGame_Image'] == false && imgHeader.style.display == 'none') {
        imgHeader.style.display = '';
      }
    }
  }
}

function LOGS_PAGE_PRELOADDATA() {
  //funcao que ao carregar a página "LOGS" de um mod, précarrega os dados da página simulando cliques nas opções disponíveis
  if (current_modTab == 'logs') {
    document.querySelectorAll("div.tabbed-section div.accordionitems dl dt").forEach((item) => {
      if (!item.classList.contains('accopen') && item.getAttribute("AUTO_LOADED") !== "true") {
        item.setAttribute("AUTO_LOADED", true);
        item.addEventListener("click", () => {
          setTimeout(() => {
            PROFILE_ONMOUSE();
            TRANSFORM_TEXT_LINKS();
          }, 2500);
        });
      }
    });
  }
}

function realClick_event(el) {
  ["pointerdown", "mousedown", "mouseup", "click"].forEach(type => {
    el.dispatchEvent(new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      buttons: 1
    }));
  });
}

function loadMessages(locale) {
  if (locale == 'portuguese') {
    locale = 'pt_BR'
  }
  if (locale == 'english') {
    locale = 'en'
  }
  if (locale == 'alemao') {
    locale = 'de'
  }
  if (locale == 'polones') {
    locale = 'pl'
  }
  if (locale == 'frances') {
    locale = 'fr'
  }
  if (locale == 'russo') {
    locale = 'ru'
  }
  if (!locale) {
    locale = 'en';
  }
  chrome.runtime.sendMessage({
    action: 'Load_Messages',
    lang: locale
  }, function(response) {
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError.message)
    } else {
      if (response && response.success) {
        translate_strings = response.message
        START()
      } else {
        console.error('Error in response:', response.error)
      }
    }
  })
}
var overlay;

function INIT() {
  if (STARTED == true) {
    return
  }
  if (!document.querySelector("div#nexus-fade-overlay")) {
    overlay = document.createElement('div');
    overlay.id = 'nexus-fade-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backdropFilter = 'blur(14px)';
    overlay.style.background = 'rgba(20,20,20,0.2)';
    overlay.style.zIndex = '999999';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.style.opacity = '1';
  }
  STARTED = true
  console.log('Iniciando...')
  SITE_URL = window.location.href
  const storage = chrome?.storage || browser?.storage;
  storage.local.get("options_data", (data) => {
    if (data.options_data) {
      options = data.options_data;
      lastOptions = options;
      console.log(options)
      WIDER_WEBSITE()
      if (options['WebSiteFadeEffect'] === true) {
        document.documentElement.appendChild(overlay);
        revealCheck();
        setTimeout(revealSite, 1000);
      }
      YOUTUBE_STATUS = 'unlock'
      loadMessages(options['language'])
    } else {
      chrome.runtime.sendMessage({
        action: 'LoadBox'
      }, async function(response) {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError.message)
          window.location.reload()
        } else {
          if (response && response.success) {
            options = response.data
            lastOptions = options
            WIDER_WEBSITE()
            YOUTUBE_STATUS = 'unlock'
            loadMessages(options['language'])
requestAnimationFrame(revealCheck);
            console.log(options)
          } else {
            console.error('Error in response:', response.error)
            window.location.reload()
          }
        }
      })
    }
  });
}

function revealCheck() {
  if (document.readyState == "complete" && document.getElementById('nexus-fade-overlay')) {
    revealSite();
  } else {
    requestAnimationFrame(revealCheck);
  }
}

function revealSite() {
  overlay = document.getElementById('nexus-fade-overlay');
  if (!overlay) return;
  overlay.style.opacity = '0';
  setTimeout(() => {
    if (overlay) {
      overlay.remove();
    }
  }, 500);
}
INIT();
document.addEventListener('DOMContentLoaded', () => {
 INIT()
  setTimeout(INIT, 2000)
  WIDER_WEBSITE()
  NEED_UPDATE = true
  NEXUS_TWEAKS()
})

function saveCheckbox(box, valor) {
  chrome.runtime.sendMessage({
    action: 'SaveBox',
    item: box,
    checado: valor
  }, function(response) {
    //alert(response.message)
  })
}
setTimeout(FLOATING_MENU_SHORTCUTS, 1000)
FAST_DOWNLOAD()
SELECTED_TAB();
document.addEventListener('wheel', async function(ev) {
  FLOATING_MENU_SHORTCUTS()
  if (ev.ctrlKey) {
    if (document.elementFromPoint(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y).id == 'ImageView' || document.elementFromPoint(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y).closest('div#modPopup')) {
      ev.preventDefault()
      var delta = Math.max(-1, Math.min(1, ev.deltaY || -ev.detail))
      var zoomAmount = 0.1
      delta = -delta
      zoomLevel += delta * zoomAmount
      zoomLevel = Math.max(0.1, Math.min(2.0, zoomLevel))
      if (modPreview_element) {
        modPreview_element.style.transform = `scale(${zoomLevel})`
        SYNC_THUMB_STRIP_POSITION();
      }
      if (modPopup_element) {
        modPopup_element.style.transform = `scale(${zoomLevel})`
      }
    }
  }
  if (ev.ctrlKey == true && imgPopup && !imgPopup.classList.contains('popup-hidden')) {
    ev.preventDefault()
    var delta = Math.max(-1, Math.min(1, ev.deltaY || -ev.detail))
    // Definir a quantidade de zoom
    var zoomAmount = 0.1 // Valor arbitrário de zoom
    // Inverter a direção do scroll
    delta = -delta
    // Atualizar o nível de zoom
    zoomLevel += delta * zoomAmount
    // Limitar o nível de zoom mínimo e máximo
    zoomLevel = Math.max(0.1, Math.min(2.0, zoomLevel)) // Zoom mínimo de 10% e máximo de 300%
    // Aplicar o zoom na imagem
    imgPopup.style.transform = 'scale(' + zoomLevel + ')'
    mouseX = ev.clientX
    mouseY = ev.clientY + window.scrollY
    if (imgPopup && !imgPopup.classList.contains('popup-hidden')) {
      const mouseX = ev.clientX
      const mouseY = ev.clientY
      // Dimensões da janela e da imagem
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const imgWidth = imgPopup.width
      const imgHeight = imgPopup.height
      // Ajustar a posição da imagem horizontalmente (eixo X)
      let imgLeft = mouseX + 20
      if (imgLeft + imgWidth > windowWidth) {
        imgLeft = windowWidth - imgWidth - 240 // Mantém a imagem dentro da tela à direita
      }
      if (imgLeft < 0) {
        imgLeft = 10 // Mantém a imagem dentro da tela à esquerda
      }
      // Ajustar a posição da imagem verticalmente (eixo Y)
      let imgTop = mouseY + 20
      if (imgTop + imgHeight > windowHeight) {
        imgTop = windowHeight - imgHeight - 140 // Mantém a imagem dentro da tela na parte inferior
      }
      if (imgTop < 0) {
        imgTop = 10 // Mantém a imagem dentro da tela na parte superior
      }
      // Atualiza a posição da imagem
      imgPopup.style.left = imgLeft + 'px'
      imgPopup.style.top = imgTop + 'px'
    }
  }
}, {
  passive: false
})
document.addEventListener('keyup', function(key) {
  if (key.key == "Control") {
    //isDragging = false;
  }
  searchBar = QUERY_ALL_WITH_SHADOW_ROOTS("input#quick-search-keyword")
  if (key.key == 'ArrowLeft' && CanGoShortcut() && !searchBar.length && textFieldFocused == false && options['Enable_Keyboard_Shortcuts'] == true) {
    MOVE_SHORTCUT('left')
  }
  if (key.key == 'ArrowRight' && CanGoShortcut() && !searchBar.length && textFieldFocused == false && options['Enable_Keyboard_Shortcuts'] == true) {
    MOVE_SHORTCUT('right')
  }
})
let searchBar;
document.addEventListener('keydown', async function(key) {
  if (key.key == "Control") {
    //isDragging = true;
  }
  searchBar = QUERY_ALL_WITH_SHADOW_ROOTS("input#quick-search-keyword,div#nma-better-search input")
  if (key.ctrlKey == true && key.key == 'f' && searchBar.length && current_modTab != "posts" && options['Enable_Keyboard_Shortcuts'] == true) {
    key.preventDefault();
    searchBar[0].focus();
    searchBar[0].click();
  }
  if (key.altKey == true && key.key == 'n' && (current_modTab == 'posts' || current_modTab == 'bugs' || current_modTab == 'forum') && current_page == 'only_mod_page' && options['Enable_Keyboard_Shortcuts'] == true) {
    const newTopicButton = document.querySelector("div.forum-nav ul li a#add-comment, a#report-a-bug, div.forum-nav ul li a[href='.popup-topic']")
    if (newTopicButton) {
      key.preventDefault()
      newTopicButton.click()
    }
  }
  if (key.altKey == true && key.key == 'e' && current_page == 'only_mod_page' && options['Enable_Keyboard_Shortcuts'] == true) {
    const endorseButtons = Array.from(document.querySelectorAll("ul.modactions li[id^='action-endorse'], ul.modactions li[id^='action-unendorse']")).filter(el => {
      return window.getComputedStyle(el).display !== 'none'
    })[0]
    if (endorseButtons) {
      key.preventDefault()
      endorseButtons.click()
      endorseButtons.querySelector('a').click()
      if (endorseButtons.getAttribute('id').indexOf('action-endorse-') != -1) {
        CreateNotificationContainer(translate_strings.EndorsePopup_done.message, 'success', 'fa-solid fa-thumbs-up')
      } else {
        CreateNotificationContainer(translate_strings.EndorsePopup_undone.message, 'warning', 'fa-regular fa-thumbs-up')
      }
    }
  }
  if (key.altKey == true && key.key == 't' && current_page == 'only_mod_page' && options['Enable_Keyboard_Shortcuts'] == true) {
    const trackModButtons = Array.from(document.querySelectorAll("ul.modactions li[id^='action-track'], ul.modactions li[id^='action-untrack']")).filter(el => {
      return window.getComputedStyle(el).display !== 'none'
    })[0]
    if (trackModButtons) {
      key.preventDefault()
      trackModButtons.click()
      trackModButtons.querySelector('a').click()
    }
  }
  if (key.ctrlKey == true && key.key == 'f' && current_modTab == 'posts' && current_page == 'only_mod_page' && options['Enable_Keyboard_Shortcuts'] == true) {
    key.preventDefault()
    FocusSearchElement()
  }
  if (key.ctrlKey == true && key.key == 'c' && hiddenInput) {
    setTimeout(function() {
      hiddenInput.style.display = 'none'
    }, 1000)
  }
  if (key.key == 'Escape') {
    key.preventDefault()
    lastDescriptionID = 0
    zoomLevel = 1.0
    if (modPreview_element) {
      modPreview_element.style.display = 'none'
      popupStrip.style.display = 'none';
      popupStrip.innerHTML = "";
      __lastGalleryRef = null;
      __lastRenderedCount = 0;
    }
    if (modPopup_element) {
      modPopup_element.style.display = 'none'
      modPopup_element.querySelector('div#descriptionContent').innerHTML = ''
    }
    if (modFiles_element) {
      modFiles_element.style.display = 'none'
    }
    if (modPreview_element) {
      modPreview_element.style.transform = `scale(${zoomLevel})`
    }
    if (modPopup_element) {
      modPopup_element.style.transform = `scale(${zoomLevel})`
    }
    STILL_LOADING = false
  }
  if (modPreview_element) {
    if (
      (key.key == 'ArrowUp' || key.key == 'ArrowLeft' || (key.key == 'a' && key.ctrlKey == false)) && !isTextField(key.target) && modPreview_element.style.display == 'flex') {
      key.preventDefault()
      POPUP_IMAGES(GALLERY, 0)
    }
    if (
      (key.key == 'ArrowDown' || key.key == 'ArrowRight' || (key.key == 'd' && key.ctrlKey == false)) && !isTextField(key.target) && modPreview_element.style.display == 'flex') {
      key.preventDefault()
      POPUP_IMAGES(GALLERY, 1)
    }
    if (modPreview_element && key.key == 's' && key.ctrlKey == true && modPreview_element.style.display != 'none' && GALLERY && GALLERY.length > 0) {
      key.preventDefault()
      window.open(GALLERY[currentImageIndex].imageUrl)
    }
  }
  if (imgPopup && key.key == 's' && key.ctrlKey == true && !imgPopup.classList.contains('popup-hidden')) {
    key.preventDefault()
    window.open(imgPopup.getAttribute("OriginalSrc") || imgPopup.src)
  }
  if (imgPopup && key.key == '1' && !imgPopup.classList.contains('popup-hidden')) {
    await EndorseImageByPopup(imgPopup);
  } else if (modPopup_element && key.key == '1' && modPopup_element.style.display != 'none') {
    await EndorseVideoByPopup(VIDEO_ID, elementView)
  }
})
setTimeout(() => {
  document.addEventListener('scroll', async function(ev) {
    FLOATING_MENU_SHORTCUTS()
    // Altura da janela de visualização
    var windowHeight = window.innerHeight
    // Distância do topo do documento até a parte superior da janela de visualização
    var scrollY = window.scrollY || window.pageYOffset
    // Altura total do documento
    var documentHeight = document.documentElement.scrollHeight
    // Distância até o final do documento
    var distanceToBottom = documentHeight - (scrollY + windowHeight)
    // Defina a distância em pixels a partir da qual deseja acionar a função
    var threshold = 500
    if (current_page == "mod_pages_all" && distanceToBottom < threshold && !isLoadingGames && SITE_URL.indexOf(".com/mods/add") != -1) {
      LOAD_MORE_GAMES();
    }
    if (distanceToBottom < threshold && current_page == 'only_mod_page' && current_modTab == 'posts' && options['InfiniteScroll'] == true && canScroll == true) {
      canScroll = false
      ModPostsTab_InfiniteScroll()
    }
    if (canScroll == true && current_page == 'mod_pages_all' && options['InfiniteScroll'] == true) {
      if (distanceToBottom < threshold && options['InfiniteScroll'] == true && FETCH_BUSY == false) {
        //canScroll = false
        const SITE_PATH = new URL(SITE_URL)
        if (SITE_PATH.pathname.indexOf('mods/trackingcentre') != -1) {
          setTimeout(GENERATE_INFINITE_SCROLL_TRACKCENTRE, 100)
        } else if (SITE_PATH.pathname == '/media' || SITE_PATH.pathname == '/images' || SITE_PATH.pathname == '/supporterimages' || SITE_PATH.pathname.includes('/supporterimages') || (SITE_PATH.pathname.includes('/media') && !SITE_PATH.pathname.includes('/profile')) || (SITE_PATH.pathname.includes('/games/') && SITE_PATH.pathname.includes('/images'))) {
          GENERATE_INFINITE_SCROLL_MEDIA()
        } else if (SITE_PATH.pathname == '/videos' || (SITE_PATH.pathname.includes('/games/') && SITE_PATH.pathname.includes('/videos'))) {
          GENERATE_INFINITE_SCROLL_VIDEOS()
        } else if (
          (SITE_PATH.pathname.includes('/profile/') && SITE_PATH.pathname.includes('/mods'))) {
          GENERATE_INFINITE_SCROLL_PROFILE_MODS()
        } else if (
          (SITE_PATH.pathname.includes('/profile/') && SITE_PATH.pathname.includes('/media'))) {
          GENERATE_INFINITE_SCROLL_PROFILE_MEDIA()
        } else if (SITE_PATH.pathname == '/mods' || (SITE_PATH.pathname.includes('/games/') && SITE_PATH.pathname.includes('/mods') && !SITE_PATH.pathname.includes('/edit'))) {
          GENERATE_INFINITE_SCROLL_MODS()
        }
      }
    }
    clearTimeout(modBlocksTimeout)
    modBlocksTimeout = setTimeout(GET_VISIBLE_BLOCKS, 50)
  })
}, 3000);

function MoveLoop(x, y, moveElement) {
  let popupX = x
  let popupY = y + window.scrollY
  // Obter as dimensões da viewport
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  if (needMove) {
    if (moveElement) {
      moveElement.style.display = 'flex'
      requestAnimationFrame(() => {
        const rect = moveElement.getBoundingClientRect()
        const popupWidth = rect.width
        const popupHeight = rect.height
        // Limitar o popup à viewport horizontalmente
        if (popupX + popupWidth > viewportWidth) {
          popupX = viewportWidth - popupWidth - 20
        }
        if (popupX < 0) {
          popupX = 0
        }
        // Limitar o popup à viewport verticalmente
        if (popupY + popupHeight > window.scrollY + viewportHeight) {
          popupY = window.scrollY + viewportHeight - popupHeight - 20
        }
        if (popupY < window.scrollY) {
          popupY = window.scrollY
        }
        // Aplicar a posição calculada ao popup
        moveElement.style.left = popupX + 'px'
        moveElement.style.top = popupY + 'px'
      })
    }
    needMove = false
  }
}
let lastClickedElement = null
let textFieldFocused = false;
let thumbOuterVisible = false;
let lastThumbOuterRef = null;
const THUMB_SHOW_ZONE = 120;
document.addEventListener('mousemove', function(mouse) {
  try {
    GLOBAL_MOUSE_X = mouse.clientX
    GLOBAL_MOUSE_Y = mouse.clientY
    if (lastImg && document.elementFromPoint(mouse.clientX, mouse.clientY)) {
      currentImg = document.elementFromPoint(mouse.clientX, mouse.clientY).nodeName
    }
    if (imgPopup && !imgPopup.classList.contains('popup-hidden')) {
      const mouseX = mouse.clientX
      const mouseY = mouse.clientY
      // Dimensões da janela e da imagem
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const imgWidth = imgPopup.width
      const imgHeight = imgPopup.height
      // Ajustar a posição da imagem horizontalmente (eixo X)
      let imgLeft = mouseX + 20
      if (imgLeft + imgWidth > windowWidth) {
        imgLeft = windowWidth - imgWidth - 40 // Mantém a imagem dentro da tela à direita
      }
      if (imgLeft < 0) {
        imgLeft = 10 // Mantém a imagem dentro da tela à esquerda
      }
      // Ajustar a posição da imagem verticalmente (eixo Y)
      let imgTop = mouseY + 20
      if (imgTop + imgHeight > windowHeight) {
        imgTop = windowHeight - imgHeight - 40 // Mantém a imagem dentro da tela na parte inferior
      }
      if (imgTop < 0) {
        imgTop = 10 // Mantém a imagem dentro da tela na parte superior
      }
      // Atualiza a posição da imagem
      imgPopup.style.left = imgLeft + 'px'
      imgPopup.style.top = imgTop + 'px'
    }
    const backgroundImageViewer = document.querySelector("div.lg-backdrop");
    if (!backgroundImageViewer) return;
    const thumbOuter = document.querySelector("div.lg-thumb-outer");
    if (!thumbOuter) return;
    // Novo elemento detectado: inicializa escondido, sem transition
    if (thumbOuter !== lastThumbOuterRef) {
      lastThumbOuterRef = thumbOuter;
      thumbOuter.style.transition = 'none';
      thumbOuter.style.transform = 'translateY(100px)';
      // força reflow pra aplicar sem animação
      void thumbOuter.offsetHeight;
      thumbOuter.style.transition = 'transform 0.25s ease-out';
      thumbOuterVisible = false;
      return;
    }
    const distanceFromBottom = window.innerHeight - mouse.clientY;
    const shouldShow = distanceFromBottom < THUMB_SHOW_ZONE;
    if (shouldShow !== thumbOuterVisible) {
      thumbOuterVisible = shouldShow;
      thumbOuter.style.transform = shouldShow ? 'translateY(0)' : 'translateY(100px)';
    }
  } catch (e) {
    console.error('NexusMods Advance Error:' + e)
  }
})

function CanGoShortcut() {
  if (document.querySelector("div.lg-backdrop")) {
    return false
  }
  if (!modPreview_element && !modPopup_element && !modFiles_element) {
    return true
  }
  if (
    (modPreview_element && modPreview_element.style.display !== 'none') || (modPopup_element && modPopup_element.style.display !== 'none') || (modFiles_element && modFiles_element.style.display !== 'none')) {
    return false
  }
  return true
}

function openExtensionUI() {
  chrome.runtime.sendMessage({
    action: 'PopupConfig',
    type: 'normal'
  }, function(response) {
    if (response && response.success) {}
  })
}
var WARNING_MODS_SHOWN = false;

function LOAD_OUTDATED_MODLIST() {
  if (options['NotifyUpdates'] == true) {
    if (WARNING_MODS_SHOWN == true) {
      return;
    }
    chrome.runtime.sendMessage({
      action: 'GET_OUTDATED_MODLIST',
    }, function(response) {
      if (response && response.success) {
        console.log(response.message + " outdated mods!")
        if (response.message > 0) {
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
          WARNING_MODS_SHOWN = true;
          CreateNotificationContainer(response.message + mods_message, 'warning', 'fa-solid fa-circle-down', 5000)
        }
      } else {
        setTimeout(LOAD_OUTDATED_MODLIST, 1000)
        console.log("NexusMods Advance still checking mods update, wait 1 sec ")
      }
    })
  }
}
const VISIBLE_ELEMENTS = new Set();

function GET_VISIBLE_BLOCKS() {
  // 1️⃣ Seletor único e simples
  const SELECTOR = `
    ul.tiles li.mod-tile:not([VISIBLE]),
    div[class*='mod-tile']:not([VISIBLE]),
    div[data-e2eid='mod-tile-teaser']:not([VISIBLE]),
    div:not([id])[data-e2eid~='media-tile'],
    dl.accordion dt div.stat a,
    td.tracking-mod,
    div[class*='group/collection'][data-e2eid*='collection-tile'],
    a[href*='/collections/']:not([COLLECTION_POPUP]),
    a[href*='/articles/']:not([ARTICLE_CLICK]),
    a:is([href*='/profile/']):not([VISIBLE]),
    a:is([href*='/users/']):not([VISIBLE]),
    a[href*='/mods/']:not([DESCRIPTION_CLICK]),
    dd[data-id]:not([TRACK_INJECTED]),
    ul.accordion-downloads:not([TRACK_INJECTED]),
    div[data-e2eid='media-tile']:not([VISIBLE]),
  li.image-tile:not([VISIBLE]),
  ul.thumbgallery li.thumb:not([VISIBLE]),
  div.swiper-wrapper button.gallery__image-tile:not([VISIBLE]),
  div[class^='comment-content-text']:not([TEXT_TRANSFORMED]), 
  dl.accordion dt:not([TEXT_TRANSFORMED]),
section#section.articlepage article:not([TEXT_TRANSFORMED]),
dl.accordion table.desc-table td.table-require-name:not([VISIBLE]),
div[class*='relative'][data-e2eid='collection-tile-compact']:not([VISIBLE]),

li.comment:not([BUTTONS_SET]),
td.table-bug-title a.issue-title:not([BUG_WATCHER]),
td.bug-comment div.comments li.comment:not([BUTTONS_SET]),

img[src$=".gif"]:not([GIF_PAUSED]),
img[src$="animated=true"]:not([GIF_PAUSED]),
img[src$=".avif"]:not([GIF_PAUSED])
  `;
  // 2️⃣ Pega tudo que ainda não foi processado
  const elements = QUERY_ALL_WITH_SHADOW_ROOTS(SELECTOR).filter(el => !el.hasAttribute('VISIBLE')).filter(el => !el.closest('.HideIgnoredModBlock'));
  if (!elements.length) return
  // 3️⃣ Cria observer uma única vez
  if (!window.__NEXUS_OBSERVER__) {
    window.__NEXUS_OBSERVER__ = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '500px 0px',
      threshold: 0
    })
    const domObs = new MutationObserver(() => {
      GET_VISIBLE_BLOCKS()
    })
    domObs.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
  const observer = window.__NEXUS_OBSERVER__
  // 4️⃣ Função visível AGORA (no load)
  const isVisibleNow = el => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight
  }
  // 5️⃣ Registra tudo
  elements.forEach(el => {
    if (isVisibleNow(el)) {
      markVisible(el)
    } else {
      observer.observe(el)
    }
  })
}

function onIntersect(entries, observer) {
  let updated = false
  for (const entry of entries) {
    if (!entry.isIntersecting) continue
    markVisible(entry.target)
    observer.unobserve(entry.target)
    updated = true
  }
  if (updated) runUpdates()
}

function markVisible(el) {
  if (el.hasAttribute('VISIBLE')) return
  el.setAttribute('VISIBLE', '1')
  VISIBLE_ELEMENTS.add(el);
  runUpdates()
}
let updateQueued = false

function runUpdates() {
  if (updateQueued) return
  updateQueued = true
  requestAnimationFrame(() => {
    updateQueued = false
    GENERATE_TRACK_BUTTONS();
    LOAD_HIDDEN_WORDS()
    REMOVE_MOD_STATUSVIEW()
    REMOVE_MOD_COLLECTIONS()
    FAST_CHANGELOGS()
    PAUSE_GIFS();
    CREATE_MODS_BUTTONS()
    VideoPopupSetup()
    HideModsByList()
    ImagePopupSetup()
    Fix_Youtube_Thumbnails()
    OriginalImageSetup();
    MEDIA_TILE_DATE();
    DESCRIPTION_ONMOUSE()
    PROFILE_ONMOUSE()
    ARTICLES_ONMOUSE();
    COLLECTIONS_ONMOUSE();
    TRANSFORM_TEXT_LINKS();
    CREATE_POSTS_BUTTONS();
  })
}
if (location.pathname === "/mods/add") {
  console.log("💣 Removendo gamelist original");
  let killed = false;
  const killOriginalList = () => {
    if (killed) return true;
    const list = document.querySelector("div.container form#edit-mod-details");
    if (!list) return false;
    killed = true;
    window.stop();
    list.replaceWith();
    // interrompe o site
    return true;
  };
  // Tenta o mais cedo possível
  if (killOriginalList()) {
    console.log("☠️ Gamelist removida imediatamente");
  }
  // Fallback: observer caso ela nasça depois
  const mo = new MutationObserver(() => {
    if (killOriginalList()) {
      console.log("☠️ Gamelist removida via observer");
      // agora só o SEU código
      INIT();
      setTimeout(INIT, 2000);
      WIDER_WEBSITE();
      NEED_UPDATE = true;
      setTimeout(NEXUS_TWEAKS, 200);
      mo.disconnect();
    }
  });
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "NMA_GO_BACK_AFTER_DOWNLOAD") {
    //AutoClickDownloadButton AutoClose/Back Fallback
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const currentURL = window.location.href;
          history.go(-1);
          setTimeout(() => {
            if (window.location.href === currentURL) {
              console.log("NMA: NÃO FOI POSSÍVEL VOLTAR — TENTANDO FECHAR.");
              window.close();
            }
          }, 300);
        } catch (error) {
          console.warn("NMA: FALHA AO VOLTAR APÓS DOWNLOAD:", error);
          window.close();
        }
      }, 300);
    });
  }
});