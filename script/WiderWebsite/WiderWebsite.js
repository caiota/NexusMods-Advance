var BackTopButton;
var WIDE_WEBSITE_STYLE = null;

function WIDER_WEBSITE() {
    try {

        if (!options || typeof options['WideWebsite'] !== 'boolean') {
            return;
        }
        if (options['WideWebsite'] === true) {

            if (!WIDE_WEBSITE_STYLE) {

                WIDE_WEBSITE_STYLE = document.createElement('style');
                WIDE_WEBSITE_STYLE.id = 'NMA_WideWebsite_CSS';

                WIDE_WEBSITE_STYLE.textContent = `
                    div#mainContent div[class*='relative next-container'],div#mainContent {
                        padding: 0 !important;
                        max-width: 100vw !important;
                        width: 100% !important;
                        margin-left: auto;
                        margin-right: auto;
                    }
                `;

                document.documentElement.appendChild(WIDE_WEBSITE_STYLE);

            }

if (/\/mods\/\d+\/edit\//.test(location.pathname)) {
 const editPanel = document.querySelector("div#mainContent div[style*='--mod-form-width:']");
if (editPanel) {
  editPanel.style.removeProperty('--mod-form-width');
}
}
        } else {

            if (WIDE_WEBSITE_STYLE) {
                WIDE_WEBSITE_STYLE.remove();
                WIDE_WEBSITE_STYLE = null;
            }
        }

        BackTopButton = document.querySelector("div#rj-back-to-top");

    } catch (e) {
        console.error("NexusMods Advance Error:", e);
    }
}