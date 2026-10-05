const TAB_POSTS_OBSERVER = () => {
    if (!bodyObserver) {
    bodyObserver = new MutationObserver( (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const newTargetNode = document.querySelector('div#comment-container');
          if (newTargetNode && newTargetNode !== currentTargetNode) {
            current_modTab="posts"
            console.log("DOCUMENTO PRONTO","===========================================");
            STICKY_POSTS();
            PROFILE_ONMOUSE();
            CREATE_POSTS_BUTTONS();
            YoutubeEnlarger();
             PAUSE_GIFS();
            currentTargetNode = newTargetNode;
          }
        }
      }
    });
  
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    console.log("Criando Observer");
    currentTargetNode = document.querySelector('div#comment-container');
    }else{
      setTimeout(TAB_POSTS_OBSERVER,100)
    }
  };