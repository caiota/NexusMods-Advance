var PROFILE_MOUSEHOVER_SET = false;
function SET_PROFILE_OPTIONS_MOUSEHOVER() {
  if (options['NexusMenus_MouseHover'] !== true) {
    return;
  } /* ============================================================ PERFIL ============================================================ */
  if (!PROFILE_MOUSEHOVER_SET) {
    const PROFILE_BTN = document.querySelector("button#profile-menu, div.nav-interact-buttons div.rj-profile");
    if (PROFILE_BTN) {
      const isClickMode = PROFILE_BTN.id === "profile-menu" && PROFILE_BTN.getAttribute("aria-haspopup") === "menu";
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
          if (tray) {
            tray.classList.add("rj-open");
          }
        }
      }

      function scheduleClose() {
        clearTimeout(closeTimeout);
        closeTimeout = setTimeout(() => {
          if (isClickMode) {
            const popup = getPopup();
            if (popup && !popup.matches(":hover") && !PROFILE_BTN.matches(":hover")) {
              PROFILE_BTN.click();
            }
          } else {
            const tray = getTray();
            if (tray && !tray.matches(":hover") && !PROFILE_BTN.matches(":hover")) {
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
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
      document.addEventListener("mousemove", () => {
        const popup = getPopup();
        const tray = getTray();
        const hoveringSomething = PROFILE_BTN.matches(":hover") || (popup && popup.matches(":hover")) || (tray && tray.matches(":hover"));
        if (!hoveringSomething) {
          scheduleClose();
        }
      });
      PROFILE_MOUSEHOVER_SET = true;
    }
  } /* ============================================================ MENUS DO NEXUS Independente do perfil existir ou não ============================================================ */
  SET_NEXUSMENUS_ONMOUSEHOVER();
}

var NEXUS_MENUS_MOUSEHOVER_SET = false;
var NEXUS_MENUS_OBSERVER = null;
var NEXUS_MENUS_HEADER = null;

function SET_NEXUSMENUS_ONMOUSEHOVER() {

    const HEADER = document.querySelector("header");

    if (!HEADER) return;

    // Se já estamos ligados exatamente neste header, não faz nada
    if (
        NEXUS_MENUS_MOUSEHOVER_SET &&
        NEXUS_MENUS_HEADER === HEADER
    ) {
        return;
    }

    NEXUS_MENUS_HEADER = HEADER;
    NEXUS_MENUS_MOUSEHOVER_SET = true;

    const HIDE_DELAY = 180;
    let hideTimeout;

    function clearHide() {
        clearTimeout(hideTimeout);
    }

    function delayedHide(button) {

        clearHide();

        hideTimeout = setTimeout(() => {

            const popover = getPopover(button);

            if (
                button.matches(":hover") ||
                popover?.matches(":hover")
            ) {
                return;
            }

            if (button.getAttribute("aria-expanded") === "true") {
                button.click();
            }

        }, HIDE_DELAY);
    }

    // =========================================================
    // HEADLESS UI
    // =========================================================

    const MENU_MAP = {
        "Games": "games-sub-nav",
        "Mods": "mods-sub-nav",
        "Collections": "collections-sub-nav",
        "Media": "media-sub-nav",
        "Community": "community-sub-nav",
        "Support": "support-sub-nav"
    };

    function getMenuName(button) {
        return button.querySelector(":scope > span")?.textContent.trim();
    }

    function getPopover(button) {

        const name = getMenuName(button);
        const e2eid = MENU_MAP[name];

        if (!e2eid) return null;

        return document.querySelector(
            `[data-e2eid="${e2eid}"]`
        );
    }

    function bindPopover(button, popover) {

        if (popover._NMA_HOVER_BOUND) return;

        popover._NMA_HOVER_BOUND = true;

        popover.addEventListener("mouseenter", clearHide);

        popover.addEventListener("mouseleave", () => {
            delayedHide(button);
        });
    }

    function openPopover(button) {

        clearHide();

        if (button.getAttribute("aria-expanded") === "true") {
            return;
        }

        const observer = new MutationObserver(() => {

            const popover = getPopover(button);

            if (!popover) return;

            bindPopover(button, popover);

            observer.disconnect();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        button.click();

        setTimeout(() => {
            observer.disconnect();
        }, 1000);
    }

    function setupHeadlessButtons() {

        const buttons = HEADER.querySelectorAll(
            'button[id^="headlessui-popover-button"]'
        );

        buttons.forEach(button => {

            if (button._NMA_HOVER_BOUND) return;

            const name = getMenuName(button);

            if (!MENU_MAP[name]) return;

            button._NMA_HOVER_BOUND = true;

            button.addEventListener("mouseenter", () => {
                openPopover(button);
            });

            button.addEventListener("mouseleave", () => {
                delayedHide(button);
            });
        });
    }

    // =========================================================
    // MENUS ANTIGOS
    // =========================================================
function setupOldMenus() {

    const buttons = HEADER.querySelectorAll(".nav-tab-button");

    let activeButton = null;
    let activeMenu = null;
    let closeTimeout = null;

    function clearClose() {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }

    function openMenu(button, menu) {

        clearClose();

        // Já é o menu ativo
        if (activeButton === button) {
            return;
        }

        // Fecha o menu anterior imediatamente
        if (
            activeButton &&
            activeButton !== button &&
            activeButton._NMA_HOVER_OPEN
        ) {
            activeButton.click();
            activeButton._NMA_HOVER_OPEN = false;
        }

        activeButton = button;
        activeMenu = menu;

        if (!button._NMA_HOVER_OPEN) {
            button.click();
            button._NMA_HOVER_OPEN = true;
        }
    }

    function scheduleClose(button, menu) {

        clearClose();

        closeTimeout = setTimeout(() => {

            // O mouse voltou para algum botão
            if (button.matches(":hover")) {
                return;
            }

            // O mouse entrou no menu
            if (menu.matches(":hover")) {
                return;
            }

            // Outro menu já virou o ativo
            if (activeButton !== button) {
                return;
            }

            if (button._NMA_HOVER_OPEN) {
                button.click();
                button._NMA_HOVER_OPEN = false;
            }

            activeButton = null;
            activeMenu = null;

        }, 300);
    }

    buttons.forEach(button => {

        if (button._NMA_HOVER_BOUND) return;

        const menuName = button.textContent.trim();

        const menu = Array.from(
            document.querySelectorAll(".nav-tab-wrapper")
        ).find(menu =>
            menu.getAttribute("data-title") === menuName
        );

        if (!menu) return;

        button._NMA_HOVER_BOUND = true;

        button.addEventListener("mouseenter", () => {
            openMenu(button, menu);
        });

        button.addEventListener("mouseleave", () => {
            scheduleClose(button, menu);
        });

        menu.addEventListener("mouseenter", () => {
            clearClose();

            activeButton = button;
            activeMenu = menu;
        });

        menu.addEventListener("mouseleave", () => {
            scheduleClose(button, menu);
        });
    });
}

    function scanMenus() {
        setupHeadlessButtons();
        setupOldMenus();
    }

    scanMenus();

    // =========================================================
    // OBSERVA O HEADER ATUAL
    // =========================================================

    if (NEXUS_MENUS_OBSERVER) {
        NEXUS_MENUS_OBSERVER.disconnect();
    }

    NEXUS_MENUS_OBSERVER = new MutationObserver(() => {
        scanMenus();
    });

    NEXUS_MENUS_OBSERVER.observe(HEADER, {
        childList: true,
        subtree: true
    });
}

