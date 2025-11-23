
async function REMOVE_MOD_COLLECTIONS() {
        const Collections_Section = document.querySelector('section[aria-labelledby="popular-collections-header"]');
        if(Collections_Section){
    if(options['HideCollections_ModPage']==true){
            Collections_Section.style.display="none";
        
    }else{

            Collections_Section.style.display="block";
    }
}
}