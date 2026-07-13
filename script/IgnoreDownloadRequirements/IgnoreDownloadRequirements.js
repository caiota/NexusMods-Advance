const originalAdd = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, opts) {
  if (type === "click" && this.matches?.("a.btn")) {
    const wrapped = function (ev) {
      queueMicrotask(IgnoreRequeriments);
      return listener.call(this, ev);
    };
    return originalAdd.call(this, type, wrapped, opts);
  }
  return originalAdd.call(this, type, listener, opts);
};

async function IgnoreRequeriments() {
  var requerimentsPopUp = document.querySelector(
    'div.widget-mod-requirements, div.popup-download'
  )
  if(!requerimentsPopUp) {
    console.warn("requerimentsPopUp not found, chamando callback")
 requerimentsPopUp=document.querySelector("div#next-shadow-root").shadowRoot.querySelector("div.nxm-modal-content");
 console.log(requerimentsPopUp)
  }
  if (requerimentsPopUp) {
    console.warn('Ignorando Requerimentos')
    
    const rightPremiumPanel = document.querySelector(
      'div.popup-download div.download-right-panel'
    )
    if (rightPremiumPanel) {
      const testButton = document.createElement('a')
      testButton.classList = 'btn inline-flex'
      testButton.style.display = 'flex'
      testButton.style.marginTop = '20px'
      testButton.innerText = translate_strings.cdnTest_inlineButton.message
      testButton.addEventListener('click', () => {
        chrome.runtime.sendMessage(
          {
            action: 'PopupConfig',
            type: 'cdn_test'
          },
          function (response) {
            if (response && response.success) {
              testButton.style.display = 'none'
            }
          }
        )
      })
      rightPremiumPanel.appendChild(testButton)
    }
    if (options['FastDownloadModManager'] == true) {
      Ignore_Requirements_maxTry = 90
      const downloadButton = requerimentsPopUp.querySelector('a.btn,a.nxm-button')
      if(downloadButton.querySelector("path[d='M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z']")){
        
        downloadButton.click()
        requerimentsPopUp.querySelector('button.mfp-close,button.nxm-modal-close-button').click()
      }
      else if (downloadButton.getAttribute('onclick') == 'download_file();') {
        downloadButton.click()
        requerimentsPopUp.querySelector('button.mfp-close,button.nxm-modal-close-button').click()
      }
      const DownloadDetectButton = downloadButton.href
      if (DownloadDetectButton.indexOf('nmm=1') != -1) {
        tempWindow = window.open(
          DownloadDetectButton + '&NMA_closeAfterDownload=1'
        )
        requerimentsPopUp.querySelector('button.mfp-close,button.nxm-modal-close-button').click()
        WindowCloseTimer = setInterval(() => {
          if (!tempWindow || tempWindow.closed) {
            clearInterval(WindowCloseTimer)
            return
          }

          try {
            if (tempWindow.location.href.includes('canClose=')) {
              clearInterval(WindowCloseTimer)
              tempWindow.close()
            }
          } catch (e) {}
        }, 200);
        setTimeout(() => {
    if (tempWindow && !tempWindow.closed) {
        tempWindow.close();
    }
}, 15000);

      } else if (DownloadDetectButton.indexOf('tab=files&file_id=') != -1) {
        tempWindow = window.open(
          DownloadDetectButton + '&NMA_closeAfterDownload=1'
        )
        requerimentsPopUp.querySelector('button.mfp-close,button.nxm-modal-close-button').click()
        WindowCloseTimer = setInterval(() => {
          if (!tempWindow || tempWindow.closed) {
            clearInterval(WindowCloseTimer)
            return
          }

          try {
            if (tempWindow.location.href.includes('canClose=')) {
              clearInterval(WindowCloseTimer)
              tempWindow.close()
            }
          } catch (e) {}
        }, 200)
        setTimeout(() => {
    if (tempWindow && !tempWindow.closed) {
        tempWindow.close();
    }
}, 15000);

      }
    }
  } else {
    if (Ignore_Requirements_maxTry > 0) {
      Ignore_Requirements_maxTry--
      requestAnimationFrame(IgnoreRequeriments);
      console.log("NADA PARA IGNORAR D:")
    } else {
      Ignore_Requirements_maxTry = 90
    }
  }
}

function ClickCallback (ev) {
  if (options['Prevent_TrackOnDownload'] == false) {
    Ignore_Requirements_maxTry = 90
    TRACK_MOD(ev)
  }
  //ev.currentTarget.removeEventListener('click', ClickCallback)
  requestAnimationFrame(IgnoreRequeriments)
}

function errorCallback (ev) {
  CreateNotificationContainer(
    translate_strings.TrackMod_Error.message,
    'error',
    'fa-solid fa-triangle-exclamation',
    8000
  )
  ev.currentTarget.removeEventListener('click', errorCallback)
}
