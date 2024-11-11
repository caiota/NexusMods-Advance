async function REMAKE_ADDMODS_LIST() {
    if (
        SITE_URL.indexOf("https://www.nexusmods.com/mods/add") != -1 &&
        GAMES.length > 0 &&
        !document.querySelector("div.container div#BetterGameList") &&
        !SITE_URL.includes("NM_ADVANCERELOAD")
    ) {
        console.log("Recriando Lista de Jogos");

        // Função que carrega a imagem quando visível
        const loadImage = (img) => {
            const src = img.getAttribute("data-src");
            if (src) {
                img.src = src;
                img.removeAttribute("data-src");
            }
        };

        // Configuração do IntersectionObserver
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img);
                    }
                });
            },
            {
                root: null,
                threshold: 0.1,
            }
        );
        function debounce(func, delay) {
            let timeout;
            return function (...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, delay);
            };
        }
        const filterGames = debounce(function () {
            const filterText = document.querySelector("input#BetterGame_SearchBlock").value.toLowerCase();
            cachedGameCards.forEach(({ element, gameName }) => {
                if (gameName.includes(filterText)) {
                    element.classList.remove("HiddenGame");
                } else {
                    element.classList.add("HiddenGame");
                }
            });
        }, 300);
        const gameListWrapper = document.querySelector("div.container form#edit-mod-details");

        if (gameListWrapper && !document.querySelector("div.container ul#BetterGameList")) {
            gameListWrapper.remove();

            const searchItem = document.createElement("input");
            searchItem.setAttribute("type", "text");
            searchItem.id = "BetterGame_SearchBlock";
            searchItem.setAttribute("disabled", true);
            searchItem.placeholder = "Skyrim Special...."
            const modEditingContent = document.querySelector('div.container div.info');
            searchItem.addEventListener("input", filterGames)
            modEditingContent.insertAdjacentElement('afterend', searchItem);

            const newlist = document.createElement("ul");
            newlist.classList.add("gamelist-wrapper");
            newlist.id = "BetterGameList";
            document.querySelector("div.container").append(newlist);

            const fragment = document.createDocumentFragment();

            const batchSize = 200;
            let currentIndex = 0;

            function loadBatch() {
                const endIndex = Math.min(currentIndex + batchSize, GAMES.length);

                for (let i = currentIndex; i < endIndex; i++) {
                    const GAME_ITEM = GAMES[i];
                    const div = document.createElement("li");
                    div.classList.add("gameCard");
                    div.id = `game-tile-${GAME_ITEM.id}`;
                    div.setAttribute("Nurl", `${GAME_ITEM.nexusmods_url}/mods/add?NM_ADVANCERELOAD=false`);

                    const subDiv = document.createElement("div");
                    subDiv.classList.add("mod-tile-left");
                    subDiv.id = `tile-left-${GAME_ITEM.id}`;

                    const imgA = document.createElement("a");
                    imgA.classList.add("mod-image");

                    const img = document.createElement("img");
                    img.setAttribute("draggable", false);
                    img.setAttribute("width", 200);
                    img.setAttribute("height", 250);
                    img.src = "https://www.nexusmods.com/assets/images/default/tile_empty.png";
                    img.setAttribute("data-src", `https://staticdelivery.nexusmods.com/Images/games/4_3/tile_${GAME_ITEM.id}.jpg`);
                    img.setAttribute("lazyload", true);

                    const game_name = document.createElement("p");
                    game_name.classList.add("tile-name");
                    game_name.innerText = GAME_ITEM.name;

                    imgA.append(img, game_name);
                    subDiv.append(imgA);
                    div.append(subDiv);
                    fragment.appendChild(div);

                    observer.observe(img);
                }

                document.querySelector("div.container ul.gamelist-wrapper").appendChild(fragment);

                // Atualiza o índice atual
                currentIndex += batchSize;

                // Se ainda houver itens, continua carregando o próximo lote
                if (currentIndex < GAMES.length) {
                    setTimeout(loadBatch, 1); // Libera o thread para o próximo lote
                } else {
                    requestAnimationFrame(() => {
                        searchItem.removeAttribute("disabled");
                        searchItem.click();
                        searchItem.focus();
                        const gameCards = document.querySelectorAll("li.gameCard");
                        cachedGameCards = Array.from(gameCards).map((card) => ({
                            element: card,
                            gameName: card.querySelector(".tile-name").innerText.toLowerCase(),
                        }));
                        console.log(`${cachedGameCards.length} Cards`);
                        document.querySelector("div.rj-profile-pic img").src = document.querySelector("div.rj-profile-pic img").src + "?rmk=1";
                    });

                }
            }

            // Inicia o primeiro lote
            loadBatch();

            // Event delegation para evitar muitos event listeners
            document.querySelector("ul#BetterGameList").addEventListener("click", (ev) => {
                const target = ev.target.closest(".gameCard");
                if (target) {
                    ev.preventDefault();
                    window.location.href = target.getAttribute("Nurl");
                }
            });
        }
    } else if (
        SITE_URL.indexOf("https://www.nexusmods.com/mods/add") != -1 &&
        !document.querySelector("div.container ul#BetterGameList") &&
        !SITE_URL.includes("NM_ADVANCERELOAD")
    ) {
        console.log("Sem Jogos ainda");
        requestAnimationFrame(REMAKE_ADDMODS_LIST);
    }
}