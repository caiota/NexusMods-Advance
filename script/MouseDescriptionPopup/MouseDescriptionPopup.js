function DESCRIPTION_ONMOUSE(ignoreCurrentPage = false) {
  if (options['DescriptionOnMouse'] !== true || !(current_page == "only_mod_page" || current_page == "home_page" || SITE_URL.indexOf("/collections/") > 0 || SITE_URL.indexOf("/images/") > 0 || ignoreCurrentPage == true)) {
    return;
  }

  function isInsideGrid(link) {
    let parent = link.parentElement;
    while (parent) {
      if (parent.matches && (parent.matches("div.mods-grid") || parent.matches('div[aria-label="Search Nexus mods"]') || (parent.matches("ul.tiles")&&location.pathname.includes("/mods/motm")) )) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }
  const links = [];
  for (const link of VISIBLE_ELEMENTS) {
    if (!link.isConnected) {
      VISIBLE_ELEMENTS.delete(link);
      continue;
    }
    if (!link.matches || !link.matches("a")) {
      continue;
    }
    if (link.hasAttribute("DESCRIPTION_CLICK")) {
      continue;
    }
    const href = link.href?.replace(/#$/, "");
    if (!href || !/\/mods\/\d+/.test(href)) {
      continue;
    }
    if (isInsideGrid(link)) {
      continue;
    }
    links.push(link);
  }
  let descriptionTimeout;
  let game_id, game_name;
  for (const link of links) {
    link.addEventListener("mouseenter", ev => {
      const currentModId = extrairID(SITE_URL);
      const linkModId = extrairID(link.href.replace(/#$/, ""));
      game_name = link.href.split("/mods/")[0].split(".com/")[1] || null;
      if (game_name == null) {
        return;
      }
      if (SITE_URL.indexOf("trackingcentre") != -1) {
        const trackedMod = ev.target.closest("tr[id*='tracked-mod-']");
        if (trackedMod) {
          game_id = trackedMod.getAttribute("id").replace("tracked-mod-", "").split("-")[0];
        }
      }
      if (options["DescriptionOnMouse"] === true && lastDescriptionID !== linkModId && linkModId !== currentModId && link.href.indexOf("/mods/" + pageID) == -1) {
        clearTimeout(descriptionTimeout);
        descriptionTimeout = setTimeout(() => {
          lastDescriptionID = linkModId;
          if (linkModId && current_modTab != "images" && current_modTab != "videos") {
            if (SITE_URL.indexOf("trackingcentre") != -1) {
              CREATE_MOD_DESCRIPTION(game_id, linkModId, "descricao");
            } else {
              game_id = GAMES.find(g => g.domainName === game_name)?.id;
              CREATE_MOD_DESCRIPTION(game_id, linkModId, "descricao");
            }
          }
        }, 800);
      }
    });
    link.addEventListener("mouseleave", () => {
      lastDescriptionID = 0;
      clearTimeout(descriptionTimeout);
    });
    link.setAttribute("DESCRIPTION_CLICK", true);
  }
}