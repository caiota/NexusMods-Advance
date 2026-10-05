function TRANSFORM_TEXT_LINKS() {
 if (options['transformTextLinks'] !== true) {
   return;
 }

 const validModPage = current_page === "only_mod_page" && (current_modTab === "posts" ||current_modTab === "files" || current_modTab === "logs" || current_modTab === "description" || current_modTab === "articles");
 const validArticlePage = SITE_URL.includes("/articles/") || SITE_URL.includes("/images/");
 if (!validModPage && !validArticlePage) {
   return;
 }

  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  for (const element of VISIBLE_ELEMENTS) {
    if (!element.isConnected) {
      VISIBLE_ELEMENTS.delete(element);
      continue;
    }
    if (!element.matches || !element.matches("div[class^='comment-content-text'], dl.accordion dt,section#section.articlepage article,dd[data-id]")) {
      continue;
    }
    if (element.hasAttribute("TEXT_TRANSFORMED")) {
      continue;
    }
    let elements = [];
    // Comentário
    if (element.matches("div[class^='comment-content-text']")) {
      elements.push(element);
      // Accordion
    } else if (element.matches("dl.accordion dt")) {
      if (!element.textContent.toLowerCase().includes("changelogs")) {
        continue;
      }
      let changelogContent = element.nextElementSibling;
      if (!changelogContent || changelogContent.tagName.toLowerCase() !== "dd") {
        continue;
      }
      elements.push(changelogContent);
    // Article
     } else if ( element.matches("section#section.articlepage article") ) { 
      elements.push(element); 
    }else if( element.matches("dd[data-id]") ) {
      elements.push(element);
    }
    for (const el of elements) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      let textNode;
      while ((textNode = walker.nextNode())) {
        const parent = textNode.parentNode;
        // Não mexe se já estiver dentro de <a>
        if (!parent || parent.tagName === "A") {
          continue;
        }
        const text = textNode.nodeValue;
        urlRegex.lastIndex = 0;
        if (!urlRegex.test(text)) {
          continue;
        }
        urlRegex.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        text.replace(urlRegex,
          (match, url, index) => {
            const clean = cleanUrl(url);
            if (!clean || !clean.startsWith("http")) {
              return match;
            }
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            const a = document.createElement("a");
            a.href = clean;
            a.textContent = clean;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            fragment.appendChild(a);
            lastIndex = index + match.length;
            return match;
          });
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        parent.replaceChild(fragment, textNode);
      }
    }
    element.setAttribute("TEXT_TRANSFORMED", true);
  }
  COLLECTIONS_ONMOUSE();
  PROFILE_ONMOUSE();
  ARTICLES_ONMOUSE();
  FAST_TRANSLATES();
  DESCRIPTION_ONMOUSE();
}

function cleanUrl(url) {
  const unwanted = /[.,;:!?()[\]{}'"”´`~^*|\\]/;
  let cleaned = url.trim();
  while (cleaned.length > 0 && unwanted.test(cleaned.charAt(cleaned.length - 1))) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

function cleanUrl(url) {
  // Remove caracteres indesejados do início e fim
  const unwanted = /[.,;:!?()\[\]{}'"”´`~^*|\\]/;
  let cleaned = url.trim();
  // Remove repetidamente enquanto o último caractere for indesejado
  while (cleaned.length > 0 && unwanted.test(cleaned.charAt(cleaned.length - 1))) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}