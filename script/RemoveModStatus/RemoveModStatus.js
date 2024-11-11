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