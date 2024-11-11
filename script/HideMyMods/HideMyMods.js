async function HideMyMods() {
    if (options['HideHiddenMods'] == true && (SITE_URL.indexOf('/users/myaccount?tab=my+files') != -1 || SITE_URL.indexOf('/users/myaccount?tab=files') != -1 || SITE_URL.indexOf('/users/myaccount?tab=other+files') != -1)) {
        const files = document.querySelectorAll("li.mod-tile");
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let mod = files[i];
                let hiddenInput = mod.querySelector("input[id^='file-manage-hidden-']");
                if (hiddenInput && hiddenInput.checked == true) {
                    mod.classList.add("hidderable_mod");
                    mod.classList.toggle("hiddenModTile");
                }
            }

            if (!document.querySelector("a#showHideButton")) {
                const li = document.createElement("li");
                li.classList = "";
                div = document.createElement('div');
                div.innerText = "Search";
                div.classList = "navlabel"
                const searchBar = document.createElement("input");
                searchBar.id = "myMods_Search";
                li.appendChild(div)
                li.appendChild(searchBar);
                let searchTimeout;
                searchBar.addEventListener('input', (ev) => {
                    const searchString = ev.currentTarget.value.toLowerCase();
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        const files = document.querySelectorAll("li.mod-tile");
                        if (files.length > 0 && searchString.trim() != "") {
                            for (let i = 0; i < files.length; i++) {
                                let mod = files[i];
                                if (mod.querySelector("div.file-manage-title h3 a").innerText.toLowerCase().indexOf(searchString) != -1) {
                                    mod.classList.remove("HiddeModResult");
                                } else {

                                    mod.classList.add("HiddeModResult");
                                }
                            }
                        }
                        else if (searchString.trim() == "") {
                            for (let i = 0; i < files.length; i++) {
                                let mod = files[i];
                                if (mod.querySelector("div.file-manage-title h3 a").innerText.toLowerCase().indexOf(searchString) != -1) {
                                    mod.classList.remove("HiddeModResult");
                                }
                            }
                        }
                    }, 150);

                })
                //#########3
                let showButton = document.createElement("a");
                showButton.id = 'showHideButton';
                showButton.style.display = 'inline-flex';
                showButton.classList = "btn inline-flex";
                showButton.innerText = translate_strings.HideMods_button.message;
                showButton.style.backgroundColor = 'steelblue';
                let hideStatus = false;
                showButton.addEventListener('click', function (ezClap) {

                    const hiddenTiles = Array.from(document.querySelectorAll("li.hidderable_mod"));
                    for (let i = 0; i < hiddenTiles.length; i++) {
                        let modHide = hiddenTiles[i];
                        modHide.classList.toggle("hiddenModTile");
                    }

                    if (hideStatus == false) {
                        showButton.innerText = translate_strings.HideMods_button.description;
                        hideStatus = true;
                    } else {
                        showButton.innerText = translate_strings.HideMods_button.message;
                        hideStatus = false;
                    }
                });

                document.querySelector("div.account-add-new").prepend(showButton);
                document.querySelector("ul.sorting").prepend(li);
                searchBar.click();
                searchBar.focus();
            }
        }
    }
}
