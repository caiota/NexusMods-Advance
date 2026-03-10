async function EXTERNAL_LINKS_NEWTAB() {
    try {
        if (options['NewTab_ExternalURL'] === true) {
            const EXTERNAL_LINKS = Array.from(document.querySelectorAll("div#mainContent a:not([NEW_TAB])"))
                .filter(function (link) {
                    // Verifica se o link possui href
                    if (link.href) {
                        // Ignora links que executam código JavaScript
                        if (link.href.startsWith("javascript:")) {
                            return false;
                        }
                        try {
                            const linkHostname = new URL(link.href).hostname;
                            // Retorna os links que não são de nexusmods.com
                            return !linkHostname.includes('nexusmods.com');
                        } catch (e) {
                            // Retorna false se a URL não for válida
                            return false;
                        }
                    }
                    return false; // Descarta links inválidos ou relativos
                });

            EXTERNAL_LINKS.forEach(function (external_link) {
                external_link.setAttribute("target", "_blank");
                external_link.setAttribute("NEW_TAB", true);
            });
        }
    } catch (E) {
        console.error(E);
    }
}