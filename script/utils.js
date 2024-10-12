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