
async function REMOVE_MOD_COLLECTIONS() {
  if(current_page === "only_mod_page" || window.location.href.includes("/mods")){
    return;
  }
        const Collections_Section = document.querySelector('section[aria-labelledby="popular-collections-header"]');
        var h4 = [...document.querySelectorAll("h4")]
  .find(el => el.textContent.includes("Collections"));

  if(!Collections_Section && !h4){
    return;
  }
  if(h4){
h4=h4.closest("section") || null;
  }
    if(options['HideCollections_ModPage']==true){
        if(Collections_Section){
            Collections_Section.style.display="none";
        }
        if(h4){
            h4.style.display="none";
        }
        
    }else{
 if(Collections_Section){
            Collections_Section.style.display="block";
        }
        if(h4){
            h4.style.display="block";
        }
    }
}