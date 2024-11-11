const TAB_POSTS_OBSERVER = async () => {
    if (!bodyObserver) {
    bodyObserver = new MutationObserver(async (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const newTargetNode = document.querySelector('div#comment-container');
          if (newTargetNode && newTargetNode !== currentTargetNode) {
            console.log("DOCUMENTO PRONTO","===========================================");
            STICKY_POSTS();
            PROFILE_ONMOUSE();
            CREATE_POSTS_BUTTONS();
            await PAUSE_GIFS();
            currentTargetNode = newTargetNode;
          }
        }
      }
    });
  
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    console.log("Criando Observer");
    currentTargetNode = document.querySelector('div#comment-container');
    }
  };