let fix_youtube_debounce = null;
const VIDEO_SELECTOR = "div[data-e2eid='media-tile']";

function Fix_Youtube_Thumbnails() {
  if (fix_youtube_debounce) {
    clearTimeout(fix_youtube_debounce);
  }
  fix_youtube_debounce = setTimeout(() => {
    fix_youtube_debounce = null;
    for (const img of VISIBLE_ELEMENTS) {
      if (!img.isConnected) {
        VISIBLE_ELEMENTS.delete(img);
        continue;
      }
      if (!img.matches || !img.matches(VIDEO_SELECTOR)) {
        continue;
      }
      const video = img.querySelector("a:has(svg[role='presentation'] path[d='M8,5.14V19.14L19,12.14L8,5.14Z'])");
      if (!video) {
        continue;
      }
      if (video.hasAttribute("FULL_IMAGE")) {
        continue;
      }
      img.setAttribute("FULL_IMAGE", true);
      video.setAttribute("FULL_IMAGE", true);
      const videoImg = video.querySelector("img");
      if (videoImg && videoImg.src) {
        const url = new URL(videoImg.src);
        url.pathname = url.pathname.replace(/\/mqdefault\.jpg$/, "") + "/mqdefault.jpg";
        videoImg.src = url.origin + url.pathname + url.search + url.hash;
      }
    }
  }, 100);
}