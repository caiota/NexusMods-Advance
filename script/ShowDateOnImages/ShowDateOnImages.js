function MEDIA_TILE_DATE() {
if(options['ShowDateOnImages']==true){
    for (const element of VISIBLE_ELEMENTS) {

        if (!element.isConnected) {
            VISIBLE_ELEMENTS.delete(element);
            continue;
        }

        if (
            !element.matches ||
            !element.matches(
                "div[data-e2eid='media-tile']:not([NMA_DATE_ADDED])"
            )
        ) {
            continue;
        }

        const img = element.querySelector(
            'img[src*="staticdelivery.nexusmods.com"]'
        );

        if (!img) {
            continue;
        }

        const match = img.src.match(/-(\d+)\.[^./?]+(?:\?.*)?$/);

        if (!match) {
            continue;
        }

        const timestamp = Number(match[1]);

        if (!Number.isFinite(timestamp)) {
            continue;
        }

        const date = new Date(timestamp * 1000);

        if (Number.isNaN(date.getTime())) {
            continue;
        }

        const formattedDate = date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const views = element.querySelector(
            '[data-e2eid="media-tile-views"]'
        );

        if (!views) {
            continue;
        }

        const viewsContainer = views.closest('span');

        if (!viewsContainer || !viewsContainer.parentElement) {
            continue;
        }
         const dateElement = document.createElement('div');
         dateElement.classList="MediaDate_Element"
         const dateIcon=document.createElement("i");
         dateIcon.classList="fa-regular fa-calendar-days";
        const datespan = document.createElement('span');

        datespan.textContent = formattedDate;
         dateElement.appendChild(dateIcon)
         dateElement.appendChild(datespan)
        viewsContainer.parentElement.appendChild(dateElement);

        element.setAttribute("NMA_DATE_ADDED", "true");
    }
}
}