async function DESCRIPTION_TAB() {
    try{
    if (current_modTab == "description") {
        const dts = Array.from(document.querySelectorAll("div.accordionitems dt"));
        const requeriments = dts.filter(dt => dt.textContent.includes("Requirements"))[0];
        const permissions = dts.filter(dt => dt.textContent.includes("Permissions and credits"))[0];
        const Translations = dts.filter(dt => dt.textContent.includes("Translations"))[0];
        const Changelogs = dts.filter(dt => dt.textContent.includes("Changelogs"))[0];
        const Donations = dts.filter(dt => dt.textContent.includes("Donations"))[0];
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
        PROFILE_ONMOUSE();
        ARTICLES_ONMOUSE();
        FAST_TRANSLATES();
    }
}catch(e){
    console.error("NexusMods Error: "+e)
}
}