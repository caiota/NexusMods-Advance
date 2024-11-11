async function FLOATING_COMMENT_OPTIONS() {
    try {
        if (options['Following_EditMenu'] == true) {
            const FLOATING_MENU_ENVS = document.querySelectorAll("div.wysibb-toolbar:not([FLOATING])");
            FLOATING_MENU_ENVS.forEach((FLOATING_MENU) => {
                if (FLOATING_MENU) {
                    const wysibbContainer = FLOATING_MENU.closest("div.wysibb");

                    wysibbContainer.style.position = 'relative';

                    wysibbContainer.addEventListener('click', (ev) => {
                        FLOATING_ITEM = ev.currentTarget.querySelector("div.wysibb-toolbar");
                        if (FLOATING_ITEM && !FLOATING_ITEM.contains(ev.target)) {
                            const wysibbRect = wysibbContainer.getBoundingClientRect();
                            const menuRect = FLOATING_MENU.getBoundingClientRect();

                            let newLeft = ev.clientX - wysibbRect.left + 30;
                            let newTop = ev.clientY - wysibbRect.top + 30;

                            if (newLeft + menuRect.width > wysibbRect.width) {
                                newLeft = wysibbRect.width - menuRect.width - 10;
                            }
                            if (newLeft < 0) {
                                newLeft = 0;
                            }
                            if (newTop + menuRect.height > wysibbRect.height) {
                                newTop = wysibbRect.height - menuRect.height - 120;
                            }
                            if (newTop < 0) {
                                newTop = 0;
                            }
                            FLOATING_ITEM.style.left = newLeft + "px";
                            FLOATING_ITEM.style.top = newTop + "px";
                        }
                    });

                    // Listener para capturar teclas de seta e mover o menu
                    function debounce(func, wait) {
                        let timeout;
                        return function (...args) {
                            const context = this;
                            clearTimeout(timeout);
                            timeout = setTimeout(() => func.apply(context, args), wait);
                        };
                    }
                    wysibbContainer.addEventListener(
                        'keydown',
                        debounce((ev) => {

                            const selection = window.getSelection();
                            if (selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                const rect = range.getBoundingClientRect();
                                const wysibbRect = wysibbContainer.getBoundingClientRect();

                                // Verifica se o bounding rect é válido
                                if (rect.width === 0 && rect.height === 0) {
                                    // Se a linha for vazia ou o cursor não tiver uma posição válida
                                    // Define o fallback para a posição do container ou a posição anterior
                                    return; // Saia sem atualizar o menu flutuante
                                }

                                // Calcula a posição do cursor em relação ao wysibbContainer
                                const cursorX = rect.left - wysibbRect.left;
                                const cursorY = rect.top - wysibbRect.top;

                                // Aqui você pode mover o FLOATING_MENU com base na posição do cursor
                                let newLeft = cursorX + 30;
                                let newTop = cursorY + 30; // Ajuste para evitar sobreposição

                                // Verifica se o FLOATING_MENU está saindo dos limites do wysibbContainer
                                if (newLeft + FLOATING_MENU.offsetWidth > wysibbRect.width) {
                                    newLeft = wysibbRect.width - FLOATING_MENU.offsetWidth - 10;
                                }
                                if (newLeft < 0) {
                                    newLeft = 0;
                                }
                                if (newTop + FLOATING_MENU.offsetHeight > wysibbRect.height) {
                                    newTop = wysibbRect.height - FLOATING_MENU.offsetHeight - 120;
                                }
                                if (newTop < 0) {
                                    newTop = 0;
                                }

                                // Atualiza a posição do FLOATING_MENU
                                FLOATING_MENU.style.left = newLeft + 'px';
                                FLOATING_MENU.style.top = newTop + 'px';
                            }

                        }, 50) // Debounce com 50ms de atraso
                    );

                    // Muda a posição do FLOATING_MENU para 'absolute'
                    FLOATING_MENU.style.position = "absolute";
                    FLOATING_MENU.style.background = "#e9e9d5";
                    FLOATING_MENU.style.top = "60%";
                    FLOATING_MENU.setAttribute("FLOATING", true);
                }
            });
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}