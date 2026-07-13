//ESSA FUNÇÃO NÃO ESTÁ PRONTA AINDA, E PROVAVELMENTE SERÁ REMOVIDA EM BREVE.


var Sync_NexusModsCheckBoxes_STARTED=false;
async function Sync_NexusModsCheckBoxes(){
  return;
  if(Sync_NexusModsCheckBoxes_STARTED==false){
    if(current_page=="mod_pages_all"){
      chrome.runtime.sendMessage(
    {
      action: 'NexusMods_SearchOptions'
    },
    async function (response) {
      if (chrome.runtime.lastError) {
        console.error(
          'Error sending message:',
          chrome.runtime.lastError.message
        )
        window.location.reload()
      } else {
        if (response && response.success) {
          
          NexusMods_SearchOptions = response.message
                console.log(NexusMods_SearchOptions);
           document.querySelectorAll("div#filters-panel div span[role='checkbox']").forEach((ev) => {

    const checkboxID = ev.getAttribute("data-e2eid");

    if (checkboxID && NexusMods_SearchOptions.hasOwnProperty(checkboxID)) {

        if(NexusMods_SearchOptions[checkboxID]==true&&ev.getAttribute("aria-checked")!="true"){
          ev.click();
          console.log(ev)
        }
        ev.closest("div[class*='group/checkbox']").addEventListener("click",(item)=>{
        
          
var BOOL_VALUE = item.currentTarget
  .querySelector("span[role='checkbox']")
  .getAttribute("aria-checked");
BOOL_VALUE=!(BOOL_VALUE==="true")
console.log(BOOL_VALUE);

            NexusMods_SearchOptions[checkboxID]=BOOL_VALUE;
            console.log(NexusMods_SearchOptions)
            chrome.runtime.sendMessage(
          {
            action: 'Update_NexusMods_SearchOptions',
            option: NexusMods_SearchOptions
          },
          function (response) {
            if (response && response.success) {
              console.log(response)
            }
          }
        )
        });
    }

});


if(response.message){
Sync_NexusModsCheckBoxes_STARTED=true;
}
          
        } else {
          console.error('Error in response:', response.error)
          window.location.reload()
        }
      }
    }
  )
}
  }
}