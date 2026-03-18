var FunctioNTimeout;
async function BLUR_CONTENT_BYWORD() {
    const a_links = Array.from(document.querySelectorAll("div[class*='mod-tile'][VISIBLE]:not([HIDDEN_SETUP])"));
    const li_links = Array.from(document.querySelectorAll("div[class*='mod-tile'][VISIBLE]:not([HIDDEN_SETUP])"));
    const mod_images = Array.from(document.querySelectorAll("div[data-e2eid*='media-tile'][VISIBLE]:not([HIDDEN_SETUP])"));
    const requerimentsTab = Array.from(document.querySelectorAll("dl.accordion table.desc-table td.table-require-name"));
    const mod_trackingImages = Array.from(document.querySelectorAll("td.tracking-mod"));
    const PAGE_CONTENT = a_links.concat(li_links, mod_images, mod_trackingImages, requerimentsTab);
    if(PAGE_CONTENT.length<=0){
        clearTimeout(FunctioNTimeout);
            FunctioNTimeout=setTimeout(BLUR_CONTENT_BYWORD,2000)
        return;
    }
    
    PAGE_CONTENT.forEach(function (divItem) {
        let type;
        let author;
        let category;
        let description;
        if (current_page != "only_mod_page") {
            divItem = divItem.closest("div[class*='mod-tile'],div[data-e2eid*='media-tile']");
            if (divItem && divItem.getAttribute("data-e2eid") == "mod-tile") {
                type = "MOD";
            } else {
                type = "IMAGE";
            }
        }
        if(!divItem){
        clearTimeout(FunctioNTimeout);
            FunctioNTimeout=setTimeout(BLUR_CONTENT_BYWORD,2000)
     return;
        }
        divItem.setAttribute("HIDDEN_SETUP", true);
        const MAIN = divItem.closest("div[class*='mod-tile'],div[data-e2eid*='media-tile'],tr");
            
        if (divItem.style.display != 'none' && MAIN && (!MAIN.classList.contains("blurIgnoredModBlock") && !MAIN.classList.contains("HideIgnoredModBlock"))) {

            const title = divItem.querySelector('a[data-e2eid="mod-tile-title"],a[data-e2eid="media-tile-title"]') ? divItem.querySelector('a[data-e2eid="mod-tile-title"],a[data-e2eid="media-tile-title"]').innerText.trim().toLowerCase() : "";
            description = divItem.querySelector('div[data-e2eid="mod-tile-summary"]') ? divItem.querySelector('div[data-e2eid="mod-tile-summary"]').innerText.trim().toLowerCase() : "";

            if (type == "MOD") {
                category = divItem.querySelector('a[data-e2eid="mod-tile-category"]');
                category = category ? category.innerText.trim().toLowerCase() : "";
                author = divItem.querySelector('a[data-e2eid="user-link"] span,a[data-e2eid="media-tile-author"]');
                author = author ? author.innerText.replace("By ", "").trim().toLowerCase() : "";
            } else {
                if (current_page == "only_mod_page") {
                    if(divItem.querySelector('a[description_click="true"]'))
                    author = divItem.querySelector('a[description_click="true"]').innerText.replace("by ", "").trim().toLowerCase();
                } else {
                    if (divItem.querySelector('a[data-e2eid="media-tile-author"]'))
                        author = divItem.querySelector('a[data-e2eid="media-tile-author"]').innerText.replace("by ", "").trim().toLowerCase();
                }
            }
            const containsWord = WORD_LIST.some(word =>
                (author && author.includes(word)) ||
                (category && category.includes(word)) ||
                (title && title.includes(word)) ||
                (description && description.includes(word))
            );
            if (containsWord && MAIN && (!MAIN.classList.contains("blurIgnoredModBlock") || !MAIN.classList.contains("HideIgnoredModBlock"))) {
                if (options['Hide_BluredContent'] == true) {
                    MAIN.classList.add("HideIgnoredModBlock");
                } else {
                    MAIN.classList.add("blurIgnoredModBlock");
                }
            }
        }
    });
}
var LAST_LENGTH=-1;
async function LOAD_HIDDEN_WORDS() {
    if (options['hideContentWords'] == true) {
        chrome.runtime.sendMessage({
            action: 'Load_WordList',
        }, async function (response) {
            if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError.message);
            } else {
                if (response.success == false) {
                    console.log("No Banned Words YET!");
                    return;
                }
                if (response && response.success) {
                    WORD_LIST = response.message[0].split("#-#").map(word => word.toLowerCase());
                    if (WORD_LIST.length > 0 && !WORD_LIST[0] == "") {
                    LAST_LENGTH=WORD_LIST.length;
                        BLUR_CONTENT_BYWORD();
                    }
                } else {
                    console.error("Error in response:", response.error);
                }
            }
        });

    }
}