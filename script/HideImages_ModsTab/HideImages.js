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
}
}