function highlightOutdatedMods() {
const DAYS_TO_ORANGE = 150;
    // Converte texto "31 Aug 2026" para timestamp (segundos)
    function parseDateFromSpan(text) {
        const match = text.match(/\b(\d{1,2})\s+(\w+)\s+(\d{4})\b/);
        if (!match) return null;
        const day = parseInt(match[1], 10);
        const monthStr = match[2];
        const year = parseInt(match[3], 10);
        const months = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const month = months[monthStr];
        if (month === undefined) return null;
        // Cria data no fuso local (assume que o texto está no fuso do usuário)
        const dateObj = new Date(year, month, day);
        dateObj.setHours(0, 0, 0, 0); // Zera a hora
        return Math.floor(dateObj.getTime() / 1000);
    }

    function applyHighlight() {
       if (document.querySelector('#fileinfo .sideitem.timestamp time[data-highlighted]')) return;
        const timeEl = document.querySelector('#fileinfo .sideitem.timestamp time:not([data-highlighted])');
        if (!timeEl) return;

        const updateTimestamp = parseInt(timeEl.getAttribute('data-date'), 10);
        if (isNaN(updateTimestamp)) return;

        // Converte updateTimestamp para apenas data (meia-noite)
        const updateDate = new Date(updateTimestamp * 1000);
        updateDate.setHours(0, 0, 0, 0);
        const updateDateOnly = Math.floor(updateDate.getTime() / 1000);

        const now = Math.floor(Date.now() / 1000);
        const thresholdTimestamp = now - (DAYS_TO_ORANGE * 24 * 60 * 60);

        const historySpan = document.querySelector('.modhistory .flex-copy');
        let downloadTimestamp = null;
        if (historySpan) {
            const text = historySpan.textContent.trim();
            if (!text.includes("haven't downloaded")) {
                downloadTimestamp = parseDateFromSpan(text);
            }
        }

        // Decisão da cor
        let color = null;
        if (downloadTimestamp !== null && updateDateOnly  > downloadTimestamp) {
            color = 'red';
            timeEl.title = translate_strings.OutdatedModWarning.message;
            CreateNotificationContainer(
    translate_strings.OutdatedModWarning.message,
    'error',
    'fa-solid fa-triangle-exclamation',
    8000
  )
        } else if (updateDateOnly  < thresholdTimestamp) {
            color = 'orange';
            timeEl.title = translate_strings.OutdatedModWarning.description;
            CreateNotificationContainer(
    translate_strings.OutdatedModWarning.description,
    'warning',
    'fa-solid fa-triangle-exclamation',
    8000
  )
        }

        // Aplica o estilo
        if (color) {
            timeEl.style.backgroundColor = color;
            timeEl.style.color = '#fff';
            timeEl.style.padding = '2px 8px';
            timeEl.style.borderRadius = '4px';
            timeEl.style.fontWeight = 'bold';
            timeEl.setAttribute('data-highlighted', 'true');
        }
    }

        applyHighlight();
    
}