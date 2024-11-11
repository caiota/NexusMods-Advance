async function STICKY_POSTS(){
    try {
      if (options['HideStickyPosts'] === true && current_modTab === "posts") {
        const stickys = document.querySelectorAll("li.comment-sticky");

        stickys.forEach(post => {
          const commentContent = post.querySelector("div.comment-content");
          const isVisible = commentContent.style.display === 'block';

          if (isVisible || commentContent.style.display !== 'none') {
            const collapseButton = post.querySelector("a.comment-collapse");
            if (collapseButton) {
              collapseButton.click();
            }
          }
        });
      }
    } catch (e) {
      console.error("Erro ao processar posts fixos:", e);
      console.error("NexusMods Advance Error:" + E);
    }
  }