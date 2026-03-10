var isRotating = false;

async function AutoRotate_ModsPortifolio() {
  if (options['AutoRotate_ModPictures'] === true && current_page === "only_mod_page" && !isRotating) {
    const UL_GALLERY = document.querySelector("ul.thumbgallery");

    if (UL_GALLERY&&UL_GALLERY.querySelectorAll("li.thumb").length>8) {
      setInterval(scrollGalleryStep, interval);
      isRotating = true;
    }
  }
}

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
  UL_GALLERY.style.transform = `translate3d(${currentX}px, 0px, 0px)`;

  // atualiza a posição
  currentX += step;
}