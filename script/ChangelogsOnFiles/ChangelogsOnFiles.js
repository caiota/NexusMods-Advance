async function FAST_CHANGELOGS() {
  try {
    if (current_modTab !== "files" || options['AwaysChangelogs'] !== true) {
      return;
    }
    for (const item of VISIBLE_ELEMENTS) {
      if (!item.isConnected) {
        VISIBLE_ELEMENTS.delete(item);
        continue;
      }
      if (!item.matches || !item.matches("dl.accordion dt div.stat a")) {
        continue;
      }
      if (item.hasAttribute("CHANGELOG_INJECTED")) {
        continue;
      }
      const temp = item.innerText;
      item.setAttribute("CHANGELOG_INJECTED", true);
      const dt = item.closest("dt");
      if (!dt) {
        continue;
      }
      const dd = dt.nextElementSibling;
      if (!dd) {
        continue;
      }
      const descriptionDiv = dd.querySelector("div.files-description");
      if (!descriptionDiv) {
        continue;
      }
      if (!descriptionDiv.querySelector("div#InjectChangelog") && !changelogs_cache[temp]) {
        await LOAD_CHANGELOGS(pageID, descriptionDiv, temp);
      } else {
        console.log("Carregando do Cache");
        const tempDiv = document.createElement("div");
        tempDiv.id = "InjectChangelog";
        tempDiv.innerHTML = changelogs_cache[temp].html;
        if (!descriptionDiv.getAttribute("CHANGELOG_NOCACHE")) {
          tempDiv.classList.add("fade-in-start");
          descriptionDiv.appendChild(tempDiv);
          requestAnimationFrame(() => {
            tempDiv.classList.add("fade-in");
          });
          descriptionDiv.setAttribute("CHANGELOG_NOCACHE", true);
        }
      }
    }
  } catch (e) {
    console.error("NexusMods Advance Error" + e);
  }
}
async function LOAD_CHANGELOGS(modID, elemento, version) {
  try {
    await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModChangeLogPopUp?mod_id=" + modID + "&game_id=" + gameID_Number + "&version=" + version, http_headers).then(response => response.text()).then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      currentGame = document.querySelector("div.nav-current-game a").href;
      const tempDiv = document.createElement("div");
      tempDiv.id = "InjectChangelog"
      tempDiv.innerHTML = doc.body.innerHTML;
      changelogs_cache[version] = {
        html: doc.body.innerHTML
      }
      if (!elemento.querySelector("div#InjectChangelog")) {
        elemento.setAttribute("CHANGELOG_NOCACHE", true)
        tempDiv.classList.add("fade-in-start");
        elemento.appendChild(tempDiv);
        requestAnimationFrame(() => {
          tempDiv.classList.add("fade-in");
        });
      }
    }).catch(error => {
      console.error('Erro ao buscar o HTML:', error);
    });
  } catch (e) {
    console.error("NexusMods Advance Error" + e);
  }
}
