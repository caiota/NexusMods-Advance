 function HideModsByList() {
  chrome.runtime.sendMessage({
    action: 'Load_HiddenMods'
  },   function (response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
    } else {
      if (response && response.success) {
        HIDDEN_MODS = response.data;
         PROCESS_HIDDEN_LIST();
        
      } else {
        console.error("Error in response:", response.error);
      }
    }
  });


 function PROCESS_HIDDEN_LIST() {
  try {
    if (!HIDDEN_MODS || Object.keys(HIDDEN_MODS).length === 0) return;

    // Mapeia mod_id -> mod_name para lookup O(1) e pra preservar os logs
    const hiddenModMap = new Map();
    for (const parent of Object.keys(HIDDEN_MODS)) {
      const HIDDEN_ITENS = HIDDEN_MODS[parent];
      if (!HIDDEN_ITENS) continue;
      for (const modID of Object.keys(HIDDEN_ITENS)) {
        const mod = HIDDEN_ITENS[modID];
        if (!mod || !mod.mod_name) continue;
        hiddenModMap.set(Number(mod.mod_id), mod.mod_name);
      }
    }
    if (hiddenModMap.size === 0) return;

    // Coleta os mod-tiles visíveis ainda não processados
    const mods_list = [];
    for (const element of VISIBLE_ELEMENTS) {
      if (!element.isConnected) {
        VISIBLE_ELEMENTS.delete(element);
        continue;
      }
      if (!element.matches || !element.matches("div[class*='mod-tile']") && !element.matches("li.mod-tile")) {
        continue;
      }
      if (element.hasAttribute("data-hidden-mod")) {
        continue;
      }
      if(element.classList.contains("mod-tile-left")||element.classList.contains("mod-tile-dl-status")){
        continue;
      }
      mods_list.push(element);
    }
    if (mods_list.length <= 0) return;
    
    for (var i = 0; i < mods_list.length; i++) {
      const mod_element_base = mods_list[i];
      const anchor = mod_element_base.querySelector("div.relative a:not([data-hidden-mod]),p.tile-name a:not([data-hidden-mod])");
      if (!anchor || !anchor.href) continue;

      const MOD_ROOT = anchor.getRootNode();
      if (MOD_ROOT instanceof ShadowRoot) {
        APPLY_NMA_BLURCSS(MOD_ROOT);
      }

      const parts = anchor.href.split("/mods/");
      if (!parts[1]) continue;
      const idStr = parts[1].match(/^\d+/);
      if (!idStr) continue;
      const tempo_id = parseInt(idStr[0], 10);
      if (Number.isNaN(tempo_id)) continue;

      if (hiddenModMap.has(tempo_id)) {
        if (!options || !options['JustBlur_IgnoredMods']) {
          console.log("Removendo Mod Oculto: " + hiddenModMap.get(tempo_id));
          mod_element_base.style.display = 'none';
        } else {
          console.log("Borrando Bloco de Mod Oculto: " + hiddenModMap.get(tempo_id));
          mod_element_base.classList.add("blurIgnoredModBlock");
        }
      }
      
        anchor.setAttribute('data-hidden-mod', 'true');
        mod_element_base.setAttribute('data-hidden-mod', 'true');
    }
  } catch (e) {
    console.error(e);
  }
}
}


function APPLY_NMA_BLURCSS(root) {

  if (!root || root.querySelector('#NMA_ModBlur_CSS')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'NMA_ModBlur_CSS';

  style.textContent = `

.blurIgnoredModBlock{
    filter: blur(7px) !important;
    -webkit-filter: blur(7px) !important;
}
.HideIgnoredModBlock{
    display: none !important;
}
  `;

  root.appendChild(style);

  const faLink = document.createElement('link');

  faLink.id = 'NMA_FontAwesome_ShadowRoot';
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';

  root.appendChild(faLink);



}