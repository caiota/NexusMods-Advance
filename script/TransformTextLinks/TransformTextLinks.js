function TRANSFORM_TEXT_LINKS(){
   if(current_page=="only_mod_page"&&current_modTab=="posts"&&options['transformTextLinks']==true){
  var elements = document.querySelectorAll("div[class^='comment-content-text']");

  // regex pra pegar links com http/https
  const urlRegex = /(https?:\/\/[^\s<]+)/g;

  elements.forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

    let node;
    const textNodes = [];

    // pega todos os nós de texto
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const parent = textNode.parentNode;

      // não mexe se já estiver dentro de <a>
      if (!parent || parent.tagName === "A") return;

      const text = textNode.nodeValue;

      // se não tiver link, ignora
      if (!urlRegex.test(text)) return;

      const fragment = document.createDocumentFragment();

      let lastIndex = 0;
      text.replace(urlRegex, (match, url, index) => {
        // texto antes do link
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, index))
        );

        // cria o <a>
        const a = document.createElement("a");
        a.href = url;
        a.textContent = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        fragment.appendChild(a);

        lastIndex = index + url.length;
      });

      // resto do texto depois do último link
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex))
      );

      parent.replaceChild(fragment, textNode);
    });
  });
}
}