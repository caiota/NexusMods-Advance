async function HideModsByList() {
    chrome.runtime.sendMessage({
        action: 'Load_HiddenMods'
    }, async function (response) {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
        } else {
            if (response && response.success) {
                HIDDEN_MODS = response.data;
                PROCESS_HIDDEN_LIST();
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
                                        console.log("Removendo Mod Oculto: " + mod.mod_name);
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