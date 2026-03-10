var MESSENGER_HANDLED=false;

const msgwidth = 510;
const msgheight = 800;
var leftPop,topPop;
async function NEW_TAB_MESSENGER_HANDLER(){
    if(MESSENGER_HANDLED==false&&options['NewTab_Messenger']==true){
        MESSENGER_HANDLED=true
const anchor = document.querySelector("div.nav-interact-buttons, button#profile-menu").parentElement.querySelector("a[aria-label='View messages'],a[class='nav-interact rj-messages']");
if(anchor){
    anchor.addEventListener("click",(e)=>{MessengerClick(e)})
}

    }
}


function MessengerClick(itemClick){
    itemClick.preventDefault();
    itemClick.stopPropagation();
    
const rect = itemClick.target.getBoundingClientRect();


// posição absoluta real na tela
 leftPop = window.screenX + rect.left - 350;
 topPop = window.screenY + rect.bottom + 200;

const win = window.open(
  "https://forums.nexusmods.com/messenger/?popup=true",
  "nexusMessenger",
  `width=${msgwidth},height=${msgheight},resizable=yes,scrollbars=yes`
);

if (win) {
  win.moveTo(leftPop, topPop);
  win.resizeTo(msgwidth, msgheight);
}
}