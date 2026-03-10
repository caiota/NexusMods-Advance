async function CreateAdvancedSearchButton() {
    try {
        if (!document.querySelector("div#advancedSearch") && document.querySelector("div.nav-interact-buttons")) {
            const div = document.createElement("div");
            div.id = "advancedSearch"
            div.classList = "nav-interact rj-profile-pic";
            const img = document.createElement("img");
            img.src = chrome.runtime.getURL("icon.png");;
            div.appendChild(img);
            div.classList.add("searchDisabled");
            document.querySelector("div.nav-interact-buttons").appendChild(div);

            gameNameFull = new URL(SITE_URL);
            gameNameFull = findNameByDomainName(gameNameFull.pathname.split("/")[1]);
            if (gameNameFull && SITE_URL.indexOf("/collections") == -1) {
                document.querySelector("div#advancedSearch").classList.remove("searchDisabled");
                document.querySelector("div#advancedSearch").addEventListener("click", Website_FullSearch);
                if (SITE_URL.indexOf("advancedSearch=true") != -1) {
                    Website_FullSearch();
                    const url = new URL(SITE_URL);
                    url.searchParams.delete('advancedSearch');
                    window.history.replaceState({}, document.title, url);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

function SelectItem(item) {
    item = item.currentTarget;
    if (item.nodeName.toLocaleLowerCase() == "button") {
        document.querySelector("div#FullSearch_SubFilter button#active").id = "";
        const games_tab = document.querySelector("div#SubTab_Games");
        const mods_tab = document.querySelector("div#SubTab_Mods");
        const collections_tab = document.querySelector("div#SubTab_Collections");
        const images_tab = document.querySelector("div#SubTab_Images");
        const videos_tab = document.querySelector("div#SubTab_Videos");
        item.id = "active";
        CURRENT_TAB = item.getAttribute("data")

        switch (CURRENT_TAB) {
            case "all_itens": {
                console.log(item);
                games_tab.style.display = "block";
                mods_tab.style.display = "block";
                collections_tab.style.display = "block";
                images_tab.style.display = "block";
                videos_tab.style.display = "block";
                SubTab_GameRenderer(document.querySelector("input#FullSearch_Bar").value, 12);
                FirstTime_SubTab_CollectionsRenderer(12);
                FirstTime_SubTab_ModsRenderer(5);
                FirstTime_SubTab_ImagesRenderer(5);
                FirstTime_SubTab_VideosRenderer(5);
                break;
            }
            case "games": {
                games_tab.style.display = "block";
                mods_tab.style.display = "none";
                collections_tab.style.display = "none";
                images_tab.style.display = "none";
                videos_tab.style.display = "none";
                SubTab_GameRenderer(document.querySelector("input#FullSearch_Bar").value, 40);
                break;
            }
            case "mods": {
                FirstTime_SubTab_ModsRenderer(20);
                games_tab.style.display = "none";
                mods_tab.style.display = "block";
                collections_tab.style.display = "none";
                images_tab.style.display = "none";
                videos_tab.style.display = "none";
                SubTab_GameRenderer(document.querySelector("input#FullSearch_Bar").value, 12);
                break;
            }
            case "collections": {
                games_tab.style.display = "none";
                mods_tab.style.display = "none";
                collections_tab.style.display = "block";
                images_tab.style.display = "none";
                videos_tab.style.display = "none";
                SubTab_GameRenderer(document.querySelector("input#FullSearch_Bar").value, 12);
                FirstTime_SubTab_CollectionsRenderer(40);
                break;
            }
            case "images": {
                games_tab.style.display = "none";
                mods_tab.style.display = "none";
                collections_tab.style.display = "none";
                images_tab.style.display = "block";
                videos_tab.style.display = "none";
                SubTab_GameRenderer(document.querySelector("input#FullSearch_Bar").value, 12);
                FirstTime_SubTab_ImagesRenderer(20);
                break;
            }
            case "videos": {
                games_tab.style.display = "none";
                mods_tab.style.display = "none";
                collections_tab.style.display = "none";
                images_tab.style.display = "none";
                videos_tab.style.display = "block";
                SubTab_GameRenderer(document.querySelector("input#FullSearch_Bar").value, 12);
                FirstTime_SubTab_VideosRenderer(20);
                break;
            }
        }

    }
}
async function Website_FullSearch() {
    if (!document.querySelector("div#FullSearch_PopUp")) {
        const div = document.createElement("div");
        div.id = "FullSearch_PopUp"
        const backgroundClickable = document.createElement("div");
        backgroundClickable.id = "Background_Close_Clickable";
        backgroundClickable.appendChild(div);
        backgroundClickable.addEventListener("click", (ev) => {
            if (ev.target === backgroundClickable) {
                backgroundClickable.style.display = 'none';
            }
        });
        document.body.appendChild(backgroundClickable);

        gameNameFull = new URL(SITE_URL);
        gameNameFull = findNameByDomainName(gameNameFull.pathname.split("/")[1]);
        const fullSearchBar = document.createElement("input");
        fullSearchBar.setAttribute("placeholder", translate_strings.AdvancedSearch_SearchBar.message)
        fullSearchBar.id = "FullSearch_Bar";
        fullSearchBar.addEventListener("input", async (ev) => {
            if (filter_Games) {
                filter_Games.click();
                SubTab_GameRenderer(ev.currentTarget.value, 60);
            }
        })
        div.appendChild(fullSearchBar)

        const subFilters = document.createElement("div");
        subFilters.id = "FullSearch_SubFilter";
        const all_itens = document.createElement("button");
        all_itens.id = "active"
        all_itens.innerText = translate_strings.AdvancedSearchOption_AllContent.message;
        all_itens.setAttribute("data", "all_itens");
        const filter_Games = document.createElement("button");
        filter_Games.setAttribute("data", "games");
        filter_Games.innerText = translate_strings.AdvancedSearchOption_Games.message;
        const filter_Mods = document.createElement("button");
        filter_Mods.setAttribute("data", "mods");
        filter_Mods.innerText = "Mods";
        const filter_Collections = document.createElement("button");
        filter_Collections.setAttribute("data", "collections");
        filter_Collections.innerText = translate_strings.AdvancedSearchOption_Collections.message;
        const filter_Images = document.createElement("button");
        filter_Images.setAttribute("data", "images");
        filter_Images.innerText = translate_strings.AdvancedSearchOption_Images.message;
        const filter_videos = document.createElement("button");
        filter_videos.setAttribute("data", "videos");
        filter_videos.innerText = translate_strings.AdvancedSearchOption_Videos.message;
        all_itens.addEventListener("click", SelectItem)
        filter_Mods.addEventListener("click", SelectItem)
        filter_Games.addEventListener("click", SelectItem)
        filter_Collections.addEventListener("click", SelectItem)
        filter_Images.addEventListener("click", SelectItem)
        filter_videos.addEventListener("click", SelectItem)
        subFilters.append(all_itens, filter_Mods, filter_Games, filter_Collections, filter_Images, filter_videos);
        div.appendChild(subFilters);

        const subTabs = document.createElement("div");
        subTabs.id = "FullSearch_SubTabLayout";
        const subTab_games = document.createElement("div");
        subTab_games.id = "SubTab_Games"
        const subTab_gamesLabel = document.createElement("a");
        subTab_gamesLabel.href = "https://nexusmods.com/games"
        subTab_gamesLabel.classList = "SubTab_Label";
        subTab_gamesLabel.innerHTML = translate_strings.AdvancedSearchOption_Games.message+" <i class='fa-solid fa-arrow-right'></i>";
        subTab_games.appendChild(subTab_gamesLabel);
        const gamesContent = document.createElement("div");
        gamesContent.classList = "subItem_content";
        gamesContent.addEventListener("click", (ev) => {
            const item = ev.target;
            if (item.id == "GameBlock_SubResult") {
                window.location.href = item.getAttribute("targetUrl")
            }
        })
        subTab_games.appendChild(gamesContent);

        const subTab_mods = document.createElement("div");
        subTab_mods.id = "SubTab_Mods"
        const subTab_modsLabel = document.createElement("a");
        let CURRENT_URL = new URL(window.location.href);
        CURRENT_URL = CURRENT_URL.pathname.split('/')[1];
        subTab_modsLabel.href = "https://www.nexusmods.com/" + CURRENT_URL;
        subTab_modsLabel.classList = "SubTab_Label";
        subTab_modsLabel.innerHTML = gameNameFull + " - Mods <i class='fa-solid fa-arrow-right'></i>";
        subTab_mods.appendChild(subTab_modsLabel);
        const modsContent = document.createElement("div");
        modsContent.classList = "subItem_content";
        modsContent.id = "subItem_content_Mods";
        subTab_mods.appendChild(modsContent);
        modsContent.addEventListener("click", (ev) => {
            const item = ev.target.closest(".SubItem_modBlock");
            if (item) {
                window.location.href = item.getAttribute("targetUrl");
            }
        });

        const subTab_collections = document.createElement("div");
        subTab_collections.id = "SubTab_Collections"
        const subTab_collectionsLabel = document.createElement("a");
        subTab_collectionsLabel.href = "https://next.nexusmods.com/" + CURRENT_URL + "/collections";
        subTab_collectionsLabel.classList = "SubTab_Label";
        subTab_collectionsLabel.innerHTML = gameNameFull + " - "+translate_strings.AdvancedSearchOption_Collections.message+" <i class='fa-solid fa-arrow-right'></i>";
        subTab_collections.appendChild(subTab_collectionsLabel);
        const CollectionsContent = document.createElement("div");
        CollectionsContent.classList = "subItem_content";
        CollectionsContent.id = "subItem_contentCollections"
        subTab_collections.appendChild(CollectionsContent);

        CollectionsContent.addEventListener("click", (ev) => {
            const item = ev.target.closest("#CollectionBlock_SubResult");
            if (item) {
                window.location.href = item.getAttribute("targetUrl");
            }
        });

        const subTab_images = document.createElement("div");
        subTab_images.id = "SubTab_Images"
        const subTab_imagesLabel = document.createElement("a");

        subTab_imagesLabel.href = "https://www.nexusmods.com/" + CURRENT_URL + "/images/recentlyendorsed";
        subTab_imagesLabel.classList = "SubTab_Label";
        subTab_imagesLabel.innerHTML = gameNameFull + " - "+translate_strings.AdvancedSearchOption_Images.message+" <i class='fa-solid fa-arrow-right'></i>";
        subTab_images.appendChild(subTab_imagesLabel);
        const ImagesContent = document.createElement("div");
        ImagesContent.classList = "subItem_content";
        subTab_images.appendChild(ImagesContent);
        ImagesContent.addEventListener("click", (ev) => {
            const item = ev.target.closest("#ImageBlock_SubResult");
            if (item) {
                window.location.href = item.getAttribute("targetUrl");
            }
        });

        const subTab_videos = document.createElement("div");
        subTab_videos.id = "SubTab_Videos"
        const subTab_videosLabel = document.createElement("a");
        subTab_videosLabel.href = "https://www.nexusmods.com/" + CURRENT_URL + "/videos/recentlyendorsed";
        subTab_videosLabel.classList = "SubTab_Label";
        subTab_videosLabel.innerHTML = gameNameFull + " - "+translate_strings.AdvancedSearchOption_Videos.message+" <i class='fa-solid fa-arrow-right'></i>";
        subTab_videos.appendChild(subTab_videosLabel);
        const VideosContent = document.createElement("div");
        VideosContent.classList = "subItem_content";
        subTab_videos.appendChild(VideosContent);
        VideosContent.addEventListener("click", (ev) => {
            const item = ev.target.closest("#VideoBlock_SubResult");
            if (item) {
                window.location.href = item.getAttribute("targetUrl");
            }
        });

        subTab_games.classList = "SubTab_Item"
        subTab_mods.classList = "SubTab_Item"
        subTab_collections.classList = "SubTab_Item"
        subTab_images.classList = "SubTab_Item"
        subTab_videos.classList = "SubTab_Item"

        subTabs.append(subTab_games, subTab_mods, subTab_collections, subTab_images, subTab_videos);
        div.appendChild(subTabs);
        await SubTab_GameRenderer("", 12);
        await FirstTime_SubTab_ModsRenderer(5);
        await FirstTime_SubTab_CollectionsRenderer(12);
        await FirstTime_SubTab_ImagesRenderer(5);
        await FirstTime_SubTab_VideosRenderer(5);
    } else {
        document.querySelector("div#Background_Close_Clickable").style.display = 'flex';
    }
}

let videosHtml = null;
async function FirstTime_SubTab_VideosRenderer(max = 5) {
    const renderVideos = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Seleciona os tiles de vídeos e mapeia os dados
        const videosTiles = Array.from(doc.body.querySelectorAll('ul.tiles li.video-tile')).slice(0, max);
        const videosData = videosTiles.map(tile => {
            const videoLink = tile.querySelector('a.mod-image')?.href || '';
            const authorName = tile.querySelector('div.author')?.textContent.trim() || '';
            const videoSrc = tile.querySelector('div.fore_div img')?.src || '';
            const postTitle = tile.querySelector('p.tile-name')?.textContent.trim() || '';

            return {
                author: authorName,
                videoLink: videoLink,
                videoSrc: videoSrc,
                postTitle: postTitle,
            };
        });

        // Renderizar os vídeos na interface
        const modsMain = document.querySelector("div#SubTab_Videos div.subItem_content");
        modsMain.innerHTML = "";
        videosData.forEach(function (videoItem) {
            const videoDiv = document.createElement("div");
            videoDiv.id = "VideoBlock_SubResult";
            videoDiv.setAttribute("targetUrl", videoItem.videoLink);

            const videoImage = document.createElement("img");
            videoImage.src = videoItem.videoSrc;

            const title = document.createElement("p");
            title.id = "subVideo_title";
            title.innerText = videoItem.postTitle;

            const author = document.createElement("span");
            author.id = "subVideo_author";
            author.innerText = videoItem.author;

            const infoDiv = document.createElement("div");
            infoDiv.id = "subInfo_Div";
            infoDiv.append(title, author);

            videoDiv.append(videoImage, infoDiv);
            modsMain.appendChild(videoDiv);
        });
    };

    if (videosHtml) {
        // Se o HTML já estiver cacheado, renderiza diretamente
        renderVideos(videosHtml);
    } else {
        // Caso contrário, faz a requisição e cacheia o resultado
        fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/VideoList?RH_VideoList=user_id:0,nav:false,game_id:" + gameId + ",sort_by:rating,order:DESC,time:14,page_size:20,show_hidden:false,page:1", {
            headers: {
                "accept": "text/html, */*; q=0.01",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Brave\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-arch": "\"x86\"",
                "sec-ch-ua-bitness": "\"64\"",
                "sec-ch-ua-full-version-list": "\"Chromium\";v=\"130.0.0.0\", \"Brave\";v=\"130.0.0.0\", \"Not?A_Brand\";v=\"99.0.0.0\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-model": "\"\"",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-ch-ua-platform-version": "\"15.0.0\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-requested-with": "XMLHttpRequest"
            },
            referrer: "https://www.nexusmods.com/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include"
        })
            .then(response => response.text())
            .then(html => {
                videosHtml = html; // Cacheia o HTML recebido
                renderVideos(videosHtml);
            })
            .catch(error => {
                console.error('Erro ao processar o HTML:', error);
            });
    }
}

let imagesHtml = null;

async function FirstTime_SubTab_ImagesRenderer(max = 5) {
    const renderImages = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Seleciona os tiles de imagens e mapeia os dados
        const imagesTiles = Array.from(doc.body.querySelectorAll('ul.tiles li.image-tile')).slice(0, max);
        const imagesData = imagesTiles.map(tile => {
            const imageLink = tile.querySelector('a.mod-image')?.href || '';
            const authorName = tile.querySelector('div.author')?.textContent.trim() || '';
            const imageSrc = tile.querySelector('div.fore_div img.fore')?.src || '';
            const postTitle = tile.querySelector('p.tile-name')?.textContent.trim() || '';

            return {
                author: authorName,
                imageLink: imageLink,
                imageSrc: imageSrc,
                postTitle: postTitle,
            };
        });

        // Renderizar as imagens na interface
        const modsMain = document.querySelector("div#SubTab_Images div.subItem_content");
        modsMain.innerHTML = "";
        imagesData.forEach(function (imageItem) {
            const imageDiv = document.createElement("div");
            imageDiv.id = "ImageBlock_SubResult";
            imageDiv.setAttribute("targetUrl", imageItem.imageLink);

            const imageImage = document.createElement("img");
            imageImage.src = imageItem.imageSrc;

            const title = document.createElement("p");
            title.id = "subImage_title";
            title.innerText = imageItem.postTitle;

            const author = document.createElement("span");
            author.id = "subImage_author";
            author.innerText = imageItem.author;

            imageDiv.append(imageImage, title, author);
            modsMain.appendChild(imageDiv);
        });
    };

    if (imagesHtml) {
        // Se o conteúdo já estiver cacheado, renderiza diretamente
        renderImages(imagesHtml);
    } else {
        // Caso contrário, faz a requisição e cacheia o resultado
        fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ImageList?RH_ImageList=user_id:0,nav:false,game_id:" + gameId + ",sort_by:rating,order:DESC,time:14,page_size:20,show_hidden:false,page:1", {
            headers: {
                "accept": "text/html, */*; q=0.01",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Brave\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-arch": "\"x86\"",
                "sec-ch-ua-bitness": "\"64\"",
                "sec-ch-ua-full-version-list": "\"Chromium\";v=\"130.0.0.0\", \"Brave\";v=\"130.0.0.0\", \"Not?A_Brand\";v=\"99.0.0.0\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-model": "\"\"",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-ch-ua-platform-version": "\"15.0.0\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-requested-with": "XMLHttpRequest"
            },
            referrer: "https://www.nexusmods.com/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include"
        })
            .then(response => response.text())
            .then(html => {
                imagesHtml = html; // Cacheia o HTML recebido
                renderImages(imagesHtml);
            })
            .catch(error => {
                console.error('Erro ao processar o HTML:', error);
            });
    }
}

let collections = null;
async function FirstTime_SubTab_CollectionsRenderer(max = 12) {
    const renderCollections = (collections) => {
        const collectionMain = document.querySelector("div#SubTab_Collections div.subItem_content");
        collectionMain.innerHTML = "";

        collections.slice(0, max).forEach((collection) => {
            if (collection?.slug) {
                const collectionDiv = document.createElement("div");
                collectionDiv.id = "CollectionBlock_SubResult";
                collectionDiv.setAttribute("targetUrl", `https://next.nexusmods.com/${fingGameNameByID(gameId)}/collections/${collection.slug}`);

                const collectionName = document.createElement("span");
                const collectionImg = document.createElement("img");
                collectionImg.setAttribute("draggable", false);
                collectionImg.src = collection.tileImage.thumbnailUrl;
                collectionName.innerText = collection.name;

                collectionDiv.append(collectionImg, collectionName);
                collectionMain.appendChild(collectionDiv);
            }
        });
    };

    if (!collections) {
        chrome.runtime.sendMessage({
            action: 'fetch_collections',
            game: findGameById(gameId)
        }, function (response) {
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
            } else if (response?.success) {
                collections = response.message;
                renderCollections(collections);
            } else {
                console.error("Error in response:", response.error);
            }
        });
    } else {
        renderCollections(collections);
    }
}

let modsHtml = null;

async function FirstTime_SubTab_ModsRenderer(max = 5) {
    const renderMods = (html) => {
        // Cria um DOMParser para processar o HTML recebido
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Seleciona os primeiros 20 li.mod-tile
        const modTiles = Array.from(doc.querySelectorAll('li.mod-tile')).slice(0, max);

        // Mapeia os dados necessários para um array de objetos
        const modsData = modTiles.map(tile => {
            const modViewLink = tile.querySelector('a.mod-view')?.href || '';
            const modName = tile.querySelector('p.tile-name a')?.textContent.trim() || '';
            const modImage = tile.querySelector('div.fore_div_mods img.fore')?.src || '';
            const authorLink = tile.querySelector('div.author a')?.href || '';
            const authorName = tile.querySelector('div.author a')?.textContent.trim() || '';

            return {
                modName: modName,
                modViewLink: modViewLink,
                modImage: modImage,
                authorName: authorName,
                authorLink: authorLink
            };
        });

        // Renderizar os mods na interface
        const modsMain = document.querySelector("div#SubTab_Mods div.subItem_content");
        modsMain.innerHTML = "";

        modsData.forEach(function (mod) {
            const modBlock = document.createElement("div");
            modBlock.setAttribute("targetUrl", mod.modViewLink);
            modBlock.classList = "SubItem_modBlock";

            const modImg = document.createElement("img");
            modImg.src = mod.modImage;

            const modName = document.createElement("div");
            modName.id = "SubItem_modName";
            modName.innerText = mod.modName;

            const authorName = document.createElement("div");
            authorName.id = "SubItem_autorName";
            authorName.innerText = mod.authorName;

            modBlock.append(modImg, modName, authorName);
            modsMain.appendChild(modBlock);
        });
    };

    if (modsHtml) {
        // Se já há conteúdo cacheado, renderiza diretamente
        renderMods(modsHtml);
    } else {
        // Caso contrário, realiza a requisição e cacheia o resultado
        fetch("https://www.nexusmods.com/" + fingGameNameByID(gameId) + "/mods/popular/?nav=0&page_size=15", {
            headers: {
                "accept": "text/html, */*; q=0.01",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Brave\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-arch": "\"x86\"",
                "sec-ch-ua-bitness": "\"64\"",
                "sec-ch-ua-full-version-list": "\"Chromium\";v=\"130.0.0.0\", \"Brave\";v=\"130.0.0.0\", \"Not?A_Brand\";v=\"99.0.0.0\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-model": "\"\"",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-ch-ua-platform-version": "\"15.0.0\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "sec-gpc": "1",
                "x-requested-with": "XMLHttpRequest"
            },
            referrer: "https://www.nexusmods.com/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include"
        })
            .then(response => response.text())
            .then(html => {
                modsHtml = html; // Cacheia o HTML recebido
                renderMods(modsHtml);
            })
            .catch(error => {
                console.error('Erro ao processar o HTML:', error);
            });
    }
}

async function SubTab_GameRenderer(vale, max = 12) {
    if (CURRENT_TAB == "games") {
        max = 40;
    }
    const game_result = FIND_GAME_ON_GAMES(vale);
    const gameMain = document.querySelector("div#SubTab_Games div.subItem_content");
    gameMain.innerHTML = "";
    for (var i = 0; i < max; i++) {
        const GAME_BLOCK = game_result[i];
        if (GAME_BLOCK && GAME_BLOCK.id) {

            const gameDiv = document.createElement("div");
            gameDiv.id = "GameBlock_SubResult"
            gameDiv.setAttribute("targetUrl", GAME_BLOCK.nexusmods_url + "?advancedSearch=true")
            const gameName = document.createElement("span");
            const gameImg = document.createElement("img");
            gameImg.setAttribute("draggable", false);
            gameImg.src = "https://staticdelivery.nexusmods.com/Images/games/4_3/tile_" + GAME_BLOCK.id + ".jpg";
            gameName.innerText = GAME_BLOCK.name
            gameDiv.append(gameImg, gameName);
            gameMain.appendChild(gameDiv);
        }
    }
}