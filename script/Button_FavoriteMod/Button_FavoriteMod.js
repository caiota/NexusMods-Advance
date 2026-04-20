var favorite_mods={};
function GET_FAVORITE_MODS(){
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'GET_FAVORITE_MODS'
      },
      function (response) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          if (response && response.success) {
            resolve(response.message);
          } else {
            reject(response?.error || "Erro desconhecido");
          }
        }
      }
    );
  });
}

async function FAVORITE_MOD(){ //Incompleto por enquanto
return;
  
favorite_mods = await GET_FAVORITE_MODS();
console.log(favorite_mods)
RENDER_FAVORITES_PANEL();
    if(current_page=="only_mod_page"&&!document.querySelector("div#NMA_FAVORITE")){
        const ul_element=document.querySelector("ul.modactions");

        if(ul_element&&!ul_element.querySelector("li#NMA_FAVORITE")){
            const btns=ul_element.querySelectorAll("li");
            //const trackBtn=ul_element.querySelector("li[id^='action-track']");


            //translate_strings.popupTip_Desc
            var FAVORITE=document.createElement("li");
            FAVORITE.id="NMA_FAVORITE";
            var DIV=document.createElement("div");
            var TrackIcon = document.createElement("i");
            TrackIcon.classList = "advanceIcon fa-solid fa-thumbtack";
            TrackIcon.setAttribute("aria-hidden", true);
            var SPAN=document.createElement("span");
            SPAN.innerText="PIN MOD";
            DIV.appendChild(TrackIcon);
            DIV.appendChild(SPAN);
            FAVORITE.appendChild(DIV);
            ul_element.prepend(FAVORITE);
             const modName = document.querySelector("section.modpage h1").innerText || null;
        const modCategory = document.querySelector('ul#breadcrumb a[href*="mods?categoryName="]').innerText|| null
        const thumbnailUrl = document.querySelector("ul.thumbgallery li img")?.src || 'https://www.nexusmods.com/assets/images/default/noimage.svg';
        const match = thumbnailUrl.match(/mods\/(\d+)\//);
      const game_number = match ? match[1] : null;
      const game_name=findGameById(game_number) || null;
 const mod_id = window.location.href.split("/mods/")[1].split("?")?.[0]
const modLink=window.location.href.split("?")[0]
      console.log(modName,game_name,modCategory,thumbnailUrl,game_number,mod_id);
if(favorite_mods&&Object.entries(favorite_mods).length>0){
const mod = favorite_mods[game_number]?.find(mod => 
	mod.modId === mod_id && mod.modCategory === modCategory
);
console.log(mod);
}
      FAVORITE.addEventListener("click",(ev)=>{
        console.log("CLICK?")
        console.log({
      action: 'Favorite_Mod',
      modLink:modLink,
      modId: mod_id,
      gameNumber:game_number,
      ModCategory:modCategory,
      thumbnail:thumbnailUrl,
      mod_name:modName,
      game_Name:game_name
    })
        chrome.runtime.sendMessage(
    {
      action: 'Favorite_Mod',
      modLink:modLink,
      modId: mod_id,
      gameNumber:game_number,
      ModCategory:modCategory,
      thumbnail:thumbnailUrl,
      mod_name:modName,
      game_Name:game_name
    },
    async function (response) {
      if (chrome.runtime.lastError) {
        console.error(
          'Error sending message:',
          chrome.runtime.lastError.message
        )
      } else {
        if (response && response.success) {
          console.log(response)
        } else {
          console.error('Error in response:', response.error)
        }
      }
    });
      })
        }
    }
    }

    function RENDER_FAVORITES_PANEL(){
      if(!document.querySelector("div#FavoritesPanel")){
        const panel = document.createElement("div");
  panel.id = "FavoritesPanel";
  
  if(favorite_mods){
  Object.entries(favorite_mods).forEach(([gameId, lista]) => {
    if(lista!=null){
  console.log("Game:", gameId);
  const GAME_DIV=document.createElement("div");
  GAME_DIV.id="FAV_GAME_DIV";
  GAME_SPAN=document.createElement("span")
  GAME_SPAN.innerText=findGameById(gameId) || "Unknown Game";
  GAME_DIV.append(GAME_SPAN)
  lista.forEach(mod => {
    console.log(mod);
    const modDiv=document.createElement("div");
    const modImg=document.createElement("img");
    modImg.src=mod.thumbnail;
    const modTitle=document.createElement("span");
    modTitle.innerText=mod.modName;
    modDiv.append(modImg);
    modDiv.append(modTitle);
    GAME_DIV.append(modDiv)
  });
  panel.appendChild(GAME_DIV)
  }
});
  }
  document.body.appendChild(panel);

  // Eventos
  panel.addEventListener("mouseenter", () => {
    panel.classList.add("active");
  });

  panel.addEventListener("mouseleave", () => {
    panel.classList.remove("active");
  });
}
    }