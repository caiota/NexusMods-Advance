/*************************************************
 * ESTADO GLOBAL DO LOADER DE JOGOS
 *************************************************/
window.GAMES = window.GAMES || [];

let gamesOffset = 0;
let gamesTotal = Infinity;
let isLoadingGames = false;

    const batchSize = 200;
    let currentIndex = 0;
const GAMES_PAGE_SIZE = 80;
var observer3;

/*************************************************
 * FUNÇÃO: CARREGA MAIS JOGOS (1 página por vez)
 *************************************************/
async function LOAD_MORE_GAMES() {
    if (isLoadingGames) return;
    if (gamesOffset >= gamesTotal) return;

    isLoadingGames = true;
    console.log("🔄 Carregando mais jogos...", gamesOffset);

    try {
        const res = await fetch("https://api-router.nexusmods.com/graphql", {
            method: "POST",
            credentials: "include",
            headers: {
                "accept": "*/*",
                "content-type": "application/json",
                "x-graphql-operationname": "Games"
            },
            body: JSON.stringify({
                operationName: "Games",
                variables: {
                    count: GAMES_PAGE_SIZE,
                    offset: gamesOffset,
                    facets: {
                        genre: [],
                        hasCollections: [],
                        supportsVortex: []
                    },
                    filter: {
                        filter: [],
                        op: "AND"
                    },
                    sort: {
                        downloads: { direction: "DESC" }
                    }
                },
                query: `
                    query Games($offset: Int, $count: Int = 25, $facets: GamesFacet, $filter: GamesSearchFilter, $sort: [GamesSearchSort!]) {
                      games(
                        offset: $offset
                        count: $count
                        facets: $facets
                        filter: $filter
                        sort: $sort
                      ) {
                        totalCount
                        nodes {
                          id
                          name
                          domainName
                        }
                      }
                    }
                `
            })
        });

        const json = await res.json();
        const games = json?.data?.games;

        if (!games?.nodes?.length) {
            gamesTotal = gamesOffset;
            return;
        }

        gamesTotal = games.totalCount;

        const mapped = games.nodes.map(game => ({
            id: game.id,
            name: game.name,
            nexusmods_url: `https://www.nexusmods.com/${game.domainName}`
        }));

        GAMES.push(...mapped);
        gamesOffset += games.nodes.length;
        
    loadBatch();
        console.log(`✅ Jogos carregados: ${GAMES.length}/${gamesTotal}`);

    } catch (e) {
        console.error("Erro ao carregar jogos", e);
    } finally {
        isLoadingGames = false;
    }
}


/*************************************************
 * FUNÇÃO PRINCIPAL
 *************************************************/
async function REMAKE_ADDMODS_LIST() {
    if (
        SITE_URL.indexOf(".com/mods/add") === -1 ||
        SITE_URL.includes("NM_ADVANCERELOAD")
    ) return;

    if (document.querySelector("div.container ul#BetterGameList")) return;
   

    console.log("🧱 Recriando Lista de Jogos");

    /********* GARANTE PRIMEIRA CARGA *********/
    if (GAMES.length === 0) {
        await LOAD_MORE_GAMES();
    }

    /********* IMAGE LAZY LOAD *********/
    const loadImage = (img) => {
        const src = img.getAttribute("data-src");
        if (src) {
            img.src = src;
            img.removeAttribute("data-src");
        }
    };

     observer3 = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    /********* DEBOUNCE *********/
    function debounce(fn, delay) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), delay);
        };
    }

    /********* FILTRO *********/
    const filterGames = debounce(() => {
        const val = document.querySelector("#BetterGame_SearchBlock").value.toLowerCase();
        cachedGameCards.forEach(({ element, gameName }) => {
            element.classList.toggle("HiddenGame", !gameName.includes(val));
        });
    }, 300);

    

    /********* SEARCH *********/
    const searchItem = document.createElement("input");
    searchItem.type = "text";
    searchItem.id = "BetterGame_SearchBlock";
    searchItem.placeholder = "Skyrim Special Edi...";
    searchItem.disabled = true;
    searchItem.addEventListener("input", filterGames);

    document.querySelector("div.container div.info")
        .insertAdjacentElement("afterend", searchItem);

    /********* LISTA *********/
    const list = document.createElement("ul");
    list.className = "gamelist-wrapper";
    list.id = "BetterGameList";
    document.querySelector("div.container").append(list);

    await LOAD_MORE_GAMES();
    await LOAD_MORE_GAMES();
    await LOAD_MORE_GAMES();
    await LOAD_MORE_GAMES();
    await LOAD_MORE_GAMES();
    await LOAD_MORE_GAMES();
    await LOAD_MORE_GAMES();
    await LOAD_MORE_GAMES();
   
    requestAnimationFrame(() => {
                        searchItem.removeAttribute("disabled");
                        searchItem.click();
                        searchItem.focus();
                        const gameCards = document.querySelectorAll("li.gameCard");
                        cachedGameCards = Array.from(gameCards).map((card) => ({
                            element: card,
                            gameName: card.querySelector(".tile-name").innerText.toLowerCase(),
                        }));
                        document.querySelector("div.rj-profile-pic img").src = document.querySelector("div.rj-profile-pic img").src + "?rmk=1";
                    });

    /********* CLICK *********/
    list.addEventListener("click", ev => {
        const card = ev.target.closest(".gameCard");
        if (!card) return;
        ev.preventDefault();
        window.location.href = card.getAttribute("Nurl");
    });
}
var isRendering=false;
function loadBatch() {
    if (isRendering) return;
    isRendering = true;

    const list = document.querySelector("ul#BetterGameList");
    if (!list) {
        isRendering = false;
        return;
    }

    const endIndex = Math.min(currentIndex + batchSize, GAMES.length);
    const fragment = document.createDocumentFragment();

    for (let i = currentIndex; i < endIndex; i++) {
        const GAME_ITEM = GAMES[i];
        const li = document.createElement("li");
        li.classList.add("gameCard");
        li.id = `game-tile-${GAME_ITEM.id}`;
        li.setAttribute(
            "Nurl",
            `https://nexusmods.com/${GAME_ITEM.domainName}/mods/add?NM_ADVANCERELOAD=false`
        );

        const subDiv = document.createElement("div");
        subDiv.classList.add("mod-tile-left");

        const imgA = document.createElement("a");
        imgA.href=`https://nexusmods.com/${GAME_ITEM.domainName}/mods/add?NM_ADVANCERELOAD=false`;
        imgA.classList.add("mod-image");

        const img = document.createElement("img");
        img.width = 200;
        img.height = 250;
        img.draggable = false;
        img.src = "https://www.nexusmods.com/assets/images/default/tile_empty.png";
        img.setAttribute(
            "data-src",
            `https://staticdelivery.nexusmods.com/Images/games/4_3/tile_${GAME_ITEM.id}.jpg`
        );

        const game_name = document.createElement("p");
        game_name.classList.add("tile-name");
        game_name.innerText = GAME_ITEM.name;

        imgA.append(img, game_name);
        subDiv.append(imgA);
        li.append(subDiv);
        fragment.append(li);
        observer3.observe(img)
    }

    list.append(fragment);
      gameCards = document.querySelectorAll("li.gameCard");
                        cachedGameCards = Array.from(gameCards).map((card) => ({
                            element: card,
                            gameName: card.querySelector(".tile-name").innerText.toLowerCase(),
                        }));
    currentIndex = endIndex;
    isRendering = false;
}
