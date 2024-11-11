async function CustomModsBlockSize() {
    if (options['ModBlock_Render'] == true) {
        document.querySelector("style").textContent += "ul.tiles li.mod-tile { width:" + options['BlockSize_input'] + " !important; }";
    }
}
async function CustomGameBlockSize() {
    if (options['GameBlockSize_input']) {
        document.querySelector("style").textContent += "ul.game-tiles li.image-tile { width:" + options['GameBlockSize_input'] + " !important; }";
        document.querySelector("style").textContent += "ul#BetterGameList li.gameCard { width:" + options['GameBlockSize_input'] + " !important; }";
    }
}