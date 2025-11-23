async function DESCRIPTION_ONMOUSE() {
    if (options['DescriptionOnMouse'] === true) {
        const currentModId = await extrairID(SITE_URL);
        if(SITE_URL.indexOf("trackingcentre?tab=mods")){
        var ALL_LINKS=document.querySelectorAll("td.tracking-mod a:not([DESCRIPTION_CLICK])");
        }{
           
        var ALL_LINKS=document.querySelectorAll("a:not([DESCRIPTION_CLICK])");
        }
        const links = Array.from(ALL_LINKS).filter(link =>
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
                        if ( linkModId && current_modTab!="images"&&current_modTab!="videos"&&current_modTab!="files") {
                            console.log(`Carregando MOD ID ${linkModId} do jogo ${gameID_Number}`);
                            CREATE_MOD_DESCRIPTION(gameID_Number, linkModId, 'descricao');
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