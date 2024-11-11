async function GET_USER_FILTER() {
    const lista1 = Array.from(document.querySelectorAll("ul.choice-list")[0].querySelectorAll("li input")).filter(v => v.checked);
    const lista2 = Array.from(document.querySelectorAll("ul.choice-list")[1].querySelectorAll("li input"));
    const lista3 = Array.from(document.querySelectorAll("ul.choice-list")[1].querySelectorAll("li input"));
    lista3.splice(0, 4);
    const descriptionSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#search_description").value;
    const authorSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#search_author").value;
    const uploaderSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#search_uploader").value;
    const languageSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right select#language").value;
    const translationsSearch = document.querySelector("div.refine-results div.col-1-1 div.refine-right input#translations_only").checked;

    let attributes = [];

    if (translationsSearch == true) {
        attributes.push('translations_only:1');
    }

    if (!excludedPaths.some(path => SITE_URL.includes(path))) {
        let time, order, sort;

        if (document.querySelector("select#time") && document.querySelector("select#order")) {
            time = document.querySelector("select#time").value;
            order = document.querySelector("select#order").value;
            sort = document.querySelector("select#sort_by").value;
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
    }
    attributes.push('language:' + languageSearch);
    attributes.push('search_uploader:' + uploaderSearch);
    attributes.push('search_author:' + authorSearch);
    attributes.push('search_description:' + descriptionSearch);

    lista1.forEach(index => {
        const indVal = encodeURIComponent(index.value.toString());
        const indCat = encodeURIComponent(index.getAttribute("name"));

        if (indVal && indCat) {
            attributes.push(`${indCat}:${indVal}`);
        } else {
            console.log("Valor ou categoria ausente");
        }
    });

    lista2.forEach(index => {
        switch (index.id) {
            case 'has_images':
                if (index.checked) {
                    attributes.push('has_images:1');
                }

                break;
            case 'include_adult':

                attributes.push('include_adult:' + index.checked);

                break;
            case 'only_adult':
                if (index.checked) {
                    attributes.push('only_adult:1');
                }
                break;
        }
    });
    lista3.forEach(index => {
        if (index.checked) {
            indVale = encodeURIComponent(index.value.toString() + "_true");
        } else {
            indVale = encodeURIComponent(index.value.toString() + "_false");
        }
        const indCate = encodeURIComponent(index.getAttribute("name"));
        if (indVale && indCate) {
            attributes.push(`${indCate}:${indVale}`);
        } else {
            console.log("Valor ou categoria ausente");
        }
    });

    if (document.querySelector("ul.search-terms li")) {
        searchItem = document.querySelector("ul.search-terms li").innerText.split(":");
        if (searchItem[1].charAt(0) === ' ') {
            searchItem[1] = searchItem[1].trimStart()
        }
        searchItem = "search[" + searchItem[0] + "]:" + searchItem[1];
        attributes.push(searchItem);

    }
    attributes.push(`page:${(PAGINA_ATUAL)}`);
    if (attributes.length > 0) {
        current_url += "," + attributes.join(',');
    }
}

async function GENERATE_INFINITE_SCROLL() {

    if (unsupportedPaths.some(path => SITE_URL.indexOf(path) !== -1) || SITE_URL.indexOf("next.nexusmods.com/") != -1) {
        console.log("Infinite Scroll não suportado nesta página D:");
        return;
    }
    else if (SITE_URL.indexOf("/mods/today") != -1) {
        current_url = last24Hours;

    } else if (SITE_URL.indexOf("/mods/thisweek") != -1) {
        current_url = lastWeek;
    } else if (SITE_URL.indexOf("/mods/popular/") != -1) {
        current_url = last30Days;
    }
    else if (SITE_URL.indexOf("/mods/trendingalltime/") != -1) {
        current_url = trendingAllTime;
    } else if (SITE_URL.indexOf("/mods/moretrending") != -1 || SITE_URL.indexOf("/mods/trending") != -1) {
        current_url = moreTrending;
    }
    else if (SITE_URL.indexOf("/mods/updated/") != -1) {
        current_url = recentUpdated;
    } else if (SITE_URL.indexOf("/mods/popularalltime") != -1) {

        current_url = popularAllTime;
    } else if (SITE_URL.indexOf("/search") != -1) {

        current_url = searchLink;
    } else if (SITE_URL.indexOf("/mods/") != -1) {

        current_url = popularAllTime;
    } else {
        console.log("Infinite Scroll não suportado nesta página D:");
        return;
    }

    if (PAGINA_ATUAL == 0) {
        await GET_MAXPAGES();
    } else {
        PAGINA_ATUAL++;
    }
    if (PAGINA_ATUAL > max_pages) {
        return;
    }
    console.log("Loading Page: " + PAGINA_ATUAL + " From Total: " + max_pages + " Pages")

    await GET_USER_FILTER();

    fetch(current_url, http_headers)
        .then(response => response.text())
        .then(async (html) => {
            const parser = new DOMParser();
            doc3 = parser.parseFromString(html, 'text/html');

            doc3 = doc3.body.querySelector("div#mod-list");
            if (doc3.querySelectorAll('div.file-category-header div')) {
                const elementsToRemove = doc3.querySelectorAll('div.file-category-header div');
                elementsToRemove.forEach(element => element.remove());
            }
            doc3.id = "injectedContent_" + PAGINA_ATUAL;

            doc3 = doc3.querySelectorAll("li.mod-tile");
            if (!document.querySelector("body#injectedContent_" + PAGINA_ATUAL)) {

                canScroll = true;
                doc3.forEach(function (item) {
                    document.querySelector("ul.tiles").appendChild(item);
                });

                console.log("INFINITE SCROLL PAGE " + PAGINA_ATUAL);
                EXEC_ONCE('hideMods', HideModsByList, 300);
                EXEC_ONCE('profileMouse', PROFILE_ONMOUSE, 300);
                EXEC_ONCE('createModButtons', GET_VISIBLE_BLOCKS, 300);
                // EXEC_ONCE('removeTips', REMOVE_MOD_STATUSVIEW, 300);
                //EXEC_ONCE('loadDetails', PAGE_VIEW.LOAD_MOD_DETAILS, 300);

            }
        })
        .catch(error => {
            console.error('Erro ao buscar o HTML:', error);
        });

}