async function NotificationManager() {
    const notificationItem = document.querySelector("div.rj-notifications") || document.querySelector("button[aria-label='Show notifications']")
    if (options['AllNotifications'] == true && SITE_URL.indexOf("popup=true") == -1 && notificationItem) {
        if (!document.querySelector("div#BetterNotification")) {
            notification_Element = document.createElement("div");
            notification_Element.id = "BetterNotification";
            notification_Element.innerHTML = '<i class="fa-solid fa-bell" aria-hidden="true"></i> 0' + translate_strings.Notification.message;
            notification_Element.addEventListener("click", function () {

                openCenteredPopup("https://next.nexusmods.com/notifications/all?status=unread", "...", 600, 900)
            })
            notificationItem.appendChild(notification_Element);
        } else {
            chrome.runtime.sendMessage({
                action: 'SYNC_NOTIFICATIONCOUNT',
                forceUpdate: false
            }, function (response) {
                count = response.message;
                if (count > 0) {
                    notification_Element.innerHTML = '<i class="fa-solid fa-bell" aria-hidden="true"></i> ' + count + translate_strings.Notification.message;
                    notification_Element.style.display = 'flex';
                } else {
                    notification_Element.style.display = 'none'
                }
            });
        }
    }
}