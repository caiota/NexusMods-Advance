async function STICKY_EDIT_BUTTONS() {
    try {

        if (SITE_URL.indexOf("/mods/edit/") != -1 || SITE_URL.indexOf("/mods/add") != -1) {
            const featuredElement = document.querySelector("section.modpage div#featured");
            if (featuredElement) {
                featuredElement.style.background = "#383838"
                featuredElement.style.position = "sticky"
                featuredElement.style.top = document.querySelector("header#head").offsetHeight - 1 + 'px';
                featuredElement.style.zIndex = "9999"
            }
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}