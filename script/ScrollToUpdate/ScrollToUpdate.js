async function SCROLL_TO_UPDATE() {
    const fileIdFromUrl = new URL(window.location.href).searchParams.get("NAdvance_ScrollToFile");
    if (fileIdFromUrl && SITE_URL.indexOf("NAdvance_ScrollToFile") != -1) {
        const updateId = document.querySelector("dt[data-id='" + fileIdFromUrl + "']");
        const updatedd = document.querySelector("dd[data-id='" + fileIdFromUrl + "']");
        if (updateId) {
            updateId.scrollIntoView({
                block: "center",
            });
            setTimeout(function () {
                updateId.classList.add("blink-once")
                updatedd.classList.add("blink-once")
            }, 500)
        }
    }
}