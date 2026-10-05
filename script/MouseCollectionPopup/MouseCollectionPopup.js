function COLLECTIONS_ONMOUSE() {
  if (options['CollectionsOnMouse'] !== true) {
    return;
  }
  let currentModId = extrairID(SITE_URL);
  if (!currentModId) {
    currentModId = extrairIDColecao(SITE_URL);
  }
  const currentUrl = window.location.href.replace(/#$/, '');
  let collectionTimeout;
  for (const link of VISIBLE_ELEMENTS) {
    if (!link.isConnected) {
      VISIBLE_ELEMENTS.delete(link);
      continue;
    }
    if (!link.matches || !link.matches("a[href*='/collections/']")) {
      continue;
    }
    if (link.hasAttribute("COLLECTION_POPUP")) {
      continue;
    }
    const href = link.href?.replace(/#$/, '');
    if (!href || href === currentUrl) {
      continue;
    }
    try {
      const url = new URL(href);
      const parts = url.pathname.split('/').filter(Boolean);
      // /games/<game>/collections/<id>
      const formatGames = parts.length === 4 && parts[0] === 'games' && parts[2] === 'collections';
      // /<game>/collections/<id>
      const formatNext = parts.length === 3 && parts[1] === 'collections';
      if (!formatGames && !formatNext) {
        continue;
      }
    } catch (e) {
      continue;
    }
    link.addEventListener("mouseenter", function() {
      const linkModId = extrairID(link.href.replace(/#$/, '')) || extrairIDColecao(link.href.replace(/#$/, ''));
      if (options['CollectionsOnMouse'] === true && lastDescriptionID !== linkModId && linkModId !== currentModId) {
        clearTimeout(collectionTimeout);
        collectionTimeout = setTimeout(function() {
          lastDescriptionID = linkModId;
          temp_gameID = findIdBydomainName(link.href);
          console.log("Carregando MOD ID " + linkModId + " do jogo " + temp_gameID);
          CREATE_MOD_DESCRIPTION(link.href, linkModId, 'collection');
        }, 1000);
      }
    });
    link.addEventListener("mouseleave", function() {
      lastDescriptionID = 0;
      clearTimeout(collectionTimeout);
    });
    link.setAttribute("COLLECTION_POPUP", true);
  }
}