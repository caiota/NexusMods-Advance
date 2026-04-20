var PROFILE_MOUSEHOVER_SET = false;

function SET_PROFILE_OPTIONS_MOUSEHOVER() {
  if(options['NexusMenus_MouseHover']==true){
  if (PROFILE_MOUSEHOVER_SET) return;

  const PROFILE_BTN = document.querySelector("button#profile-menu, div.nav-interact-buttons div.rj-profile");
  if (!PROFILE_BTN) return;

  const isClickMode =
    PROFILE_BTN.id === "profile-menu" &&
    PROFILE_BTN.getAttribute("aria-haspopup") === "menu";

  let closeTimeout;

  function getPopup() {
    return document.querySelector('[aria-labelledby="profile-menu"]');
  }

  function getTray() {
    return document.querySelector("div.rj-profile-tray");
  }

  function openMenu() {
    clearTimeout(closeTimeout);

    if (isClickMode) {
      if (!getPopup()) {
        PROFILE_BTN.click();
      }
    } else {
      const tray = getTray();
      if (tray) tray.classList.add("rj-open");
    }
  }

  function scheduleClose() {
    clearTimeout(closeTimeout);

    closeTimeout = setTimeout(() => {

      if (isClickMode) {
        const popup = getPopup();

        // só fecha se ainda existir e não estiver com hover
        if (popup && !popup.matches(':hover') && !PROFILE_BTN.matches(':hover')) {
          PROFILE_BTN.click();
        }

      } else {
        const tray = getTray();

        if (tray && !tray.matches(':hover') && !PROFILE_BTN.matches(':hover')) {
          tray.classList.remove("rj-open");
        }
      }

    }, 200);
  }

  
  PROFILE_BTN.addEventListener("mouseenter", openMenu);
  PROFILE_BTN.addEventListener("mouseleave", scheduleClose);

  
  const observer = new MutationObserver(() => {
    const popup = getPopup();

    if (popup && !popup._rjBound) {
      popup._rjBound = true;

      popup.addEventListener("mouseenter", () => {
        clearTimeout(closeTimeout);
      });

      popup.addEventListener("mouseleave", scheduleClose);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  document.addEventListener("mousemove", () => {
    const popup = getPopup();
    const tray = getTray();

    const hoveringSomething =
      PROFILE_BTN.matches(':hover') ||
      (popup && popup.matches(':hover')) ||
      (tray && tray.matches(':hover'));

    if (!hoveringSomething) {
      scheduleClose();
    }
  });

  PROFILE_MOUSEHOVER_SET = true;
  SET_NEXUSMENUS_ONMOUSEHOVER();
}
}
function SET_NEXUSMENUS_ONMOUSEHOVER(){

  const HIDE_DELAY = 180;

  let hideTimeout;

  function clearHide() {
    clearTimeout(hideTimeout);
  }

  function delayedHide(fn) {
    hideTimeout = setTimeout(fn, HIDE_DELAY);
  }

  const buttons = document.querySelectorAll(".nav-tab-button");
  const menus = document.querySelectorAll(".nav-tab-wrapper");

  buttons.forEach(button => {
    const title = button.getAttribute("data-title");
    const menu = document.querySelector(`.nav-tab-wrapper[data-title="${title}"]`);

    if (!menu) return;

    button.addEventListener("mouseenter", () => {
      clearHide();

      menus.forEach(m => m.style.display = "none");
      menu.style.display = "block";
    });

    button.addEventListener("mouseleave", () => {
      delayedHide(() => {
        menu.style.display = "none";
      });
    });

    menu.addEventListener("mouseenter", clearHide);

    menu.addEventListener("mouseleave", () => {
      menu.style.display = "none";
    });
  });

 var popoverButtons = Array.from(
  document.querySelectorAll('button[id^="headlessui-popover-button"]')
);

 popoverButtons = popoverButtons.filter(button => {
  const path = button.querySelector(
    "path[d='M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21']"
  );

  return !path;
});

  popoverButtons.forEach(button => {
    let currentPanel = null;

    button.addEventListener("mouseenter", (e) => {
      clearHide();

      if (button.getAttribute("aria-expanded") === "false") {
        button.click();
      }
      setTimeout(() => {
        currentPanel = document.querySelector(
          '[data-headlessui-state="open"][id*="panel"]'
        );
        if (currentPanel) {
          currentPanel.addEventListener("mouseenter", clearHide);

          currentPanel.addEventListener("mouseleave", () => {
            if (button.getAttribute("aria-expanded") === "true") {
              button.click();
            }
          });
        }
      }, 50);
    });

    button.addEventListener("mouseleave", (ee) => {
      if(ee.currentTarget==button){
        return;
      }
      console.log(ee.currentTarget,ee.target)
      delayedHide(() => {
        if (button.getAttribute("aria-expanded") === "true") {
          button.click();
        }
      });
    });
  });

  document.addEventListener("mousemove", (e) => {
    const isOnNav =
    e.target.closest("header") ||
      e.target.closest(".nav-tab-button") ||
      e.target.closest(".nav-tab-wrapper") ||
      e.target.closest('[id^="headlessui-popover-button"]') ||
      e.target.closest('[data-headlessui-state^="open"]');

    if (!isOnNav) {
      menus.forEach(m => (m.style.display = "none"));

      popoverButtons.forEach(button => {
        if (button.getAttribute("aria-expanded") === "true") {
          button.click();
        }
      });
    }
  });



}