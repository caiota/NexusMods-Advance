async function GET_MEDIA_FILTERS(type,subType) {
    try {
        let attributes = [];
        let game_id = null;
        if (type == "ImageList"&&document.querySelector("select#game_id")) {
            game_id = document.querySelector("select#game_id").value;
        } else {
            game_id = gameId
        }
        const time = document.querySelector("select#time")?.value;
        const order = document.querySelector("select#order")?.value;
        const sort = document.querySelector("select#sort_by")?.value;
        if (game_id) {
            images_All = "https://www.nexusmods.com/Core/Libs/Common/Widgets/" + type + "?"+subType+"=user_id:0,nav:false,game_id:" + game_id + ",show_game_filter:false,show_hidden:false,page_size:20,page:" + PAGINA_ATUAL
            current_url = images_All;
        }
        const checkeds = document.querySelectorAll("div.image-filter-container ul.choice-list li input[checked='checked']");

        if (checkeds.length > 0) {
            attributes.push('category_id:');
        }

        checkeds.forEach(function (item) {
            for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].startsWith('category_id:')) {
                    attributes[i] += item.value + "|";
                }
            }
        });
        if (attributes.length > 0) {
            attributes[0] = attributes[0].slice(0, -1);
        }
        if (time) {
            attributes.push("time:" + time);
        }
        if (order) {
            attributes.push("order:" + order);
        }
        if (sort) {
            attributes.push("sort_by:" + sort);
        }

        if (attributes.length > 0) {
            current_url += "," + attributes.join(',');
        }
    } catch (e) {
        console.error(e);
    }
}
async function GENERATE_INFINITE_SCROLL_MEDIA() {
    if (PAGINA_ATUAL == 0) {
        await GET_MAXPAGES();
    } else {
        PAGINA_ATUAL++;
    }
    if (PAGINA_ATUAL > max_pages) {
        return;
    }
    console.log("Loading Page: " + PAGINA_ATUAL + " From Total: " + max_pages + " Pages")
    if (SITE_URL.indexOf("/media/today") != -1) {
        media_24Hours = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",time:1,nav:false,page_size:20,page:" + PAGINA_ATUAL;
        current_url = media_24Hours;
    } else if (SITE_URL.indexOf("/media/thisweek") != -1) {
        media_thisWeek = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",time:7,nav:false,page_size:20,page:" + PAGINA_ATUAL;
        current_url = media_thisWeek;
    } else if (SITE_URL.indexOf("/media/popular/") != -1) {

        media_30Days = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",time:30,nav:false,page_size:20,page:" + PAGINA_ATUAL;
        current_url = media_30Days;
    } else if (SITE_URL.indexOf("/media/popularalltime/") != -1) {

        media_AllTime = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",sort_by:views,order:DESC,nav:false,page_size:20,page:" + PAGINA_ATUAL;
        current_url = media_AllTime;
    } else if (SITE_URL.indexOf("/media/") != -1) {
        media_AllPages = "https://www.nexusmods.com/Core/Libs/Common/Widgets/MediaList?RH_MediaList=game_id:" + gameId + ",order:DESC,nav:false,page_size:20,page:" + PAGINA_ATUAL;
        current_url = media_AllPages;
        await GET_MEDIA_FILTERS("MediaList","RH_MediaList");
    } else if (SITE_URL.indexOf("/images/") != -1) {
        images_All = "https://www.nexusmods.com/Core/Libs/Common/Widgets/ImageList?RH_ImageList=user_id:0,nav:false,game_id:" + gameId + ",time:0,show_hidden:false,page_size:16,page:" + PAGINA_ATUAL;
        current_url = images_All;
        await GET_MEDIA_FILTERS("ImageList","RH_ImageList");
    } else if (SITE_URL.indexOf("/supporterimages/") != -1) {
        images_All = "https://www.nexusmods.com/Core/Libs/Common/Widgets/SupporterImageList?RH_ImageList=user_id:0,nav:false,game_id:" + gameId + ",time:0,show_hidden:false,page_size:16,page:" + PAGINA_ATUAL;
        current_url = images_All;
        await GET_MEDIA_FILTERS("SupporterImageList","RH_ImageList");
    } else {

        console.log("Infinite Scroll não suportado nesta página D:");
        return;
    }

    fetch(current_url, http_headers)
        .then(response => response.text())
        .then(async (html) => {
            const parser = new DOMParser();
            doc3 = parser.parseFromString(html, 'text/html');
            doc3.body.querySelectorAll("ul li.image-tile").forEach(function (media) {
                tileMain = document.querySelector("ul.media-tiles") || document.querySelector("ul.tiles");
                tileMain.appendChild(media);
                media.querySelector("div.tile-desc").style.opacity = '1';
            });
            doc3.body.querySelectorAll("div#image-list ul li.image-tile").forEach(function (media) {
                tileMain = document.querySelector("ul.media-tiles") || document.querySelector("ul.tiles");
                tileMain.appendChild(media);
                media.querySelector("div.tile-desc").style.opacity = '1';
            });
            console.log("INFINITE SCROLL MEDIA PAGE " + PAGINA_ATUAL)
            EXEC_ONCE('imagePopSetup', ImagePopupSetup, 300);
            EXEC_ONCE('videoPopSetup', VideoPopupSetup, 300);

            EXEC_ONCE('createModButtons', GET_VISIBLE_BLOCKS, 300);
            canScroll = true;
        })
        .catch(error => {
            console.error('Erro ao buscar o HTML:', error);
        });

}