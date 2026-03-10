async function BetterSearch() {
  return;
    if (options['BetterSearch'] && SITE_URL.indexOf("next.nexusmods.com/") == -1) {
      if (!document.querySelector("div#BetterSearch") && !searchDiv) {
        searchDiv = document.createElement("div");
        searchDiv.id = 'BetterSearchDIV';
  
        let searchType = document.createElement("select");
        let searchTranslations = document.createElement("select");
        let searchEndorsements = document.createElement("select");
        let searchDownloads = document.createElement("select");
        let searchSize = document.createElement("select");
  
        let type = [
          { value: '0', text: translate_strings.BetterSearch_SearchType.message },
          { value: '1', text: translate_strings.BetterSearch_SearchType.description }
        ];
  
        for (let i = 0; i < type.length; i++) {
          let lang = type[i];
          let option = document.createElement("option");
          option.value = lang.value;
          option.textContent = lang.text;
          if (lang.value == '0' || lang.value == 0) {
            option.selected = true;
          }
          searchType.appendChild(option);
        }
  
        let languages = [
          { value: '0', text: translate_strings.BetterSearch_SearchLanguage.message },
          { value: '5', text: "English" },
          { value: '10', text: "French" },
          { value: '15', text: "German" },
          { value: '20', text: "Spanish" },
          { value: '25', text: "Português - Brasil" },
          { value: '30', text: "Italian" },
          { value: '35', text: "Japanese" },
          { value: '40', text: "Turkish" },
          { value: '45', text: "Polish" },
          { value: '50', text: "Mandarim" },
          { value: '55', text: "Russian" },
          { value: '60', text: "Dutch" },
          { value: '65', text: "Czech" },
          { value: '70', text: "Korean" },
          { value: '73', text: "Hungarian" },
          { value: '78', text: "Ukrainian" },
          { value: '-1', text: "Other" }
        ];
  
        for (let i = 0; i < languages.length; i++) {
          let lang = languages[i];
          let option = document.createElement("option");
          option.value = lang.value;
          option.textContent = lang.text;
          searchTranslations.appendChild(option);
        }
  
        let endorsements = [
          { value: '0', text: translate_strings.BetterSearch_SearchEndorsements.message },
          { value: '100;1000', text: translate_strings.BetterSearch_EndorsementsSub_Low.message },
          { value: '1000;5000', text: translate_strings.BetterSearch_EndorsementsSub_Medium.message },
          { value: '5001;10000', text: translate_strings.BetterSearch_EndorsementsSub_High.message },
          { value: '7001;900000000', text: translate_strings.BetterSearch_EndorsementsSub_VeryHigh.message }
        ];
  
        for (let i = 0; i < endorsements.length; i++) {
          let lang = endorsements[i];
          let option = document.createElement("option");
          option.value = lang.value;
          option.textContent = lang.text;
          searchEndorsements.appendChild(option);
        }
  
        let downloads = [
          { value: '0', text: translate_strings.BetterSearch_SearchDownloads.message },
          { value: '100;1000', text: translate_strings.BetterSearch_DownloadsSub_Low.message },
          { value: '1000;5000', text: translate_strings.BetterSearch_DownloadsSub_Medium.message },
          { value: '5001;10000', text: translate_strings.BetterSearch_DownloadsSub_High.message },
          { value: '7001;900000000', text: translate_strings.BetterSearch_DownloadsSub_VeryHigh.message }
        ];
  
        for (let i = 0; i < downloads.length; i++) {
          let lang = downloads[i];
          let option = document.createElement("option");
          option.value = lang.value;
          option.textContent = lang.text;
          searchDownloads.appendChild(option);
        }
  
        let fileSize = [
          { value: '0', text: translate_strings.BetterSearch_SearchSize.message },
          { value: '0;1000', text: "0MB - 1GB" },
          { value: '1000;5000', text: "1GB - 5GB" },
          { value: '5001;10000', text: "5GB - 10GB" },
          { value: '10001;100000', text: "10GB+" }
        ];
  
        for (let i = 0; i < fileSize.length; i++) {
          let lang = fileSize[i];
          let option = document.createElement("option");
          option.value = lang.value;
          option.textContent = lang.text;
          searchSize.appendChild(option);
        }
  
        searchDiv.appendChild(searchType);
        searchDiv.appendChild(searchTranslations);
        searchDiv.appendChild(searchEndorsements);
        searchDiv.appendChild(searchDownloads);
        searchDiv.appendChild(searchSize);
        searchDiv.setAttribute('data-category-value', 'mods');
  
        if (SITE_URL.indexOf("next.nexusmods.com/") == -1&&document.querySelector("input#gsearch")) {
          document.querySelector("input#gsearch").addEventListener("click", function () {
            searchDiv.style.display = 'block';
            document.querySelector("button.rj-search-category-dropdown-toggle").click();
          });
          var dropdown = document.querySelector("ul.rj-search-category-dropdown ");
        } else {
          var dropdown = document.querySelector("input[role='searchbox']").closest("form");
        }
        dropdown.prepend(searchDiv);
  
        dropdown.addEventListener("mouseover", function (ev) {
          const item = ev.target;
          const relatedElement = ev.relatedTarget;
          if ((item.getAttribute('data-category-value') == null || item.getAttribute('data-category-value') !== 'mods') && !searchDiv.contains(relatedElement)) {
            searchDiv.style.display = 'none';
          } else {
            searchDiv.style.display = 'block';
          }
        });
  
        searchTranslations.addEventListener("change", function () {
          DefineSearch('translation', searchTranslations.value);
        });
        searchEndorsements.addEventListener("change", function () {
          DefineSearch('endorsements', searchEndorsements.value);
        });
        searchDownloads.addEventListener("change", function () {
          DefineSearch('downloads', searchDownloads.value);
        });
        searchSize.addEventListener("change", function () {
          DefineSearch('size', searchSize.value);
        });
        searchType.addEventListener("change", function () {
          DefineSearch('onlyTranslation', searchType.value);
        });
  
        const ActUrl = new URL(SITE_URL);
        const translations_only = ActUrl.searchParams.get("translations_only");
        const range_dlds = ActUrl.searchParams.get("range_downloads");
        const language = ActUrl.searchParams.get("language");
        const range_endorsements = ActUrl.searchParams.get("range_endorsements");
        const range_size = ActUrl.searchParams.get("range_size");
  
        if (translations_only) {
          searchType.value = translations_only;
        }
        if (range_dlds) {
          searchDownloads.value = range_dlds;
        }
        if (language) {
          searchTranslations.value = language;
        }
        if (range_endorsements) {
          searchEndorsements.value = range_endorsements;
        }
        if (range_size) {
          searchSize.value = range_size;
        }
  
        DefineSearch('size', searchSize.value);
        DefineSearch('downloads', searchDownloads.value);
        DefineSearch('endorsements', searchEndorsements.value);
        DefineSearch('translation', searchTranslations.value);
        DefineSearch('onlyTranslation', searchType.value);
      }
  
      if (SITE_URL.indexOf("/search/") != -1 && document.querySelector("input#search_filename")) {
        document.querySelector("input.rj-search-input").value = document.querySelector("input#search_filename").value;
      }
    }
  }
  
  function DefineSearch(item, value) {
    const form = document.querySelector("form.rj-search");
    const url = new URL(form.action);
  
    switch (item) {
      case 'onlyTranslation':
        if (value != 0) {
          url.searchParams.set('translations_only', '1');
        } else {
          url.searchParams.delete('translations_only');
        }
        break;
  
      case 'translation':
        if (value != 0) {
          url.searchParams.set('language', value);
        } else {
          url.searchParams.delete('language');
        }
        break;
      case 'endorsements':
        if (value != 0) {
          url.searchParams.set('range_endorsements', value);
        } else {
          url.searchParams.delete('range_endorsements');
        }
        break;
      case 'downloads':
        if (value != 0) {
          url.searchParams.set('range_downloads', value);
        } else {
          url.searchParams.delete('range_downloads');
        }
        break;
      case 'size':
        if (value != 0) {
          url.searchParams.set('range_size', value);
        } else {
          url.searchParams.delete('range_size');
        }
        break;
    }
  
    form.action = url.toString();
  }
  