function OriginalImageSetup() {
  if (options['OriginalImages'] !== true) {
    return;
  }
  let imageIndex = 0;
  for (const element of VISIBLE_ELEMENTS) {
    // Libera referências de elementos removidos do DOM
    if (!element.isConnected) {
      VISIBLE_ELEMENTS.delete(element);
      continue;
    }
    // Só nos interessam estes tipos de bloco
    if (!element.matches || !element.matches("div[class*='mod-tile'], div[data-e2eid*='media-tile'], td.tracking-mod")) {
      continue;
    }
    const images = element.querySelectorAll("img:not([FULL_IMAGE])");
    for (const img of images) {
      if (!img.src) {
        continue;
      }
      // Marca imediatamente para impedir que outra execução
      // agende a mesma imagem novamente.
      img.setAttribute("FULL_IMAGE", true);
      const delay = imageIndex * 150;
      imageIndex++;
      setTimeout(() => {
        if (!img.isConnected) {
          return;
        }
        img.src = img.src.replace("/thumbnails", "").replace("/t/large", "");
      }, delay);
    }
  }
}