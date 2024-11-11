function COMPARE_SETTINGS(obj1, obj2) {
    if (obj1 === obj2) return true; // se as referências forem as mesmas
    if (obj1 == null || obj2 == null) return false; // se um dos objetos for null ou undefined
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false; // se os objetos tiverem diferentes números de propriedades

    for (let key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            if (obj1[key] !== obj2[key]) {
                return false; // se os valores de qualquer propriedade forem diferentes
            }
        } else {
            return false; // se uma propriedade não existir em ambos os objetos
        }
    }

    return true; // se todas as propriedades e valores forem iguais
}

function findGameById(gameIDE) {
    if (GAMES.length > 0) {
        for (let i = 0; i < GAMES.length; i++) {
            if (gameIDE == GAMES[i].id) {
                return GAMES[i].name;
            }
        }
    } else {
        console.error("SEM GAMES")
    }
    return null; // Retorna null se não encontrar o URL alvo
}
function fingGameIDBy_DomainName(gameIDE) {
    console.log(GAMES.length, gameIDE)
    if (GAMES.length > 0) {
        for (let i = 0; i < GAMES.length; i++) {
            if (gameIDE == GAMES[i].domain_name) {
                console.log(GAMES[i]);
                return GAMES[i].id;
            }
        }
    } else {
        console.error("SEM GAMES")
    }
    return null; // Retorna null se não encontrar o URL alvo
}

function fingGameNameByID(gameIDE) {
    if (GAMES.length > 0) {
        for (let i = 0; i < GAMES.length; i++) {
            if (gameIDE == GAMES[i].id) {
                return GAMES[i].domain_name;
            }
        }
    } else {
        console.error("SEM GAMES")
    }
    return null; // Retorna null se não encontrar o URL alvo
}
function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);

    // Formata a data e a hora como string
    const formattedDate = date.toLocaleString();

    return formattedDate;
}

function formatNumber(number) {
    if (number >= 1_000_000_000) {
        return (number / 1_000_000_000).toFixed(1) + 'B'; // Bilhões
    } else if (number >= 1_000_000) {
        return (number / 1_000_000).toFixed(1) + 'M'; // Milhões
    } else if (number >= 1_000) {
        return (number / 1_000).toFixed(1) + 'K'; // Mil
    } else {
        return number.toString(); // Menor que mil
    }
}

async function CreateNotificationContainer(msg, type, iconClass, timer) {
    // Cria o container da notificação
    const notificationDiv = document.createElement('div');
    if (!timer || isNaN(timer)) {
        timer = 5000;
    }
    // Define a classe de estilo baseado no tipo
    if (type === 'success') {
        notificationDiv.className = 'AdvanceNotification success';
    } else if (type === 'warning') {
        notificationDiv.className = 'AdvanceNotification warning';
    } else if (type === 'error') {
        notificationDiv.className = 'AdvanceNotification error';
    } else if (type === 'sitePopup') {
        notificationDiv.className = 'AdvanceNotification sitePopup';
    }

    // Cria o ícone usando o Font Awesome com a classe personalizada
    const icon = document.createElement('i');
    icon.className = iconClass || (type === 'success' ? 'fas fa-check-circle' : type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-times-circle');

    // Cria o span para a mensagem
    const messageSpan = document.createElement('span');
    if (!type === 'sitePopup') {
        messageSpan.innerText = msg;
    } else {
        messageSpan.innerHTML = msg;
    }
    // Adiciona o ícone e a mensagem ao container da notificação
    notificationDiv.appendChild(icon);
    notificationDiv.appendChild(messageSpan);

    // Adiciona o container da notificação ao body
    document.body.appendChild(notificationDiv);

    // Calcula a quantidade de notificações já existentes para ajustar a posição da nova
    const notifications = document.querySelectorAll('.AdvanceNotification');
    const offset = (notifications.length - 1) * 65; // Espaçamento entre notificações
    notificationDiv.style.top = `${65 + offset}px`;

    adjustNotificationPositions();
    // Remove a notificação após 5 segundos
    setTimeout(() => {
        notificationDiv.remove();
        adjustNotificationPositions();
    }, timer);
}
// Função para ajustar as posições das notificações restantes
function adjustNotificationPositions() {
    const notifications = document.querySelectorAll('.AdvanceNotification');
    notifications.forEach((notification, index) => {
      const offset = index * 60;
      notification.style.top = `${60 + offset}px`;
    });
  }
function findIdByNexusmodsUrl(targetUrl) {

    if (GAMES.length > 0) {
        targetUrl = targetUrl.replace("http://", "https://").split("/");
        targetUrl = targetUrl[0] + "/" + targetUrl[1] + "/" + targetUrl[2] + "/" + targetUrl[3];
        for (let i = 0; i < GAMES.length; i++) {
            if (targetUrl == GAMES[i].nexusmods_url) {

                return GAMES[i].id;
            }
        }
    } else {
        console.error("SEM GAMES")
    }
    return null; // Retorna null se não encontrar o URL alvo
}
function findIdBydomainName(targetUrl) {

    if (GAMES.length > 0) {
        for (let i = 0; i < GAMES.length; i++) {
            if (targetUrl == GAMES[i].domain_name) {

                return GAMES[i].id;
            }
        }
    } else {
        console.error("SEM GAMES")
    }
    return null; // Retorna null se não encontrar o URL alvo
}
function findNameByDomainName(targetUrl) {

    if (GAMES.length > 0) {
        for (let i = 0; i < GAMES.length; i++) {
            if (targetUrl == GAMES[i].domain_name) {

                return GAMES[i].name;
            }
        }
    } else {
        console.error("SEM GAMES")
    }
    return null; // Retorna null se não encontrar o URL alvo
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
async function EXEC_ONCE(key, fn, delay) {
    if (timeoutMap[key]) {
        clearTimeout(timeoutMap[key]);
    }
    timeoutMap[key] = setTimeout(() => {
        fn();
        delete timeoutMap[key];
    }, delay);
}
async function MOD_ID_FROMURL(url) {
    const urlSemParametros = url.split('?')[0];
    const regex = /\/(\d+)(\/|$)/;
    const match = urlSemParametros.match(regex);
    return match ? match[1] : null;
}
async function ON_MOD_PAGES(url) {
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
}
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
  function FIND_GAME_ON_GAMES(name) {
    const results = []; // Array para armazenar todos os jogos correspondentes
    for (const [id, game] of gameMap) {
        if (game.name.toLowerCase().includes(name.toLowerCase())) {
            results.push(game); // Adiciona o jogo ao array de resultados
        }
    }
    return results.length > 0 ? results : []; // Retorna todos os resultados ou GAMES se nenhum jogo for encontrado
}
async function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&')
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    const results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }