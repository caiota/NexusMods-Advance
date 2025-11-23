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
let menuLength = 0;
let indexGo = 0;
let menuItems;
const Clickevents = ['mousedown', 'mouseup', 'click'];
async function MOVE_SHORTCUT(dir) {

    if (!closestMenu||textFieldFocused==true||!CanGoShortcut()) {
        return;
    }
    
    window.stop();
    menuItems = closestMenu.querySelectorAll("li");
    menuLength = menuItems.length;
    menuItems.forEach(function (item, index) {
        if (item.querySelector("a") && item.querySelector("a").classList == "selected") {
            indexGo = index;
        }

    })
    if (dir == "right") {
        if ((indexGo + 1) > menuLength) {
            indexGo = menuLength - 1;
            return;
        }

        DispatchClick("r");
    } else {
        if ((indexGo - 1) < 0) {
            indexGo = 0;
            return;
        }

        DispatchClick("l");
    }

}
function DispatchClick(type) {
    Clickevents.forEach(eventType => {
        const event = new MouseEvent(eventType, {
            bubbles: true,       // Permite propagação na árvore do DOM
            cancelable: true,    // Permite cancelamento
            view: window         // Associa ao contexto da janela
        });
        if (type == "r" && menuItems[indexGo + 1]) {
            menuItems[indexGo + 1].querySelector("a").dispatchEvent(event);
        }
        else if (type == "l" && menuItems[indexGo - 1]) {

            menuItems[indexGo - 1].querySelector("a").dispatchEvent(event);
        }
    });
}
let ShortCut_Availability_Running=false;
async function ShortCut_Availability() {
    if (lastClickedElement != document.activeElement) {
        if (isTextField(document.activeElement) == true) {
            textFieldFocused = true;
        } else {
            textFieldFocused = false;
        }
        lastClickedElement = document.activeElement;
    }
    if(!ShortCut_Availability_Running){
    ShortCut_Availability_Running=true;
    setInterval(ShortCut_Availability,150);    
}

}
let closestMenu = null;
async function FLOATING_MENU_SHORTCUTS() {
    const elements = document.querySelectorAll('ul.modtabs');

    let closestElement = null;
    let closestDistance = Infinity;
    // Itera sobre todos os elementos para verificar a distância deles do topo da janela
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top); // Distância do topo da janela
        if (distance < closestDistance) {
            closestDistance = distance;
            closestElement = el;
        }
    });

    // Atualiza os atributos dos elementos
    elements.forEach(el => {
        if (el === closestElement) {
            closestMenu = el;
            el.setAttribute("SHORTCUT", "true");
        } else {
            el.removeAttribute("SHORTCUT");
        }
    });
}