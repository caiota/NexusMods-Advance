async function IgnoreRequeriments() {
    const requerimentsPopUp = document.querySelector("div.widget-mod-requirements, div.popup-download");
    if (requerimentsPopUp) {
        console.log("Ignorando Requerimentos")
        const rightPremiumPanel = document.querySelector("div.popup-download div.download-right-panel");
        if (rightPremiumPanel) {
            const testButton = document.createElement("a");
            testButton.classList = "btn inline-flex";
            testButton.style.display = 'flex';
            testButton.style.marginTop = '20px'
            testButton.innerText = translate_strings.cdnTest_inlineButton.message;
            testButton.addEventListener("click", () => {
                chrome.runtime.sendMessage({
                    action: 'PopupConfig',
                    type: 'cdn_test'
                }, function (response) {
                    if (response && response.success) {
                        testButton.style.display = 'none';
                    }
                });
            })
            rightPremiumPanel.appendChild(testButton);
        }
        if (options['FastDownloadModManager'] == true) {
            Ignore_Requirements_maxTry = 90;
            const downloadButton = requerimentsPopUp.querySelector("a.btn");
            if (downloadButton.getAttribute("onclick") == "download_file();") {
                downloadButton.click();
                requerimentsPopUp.querySelector("button.mfp-close").click();
            }
            const DownloadDetectButton = downloadButton.href;
            if (DownloadDetectButton.indexOf("nmm=1") != -1) {
                window.location.href = DownloadDetectButton;
                requerimentsPopUp.querySelector("button.mfp-close").click();
            }
            else if (DownloadDetectButton.indexOf("tab=files&file_id=") != -1) {
                window.location.href = DownloadDetectButton;
                requerimentsPopUp.querySelector("button.mfp-close").click();
            }
        }

    } else {
        if (Ignore_Requirements_maxTry > 0) {
            Ignore_Requirements_maxTry--;
            requestAnimationFrame(IgnoreRequeriments);
        } else {
            Ignore_Requirements_maxTry = 90;
        }
    }

}

function ClickCallback(ev) {
    if (options['Prevent_TrackOnDownload'] == false) {
        Ignore_Requirements_maxTry=90;
        TRACK_MOD(ev);
    }
    ev.currentTarget.removeEventListener('click', ClickCallback);
    requestIdleCallback(IgnoreRequeriments);
}

function errorCallback(ev) {
    CreateNotificationContainer(translate_strings.TrackMod_Error.message, 'error', 'fa-solid fa-triangle-exclamation', 8000)
    ev.currentTarget.removeEventListener('click', errorCallback);

}