async function FAST_DOWNLOAD() {
    const downloadConditionsMet = (
        (SITE_URL.includes("&nmm=1") || SITE_URL.includes("tab=files&file_id=")) &&
        (document.querySelector("button#slowDownloadButton") || document.querySelector("button#startDownloadButton")) &&
        options['FastDownloadModManager'] === true
    );

    if (!downloadConditionsMet) return;

    const downloadButton = document.querySelector("button#slowDownloadButton,button#startDownloadButton");
    const buttonUrl = downloadButton.getAttribute("data-download-url");

    if (buttonUrl && !buttonUrl.includes("#ERROR-download")) {
        initiateDownload(buttonUrl);
    } else {
        downloadButton.click();
        setTimeout(handleFallbackDownload, 2000);
    }
}

function initiateDownload(url) {
    window.open(url);
    window.history.go(-1);
    setTimeout(() => {
        try {
            window.close();
        } catch (error) {
            console.warn("Failed to close the window: ", error);
        }
    }, 1000);
}

function handleFallbackDownload() {
    const fileLink = document.querySelector("div.donation-wrapper a")?.href;
    if (fileLink) {
        initiateDownload(fileLink);
    } else {
        console.error("Download fallback link not found.");
    }
}
