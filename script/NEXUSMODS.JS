
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
      requestAnimationFrame(START);
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
    requestAnimationFrame(WIDER_WEBSITE);
    current_page = await PAGE_VIEW.ON_MOD_PAGES(SITE_URL);

    clearInterval(YOUTUBE_LOOP);
    YOUTUBE_LOOP = setInterval(CHECK_YOUTUBEIFRAMES, 1500);

    await SCROLL_TO_UPDATE();
    await PAGE_VIEW.LOAD_HIDDEN_WORDS(true);
    await FloatingMenu();
    await HideModsByList();
    await YoutubeEnlarger();
    await ImagePopupSetup();
    await VideoPopupSetup();
    await HideMyMods();
    await CustomModsBlockSize();
    await BetterSearch();
    await EXTERNAL_LINKS_NEWTAB();
    await MOD_VIEW.PROFILE_ONMOUSE();
    await MOD_VIEW.ARTICLES_ONMOUSE();
    if (options['AllNotifications'] == true) {
      NotificationManager();
      setInterval(NotificationManager, 4000);
    }
    if (!document.querySelector("[data-game-id]")) {
      gameId = 0;
    } else {
      gameId = document.querySelector("[data-game-id]").getAttribute("data-game-id");

      last24Hours = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:1,sort_by:date,show_game_filter:false,page_size:15"
      last30Days = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:30,sort_by:OLD_downloads,order:DESC,show_game_filter:false,page_size:15"
      lastWeek = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:7,sort_by:date,show_game_filter:false,page_size:15"
      popularAllTime = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,sort_by:OLD_downloads,order:DESC,show_game_filter:false,page_size:15"
      moreTrending = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ModList?RH_ModList=nav:false,home:false,type:0,user_id:0,game_id:" + gameId + ",advfilt:true,time:7,sort_by:one_week_ratings,order:DESC,show_game_filter:false,page_size:20"
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
          await MOD_VIEW.SELECTED_TAB();
          await MOD_VIEW.FAST_DOWNLOAD();
          await TAB_POSTS_OBSERVER();
          await MOD_VIEW.DESCRIPTION_TAB();
          await MOD_VIEW.DESCRIPTION_ONMOUSE();
          await MOD_VIEW.GENERATE_SAVE_BUTTONS();
          await MOD_VIEW.FAST_CHANGELOGS();
          await MOD_VIEW.STICKY_POSTS();
          await MOD_VIEW.CREATE_POSTS_BUTTONS();
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
      await CustomGameBlockSize();
    }
    await MISC_FIXES.APPLY_ALL();

    await REMAKE_ADDMODS_LIST();

    setTimeout(NOTIFICATION_WAITER, 3000);
    let fim = performance.now();
    let tempoExecucao = fim - inicio;
    console.log(`NEXUS_TWEAKS Executado em: ${tempoExecucao} ms`);
  }
}

let cachedGameCards = [];
let filterInput;
async function REMAKE_ADDMODS_LIST() {

  if (SITE_URL.indexOf("https://www.nexusmods.com/mods/add") != -1 && GAMES.length > 0 && !document.querySelector("form#edit-mod-details div#game-picker-widget div#BetterGameList") && !SITE_URL.includes("NM_ADVANCERELOAD")) {

    console.log("Recriando Lista de Jogos");
    let inicio = performance.now();
    // Função que carrega a imagem quando visível
    const loadImage = (img) => {
      const src = img.getAttribute("data-src");
      if (src) {
        img.src = src;
        img.removeAttribute("data-src"); // Remove o data-src após o carregamento
      }
    };

    // Configuração do IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img); // Carrega a imagem quando visível
          observer.unobserve(img); // Para de observar o elemento
        }
      });
    }, {
      root: null, // Observa em relação à viewport
      threshold: 0.1 // Quando 10% do elemento estiver visível
    });

    const gameListWrapper = document.querySelector("form#edit-mod-details div#game-picker-widget div.gamelist-wrapper");

    if (gameListWrapper && !document.querySelector("form#edit-mod-details div#game-picker-widget div#BetterGameList") && SITE_URL.indexOf("https://www.nexusmods.com/mods/add") != -1) {
      gameListWrapper.remove();

      const newlist = document.createElement("div");
      newlist.classList = "gamelist-wrapper";
      newlist.id = "BetterGameList";
      document.querySelector("form#edit-mod-details div#game-picker-widget").append(newlist);

      function debounce(func, delay) {
        let timeout;
        return function (...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, delay);
        };
      }
      // Função de filtragem com debounce
      const filterGames = debounce(function () {
        const filterText = filterInput.value.toLowerCase();
        cachedGameCards.forEach(({ element, gameName }) => {
          if (gameName.includes(filterText)) {
            element.classList.remove("HiddenGame");
          } else {
            element.classList.add("HiddenGame");
          }
        });
      }, 300);
      const observerConfig = { childList: true, subtree: true };

      const observerCallback = (mutationsList, observer) => {
        filterInput = document.querySelector("input#filter-games");

        if (filterInput) {
          console.log("Elemento input#filter-games detectado!");
          filterInput.addEventListener("input", filterGames);
          requestIdleCallback(() => {
            const form = document.querySelector("form#edit-mod-details");
            const sections = form.querySelectorAll("div.form-section");

            // Convertemos a NodeList em array e removemos todos, exceto o primeiro
            sections.forEach((section, index) => {
              if (index > 0) {
                section.remove();
              }
            });
          });
          // Desconecta o observador imediatamente após detectar o input
          observer.disconnect();
          return;  // Impede que continue verificando mutações após o input ser encontrado
        }

        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            filterInput = document.querySelector("input#filter-games");

            if (filterInput) {
              console.log("Elemento input#filter-games detectado!");

              filterInput.addEventListener("input", filterGames);

              // Desconecta o observador após encontrar o input
              observer.disconnect();
              break;  // Saia do loop de mutações para evitar execuções adicionais
            }
          }
        }
      };

      const inputObserver = new MutationObserver(observerCallback);
      inputObserver.observe(document.body, observerConfig); // Observa mudanças no corpo da página

      GAMES.sort((a, b) => b.downloads - a.downloads);
      GAMES.forEach(function (GAME_ITEM) {
        const div = document.createElement("div");
        div.classList = "game-card";
        div.id = "game-tile-" + GAME_ITEM.id;
        div.setAttribute("Nurl", GAME_ITEM.nexusmods_url + "/mods/add?NM_ADVANCERELOAD=false");

        div.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          window.location.href = ev.currentTarget.getAttribute("Nurl");
        });

        const subDiv = document.createElement("div");
        subDiv.classList = "mod-tile-left";
        subDiv.id = "tile-left-" + GAME_ITEM.id;

        const imgA = document.createElement("a");
        imgA.classList = "mod-image";

        const img = document.createElement("img");
        img.setAttribute("draggable", false);
        img.setAttribute("width", 200);
        img.setAttribute("height", 250);
        img.src = "https://www.nexusmods.com/assets/images/default/tile_empty.png";
        img.setAttribute("data-src", "https://staticdelivery.nexusmods.com/Images/games/4_3/tile_" + GAME_ITEM.id + ".jpg");
        img.setAttribute("lazyload", true);

        const game_name = document.createElement("p");
        game_name.classList = "tile-name";
        game_name.innerText = GAME_ITEM.name;

        imgA.append(img, game_name);
        subDiv.append(img, game_name);
        div.append(subDiv);

        document.querySelector("form#edit-mod-details div#game-picker-widget div.gamelist-wrapper").appendChild(div);

        observer.observe(img);
      });
      requestAnimationFrame(() => {
        const gameCards = document.querySelectorAll("div.game-card");
        cachedGameCards = Array.from(gameCards).map(card => {
          return {
            element: card,
            gameName: card.querySelector(".tile-name").innerText.toLowerCase()
          };
        });
        console.log(cachedGameCards.length + " Cards");

      });

      let fim = performance.now();
      let tempoExecucao = fim - inicio;
      CreateNotificationContainer(`RENDERING ${GAMES.length} GAMES AND SUB-ELEMENTS TOOK: ${tempoExecucao} ms`, "success", null, 7000)
    } else {
      console.log("Sem Jogos ainda 2");
      requestAnimationFrame(REMAKE_ADDMODS_LIST);
    }
  } else if (SITE_URL.indexOf("https://www.nexusmods.com/mods/add") != -1 && !document.querySelector("form#edit-mod-details div#game-picker-widget div#BetterGameList") && !SITE_URL.includes("NM_ADVANCERELOAD")) {
    console.log("Sem Jogos ainda");
    requestAnimationFrame(REMAKE_ADDMODS_LIST);
  }

}

async function EXTERNAL_LINKS_NEWTAB() {
  try {
    if (options['NewTab_ExternalURL'] === true) {
      const EXTERNAL_LINKS = Array.from(document.querySelectorAll("div#mainContent a:not([NEW_TAB])"))
      .filter(function (link) {
        // Verifica se o link possui href
        if (link.href) {
          // Ignora links que executam código JavaScript
          if (link.href.startsWith("javascript:")) {
            return false;
          }
          try {
            const linkHostname = new URL(link.href).hostname;
            // Retorna os links que não são de nexusmods.com
            return !linkHostname.includes('nexusmods.com');
          } catch (e) {
            // Retorna false se a URL não for válida
            return false;
          }
        }
        return false; // Descarta links inválidos ou relativos
      });    

      EXTERNAL_LINKS.forEach(function (external_link) {
        external_link.setAttribute("target", "_blank");
        external_link.setAttribute("NEW_TAB", true);
      });
    }
  } catch (E) {
    console.error(E);
  }
}

async function FETCH_FAVORITES_GAMES() {
  await fetch("https://www.nexusmods.com/GameFavourites?GetData", {
    method: "GET",
    headers: {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    credentials: "include"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.status == true && data.data && data.data.length > 0) {
        data.data.forEach(game => {
          FAVORITE_GAMES.push(game.id);
        });
      }
    })
    .catch(error => {
      console.error('Houve um erro:', error);
    });
  GAME_LIST_REMAKE(GAMES);
}
const MISC_FIXES = {
  FIX_ARTICLE_EDIT_LINK: async () => {
    try {
      const SITE_PARAMS = new URLSearchParams(window.location.search);
      if (SITE_URL.indexOf("/articles/") != -1 && SITE_URL.indexOf("nexusmods.com/article/") == -1) {
        let edit_article_link = Array.from(document.querySelectorAll("div.manage-mod div.subnav ul.sublist li:not([ARTICLE_LINK_FIX])"))
          .filter(li => {
            li.setAttribute("ARTICLE_LINK_FIX", true);
            const anchor = li.querySelector('a');
            return anchor && anchor.href.includes('step=articles') && anchor.href.includes('/edit/');
          });
        if (edit_article_link[0] && edit_article_link[0].querySelector("a")) {
          edit_article_link = edit_article_link[0].querySelector('a');
          edit_article_link.href = edit_article_link.href + "&ARTICLE_EDIT=" + await extrairID(SITE_URL);
        }
      }
      else if (SITE_URL.indexOf("/mods/edit/") != -1 && SITE_URL.indexOf("step=articles") != -1 && SITE_PARAMS.get("ARTICLE_EDIT")) {
        const ARTICLE_ELEMENT = document.querySelector("div.file-organise ul.tiles li[id='article-" + SITE_PARAMS.get("ARTICLE_EDIT") + "'");
        if (ARTICLE_ELEMENT) {
          console.log(ARTICLE_ELEMENT.querySelector("li.article-button a.edit-article"));
          ARTICLE_ELEMENT.querySelector("li.article-button a.edit-article").click();
          setTimeout(() => {
            SITE_PARAMS.delete('ARTICLE_EDIT');
            const novaURL = window.location.pathname + '?' + SITE_PARAMS.toString();
            window.history.pushState({ path: novaURL }, '', novaURL);
          }, 3000);

        }
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  STICKY_EDIT_BUTTONS: async () => {
    try {

      if (SITE_URL.indexOf("/mods/edit/") != -1 || SITE_URL.indexOf("/mods/add") != -1) {
        const featuredElement = document.querySelector("section.modpage div#featured");
        if (featuredElement) {
          featuredElement.style.background = "#383838 url(/assets/images/default/bg_default.jpg) 0 0 no-repeat"
          featuredElement.style.position = "sticky"
          featuredElement.style.top = document.querySelector("header#head").offsetHeight - 1 + 'px';
          featuredElement.style.zIndex = "9999"
        }
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  FLOATING_COMMENT_OPTIONS: async () => {
    try {
      if (options['Following_EditMenu'] == true) {
        const FLOATING_MENU_ENVS = document.querySelectorAll("div.wysibb-toolbar:not([FLOATING])");
        FLOATING_MENU_ENVS.forEach((FLOATING_MENU) => {
          if (FLOATING_MENU) {
            const wysibbContainer = FLOATING_MENU.closest("div.wysibb");

            wysibbContainer.style.position = 'relative';

            wysibbContainer.addEventListener('click', (ev) => {
              FLOATING_ITEM = ev.currentTarget.querySelector("div.wysibb-toolbar");
              if (FLOATING_ITEM && !FLOATING_ITEM.contains(ev.target)) {
                const wysibbRect = wysibbContainer.getBoundingClientRect();
                const menuRect = FLOATING_MENU.getBoundingClientRect();

                let newLeft = ev.clientX - wysibbRect.left + 30;
                let newTop = ev.clientY - wysibbRect.top + 30;

                if (newLeft + menuRect.width > wysibbRect.width) {
                  newLeft = wysibbRect.width - menuRect.width - 10;
                }
                if (newLeft < 0) {
                  newLeft = 0;
                }
                if (newTop + menuRect.height > wysibbRect.height) {
                  newTop = wysibbRect.height - menuRect.height - 120;
                }
                if (newTop < 0) {
                  newTop = 0;
                }
                FLOATING_ITEM.style.left = newLeft + "px";
                FLOATING_ITEM.style.top = newTop + "px";
              }
            });

            // Listener para capturar teclas de seta e mover o menu
            function debounce(func, wait) {
              let timeout;
              return function (...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
              };
            }
            wysibbContainer.addEventListener(
              'keydown',
              debounce((ev) => {

                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const rect = range.getBoundingClientRect();
                  const wysibbRect = wysibbContainer.getBoundingClientRect();

                  // Verifica se o bounding rect é válido
                  if (rect.width === 0 && rect.height === 0) {
                    // Se a linha for vazia ou o cursor não tiver uma posição válida
                    // Define o fallback para a posição do container ou a posição anterior
                    return; // Saia sem atualizar o menu flutuante
                  }

                  // Calcula a posição do cursor em relação ao wysibbContainer
                  const cursorX = rect.left - wysibbRect.left;
                  const cursorY = rect.top - wysibbRect.top;

                  // Aqui você pode mover o FLOATING_MENU com base na posição do cursor
                  let newLeft = cursorX + 30;
                  let newTop = cursorY + 30; // Ajuste para evitar sobreposição

                  // Verifica se o FLOATING_MENU está saindo dos limites do wysibbContainer
                  if (newLeft + FLOATING_MENU.offsetWidth > wysibbRect.width) {
                    newLeft = wysibbRect.width - FLOATING_MENU.offsetWidth - 10;
                  }
                  if (newLeft < 0) {
                    newLeft = 0;
                  }
                  if (newTop + FLOATING_MENU.offsetHeight > wysibbRect.height) {
                    newTop = wysibbRect.height - FLOATING_MENU.offsetHeight - 120;
                  }
                  if (newTop < 0) {
                    newTop = 0;
                  }

                  // Atualiza a posição do FLOATING_MENU
                  FLOATING_MENU.style.left = newLeft + 'px';
                  FLOATING_MENU.style.top = newTop + 'px';
                }

              }, 50) // Debounce com 50ms de atraso
            );

            // Muda a posição do FLOATING_MENU para 'absolute'
            FLOATING_MENU.style.position = "absolute";
            FLOATING_MENU.style.background = "#e9e9d5";
            FLOATING_MENU.style.top = "60%";
            FLOATING_MENU.setAttribute("FLOATING", true);
          }
        });
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
  APPLY_ALL: async () => {
    await MISC_FIXES.FIX_ARTICLE_EDIT_LINK();
    await MISC_FIXES.STICKY_EDIT_BUTTONS();
    clearInterval(FLOATING_COMMENTS_LOOP);
    FLOATING_COMMENTS_LOOP = setInterval(MISC_FIXES.FLOATING_COMMENT_OPTIONS, 100);

  }
}
async function NOTIFICATION_WAITER() {
  if (options['SimpleSiteNotifications'] === true) {
    const targetNode = document.body;

    const observer = new MutationObserver(async (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const notificationPop = document.querySelector("div.mfp-content div.popup");

          if (notificationPop) {
            await CHECK_WEBNOTIFICATIONS();
          }
        }
      }
    });

    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
    }
  }
}

async function CHECK_WEBNOTIFICATIONS() {
  const notificationPop = document.querySelector("div.mfp-content div.popup");
  if (notificationPop
    && !["popup-mod-tagging", "popup-bugreport", "popup-file-contents", "widget-download", "popup-download"].some(cls => notificationPop.classList.contains(cls))
    && notificationPop.innerText.trim() !== ""
    && notificationPop.innerText.trim() !== "×"
    && notificationPop.querySelector("div p.info").innerText.trim().length > 0
  ) {

    CreateNotificationContainer(
      notificationPop.innerText.replaceAll("\n\n", "<br>").replaceAll("×", ""),
      'sitePopup',
      'fa-solid fa-rss'
    );

    document.querySelector("div.mfp-content div.popup button").click();
  }
}

async function PAUSE_GIFS() {
  if ((current_modTab == "posts" || current_modTab == "description") && options['PauseExternalGifs'] == true && !PAUSE_GIFS_BUSY) {
    PAUSE_GIFS_BUSY = true;
    const gifElements = document.querySelectorAll('img[src$=".gif"]:not([GIF_PAUSED])');

    gifElements.forEach((gifElement) => {
      if (gifElement.complete) {
        setTimeout(() => {
          requestAnimationFrame(() => GIF_LOAD_LISTENER(gifElement));
        }, 0);
      } else {
        gifElement.onload = () => {
          setTimeout(() => {
            requestAnimationFrame(() => GIF_LOAD_LISTENER(gifElement));
          }, 0);
        };
      }
    });

    PAUSE_GIFS_BUSY = false;
  }
}

function GIF_LOAD_LISTENER(gifElement) {
  const gifUrl = new URL(gifElement.src);
  if (gifUrl.href.includes('/emoticons/') || (gifElement.closest("div.img-wrapper") && gifElement.closest("div.img-wrapper").querySelector("canvas"))) {
    return;
  }
  const canvasElement = document.createElement('canvas');
  const ctx = canvasElement.getContext('2d');
  canvasElement.width = gifElement.width;
  canvasElement.height = gifElement.height;
  canvasElement.style.width = '100%';
  canvasElement.style.height = '100%';
  ctx.drawImage(gifElement, 0, 0, gifElement.width, gifElement.height);

  canvasElement.onmouseenter = () => {
    gifElement.style.display = 'block';
    canvasElement.style.display = 'none';
  };
  gifElement.onmouseleave = () => {
    ctx.drawImage(gifElement, 0, 0, gifElement.width, gifElement.height);
    gifElement.style.display = 'none';
    canvasElement.style.display = 'block';
  };
  gifElement.parentNode.insertBefore(canvasElement, gifElement);
  gifElement.style.display = 'none';
  gifElement.setAttribute('GIF_PAUSED', 'true');
}

async function WIDER_WEBSITE() {
  try {
    const mainContent = document.querySelector("div#mainContent");
    if (mainContent) {
      if (options['WideWebsite']) {
        mainContent.classList.add("noPadding");
      } else {
        mainContent.classList.remove("noPadding");
      }
    }
  } catch (e) {
    console.error("NexusMods Advance Error:" + e);
  }
}
async function CustomModsBlockSize() {
  if (options['ModBlock_Render'] == true) {
    document.querySelector("style").textContent += "ul.tiles li.mod-tile { width:" + options['BlockSize_input'] + " !important; }";
  }
}
async function CustomGameBlockSize() {
  if (options['GameBlockSize_input']) {
    document.querySelector("style").textContent += "ul.game-tiles li.image-tile { width:" + options['GameBlockSize_input'] + " !important; }";
  }
}

function FIND_GAME_ON_GAMES(name) {
  const results = []; // Array para armazenar todos os jogos correspondentes
  for (const [id, game] of gameMap) {
    if (game.name.toLowerCase().includes(name.toLowerCase())) {
      results.push(game); // Adiciona o jogo ao array de resultados
    }
  }
  return results.length > 0 ? results : []; // Retorna todos os resultados ou GAMES se nenhum jogo for encontrado
}

async function SEARCH_GAME(ev) {
  const GAMES_PARAM_NEW = FIND_GAME_ON_GAMES(ev.value);
  const items = document.querySelectorAll("ul.improved_Gamelist li.image-tile");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.add("HiddenGame");
  }
  GAMES_PARAM_NEW.forEach(game => {
    const gameElement = document.querySelector(`li[data-game-id='${game.id}']`);
    if (gameElement) {
      gameElement.classList.remove("HiddenGame");
    }
  });

}
async function FILTER_GAMES_LIST(GAMES_PARAM) {
  let inicio = performance.now();
  const ulElement = document.querySelector("ul.improved_Gamelist");
  ulElement.style.opacity = '0';
  const fragment = document.createDocumentFragment();

  // Usar um loop for tradicional
  for (let i = 0; i < GAMES_PARAM.length; i++) {
    const game = GAMES_PARAM[i];
    const gameElement = gameElementsMap.get(game.id);
    if (gameElement) {
      fragment.appendChild(gameElement); // Adiciona os elementos ao fragmento
    }
  }
  requestIdleCallback(() => {
    ulElement.replaceChildren(fragment); // Atualiza o DOM
    ulElement.style.opacity = '1'; // Mostra a lista novamente
  })

  let fim = performance.now();
  let tempoExecucao = fim - inicio;
  console.log(`FILTRO Executado em: ${tempoExecucao} ms`);
}
async function GAME_LIST_REMAKE(GAMES_PARAM = GAMES, search = false) {

  const path = new URL(SITE_URL).pathname;
  if ((search == true || document.querySelectorAll("div#games-list ul.game-tiles li.image-tile").length > 0) && options['GameBlock_Render'] == true) {
    let inicio = performance.now();
    const GAME_SHOW_MORE = document.querySelector("div.home-intro a#view_total_games,div.btn-more a.js-expand-games");
    if (GAME_SHOW_MORE) {
      if (GAME_SHOW_MORE || search == true) {
        GAME_SHOW_MORE.closest("div.btn-more").remove();
        document.querySelector("div#games-list ul.game-tiles").remove();
      }
      if (!FILTERS_SET) {

        document.querySelector("div.game-filter").style.display = "none";
        const FILTER_DIV = document.createElement("div");
        FILTER_DIV.classList = "game-filter flex clearfix"

        //SEARCH BAR
        const SEARCH_GAMES = document.createElement("input");
        SEARCH_GAMES.setAttribute("type", "text");
        SEARCH_GAMES.id = "improved_SearchGames";
        let timeoutId;
        SEARCH_GAMES.addEventListener("input", function (ev) {
          const eveee = ev.currentTarget;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => { SEARCH_GAME(eveee) }, 100);
        });

        //FILTER DROPDOWN
        const FILTER_DROPDOWN = document.createElement("select");
        FILTER_DROPDOWN.id = "improved_Filter";
        let dropdownOptions = [
          { value: 'downloads', text: translate_strings.Filter_Dropdown_2.message },
          { value: 'data', text: translate_strings.Filter_Dropdown_1.description },
          { value: 'nome', text: translate_strings.Filter_Dropdown_1.message },
          { value: 'mods', text: translate_strings.Filter_Dropdown_2.description },
          { value: 'genre', text: translate_strings.Filter_Dropdown_3.message },
          { value: 'collections', text: translate_strings.Filter_Dropdown_3.description },
        ];

        for (let i = 0; i < dropdownOptions.length; i++) {
          let DROPDOWN_ELEMENT = dropdownOptions[i];
          const option = document.createElement("option");
          option.value = DROPDOWN_ELEMENT.value.toLowerCase().replace(/\s+/g, '_')
          option.textContent = DROPDOWN_ELEMENT.text;
          FILTER_DROPDOWN.appendChild(option);
        }

        FILTER_DROPDOWN.addEventListener("change", async (event) => {

          const selectedValue = event.target.value;

          // Ordenar a lista de acordo com o valor selecionado
          if (selectedValue === "downloads") {
            GAMES_PARAM.sort((a, b) => b.downloads - a.downloads);
          } else if (selectedValue === "data") {
            GAMES_PARAM.sort((a, b) => b.approved_date - a.approved_date);
          } else if (selectedValue === "nome") {
            GAMES_PARAM.sort((a, b) => a.name.localeCompare(b.name));
          } else if (selectedValue === "mods") {
            GAMES_PARAM.sort((a, b) => b.mods - a.mods);
          } else if (selectedValue === "genre") {
            GAMES_PARAM.sort((a, b) => a.genre.localeCompare(b.genre));
          } else if (selectedValue === "collections") {
            GAMES_PARAM.sort((a, b) => b.collections - a.collections);
          }
          FILTER_SEARCHTYPE.value = 'desc'
          await FILTER_GAMES_LIST(GAMES_PARAM);

        });

        const FILTER_SEARCHTYPE = document.createElement("select");
        FILTER_SEARCHTYPE.id = "improved_SubFilter";
        const option_asc = document.createElement("option");
        option_asc.value = "asc"
        option_asc.textContent = "ASC"
        const option_desc = document.createElement("option");
        option_desc.value = "desc"
        option_desc.textContent = "DESC"
        FILTER_SEARCHTYPE.appendChild(option_desc)
        FILTER_SEARCHTYPE.appendChild(option_asc)

        FILTER_SEARCHTYPE.addEventListener("change", async (event) => {
          const selectedValue = event.target.value;
          if (selectedValue == "asc") {
            GAMES_PARAM.reverse();
          } else {
            GAMES_PARAM.reverse();
          }

          await FILTER_GAMES_LIST(GAMES_PARAM);
        });

        FILTER_DIV.appendChild(SEARCH_GAMES)
        FILTER_DIV.appendChild(FILTER_DROPDOWN)
        FILTER_DIV.appendChild(FILTER_SEARCHTYPE)
        document.querySelector("div#games-list").prepend(FILTER_DIV);
        GAMES_PARAM.sort((a, b) => b.downloads - a.downloads);

        divDetails = document.createElement("div");
        divDetails.classList = "Advance_gameDetails";
        const gameDownloads = document.createElement("span");
        gameDownloads.id = "downloads_span"

        const gameMods = document.createElement("span");
        gameMods.id = "mods_span"

        const gameType = document.createElement("span");
        gameType.id = "genre_span"

        const gameCollections = document.createElement("span");
        gameCollections.id = "collections_span"

        const gameFiles = document.createElement("span");
        gameFiles.id = "files_span"

        const gameDate = document.createElement("span");
        gameDate.id = "date_span"

        divDetails.appendChild(gameType);
        divDetails.appendChild(gameDownloads);
        divDetails.appendChild(gameMods);
        divDetails.appendChild(gameCollections);
        divDetails.appendChild(gameFiles);
        divDetails.appendChild(gameDate);
        document.body.appendChild(divDetails);
        FILTERS_SET = true;
      }

      console.log("Renderizando " + GAMES_PARAM.length + " Games")
      //CREATE NEW RENDER IMPROVED LIST :D
      const modList = document.createElement("ul")
      modList.classList = "improved_Gamelist tiles game-tiles";
      document.querySelector("div#games-list div.game-section").appendChild(modList);

      async function processBatch(data, batchSize = 1000) {
        let index = 0;

        async function processNextBatch() {
          const end = Math.min(index + batchSize, data.length);
          for (let i = index; i < end; i++) {
            const item = data[i];

            let favorited = false;
            if (FAVORITE_GAMES) {
              favorited = FAVORITE_GAMES.includes(item.id);
            } else {
              favorited = false;
            }
            //GENERATE GAME BY GAME WITH A 500 GAMES LIMIT TO NOT KILL YOUR CPU :D
            const GAME_AAAAAAAA = document.createElement("a");
            GAME_AAAAAAAA.classList = "mod-image";
            GAME_AAAAAAAA.href = item.nexusmods_url;

            const GAME_LI = document.createElement("li");
            GAME_LI.classList = "image-tile fill-game-downloads";
            GAME_LI.setAttribute("id", "game-tile-" + item.id);
            GAME_LI.setAttribute("favorited", favorited);
            GAME_LI.setAttribute("data-game-id", item.id);

            const GAME_TITLE = document.createElement("p")
            GAME_TITLE.classList = 'tile-name';
            GAME_TITLE.innerText = item.name;

            const GAME_IMG = document.createElement("img");
            GAME_IMG.classList = 'lazy game_cover';
            GAME_IMG.width = "400";
            GAME_IMG.height = "225";
            GAME_IMG.alt = item.name;
            GAME_IMG.src = "https://www.nexusmods.com/assets/images/default/tile_empty.png";
            GAME_IMG.setAttribute("lazyload", true);
            GAME_IMG.setAttribute("data-src", "https://staticdelivery.nexusmods.com/Images/games/4_3/tile_" + item.id + ".jpg");

            const imageObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(async entry => {
                if (entry.isIntersecting) {
                  const img = entry.target.querySelector("img");
                  GAME_IMG.setAttribute("onerror", "imgError(this, 'https://www.nexusmods.com/assets/images/default/tile_empty.png')");
                  img.src = img.getAttribute('data-src');
                  img.removeAttribute('data-src');
                  img.removeAttribute('lazyload');
                  entry.target.setAttribute("LOADABLE", true);
                  imageObserver.disconnect();
                  observer.unobserve(img);
                  requestIdleCallback(() => { DetailedGameList(entry.target); });
                }
              });
            });

            GAME_LI.appendChild(GAME_AAAAAAAA);
            GAME_AAAAAAAA.appendChild(GAME_IMG);
            GAME_AAAAAAAA.appendChild(GAME_TITLE);

            modList.appendChild(GAME_LI);
            imageObserver.observe(GAME_LI)
          }
          index = end;

          if (index < data.length) {
            setTimeout(processNextBatch, 10);
          } else {
            BUSY_LIST_REMAKE = false;
            GAMES_PARAM.forEach((game) => {
              const gameElement = document.querySelector(`li[data-game-id='${game.id}']`);
              if (gameElement) {
                gameElementsMap.set(game.id, gameElement);
              }
            });

            document.querySelector("ul.improved_Gamelist").addEventListener('mouseout', (event) => {
              const game = event.target.closest("li.image-tile");
              if (!game) return;
              if (!game.contains(event.relatedTarget)) {
                divDetails.style.visibility = 'hidden';
                divDetails.style.opacity = '0';
              }
            });
            document.querySelector("ul.improved_Gamelist").addEventListener('mousemove', (event) => {
              const game = event.target.closest("li.image-tile");
              if (game && divDetails) {
                divDetails.style.left = GLOBAL_MOUSE_X + 30 + "px";
                divDetails.style.top = GLOBAL_MOUSE_Y + 30 + "px";
              }
            });

            document.querySelector("ul.improved_Gamelist").addEventListener('mouseover', (event) => {
              const game = event.target.closest("li.image-tile");
              if (game && game.getAttribute("downloads") != null) {
                divDetails.querySelector("span#downloads_span").innerHTML = '<i class="fa-solid fa-cloud-arrow-down" aria-hidden="true"></i> ' + game.getAttribute("downloads") + translate_strings.GameDetails_downloads.message;
                divDetails.querySelector("span#mods_span").innerHTML = '<i class="fa-solid fa-gears" aria-hidden="true"></i> ' + game.getAttribute("mods") + translate_strings.GameDetails_mods.message;
                divDetails.querySelector("span#genre_span").innerHTML = '<i class="fa-solid fa-gamepad" aria-hidden="true"></i> ' + translate_strings.GameDetails_genre.message + " " + game.getAttribute("genre");
                divDetails.querySelector("span#collections_span").innerHTML = '<i class="fa-solid fa-book-open" aria-hidden="true"></i> ' + game.getAttribute("collections") + translate_strings.GameDetails_collections.message;
                divDetails.querySelector("span#files_span").innerHTML = '<i class="fa-solid fa-folder-open" aria-hidden="true"></i> ' + game.getAttribute("file_count") + translate_strings.GameDetails_files.message;
                divDetails.querySelector("span#date_span").innerHTML = '<i class="fa-solid fa-clock" aria-hidden="true"></i> ' + translate_strings.GameDetails_date.message + game.getAttribute("game_date");
                divDetails.style.visibility = 'visible';
                divDetails.style.opacity = '1';
              }
            }, true);
            console.log("Processo Completo");
          }
        }

        processNextBatch();
      }

      await processBatch(GAMES_PARAM);

      let fim = performance.now();
      let tempoExecucao = fim - inicio;
      CreateNotificationContainer(`RENDERING ${GAMES.length} GAMES AND SUB-ELEMENTS TOOK: ${tempoExecucao} ms`, "success", null, 7000)
    }
  } else {
    if ((SITE_URL.indexOf("nexusmods.com/games") != -1 || path == "/" || path == "/games") && options['GameBlock_Render'] == true && search == false) {
      setTimeout(() => { GAME_LIST_REMAKE(GAMES, false); }, 1000);
    } else {
      BUSY_LIST_REMAKE = false;
    }
  }

}
function FAVORITE_GAME_REMOVE(ev) {
  ev.currentTarget.classList = "fa-regular fa-heart"
  FAVORITE_GAME(ev.currentTarget.getAttribute("game_id"), "REMOVE", ev.currentTarget.getAttribute("game_name"));
  ev.currentTarget.removeEventListener("click", FAVORITE_GAME_REMOVE);
  ev.currentTarget.addEventListener("click", FAVORITE_GAME_ADD);
}
function FAVORITE_GAME_ADD(ev) {
  ev.currentTarget.classList = "fa-solid fa-heart"
  FAVORITE_GAME(ev.currentTarget.getAttribute("game_id"), "ADD", ev.currentTarget.getAttribute("game_name"));
  ev.currentTarget.removeEventListener("click", FAVORITE_GAME_ADD);
  ev.currentTarget.addEventListener("click", FAVORITE_GAME_REMOVE);
}
async function DetailedGameList(game_item) {
  if (!game_item.querySelector("#favoritePop")) {
    const favorite_action = document.createElement("i");
    const favorite_status = game_item.getAttribute("favorited");
    favorite_action.setAttribute("aria-hidden", true);
    favorite_action.setAttribute("game_id", game_item.getAttribute("data-game-id"));
    favorite_action.setAttribute("game_name", game_item.querySelector("img").getAttribute("alt"));
    if (favorite_status == "true") {
      favorite_action.classList = "fa-solid fa-heart";
      favorite_action.title = "Remove Favorite " + game_item.querySelector("img").getAttribute("alt");
      favorite_action.addEventListener("click", FAVORITE_GAME_REMOVE);
    } else {
      favorite_action.classList = "fa-regular fa-heart";
      favorite_action.title = "Favorite " + game_item.querySelector("img").getAttribute("alt");
      favorite_action.addEventListener("click", FAVORITE_GAME_ADD)
    }
    favorite_action.id = "favoritePop";
    game_item.prepend(favorite_action);
  }
  if (options['DetailGameBlocks'] == true && game_item) {

    const game = game_item;
    let GAME_DATABASE = gameMap.get(Number(game.getAttribute("data-game-id")));
    if (GAME_DATABASE) {
      game.setAttribute("downloads", formatNumber(GAME_DATABASE.downloads))
      game.setAttribute("mods", formatNumber(GAME_DATABASE.mods))
      game.setAttribute("genre", GAME_DATABASE.genre)
      game.setAttribute("collections", formatNumber(GAME_DATABASE.collections))
      game.setAttribute("game_date", formatDate(GAME_DATABASE.approved_date))
      game.setAttribute("file_count", formatNumber(GAME_DATABASE.file_count))

    }
    game.classList.add("HideGameDetails");
    game.setAttribute("new_list", true);

  }

}

function FAVORITE_GAME(GAMEID, type, gameName) {
  let fav_url;
  let post_header = "game_id=" + GAMEID;
  if (type == "ADD") {
    fav_url = "https://www.nexusmods.com/GameFavourites?Add";
    post_header = "game_id=" + GAMEID;
  } else {
    fav_url = "https://www.nexusmods.com/GameFavourites?Remove";
    post_header = "game_id_to_delete=" + GAMEID;
  }
  fetch(fav_url, {
    "headers": {
      "accept": "*/*",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Brave\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
      "sec-ch-ua-arch": "\"x86\"",
      "sec-ch-ua-bitness": "\"64\"",
      "sec-ch-ua-full-version-list": "\"Brave\";v=\"129.0.0.0\", \"Not=A?Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"129.0.0.0\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "\"\"",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-ch-ua-platform-version": "\"15.0.0\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://www.nexusmods.com/games",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": post_header,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })
    .then(response => {
      // Verifica se a resposta é ok (status 200-299)
      if (!response.ok) {
        throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
      }
      // Tenta converter a resposta para JSON
      return response.json();
    })
    .then(data => {
      if (data && data.status == true) {
        if (type == "ADD") {
          CreateNotificationContainer(gameName + "<br>" + translate_strings.Favorite_Game.message, "success", "fa-solid fa-heart", 4000);
        } else {
          CreateNotificationContainer(gameName + "<br>" + translate_strings.Favorite_Game.description, "warning", "fa-solid fa-heart-circle-minus", 4000);
        }

      }
    })
    .catch(error => {
      // Lida com erros de rede ou de conversão
      console.error('Houve um erro:', error);
    });

}

async function SCROLL_TO_UPDATE() {
  const fileIdFromUrl = new URL(window.location.href).searchParams.get("NAdvance_ScrollToFile");
  if (fileIdFromUrl && SITE_URL.indexOf("NAdvance_ScrollToFile") != -1) {
    const updateId = document.querySelector("dt[data-id='" + fileIdFromUrl + "']");
    const updatedd = document.querySelector("dd[data-id='" + fileIdFromUrl + "']");
    if (updateId) {
      updateId.scrollIntoView({
        block: "center",
      });
      setTimeout(function () {
        updateId.classList.add("blink-once")
        updatedd.classList.add("blink-once")
      }, 500)
    }
  }
}

async function REMOVE_MOD_STATUSVIEW() {
  if (options['HideModStatus'] == true) {
    const items = document.querySelectorAll("li[VISIBLE] div[data-mod-id]:not([REMOVED_STATUS])");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const toolTip = item.querySelector("div.mod-tile-dl-status");

      if (toolTip) {
        toolTip.style.display = 'none';

        item.addEventListener("mouseenter", function (ev) {
          ev.currentTarget.querySelector("div.mod-tile-dl-status").style.display = 'block';
        }, true);

        item.addEventListener("mouseleave", function (ev) {
          ev.currentTarget.querySelector("div.mod-tile-dl-status").style.display = 'none';
        }, true);
      }

      item.setAttribute("REMOVED_STATUS", true);
    }
  }
}

async function FloatingMenu() {
  if (options['FixedModMenu'] == true) {
    const modtabs = document.querySelectorAll('ul.modtabs:not([floating])');

    for (let i = 0; i < modtabs.length; i++) {
      const tab = modtabs[i];
      tab.classList.add("floatingMenu");
      tab.style.top = document.querySelector("header#head").offsetHeight - 1 + 'px';

      tab.addEventListener("click", function (ev) {
        const element = ev.currentTarget.parentElement;
        const rect = element.getBoundingClientRect();
        const headerHeight = document.querySelector("header#head").offsetHeight;

        // Verifica se o elemento sumiu acima da viewport
        const isAboveViewport = rect.top < headerHeight;

        // Se o elemento está acima da viewport, rola para o início
        if (isAboveViewport) {
          element.scrollIntoView({
            block: "start",
          });
          setTimeout(() => {
            window.scrollBy({
              top: -100,
              behavior: "smooth"  // Mantém o movimento suave
            });
          }, 150);
        }
      });

      tab.setAttribute("floating", true);
    }
  }
}

async function BetterSearch() {
  if (options['BetterSearch'] && SITE_URL.indexOf("next.nexusmods.com/") == -1) {
    if (!document.querySelector("div#BetterSearch") && !searchDiv) {
      searchDiv = document.createElement("div");
      searchDiv.id = 'BetterSearchDIV';

      let searchType = document.createElement("select");
      let searchTranslations = document.createElement("select");
      let searchEndorsements = document.createElement("select");
      let searchDownloads = document.createElement("select");
      let searchSize = document.createElement("select");

      let type = [
        { value: '0', text: translate_strings.BetterSearch_SearchType.message },
        { value: '1', text: translate_strings.BetterSearch_SearchType.description }
      ];

      for (let i = 0; i < type.length; i++) {
        let lang = type[i];
        let option = document.createElement("option");
        option.value = lang.value;
        option.textContent = lang.text;
        if (lang.value == '0' || lang.value == 0) {
          option.selected = true;
        }
        searchType.appendChild(option);
      }

      let languages = [
        { value: '0', text: translate_strings.BetterSearch_SearchLanguage.message },
        { value: '5', text: "English" },
        { value: '10', text: "French" },
        { value: '15', text: "German" },
        { value: '20', text: "Spanish" },
        { value: '25', text: "Português - Brasil" },
        { value: '30', text: "Italian" },
        { value: '35', text: "Japanese" },
        { value: '40', text: "Turkish" },
        { value: '45', text: "Polish" },
        { value: '50', text: "Mandarim" },
        { value: '55', text: "Russian" },
        { value: '60', text: "Dutch" },
        { value: '65', text: "Czech" },
        { value: '70', text: "Korean" },
        { value: '73', text: "Hungarian" },
        { value: '78', text: "Ukrainian" },
        { value: '-1', text: "Other" }
      ];

      for (let i = 0; i < languages.length; i++) {
        let lang = languages[i];
        let option = document.createElement("option");
        option.value = lang.value;
        option.textContent = lang.text;
        searchTranslations.appendChild(option);
      }

      let endorsements = [
        { value: '0', text: translate_strings.BetterSearch_SearchEndorsements.message },
        { value: '100;1000', text: translate_strings.BetterSearch_EndorsementsSub_Low.message },
        { value: '1000;5000', text: translate_strings.BetterSearch_EndorsementsSub_Medium.message },
        { value: '5001;10000', text: translate_strings.BetterSearch_EndorsementsSub_High.message },
        { value: '7001;900000000', text: translate_strings.BetterSearch_EndorsementsSub_VeryHigh.message }
      ];

      for (let i = 0; i < endorsements.length; i++) {
        let lang = endorsements[i];
        let option = document.createElement("option");
        option.value = lang.value;
        option.textContent = lang.text;
        searchEndorsements.appendChild(option);
      }

      let downloads = [
        { value: '0', text: translate_strings.BetterSearch_SearchDownloads.message },
        { value: '100;1000', text: translate_strings.BetterSearch_DownloadsSub_Low.message },
        { value: '1000;5000', text: translate_strings.BetterSearch_DownloadsSub_Medium.message },
        { value: '5001;10000', text: translate_strings.BetterSearch_DownloadsSub_High.message },
        { value: '7001;900000000', text: translate_strings.BetterSearch_DownloadsSub_VeryHigh.message }
      ];

      for (let i = 0; i < downloads.length; i++) {
        let lang = downloads[i];
        let option = document.createElement("option");
        option.value = lang.value;
        option.textContent = lang.text;
        searchDownloads.appendChild(option);
      }

      let fileSize = [
        { value: '0', text: translate_strings.BetterSearch_SearchSize.message },
        { value: '0;1000', text: "0MB - 1GB" },
        { value: '1000;5000', text: "1GB - 5GB" },
        { value: '5001;10000', text: "5GB - 10GB" },
        { value: '10001;100000', text: "10GB+" }
      ];

      for (let i = 0; i < fileSize.length; i++) {
        let lang = fileSize[i];
        let option = document.createElement("option");
        option.value = lang.value;
        option.textContent = lang.text;
        searchSize.appendChild(option);
      }

      searchDiv.appendChild(searchType);
      searchDiv.appendChild(searchTranslations);
      searchDiv.appendChild(searchEndorsements);
      searchDiv.appendChild(searchDownloads);
      searchDiv.appendChild(searchSize);
      searchDiv.setAttribute('data-category-value', 'mods');

      if (SITE_URL.indexOf("next.nexusmods.com/") == -1) {
        document.querySelector("input#gsearch").addEventListener("click", function () {
          searchDiv.style.display = 'block';
          document.querySelector("button.rj-search-category-dropdown-toggle").click();
        });
        var dropdown = document.querySelector("ul.rj-search-category-dropdown ");
      } else {
        var dropdown = document.querySelector("input[role='searchbox']").closest("form");
      }
      dropdown.prepend(searchDiv);

      dropdown.addEventListener("mouseover", function (ev) {
        const item = ev.target;
        const relatedElement = ev.relatedTarget;
        if ((item.getAttribute('data-category-value') == null || item.getAttribute('data-category-value') !== 'mods') && !searchDiv.contains(relatedElement)) {
          searchDiv.style.display = 'none';
        } else {
          searchDiv.style.display = 'block';
        }
      });

      searchTranslations.addEventListener("change", function () {
        DefineSearch('translation', searchTranslations.value);
      });
      searchEndorsements.addEventListener("change", function () {
        DefineSearch('endorsements', searchEndorsements.value);
      });
      searchDownloads.addEventListener("change", function () {
        DefineSearch('downloads', searchDownloads.value);
      });
      searchSize.addEventListener("change", function () {
        DefineSearch('size', searchSize.value);
      });
      searchType.addEventListener("change", function () {
        DefineSearch('onlyTranslation', searchType.value);
      });

      const ActUrl = new URL(SITE_URL);
      const translations_only = ActUrl.searchParams.get("translations_only");
      const range_dlds = ActUrl.searchParams.get("range_downloads");
      const language = ActUrl.searchParams.get("language");
      const range_endorsements = ActUrl.searchParams.get("range_endorsements");
      const range_size = ActUrl.searchParams.get("range_size");

      if (translations_only) {
        searchType.value = translations_only;
      }
      if (range_dlds) {
        searchDownloads.value = range_dlds;
      }
      if (language) {
        searchTranslations.value = language;
      }
      if (range_endorsements) {
        searchEndorsements.value = range_endorsements;
      }
      if (range_size) {
        searchSize.value = range_size;
      }

      DefineSearch('size', searchSize.value);
      DefineSearch('downloads', searchDownloads.value);
      DefineSearch('endorsements', searchEndorsements.value);
      DefineSearch('translation', searchTranslations.value);
      DefineSearch('onlyTranslation', searchType.value);
    }

    if (SITE_URL.indexOf("/search/") != -1 && document.querySelector("input#search_filename")) {
      document.querySelector("input.rj-search-input").value = document.querySelector("input#search_filename").value;
    }
  }
}

function DefineSearch(item, value) {
  const form = document.querySelector("form.rj-search");
  const url = new URL(form.action);

  switch (item) {
    case 'onlyTranslation':
      if (value != 0) {
        url.searchParams.set('translations_only', '1');
      } else {
        url.searchParams.delete('translations_only');
      }
      break;

    case 'translation':
      if (value != 0) {
        url.searchParams.set('language', value);
      } else {
        url.searchParams.delete('language');
      }
      break;
    case 'endorsements':
      if (value != 0) {
        url.searchParams.set('range_endorsements', value);
      } else {
        url.searchParams.delete('range_endorsements');
      }
      break;
    case 'downloads':
      if (value != 0) {
        url.searchParams.set('range_downloads', value);
      } else {
        url.searchParams.delete('range_downloads');
      }
      break;
    case 'size':
      if (value != 0) {
        url.searchParams.set('range_size', value);
      } else {
        url.searchParams.delete('range_size');
      }
      break;
  }

  form.action = url.toString();
}

async function HideModsByList() {
  chrome.runtime.sendMessage({
    action: 'Load_HiddenMods'
  }, async function (response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
    } else {
      if (response && response.success) {
        HIDDEN_MODS = response.data;
        await PROCESS_HIDDEN_LIST();
      } else {
        console.error("Error in response:", response.error);
      }
    }
  });
  async function PROCESS_HIDDEN_LIST() {
    try {
      if (Object.entries(HIDDEN_MODS).length > 0) {
        for (const parent in HIDDEN_MODS) {
          //if (SITE_URL.includes(parent)) {}
          const HIDDEN_ITENS = HIDDEN_MODS[parent];
          for (const modID in HIDDEN_ITENS) {
            if (HIDDEN_ITENS.hasOwnProperty(modID)) {
              const mod = HIDDEN_ITENS[modID];
              if (mod.mod_name) {
                let mod_element_base = document.querySelector("div[data-mod-id='" + mod.mod_id + "']");
                if (mod_element_base) {
                  mod_element = mod_element_base.closest("li.mod-tile") || mod_element_base.closest("li.image-tile");
                  if (mod_element) {
                    console.log("Removendo Mod Oculto");
                    mod_element.remove();
                  } else {
                    console.log("Não foi encontrado o elemento de ", mod);
                  }
                }
              }
            }
          }

        }
      } else {
        return;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
async function HideMyMods() {
  if (options['HideHiddenMods'] == true && (SITE_URL.indexOf('/users/myaccount?tab=my+files') != -1 || SITE_URL.indexOf('/users/myaccount?tab=other+files') != -1)) {
    const files = document.querySelectorAll("li.mod-tile");
    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        let mod = files[i];
        mod.classList.add("hidderable_mod");
        let hiddenInput = mod.querySelector("input[id^='file-manage-hidden-']");
        if (hiddenInput && hiddenInput.checked == true) {
          mod.classList.toggle("hiddenModTile");
        }
      }

      if (!document.querySelector("a#showHideButton")) {
        let showButton = document.createElement("a");
        showButton.id = 'showHideButton';
        showButton.style.display = 'inline-flex';
        showButton.classList = "btn inline-flex";
        showButton.innerText = translate_strings.HideMods_button.message;
        showButton.style.backgroundColor = 'steelblue';
        let hideStatus = false;
        showButton.addEventListener('click', function (ezClap) {

          const hiddenTiles = Array.from(document.querySelectorAll("li.hidderable_mod"));
          for (let i = 0; i < hiddenTiles.length; i++) {
            let modHide = hiddenTiles[i];
            modHide.classList.toggle("hiddenModTile");
          }

          if (hideStatus == false) {
            showButton.innerText = translate_strings.HideMods_button.description;
            hideStatus = true;
          } else {
            showButton.innerText = translate_strings.HideMods_button.message;
            hideStatus = false;
          }
        });

        document.querySelector("div.account-add-new").prepend(showButton);
      }
    }
  }
}

async function NotificationManager() {
  const notificationItem = document.querySelector("div.rj-notifications") || document.querySelector("button[aria-label='Show notifications']")
  if (options['AllNotifications'] == true && SITE_URL.indexOf("popup=true") == -1 && notificationItem) {
    if (!document.querySelector("div#BetterNotification")) {
      notification_Element = document.createElement("div");
      notification_Element.id = "BetterNotification";
      notification_Element.innerHTML = '<i class="fa-solid fa-bell" aria-hidden="true"></i> 0' + translate_strings.Notification.message;
      notification_Element.addEventListener("click", function () {

        openCenteredPopup("https://next.nexusmods.com/notifications/all?status=unread", "...", 600, 900)
      })
      notificationItem.appendChild(notification_Element);
    } else {
      chrome.runtime.sendMessage({
        action: 'SYNC_NOTIFICATIONCOUNT',
        forceUpdate: false
      }, function (response) {
        count = response.message;
        if (count > 0) {
          notification_Element.innerHTML = '<i class="fa-solid fa-bell" aria-hidden="true"></i> ' + count + translate_strings.Notification.message;
          notification_Element.style.display = 'flex';
        } else {
          notification_Element.style.display = 'none'
        }
      });
    }
  }
}
async function YoutubeEnlarger() {
  if (options['largerYoutubeVideos'] == true) {
    const videos = document.querySelectorAll("div.youtube_container iframe:not([Enlarged])");
    for (let i = 0; i < videos.length; i++) {
      let video = videos[i];
      video.setAttribute("allowfullscreen", true);
      video.setAttribute("loading", 'lazy');
      let container = video.closest("div.youtube_container");
      container.style.width = '100%';
      container.style.height = "600px";
      video.src = video.src + "?autoplay=0";
      video.setAttribute("Enlarged", true);
    }
  }
}

async function OriginalImageSetup() {
  if (options['OriginalImages'] === true) {
    // Seleciona todos os elementos de imagem
    const a_links = Array.from(document.querySelectorAll("li[VISIBLE] a.mod-image figure img.fore:not([FULL_IMAGE])"));
    const li_links = Array.from(document.querySelectorAll("li.thumb figure img:not([FULL_IMAGE])"));
    const mod_images = Array.from(document.querySelectorAll("li.image-tile[VISIBLE] a.mod-image div.fore_div img:not([FULL_IMAGE])"));
    const mod_trackingImages = Array.from(document.querySelectorAll("td.tracking-mod img:not([FULL_IMAGE])"));
    // Combina todos os arrays de links em um único array
    const combinedLinks = a_links.concat(li_links, mod_images, mod_trackingImages);

    for (let i = 0; i < combinedLinks.length; i++) {
      const img = combinedLinks[i];
      if (img.src) {
        img.setAttribute("FULL_IMAGE", true);
        // Usando um timeout ajustado para cada imagem
        setTimeout(() => {
          img.src = img.src.replace("/thumbnails", "");
        }, i * 300);
      }
    }
  }
}
async function VideoPopupSetup() {
  if (options['showVideosPopup'] == true && current_page != "only_mod_page") {
    var videos = Array.from(document.querySelectorAll('li.video-tile a.mod-image:not([POPUP_SETUP])'));

    for (let index = 0; index < videos.length; index++) {
      let video = videos[index];
      video.setAttribute("POPUP_SETUP", true);

      video.addEventListener('mouseenter', function (ev) {
        zoomLevel = 1.0;
        imgPopup.style.display = 'none';
        imgPopup.src = "";
        imgPopup.style.transform = "scale(" + zoomLevel + ")";
      });
      video.addEventListener('click', async function (ev) {
        ev.preventDefault();
        video = ev.target.closest('li.video-tile a.mod-image');
        VIDEO_ID = await extrairID(video.href);
        elementView = ev.target.closest("li.video-tile");
        console.log("Video ID: " + VIDEO_ID)
        try {
          if (!options['showVideosPopup']) {
            return;
          }
          let videoHref = video.href;
          let videoId = videoHref.match(/\d+$/);
          if (videoId) {
            zoomLevel = 1.0;
            imgPopup.style.display = 'none';
            imgPopup.src = "";
            imgPopup.style.transform = "scale(" + zoomLevel + ")";
            PAGE_VIEW.CREATE_ITEM.CREATE_MOD_DESCRIPTION(gameId, videoId[0], 'videos');
          } else {
            console.log("ID não encontrado.");
          }
        } catch (E) {

          console.error("NexusMods Advance Error:" + E);
        }
      });
    }
  }
}

async function ImagePopupSetup() {
  if (options['showImagesPopup'] == true && document.body) {
    if (!document.querySelector("img#imgPopupView")) {
      imgPopup = document.createElement("img");
      imgPopup.id = 'imgPopupView';
      imgPopup.style.display = 'none';
      document.body.appendChild(imgPopup);
    }
    imgPopup.addEventListener('mouseout', function (ev) {
      zoomLevel = 1.0;
      imgPopup.style.display = 'none';
      imgPopup.style.transform = "scale(" + zoomLevel + ")";
    });
    imgPopup.addEventListener('click', function (ev) {
      zoomLevel = 1.0;
      imgPopup.style.display = 'none';
      imgPopup.style.transform = "scale(" + zoomLevel + ")";
    });
    var images = Array.from(document.querySelectorAll('li:not(.video-tile) a.mod-image:not([POPUP_SETUP])')).filter(function (link) {
      const foreDiv = link.querySelector('div.fore, div.fore_div');
      return foreDiv && foreDiv.querySelector('img');
    });

    if (SITE_URL.indexOf("next.nexusmods.com/") != -1) {
      const nextData = Array.from(document.querySelectorAll("div.swiper-wrapper button:not([POPUP_SETUP])"));
      images = images.concat(nextData);
    }
    images.forEach(function (img, index) {
      if (img.closest("li")) {
        var img_li = img.closest('li').querySelector('a.mod-image');
        img_li.setAttribute("POPUP_SETUP", true);
        img.setAttribute("POPUP_SETUP", true);
      }
      const img_button = img;
      if (img_li) {
        img_li.addEventListener('mouseenter', async function (ev) {
          try {
            if (!options['showImagesPopup']) {
              return;
            }
            const img_id = await extrairID(img_li.href) || null;
            if (ev.currentTarget.querySelector('div.fore_div') && ev.currentTarget.querySelector('div.fore_div img').src) {
              imgPopup.src = ev.currentTarget.querySelector('div.fore_div img').src.replace("/thumbnails", "");
            } else if (ev.currentTarget.querySelector('div.fore')) {
              imgPopup.src = ev.currentTarget.querySelector('div.fore img').src.replace("/thumbnails", "");
            }
            imgPopup.setAttribute("image_id", img_id);
            if (FIRST_IMAGE_POPUP) {
              CreateNotificationContainer(translate_strings.ImagePopup.description, "success");
              FIRST_IMAGE_POPUP = false;
            }
            clearInterval(funcLoop);
            lastImg = document.elementFromPoint(ev.clientX, ev.clientY).nodeName;
            funcLoop = setInterval(PopUpImage_Check, 200);
            imgPopup.style.display = 'block';
          } catch (E) {
            console.error("NexusMods Advance Error:" + E);
          }
        });

        img_li.addEventListener('mouseleave', function (ev) {
          if (!img_li.closest("li").contains(ev.relatedTarget) && ev.relatedTarget !== imgPopup && !imgPopup.contains(ev.relatedTarget)) {
            zoomLevel = 1.0;
            imgPopup.src = "";
            imgPopup.style.display = 'none';
            imgPopup.style.transform = "scale(" + zoomLevel + ")";
          }
        });
      } else if (img_button) {
        img_button.addEventListener('mouseenter', function (ev) {
          try {
            if (!options['showImagesPopup']) {
              return;
            }
            imgPopup.src = ev.target.closest("button").querySelector('img').src.replace("/t/small", "");
            clearInterval(funcLoop);
            lastImg = document.elementFromPoint(ev.clientX, ev.clientY).nodeName;
            funcLoop = setInterval(PopUpImage_Check, 200);
            imgPopup.style.display = 'block'; // Mostrar imagem após ajustes
          } catch (E) {
            console.error("NexusMods Advance Error:" + E);
          }
        }, true);

        img_button.addEventListener('mouseleave', function (ev) {
          if (!img_button.contains(ev.relatedTarget) && ev.relatedTarget !== imgPopup && !imgPopup.contains(ev.relatedTarget)) {
            zoomLevel = 1.0;
            imgPopup.src = "";
            imgPopup.style.display = 'none';
            imgPopup.style.transform = "scale(" + zoomLevel + ")";
          }
        });
      }
    })
  }
}
function PopUpImage_Check() {
  if (currentImg == "IMG") {
    lastImg = 'IMG';
  }
  if (currentImg != lastImg) {
    lastImg = null;
    currentImg = null;
    zoomLevel = 1.0;
    imgPopup.src = "";
    imgPopup.style.display = 'none';
    imgPopup.style.transform = "scale(" + zoomLevel + ")";
    clearInterval(funcLoop);
  }
}

async function CHECK_YOUTUBEIFRAMES() {
  if (options['BlockYoutube'] === true) {
    await YOUTUBE_IFRAME_LOADER();

    // Selecione todos os iframes na página
    const frames = document.querySelectorAll('iframe');

    // Filtra os iframes que contêm 'youtube.com' na URL e têm o parâmetro unlock=1
    const youtubeIframes = Array.from(frames).filter(frame => {
      try {
        const url = new URL(frame.src, window.location.href); // Cria um objeto URL com a URL do iframe
        return url.hostname.includes('youtube.com') && url.searchParams.has('unlock');
      } catch (e) {
        console.error('Erro ao processar URL do iframe:', e);
        return false;
      }
    });

    // Se houver iframes do YouTube que atendem aos critérios
    if (youtubeIframes.length > 0) {
      chrome.runtime.sendMessage({ action: 'UnlockYoutube' }, response => {
        if (response && response.success) {
          console.log(response.message);
          YOUTUBE_STATUS = response.YOUTUBE_STATUS;

          youtubeIframes.forEach(videoItem => {
            try {
              const url_video = new URL(videoItem.src, window.location.href);
              url_video.searchParams.delete('unlock');
              videoItem.src = url_video.toString(); // Atualiza a URL do iframe
            } catch (e) {
              console.error('Erro ao atualizar URL do iframe:', e);
            }
          });
        }
      });
    }
  }
}

async function YOUTUBE_IFRAME_LOADER() {
  if (options['BlockYoutube'] === true) {
    const isVisible = (elem) => {
      const rect = elem.getBoundingClientRect();
      const buffer = 80; // Margem adicional para considerar como "quase visível"

      return (
        rect.top + rect.height > -buffer &&
        rect.bottom - rect.height < window.innerHeight + buffer &&
        rect.left + rect.width > -buffer &&
        rect.right - rect.width < window.innerWidth + buffer
      );
    };

    const iframes = Array.from(document.querySelectorAll('iframe:not([LOADED])'));

    for (const iframeContainer of iframes) {
      if (iframeContainer.src.includes('youtube.com')) {
        const frameParent = iframeContainer.closest("div");

        if (frameParent && isVisible(frameParent)) {
          try {
            const url = new URL(iframeContainer.src);
            iframeContainer.src = ''; // Limpa o src para enviar a solicitação de desbloqueio

            const response = await new Promise((resolve, reject) => {
              chrome.runtime.sendMessage({ action: 'UnlockYoutube' }, (response) => {
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError));
                } else {
                  resolve(response);
                }
              });
            });

            if (response && response.success) {
              console.log(response.message);
              YOUTUBE_STATUS = response.YOUTUBE_STATUS;

              iframeContainer.src = url.toString();
              iframeContainer.setAttribute("LOADED", true);
              frameParent.setAttribute("LOADED", true);
            }
          } catch (error) {
            console.error('Erro ao processar o iframe:', error);
          }
        }
      }
    }
  }
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
  if (ev.ctrlKey == true && imgPopup && imgPopup.style.display != 'none') {
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

    if (imgPopup && imgPopup.style.display != 'none') {
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

const TAB_POSTS_OBSERVER = async () => {
  if (bodyObserver) {
    bodyObserver.disconnect();
  }
  bodyObserver = new MutationObserver(async (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const newTargetNode = document.querySelector('div#comment-container');
        if (newTargetNode && newTargetNode !== currentTargetNode) {
          console.log("DOCUMENTO PRONTO");
          await MOD_VIEW.STICKY_POSTS();
          await MOD_VIEW.CREATE_POSTS_BUTTONS();
          await PAUSE_GIFS();
          currentTargetNode = newTargetNode;
        }
      }
    }
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });

  currentTargetNode = document.querySelector('div#comment-container');

};
async function LoadLoop() {
  try {
    const preloader = document.querySelector("div.mfp-preloader");
    if ((document.querySelector("div.loading") || document.querySelector("div.nexus-ui-blocker")) || preloader && window.getComputedStyle(preloader).display !== 'none') {
      clearTimeout(loop);
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
      loop = setTimeout(async function () {
        SITE_URL = window.location.href;
        console.log("Re Loading...");
        NEED_UPDATE = true;
        max_pages = 0;
        PAGINA_ATUAL = 0;
        lastDescriptionID = 0;

        zoomLevel = 1.0
        if (imgPopup) {
          imgPopup.style.display = 'none';
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
      }, 100);
    };
    requestAnimationFrame(LoadLoop);
  } catch (e) {
    console.error("NexusMods Advance Error:" + e);
  }
}
async function IgnoreRequeriments() {
  const requerimentsPopUp = document.querySelector("div.widget-mod-requirements, div.popup-download");
  if (requerimentsPopUp) {
    console.log("Ignorando Requerimentos")
    const rightPremiumPanel = document.querySelector("div.popup-download div.download-right-panel");
    if (rightPremiumPanel) {
      const testButton = document.createElement("a");
      testButton.classList = "btn inline-flex";
      testButton.style.display = 'flex';
      testButton.style.marginTop = '20px'
      testButton.innerText = translate_strings.cdnTest_inlineButton.message;
      testButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          action: 'PopupConfig',
          type: 'cdn_test'
        }, function (response) {
          if (response && response.success) {
            testButton.style.display = 'none';
          }
        });
      })
      rightPremiumPanel.appendChild(testButton);
    }
    if (options['FastDownloadModManager'] == true) {
      Ignore_Requirements_maxTry = 90;
      const downloadButton = requerimentsPopUp.querySelector("a.btn");
      if (downloadButton.getAttribute("onclick") == "download_file();") {
        downloadButton.click();
        requerimentsPopUp.querySelector("button.mfp-close").click();
      }
      const DownloadDetectButton = downloadButton.href;
      if (DownloadDetectButton.indexOf("nmm=1") != -1) {
        window.location.href = DownloadDetectButton;
        requerimentsPopUp.querySelector("button.mfp-close").click();
      }
      else if (DownloadDetectButton.indexOf("tab=files&file_id=") != -1) {
        window.location.href = DownloadDetectButton;
        requerimentsPopUp.querySelector("button.mfp-close").click();
      }
    }

  } else {
    if (Ignore_Requirements_maxTry > 0) {
      Ignore_Requirements_maxTry--;
      requestAnimationFrame(IgnoreRequeriments);
    } else {
      Ignore_Requirements_maxTry = 90;
    }
  }

}

function ClickCallback(ev) {
  if (options['Prevent_TrackOnDownload'] == false) {
    MOD_VIEW.TRACK_MOD(ev);
  }
  ev.currentTarget.removeEventListener('click', ClickCallback);
  requestAnimationFrame(IgnoreRequeriments);
}

function errorCallback(ev) {
  CreateNotificationContainer(translate_strings.TrackMod_Error.message, 'error', 'fa-solid fa-triangle-exclamation', 8000)
  ev.currentTarget.removeEventListener('click', errorCallback);

}

async function EXEC_ONCE(key, fn, delay) {
  if (timeoutMap[key]) {
    clearTimeout(timeoutMap[key]);
  }
  timeoutMap[key] = setTimeout(() => {
    fn();
    delete timeoutMap[key];
  }, delay);
}

const MOD_VIEW = {
  SELECTED_TAB: async () => {
    try {
      if (document.querySelector("ul.modtabs li a.selected") && last_modTab != document.querySelector("ul.modtabs li a.selected").closest("li").id.replace("mod-page-tab-", "")) {
        current_modTab = document.querySelector("ul.modtabs li a.selected").closest("li").id.replace("mod-page-tab-", "");
        last_modTab = current_modTab;
        console.log("TAB: " + current_modTab);
      }
    } catch (e) {
      console.error("NexusMods Advance Error:" + E);
    }
  },
  FAST_DOWNLOAD: async () => {
    if ((SITE_URL.indexOf("&nmm=1") != -1 || SITE_URL.indexOf("tab=files&file_id=") != -1) && (document.querySelector("button#slowDownloadButton") || document.querySelector("button#startDownloadButton")) && options['FastDownloadModManager'] == true) {
      const button_url = document.querySelector("button#slowDownloadButton,button#startDownloadButton").getAttribute("data-download-url");
      if (button_url.indexOf("#ERROR-download") == -1) {
        window.open(button_url);
        window.history.go(-1);
        setTimeout(() => { window.close(); }, 1000);
      } else {
        document.querySelector("button#slowDownloadButton,button#startDownloadButton").click();
        setTimeout(function () {
          const FILELINK = document.querySelector("div.donation-wrapper a").href || null;
          if (FILELINK) {
            window.history.go(-1);
            setTimeout(() => { window.close(); }, 1000);
          }
        }, 2000);

      }
    }
  },
  CREATE_POSTS_BUTTONS: async () => {
    try {
      if (options['SharePostsLinks'] === true && current_modTab === "posts") {
        const comments = document.querySelectorAll("div#comment-container-wrapper ol li.comment:not([BUTTONS_SET])");
        const urlFix = new URL(SITE_URL);
        const params = new URLSearchParams(urlFix.search);

        // Determine a página atual
        const pages = Array.from(document.querySelectorAll("div.pagination ul li"));
        const selectedPage = pages.find(li => li.querySelector('a.page-selected'));
        page_atual = selectedPage ? Number(selectedPage.innerText.trim()) - 1 : 0;

        // Atualize o parâmetro da página, se necessário
        if (params.get('page') && !pageAct) {
          clearTimeout(timerLoop);
          timerLoop = setTimeout(() => {
            pageAct = Number(params.get('page')) + 1;
            console.log("Página atual: " + pageAct);

            const pageButton = pages.find(li => li.textContent.trim() === pageAct.toString());
            if (pageButton) {
              pageButton.querySelector("a").click();
            }

            params.set('page', pageAct);
            const newUrl = `${urlFix.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
          }, 2000);
        }

        // Role para um comentário específico, se necessário
        const jumpToCommentId = params.get('jump_to_comment');
        if (jumpToCommentId) {
          const commentElement = document.querySelector(`li#comment-${jumpToCommentId}`);
          if (commentElement) {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            setTimeout(() => commentElement.classList.add('blink-once'), 500);
          }
        }

        // Crie o botão de compartilhamento
        const shareUrl = `${urlFix.origin + urlFix.pathname}?tab=posts&jump_to_comment=`;
        if (!hiddenInput) {
          hiddenInput = document.createElement("input");
          hiddenInput.id = "hiddenInput_CopyData";
          document.body.prepend(hiddenInput);
        }

        comments.forEach(post => {
          const postId = post.id.replace("comment-", "");
          const postButtons = post.querySelector("div.comment-actions ul.actions");

          if (postButtons) {
            const tempUrl = `${shareUrl}${postId}&page=${page_atual}`;
            const li = document.createElement("li");
            li.setAttribute("url", tempUrl);
            li.className = "nexusAdvance_PostLI";

            const div = document.createElement("div");
            const copy_i = document.createElement("i");
            const copy_span = document.createElement("span");

            copy_i.className = 'fa-solid fa-copy';
            copy_i.setAttribute("aria-hidden", true);
            copy_span.id = 'copySpan_PostLI';
            copy_span.textContent = translate_strings.FastCopy_Comment.message;

            div.appendChild(copy_i);
            div.appendChild(copy_span);

            div.addEventListener("mouseenter", () => {
              copy_span.style.display = 'block';
            });

            div.addEventListener("mouseleave", () => {
              copy_span.style.display = 'none';
            });

            li.appendChild(div);
            postButtons.prepend(li);

            li.addEventListener("click", (ev) => {
              const li_data = li.getAttribute("url");
              hiddenInput.value = li_data;
              hiddenInput.style.left = `${ev.clientX + 20}px`;
              hiddenInput.style.top = `${ev.clientY + 20}px`;
              hiddenInput.style.display = 'block';
              hiddenInput.select();
              hiddenInput.setSelectionRange(0, 99999);

              navigator.clipboard.writeText(hiddenInput.value).then(() => {
                hiddenInput.style.display = 'none';
                li.querySelector("i").style.opacity = "0.5"
                copy_span.innerText = translate_strings.FastCopy_Comment.description;
              }).catch(() => {
                hiddenInput.style.display = 'block';
              });
            });

            post.setAttribute("BUTTONS_SET", true);
          }
        });
      }
    } catch (e) {
      console.log("Erro ao criar botões de postagem:");
      console.error(e);
      console.error("NexusMods Advance Error:" + E);
    }
  },
  STICKY_POSTS: async () => {
    try {
      if (options['HideStickyPosts'] === true && current_modTab === "posts") {
        const stickys = document.querySelectorAll("li.comment-sticky");

        stickys.forEach(post => {
          const commentContent = post.querySelector("div.comment-content");
          const isVisible = commentContent.style.display === 'block';

          if (isVisible || commentContent.style.display !== 'none') {
            const collapseButton = post.querySelector("a.comment-collapse");
            if (collapseButton) {
              collapseButton.click();
            }
          }
        });
      }
    } catch (e) {
      console.error("Erro ao processar posts fixos:", e);
      console.error("NexusMods Advance Error:" + E);
    }
  },
  PROFILE_ONMOUSE: async () => {
    try {

      if (options['ProfileOnMouse'] == true) {
        const profileAndUserUrls_mainContent = Array.from(document.querySelectorAll("div#mainContent a:not([PROFILE_ONMOUSE])")).filter(function (link) {
          return /\/(profile|users)\//.test(link.href) && !/about-me/.test(link.href) && !/myaccount/.test(link.href);
        });
        const profileAndUserUrls_endorsePopup = Array.from(document.querySelectorAll("div#mod-endorsers-popup a:not([PROFILE_ONMOUSE])")).filter(function (link) {
          return /\/(profile|users)\//.test(link.href) && !/about-me/.test(link.href) && !/myaccount/.test(link.href);
        });
        const profileAndUserUrls = profileAndUserUrls_mainContent.concat(profileAndUserUrls_endorsePopup);
        let profileTimeout;
        for (let i = 0; i < profileAndUserUrls.length; i++) {
          const link = profileAndUserUrls[i];

          link.setAttribute("PROFILE_ONMOUSE", true);
          if (link.href.indexOf("?tab=") != -1 || !link.href) {
            return;
          }
          if (!link.innerText && link.querySelector('img')) {
            const TempName = link.querySelector('img').getAttribute("title") || link.querySelector('img').getAttribute("alt");
            link.href = "https://next.nexusmods.com/profile/" + TempName + "/about-me"
          } else {

            link.href = "https://next.nexusmods.com/profile/" + link.innerText + "/about-me";
          }
          link.setAttribute("target", '_blank')
          link.addEventListener("mouseenter", function (ev) {
            if (options['ProfileOnMouse'] == true && lastDescriptionID != ev.target.href) {
              clearTimeout(profileTimeout);
              profileTimeout = setTimeout(function () {
                lastDescriptionID = ev.target.href;
                openPopupAtMousePosition(ev.target.href + "?popup=true", 'Popup', 600, 900, ev);
              }, 600);
            }
          });

          link.addEventListener("mouseleave", function (ev) {
            lastDescriptionID = 0;
            clearTimeout(profileTimeout);
          });
        };
      }
    } catch (e) {
      console.error("NexusMods Advance Error:" + E);
    }
  },
  DESCRIPTION_ONMOUSE: async () => {
    if (options['DescriptionOnMouse'] === true) {
      const currentModId = await extrairID(SITE_URL);
      const links = Array.from(document.querySelectorAll("a:not([DESCRIPTION_CLICK])")).filter(link =>
        /\/mods\/\d+/.test(link.href.replace(/#$/, ''))
      );

      let descriptionTimeout;

      for (const link of links) {
        link.addEventListener("mouseenter", async (ev) => {
          const linkModId = await extrairID(link.href.replace(/#$/, ''));
          if (options['DescriptionOnMouse'] === true && lastDescriptionID !== linkModId && linkModId !== currentModId && link.href.indexOf("/mods/" + pageID) == -1) {
            clearTimeout(descriptionTimeout);
            descriptionTimeout = setTimeout(async () => {
              lastDescriptionID = linkModId;
              temp_gameID = findIdByNexusmodsUrl(link.href);
              if (temp_gameID && linkModId) {
                console.log(`Carregando MOD ID ${linkModId} do jogo ${temp_gameID}`);
                PAGE_VIEW.CREATE_ITEM.CREATE_MOD_DESCRIPTION(temp_gameID, linkModId, 'descricao');
              }
            }, 600);
          }
        });

        link.addEventListener("mouseleave", () => {
          lastDescriptionID = 0;
          clearTimeout(descriptionTimeout);
        });

        link.setAttribute("DESCRIPTION_CLICK", true);
      }
    }
  },
  ARTICLES_ONMOUSE: async () => {
    if (options['ArticlesOnMouse'] == true) {

      const currentModId = await extrairID(SITE_URL);
      const filteredUrls = Array.from(document.querySelectorAll("a:not([ARTICLE_CLICK])")).filter(function (link) {
        return /\/articles\/\d+/.test(link.href.replace(/#$/, ''));
      });
      let articleTimeout
      filteredUrls.forEach(function (link) {
        link.addEventListener("mouseenter", async function (ev) {
          const linkModId = await extrairID(link.href.replace(/#$/, ''));
          if (options['ArticlesOnMouse'] === true && lastDescriptionID !== linkModId && linkModId !== currentModId) {

            clearTimeout(articleTimeout);
            articleTimeout = setTimeout(function () {
              lastDescriptionID = linkModId;
              temp_gameID = findIdByNexusmodsUrl(link.href);
              console.log("Carregando MOD ID " + linkModId + " do jogo " + temp_gameID);

              //openPopupAtMousePosition(link.href+"?popup=true", 'Popup', 900, 500, ev);
              PAGE_VIEW.CREATE_ITEM.CREATE_MOD_DESCRIPTION(temp_gameID, linkModId, 'artigo');
            }, 600);
          }
        });
        link.addEventListener("mouseleave", function (ev) {
          lastDescriptionID = 0;
          clearTimeout(articleTimeout);
        });

        link.setAttribute("ARTICLE_CLICK", true);
      });
    }
  },
  FAST_TRANSLATES: async () => {
    if (options['FastDownloadTranslates'] === true && current_modTab === "description") {
      const translationTables = document.querySelectorAll("table.translation-table");

      if (translationTables.length > 0) {
        const translateElements = Array.from(document.querySelectorAll("table.translation-table td.table-translation-name:not([TRANSLATE_MARK])"));

        for (const link of translateElements) {
          if (link.querySelector("a")) {
            link.style.position = "relative";
            link.setAttribute("TRANSLATE_MARK", true);

            const fromMod = await extrairID(link.querySelector("a").href);
            fastTranslateDownload(fromMod, link);
          }
        }
      }
    }
  }
  ,
  DESCRIPTION_TAB: async () => {
    if (current_modTab == "description") {
      const dts = Array.from(document.querySelectorAll("div.accordionitems dt"));
      const requeriments = dts.filter(dt => dt.textContent.includes("Requirements"))[0];
      const permissions = dts.filter(dt => dt.textContent.includes("Permissions and credits"))[0];
      const Translations = dts.filter(dt => dt.textContent.includes("Translations"))[0];
      const Changelogs = dts.filter(dt => dt.textContent.includes("Changelogs"))[0];
      const Donations = dts.filter(dt => dt.textContent.includes("Donations"))[0];
      if (options['HideRequerimentsTab'] == true && requeriments) {
        requeriments.style.display = 'none';

      }
      if (options['HideTranslationsTab'] == true && Translations) {
        Translations.style.display = 'none';

      }
      if (options['HidePermissionsTab'] == true && permissions) {
        permissions.style.display = 'none';

      }
      if (options['HideChangelogsTab'] == true && Changelogs) {
        Changelogs.style.display = 'none';

      }
      if (options['HideDonationsTab'] == true && Donations) {
        Donations.style.display = 'none';

      }
      await MOD_VIEW.PROFILE_ONMOUSE();
      await MOD_VIEW.ARTICLES_ONMOUSE();
      await MOD_VIEW.FAST_TRANSLATES();

    }
  },
  GENERATE_SAVE_BUTTONS: async () => {
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

      console.log(modsLinks.length + " Linhas de Arquivos");

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

        const fileId = getParameterByName("id", fileLink.href) || getParameterByName("file_id", fileLink.href);

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

          newLi.addEventListener("click", (ev) => { MOD_VIEW.TRACK_MOD(ev); });

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
  },
  TRACK_MOD: async (ev) => {
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
  },
  FAST_CHANGELOGS: async () => {
    if (current_modTab === "files" && options['AwaysChangelogs']) {
      const mods = Array.from(document.querySelectorAll("dl.accordion dt div.stat a:not([CHANGELOG_INJECTED])"));

      for (const item of mods) {
        const temp = item.innerText;
        item.setAttribute("CHANGELOG_INJECTED", true);
        const descriptionDiv = item.closest("dt").nextElementSibling.querySelector("div.files-description");
        await MOD_VIEW.LOAD_CHANGELOGS(pageID, descriptionDiv, temp);
      }
    }
  },

  LOAD_CHANGELOGS: async (modID, elemento, version) => {
    await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModChangeLogPopUp?mod_id=" + modID + "&game_id=" + gameId + "&version=" + version, http_headers)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        currentGame = document.querySelector("div.nav-current-game a").href;

        tempDiv = document.createElement("div");
        tempDiv.id = "InjectChangelog"
        tempDiv.innerHTML = doc.body.innerHTML;
        elemento.appendChild(tempDiv);
        return;
      })
      .catch(error => {
        console.error('Erro ao buscar o HTML:', error);
      });
  },
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
        gameMap = new Map(GAMES.map(game => [game.id, game]));
        console.log(GAMES.length + " Games");
      } else {
        console.error("Error in response:", response.error);
      }
    }
  });
}

function fastTranslateDownload(modId, mod_element) {
  tempDiv = document.createElement("div");
  tempDiv.id = "translateTempDiv";
  tempSpan = document.createElement("span");
  tempSpan.id = "spanPopupMsg";
  tempSpan.innerText = translate_strings.fastDownloadTranslate_tip.message;
  tempButton = document.createElement("i");
  tempButton.addEventListener("click", function () {

    PAGE_VIEW.CREATE_ITEM.CREATE_MOD_DESCRIPTION(gameId, modId, 'translateMod');
  });
  tempButton.classList = "fastDownloadButton fa-solid fa-cloud-arrow-down";
  tempButton.setAttribute("aria-hidden", true);
  tempDiv.appendChild(tempButton)
  tempDiv.appendChild(tempSpan)
  mod_element.appendChild(tempDiv);
  mod_element.setAttribute("TRANSLATE_MARK", true);

}

async function extrairID(url) {
  const urlSemParametros = url.split('?')[0];
  const regex = /\/(\d+)(\/|$)/;
  const match = urlSemParametros.match(regex);
  if (url.indexOf("/categories/") != -1) {
    return null;
  }
  return match ? match[1] : null;
}

const PAGE_VIEW = {

  GET_USER_FILTER_TRACKING: async () => {
    const game_idTrack = document.querySelector("select#game_id").value;
    const sortByTrack = document.querySelector("select#sort_by").value;
    TrackingMods_link = "https://www.nexusmods.com/Core/Libs/Common/Widgets/TrackedModsTab?RH_TrackedModsTab=id:0,page_size:20,game_id:" + game_idTrack + ",sort_by:" + sortByTrack + ",page:" + scrollPage;
    current_url = TrackingMods_link;
  },
  GENERATE_INFINITE_SCROLL_TRACKCENTRE: async () => {
    if (scrollPage != -1) {
      scrollPage++;
      if (SITE_URL.indexOf("/mods/trackingcentre") != -1 || SITE_URL.indexOf("/mods/trackingcentre?tab=mods") != -1) {
        current_url = TrackingMods_link;
      } else if (SITE_URL.indexOf("/mods/trackingcentre?tab=authors") != -1) {
        current_url = TrackingAuthors_link;
      } else if (SITE_URL.indexOf("/mods/trackingcentre?tab=comments") != -1) {
        current_url = TrackingComments_link;
      } else {
        console.log("Infinite Scroll não suportado nesta página D:");
        return;
      }

      await PAGE_VIEW.GET_USER_FILTER_TRACKING();

      fetch(current_url, http_headers)
        .then(response => response.text())
        .then(async (html) => {
          const parser = new DOMParser();
          doc3 = parser.parseFromString(html, 'text/html');
          doc3 = doc3.body.querySelector("tbody");

          doc3.id = "injectedContent_" + scrollPage;
          if (doc3.querySelectorAll("tr").length == 0) {
            console.log("Fim dos Mods");
            scrollPage = -1;
            return;
          }

          if (!document.querySelector("body#injectedContent_" + scrollPage)) {
            canScroll = true;
            doc3.querySelectorAll("tr").forEach(function (item) {
              // Verifica se já existe um <tr> com o mesmo ID
              const existingItem = document.querySelector(`tbody tr#${item.id}`);
              if (existingItem) {
                item.remove();
                console.log("Fim dos Mods");
                scrollPage = -1;
                return;
              } else {
                // Adiciona o item ao DOM
                document.querySelector("tbody").appendChild(item);
              }
            });
            console.log("INFINITE SCROLL TRACKCENTRE PAGE " + PAGINA_ATUAL)
            EXEC_ONCE('profileMouse', MOD_VIEW.PROFILE_ONMOUSE, 300);

            setTimeout(OriginalImageSetup, 1000);
          }
        })
        .catch(error => {
          console.error('Erro ao buscar o HTML:', error);
        });
    }
  },
  GET_CURRENT_PAGE: async () => {
    function getSelectedPageNumber(element) {
      const anchor = element.querySelector('a.page-selected');
      return anchor ? parseInt(anchor.innerText.trim(), 10) : null;
    }

    if (PAGINA_ATUAL == 0) {
      const part_1_document = document.body.querySelector("div.pagination");
      if (part_1_document) {
        let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;
        let selectedPageNumber = null;

        // Loop para verificar se há um <a> com a classe "page-selected"
        while (part_1_pages) {
          selectedPageNumber = getSelectedPageNumber(part_1_pages);
          if (selectedPageNumber !== null) {
            console.log("Página Selecionada: " + selectedPageNumber);
            PAGINA_ATUAL = selectedPageNumber + 1;
            return PAGINA_ATUAL;
          }
          // Move para o elemento anterior na lista
          part_1_pages = part_1_pages.previousElementSibling;
        }
      }
    }
  },
  GET_MAXPAGES: async () => {

    await PAGE_VIEW.GET_CURRENT_PAGE();

    function isNumberElement(element) {
      return element.tagName === 'LI' && !isNaN(parseInt(element.innerText.trim(), 10));
    }

    const part_1_document = document.body.querySelector("div.pagination");
    if (part_1_document) {
      let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;

      // Loop para verificar se há um <a> com a classe "page-selected"
      while (part_1_pages) {

        if (isNumberElement(part_1_pages)) {
          max_pages = parseInt(part_1_pages.innerText.trim(), 10);
          console.log("Total de Páginas: " + max_pages);
          break;
        }

        part_1_pages = part_1_pages.previousElementSibling;
      }

    }

    console.log("Página Atual First: " + PAGINA_ATUAL)
  },
  GENERATE_INFINITE_SCROLL_VIDEOS: async () => {
    if (PAGINA_ATUAL == 0) {
      await PAGE_VIEW.GET_MAXPAGES();
    } else {
      PAGINA_ATUAL++;
    }
    if (PAGINA_ATUAL > max_pages) {
      return;
    }
    console.log("Loading Page: " + PAGINA_ATUAL + " From Total: " + max_pages + " Pages")
    if (SITE_URL.indexOf("/videos/recentlyendorsed") != -1) {

      video_Trending = "https://www.nexusmods.com/Core/Libs/Common/Widgets/VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",sort_by:rating,order:DESC,time:14,show_game_filter:false,page_size:16,page:" + PAGINA_ATUAL;
      current_url = video_Trending;
    } else if (SITE_URL.indexOf("/videos/mostendorsed/") != -1) {

      video_Best = "https://www.nexusmods.com/Core/Libs/Common/Widgets/VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",sort_by:rating,order:DESC,show_game_filter:false,page_size:16,page:" + PAGINA_ATUAL;
      current_url = video_Best;
    } else if (SITE_URL.indexOf("/videos/") != -1) {
      videosAll = "https://www.nexusmods.com/Core/Libs/Common/Widgets/VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",show_game_filter:false,page_size:16,page:" + PAGINA_ATUAL;
      current_url = videosAll;
    } else {

      console.log("Infinite Scroll não suportado nesta página D:");
      return;
    }

    fetch(current_url, http_headers)
      .then(response => response.text())
      .then(async (html) => {
        const parser = new DOMParser();
        doc3 = parser.parseFromString(html, 'text/html');
        doc3.body.querySelectorAll("ul.tiles li.image-tile").forEach(function (media) {
          document.querySelector("ul.tiles").appendChild(media);
          media.querySelector("div.tile-desc").style.opacity = '1';
        })
        console.log("INFINITE SCROLL VIDEOS PAGE " + PAGINA_ATUAL)
        setTimeout(OriginalImageSetup, 1000);
        await VideoPopupSetup();
        canScroll = true;
      })
      .catch(error => {
        console.error('Erro ao buscar o HTML:', error);
      });

  },
  GET_MEDIA_FILTERS: async (type) => {
    try {
      let attributes = [];
      let game_id = null;
      if (type == "ImageList") {
        game_id = document.querySelector("select#game_id").value;
      } else {
        game_id = gameId
      }
      const time = document.querySelector("select#time").value;
      const order = document.querySelector("select#order").value;
      const sort = document.querySelector("select#sort_by").value;
      if (game_id) {
        images_All = "https://www.nexusmods.com/Core/Libs/Common/Widgets/" + type + "?RH_ImageList=user_id:0,nav:false,game_id:" + game_id + ",show_game_filter:false,show_hidden:false,page_size:20,page:" + PAGINA_ATUAL
        current_url = images_All;
      }
      const checkeds = document.querySelectorAll("div.image-filter-container ul.choice-list li input[checked='checked']");

      if (checkeds.length > 0) {
        attributes.push('category_id:');
      }

      checkeds.forEach(function (item) {
        for (let i = 0; i < attributes.length; i++) {
          if (attributes[i].startsWith('category_id:')) {
            attributes[i] += item.value + "|";
          }
        }
      });
      if (attributes.length > 0) {
        attributes[0] = attributes[0].slice(0, -1);
      }
      if (time) {
        attributes.push("time:" + time);
      }
      if (order) {
        attributes.push("order:" + order);
      }
      if (sort) {
        attributes.push("sort_by:" + sort);
      }

      if (attributes.length > 0) {
        current_url += "," + attributes.join(',');
      }
    } catch (e) {
      console.error(e);
    }
  },
  GENERATE_INFINITE_SCROLL_MEDIA: async () => {
    if (PAGINA_ATUAL == 0) {
      await PAGE_VIEW.GET_MAXPAGES();
    } else {
      PAGINA_ATUAL++;
    }
    if (PAGINA_ATUAL > max_pages) {
      return;
    }
    console.log("Loading Page: " + PAGINA_ATUAL + " From Total: " + max_pages + " Pages")
    if (SITE_URL.indexOf("/media/today") != -1) {
      media_24Hours = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",time:1,nav:false,page_size:20,page:" + PAGINA_ATUAL;
      current_url = media_24Hours;
    } else if (SITE_URL.indexOf("/media/thisweek") != -1) {
      media_thisWeek = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",time:7,nav:false,page_size:20,page:" + PAGINA_ATUAL;
      current_url = media_thisWeek;
    } else if (SITE_URL.indexOf("/media/popular/") != -1) {

      media_30Days = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",time:30,nav:false,page_size:20,page:" + PAGINA_ATUAL;
      current_url = media_30Days;
    } else if (SITE_URL.indexOf("/media/popularalltime/") != -1) {

      media_AllTime = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",sort_by:views,order:DESC,nav:false,page_size:20,page:" + PAGINA_ATUAL;
      current_url = media_AllTime;
    } else if (SITE_URL.indexOf("/media/") != -1) {
      media_AllPages = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",order:DESC,nav:false,page_size:20,page:" + PAGINA_ATUAL;
      current_url = media_AllPages;
    } else if (SITE_URL.indexOf("/images/") != -1) {
      images_All = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ImageList?RH_ImageList=user_id:0,nav:false,game_id:" + gameId + ",time:0,show_hidden:false,page_size:16,page:" + PAGINA_ATUAL;
      current_url = images_All;
      await PAGE_VIEW.GET_MEDIA_FILTERS("ImageList");
    } else if (SITE_URL.indexOf("/supporterimages/") != -1) {
      images_All = "https://www.nexusmods.com/Core/Libs/Common/Widgets/SupporterImageList?RH_ImageList=user_id:0,nav:false,game_id:" + gameId + ",time:0,show_hidden:false,page_size:16,page:" + PAGINA_ATUAL;
      current_url = images_All;
      await PAGE_VIEW.GET_MEDIA_FILTERS("SupporterImageList");
    } else {

      console.log("Infinite Scroll não suportado nesta página D:");
      return;
    }

    fetch(current_url, http_headers)
      .then(response => response.text())
      .then(async (html) => {
        const parser = new DOMParser();
        doc3 = parser.parseFromString(html, 'text/html');
        doc3.body.querySelectorAll("ul li.image-tile").forEach(function (media) {
          tileMain = document.querySelector("ul.media-tiles") || document.querySelector("ul.tiles");
          tileMain.appendChild(media);
          media.querySelector("div.tile-desc").style.opacity = '1';
        });
        doc3.body.querySelectorAll("div#image-list ul li.image-tile").forEach(function (media) {
          tileMain = document.querySelector("ul.media-tiles") || document.querySelector("ul.tiles");
          tileMain.appendChild(media);
          media.querySelector("div.tile-desc").style.opacity = '1';
        });
        console.log("INFINITE SCROLL MEDIA PAGE " + PAGINA_ATUAL)
        EXEC_ONCE('imagePopSetup', ImagePopupSetup, 300);
        EXEC_ONCE('videoPopSetup', VideoPopupSetup, 300);

        EXEC_ONCE('createModButtons', GET_VISIBLE_BLOCKS, 300);
        canScroll = true;
      })
      .catch(error => {
        console.error('Erro ao buscar o HTML:', error);
      });

  },
  GET_USER_FILTER: async () => {
    const lista1 = Array.from(document.querySelectorAll("ul.choice-list")[0].querySelectorAll("li input")).filter(v => v.checked);
    const lista2 = Array.from(document.querySelectorAll("ul.choice-list")[1].querySelectorAll("li input"));
    const lista3 = Array.from(document.querySelectorAll("ul.choice-list")[1].querySelectorAll("li input"));
    lista3.splice(0, 4);
    const descriptionSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#search_description").value;
    const authorSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#search_author").value;
    const uploaderSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#search_uploader").value;
    const languageSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right select#language").value;
    const translationsSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#translations_only").checked;

    let attributes = [];

    if (translationsSearch == true) {
      attributes.push('translations_only:1');
    }

    attributes.push('language:' + languageSearch);
    attributes.push('search_uploader:' + uploaderSearch);
    attributes.push('search_author:' + authorSearch);
    attributes.push('search_description:' + descriptionSearch);

    lista1.forEach(index => {
      const indVal = encodeURIComponent(index.value.toString());
      const indCat = encodeURIComponent(index.getAttribute("name"));

      if (indVal && indCat) {
        attributes.push(`${indCat}:${indVal}`);
      } else {
        console.log("Valor ou categoria ausente");
      }
    });

    lista2.forEach(index => {
      switch (index.id) {
        case 'has_images':
          if (index.checked) {
            attributes.push('has_images:1');
          }

          break;
        case 'include_adult':

          attributes.push('include_adult:' + index.checked);

          break;
        case 'only_adult':
          if (index.checked) {
            attributes.push('only_adult:1');
          }
          break;
      }
    });
    lista3.forEach(index => {
      if (index.checked) {
        indVale = encodeURIComponent(index.value.toString() + "_true");
      } else {
        indVale = encodeURIComponent(index.value.toString() + "_false");
      }
      const indCate = encodeURIComponent(index.getAttribute("name"));
      if (indVale && indCate) {
        attributes.push(`${indCate}:${indVale}`);
      } else {
        console.log("Valor ou categoria ausente");
      }
    });

    if (SITE_URL.indexOf("/search") != -1) {
      searchItem = document.querySelector("ul.search-terms li").innerText.split(":");
      if (searchItem[1].charAt(0) === ' ') {
        searchItem[1] = searchItem[1].trimStart()
      }
      searchItem = "search[" + searchItem[0] + "]:" + searchItem[1];
      attributes.push(searchItem);

    }
    attributes.push(`page:${(PAGINA_ATUAL)}`);
    if (attributes.length > 0) {
      current_url += "," + attributes.join(',');
    }

  },
  GENERATE_INFINITE_SCROLL: async () => {
    if (PAGINA_ATUAL == 0) {
      await PAGE_VIEW.GET_MAXPAGES();
    } else {
      PAGINA_ATUAL++;
    }
    if (PAGINA_ATUAL > max_pages) {
      return;
    }
    console.log("Loading Page: " + PAGINA_ATUAL + " From Total: " + max_pages + " Pages")

    if (SITE_URL.indexOf("/mods/today") != -1) {
      current_url = last24Hours;
    } else if (SITE_URL.indexOf("/mods/thisweek") != -1) {
      current_url = lastWeek;
    } else if (SITE_URL.indexOf("/mods/popular/") != -1) {

      current_url = last30Days;
    } else if (SITE_URL.indexOf("/mods/moretrending") != -1 || SITE_URL.indexOf("/mods/trending") != -1) {

      current_url = moreTrending;
    } else if (SITE_URL.indexOf("/mods/updated/") != -1) {
      current_url = recentUpdated;
    } else if (SITE_URL.indexOf("/mods/popularalltime") != -1) {

      current_url = popularAllTime;
    } else if (SITE_URL.indexOf("/search") != -1) {

      current_url = searchLink;
    } else {

      console.log("Infinite Scroll não suportado nesta página D:");
      return;
    }
    await PAGE_VIEW.GET_USER_FILTER();

    fetch(current_url, http_headers)
      .then(response => response.text())
      .then(async (html) => {
        const parser = new DOMParser();
        doc3 = parser.parseFromString(html, 'text/html');

        doc3 = doc3.body.querySelector("div#mod-list");
        if (doc3.querySelectorAll('div.file-category-header div')) {
          const elementsToRemove = doc3.querySelectorAll('div.file-category-header div');
          elementsToRemove.forEach(element => element.remove());
        }
        doc3.id = "injectedContent_" + PAGINA_ATUAL;

        doc3 = doc3.querySelectorAll("li.mod-tile");
        if (!document.querySelector("body#injectedContent_" + PAGINA_ATUAL)) {

          canScroll = true;
          doc3.forEach(function (item) {
            document.querySelector("ul.tiles").appendChild(item);
          });

          console.log("INFINITE SCROLL PAGE " + PAGINA_ATUAL);
          EXEC_ONCE('hideMods', HideModsByList, 300);
          EXEC_ONCE('profileMouse', MOD_VIEW.PROFILE_ONMOUSE, 300);
          EXEC_ONCE('createModButtons', GET_VISIBLE_BLOCKS, 300);
          // EXEC_ONCE('removeTips', REMOVE_MOD_STATUSVIEW, 300);
          //EXEC_ONCE('loadDetails', PAGE_VIEW.LOAD_MOD_DETAILS, 300);

        }
      })
      .catch(error => {
        console.error('Erro ao buscar o HTML:', error);
      });

  },
  LOAD_MOD_DETAILS: async () => {
    if (options['BetterModBlocks'] == false) {
      return;
    }

    const modsToProcess = Array.from(document.querySelectorAll("li[VISIBLE] div[data-mod-id]:not([DETAILS_SET])"));
    const batchSize = 10;  // Definimos o tamanho do lote para processar 10 por vez

    const processBatch = async (batch) => {
      for (const mod_tile of batch) {
        const dataModId = parseInt(mod_tile.getAttribute("data-mod-id"));
        const mod3 = GAME_DATA.find(mod => mod.modId === dataModId);

        if (mod_tile.querySelector("div.tile-data li.downloadcount span") && mod3 && mod_tile.querySelector("div.tile-data li.downloadcount span").innerText == "--") {
          mod_tile.querySelector("div.tile-data li.downloadcount span").innerText = formatNumber(mod3.totalDownloads);
        }

        if (mod3 && mod_tile.querySelector("div.tile-data:not([VIEW_RENDER])")) {
          const modView_span = document.createElement("li");
          modView_span.classList = "downloadcount inline-flex";
          modView_span.innerHTML = '<i class="fa-solid fa-eye" aria-hidden="true" style="margin-left:2px;margin-right:2px;align-self: flex-start;"></i> ' + formatNumber(mod3.totalViews);
          mod_tile.querySelector("div.tile-data:not([VIEW_RENDER]) ul").appendChild(modView_span);
          mod_tile.querySelector("div.tile-data:not([VIEW_RENDER]) ul").style.display = 'flex';
          mod_tile.querySelector("div.tile-data").style.padding = '5px';
          mod_tile.querySelector("div.tile-data").setAttribute("VIEW_RENDER", true);
        }

        mod_tile.setAttribute("DETAILS_SET", true);
      }
    };

    // Se os dados do jogo ainda não foram carregados, faça a requisição e processe os mods.
    if (GAME_DATA.length === 0) {
      const response = await fetch("https://staticstats.nexusmods.com/live_download_counts/mods/" + gameId + ".csv", {
        "referrer": "",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
      });

      const html = await response.text();
      GAME_DATA = html.trim().split('\n').map(line => {
        const [modId, value1, value2, value3] = line.split(',');
        return {
          modId: parseInt(modId),
          totalDownloads: parseInt(value1),
          uniqueDownloads: parseInt(value2),
          totalViews: parseInt(value3)
        };
      });
    }

    // Processar em lotes de 10
    for (let i = 0; i < modsToProcess.length; i += batchSize) {
      const batch = modsToProcess.slice(i, i + batchSize);
      await processBatch(batch);  // Pausa entre cada lote de 10 para não sobrecarregar
    }
  },
  CREATE_ITEM: {
    CREATE_MOD_DESCRIPTION: async (gameID, modId, tipo) => {
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
      await MoveLoop(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y, modPopup_element)
      await PAGE_VIEW.CREATE_ITEM.FETCH_MOD_DESCRIPTION(gameID, modId, tipo);

    },
    FETCH_MOD_TAGS: async (gameID, modId) => {
      //document.querySelectorAll("div.popup-mod-tagging li.tag:not(.neutral)");

      const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModTaggingPopUp?mod_id=" + modId + "&game_id=" + gameID, http_headers);
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
    ,
    FETCH_MOD_DESCRIPTION: async (gameID, modId, tipo = "descricao") => {
      console.log("Carregando Informações do Tipo:" + tipo);
      modPopup_element.querySelector("div#descriptionContent").innerHTML = "";
      modPopup_element.querySelector("div#descriptionContent").classList.add("modPreview_Rotating");
      const url = tipo === 'descricao' ?
        `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModDescriptionTab?id=${modId}&game_id=${gameID}` :
        tipo === 'translateMod' ?
          `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModFilesTab?id=${modId}&game_id=${gameID}` :
          tipo === 'videos' ?
            `https://www.nexusmods.com/${fingGameNameByID(gameID)}/videos/${modId}` :
            `https://www.nexusmods.com/${fingGameNameByID(gameID)}/articles/${modId}`;

      try {
        const response = await fetch(url, http_headers);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const selectors = [
          'li.report-abuse-btn',
          'a.button-share',
          'div.manage-mod',
          'ul.actions',
          'div#comment-container'
        ];
        if (tipo == "descricao") {
          PAGE_VIEW.CREATE_ITEM.FETCH_MOD_TAGS(gameID, modId);
        }
        if (tipo == 'videos') {
          doc.body.innerHTML = doc.body.querySelector("div.video-contain iframe").outerHTML;
          doc.body.querySelector("iframe").setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
          doc.body.querySelector("iframe").setAttribute("frameborder", "0");
          doc.body.querySelector("iframe").src += "?autoplay=1&unlock=1"

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
                fingGameNameByID(gameID) + "/mods/" + modId + "?tab=files&file_id="
              );
              //PREMIUM POP
              //https://www.nexusmods.com/Core/Libs/Common/Widgets/DownloadPopUp?id=385848&nmm=1&game_id=1704
              item.href = item.href.replaceAll(
                "Core/Libs/Common/Widgets/DownloadPopUp?id=",
                fingGameNameByID(gameID) + "/mods/" + modId + "?tab=files&file_id="
              );

            });
          });

          if (doc.querySelectorAll("div.accordionitems dt").length <= 1) {
            window.open(doc.querySelector("div.accordionitems ul.accordion-downloads a").href);
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
        modPopup_element.querySelector("div#descriptionContent").classList.remove("modPreview_Rotating");
        if (tipo != 'videos') {

          modPopup_element.querySelector("div#descriptionContent").innerHTML = doc.body.innerHTML;
          if (modPopup_element.querySelector("div#descriptionContent").querySelector("button.unblur-desc-btn")) {
            modPopup_element.querySelector("div#descriptionContent").querySelector("button.unblur-desc-btn").addEventListener("click", (ev) => {
              modPopup_element.querySelector("div#descriptionContent").querySelector("div.blur-description").classList.remove("blur-description");
              modPopup_element.querySelector("div#descriptionContent").querySelector("div.mod_adult_warning_wrapper").remove();
            });
          }
        } else {
          modPopup_element.querySelector("div#descriptionContent").innerHTML = doc.body.outerHTML;

        }
        await PAUSE_GIFS();
        await YoutubeEnlarger();

      } catch (error) {
        console.error('Erro ao buscar o HTML:', error);
      }
    },
    CREATE_MOD_IMAGES: async (modId, gameIDx) => {
      if (modPopup_element) {
        modPopup_element.style.display = "none";
      }
      if (modFiles_element) {
        modFiles_element.style.display = "none";
      }
      if (modPreview_element) {
        document.querySelector("div#modPreview div").innerText = "Loading Gallery...";
        document.querySelector("div#modPreview div").style.display = "block";
        modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
        modPreview_element.style.display = 'flex';
        clearTimeout(messageLoop);
        messageLoop = setTimeout(function () {
          document.querySelector("div#modPreview div").style.display = "none";
        }, 6000);
      } else {
        modPreview_element = document.createElement("div");
        modPreview_element.id = "modPreview";
        modPreview_element.style.display = "none";
        divClose = document.createElement("i");
        divClose.classList = "fa-solid fa-circle-xmark";
        divClose.setAttribute("aria-hidden", true);
        divClose.id = "closePopButton";
        divClose.addEventListener("click", function (ev) {
          STILL_LOADING = false;
          ev.target.closest("div#modPreview").style.display = 'none';
        });
        divTxt = document.createElement("div");
        divTxt.innerText = "Use the Arrow Keys Up and Down to change images, mouse to Move the Popup and ESC to close";
        divTxt.innerText = translate_strings.ImagePopup.message;
        divTxt.id = "divDesc";
        divDesc = document.createElement("div");
        divDesc.innerText = "Loading Images... (ESC to cancel)";
        divDesc.id = "divDescription";
        divImage = document.createElement("div");
        divImage.id = 'ImageView';
        modPreview_element.appendChild(divTxt);
        modPreview_element.appendChild(divDesc);
        modPreview_element.appendChild(divClose);
        modPreview_element.appendChild(divImage);

        modPreview_element.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
        document.body.appendChild(modPreview_element);
        document.querySelector("div#modPreview div").innerText = "Loading Gallery...";
        document.querySelector("div#modPreview div").style.display = "block";
        modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
        clearTimeout(messageLoop);
        messageLoop = setTimeout(function () {
          document.querySelector("div#modPreview div").style.display = "none";
        }, 6000);

      }
      needMove = true;
      await MoveLoop(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y, modPreview_element);
      console.log("Carregando MOD " + modId + " do game " + gameIDx)
      STILL_LOADING = true;
      GALLERY_STARTED = false;
      curPage = 0;
      await PAGE_VIEW.CREATE_ITEM.GET_MOD_IMAGES_COUNT(modId, gameIDx)

    },
    GET_MOD_IMAGES_COUNT: async (modId, game_idx) => {
      try {
        const response = await fetch(`https://www.nexusmods.com/Core/Libs/Common/Widgets/ModImagesTab?id=${modId}&game_id=${game_idx}&user_is_blocked=`, http_headers);

        if (response.ok) {
          const htmlString = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, 'text/html');
          PAGE_VIEW.CREATE_ITEM.LOAD_OTHER_IMAGEPAGES(doc.body, modId, game_idx);
        } else {
          console.error(`Erro na requisição: Status ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
      }
    },
    FETCH_MOD_IMAGES: async (modId, page, tab, game_idx) => {
      if (!STILL_LOADING) {
        return null;
      }
      const tabParam = tab === '2page' ? 'RH_ModImagesList2' : 'RH_ModImagesList1';
      const groupId = tab === '2page' ? 2 : 1;

      // Constrói a URL de acordo com 'tab' e 'groupId'
      const fetchUrl = `https://www.nexusmods.com/Core/Libs/Common/Widgets/ModImagesList?${tabParam}=game_id:${game_idx},id:${modId},page_size:24,${tab}:${page},rh_group_id:${groupId}`;

      try {
        const response = await fetch(fetchUrl, http_headers);

        if (response.ok) { // Verifica se o status HTTP está no intervalo 200-299
          const htmlString = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, 'text/html');
          const resultElements = doc.querySelectorAll('a.mod-image');

          return Array.from(resultElements).map(img => {
            let ImgObject = {
              imageUrl: '',
              description: ''
            };
            const tileNameElement = img.querySelector('div.tile-desc p.tile-name');
            ImgObject.description = tileNameElement ? tileNameElement.innerText.trim() : '';

            ImgObject.imageUrl = img.querySelector('img[id^="mod-image-"]').src || '';
            ImgObject.imageUrl = ImgObject.imageUrl.replace('/thumbnails', '');
            return ImgObject;
          });
        } else {
          console.error(`Erro na requisição: Status ${response.status} ${response.statusText}`);
          // Aqui você pode tratar erros ou retornar um valor padrão se o status não for 200
          return null;
        }
      } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        // Aqui você pode tratar exceções ou erros de rede
        return null;
      }
    },

    LOAD_OTHER_IMAGEPAGES: async (element_Parse, modId, GameIDX) => {

      // Função auxiliar para verificar se o elemento é um número
      function isNumberElement(element) {
        return element.tagName === 'LI' && !isNaN(parseInt(element.innerText.trim(), 10));
      }

      // Primeira paginação
      const firstPageSelect = element_Parse.querySelector("div.pagination select[id='1page_t']");
      if (firstPageSelect) {
        const part_1_document = firstPageSelect.closest("div.pagination");
        let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;

        while (part_1_pages && !isNumberElement(part_1_pages)) {
          part_1_pages = part_1_pages.previousElementSibling;
        }

        maxPages1 = part_1_pages ? parseInt(part_1_pages.innerText.trim(), 10) : 1;
        console.log("Primeira Paginação: " + maxPages1);
      }

      // Segunda paginação
      const secondPageSelect = element_Parse.querySelector("div.pagination select[id='2page_t']");
      if (secondPageSelect) {
        const part_2_document = secondPageSelect.closest("div.pagination");
        let part_2_pages = part_2_document.querySelector('ul.clearfix').lastElementChild;

        while (part_2_pages && !isNumberElement(part_2_pages)) {
          part_2_pages = part_2_pages.previousElementSibling;
        }

        maxPages2 = part_2_pages ? parseInt(part_2_pages.innerText.trim(), 10) : 1;
        console.log("Segunda Paginação: " + maxPages2);
      }

      GALLERY = [];
      // Carrega as imagens da primeira paginação
      for (let curPage = 1; curPage <= maxPages1; curPage++) {
        const images = await PAGE_VIEW.CREATE_ITEM.FETCH_MOD_IMAGES(modId, curPage, '1page', GameIDX);
        if (images == null || images.some(img => !img.imageUrl)) {
          console.log("Cancelando o loop: Encontrado `imageUrl` vazio.");
          STILL_LOADING = true;
          break; // Encerra o loop se encontrar um `imageUrl` vazio
        }

        GALLERY.push(...images);

        // Chama SHOW_MOD_IMAGES assim que GALLERY tiver algum resultado
        if (!GALLERY_STARTED && GALLERY.length > 0) {
          await PAGE_VIEW.CREATE_ITEM.SHOW_MOD_IMAGES();
          GALLERY_STARTED = true;
        }
      }

      // Carrega as imagens da segunda paginação
      for (let curPage = 1; curPage <= maxPages2; curPage++) {

        const images = await PAGE_VIEW.CREATE_ITEM.FETCH_MOD_IMAGES(modId, curPage, '2page', GameIDX);
        if (images == null || images.some(img => !img.imageUrl)) {
          console.log("Cancelando o loop: Encontrado `imageUrl` vazio.");
          STILL_LOADING = true;
          break; // Encerra o loop se encontrar um `imageUrl` vazio
        }
        GALLERY.push(...images);

      }

    },

    SHOW_MOD_IMAGES: async () => {

      currentImageIndex = 0;
      modPreview_element.querySelector("div#ImageView").classList.remove("modPreview_Rotating");
      modPreview_element.querySelector("div#ImageView").style.backgroundImage = "url(" + GALLERY[0].imageUrl + ")";
      modPreview_element.querySelector("div#divDescription").innerText = GALLERY[0].description;
      modPreview_element.style.display = "flex";
      document.querySelector("div#modPreview div").style.display = "block";
      document.querySelector("div#modPreview div").innerText = "Use as Setas do Teclado ou A/D para navegar entre as imagens, ESC para fechar o PopUp e Ctrl+S para salvar a imagem atual";
      divTxt.innerText = translate_strings.ImagePopup.message;
      clearTimeout(messageLoop);
      messageLoop = setTimeout(function () {
        document.querySelector("div#modPreview div").style.display = "none";
      }, 6000);
    },
  },
  HIDE_CONTENT_BYWORD: async (fastHide = false) => {
    let PAGE_CONTENT;
    if (fastHide == true) {
      PAGE_CONTENT = Array.from(document.querySelectorAll("li div[data-mod-id]:not([HIDDEN_SETUP]), li.image-tile:not([HIDDEN_SETUP])"));
    } else {
      PAGE_CONTENT = Array.from(document.querySelectorAll("li[VISIBLE] div[data-mod-id]:not([HIDDEN_SETUP]), li.image-tile[VISIBLE]:not([HIDDEN_SETUP])"));
    }
    PAGE_CONTENT.forEach(function (divItem) {
      let type;
      let author;
      let category;
      let description;
      if (divItem.classList.contains("mod-tile-left") || divItem.classList.contains("mod-tile") || (divItem.nodeName.toLocaleLowerCase() == "li" && divItem.querySelector("div[data-mod-id]"))) {
        type = "MOD";
      } else {
        type = "IMAGE";
      }
      divItem.setAttribute("HIDDEN_SETUP", true);
      const MAIN = divItem.closest("li").querySelector("figure");
      if (divItem.style.display != 'none' && MAIN && !MAIN.classList.contains("blur-image-sm")) {

        const title = divItem.querySelector('div.tile-desc p.tile-name') ? divItem.querySelector('div.tile-desc p.tile-name').innerText.trim().toLowerCase() : "";

        if (type == "MOD") {
          category = divItem.querySelector('div.tile-desc div.category') || divItem.querySelector('div.tile-desc ul li');
          category = category ? category.innerText.trim().toLowerCase() : "";
          author = divItem.querySelector('div.tile-desc div.author a') || divItem.querySelectorAll('div.tile-desc ul li')[1];
          author = author ? author.innerText.replace("By ", "").trim().toLowerCase() : "";
        } else {
          author = divItem.querySelector('div.tile-desc div.author').innerText.trim().toLowerCase();
        }

        const containsWord = WORD_LIST.some(word =>
          (author && author.includes(word)) ||
          (category && category.includes(word)) ||
          (title && title.includes(word))
        );
        if (containsWord && MAIN) {
          MAIN.classList.add("blur-image-sm");
        }
      }
    });
  },
  LOAD_HIDDEN_WORDS: async (fastHide = false) => {
    if (options['hideContentWords'] == true) {
      chrome.runtime.sendMessage({
        action: 'Load_WordList',
      }, async function (response) {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
        } else {
          if (response.success == false) {
            console.log("No Banned Words YET!");
            return;
          }
          if (response && response.success) {
            WORD_LIST = response.message[0].split("#-#").map(word => word.toLowerCase());
            if (WORD_LIST.length > 0 && !WORD_LIST[0] == "") {
              PAGE_VIEW.HIDE_CONTENT_BYWORD(fastHide);
            }
          } else {
            console.error("Error in response:", response.error);
          }
        }
      });

    }
  },
  CREATE_MODS_BUTTONS: async () => {

    const mods_list = document.querySelectorAll("li:not([id])[class~='mod-tile'][VISIBLE]:not([BUTTONS_SET]), li:not([id])[class~='image-tile'] > div[data-mod-id]:not(.qs_result)[VISIBLE]:not([BUTTONS_SET])");

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
            PAGE_VIEW.CREATE_ITEM.CREATE_MOD_IMAGES(mode.getAttribute("data-mod-id"), mode.getAttribute("data-game-id"), ev.clientX, ev.clientY);
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

        fastDescription.addEventListener("click", function (ev) {
          const mode = ev.target.closest("li").querySelector("div.mod-tile-left");
          if (mode.getAttribute("data-mod-id")) {
            PAGE_VIEW.CREATE_ITEM.CREATE_MOD_DESCRIPTION(mode.getAttribute("data-game-id"), mode.getAttribute("data-mod-id"), 'descricao');
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
  },
  MOD_ID_FROMURL: async (url) => {
    const urlSemParametros = url.split('?')[0];
    const regex = /\/(\d+)(\/|$)/;
    const match = urlSemParametros.match(regex);
    return match ? match[1] : null;
  },
  ON_MOD_PAGES: async (url) => {
    const modPagePatterns = [
      "/mods/updated",
      "/mods/trending",
      "/search",
      "/mods/popular",
      "/mods/moretrending",
      "/mods/today",
      "/mods/thisweek",
      "/media/",
      "/videos/",
      "/images/"
    ];
    if (modPagePatterns.some(pattern => url.includes(pattern))) {
      return "mod_pages_all";
    }
    if (document.querySelector("div#game-trending-mods")) {
      return "home_page";
    }
    return "only_mod_page";
  },
  MOD_POPUP: {
    POPUP_IMAGES: async (imageUrls, direction) => {
      if (imageUrls.length > 0) {
        if (direction == 1) {
          if (imageUrls[currentImageIndex + 1]) {
            currentImageIndex++;
          } else {
            currentImageIndex = 0;
          }

        } else {
          if (imageUrls[currentImageIndex - 1]) {
            currentImageIndex--;
          } else {
            currentImageIndex = imageUrls.length - 1;
          }

        }
        if (imageUrls[currentImageIndex]) {
          modPreview_element.querySelector("div#ImageView").classList.add("modPreview_Rotating");
          const currentIndex = currentImageIndex + 1; // Adiciona 1 para exibir como 1-based index
          document.querySelector("div#modPreview div").innerText = `Loading Image... [${currentIndex}/${imageUrls.length}]`;

          document.querySelector("div#modPreview div").style.display = "block";
          clearTimeout(messageLoop);

          const img = new Image();
          img.onload = function () {
            modPreview_element.querySelector("div#ImageView").style.backgroundImage = `url(${imageUrls[currentImageIndex].imageUrl})`;
            modPreview_element.querySelector("div#ImageView").classList.remove("modPreview_Rotating");
            messageLoop = setTimeout(function () {
              document.querySelector("div#modPreview div").style.display = "none";
            }, 200);
          };

          modPreview_element.querySelector("div#divDescription").innerText = imageUrls[currentImageIndex].description;
          img.src = imageUrls[currentImageIndex].imageUrl;

        }
      }
    },
    POPUP_DESCRIPTION: async () => {

    },
    POPUP_FILES: async () => {

    },
  }
}

async function loadMessages(locale) {

  GET_GAMES();
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
  }, function (response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
    } else {
      if (response && response.success) {
        translate_strings = response.message;
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
        await loadMessages(options['language']);

      } else {
        console.error("Error in response:", response.error);
        window.location.reload();
      }
    }
  });
}
INIT();
document.addEventListener("DOMContentLoaded", async () => { await NEXUS_TWEAKS(); });
window.addEventListener("load", async () => { NEED_UPDATE = true; await NEXUS_TWEAKS(); });
setTimeout(INIT, 2000);

function openCenteredPopup(url, title, width, height) {
  // Calcula a posição para centralizar a janela
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  var left = (screenWidth - width) / 2;
  var top = (screenHeight - height) / 2;

  // Define as opções da janela
  var options = `width=${width},height=${height},top=${top},left=${left}`;
  window.open(url, title, options);
}

function openPopupAtMousePosition(url, title, width, height, event) {

  // Obtém as coordenadas do mouse
  var mouseX = event.clientX;
  var mouseY = event.clientY;

  var left = mouseX + 10; // Desloca 10 pixels para a direita
  var top = mouseY + 10; // Desloca 10 pixels para baixo

  // Define as opções da janela
  var options_pop = `width=${width},height=${height},top=${top},left=${left}`;
  tempWindow = window.open(url, title, options_pop);
}

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

    if (imgPopup && imgPopup.style.display != 'none') {
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

function startDragging(e) {
  const offsetX1 = e.clientX - e.target.getBoundingClientRect().left;
  const offsetY1 = e.clientY - e.target.getBoundingClientRect().top;
  const isOnRightEdge = offsetX1 > e.target.clientWidth - 20;
  const isOnBottomEdge = offsetY1 > e.target.clientHeight - 20;
  if (!isOnRightEdge && !isOnBottomEdge) {
    isDragging = true;
    offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
    offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);
  }
}

function drag(e) {

  if (isDragging) {
    if (modPopup_element) {
      modPopup_element.style.left = (e.clientX - offsetX) + 'px';
      modPopup_element.style.top = (e.clientY - offsetY) + 'px';
    }
    if (modPreview_element) {
      modPreview_element.style.left = (e.clientX - offsetX) + 'px';
      modPreview_element.style.top = (e.clientY - offsetY) + 'px';
    }
    if (modFiles_element) {
      modFiles_element.style.left = (e.clientX - offsetX) + 'px';
      modFiles_element.style.top = (e.clientY - offsetY) + 'px';
    }
  }
}

function stopDragging() {
  isDragging = false;
}

function isTextField(element) {
  const tagName = element.tagName.toLowerCase();
  const isInputOrTextarea = tagName === 'input' && (element.type === 'text' || element.type === 'password' || element.type === 'email' || element.type === 'number' || element.type === 'search' || element.type === 'tel' || element.type === 'url') || tagName === 'textarea';
  const isContentEditable = element.isContentEditable;
  return isInputOrTextarea || isContentEditable;
}

document.addEventListener("keydown", async function (key) {

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
      PAGE_VIEW.MOD_POPUP.POPUP_IMAGES(GALLERY, 0);
    }
    if ((key.key == "ArrowDown" || key.key == "ArrowRight" || key.key == "d" && key.ctrlKey == false) && !isTextField(key.target) && modPreview_element.style.display == 'flex') {
      key.preventDefault();
      PAGE_VIEW.MOD_POPUP.POPUP_IMAGES(GALLERY, 1);
    }
    if (modPreview_element && key.key == 's' && key.ctrlKey == true && modPreview_element.style.display != 'none' && GALLERY && GALLERY.length > 0) {
      key.preventDefault();
      window.open(GALLERY[currentImageIndex].imageUrl);

    }
  }
  if (imgPopup && key.key == 's' && key.ctrlKey == true && imgPopup.style.display != 'none') {
    key.preventDefault();
    window.open(imgPopup.src);
  }

  if (imgPopup && key.key == '1' && imgPopup.style.display != 'none') {
    await EndorseImageByPopup(imgPopup.getAttribute("image_id"));
  }
  else if (modPopup_element && key.key == '1' && modPopup_element.style.display != 'none') {

    await EndorseVideoByPopup(VIDEO_ID, elementView);
  }
});
async function EndorseVideoByPopup(video_id, element) {
  if (SITE_URL.indexOf("/supporterimages/") == -1) {
    support = 0;
  } else {
    support = 1;
  }
  if (video_id == null || video_id == 'null') {
    return;
  }
  const li_element = element.querySelector("a[href*='" + video_id + "']").closest("li").querySelector("svg.icon-endorse");
  if (li_element) {
    console.log("Endorsando vídeo " + video_id + " do jogo " + gameId + " Supporter: " + support);
    fetch("https://www.nexusmods.com/Core/Libs/Common/Managers/Videos?EndorseVideo", {
      "headers": {
        "accept": "*/*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Brave\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://www.nexusmods.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "game_id=" + gameId + "&video_id=" + video_id + "&is_supporter=" + support,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
      .then(response => {
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          CreateNotificationContainer("NexusMods Error: " + response.status, 'error')
          CreateNotificationContainer("Error: " + response.statusText, 'error')
          throw new Error('Erro na requisição: ' + response.statusText);
        }
        // Converte a resposta em JSON
        return response.json();
      })
      .then(data => {
        if (data.errors == '') {
          if (data.is_endorsed == 1) {
            CreateNotificationContainer(translate_strings.EndorsePopup_done.message, 'success', 'fa-solid fa-thumbs-up')
            li_element.style.fill = "#02cd21";
          }
          else if (data.is_endorsed == 0) {
            CreateNotificationContainer(translate_strings.EndorsePopup_undone.message, 'warning', 'fa-regular fa-thumbs-up')
            li_element.style.fill = "#8e8e8e";
          }
          li_element.closest("li.endorsecount").querySelector("span").textContent = data.endorsements
        } else {
          CreateNotificationContainer(data.errors, 'error')
        }
      })
      .catch(error => {
        // Trata possíveis erros
        CreateNotificationContainer("Endorse Error: " + error, 'error')
        console.error('Erro ao processar a requisição:', error);
      });

  } else {

    CreateNotificationContainer(translate_strings.EndorsePopup_cant.message, 'warning', 'fa-regular fa-thumbs-up')
  }
}

async function EndorseImageByPopup(PopUpimage_id) {
  if (SITE_URL.indexOf("/supporterimages/") == -1) {
    support = 0;
  } else {
    support = 1;
  }
  if (PopUpimage_id == null || PopUpimage_id == 'null') {
    return;
  }
  const li_element = document.querySelector("li a[href*='" + PopUpimage_id + "']").closest("li").querySelector("svg.icon-endorse");
  if (li_element) {
    console.log("Endorsando imagem " + PopUpimage_id + " do jogo " + gameId + " Supporter: " + support);
    fetch("https://www.nexusmods.com/Core/Libs/Common/Managers/Images?EndorseImage", {
      "headers": {
        "accept": "*/*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Brave\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://www.nexusmods.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "game_id=" + gameId + "&image_id=" + PopUpimage_id + "&is_supporter=" + support,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
      .then(response => {
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          CreateNotificationContainer("NexusMods Error: " + response.status, 'error')
          CreateNotificationContainer("Error: " + response.statusText, 'error')
          throw new Error('Erro na requisição: ' + response.statusText);
        }
        // Converte a resposta em JSON
        return response.json();
      })
      .then(data => {
        if (data.errors == '') {
          if (data.is_endorsed == 1) {
            CreateNotificationContainer(translate_strings.EndorsePopup_done.message, 'success', 'fa-solid fa-thumbs-up')
            li_element.style.fill = "#02cd21";
          }
          else if (data.is_endorsed == 0) {
            CreateNotificationContainer(translate_strings.EndorsePopup_undone.message, 'warning', 'fa-regular fa-thumbs-up')
            li_element.style.fill = "#8e8e8e";
          }
          li_element.closest("li.endorsecount").querySelector("span").textContent = data.endorsements
        } else {
          CreateNotificationContainer(data.errors, 'error')
        }
      })
      .catch(error => {
        // Trata possíveis erros
        CreateNotificationContainer("Endorse Error: " + error, 'error')
        console.error('Erro ao processar a requisição:', error);
      });

  } else {

    CreateNotificationContainer(translate_strings.EndorsePopup_cant.message, 'warning', 'fa-regular fa-thumbs-up')
  }
}

// Função para ajustar as posições das notificações restantes
function adjustNotificationPositions() {
  const notifications = document.querySelectorAll('.AdvanceNotification');
  notifications.forEach((notification, index) => {
    const offset = index * 60;
    notification.style.top = `${60 + offset}px`;
  });
}

function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
document.addEventListener("scroll", async function (ev) {

  if (canScroll == true && current_page == "mod_pages_all") {
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
        setTimeout(PAGE_VIEW.GENERATE_INFINITE_SCROLL_TRACKCENTRE, 100);
      } else if (SITE_URL.indexOf("media/") != -1 || SITE_URL.indexOf("images/") != -1) {
        PAGE_VIEW.GENERATE_INFINITE_SCROLL_MEDIA();
      } else if (SITE_URL.indexOf("videos/") != -1) {
        PAGE_VIEW.GENERATE_INFINITE_SCROLL_VIDEOS();
      } else {
        PAGE_VIEW.GENERATE_INFINITE_SCROLL();
      }
    }
  }

  clearTimeout(modBlocksTimeout);
  modBlocksTimeout = setTimeout(GET_VISIBLE_BLOCKS, 150);
});

function GET_VISIBLE_BLOCKS() {

  const mods_list = Array.from(document.querySelectorAll("li:not([id])[class~='mod-tile']:not([VISIBLE]), li:not([id])[class~='image-tile'] > div[data-mod-id]:not([VISIBLE]):not(.qs_result)"));
  const images_list = Array.from(document.querySelectorAll("li.image-tile"));
  mods_list_general = mods_list.concat(images_list);

  if (mods_list_general.length === 0) return
  elementsToObserve += mods_list_general.length

  if (!observer) {
    const observerOptions = {
      root: null, // Usa a viewport como root
      rootMargin: '1500px 0px', // Margem de proximidade para disparar o evento
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
        requestIdleCallback(async () => {
          REMOVE_MOD_STATUSVIEW();
          PAGE_VIEW.CREATE_MODS_BUTTONS();
          PAGE_VIEW.LOAD_MOD_DETAILS();
          PAGE_VIEW.LOAD_HIDDEN_WORDS();
          OriginalImageSetup();
        })

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

