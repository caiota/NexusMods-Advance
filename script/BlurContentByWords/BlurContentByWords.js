var FunctioNTimeout;

function BLUR_CONTENT_BYWORD() {
  const PAGE_CONTENT = [];
  for (const element of VISIBLE_ELEMENTS) {
    if (!element.isConnected) {
      VISIBLE_ELEMENTS.delete(element);
      continue;
    }
    if (element.hasAttribute("HIDDEN_SETUP")) {
      continue;
    }
    if (!element.matches?.("div[class*='mod-tile'], " + "div[data-e2eid*='media-tile'], " + "dl.accordion table.desc-table td.table-require-name, " + "td.tracking-mod, " + "div[class*='group/collection'][data-e2eid*='collection-tile'], " + "div[class*='relative'][data-e2eid='collection-tile-compact']," + "li.mod-tile")) {
      continue;
    }
    PAGE_CONTENT.push(element);
  }
  if (PAGE_CONTENT.length <= 0) {
    clearTimeout(FunctioNTimeout);
    FunctioNTimeout = setTimeout(BLUR_CONTENT_BYWORD, 2000);
    return;
  }
  PAGE_CONTENT.forEach(function(divItem) {
    const MOD_ROOT = divItem.getRootNode();
    if (MOD_ROOT instanceof ShadowRoot) {
      APPLY_NMA_HIDDENCONTENT_CSS(MOD_ROOT);
    }
    let type = "";
    let author;
    let category = null;
    let description;
    if (current_page != "only_mod_page") {
      divItem = divItem.closest("div[class*='mod-tile']," + "div[data-e2eid*='media-tile']," + "div[class*='group/collection'][data-e2eid*='collection-tile']," + "div[class*='relative'][data-e2eid='collection-tile-compact']," + "li.mod-tile");
      if (divItem && divItem.getAttribute("data-e2eid") == "mod-tile" || (divItem.nodeName=="LI" && divItem.classList.contains("mod-tile"))) {
        type = "MOD";
      } else {
        type = "IMAGE";
      }
      if (divItem && divItem.getAttribute("data-e2eid") == "collection-tile") {
        type = "COLLECTION";
      }
    }
    if (!divItem) {
      return;
    }
    divItem.setAttribute("HIDDEN_SETUP", true);
    const MAIN = divItem.closest("div[class*='mod-tile']," + "div[data-e2eid*='media-tile']," + "tr," + "div[class*='group/collection'][data-e2eid*='collection-tile']," + "div[data-e2eid='collection-tile-compact'], " + "li.mod-tile");
    if (divItem.style.display != 'none' && MAIN && !MAIN.classList.contains("blurIgnoredModBlock") && !MAIN.classList.contains("HideIgnoredModBlock")) {
      const titleElements = divItem.querySelectorAll('a[data-e2eid="mod-tile-title"],' + 'a[data-e2eid="media-tile-title"],' + 'a[data-e2eid="collection-tile-title"],' + 'td.table-require-name a, p.tile-name a,' + 'a.nxm-link');
      const titles = Array.from(titleElements).map(el => el.innerText.trim().toLowerCase()).filter(Boolean);
      description = divItem.querySelector('div[data-e2eid="mod-tile-summary"],' + 'a[href*="/profile/"],'+ 'p.desc')?.innerText.trim().toLowerCase() || "";
      if (type == "MOD") {
        category = divItem.querySelector('a[data-e2eid="mod-tile-category"], div.category a');
        category = category ? category.innerText.trim().toLowerCase() : "";
        author = divItem.querySelector('a[data-e2eid="user-link"] span,' + 'a[data-e2eid="media-tile-author"], div.author a, div.realauthor');
        author = author ? author.innerText.replace("By ", "").replace("Author: ", "").trim().toLowerCase() : "";
      } else if (type == "IMAGE") {
        if (current_page == "only_mod_page") {
          const authorElement = divItem.querySelector('a[description_click="true"]');
          if (authorElement) {
            author = authorElement.innerText.replace("by ", "").trim().toLowerCase();
          }
        } else {
          const authorElement = divItem.querySelector('a[data-e2eid="media-tile-author"]');
          if (authorElement) {
            author = authorElement.innerText.replace("By ", "").trim().toLowerCase();
          }
        }
      } else if (type == "COLLECTION") {
        author = divItem.querySelector('a[data-e2eid="user-link"] span');
        author = author ? author.innerText.replace("by ", "").trim().toLowerCase() : "";
        const collectionInfo = divItem.querySelector("a[data-e2eid='collection-tile-game']," + "a[data-e2eid='collection-tile-category']");
        if (collectionInfo) {
          const parent = collectionInfo.closest("div");
          category = parent ? Array.from(parent.querySelectorAll("a, span")).filter(el => el.innerText.trim()).map(el => el.innerText.trim()).join(" ").toLowerCase() : "";
        } else {
          category = "";
        }
      }
      const containsWord = WORD_LIST.some(word => (author && author.includes(word)) || (category && category.includes(word)) || titles.some(title => title.includes(word)) || (description && description.includes(word)));
      if (containsWord && MAIN) {
        if (options['Hide_BluredContent'] == true) {
          MAIN.classList.add("HideIgnoredModBlock");
        } else {
          MAIN.classList.add("blurIgnoredModBlock");
        }
        console.log("Borrando Conteúdo por Palavra: " + (author || category || titles.join(", ") || description));
      }
    }
  });
}
var LAST_LENGTH = -1;

function LOAD_HIDDEN_WORDS() {
  if (options['hideContentWords'] == true) {
    chrome.runtime.sendMessage({
      action: 'Load_WordList',
    }, async function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        if (response.success == false) {
          console.log("No Banned Words YET!");
          return;
        }
        if (response && response.success) {
          WORD_LIST = response.message[0].split("#-#").map(word => word.toLowerCase());
          if (WORD_LIST.length > 0 && !WORD_LIST[0] == "") {
            LAST_LENGTH = WORD_LIST.length;
            BLUR_CONTENT_BYWORD();
          }
        } else {
          console.error("Error in response:", response.error);
        }
      }
    });
  }
}

function APPLY_NMA_HIDDENCONTENT_CSS(root) {
  if (!root || root.querySelector('#NMA_HiddenContent_CSS')) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'NMA_HiddenContent_CSS';
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
}