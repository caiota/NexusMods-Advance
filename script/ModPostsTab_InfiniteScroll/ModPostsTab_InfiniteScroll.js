var ATUAL_PAGE=1;
async function ModPostsTab_InfiniteScroll(){
   if(current_page=="only_mod_page"&&current_modTab == "posts"&&canScroll==false){
if(ATUAL_PAGE==1){
await GET_PAGE();
}

var search_text=document.querySelector("input#comment_search")?.value || '';
var thread_id= document.querySelector("ul.modtabs li#mod-page-tab-posts a.selected").getAttribute("data-target");

const params = new URLSearchParams(thread_id.split("?")[1]);
const threadId = params.get("thread_id");

await LOAD_NEXT_POSTS_PAGE(search_text,threadId);
   }
}

async function LOAD_NEXT_POSTS_PAGE(searchText, thread_id) {
  ATUAL_PAGE++;
  if(ATUAL_PAGE==1){
    return;
  }
console.log("InfiniteScroll_PostsComments Page: "+ATUAL_PAGE);
  fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/CommentContainer?RH_CommentContainer=search_text:"+searchText+",game_id:"+gameID_Number+",object_id:"+pageID+",object_type:1,thread_id:"+thread_id+",tabbed:1,skip_opening_post:0,display_title:0,user_is_blocked:false,searchable:true,page_size:10,page:"+ATUAL_PAGE, {
    headers: {
      "accept": "*/*",
      "accept-language": "pt-BR,pt;q=0.6",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Brave\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest"
    },
    referrer: window.location.href,
    method: "GET",
    mode: "cors",
    credentials: "include"
  })
  .then(res => res.text())
  .then(html => {

    // Cria um DOM separado pra manipular
    const temp = document.createElement("div");
    temp.innerHTML = html;

    temp.querySelectorAll("h2#comment-count").forEach(el => el.remove());
    temp.querySelectorAll("div.pagination").forEach(el => el.remove());
    temp.querySelector("div.comment-nav")?.remove();
    temp.querySelectorAll("li.comment-sticky").forEach(el => el.remove());


    if(Array.from(temp.querySelectorAll("li.comment")).length>0){
   temp.innerHTML=temp.querySelector("div#comment-container").innerHTML;
    canScroll = true;
console.warn("HTML INJETADO, da página "+ATUAL_PAGE)
    // Insere só o conteúdo limpo
    document.querySelector("div.tabcontent div#comment-container").innerHTML += temp.innerHTML;
    requestAnimationFrame(()=>{
            STICKY_POSTS();
            PAUSE_GIFS();
            DESCRIPTION_ONMOUSE();
            PROFILE_ONMOUSE();
            CREATE_POSTS_BUTTONS();
           EXTERNAL_LINKS_NEWTAB()
            CHECK_YOUTUBEIFRAMES();
            YoutubeEnlarger();
            PROFILE_ONMOUSE()
    ARTICLES_ONMOUSE();
    PAUSE_GIFS();
    TRANSFORM_TEXT_LINKS();
    });
    }else{
      console.warn("FIM")
    }
  })
  .catch(err => console.error("Deu ruim no fetch:", err));
}

async function GET_PAGE(){
if(!document.querySelector("div.pagination ul li a.page-selected")){
   ATUAL_PAGE=1;
   return;
}else{

const PAGES=document.querySelector("div.pagination ul li a.page-selected");
ATUAL_PAGE=PAGES.innerText;
console.warn("PÁGINA "+ATUAL_PAGE)
}
}