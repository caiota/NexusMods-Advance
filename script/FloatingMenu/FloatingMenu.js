async function FloatingMenu() {
    if (options['FixedModMenu'] == true) {
        const modtabs = document.querySelectorAll('ul.modtabs:not([floating])');

        for (let i = 0; i < modtabs.length; i++) {
            const tab = modtabs[i];
            tab.classList.add("floatingMenu");
            tab.style.top = document.querySelector("header#head").offsetHeight - 1 + 'px';

            tab.addEventListener("click", function (ev) {
                const element = ev.currentTarget.parentElement;
                const rect = element.getBoundingClientRect();
                const headerHeight = document.querySelector("header#head").offsetHeight;

                // Verifica se o elemento sumiu acima da viewport
                const isAboveViewport = rect.top < headerHeight;

                // Se o elemento está acima da viewport, rola para o início
                if (isAboveViewport) {
                    element.scrollIntoView({
                        block: "start",
                    });
                    setTimeout(() => {
                        window.scrollBy({
                            top: -100,
                            behavior: "smooth"  // Mantém o movimento suave
                        });
                    }, 150);
                }
            });

            tab.setAttribute("floating", true);
        }
    }
}