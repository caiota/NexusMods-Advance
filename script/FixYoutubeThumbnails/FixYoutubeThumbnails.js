async function Fix_Youtube_Thumbnails(){
    
    const mod_videos = Array.from(document.querySelectorAll('li.video-tile[VISIBLE] a.mod-image div.fore_div img:not([FULL_IMAGE])'));
    for (let i = 0; i < mod_videos.length; i++) {
        const img = mod_videos[i];
        if (img.src) {
    img.setAttribute("FULL_IMAGE", true);
    let tmpU=new URL(img.src);
    if(tmpU.search){
      tmpU.search="";
    }
    tmpU=tmpU.href;
    if(tmpU.indexOf("mqdefault.jpg")==-1){
    img.src = tmpU+"/mqdefault.jpg";
    }
}
    }
}