async function SELECTED_TAB() {
    try {
        if (document.querySelector("ul.modtabs li a.selected") && last_modTab != document.querySelector("ul.modtabs li a.selected").closest("li").id.replace("mod-page-tab-", "")) {
            current_modTab = document.querySelector("ul.modtabs li a.selected").closest("li").id.replace("mod-page-tab-", "");
            last_modTab = current_modTab;
            console.log("TAB ATUAL: " + current_modTab);
        }
    } catch (e) {
        console.error("NexusMods Advance Error:" + E);
    }
}