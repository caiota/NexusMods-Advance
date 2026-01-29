async function START () {
  try {
    SITE_URL = window.location.href

    LAST_URL = SITE_URL
    if (
      document.readyState == 'complete' ||
      document.querySelector('div#mainContent')
    ) {
      console.log('Iniciando NexusMods Advance')
      await GET_GAME_ID()
      if (!document.querySelector('link#fontAwesome')) {
        let faLink = document.createElement('link')
        faLink.rel = 'stylesheet'
        faLink.id = 'fontAwesome'
        faLink.href =
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
        //faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css'; < OLD VERSION

        document.head.appendChild(faLink)
      }

      requestAnimationFrame(LoadLoop)
      if (
        SITE_URL.indexOf('https://next.nexusmods.com/') != -1 &&
        document.querySelector('div#mainContent main')
      ) {
        if (
          document.querySelector('div#mainContent main').childElementCount == 0
        ) {
          const targetNode = document.querySelector('div#mainContent main')
          const config = {
            childList: true,
            subtree: true,
            attributes: true
          }

          let debounceTimeout // Armazena o temporizador de debounce
          const debounceDelay = 2000 // Tempo em milissegundos para aguardar após a última mudança

          const callback = (mutationsList, observer) => {
            let hasChanges = false // Flag para indicar se houve mudanças

            for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                hasChanges = true
                observer.disconnect()
              }
            }

            // Se houve mudanças, reinicia o debounce
            if (hasChanges) {
              clearTimeout(debounceTimeout) // Reseta o timer se houver novas mudanças

              debounceTimeout = setTimeout(() => {
                console.log('Aplicando tweaks após período de inatividade.')
                NEED_UPDATE = true
                NEXUS_TWEAKS()
              }, debounceDelay)
            }
          }

          const observer = new MutationObserver(callback)
          observer.observe(targetNode, config)
        } else {
          setTimeout(() => {
            NEED_UPDATE = true
            NEXUS_TWEAKS()
          }, 2000)
        }
      }

      //await NEXUS_TWEAKS()
      setInterval(RELOAD_SETTINGS, 500)
      if (SITE_URL.indexOf('/SSOauthorised?application=nmadvance') != -1) {
        console.log('NexusMods SSO Authorized, calling NexusMods Advance!')
        chrome.runtime.sendMessage(
          {
            action: 'PopupConfig',
            type: 'mods'
          },
          function (response) {
            if (response && response.success) {
              window.close()
            }
          }
        )
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
async function GET_GAME_ID () {
  gameID_Number = document.querySelector(
    'div[data-e2eid="desktop-header"] img,div.nav-current-game img'
  )?.src

  if (gameID_Number && gameID_Number.indexOf('/images/games/') != -1) {
    gameID_Number = gameID_Number.split('/v2/')[1].split('/')[0]
  } else {
    gameID_Number =
      document
        .querySelector("section[aria-labelledby='game-header'] img[src]")
        ?.src.split('/v2/')[1]
        .split('/')[0] || 1704
  }
}
async function RELOAD_SETTINGS () {
  chrome.runtime.sendMessage(
    {
      action: 'LoadBox'
    },
    async function (response) {
      if (chrome.runtime.lastError) {
        if (
          chrome.runtime.lastError.message.includes(
            'Extension context invalidated'
          )
        ) {
          console.error(
            'Extension context invalidated detected, reloading page.'
          )
          location.reload()
        } else {
          console.error(
            'Error sending message:',
            chrome.runtime.lastError.message
          )
        }
      } else {
        if (response && response.success) {
          if (!COMPARE_SETTINGS(lastOptions, response.data)) {
            SITE_URL = window.location.href
            options = response.data
            lastOptions = options
            console.log(options)
            NEED_UPDATE = true
            await NEXUS_TWEAKS()
          }
          await LOAD_HIDDEN_WORDS()
        } else {
          console.error('Error in response:', response.error)
        }
      }
    }
  )
}

async function encontrarContainer () {
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
async function MEDIA_WATCHER () {
  const target = await encontrarContainer()

  if (
    target &&
    current_page == 'mod_pages_all' &&
    !target.getAttribute('WATCHING')
  ) {
    // Cria o observer
    const observerContainer = new MutationObserver(async mutationsList => {
      //for (const mutation of mutationsList) {}
      if (WATCHER_BUSY == false) {
        WATCHER_BUSY = true
        console.log('Mudança detectada')
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
    console.log('Observando mudanças', target)
  }
}
async function SEARCH_TAB_WATCHER () {
  const target = document.querySelector(
    "div[aria-label='Search Nexus mods'][role='dialog']"
  )

  if (target && !target.getAttribute('WATCHING')) {
    target.setAttribute('WATCHING', true)
    const observer = new MutationObserver(async mutationsList => {
      for (const mutation of mutationsList) {
        console.log('Mudança detectada')

        GET_VISIBLE_BLOCKS()
      }
    })

    // Configura o que observar
    observer.observe(target, {
      childList: true, // Mudanças na lista de filhos
      subtree: true, // Inclui elementos dentro do target
      attributes: false, // Mudanças nos atributos
      characterData: false // Mudanças no texto
    })
  }
}
var MOD_HIDER_LOOP = null
async function NEXUS_TWEAKS () {
  if (NEED_UPDATE) {
    let inicio = performance.now()
    NEED_UPDATE = false

    console.log('NexusTweaks')
    gameId = new URL(SITE_URL)
    gameId.pathname.split('/')[1]
    gameId = findIdBydomainName()
    if(gameId=="Mods"){
      gameId="site";
    }
    console.warn('Game Name ' + gameId)
    await GET_GAME_ID()
    current_page = await ON_MOD_PAGES(SITE_URL)
    clearInterval(YOUTUBE_LOOP)
    YOUTUBE_LOOP = setInterval(CHECK_YOUTUBEIFRAMES, 500)
    ShortCut_Availability()
    await SCROLL_TO_UPDATE()
    setTimeout(GET_VISIBLE_BLOCKS, 150)
    NOTIFICATION_COUNT_TO_TITLE();
    LOAD_HIDDEN_WORDS(true)
    FloatingMenu()
    YoutubeEnlarger()
    clearInterval(MOD_HIDER_LOOP)
    await HideModsByList()
    MOD_HIDER_LOOP = setInterval(async () => {
      await HideModsByList()
    }, 100)
    await OriginalImageSetup()
    await ImagePopupSetup()
    await VideoPopupSetup()
    await HideMyMods()
    CustomModsBlockSize()
    await EXTERNAL_LINKS_NEWTAB()
    PROFILE_ONMOUSE()
    ARTICLES_ONMOUSE()
   

    console.log('Trabalhando em ' + current_page)
    var NexusImage = document.querySelector("a[data-e2eid='nexus-logo'] img")
    var NexusSvg = document.querySelector('a.headlogo svg')
    switch (current_page) {
      case 'home_page':
        canScroll = false
        if (NexusSvg) {
          NexusSvg.style.visibility = 'hidden'
        }
        if (NexusImage) {
          NexusImage.style.visibility = ''
          document
            .querySelector("a[data-e2eid='nexus-logo']")
            ?.classList.remove('NexusMods_Advance_B64LOGO')
        }
        break
      case 'mod_pages_all':
        canScroll = true
        document
          .querySelector("a[data-e2eid='nexus-logo']")
          ?.setAttribute('title', 'NexusMods Advance extension loaded!')
        if (NexusImage) {
          NexusImage.style.visibility = 'hidden'
          document
            .querySelector("a[data-e2eid='nexus-logo']")
            ?.classList.remove('NexusMods_Advance_B64LOGO')
        }

        document
          .querySelector("a[data-e2eid='nexus-logo']")
          ?.classList.add('NexusMods_Advance_B64LOGO')
        break
      case 'only_mod_page':
        document
          .querySelector('a.headlogo')
          ?.setAttribute('title', 'NexusMods Advance extension loaded!')
        if (NexusSvg) {
          NexusSvg.style.visibility = 'hidden'
        }
        document
          .querySelector('a.headlogo')
          ?.classList.add('NexusMods_Advance_B64LOGO')
        pageID = await extrairID(SITE_URL)
        console.log('MOD_ID: ' + pageID)
        // DESCRIPTION_ONMOUSE();
        if (pageID == null) {
          current_page = 'mod_pages_all'
          canScroll = true
          console.log('Correção de area de atuação para ' + current_page)
          if (SITE_URL.indexOf('trackingcentre') != -1) {
            DESCRIPTION_ONMOUSE()
          }
        } else {
          ITEM_LOAD_EXECUTED=false;
          await SELECTED_TAB()
          TAB_POSTS_OBSERVER()
          setTimeout(DESCRIPTION_TAB, 500)
        await Search_RequiringFileTab()
          DESCRIPTION_ONMOUSE()
          GENERATE_TRACK_BUTTONS()
          await STICKY_POSTS()
          CREATE_POSTS_BUTTONS()
          await PAUSE_GIFS()
          if(FORCE_LOAD_PAGE==0){
          FORCE_LOAD_PAGE=1;
          }
        await PAGINATION_FIX();
        }
        if (SITE_URL.indexOf('popup=true') != -1) {
          document.querySelector('body').style.marginTop = '0'
          document.querySelector('div#mainContent').style.padding = 0
          document.querySelector('div#mainContent').style.margin = 0
          document.querySelector('div#mainContent').style.maxWidth = 'none'
          document.querySelector('footer').style.display = 'none'
          document.querySelector('header#head').style.display = 'none'
          document.querySelector('header#mobile-head').style.display = 'none'
          document.querySelector('div.info-details').style.display = 'none'
          window.addEventListener('keydown', function (k) {
            if (k.key.toLowerCase() == 'escape') {
              window.close()
            }
          })
        }
        break
    }
    if(FORCE_LOAD_PAGE==2){
      PAGINATION_WATCHER();
    }
    await REMAKE_ADDMODS_LIST()
    await STICKY_EDIT_BUTTONS()
    await FIX_ARTICLE_EDIT_LINK()
    await Fix_Youtube_Thumbnails()
    setInterval(SEARCH_TAB_WATCHER, 2000)
    await MEDIA_WATCHER()
    clearInterval(FLOATING_MENU_TIMER)
    FLOATING_MENU_TIMER = setInterval(FLOATING_COMMENT_OPTIONS, 1000)

    setTimeout(GET_VISIBLE_BLOCKS, 150)
    let fim = performance.now()
    let tempoExecucao = parseInt(fim - inicio)
    console.log(`NEXUS_TWEAKS Executado em: ${tempoExecucao} ms`)
  }
}
var LAST_URL = ''
async function LoadLoop () {
  try {
    const preloader = document.querySelector('div.mfp-preloader')
    if (
      document.querySelector('div.loading') ||
      document.querySelector('div.nexus-ui-blocker') ||
      (preloader && window.getComputedStyle(preloader).display !== 'none') ||
      LAST_URL != window.location.href
    ) {
      SITE_URL = window.location.href
      LAST_URL = SITE_URL
      NEED_OVERALLRELOAD = true
      console.log('Loading...')
      if (YOUTUBE_STATUS == 'unlock') {
        chrome.runtime.sendMessage(
          {
            action: 'lockYoutube'
          },
          function (response) {
            if (response && response.success) {
              console.log(response.message)
              YOUTUBE_STATUS = response.YOUTUBE_STATUS
            }
          }
        )
      }
      if (modPreview_element) {
        modPreview_element.style.display = 'none'
      }
      if (modPopup_element) {
        modPopup_element.style.display = 'none'
      }
      if (modFiles_element) {
        modFiles_element.style.display = 'none'
      }

      last_modTab = ''
    } else {
      if (NEED_OVERALLRELOAD == true) {
        NEED_OVERALLRELOAD = false

        SITE_URL = window.location.href
        LAST_URL = SITE_URL
        console.log('Re Loading...')
        ATUAL_PAGE = 1
        canScroll = true
        NEED_UPDATE = true
        hideStatus = false
        lastDescriptionID = 0
        requerimentsCache = null
        zoomLevel = 1.0
        if (imgPopup) {
          imgPopup.classList.add('popup-hidden')
          imgPopup.style.transform = 'scale(' + zoomLevel + ')'
        }
        if (modPreview_element) {
          modPreview_element.style.transform = `scale(${zoomLevel})`
        }
        if (modPopup_element) {
          modPopup_element.style.transform = `scale(${zoomLevel})`
          modPopup_element.style.display = 'none'
          modPopup_element.querySelector('div#descriptionContent').innerHTML =
            ''
        }
        canScroll = true
        clearTimeout(modBlocksTimeout)
        modBlocksTimeout = setTimeout(GET_VISIBLE_BLOCKS, 10)
        NEXUS_TWEAKS()
      }
    }
    requestIdleCallback(LoadLoop)
  } catch (e) {
    console.error('NexusMods Advance Error:' + e)
  }
}

async function loadMessages (locale) {
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

  chrome.runtime.sendMessage(
    {
      action: 'Load_Messages',
      lang: locale
    },
    async function (response) {
      if (chrome.runtime.lastError) {
        console.error(
          'Error sending message:',
          chrome.runtime.lastError.message
        )
      } else {
        if (response && response.success) {
          translate_strings = response.message

          await START()
        } else {
          console.error('Error in response:', response.error)
        }
      }
    }
  )
}
async function INIT () {
  if (STARTED == true) {
    return
  }

  STARTED = true
  console.log('Iniciando...')
  SITE_URL = window.location.href
  chrome.runtime.sendMessage(
    {
      action: 'LoadBox'
    },
    async function (response) {
      if (chrome.runtime.lastError) {
        console.error(
          'Error sending message:',
          chrome.runtime.lastError.message
        )
        window.location.reload()
      } else {
        if (response && response.success) {
          options = response.data
          lastOptions = options
          YOUTUBE_STATUS = 'lock'
          loadMessages(options['language'])
          console.log(options)
        } else {
          console.error('Error in response:', response.error)
          window.location.reload()
        }
      }
    }
  )
}
document.addEventListener('DOMContentLoaded', () => {
  INIT()
  setTimeout(INIT, 2000)
  waitForMainContentStable(() => {
    WIDER_WEBSITE()
    NEED_UPDATE = true
    setTimeout(NEXUS_TWEAKS, 200)
  })
})

function waitForMainContentStable (callback) {
  let lastMainContent = null
  let stableTimer = null

  const observer = new MutationObserver(() => {
    const current =
      document.querySelector(
        "div#mainContent div[class*='relative next-container']"
      ) || document.querySelector('div#mainContent')

    // se o elemento mudou, resetamos o timer
    if (current !== lastMainContent) {
      lastMainContent = current
      clearTimeout(stableTimer)
      stableTimer = setTimeout(() => {
        // observer.disconnect();
        callback()
      }, 300) // tempo sem recriação = estável
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // fallback absoluto (caso nunca estabilize)
  setTimeout(() => {
    // observer.disconnect();
    callback()
  }, 3000)
}

window.addEventListener('load', async () => {
  waitForMainContentStable(() => {
    WIDER_WEBSITE()
  })
  setTimeout(FLOATING_MENU_SHORTCUTS, 1000)
  await FAST_DOWNLOAD()
  await SELECTED_TAB()

  document.addEventListener(
    'wheel',
    async function (ev) {
      await FLOATING_MENU_SHORTCUTS()
      if (ev.ctrlKey) {
        if (
          document.elementFromPoint(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y).id ==
            'ImageView' ||
          document
            .elementFromPoint(GLOBAL_MOUSE_X, GLOBAL_MOUSE_Y)
            .closest('div#modPopup')
        ) {
          ev.preventDefault()
          var delta = Math.max(-1, Math.min(1, ev.deltaY || -ev.detail))
          var zoomAmount = 0.1
          delta = -delta

          zoomLevel += delta * zoomAmount

          zoomLevel = Math.max(0.1, Math.min(2.0, zoomLevel))
          if (modPreview_element) {
            modPreview_element.style.transform = `scale(${zoomLevel})`
          }
          if (modPopup_element) {
            modPopup_element.style.transform = `scale(${zoomLevel})`
          }
        }
      }
      if (
        ev.ctrlKey == true &&
        imgPopup &&
        !imgPopup.classList.contains('popup-hidden')
      ) {
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
    },
    {
      passive: false
    }
  )
})

async function MoveLoop (x, y, moveElement) {
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
let textFieldFocused = false

document.addEventListener('mousemove', function (mouse) {
  try {
    GLOBAL_MOUSE_X = mouse.clientX
    GLOBAL_MOUSE_Y = mouse.clientY
    if (lastImg && document.elementFromPoint(mouse.clientX, mouse.clientY)) {
      currentImg = document.elementFromPoint(
        mouse.clientX,
        mouse.clientY
      ).nodeName
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
  } catch (e) {
    console.error('NexusMods Advance Error:' + e)
  }
})
function CanGoShortcut () {
  if (!modPreview_element && !modPopup_element && !modFiles_element) {
    return true
  }
  if (
    (modPreview_element && modPreview_element.style.display !== 'none') ||
    (modPopup_element && modPopup_element.style.display !== 'none') ||
    (modFiles_element && modFiles_element.style.display !== 'none')
  ) {
    return false
  }
  return true
}

document.addEventListener('keyup', async function (key) {
  if (key.key == 'ArrowLeft' && CanGoShortcut() && textFieldFocused == false) {
    MOVE_SHORTCUT('left')
  }
  if (key.key == 'ArrowRight' && CanGoShortcut() && textFieldFocused == false) {
    MOVE_SHORTCUT('right')
  }
})
document.addEventListener('keydown', async function (key) {
  if (
    key.altKey == true &&
    key.key == 'n' &&
    (current_modTab == 'posts' ||
      current_modTab == 'bugs' ||
      current_modTab == 'forums') &&
    current_page == 'only_mod_page'
  ) {
    const newTopicButton = document.querySelector(
      "div.forum-nav ul li a#add-comment, a#report-a-bug, div.forum-nav ul li a[href='.popup-topic']"
    )
    if (newTopicButton) {
      key.preventDefault()
      newTopicButton.click()
    }
  }

  if (key.altKey == true && key.key == 'e' && current_page == 'only_mod_page') {
    const endorseButtons = Array.from(
      document.querySelectorAll(
        "ul.modactions li[id^='action-endorse'], ul.modactions li[id^='action-unendorse']"
      )
    ).filter(el => {
      return window.getComputedStyle(el).display !== 'none'
    })[0]
    if (endorseButtons) {
      key.preventDefault()
      endorseButtons.click()
      endorseButtons.querySelector('a').click()
      if (endorseButtons.getAttribute('id').indexOf('action-endorse-') != -1) {
        CreateNotificationContainer(
          translate_strings.EndorsePopup_done.message,
          'success',
          'fa-solid fa-thumbs-up'
        )
      } else {
        CreateNotificationContainer(
          translate_strings.EndorsePopup_undone.message,
          'warning',
          'fa-regular fa-thumbs-up'
        )
      }
    }
  }
  if (key.altKey == true && key.key == 't' && current_page == 'only_mod_page') {
    const trackModButtons = Array.from(
      document.querySelectorAll(
        "ul.modactions li[id^='action-track'], ul.modactions li[id^='action-untrack']"
      )
    ).filter(el => {
      return window.getComputedStyle(el).display !== 'none'
    })[0]
    if (trackModButtons) {
      key.preventDefault()
      trackModButtons.click()
      trackModButtons.querySelector('a').click()
    }
  }

  if (
    key.ctrlKey == true &&
    key.key == 'f' &&
    current_modTab == 'posts' &&
    current_page == 'only_mod_page'
  ) {
    key.preventDefault()
    FocusSearchElement()
  }
  if (key.ctrlKey == true && key.key == 'c' && hiddenInput) {
    setTimeout(function () {
      hiddenInput.style.display = 'none'
    }, 1000)
  }
  if (key.key == 'Escape') {
    key.preventDefault()
    lastDescriptionID = 0
    zoomLevel = 1.0
    if (modPreview_element) {
      modPreview_element.style.display = 'none'
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
      (key.key == 'ArrowUp' ||
        key.key == 'ArrowLeft' ||
        (key.key == 'a' && key.ctrlKey == false)) &&
      !isTextField(key.target) &&
      modPreview_element.style.display == 'flex'
    ) {
      key.preventDefault()
      POPUP_IMAGES(GALLERY, 0)
    }
    if (
      (key.key == 'ArrowDown' ||
        key.key == 'ArrowRight' ||
        (key.key == 'd' && key.ctrlKey == false)) &&
      !isTextField(key.target) &&
      modPreview_element.style.display == 'flex'
    ) {
      key.preventDefault()
      POPUP_IMAGES(GALLERY, 1)
    }
    if (
      modPreview_element &&
      key.key == 's' &&
      key.ctrlKey == true &&
      modPreview_element.style.display != 'none' &&
      GALLERY &&
      GALLERY.length > 0
    ) {
      key.preventDefault()
      window.open(GALLERY[currentImageIndex].imageUrl)
    }
  }
  if (
    imgPopup &&
    key.key == 's' &&
    key.ctrlKey == true &&
    !imgPopup.classList.contains('popup-hidden')
  ) {
    key.preventDefault()
    window.open(imgPopup.src)
  }

  if (
    imgPopup &&
    key.key == '1' &&
    !imgPopup.classList.contains('popup-hidden')
  ) {
    await EndorseImageByPopup(imgPopup.getAttribute('image_id'))
  } else if (
    modPopup_element &&
    key.key == '1' &&
    modPopup_element.style.display != 'none'
  ) {
    await EndorseVideoByPopup(VIDEO_ID, elementView)
  }
})

document.addEventListener('scroll', async function (ev) {
  await FLOATING_MENU_SHORTCUTS()
  // Altura da janela de visualização
  var windowHeight = window.innerHeight

  // Distância do topo do documento até a parte superior da janela de visualização
  var scrollY = window.scrollY || window.pageYOffset

  // Altura total do documento
  var documentHeight = document.documentElement.scrollHeight

  // Distância até o final do documento
  var distanceToBottom = documentHeight - (scrollY + windowHeight)

  // Defina a distância em pixels a partir da qual deseja acionar a função
  var threshold = 1400
if(current_page=="mod_pages_all"&&distanceToBottom<threshold&&!isLoadingGames&&SITE_URL.indexOf(".com/mods/add") != -1){
  
  LOAD_MORE_GAMES();
  console.warn("LOAD MORE FUCKING GAMES!")
}
  if (
    distanceToBottom < threshold &&
    current_page == 'only_mod_page' &&
    current_modTab == 'posts' &&
    options['InfiniteScroll'] == true &&
    canScroll == true
  ) {
    canScroll = false
    await ModPostsTab_InfiniteScroll()
  }
  if (
    canScroll == true &&
    current_page == 'mod_pages_all' &&
    options['InfiniteScroll'] == true
  ) {
    if (distanceToBottom < threshold && options['InfiniteScroll'] == true && FETCH_BUSY == false) {
      //canScroll = false
      const SITE_PATH = new URL(SITE_URL)
      if (SITE_PATH.pathname.indexOf('mods/trackingcentre')!=-1) {
        setTimeout(GENERATE_INFINITE_SCROLL_TRACKCENTRE, 100)
      } else if (
        SITE_PATH.pathname == '/media' ||
        SITE_PATH.pathname == '/images' ||
        SITE_PATH.pathname == '/supporterimages' ||
        SITE_PATH.pathname.includes('/supporterimages') ||
        (SITE_PATH.pathname.includes('/media')&& !SITE_PATH.pathname.includes('/profile')) ||
        (SITE_PATH.pathname.includes('/games/') &&
          SITE_PATH.pathname.includes('/images'))
      ) {
          await GENERATE_INFINITE_SCROLL_MEDIA()
        
      } else if (
        SITE_PATH.pathname == '/videos' ||
        (SITE_PATH.pathname.includes('/games/') &&
          SITE_PATH.pathname.includes('/videos'))
      ) {
        await GENERATE_INFINITE_SCROLL_VIDEOS()
      } else if (
        (SITE_PATH.pathname.includes('/profile/') &&
          SITE_PATH.pathname.includes('/mods'))
      ) {
        await GENERATE_INFINITE_SCROLL_PROFILE_MODS()
      } else if (
        (SITE_PATH.pathname.includes('/profile/') &&
          SITE_PATH.pathname.includes('/media'))
      ) {
        await GENERATE_INFINITE_SCROLL_PROFILE_MEDIA()
      } else if (
        SITE_PATH.pathname == '/mods' ||
        (SITE_PATH.pathname.includes('/games/') &&
          SITE_PATH.pathname.includes('/mods'))
      ) {
        await GENERATE_INFINITE_SCROLL_MODS()
      }
    }
  }

  clearTimeout(modBlocksTimeout)
  modBlocksTimeout = setTimeout(GET_VISIBLE_BLOCKS, 150)
})

function GET_VISIBLE_BLOCKS () {
  // 1️⃣ Seletor único e simples
  const SELECTOR = `
    div[class*='mod-tile'],
    div[data-e2eid='mod-tile-teaser'],
    div:not([id])[data-e2eid~='media-tile'],
    dl.accordion dt div.stat a,
    td.tracking-mod
  `

  // 2️⃣ Pega tudo que ainda não foi processado
  const elements = [...document.querySelectorAll(SELECTOR)].filter(
    el => !el.hasAttribute('VISIBLE')
  )

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
function onIntersect (entries, observer) {
  let updated = false
  for (const entry of entries) {
    if (!entry.isIntersecting) continue

    markVisible(entry.target)
    observer.unobserve(entry.target)
    updated = true
  }

  if (updated) runUpdates()
}
function markVisible (el) {
  if (el.hasAttribute('VISIBLE')) return

  el.setAttribute('VISIBLE', '1')
  runUpdates()
}
let updateQueued = false

function runUpdates () {
  if (updateQueued) return

  updateQueued = true

  requestAnimationFrame(() => {
    updateQueued = false
    LOAD_HIDDEN_WORDS()
    REMOVE_MOD_STATUSVIEW()
    REMOVE_MOD_COLLECTIONS()
    FAST_CHANGELOGS()
    CREATE_MODS_BUTTONS()
    VideoPopupSetup()
    ImagePopupSetup()
    Fix_Youtube_Thumbnails()
    OriginalImageSetup()
    PROFILE_ONMOUSE()
    ARTICLES_ONMOUSE()
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

    waitForMainContentStable(() => {
        WIDER_WEBSITE();
    });

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

