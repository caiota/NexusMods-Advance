let NMA_BETTERSEARCH_DEBOUNCE = null;
let container;
var firstLoad=true;
function BetterSearch() {
  try {
    if (options['ShowModSearch_Bar'] == true) { 
      const path = window.location.pathname;
      const isGameModsPage = path.startsWith("/games/") && path.endsWith("/mods");
      const isAllModsPage = path === "/mods";
      if (current_page !== "mod_pages_all" || (!isGameModsPage && !isAllModsPage)) {
        return;
      }
      if (!document.querySelector("div#nma-better-search")) {
        container = FindBetterSearchContainer();
        if (!container) {
          return;
        }
        CreateBetterChocolateBar();
      }
    }
  } catch (error) {
    console.error("NMA BetterSearch: erro em BetterSearch:", error);
  }
}

function BetterSearchExecute() {
  try {
    const searchBar = document.querySelector("div#nma-better-search input");
    if (!searchBar) {
      return;
    }
    const searchValue = searchBar.value || "";
    const searchOrigin = document.querySelector("label[for='title-search-parameters']")?.parentElement?.querySelector("input#title-search-parameters");
    const form = document.querySelector("div[data-e2eid='search-parameters-filter'] form");
    if (!searchOrigin || !form) {
      return;
    }
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(searchOrigin, searchValue);
    searchOrigin.dispatchEvent(new Event("input", {
      bubbles: true
    }));
    searchOrigin.dispatchEvent(new Event("change", {
      bubbles: true
    }));
    form.requestSubmit();
    window.scrollTo(0, 160);
  } catch (error) {
    console.error("NMA BetterSearch: erro em BetterSearchExecute:", error);
  }
}

function CreateBetterChocolateBar() {
  try {
    const searchBar = document.createElement("div");
    searchBar.id = "nma-better-search";
    searchBar.innerHTML = `
        <div class="nma-better-search-input">
            <input
                type="text"
                placeholder=""
                autocomplete="off"
            >
        </div>
    `;
    searchBar.querySelector("input").placeholder = translate_strings.searchRequerimentsTab.message;
    
      searchBar.focus();
    container.parentElement.insertBefore(searchBar, container.nextElementSibling);
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");
     setTimeout(()=>{
        searchBar.addEventListener("input", (key) => {
      clearTimeout(NMA_BETTERSEARCH_DEBOUNCE);
      NMA_BETTERSEARCH_DEBOUNCE = setTimeout(() => {
        BetterSearchExecute();
      }, 700);
    })
},2000);
    if (title) {
      searchBar.querySelector("input").value = title;
    }
   
    const header = document.querySelector("header");
    if (header) {
      const headerHeight = header.getBoundingClientRect().height;
      searchBar.style.top = `${headerHeight - 5}px`;
      const sentinel = document.createElement("div");
      sentinel.style.height = "1px";
      sentinel.style.width = "100%";
      sentinel.style.pointerEvents = "none";
      searchBar.before(sentinel);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            searchBar.classList.add("nma-better-search-sticky");
          } else {
            searchBar.classList.remove("nma-better-search-sticky");
          }
        }, {
          threshold: 0,
          rootMargin: `-${headerHeight + 2}px 0px 0px 0px`
        });
      observer.observe(sentinel);
    }
  } catch (error) {
    console.error("NMA BetterSearch: erro ao criar barra:", error);
  }
}

function FindBetterSearchContainer() {
  try {
    const headers = document.querySelectorAll("h3");
    for (const h3 of headers) {
      const subtitle = h3.textContent.trim();
      if (subtitle !== "Browse the internet's best mods" && subtitle !== "The best screen archery on the internet") {
        continue;
      }
      let parent = h3.parentElement;
      while (parent) {
        const h1 = parent.querySelector(":scope > h1");
        if (h1) {
          const span = h1.querySelector(":scope > span");
          if (!span) {
            parent = parent.parentElement;
            continue;
          }
          const title = span.textContent.trim();
          if (title.endsWith(" mods") || title.endsWith(" images")) {
            console.log("NMA BetterSearch encontrou:", parent);
            console.log("Título:", title);
            let container = parent;
            while (container && container !== document.body) {
              if (container.tagName === "DIV" && container.previousElementSibling?.tagName === "NAV") {
                console.log("NMA BetterSearch container encontrado:", container.parentElement);
                return container.parentElement;
              }
              container = container.parentElement;
            }
            return parent;
          }
        }
        parent = parent.parentElement;
      }
    }
    return null;
  } catch (error) {
    console.error("NMA BetterSearch: erro ao encontrar container:", error);
    return null;
  }
}