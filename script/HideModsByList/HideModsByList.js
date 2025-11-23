async function HideModsByList() {
  chrome.runtime.sendMessage({
    action: 'Load_HiddenMods'
  }, async function (response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
    } else {
      if (response && response.success) {
        HIDDEN_MODS = response.data;
        await PROCESS_HIDDEN_LIST();
        
      } else {
        console.error("Error in response:", response.error);
      }
    }
  });


async function PROCESS_HIDDEN_LIST() {
  try {
    if (!HIDDEN_MODS || Object.keys(HIDDEN_MODS).length === 0) return;

    // pega todos os mod tiles uma vez (snapshot)
    const allModTiles = Array.from(document.querySelectorAll("div[class*='mod-tile']"));

    // opcional: opcionalmente indexar os elementos por mod id para acelerar
    // vou manter a lógica de comparação por href como você tinha

    for (const parent of Object.keys(HIDDEN_MODS)) {
      const HIDDEN_ITENS = HIDDEN_MODS[parent];
      if (!HIDDEN_ITENS) continue;

      // filtro já aqui: só elementos que NÃO estão marcados como hidden
      const visibleTiles = allModTiles.filter(el => !el.hasAttribute('data-hidden-mod'));

      if (visibleTiles.length === 0) continue;

      for (const modID of Object.keys(HIDDEN_ITENS)) {
        const mod = HIDDEN_ITENS[modID];
        if (!mod || !mod.mod_name) continue;

        visibleTiles.forEach((mod_element_base) => {
          const anchor = mod_element_base.querySelector("div.relative a");
          if (!anchor || !anchor.href) return;

          // extrai só números após /mods/ de forma robusta
          const parts = anchor.href.split("/mods/");
          if (!parts[1]) return;
          const idStr = parts[1].match(/^\d+/);
          if (!idStr) return;
          const tempo_id = parseInt(idStr[0], 10);
          if (Number.isNaN(tempo_id)) return;

          if (tempo_id === Number(mod.mod_id)) {
            // marca com data attribute (lowercase) — confiável pra selector/hasAttribute
            mod_element_base.setAttribute('data-hidden-mod', 'true');

            if (!options || !options['JustBlur_IgnoredMods']) {
              console.log("Removendo Mod Oculto: " + mod.mod_name);
              mod_element_base.remove();
            } else {
              console.log("Borrando Bloco de Mod Oculto: " + mod.mod_name);
              mod_element_base.classList.add("blurIgnoredModBlock");
            }
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
}
}