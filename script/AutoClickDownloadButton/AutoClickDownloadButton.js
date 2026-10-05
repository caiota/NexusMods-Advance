var DOWNLOAD_STARTED = false;
var MAX_TRY = 100;
var dldLOOP = null;

function waitForSlowDownloadButton(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    function findButton() {
      const modFile = document.querySelector("mod-file-download");
      const root = modFile?.shadowRoot;
      if (!root) {
        return null;
      }
      return Array.from(root.querySelectorAll("button")).find(btn => btn.textContent.trim().toLowerCase().includes("slow download"));
    }
    // ========================================================
    // PRIMEIRA TENTATIVA IMEDIATA
    // ========================================================
    const immediate = findButton();
    if (immediate) {
      resolve(immediate);
      return;
    }
    // ========================================================
    // POLLING
    // ========================================================
    const timer = setInterval(() => {
      const button = findButton();
      if (button) {
        clearInterval(timer);
        resolve(button);
        return;
      }
      // ====================================================
      // TIMEOUT
      // ====================================================
      if (Date.now() - start >= timeout) {
        clearInterval(timer);
        reject(new Error("Timeout esperando pelo Slow Download."));
      }
    }, 50);
  });
}
// ============================================================
// FAST DOWNLOAD
// ============================================================
async function FAST_DOWNLOAD() {
  try {
    var url = new URL(window.location.href);
    SITE_URL = window.location.href;
    const isDownloadPage = SITE_URL.includes("&nmm=1") || SITE_URL.includes("tab=files&file_id=");
    if (!isDownloadPage) {
      return;
    }
    if (!DOWNLOAD_STARTED) {
      DOWNLOAD_STARTED = true;
      const params = url.searchParams;
      // ====================================================
      // ESPERA O BOTÃO EXISTIR
      // ====================================================
      const slowBtn = await waitForSlowDownloadButton(10000);
      // ====================================================
      // VERIFICA CONDIÇÕES
      // ====================================================
      const downloadConditionsMet = (
        (SITE_URL.includes("&nmm=1") || SITE_URL.includes("tab=files&file_id=")) && slowBtn && options['FastDownloadModManager'] === true);
      console.warn("CONDITIONS MET " + downloadConditionsMet, slowBtn);
      if (!downloadConditionsMet) {
        DOWNLOAD_STARTED = false;
        return;
      }
      // ====================================================
      // PRIMEIRA VEZ:
      // NÃO CLICA AUTOMATICAMENTE
      // ====================================================
      if (options['FAIL_SAFE_ModOrganizer_Oppened'] !== true) {
        CreateNotificationContainer(translate_strings.autoClick_SlowDownload_Alert.message, 'warning', 'fa-solid fa-thumbs-up', 20000);
        console.log("PRIMEIRO DOWNLOAD — AGUARDANDO CLIQUE MANUAL NO SLOW DOWNLOAD :D");
        // ==================================================
        // EVITA ADICIONAR O EVENTO MAIS DE UMA VEZ
        // ==================================================
        if (!slowBtn.getAttribute("NMA_FAILSAFE_LISTENER")) {
          slowBtn.setAttribute("NMA_FAILSAFE_LISTENER", "true");
          slowBtn.addEventListener("click", (event) => {
            CreateNotificationContainer(translate_strings.autoClick_SlowDownload_Alert.description, 'success', 'fa-solid fa-thumbs-up', 10000);
            console.log("NMA: SLOW DOWNLOAD CLICADO MANUALMENTE :D");
            options['FAIL_SAFE_ModOrganizer_Oppened'] = true;
            saveCheckbox("FAIL_SAFE_ModOrganizer_Oppened", true);
            console.log("NMA: FAIL_SAFE_ModOrganizer_Oppened = TRUE :D");
          }, {
            once: true
          });
        }
        DOWNLOAD_STARTED = false;
        return;
      }
      // ====================================================
      // A PARTIR DA SEGUNDA VEZ:
      // DOWNLOAD AUTOMÁTICO NORMAL
      // ====================================================
      console.log("MOD ORGANIZER JÁ FOI ABERTO — DOWNLOAD AUTOMÁTICO :D");
      // ====================================================
      // CLICA NO SLOW DOWNLOAD
      // ====================================================
      if (!dldLOOP) {
        if (slowBtn) {
          slowBtn.click();
          params.set("NMA_CanClose", "true");
          history.replaceState(null, "", url);
          handleFallbackDownload();
        }
      }
      // ====================================================
      // PROCURA O LINK FINAL
      // ====================================================
      dldLOOP = setInterval(() => {
        if (MAX_TRY > 0) {
          MAX_TRY--;
          DLD_LINK = Array.from(document.querySelectorAll("a")).find(btn => {
            const text = btn.textContent.trim().toLowerCase();
            return text.includes("click here");
          });
          if (!DLD_LINK) {
            const modFile = document.querySelector("mod-file-download");
            const root = modFile?.shadowRoot;
            if (root) {
              DLD_LINK = Array.from(root.querySelectorAll("a")).find(btn => {
                const text = btn.textContent.trim().toLowerCase();
                return text.includes("start download manually");
              });
            }
          }
          if (DLD_LINK && DLD_LINK.href && !DLD_LINK.getAttribute("DOWNLOAD_OK")) {
            DLD_LINK.setAttribute("DOWNLOAD_OK", true);
            // ==================================================
            // VERIFICA SE PODE FECHAR
            // ==================================================
            if (params.get("NMA_closeAfterDownload") || params.get("NMA_CanClose")) {
              if (DLD_LINK.href.startsWith("http://") || DLD_LINK.href.startsWith("https://")) {
                // ==================================================
                // DOWNLOAD HTTP/HTTPS
                // ==================================================
                chrome.runtime.sendMessage({
                  action: "NMA_WAIT_FOR_DOWNLOAD",
                  url: DLD_LINK.href
                });
              } else if (DLD_LINK.href.startsWith("nxm://")) {
                // ==================================================
                // NXM://
                // ==================================================
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    try {
                      const currentURL = window.location.href;
                      history.go(-1);
                      setTimeout(() => {
                        if (window.location.href === currentURL) {
                          window.close();
                        }
                      }, 300);
                    } catch (error) {
                      console.warn("NMA: FALHA AO VOLTAR COM HISTORY:", error);
                      window.close();
                    }
                  }, 300);
                });
              }
            }
          }
        } else {
          clearInterval(dldLOOP);
          dldLOOP = null;
          MAX_TRY = 100;
        }
      }, 10);
    }
  } catch (e) {
    DOWNLOAD_STARTED = false;
    console.error("NexusMods Advance Error: " + e);
  }
}
// ============================================================
// FALLBACK DOWNLOAD
// ============================================================
function handleFallbackDownload() {
  setTimeout(() => {
    try {
      // URL precisa ser criada aqui.
      // A variável "url" do FAST_DOWNLOAD()
      // não existe dentro desta função.
      const url = new URL(window.location.href);
      const params = url.searchParams;
      params.set('NMA_CanClose', 'true');
      history.replaceState(null, '', url.toString());
    } catch (error) {
      DOWNLOAD_STARTED = false;
      console.warn("Failed to close the window: ", error);
    }
  }, 300);
}