async function DESCRIPTION_ONMOUSE() {
    if (options['DescriptionOnMouse'] === true) {
        const currentModId = await extrairID(SITE_URL);
        const links = Array.from(document.querySelectorAll("a:not([DESCRIPTION_CLICK])")).filter(link =>
            /\/mods\/\d+/.test(link.href.replace(/#$/, ''))
        );

        let descriptionTimeout;

        for (const link of links) {
            link.addEventListener("mouseenter", async (ev) => {
                const linkModId = await extrairID(link.href.replace(/#$/, ''));
                if (options['DescriptionOnMouse'] === true && lastDescriptionID !== linkModId && linkModId !== currentModId && link.href.indexOf("/mods/" + pageID) == -1) {
                    clearTimeout(descriptionTimeout);
                    descriptionTimeout = setTimeout(async () => {
                        lastDescriptionID = linkModId;
                        temp_gameID = findIdByNexusmodsUrl(link.href);
                        if (temp_gameID && linkModId) {
                            console.log(`Carregando MOD ID ${linkModId} do jogo ${temp_gameID}`);
                            CREATE_MOD_DESCRIPTION(temp_gameID, linkModId, 'descricao');
                        }
                    }, 600);
                }
            });

            link.addEventListener("mouseleave", () => {
                lastDescriptionID = 0;
                clearTimeout(descriptionTimeout);
            });

            link.setAttribute("DESCRIPTION_CLICK", true);
        }
    }
}