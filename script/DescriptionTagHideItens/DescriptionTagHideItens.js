async function DESCRIPTION_TAB() {
    try{
    if (current_modTab == "description") {
        const dts = Array.from(document.querySelectorAll("div.accordionitems dt"));
        const requeriments = dts.filter(dt => dt.textContent.includes("Requirements"))[0];
        const permissions = dts.filter(dt => dt.textContent.includes("Permissions and credits"))[0];
        const Translations = dts.filter(dt => dt.textContent.includes("Translations"))[0];
        const Changelogs = dts.filter(dt => dt.textContent.includes("Changelogs"))[0];
        const Donations = dts.filter(dt => dt.textContent.includes("Donations"))[0];
        const Collections = dts.filter(dt => dt.textContent.includes("Collections"))[0];
        const Collections_Content=document.querySelector("dd[data-collections-accordion-content]");
        if (options['HideRequerimentsTab'] == true && requeriments) {
            requeriments.style.display = 'none';

        }
        if (options['HideTranslationsTab'] == true && Translations) {
            Translations.style.display = 'none';

        }
        if (options['HidePermissionsTab'] == true && permissions) {
            permissions.style.display = 'none';

        }
        if (options['HideChangelogsTab'] == true && Changelogs) {
            Changelogs.style.display = 'none';

        }
        if (options['HideDonationsTab'] == true && Donations) {
            Donations.style.display = 'none';
        }
        if (options['HideModCollections'] == true && Collections && Collections_Content) {
            Collections.style.display = 'none';
            Collections_Content.style.display = 'none';
        }

            console.log(Collections)

        PROFILE_ONMOUSE();
        ARTICLES_ONMOUSE();
        FAST_TRANSLATES();
    }
}catch(e){
    console.error("NexusMods Error: "+e)
}
}