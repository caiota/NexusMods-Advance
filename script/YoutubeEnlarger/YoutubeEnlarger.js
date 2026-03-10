async function YoutubeEnlarger() {
    if (options['largerYoutubeVideos'] == true) {
        const videos = document.querySelectorAll("div.youtube_container iframe:not([Enlarged])");
        for (let i = 0; i < videos.length; i++) {
            let video = videos[i];
            video.setAttribute("allowfullscreen", true);
            video.setAttribute("loading", 'lazy');
            let container = video.closest("div.youtube_container");
            if (container) {
                container.classList.add("enlarged-youtube-video");
                video.classList.add("enlarged-youtube-video");
            }
            video.src = video.src + "?autoplay=0";
            video.setAttribute("Enlarged", true);
        }
    }
}