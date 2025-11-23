async function OriginalImageSetup() {
    if (options['OriginalImages'] === true) {
        // Seleciona todos os elementos de imagem
        const a_links = Array.from(document.querySelectorAll("div[class*='mod-tile'][VISIBLE] img:not([FULL_IMAGE])"));
        const li_links = Array.from(document.querySelectorAll("div[class*='mod-tile'] img:not([FULL_IMAGE])"));
        const mod_images = Array.from(document.querySelectorAll("div[data-e2eid*='media-tile'][VISIBLE] img:not([FULL_IMAGE])"));
        const mod_trackingImages = Array.from(document.querySelectorAll("td.tracking-mod img:not([FULL_IMAGE])"));
        // Combina todos os arrays de links em um único array
        const combinedLinks = a_links.concat(li_links, mod_images, mod_trackingImages);

        for (let i = 0; i < combinedLinks.length; i++) {
            const img = combinedLinks[i];
            if (img.src) {
                setTimeout(() => {
                    if (!img.getAttribute("FULL_IMAGE")) {
                        img.setAttribute("FULL_IMAGE", true);
                        img.src = img.src.replace("/thumbnails", "").replace("/t/large", "");

                    }
                }, i * 200);
            }
        }
    }
}