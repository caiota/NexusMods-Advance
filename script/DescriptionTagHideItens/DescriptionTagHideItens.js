var DESCRIPTION_OBSERVER = null;
 function DESCRIPTION_TAB() {
    try {
        if (current_modTab == "description") {
            const accordion = document.querySelector("div.tabcontent-mod-page div.accordionitems");
            if (!accordion) {
                return;
            }
            // ========================================================
            // ATUALIZA VISIBILIDADE DOS ITENS
            // ========================================================
            function UPDATE_DESCRIPTION_ITEMS() {

        const dts = Array.from(accordion.querySelectorAll("dt"));

        const requeriments = dts.find(dt =>
            dt.textContent.includes("Requirements")
        );

        const permissions = dts.find(dt =>
            dt.textContent.includes("Permissions and credits")
        );

        const Translations = dts.find(dt =>
            dt.textContent.includes("Translations")
        );

        const Changelogs = dts.find(dt =>
            dt.textContent.includes("Changelogs")
        );

        const ModsUsingThisMod = dts.find(dt =>
            dt.textContent.includes("Mods using this mod")
        );

        const Donations = dts.find(dt =>
            dt.textContent.includes("Donations")
        );

        const Collections = dts.find(dt =>
            dt.textContent.includes("Collections")
        );

        const Collections_Content =
            accordion.querySelector("dd[data-collections-accordion-content]");


        if (requeriments) {
            requeriments.style.display =
                options['HideRequerimentsTab'] == true ? 'none' : '';
        }

        if (Translations) {
            Translations.style.display =
                options['HideTranslationsTab'] == true ? 'none' : '';
        }

        if (permissions) {
            permissions.style.display =
                options['HidePermissionsTab'] == true ? 'none' : '';
        }

        if (Changelogs) {
            Changelogs.style.display =
                options['HideChangelogsTab'] == true ? 'none' : '';
        }

        if (Donations) {
            Donations.style.display =
                options['HideDonationsTab'] == true ? 'none' : '';
        }

        if (ModsUsingThisMod) {
            ModsUsingThisMod.style.display =
                options['HideModsUsingThisModTab'] == true ? 'none' : '';
        }

        if (Collections) {
            Collections.style.display =
                options['HideModCollections'] == true ? 'none' : '';
        }

        if (Collections_Content) {
            Collections_Content.style.display =
                options['HideModCollections'] == true ? 'none' : '';
        }
             COLLECTIONS_ONMOUSE();
             PROFILE_ONMOUSE();
             ARTICLES_ONMOUSE();
             FAST_TRANSLATES();
             DESCRIPTION_ONMOUSE();
}
            
            // ========================================================
            // PRIMEIRA VERIFICAÇÃO
            // ========================================================
             UPDATE_DESCRIPTION_ITEMS();
            // ========================================================
            // MUTATION OBSERVER
            // ========================================================
            if (DESCRIPTION_OBSERVER) {
                DESCRIPTION_OBSERVER.disconnect();
                DESCRIPTION_OBSERVER = null;
            }
            DESCRIPTION_OBSERVER = new MutationObserver(() => {
                UPDATE_DESCRIPTION_ITEMS();
            });
            DESCRIPTION_OBSERVER.observe(accordion, {
                childList: true,
                subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"]
            });
            
        }
    } catch (e) {
        console.error("NexusMods Error: " + e);
    }
}
