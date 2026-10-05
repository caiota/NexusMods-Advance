function ARTICLES_ONMOUSE() {

    if (options['ArticlesOnMouse'] !== true) {
        return;
    }

    let currentModId = extrairID(SITE_URL);

    if (!currentModId) {
        currentModId = -1;
    }

    let articleTimeout;

    for (const link of VISIBLE_ELEMENTS) {

        if (!link.isConnected) {
            VISIBLE_ELEMENTS.delete(link);
            continue;
        }

        if (
            !link.matches ||
            !link.matches("a[href*='/articles/']")
        ) {
            continue;
        }

        if (link.hasAttribute("ARTICLE_CLICK")) {
            continue;
        }

        const href = link.href?.replace(/#$/, '');

        if (!href || !/\/articles\/\d+/.test(href)) {
            continue;
        }
        link.addEventListener("mouseenter", function () {

            const linkModId = extrairID(
                link.href.replace(/#$/, '')
            );

            if (
                options['ArticlesOnMouse'] === true &&
                lastDescriptionID !== linkModId &&
                linkModId !== currentModId
            ) {

                clearTimeout(articleTimeout);

                articleTimeout = setTimeout(function () {

                    lastDescriptionID = linkModId;

                    temp_gameID = findIdBydomainName(link.href);

                    console.log(
                        "Carregando MOD ID " +
                        linkModId +
                        " do jogo " +
                        temp_gameID
                    );

                    CREATE_MOD_DESCRIPTION(
                        link.href,
                        linkModId,
                        'artigo'
                    );

                }, 600);
            }
        });

        link.addEventListener("mouseleave", function () {

            lastDescriptionID = 0;

            clearTimeout(articleTimeout);

        });

        link.setAttribute("ARTICLE_CLICK", true);
    }
}
