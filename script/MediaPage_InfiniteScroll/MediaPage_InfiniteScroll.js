var IMAGES_HTML = [];
var canLoadImages=false;
async function GENERATE_INFINITE_SCROLL_MEDIA() {

const NEXT_PAGE=document.querySelector("button[title='Next page'] title#icon_labelledby_next-page").closest("button");
if(NEXT_PAGE){
    NEXT_PAGE.click();
}
}

async function NEXT_MEDIA_PAGE() {

    const grid = document.querySelector("div.media-grid");
    const newTiles = document.querySelectorAll("div.media-grid div[data-e2eid='media-tile']");

    newTiles.forEach(tile => {
        // Só adiciona se ainda não estiver no array
        if (!IMAGES_HTML.includes(tile)) {
            IMAGES_HTML.push(tile);
        }
    });
IMAGES_HTML.reverse();

    // Reinsere todos os salvos no topo
    IMAGES_HTML.forEach(tile => {
        grid.prepend(tile);
    });
canLoadImages=false;
    console.log(IMAGES_HTML);
}
