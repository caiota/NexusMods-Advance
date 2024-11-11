async function FAST_TRANSLATES() {
    if (options['FastDownloadTranslates'] === true && current_modTab === "description") {
        const translationTables = document.querySelectorAll("table.translation-table");

        if (translationTables.length > 0) {
            const translateElements = Array.from(document.querySelectorAll("table.translation-table td.table-translation-name:not([TRANSLATE_MARK])"));

            for (const link of translateElements) {
                if (link.querySelector("a")) {
                    link.style.position = "relative";
                    link.setAttribute("TRANSLATE_MARK", true);

                    const fromMod = await extrairID(link.querySelector("a").href);
                    fastTranslateDownload(fromMod, link);
                }
            }
        }
    }
}
function fastTranslateDownload(modId, mod_element) {
    tempDiv = document.createElement("div");
    tempDiv.id = "translateTempDiv";
    tempSpan = document.createElement("span");
    tempSpan.id = "spanPopupMsg";
    tempSpan.innerText = translate_strings.fastDownloadTranslate_tip.message;
    tempButton = document.createElement("i");
    tempButton.addEventListener("click", function () {

        CREATE_MOD_DESCRIPTION(gameId, modId, 'translateMod');
    });
    tempButton.classList = "fastDownloadButton fa-solid fa-cloud-arrow-down";
    tempButton.setAttribute("aria-hidden", true);
    tempDiv.appendChild(tempButton)
    tempDiv.appendChild(tempSpan)
    mod_element.appendChild(tempDiv);
    mod_element.setAttribute("TRANSLATE_MARK", true);

}