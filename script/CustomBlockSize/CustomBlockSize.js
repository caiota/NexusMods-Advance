async function CustomModsBlockSize() {
    if(document.querySelector("style")){
    if (options['ModBlock_Render'] == true) {
        document.querySelector("style").textContent += "div.mods-grid div[class*='mod-tile'] { width:" + options['BlockSize_input'] + " !important; }";
    }
}else{
    
    setTimeout(CustomModsBlockSize,500);
}
}