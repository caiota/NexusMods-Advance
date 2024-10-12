function formatDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000)
  const formattedDate = date.toLocaleString()

  return translate_strings.updated.message + formattedDate
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function findURLbyID(modID) {
  if (GAMES.length > 0) {
    for (let i = 0; i < GAMES.length; i++) {
      if (modID == GAMES[i].id) {
        return GAMES[i].nexusmods_url
      }
    }
  } else {
    console.error('SEM GAMES')
  }
  return null
}

function findGameById(gameId) {
  if (GAMES.length > 0) {
    for (let i = 0; i < GAMES.length; i++) {
      if (gameId == GAMES[i].id) {
        return GAMES[i].name
      }
    }
  } else {
    console.error('SEM GAMES')
  }
  return null
}

function findGameLinkById(gameId) {
  if (GAMES.length > 0) {
    for (let i = 0; i < GAMES.length; i++) {
      if (gameId == GAMES[i].id) {
        return GAMES[i].domain_name
      }
    }
  } else {
    console.error('SEM GAMES')
  }
  return null
}
function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
function updateURLParameter(param, value) {
  // Obter a URL atual
  let currentURL = new URL(window.location.href)

  // Atualizar o parâmetro 'tab' na query string
  currentURL.searchParams.set(param, value)

  // Atualizar a URL na barra de endereços sem recarregar a página
  history.pushState(null, '', currentURL.toString())
}
function openCenteredPopup(url, title, width, height) {
  // Calcula a posição para centralizar a janela
  var screenWidth = window.screen.width
  var screenHeight = window.screen.height
  var left = (screenWidth - width) / 2
  var top = (screenHeight - height) / 2

  // Define as opções da janela
  var options = `width=${width},height=${height},top=${top},left=${left}`
  window.open(url, title, options)
}

function searchInObject(obj, searchString) {
  const results = {}

  function recursiveSearch(innerObj, parentKey) {
    // Verifica se o nome da chave pai contém a string de busca
    if (parentKey.toLowerCase().includes(searchString.toLowerCase())) {
      results[parentKey] = obj[parentKey]
      return
    }

    // Pesquisa nos valores do objeto
    for (const key in innerObj) {
      if (typeof innerObj[key] === 'object' && innerObj[key] !== null) {
        recursiveSearch(innerObj[key], parentKey)
      } else if (
        String(innerObj[key]).toLowerCase().includes(searchString.toLowerCase())
      ) {
        results[parentKey] = obj[parentKey]
        return
      }
    }
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      recursiveSearch(obj[key], key)
    }
  }

  return results
}

async function saveCheckbox(box, valor) {
  chrome.runtime.sendMessage(
    {
      action: 'SaveBox',
      item: box,
      checado: valor
    },
    function (response) {
      //alert(response.message)
    }
  )
}

async function GET_NOTIFICATIONS(forceUpdate = false) {
  chrome.runtime.sendMessage(
    {
      action: 'SYNC_NOTIFICATIONCOUNT',
      forceUpdate: forceUpdate
    },
    function (response) {
      if (!response) {
        return;
      }
      NOTIFICATIONS_COUNT = response.message
      if (isNaN(NOTIFICATIONS_COUNT)) {
        return
      }
      document.querySelector('div#notificationBadge span').innerText =
        NOTIFICATIONS_COUNT
      if (NOTIFICATIONS_COUNT > 0) {
        document.querySelector('div#notificationBadge i').classList =
          'fa-solid fa-bell'
        document.querySelector(
          'div#notificationBadge #NotifyMessage'
        ).innerText =
          NOTIFICATIONS_COUNT + translate_strings.Notification.message
        document.querySelector(
          'div#notificationBadge #NotifyMessage'
        ).style.display = 'block'
        document
          .querySelector('div#notificationBadge')
          .addEventListener('click', OpenNotifications)
      } else {
        document.querySelector('div#notificationBadge i').classList =
          'fa-regular fa-bell'
        document.querySelector(
          'div#notificationBadge #NotifyMessage'
        ).style.display = 'none'
        document
          .querySelector('div#notificationBadge')
          .removeEventListener('click', OpenNotifications)
      }
    }
  )

  LOAD_HIDDEN_MODS
}
function OpenNotifications() {
  window.open('https://next.nexusmods.com/notifications/all')
}
async function LOAD_HIDDEN_MODS() {
  chrome.runtime.sendMessage(
    {
      action: 'Load_HiddenMods'
    },
    async function (response) {
      if (chrome.runtime.lastError) {
        console.error(
          'Error sending message:',
          chrome.runtime.lastError.message
        )
      } else {
        if (response && response.success) {
          HIDDEN_MODS = response.data
          await CREATE_HIDDEN_DIVS()
        } else {
          console.error('Error in response:', response)
        }
      }
    }
  )
}
async function CREATE_HIDDEN_DIVS() {
  if (Object.entries(HIDDEN_MODS).length == 0) {
    document.querySelector('fieldset.hiddenMods').style.display = 'none'
    return
  }
  const container = document.getElementById('HiddenMods') // Elemento que vai conter as divs criadas

  for (const [game, mods] of Object.entries(HIDDEN_MODS)) {
    const section = document.createElement('div')
    section.className = 'section'

    const title = document.createElement('div')
    title.className = 'section-title'
    title.textContent = game
    section.appendChild(title)

    const content = document.createElement('div')
    content.className = 'section-content'

    for (const mod of Object.values(mods)) {
      const modDiv = document.createElement('div')
      modDiv.classList = 'HiddenMod_Div'
      modDiv.setAttribute('game', game)
      modDiv.setAttribute('mod_id', mod.mod_id)
      modDiv.textContent = mod.mod_name
      modDiv.addEventListener('click', function (mod) {
        const mod_id = mod.target.getAttribute('mod_id')
        const mod_game = mod.target.getAttribute('game')

        chrome.runtime.sendMessage(
          {
            action: 'Remove_HiddenMod',
            game: mod_game,
            mod: mod_id
          },
          async function (response) {
            if (chrome.runtime.lastError) {
              console.error(
                'Error sending message:',
                chrome.runtime.lastError.message
              )
            } else {
              if (response && response.success) {
                mod.target.style.opacity = '0.2'
                mod.target.style.background = 'red'
              } else {
                console.error('Error in response:', response.error)
              }
            }
          }
        )
      })
      content.appendChild(modDiv)
    }

    section.appendChild(content)
    container.appendChild(section)
    if (Object.entries(mods).length == 0) {
      section.style.display = 'none'
    }
    title.addEventListener('click', () => {
      content.classList.toggle('expanded')
    })
  }
}
let PremiumBusy = false;
function Download_ModManager(tempLinkDLD, modId, game, fileId) {
  const FILE_URL = new URL(tempLinkDLD);
  window.location.href = "nxm://" + game + "/mods/" + modId + "/files/" + fileId + "?key=" + FILE_URL.searchParams.get("md5") + "&expires=" + FILE_URL.searchParams.get("expires") + "&user_id=" + FILE_URL.searchParams.get("user_id");
}

async function GetPremiumDownload(game, modId, fileId, modName, newVersion) {
  if (!PremiumBusy) {
    PremiumBusy = true;
    fetch("https://api.nexusmods.com/v1/games/" + game + "/mods/" + modId + "/files/" + fileId + ".json", api_headers)
      .then(response => {
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error('Erro na requisição: ' + response.statusText);
        }
        // Processa a resposta em JSON
        return response.json();
      })
      .then(data => {
        modData.size = data.size_in_bytes;
        modData.updateTime = data.uploaded_timestamp

        fetch('https://api.nexusmods.com/v1/games/' + game + '/mods/' + modId + '/files/' + fileId + '/download_link.json', api_headers)
          .then(response => {
            if (!response.ok) {
              console.error("NexusMods Error: " + response.status);
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            document.querySelector("div#overflow").style.display = 'block';
            document.querySelector("div#PremiumDownload").style.display = 'block';
            document.querySelector("div#PremiumDownload div#DownloadName").innerText = modName + " - " + newVersion + " - " + formatBytes(modData.size);
            PremiumBusy = false;
            data.forEach(function (cdn_link) {
              const aa = document.createElement("a");
              aa.id = 'cdnLink';
              aa.innerText = cdn_link.name;
              aa.href = cdn_link.URI;
              aa.setAttribute("mod_id", modId);
              aa.setAttribute("game", game);
              aa.setAttribute("file_id", fileId);
              aa.addEventListener("click", (ev) => {
                ev.preventDefault();
                chrome.runtime.sendMessage({
                  action: 'DeleteMod',
                  mod_name: modData.modName,
                  modId: modId
                }, function (response) {
                  console.log("Mod " + modData.modName + " Apagado de: " + modName)
                  chrome.runtime.sendMessage({
                    action: 'TrackMod',
                    file_id: fileId,
                    mod: modId,
                    mod_thumbnail: modData.thumbnail,
                    mod_name: modData.modName,
                    category: modData.category,
                    mod_Fullname: modName,
                    version: modData.new_version,
                    updated: modData.updateTime,
                    game: modData.game_id,
                    gameName: modData.game_name
                  }, function (response) {
                    console.log("Mod " + modData.modName + " Recriado de: " + modName);
                  });
                });
                if (ev.ctrlKey == true) {
                  window.location.href = ev.target.href;
                } else {
                  Download_ModManager(ev.target.href, ev.target.getAttribute("mod_id"), ev.target.getAttribute("game"), ev.target.getAttribute("file_id"));
                }
                //document.querySelector("div#overflow").style.display = 'none';
                //document.querySelector("div#PremiumDownload").style.display = 'none';
                //document.querySelector("div#PremiumDownload div#Links").innerHTML = "";
              })
              document.querySelector("div#PremiumDownload fieldset div#Links").appendChild(aa);
            })
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });

      })
      .catch(error => {
        // Manipula erros na requisição
        console.error('Erro:', error);
      });
  }
}