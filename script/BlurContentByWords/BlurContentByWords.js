async function BLUR_CONTENT_BYWORD(fastHide = false) {
    let PAGE_CONTENT;
    if (fastHide == true) {
        PAGE_CONTENT = Array.from(document.querySelectorAll("li div[data-mod-id]:not([HIDDEN_SETUP]), li.image-tile:not([HIDDEN_SETUP])"));
    } else {
        PAGE_CONTENT = Array.from(document.querySelectorAll("li[VISIBLE] div[data-mod-id]:not([HIDDEN_SETUP]), li.image-tile[VISIBLE]:not([HIDDEN_SETUP])"));
    }
    PAGE_CONTENT.forEach(function (divItem) {
        let type;
        let author;
        let category;
        let description;
        if (divItem.classList.contains("mod-tile-left") || divItem.classList.contains("mod-tile") || (divItem.nodeName.toLocaleLowerCase() == "li" && divItem.querySelector("div[data-mod-id]"))) {
            type = "MOD";
        } else {
            type = "IMAGE";
        }
        divItem.setAttribute("HIDDEN_SETUP", true);
        const MAIN = divItem.closest("li").querySelector("figure");
        if (divItem.style.display != 'none' && MAIN && !MAIN.classList.contains("blur-image-sm")) {

            const title = divItem.querySelector('div.tile-desc p.tile-name') ? divItem.querySelector('div.tile-desc p.tile-name').innerText.trim().toLowerCase() : "";
            description = divItem.querySelector('div.tile-desc p.desc') ? divItem.querySelector('div.tile-desc p.desc').innerText.trim().toLowerCase() : "";
            if (type == "MOD") {
                category = divItem.querySelector('div.tile-desc div.category') || divItem.querySelector('div.tile-desc ul li');
                category = category ? category.innerText.trim().toLowerCase() : "";
                author = divItem.querySelector('div.tile-desc div.author a') || divItem.querySelectorAll('div.tile-desc ul li')[1];
                author = author ? author.innerText.replace("By ", "").trim().toLowerCase() : "";
            } else {
                author = divItem.querySelector('div.tile-desc div.author').innerText.trim().toLowerCase();
            }

            const containsWord = WORD_LIST.some(word =>
                (author && author.includes(word)) ||
                (category && category.includes(word)) ||
                (title && title.includes(word)) ||
                (description && description.includes(word))
            );
            if (containsWord && MAIN) {
                MAIN.classList.add("blur-image-sm");
            }
        }
    });
}
async function LOAD_HIDDEN_WORDS(fastHide = false) {
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
                        BLUR_CONTENT_BYWORD(fastHide);
                    }
                } else {
                    console.error("Error in response:", response.error);
                }
            }
        });

    }
}