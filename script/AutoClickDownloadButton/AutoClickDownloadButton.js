let DOWNLOAD_STARTED=false;
var MAX_TRY=20;
var dldLOOP=null;
async function FAST_DOWNLOAD() {
    try{ 
    if(!DOWNLOAD_STARTED){
        DOWNLOAD_STARTED=true;
        const modFile = document.querySelector("mod-file-download");

const root = modFile?.shadowRoot;
const botoes = root?.querySelectorAll("button") || [];

const slowBtn = Array.from(botoes).find(btn =>
  btn.textContent.trim().toLowerCase().includes("slow download")
);


    const downloadConditionsMet = (
        (SITE_URL.includes("&nmm=1") || SITE_URL.includes("tab=files&file_id=")) &&
        (slowBtn) &&
        options['FastDownloadModManager'] === true
    );

    if (!downloadConditionsMet) return;
            if(!dldLOOP)
            slowBtn.click();
            dldLOOP=setInterval(()=>{
                if(MAX_TRY>0){
  MAX_TRY--;
               DLD_LINK=Array.from(document.querySelectorAll("a")).find(btn =>
  btn.textContent.trim().toLowerCase().includes("click here"));
if(DLD_LINK&&DLD_LINK.href&&!DLD_LINK.getAttribute("DOWNLOAD_OK")){
                clearInterval(dldLOOP);
                MAX_TRY=20;
                DLD_LINK.setAttribute("DOWNLOAD_OK",true);
              window.stop()
    window.open(DLD_LINK.href);
              setTimeout(handleFallbackDownload, 100);
}
               }else{
                clearInterval(dldLOOP);
                MAX_TRY=20;
               }

            },200)
}
    }catch(e){
        DOWNLOAD_STARTED=false;
        console.error("NexusMods Advance Error: "+e);
    }
}


function handleFallbackDownload() {
        setTimeout(() => {
            try {
             window.history.go(-1);
            } catch (error) {
                DOWNLOAD_STARTED=false;
                console.warn("Failed to close the window: ", error);
            }
        }, 300);
}
