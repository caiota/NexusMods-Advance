let PROFILE_ONMOUSE_TIMEOUT = null;

function PROFILE_ONMOUSE() {
  try {
    if (options['ProfileOnMouse'] == true && SITE_URL.indexOf("/profile/") == -1) {
      if (PROFILE_ONMOUSE_TIMEOUT) {
        clearTimeout(PROFILE_ONMOUSE_TIMEOUT);
      }
      PROFILE_ONMOUSE_TIMEOUT = setTimeout(() => {
        PROFILE_ONMOUSE_TIMEOUT = null;
        for (const link of VISIBLE_ELEMENTS) {
          // Se o elemento saiu do DOM, remove do Set
          if (!link.isConnected) {
            VISIBLE_ELEMENTS.delete(link);
            continue;
          }
          // Só interessa <a> de perfil/usuário
          if (!link.matches || !link.matches("a:is([href*='/profile/'], [href*='/users/']):not([PROFILE_ONMOUSE])")) {
            continue;
          }
          // Ignora links indesejados
          if (!link.href || link.href.indexOf("?tab=") != -1 || /about-me|myaccount/.test(link.href)) {
            continue;
          }
          link.setAttribute("PROFILE_ONMOUSE", true);
          link.setAttribute("target", "_blank");
          let profileTimeout;
          link.addEventListener("mouseenter", function(ev) {
            const href = ev.currentTarget.href;
            if (options['ProfileOnMouse'] == true && lastDescriptionID != href) {
              clearTimeout(profileTimeout);
              profileTimeout = setTimeout(function() {
                lastDescriptionID = href;
                openPopupAtMousePosition(href + "?popup=true", 'Popup', 600, 900, ev);
              }, 800);
            }
          });
          link.addEventListener("mouseleave", function() {
            lastDescriptionID = -1;
            clearTimeout(profileTimeout);
          });
        }
      
      }, 1000);
    }
  } catch (e) {
    console.error("NexusMods Advance Error:" + e);
  }
}