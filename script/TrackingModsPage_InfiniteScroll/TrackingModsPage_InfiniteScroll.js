async function GENERATE_INFINITE_SCROLL_TRACKCENTRE() {

    async function VALIDATE_PAGE(url) {
        try {
            const parsedUrl = new URL(url);

            // Verifica se o caminho corresponde ao desejado
            if (parsedUrl.pathname === "/mods/trackingcentre") {
                // Obtém o valor do parâmetro 'tab' (pode ser null se não existir)
                const tabParam = parsedUrl.searchParams.get("tab");

                // Retorna true se 'tab' for 'mods' ou se não existir
                return tabParam === "mods" || tabParam === null;
            }
            return false;
        } catch (error) {
            console.error("URL inválida:", error);
            return false;
        }
    }

    if (await VALIDATE_PAGE(SITE_URL)) {
        if (PAGINA_ATUAL == 0) {
            await GET_MAXPAGES();
        } else {
            PAGINA_ATUAL++;
        }
        if (PAGINA_ATUAL > max_pages) {
            return;
        }

        current_url = TrackingMods_link;
        await GET_USER_FILTER_TRACKING();

        console.log("Loading Page: " + PAGINA_ATUAL + " From Total: " + max_pages + " Pages")

        fetch(current_url, http_headers)
            .then(response => response.text())
            .then(async (html) => {
                const parser = new DOMParser();
                doc3 = parser.parseFromString(html, 'text/html');
                doc3 = doc3.body.querySelector("tbody");

                doc3.id = "injectedContent_" + PAGINA_ATUAL;
                if (doc3.querySelectorAll("tr").length == 0) {
                    console.log("Fim dos Mods");
                    return;
                }

                if (!document.querySelector("body#injectedContent_" + PAGINA_ATUAL)) {
                    canScroll = true;
                    doc3.querySelectorAll("tr").forEach(function (item) {
                        document.querySelector("tbody").appendChild(item);

                    });

                    console.log("INFINITE SCROLL TRACKCENTRE PAGE " + PAGINA_ATUAL)
                    EXEC_ONCE('profileMouse', PROFILE_ONMOUSE, 300);

                    setTimeout(OriginalImageSetup, 1000);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o HTML:', error);
            });
    } else {
        console.log("Infinite Scroll não suportado nesta página D:");
        return;
    }
}