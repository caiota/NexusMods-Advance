async function LOAD_MOD_DETAILS() {
    const SITE_PATH = new URL(SITE_URL);
    if (options['BetterModBlocks'] == false || SITE_PATH.pathname == "/") {
        return;
    }

    const modsToProcess = Array.from(document.querySelectorAll("li[VISIBLE] div[data-mod-id]:not([DETAILS_SET])"));
    const batchSize = 20;  // Definimos o tamanho do lote para processar 10 por vez

    const processBatch = async (batch) => {
        for (const mod_tile of batch) {
            const dataModId = parseInt(mod_tile.getAttribute("data-mod-id"));
            const mod3 = GAME_DATA.find(mod => mod.modId === dataModId);

            if (mod_tile.querySelector("div.tile-data li.downloadcount span") && mod3 && mod_tile.querySelector("div.tile-data li.downloadcount span").innerText == "--") {
                mod_tile.querySelector("div.tile-data li.downloadcount span").innerText = formatNumber(mod3.totalDownloads);
            }

            if (mod3 && mod_tile.querySelector("div.tile-data:not([VIEW_RENDER])")) {
                const modView_span = document.createElement("li");
                modView_span.classList = "downloadcount inline-flex";
                modView_span.innerHTML = '<i class="fa-solid fa-eye" aria-hidden="true" style="margin-left:2px;margin-right:2px;align-self: flex-start;"></i> ' + formatNumber(mod3.totalViews);
                mod_tile.querySelector("div.tile-data:not([VIEW_RENDER]) ul").appendChild(modView_span);
                mod_tile.querySelector("div.tile-data:not([VIEW_RENDER]) ul").style.display = 'flex';
                //mod_tile.querySelector("div.tile-data").style.padding = '5px';
                mod_tile.querySelector("div.tile-data").setAttribute("VIEW_RENDER", true);
            }

            mod_tile.setAttribute("DETAILS_SET", true);
        }
    };

    // Se os dados do jogo ainda não foram carregados, faça a requisição e processe os mods.
    if (GAME_DATA.length === 0) {
        const response = await fetch("https://staticstats.nexusmods.com/live_download_counts/mods/" + gameId + ".csv", {
            "referrer": "",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        });

        const html = await response.text();
        GAME_DATA = html.trim().split('\n').map(line => {
            const [modId, value1, value2, value3] = line.split(',');
            return {
                modId: parseInt(modId),
                totalDownloads: parseInt(value1),
                uniqueDownloads: parseInt(value2),
                totalViews: parseInt(value3)
            };
        });
    }

    // Processar em lotes de 10
    for (let i = 0; i < modsToProcess.length; i += batchSize) {
        const batch = modsToProcess.slice(i, i + batchSize);
        await processBatch(batch);  // Pausa entre cada lote de 10 para não sobrecarregar
    }
}