async function REMOVE_MOD_STATUSVIEW() {
    if (options['HideModStatus'] == true) {
        const items = document.querySelectorAll("div[class*='mod-tile'][VISIBLE]:not([REMOVED_STATUS])");

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemContainer=item.querySelector("svg path[d='M21,5L9,17L3.5,11.5L4.91,10.09L9,14.17L19.59,3.59L21,5M3,21V19H21V21H3Z']");
            if(!itemContainer) continue;
            const toolTip =itemContainer.closest("div");
            if (toolTip) {
                //toolTip.style.display = 'none';
                toolTip.style.visibility="hidden";
                item.addEventListener("mouseenter", function (ev) {
                    ev.currentTarget.querySelector("svg path[d='M21,5L9,17L3.5,11.5L4.91,10.09L9,14.17L19.59,3.59L21,5M3,21V19H21V21H3Z']").closest("div.absolute").style.visibility="visible";
                }, true);

                item.addEventListener("mouseleave", function (ev) {
                    ev.currentTarget.querySelector("svg path[d='M21,5L9,17L3.5,11.5L4.91,10.09L9,14.17L19.59,3.59L21,5M3,21V19H21V21H3Z']").closest("div.absolute").style.visibility="hidden";
                }, true);
            }

            item.setAttribute("REMOVED_STATUS", true);
        }
    }
}