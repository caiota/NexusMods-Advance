async function GET_CURRENT_PAGE() {
    function getSelectedPageNumber(element) {
        const anchor = element.querySelector('a.page-selected');
        return anchor ? parseInt(anchor.innerText.trim(), 10) : null;
    }

    if (PAGINA_ATUAL == 0) {
        const part_1_document = document.body.querySelector("div.pagination");
        if (part_1_document) {
            let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;
            let selectedPageNumber = null;

            // Loop para verificar se há um <a> com a classe "page-selected"
            while (part_1_pages) {
                selectedPageNumber = getSelectedPageNumber(part_1_pages);
                if (selectedPageNumber !== null) {
                    console.log("Página Selecionada: " + selectedPageNumber);
                    PAGINA_ATUAL = selectedPageNumber + 1;
                    return PAGINA_ATUAL;
                }
                // Move para o elemento anterior na lista
                part_1_pages = part_1_pages.previousElementSibling;
            }
        }
    }
}
async function GET_MAXPAGES() {

    await GET_CURRENT_PAGE();

    function isNumberElement(element) {
        return element.tagName === 'LI' && !isNaN(parseInt(element.innerText.trim(), 10));
    }

    const part_1_document = document.body.querySelector("div.pagination");
    if (part_1_document) {
        let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;

        // Loop para verificar se há um <a> com a classe "page-selected"
        while (part_1_pages) {

            if (isNumberElement(part_1_pages)) {
                max_pages = parseInt(part_1_pages.innerText.trim(), 10);
                console.log("Total de Páginas: " + max_pages);
                break;
            }

            part_1_pages = part_1_pages.previousElementSibling;
        }

    }

    console.log("Página Atual First: " + PAGINA_ATUAL)
}