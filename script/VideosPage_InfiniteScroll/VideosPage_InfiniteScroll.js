async function GENERATE_INFINITE_SCROLL_VIDEOS() {
    if (PAGINA_ATUAL == 0) {
        await GET_MAXPAGES();
    } else {
        PAGINA_ATUAL++;
    }
    if (PAGINA_ATUAL > max_pages) {
        return;
    }
    console.log("Loading Page: " + PAGINA_ATUAL + " From Total: " + max_pages + " Pages")
    if (SITE_URL.indexOf("/videos/recentlyendorsed") != -1) {

        video_Trending = "https://www.nexusmods.com/Core/Libs/Common/Widgets/VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",sort_by:rating,order:DESC,time:14,show_game_filter:false,page_size:16,page:" + PAGINA_ATUAL;
        current_url = video_Trending;
    } else if (SITE_URL.indexOf("/videos/mostendorsed/") != -1) {

        video_Best = "https://www.nexusmods.com/Core/Libs/Common/Widgets/VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",sort_by:rating,order:DESC,show_game_filter:false,page_size:16,page:" + PAGINA_ATUAL;
        current_url = video_Best;
    } else if (SITE_URL.indexOf("/videos/") != -1) {
        videosAll = "https://www.nexusmods.com/Core/Libs/Common/Widgets/VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",show_game_filter:false,page_size:16,page:" + PAGINA_ATUAL;
        current_url = videosAll;
    } else {

        console.log("Infinite Scroll não suportado nesta página D:");
        return;
    }

    fetch(current_url, http_headers)
        .then(response => response.text())
        .then(async (html) => {
            const parser = new DOMParser();
            doc3 = parser.parseFromString(html, 'text/html');
            doc3.body.querySelectorAll("ul.tiles li.image-tile").forEach(function (media) {
                document.querySelector("ul.tiles").appendChild(media);
                media.querySelector("div.tile-desc").style.opacity = '1';
            })
            console.log("INFINITE SCROLL VIDEOS PAGE " + PAGINA_ATUAL)
            setTimeout(OriginalImageSetup, 1000);
            await VideoPopupSetup();
            canScroll = true;
        })
        .catch(error => {
            console.error('Erro ao buscar o HTML:', error);
        });

}