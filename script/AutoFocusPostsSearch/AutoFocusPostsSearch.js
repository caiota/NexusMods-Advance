function FocusSearchElement(){
    const formSearch=document.querySelector("input#comment_search");
    if(formSearch){
        formSearch.focus();
        formSearch.click();
    }
}