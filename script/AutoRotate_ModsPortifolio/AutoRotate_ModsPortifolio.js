var isRotating = false;

 function AutoRotate_ModsPortifolio() {
  if (options['AutoRotate_ModPictures'] === true && current_page === "only_mod_page" && !isRotating) {
    const UL_GALLERY = document.querySelector("ul.thumbgallery");
    if (UL_GALLERY&&UL_GALLERY.querySelectorAll("li.thumb").length>6) {
      document.querySelector("div#sidebargallery div.btnprev")?.addEventListener("mouseover",()=>{CAN_ROTATE=false;});
      document.querySelector("div#sidebargallery div.btnprev")?.addEventListener("mouseout",()=>{CAN_ROTATE=true;});
      document.querySelector("div#sidebargallery div.btnnext")?.addEventListener("mouseover",()=>{CAN_ROTATE=false;});
      document.querySelector("div#sidebargallery div.btnnext")?.addEventListener("mouseout",()=>{CAN_ROTATE=true;});

      UL_GALLERY.addEventListener("mouseover",()=>{CAN_ROTATE=false});
      UL_GALLERY.addEventListener("mouseout",()=>{CAN_ROTATE=true});
      setInterval(scrollGalleryStep, interval);
      isRotating = true;
    }
  }
}
var CAN_ROTATE=true;
let currentX = 0;
let step = -3;  // pixels por frame
const interval = 40;

function scrollGalleryStep() {
  const UL_GALLERY = document.querySelector("ul.thumbgallery");
  if (!UL_GALLERY) return;

  const rect = UL_GALLERY.getBoundingClientRect();

  // Inverte a direção quando estiver "quase saindo" da tela
  if (rect.right < 1000) {
    step = Math.abs(step); // torna positivo → vai pra direita
  } else if (rect.left > 0) { 
    step = -Math.abs(step); // volta pra esquerda
  }

  // aplica a transformação
  if(CAN_ROTATE==true){
  UL_GALLERY.style.transform = `translate3d(${currentX}px, 0px, 0px)`;

  // atualiza a posição
  currentX += step;
  }
}