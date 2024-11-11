async function CHECK_YOUTUBEIFRAMES() {
    if (options['BlockYoutube'] === true) {
        await YOUTUBE_IFRAME_LOADER();

        // Selecione todos os iframes na página
        const frames = document.querySelectorAll('iframe');
        // Filtra os iframes que contêm 'youtube.com' na URL e têm o parâmetro unlock=1
        const youtubeIframes = Array.from(frames).filter(frame => {
            const url = new URL(frame.src, window.location.href); // Cria um objeto URL com a URL do iframe
            return url.hostname.includes('youtube.com') && url.searchParams.has('unlock');

        });
        if (youtubeIframes.length > 0) {
            chrome.runtime.sendMessage({ action: 'UnlockYoutube' }, response => {
                if (response && response.success) {
                    console.log(response.message);
                    YOUTUBE_STATUS = response.YOUTUBE_STATUS;

                    youtubeIframes.forEach(videoItem => {
                        if (videoItem && videoItem.src) {
                            const url_video = new URL(videoItem.src, window.location.href);
                            url_video.searchParams.delete('unlock');
                            videoItem.src = url_video.toString(); // Atualiza a URL do iframe
                        }
                    });
                }
            });
        }
    }
}

async function YOUTUBE_IFRAME_LOADER() {
    if (options['BlockYoutube'] === true) {
        const isVisible = (elem) => {
            const rect = elem.getBoundingClientRect();
            const buffer = 80; // Margem adicional para considerar como "quase visível"

            return (
                rect.top + rect.height > -buffer &&
                rect.bottom - rect.height < window.innerHeight + buffer &&
                rect.left + rect.width > -buffer &&
                rect.right - rect.width < window.innerWidth + buffer
            );
        };

        const iframes = Array.from(document.querySelectorAll('iframe:not([LOADED])'));

        for (const iframeContainer of iframes) {
            if (iframeContainer.src.includes('youtube.com')) {
                const frameParent = iframeContainer.closest("div");

                if (frameParent && isVisible(frameParent)) {
                    try {
                        const url = new URL(iframeContainer.src);
                        url.searchParams.set('unlock', '1');
                        const response = await new Promise((resolve, reject) => {
                            chrome.runtime.sendMessage({ action: 'UnlockYoutube' }, (response) => {
                                if (chrome.runtime.lastError) {
                                    reject(new Error(chrome.runtime.lastError));
                                } else {
                                    resolve(response);
                                }
                            });
                        });

                        if (response && response.success) {
                            console.log(response.message);
                            YOUTUBE_STATUS = response.YOUTUBE_STATUS;
                            iframeContainer.src = "";
                            iframeContainer.src = url.toString();
                            iframeContainer.setAttribute("LOADED", true);
                            frameParent.setAttribute("LOADED", true);
                        }
                    } catch (error) {
                        console.error('Erro ao processar o iframe:', error);
                    }
                }
            }
        }
    }
}
