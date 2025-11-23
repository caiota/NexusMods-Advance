async function ARTICLES_ONMOUSE() {
    if (options['ArticlesOnMouse'] == true) {

        let currentModId = await extrairID(SITE_URL);
        if (!currentModId) {
            currentModId = -1;
        }
        const filteredUrls = Array.from(document.querySelectorAll("a:not([ARTICLE_CLICK])")).filter(function (link) {
            return /\/articles\/\d+/.test(link.href.replace(/#$/, ''));
        });
        let articleTimeout
        filteredUrls.forEach(function (link) {
            link.addEventListener("mouseenter", async function (ev) {
                const linkModId = await extrairID(link.href.replace(/#$/, ''));
                if (options['ArticlesOnMouse'] === true && lastDescriptionID !== linkModId && linkModId !== currentModId) {

                    clearTimeout(articleTimeout);
                    articleTimeout = setTimeout(function () {
                        lastDescriptionID = linkModId;
                        temp_gameID = findIdBydomainName(link.href);
                        console.log("Carregando MOD ID " + linkModId + " do jogo " + temp_gameID);
                        CREATE_MOD_DESCRIPTION(link.href, linkModId, 'artigo');
                    }, 600);
                }
            });
            link.addEventListener("mouseleave", function (ev) {
                lastDescriptionID = 0;
                clearTimeout(articleTimeout);
            });

            link.setAttribute("ARTICLE_CLICK", true);
        });
    }
}