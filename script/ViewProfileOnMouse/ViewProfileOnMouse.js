async function PROFILE_ONMOUSE(){
    try {

      if (options['ProfileOnMouse'] == true&&SITE_URL.indexOf("next.nexusmods.com/")==-1) {
        const profileAndUserUrls_mainContent = Array.from(document.querySelectorAll("div#mainContent a:not([PROFILE_ONMOUSE])")).filter(function (link) {
          return /\/(profile|users)\//.test(link.href) && !/about-me/.test(link.href) && !/myaccount/.test(link.href);
        });
        const profileAndUserUrls_endorsePopup = Array.from(document.querySelectorAll("div#mod-endorsers-popup a:not([PROFILE_ONMOUSE])")).filter(function (link) {
          return /\/(profile|users)\//.test(link.href) && !/about-me/.test(link.href) && !/myaccount/.test(link.href);
        });
        const profileAndUserUrls = profileAndUserUrls_mainContent.concat(profileAndUserUrls_endorsePopup);
        let profileTimeout;
        for (let i = 0; i < profileAndUserUrls.length; i++) {
          const link = profileAndUserUrls[i];
          link.setAttribute("PROFILE_ONMOUSE", true);
          if (link.href.indexOf("?tab=") != -1 || !link.href) {
            return;
          }
          if (!link.innerText && link.querySelector('img')) {
            const TempName = link.querySelector('img').getAttribute("title") || link.querySelector('img').getAttribute("alt");
            link.href = "https://next.nexusmods.com/profile/" + TempName + "/about-me"
          } else {

            link.href = "https://next.nexusmods.com/profile/" + link.innerText + "/about-me";
          }
          link.setAttribute("target", '_blank')
          link.addEventListener("mouseenter", function (ev) {
            if (options['ProfileOnMouse'] == true && lastDescriptionID != ev.target.href) {
              clearTimeout(profileTimeout);
              profileTimeout = setTimeout(function () {
                lastDescriptionID = ev.target.href;
                openPopupAtMousePosition(ev.target.href + "?popup=true", 'Popup', 600, 900, ev);
              }, 600);
            }
          });

          link.addEventListener("mouseleave", function (ev) {
            lastDescriptionID = 0;
            clearTimeout(profileTimeout);
          });
        };
      }
    } catch (e) {
      console.error("NexusMods Advance Error:" + E);
    }
  }