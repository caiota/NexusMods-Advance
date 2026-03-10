async function FIX_ARTICLE_EDIT_LINK() {
    try {
        const SITE_PARAMS = new URLSearchParams(window.location.search);
        if (SITE_URL.indexOf("/articles/") != -1 && SITE_URL.indexOf("nexusmods.com/article/") == -1) {
            let edit_article_link = Array.from(document.querySelectorAll("div.manage-mod div.subnav ul.sublist li:not([ARTICLE_LINK_FIX])"))
                .filter(li => {
                    li.setAttribute("ARTICLE_LINK_FIX", true);
                    const anchor = li.querySelector('a');
                    return anchor && anchor.href.includes('step=articles') && anchor.href.includes('/edit/');
                });
            if (edit_article_link[0] && edit_article_link[0].querySelector("a")) {
                edit_article_link = edit_article_link[0].querySelector('a');
                edit_article_link.href = edit_article_link.href + "&ARTICLE_EDIT=" + await extrairID(SITE_URL);
            }
        }
        else if (SITE_URL.indexOf("/mods/edit/") != -1 && SITE_URL.indexOf("step=articles") != -1 && SITE_PARAMS.get("ARTICLE_EDIT")) {
            const ARTICLE_ELEMENT = document.querySelector("div.file-organise ul.tiles li[id='article-" + SITE_PARAMS.get("ARTICLE_EDIT") + "'");
            if (ARTICLE_ELEMENT) {
                ARTICLE_ELEMENT.querySelector("li.article-button a.edit-article").click();
                setTimeout(() => {
                    SITE_PARAMS.delete('ARTICLE_EDIT');
                    const novaURL = window.location.pathname + '?' + SITE_PARAMS.toString();
                    window.history.pushState({ path: novaURL }, '', novaURL);
                }, 3000);

            }
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}