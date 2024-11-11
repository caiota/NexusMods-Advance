async function FETCH_FAVORITES_GAMES() {
    await fetch("https://www.nexusmods.com/GameFavourites?GetData", {
        method: "GET",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status == true && data.data && data.data.length > 0) {
                data.data.forEach(game => {
                    FAVORITE_GAMES.push(game.id);
                });
            }
        })
        .catch(error => {
            console.error('Houve um erro:', error);
        });
    GAME_LIST_REMAKE(GAMES);
}

async function SEARCH_GAME(ev) {
    const GAMES_PARAM_NEW = FIND_GAME_ON_GAMES(ev.value);
    const items = document.querySelectorAll("ul.improved_Gamelist li.image-tile");
    for (let i = 0; i < items.length; i++) {
        items[i].classList.add("HiddenGame");
    }
    GAMES_PARAM_NEW.forEach(game => {
        const gameElement = document.querySelector(`li[data-game-id='${game.id}']`);
        if (gameElement) {
            gameElement.classList.remove("HiddenGame");
        }
    });

}
async function FILTER_GAMES_LIST(GAMES_PARAM) {
    let inicio = performance.now();
    const ulElement = document.querySelector("ul.improved_Gamelist");
    ulElement.style.opacity = '0';
    const fragment = document.createDocumentFragment();

    // Usar um loop for tradicional
    for (let i = 0; i < GAMES_PARAM.length; i++) {
        const game = GAMES_PARAM[i];
        const gameElement = gameElementsMap.get(game.id);
        if (gameElement) {
            fragment.appendChild(gameElement); // Adiciona os elementos ao fragmento
        }
    }
    requestIdleCallback(() => {
        ulElement.replaceChildren(fragment); // Atualiza o DOM
        ulElement.style.opacity = '1'; // Mostra a lista novamente
    })

    let fim = performance.now();
    let tempoExecucao = fim - inicio;
    console.log(`FILTRO Executado em: ${tempoExecucao} ms`);
}
async function GAME_LIST_REMAKE(GAMES_PARAM = GAMES, search = false) {

    const path = new URL(SITE_URL).pathname;
    if ((search == true || document.querySelectorAll("div#games-list ul.game-tiles li.image-tile").length > 0) && options['GameBlock_Render'] == true) {
        let inicio = performance.now();
        const GAME_SHOW_MORE = document.querySelector("div.home-intro a#view_total_games,div.btn-more a.js-expand-games");
        if (GAME_SHOW_MORE) {
            if (GAME_SHOW_MORE || search == true) {
                GAME_SHOW_MORE.closest("div.btn-more").remove();
                document.querySelector("div#games-list ul.game-tiles").remove();
            }
            if (!FILTERS_SET) {

                document.querySelector("div.game-filter").style.display = "none";
                const FILTER_DIV = document.createElement("div");
                FILTER_DIV.classList = "game-filter flex clearfix"

                //SEARCH BAR
                const SEARCH_GAMES = document.createElement("input");
                SEARCH_GAMES.setAttribute("type", "text");
                SEARCH_GAMES.id = "improved_SearchGames";
                let timeoutId;
                SEARCH_GAMES.addEventListener("input", function (ev) {
                    const eveee = ev.currentTarget;
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => { SEARCH_GAME(eveee) }, 100);
                });

                //FILTER DROPDOWN
                const FILTER_DROPDOWN = document.createElement("select");
                FILTER_DROPDOWN.id = "improved_Filter";
                let dropdownOptions = [
                    { value: 'downloads', text: translate_strings.Filter_Dropdown_2.message },
                    { value: 'data', text: translate_strings.Filter_Dropdown_1.description },
                    { value: 'nome', text: translate_strings.Filter_Dropdown_1.message },
                    { value: 'mods', text: translate_strings.Filter_Dropdown_2.description },
                    { value: 'genre', text: translate_strings.Filter_Dropdown_3.message },
                    { value: 'collections', text: translate_strings.Filter_Dropdown_3.description },
                ];

                for (let i = 0; i < dropdownOptions.length; i++) {
                    let DROPDOWN_ELEMENT = dropdownOptions[i];
                    const option = document.createElement("option");
                    option.value = DROPDOWN_ELEMENT.value.toLowerCase().replace(/\s+/g, '_')
                    option.textContent = DROPDOWN_ELEMENT.text;
                    FILTER_DROPDOWN.appendChild(option);
                }

                FILTER_DROPDOWN.addEventListener("change", async (event) => {

                    const selectedValue = event.target.value;

                    // Ordenar a lista de acordo com o valor selecionado
                    if (selectedValue === "downloads") {
                        GAMES_PARAM.sort((a, b) => b.downloads - a.downloads);
                    } else if (selectedValue === "data") {
                        GAMES_PARAM.sort((a, b) => b.approved_date - a.approved_date);
                    } else if (selectedValue === "nome") {
                        GAMES_PARAM.sort((a, b) => a.name.localeCompare(b.name));
                    } else if (selectedValue === "mods") {
                        GAMES_PARAM.sort((a, b) => b.mods - a.mods);
                    } else if (selectedValue === "genre") {
                        GAMES_PARAM.sort((a, b) => a.genre.localeCompare(b.genre));
                    } else if (selectedValue === "collections") {
                        GAMES_PARAM.sort((a, b) => b.collections - a.collections);
                    }
                    FILTER_SEARCHTYPE.value = 'desc'
                    await FILTER_GAMES_LIST(GAMES_PARAM);

                });

                const FILTER_SEARCHTYPE = document.createElement("select");
                FILTER_SEARCHTYPE.id = "improved_SubFilter";
                const option_asc = document.createElement("option");
                option_asc.value = "asc"
                option_asc.textContent = "ASC"
                const option_desc = document.createElement("option");
                option_desc.value = "desc"
                option_desc.textContent = "DESC"
                FILTER_SEARCHTYPE.appendChild(option_desc)
                FILTER_SEARCHTYPE.appendChild(option_asc)

                FILTER_SEARCHTYPE.addEventListener("change", async (event) => {
                    const selectedValue = event.target.value;
                    if (selectedValue == "asc") {
                        GAMES_PARAM.reverse();
                    } else {
                        GAMES_PARAM.reverse();
                    }

                    await FILTER_GAMES_LIST(GAMES_PARAM);
                });

                FILTER_DIV.appendChild(SEARCH_GAMES)
                FILTER_DIV.appendChild(FILTER_DROPDOWN)
                FILTER_DIV.appendChild(FILTER_SEARCHTYPE)
                document.querySelector("div#games-list").prepend(FILTER_DIV);
                GAMES_PARAM.sort((a, b) => b.downloads - a.downloads);

                divDetails = document.createElement("div");
                divDetails.classList = "Advance_gameDetails";
                const gameDownloads = document.createElement("span");
                gameDownloads.id = "downloads_span"

                const gameMods = document.createElement("span");
                gameMods.id = "mods_span"

                const gameType = document.createElement("span");
                gameType.id = "genre_span"

                const gameCollections = document.createElement("span");
                gameCollections.id = "collections_span"

                const gameFiles = document.createElement("span");
                gameFiles.id = "files_span"

                const gameDate = document.createElement("span");
                gameDate.id = "date_span"

                divDetails.appendChild(gameType);
                divDetails.appendChild(gameDownloads);
                divDetails.appendChild(gameMods);
                divDetails.appendChild(gameCollections);
                divDetails.appendChild(gameFiles);
                divDetails.appendChild(gameDate);
                document.body.appendChild(divDetails);
                FILTERS_SET = true;
            }

            console.log("Renderizando " + GAMES_PARAM.length + " Games")
            //CREATE NEW RENDER IMPROVED LIST :D
            const modList = document.createElement("ul")
            modList.classList = "improved_Gamelist tiles game-tiles";
            document.querySelector("div#games-list div.game-section").appendChild(modList);

            async function processBatch(data, batchSize = 200) {
                let index = 0;
                async function processNextBatch() {
                    const fragment = document.createDocumentFragment();
                    const end = Math.min(index + batchSize, data.length);
                    for (let i = index; i < end; i++) {
                        const item = data[i];

                        let favorited = false;
                        if (FAVORITE_GAMES) {
                            favorited = FAVORITE_GAMES.includes(item.id);
                        } else {
                            favorited = false;
                        }
                        //GENERATE GAME BY GAME WITH A 500 GAMES LIMIT TO NOT KILL YOUR CPU :D
                        const GAME_AAAAAAAA = document.createElement("a");
                        GAME_AAAAAAAA.classList = "mod-image";
                        GAME_AAAAAAAA.href = item.nexusmods_url;

                        const GAME_LI = document.createElement("li");
                        GAME_LI.classList = "image-tile fill-game-downloads";
                        GAME_LI.setAttribute("id", "game-tile-" + item.id);
                        GAME_LI.setAttribute("favorited", favorited);
                        GAME_LI.setAttribute("data-game-id", item.id);

                        const GAME_TITLE = document.createElement("p")
                        GAME_TITLE.classList = 'tile-name';
                        GAME_TITLE.innerText = item.name;

                        const GAME_IMG = document.createElement("img");
                        GAME_IMG.classList = 'lazy game_cover';
                        GAME_IMG.width = "400";
                        GAME_IMG.height = "225";
                        GAME_IMG.alt = item.name;
                        GAME_IMG.src = "https://www.nexusmods.com/assets/images/default/tile_empty.png";
                        GAME_IMG.setAttribute("lazyload", true);
                        GAME_IMG.setAttribute("data-src", "https://staticdelivery.nexusmods.com/Images/games/4_3/tile_" + item.id + ".jpg");

                        const imageObserver = new IntersectionObserver((entries, observer) => {
                            entries.forEach(async entry => {
                                if (entry.isIntersecting) {
                                    const img = entry.target.querySelector("img");
                                    GAME_IMG.setAttribute("onerror", "imgError(this, 'https://www.nexusmods.com/assets/images/default/tile_empty.png')");
                                    img.src = img.getAttribute('data-src');
                                    img.removeAttribute('data-src');
                                    entry.target.setAttribute("LOADABLE", true);
                                    imageObserver.disconnect();
                                    observer.unobserve(img);
                                    requestAnimationFrame(()=>{DetailedGameList(entry.target);});
                                }
                            });
                        });

                        GAME_LI.appendChild(GAME_AAAAAAAA);
                        GAME_AAAAAAAA.appendChild(GAME_IMG);
                        GAME_AAAAAAAA.appendChild(GAME_TITLE);
                        fragment.appendChild(GAME_LI);
                        //modList.appendChild(GAME_LI);
                        imageObserver.observe(GAME_LI)
                    }
                    requestAnimationFrame(()=>{modList.appendChild(fragment);});

                    index = end;
                    if (index < data.length) {
                        requestIdleCallback(processNextBatch);
                    } else {
                        BUSY_LIST_REMAKE = false;
                        GAMES_PARAM.forEach((game) => {
                            const gameElement = document.querySelector(`li[data-game-id='${game.id}']`);
                            if (gameElement) {
                                gameElementsMap.set(game.id, gameElement);
                            }
                        });

                        document.querySelector("ul.improved_Gamelist").addEventListener('mouseout', (event) => {
                            const game = event.target.closest("li.image-tile");
                            if (!game) return;
                            if (!game.contains(event.relatedTarget)) {
                                divDetails.style.visibility = 'hidden';
                                divDetails.style.opacity = '0';
                            }
                        });
                        document.querySelector("ul.improved_Gamelist").addEventListener('mousemove', (event) => {
                            // Apenas processa a atualização da posição se não estiver em throttle
                            if (!isThrottling) {
                                // Define a flag para sinalizar que estamos em throttle
                                isThrottling = true;

                                // Usa o requestAnimationFrame para agendar a atualização da posição
                                requestAnimationFrame(() => {
                                    const game = event.target.closest("li.image-tile");
                                    if (game && divDetails) {
                                        divDetails.style.left = GLOBAL_MOUSE_X + 30 + "px";  // Utilize `event.pageX` para a posição X
                                        divDetails.style.top = GLOBAL_MOUSE_Y + 30 + "px";    // Utilize `event.pageY` para a posição Y
                                    }
                                    // Reseta a flag após o ciclo de animação
                                    isThrottling = false;
                                });
                            }
                        });

                        document.querySelector("ul.improved_Gamelist").addEventListener('mouseover', (event) => {
                            const game = event.target.closest("li.image-tile");
                            if (game && game.getAttribute("downloads") != null) {
                                divDetails.querySelector("span#downloads_span").innerHTML = '<i class="fa-solid fa-cloud-arrow-down" aria-hidden="true"></i> ' + game.getAttribute("downloads") + translate_strings.GameDetails_downloads.message;
                                divDetails.querySelector("span#mods_span").innerHTML = '<i class="fa-solid fa-gears" aria-hidden="true"></i> ' + game.getAttribute("mods") + translate_strings.GameDetails_mods.message;
                                divDetails.querySelector("span#genre_span").innerHTML = '<i class="fa-solid fa-gamepad" aria-hidden="true"></i> ' + translate_strings.GameDetails_genre.message + " " + game.getAttribute("genre");
                                divDetails.querySelector("span#collections_span").innerHTML = '<i class="fa-solid fa-book-open" aria-hidden="true"></i> ' + game.getAttribute("collections") + translate_strings.GameDetails_collections.message;
                                divDetails.querySelector("span#files_span").innerHTML = '<i class="fa-solid fa-folder-open" aria-hidden="true"></i> ' + game.getAttribute("file_count") + translate_strings.GameDetails_files.message;
                                divDetails.querySelector("span#date_span").innerHTML = '<i class="fa-solid fa-clock" aria-hidden="true"></i> ' + translate_strings.GameDetails_date.message + game.getAttribute("game_date");
                                divDetails.style.visibility = 'visible';
                                divDetails.style.opacity = '1';
                            }
                        }, true);
                        console.log("Processo Completo");
                    }
                }

                processNextBatch();
            }

            processBatch(GAMES_PARAM);

            let fim = performance.now();
            let tempoExecucao = parseInt(fim - inicio);
            CreateNotificationContainer(`RENDERING ${GAMES.length} GAMES AND SUB-ELEMENTS TOOK: ${tempoExecucao} ms`, "success", null, 7000)
        }
    } else {
        if ((SITE_URL.indexOf("nexusmods.com/games") != -1 || path == "/" || path == "/games") && options['GameBlock_Render'] == true && search == false) {
            setTimeout(() => { GAME_LIST_REMAKE(GAMES, false); }, 1000);
        } else {
            BUSY_LIST_REMAKE = false;
        }
    }

}
function FAVORITE_GAME_REMOVE(ev) {
    ev.currentTarget.classList = "fa-regular fa-heart"
    FAVORITE_GAME(ev.currentTarget.getAttribute("game_id"), "REMOVE", ev.currentTarget.getAttribute("game_name"));
    ev.currentTarget.removeEventListener("click", FAVORITE_GAME_REMOVE);
    ev.currentTarget.addEventListener("click", FAVORITE_GAME_ADD);
}
function FAVORITE_GAME_ADD(ev) {
    ev.currentTarget.classList = "fa-solid fa-heart"
    FAVORITE_GAME(ev.currentTarget.getAttribute("game_id"), "ADD", ev.currentTarget.getAttribute("game_name"));
    ev.currentTarget.removeEventListener("click", FAVORITE_GAME_ADD);
    ev.currentTarget.addEventListener("click", FAVORITE_GAME_REMOVE);
}
async function DetailedGameList(game_item) {
    if (!game_item.querySelector("#favoritePop")) {
        const addMod_action = document.createElement("i");
        addMod_action.id = "AddMod_Pop"
        const favorite_action = document.createElement("i");
        const favorite_status = game_item.getAttribute("favorited");
        addMod_action.classList = "fa-solid fa-square-plus";
        addMod_action.setAttribute("aria-hidden", true);
        addMod_action.setAttribute("game_id", game_item.getAttribute("data-game-id"));
        addMod_action.setAttribute("game_name", game_item.querySelector("img").getAttribute("alt"));
        addMod_action.addEventListener("click", (ev) => {
            ev.preventDefault();
            const link = ev.currentTarget.closest("li").querySelector("a").href;
            if (link) {
                window.location.href = link + "/mods/add?NM_ADVANCERELOAD=false"
            }
        })

        favorite_action.setAttribute("aria-hidden", true);
        favorite_action.setAttribute("game_id", game_item.getAttribute("data-game-id"));
        favorite_action.setAttribute("game_name", game_item.querySelector("img").getAttribute("alt"));
        if (favorite_status == "true") {
            favorite_action.classList = "fa-solid fa-heart";
            favorite_action.title = "Remove Favorite " + game_item.querySelector("img").getAttribute("alt");
            favorite_action.addEventListener("click", FAVORITE_GAME_REMOVE);
        } else {
            favorite_action.classList = "fa-regular fa-heart";
            favorite_action.title = "Favorite " + game_item.querySelector("img").getAttribute("alt");
            favorite_action.addEventListener("click", FAVORITE_GAME_ADD)
        }
        favorite_action.id = "favoritePop";
        game_item.prepend(favorite_action);
        game_item.prepend(addMod_action);
    }
    if (options['DetailGameBlocks'] == true && game_item) {
        const game = game_item;
        let GAME_DATABASE = gameMap.get(Number(game.getAttribute("data-game-id")));
        if (GAME_DATABASE) {
            game.setAttribute("downloads", formatNumber(GAME_DATABASE.downloads))
            game.setAttribute("mods", formatNumber(GAME_DATABASE.mods))
            game.setAttribute("genre", GAME_DATABASE.genre)
            game.setAttribute("collections", formatNumber(GAME_DATABASE.collections))
            game.setAttribute("game_date", formatDate(GAME_DATABASE.approved_date))
            game.setAttribute("file_count", formatNumber(GAME_DATABASE.file_count))

        }
        game.classList.add("HideGameDetails");
        game.setAttribute("new_list", true);

    }

}

function FAVORITE_GAME(GAMEID, type, gameName) {
    let fav_url;
    let post_header = "game_id=" + GAMEID;
    if (type == "ADD") {
        fav_url = "https://www.nexusmods.com/GameFavourites?Add";
        post_header = "game_id=" + GAMEID;
    } else {
        fav_url = "https://www.nexusmods.com/GameFavourites?Remove";
        post_header = "game_id_to_delete=" + GAMEID;
    }
    fetch(fav_url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Brave\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
            "sec-ch-ua-arch": "\"x86\"",
            "sec-ch-ua-bitness": "\"64\"",
            "sec-ch-ua-full-version-list": "\"Brave\";v=\"129.0.0.0\", \"Not=A?Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"129.0.0.0\"",
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
        "referrer": "https://www.nexusmods.com/games",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": post_header,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => {
            // Verifica se a resposta é ok (status 200-299)
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
            }
            // Tenta converter a resposta para JSON
            return response.json();
        })
        .then(data => {
            if (data && data.status == true) {
                if (type == "ADD") {
                    CreateNotificationContainer(gameName + "<br>" + translate_strings.Favorite_Game.message, "success", "fa-solid fa-heart", 4000);
                } else {
                    CreateNotificationContainer(gameName + "<br>" + translate_strings.Favorite_Game.description, "warning", "fa-solid fa-heart-circle-minus", 4000);
                }

            }
        })
        .catch(error => {
            // Lida com erros de rede ou de conversão
            console.error('Houve um erro:', error);
        });

}