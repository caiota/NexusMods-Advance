async function NOTIFICATION_WAITER() {
    const NotificationPopup = document.querySelector("div.mfp-content div.popup");
    if (options['SimpleSiteNotifications'] === true && NotificationPopup) {
        CHECK_WEBNOTIFICATIONS();
    }
}

async function CHECK_WEBNOTIFICATIONS() {
    const notificationPop = document.querySelector("div.mfp-content div.popup");
    if (notificationPop
        && !["popup-mod-tagging", "popup-bugreport", "popup-file-contents", "widget-download", "popup-download"].some(cls => notificationPop.classList.contains(cls))
        && notificationPop.innerText.trim() !== ""
        && notificationPop.innerText.trim() !== "×"
        && notificationPop.querySelector("div p.info")
        && notificationPop.querySelector("div p.info").innerText.trim().length > 0
    ) {

        CreateNotificationContainer(
            notificationPop.innerText.replaceAll("\n\n", "<br>").replaceAll("×", ""),
            'sitePopup',
            'fa-solid fa-rss'
        );

        document.querySelector("div.mfp-content div.popup button").click();
    }
}