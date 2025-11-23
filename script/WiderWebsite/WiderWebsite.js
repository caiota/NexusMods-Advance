async function WIDER_WEBSITE() {
    try {
        var mainContent = document.querySelector("div#mainContent div[class*='relative next-container']");
        if(!mainContent){
            mainContent=document.querySelector("div#mainContent");
        }
        if (mainContent) {
            if (options['WideWebsite']) {
                mainContent.classList.add("noPadding");
            } else {
                mainContent.classList.remove("noPadding");
            }
        }
    } catch (e) {
        console.error("NexusMods Advance Error:" + e);
    }
}