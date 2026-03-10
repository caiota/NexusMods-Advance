async function WIDER_WEBSITE() {
    try {
        console.warn("TEM OPCOES? "+options['WideWebsite'])
        if (!options || typeof options.WideWebsite !== 'boolean') return

  watchMainContent(mainContent => {
   APPLY_WIDER_TOGGLE(mainContent)
  })
    } catch (e) {
        console.error("NexusMods Advance Error:" + e);
    }
}
function APPLY_WIDER_TOGGLE(mainContent){
        if (mainContent) {
            if (options['WideWebsite']==true&&!mainContent.classList.contains("noPadding")) {
                mainContent.classList.add("noPadding");
                console.log("ADICIONANDO")
            } 
            else if (options['WideWebsite']==false&&mainContent.classList.contains("noPadding")) {
                mainContent.classList.remove("noPadding");
                console.log("REMOVENDO")
            }
        }

}
var observer33;
function watchMainContent(callback) {
   observer33 = new MutationObserver(() => {
    const el =
      document.querySelector("div#mainContent div[class*='relative next-container']")
      || document.querySelector("div#mainContent")

    if (el) {
      observer33.disconnect()
      callback(el)
    }
  })

  observer33.observe(document.documentElement, {
    childList: true,
    subtree: true
  })
}
