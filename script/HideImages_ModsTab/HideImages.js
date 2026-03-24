function HIDE_IMAGES() {
var filesImgs=document.querySelectorAll("div#mod_files div.img-wrapper img")||null;
var descriptionImgs=document.querySelectorAll("div.mod_description_container div.img-wrapper")||null;
if(options['HideExternalImages_ModPage']==true&&current_page=="only_mod_page"&&(current_modTab=="files"||current_modTab=="description")){
if(filesImgs){
  filesImgs.forEach((item)=>{
    item.style.display='none';
  })
}
if(descriptionImgs){
  descriptionImgs.forEach((item)=>{
    item.style.display='none';
  })
}
HIDE_YOUTUBE_FRAMES("HIDE_IT");
}
else if(options['HideExternalImages_ModPage']==false){
  if(filesImgs){
  filesImgs.forEach((item)=>{
    item.style.display='';
  })
}
if(descriptionImgs){
  descriptionImgs.forEach((item)=>{
    item.style.display='';
  })
}

HIDE_YOUTUBE_FRAMES("SHOW_IT");
}
}

function HIDE_YOUTUBE_FRAMES(style){
   const iframes = Array.from(document.querySelectorAll('iframe'));

        for (const iframeContainer of iframes) {
            if (iframeContainer.src.includes('youtube.com')) {
                const frameParent = iframeContainer.closest("div");

  if(style=="HIDE_IT"){
               frameParent.style.display='none';
  }else{
               frameParent.style.display='';
  }
            }
        }
        if(style=='SHOW_IT'){
          CHECK_YOUTUBEIFRAMES();
        }
}