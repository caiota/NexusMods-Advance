var MOD_VERSION = '0.25';

async function updateContent(messages) {
	const elementsToUpdate = [
		{ selector: "#nexusTitle", text: messages.extensionName.message },
		{ selector: "#extVersion", text: MOD_VERSION },
		{ selector: "div#tabItens div.settings", text: messages.siteSettings_Settings.message },
		{ selector: "div#tabItens div.mods", text: messages.siteSettings_Mods.message },
		{ selector: "fieldset legend.fastButtons", text: messages.fastButtons_title.message },
		{ selector: "fieldset legend.hideContent", text: messages.hideContent_title.message },
		{ selector: "fieldset legend.changeContent", text: messages.changeContent_title.message },
		{ selector: "fieldset legend.hiddenMods_field", text: messages.hiddenMods_field.message },
		{ selector: "fieldset.hiddenMods[hasPopupTip] div#msgPopup", html: messages.hiddenMods_field.description },
		{ selector: "label[for='FastViewButton'] span", text: messages.button_showGallery.message },
		{ selector: "label[for='FastViewButton'] div#msgPopup", html: messages.button_showGallery.description },
		{ selector: "label[for='FastDownloadButton'] span", text: messages.button_showFiles.message },
		{ selector: "label[for='FastDownloadButton'] div#msgPopup", html: messages.button_showFiles.description },
		{ selector: "label[for='FastDescriptionButton'] span", text: messages.button_showDescription.message },
		{ selector: "label[for='FastDescriptionButton'] div#msgPopup", html: messages.button_showDescription.description },
		{ selector: "label[for='FastIgnoreButton'] span", text: messages.button_ignoreMod.message },
		{ selector: "label[for='FastIgnoreButton'] div#msgPopup", html: messages.button_ignoreMod.description },
		{ selector: "label[for='JustBlur_IgnoredMods'] span", text: messages.button_ignoreMod_BLUR.message },
		{ selector: "label[for='JustBlur_IgnoredMods'] div#msgPopup", html: messages.button_ignoreMod_BLUR.description },
		{ selector: "label[for='InfiniteScroll'] span", text: messages.button_infiniteScroll.message },
		{ selector: "label[for='InfiniteScroll'] div#msgPopup", html: messages.button_infiniteScroll.description },
		{ selector: "label[for='AutoTrackDownloaded'] span", text: messages.button_AutoTrackDownloaded.message },
		{ selector: "label[for='AutoTrackDownloaded'] div#msgPopup", html: messages.button_AutoTrackDownloaded.description },
		{ selector: "label[for='FastDownloadTranslates'] span", text: messages.button_fastDownloadTranslate.message },
		{ selector: "label[for='FastDownloadTranslates'] div#msgPopup", text: messages.button_fastDownloadTranslate.description },
		{ selector: "label[for='AwaysChangelogs'] span", text: messages.alwaysLoad_Changelogs.message },
		{ selector: "label[for='AwaysChangelogs'] div#msgPopup", text: messages.alwaysLoad_Changelogs.description },
		{ selector: "label[for='FastDownloadModManager'] span", text: messages.autoClick_SlowDownload.message },
		{ selector: "label[for='FastDownloadModManager'] div#msgPopup", text: messages.autoClick_SlowDownload.description },
		{ selector: "label[for='DescriptionOnMouse'] span", text: messages.mousePopup.message },
		{ selector: "label[for='DescriptionOnMouse'] div#msgPopup", text: messages.mousePopup.description },
		{ selector: "label[for='ArticlesOnMouse'] span", text: messages.ArticlesPopup.message },
		{ selector: "label[for='ArticlesOnMouse'] div#msgPopup", text: messages.ArticlesPopup.description },
		{ selector: "label[for='ProfileOnMouse'] span", text: messages.mouseProfilePopup.message },
		{ selector: "label[for='ProfileOnMouse'] div#msgPopup", text: messages.mouseProfilePopup.description },
		{ selector: "label[for='largerYoutubeVideos'] span", text: messages.LargerYoutube.message },
		{ selector: "label[for='largerYoutubeVideos'] div#msgPopup", text: messages.LargerYoutube.description },
		{ selector: "label[for='showImagesPopup'] span", text: messages.PopupImages.message },
		{ selector: "label[for='showImagesPopup'] div#msgPopup", text: messages.PopupImages.description },
		{ selector: "label[for='showVideosPopup'] span", text: messages.PopupVideos.message },
		{ selector: "label[for='showVideosPopup'] div#msgPopup", text: messages.PopupVideos.description },
		{ selector: "label[for='NotifyUpdates'] span", text: messages.modSettings_notifications.message },
		{ selector: "label[for='NotifyUpdates'] div#msgPopup", text: messages.modSettings_notifications.description },
		{ selector: "label[for='SimpleMode'] span", text: messages.modSettings_simpleMode.message },
		{ selector: "label[for='SimpleMode'] div#msgPopup", text: messages.modSettings_simpleMode.description },
		{ selector: "label[for='HideRequerimentsTab'] span", text: messages.remove_RequerimentsTab.message },
		{ selector: "label[for='HideRequerimentsTab'] div#msgPopup", text: messages.remove_RequerimentsTab.description },
		{ selector: "label[for='HideTranslationsTab'] span", text: messages.remove_TranslationsTab.message },
		{ selector: "label[for='HideTranslationsTab'] div#msgPopup", text: messages.remove_TranslationsTab.description },
		{ selector: "label[for='HidePermissionsTab'] span", text: messages.remove_PermissionsTab.message },
		{ selector: "label[for='HidePermissionsTab'] div#msgPopup", text: messages.remove_PermissionsTab.description },
		{ selector: "label[for='HideChangelogsTab'] span", text: messages.remove_ChangelogsTab.message },
		{ selector: "label[for='HideChangelogsTab'] div#msgPopup", text: messages.remove_ChangelogsTab.description },
		{ selector: "label[for='HideDonationsTab'] span", text: messages.remove_DonationsTab.message },
		{ selector: "label[for='HideDonationsTab'] div#msgPopup", text: messages.remove_DonationsTab.description },
		{ selector: "label[for='HideModCollections'] span", text: messages.remove_HideModCollections.message },
		{ selector: "label[for='HideModCollections'] div#msgPopup", text: messages.remove_HideModCollections.description },

		
		{ selector: "label[for='HideStickyPosts'] span", text: messages.hide_StickyPosts.message },
		{ selector: "label[for='HideStickyPosts'] div#msgPopup", text: messages.hide_StickyPosts.description },
		{ selector: "label[for='OriginalImages'] span", text: messages.loadOriginalImages.message },
		{ selector: "label[for='OriginalImages'] div#msgPopup", text: messages.loadOriginalImages.description },
		{ selector: "label[for='BetterModBlocks'] span", text: messages.BetterModBlocks.message },
		{ selector: "label[for='BetterModBlocks'] div#msgPopup", text: messages.BetterModBlocks.description },
		{ selector: "label[for='NotRenderTrackMods_Button'] span", text: messages.NotRenderTrackMods_Button.message },
		{ selector: "label[for='NotRenderTrackMods_Button'] div#msgPopup", text: messages.NotRenderTrackMods_Button.description },
		
		{ selector: "fieldset label[for='hideContentWords'] span", text: messages.HideContent_Enable.message },
		{ selector: "fieldset label[for='hideContentWords'] div#msgPopup", text: messages.HideContent_Enable.description },
		{ selector: "label[for='WideWebsite'] span", text: messages.WideWebsite.message },
		{ selector: "label[for='WideWebsite'] div#msgPopup", text: messages.WideWebsite.description },
		{ selector: "label[for='HideHiddenMods'] span", text: messages.HideHiddenMods.message },
		{ selector: "label[for='HideHiddenMods'] div#msgPopup", text: messages.HideHiddenMods.description },
		{ selector: "label[for='FixedModMenu'] span", text: messages.FixedModMenu.message },
		{ selector: "label[for='FixedModMenu'] div#msgPopup", text: messages.FixedModMenu.description },
		{ selector: "label[for='SharePostsLinks'] span", text: messages.SharePostsLinks.message },
		{ selector: "label[for='SharePostsLinks'] div#msgPopup", html: messages.SharePostsLinks.description },
		{ selector: "label[for='BlockYoutube'] span", text: messages.BlockYoutube.message },
		{ selector: "label[for='BlockYoutube'] div#msgPopup", html: messages.BlockYoutube.description },
		{ selector: "label[for='HideModStatus'] span", text: messages.HideModStatus.message },
		{ selector: "label[for='HideModStatus'] div#msgPopup", html: messages.HideModStatus.description },
		{ selector: "label[for='HideCollections_ModPage'] span", text: messages.HideCollections_ModPage.message },
		{ selector: "label[for='HideCollections_ModPage'] div#msgPopup", html: messages.HideCollections_ModPage.description },
	
		{ selector: "label[for='DetailGameBlocks'] span", text: messages.DetailGameBlocks.message },
		{ selector: "label[for='DetailGameBlocks'] div#msgPopup", html: messages.DetailGameBlocks.description },
		{ selector: "label[for='ModBlock_Render'] span", text: messages.ModBlock_Render.message },
		{ selector: "label[for='ModBlock_Render'] div#msgPopup", html: messages.ModBlock_Render.description },
		{ selector: "label[for='GameBlock_Render'] span", text: messages.GameBlock_Render.message },
		{ selector: "label[for='GameBlock_Render'] div#msgPopup", html: messages.GameBlock_Render.description },
		{ selector: "label[for='BlockSize_input'] span", text: messages.BlockSize_input.message },
		{ selector: "label[for='GameBlockSize_input'] span", text: messages.GameBlockSize_input.message },
		{ selector: "label[for='GameBlockSize_input'] div#msgPopup", html: messages.GameBlockSize_input.description },
		{ selector: "label[for='Following_EditMenu'] span", text: messages.Following_EditMenu.message },
		{ selector: "label[for='Following_EditMenu'] div#msgPopup", html: messages.Following_EditMenu.description },
		{ selector: "label[for='NewTab_ExternalURL'] span", text: messages.NewTab_ExternalURL.message },
		{ selector: "label[for='NewTab_ExternalURL'] div#msgPopup", html: messages.NewTab_ExternalURL.description },

		{ selector: "label[for='ModBlock_ImageFillDivs'] span", text: messages.ModBlock_ImageFillDivs.message },
		{ selector: "label[for='ModBlock_ImageFillDivs'] div#msgPopup", html: messages.ModBlock_ImageFillDivs.description },

		
		{ selector: "label[for='Prevent_TrackOnDownload'] span", text: messages.Prevent_TrackOnDownload.message },
		{ selector: "label[for='Prevent_TrackOnDownload'] div#msgPopup", html: messages.Prevent_TrackOnDownload.description },
		
		{ selector: "label[for='MemoryMode'] span", text: messages.MemoryMode.message },
		{ selector: "label[for='MemoryMode'] div#msgPopup", html: messages.MemoryMode.description },
		{ selector: "label[for='PauseExternalGifs'] span", text: messages.PauseExternalGifs.message },
		{ selector: "label[for='PauseExternalGifs'] div#msgPopup", html: messages.PauseExternalGifs.description },
		{ selector: "label[for='SimpleSiteNotifications'] span", text: messages.SimpleSiteNotifications.message },
		{ selector: "label[for='SimpleSiteNotifications'] div#msgPopup", html: messages.SimpleSiteNotifications.description },
		{ selector: "select option#Default", text: messages.RenderMods_Default.message },
		{ selector: "select option#alfabetico_FileName", text: messages.RenderMods_AlfabeticoFile.message },
		{ selector: "select option#alfabetico_ModName", text: messages.RenderMods_AlfabeticoMod.message },
		{ selector: "select option#alfabetico_category", text: messages.RenderMods_Categoria.message },
		{ selector: "select option#alfabetico_gameName", text: messages.RenderMods_Game.message },
		{ selector: "div.modSettingsBtn", text: messages.modSettings_button.message },
		{ selector: "input#modFilter", attribute: "placeholder", text: translate_strings.filter_placeHolder.message },
		{ selector: "option#light_1", text: translate_strings.themeLight_title.message },
		{ selector: "option#dark_1", text: translate_strings.themeDark_title.message },
		{ selector: "option#mod_organizer", text: translate_strings.themeMO2_title.message },
		{ selector: "h1#notLoggedText", text: translate_strings.NeedApi.message },
		{ selector: "h2#notLoggedDesc", html: translate_strings.NeedApi.description },
		{ selector: "span#translatedBy", text: translate_strings.translateBy.message },
		{ selector: "span#more_OfficialPost", html: translate_strings.more_OfficialPost.message },
		{ selector: "span#more_DonatePls", html: translate_strings.more_DonatePls.message },
		{ selector: "div#viewDescription", html: translate_strings.modViewPopup_changelog.message },
		{ selector: "div#viewPosts", html: translate_strings.modViewPopup_posts.message },
		{ selector: "div#viewBugs", html: translate_strings.modViewPopup_bugs.message },
		{ selector: "div#viewLogs", html: translate_strings.modViewPopup_logs.message },
		{ selector: "div#PleaseEndorse legend", text: translate_strings.EndorseAndVote.message },
		{ selector: "div#PleaseEndorse span#endorseMsg", html: translate_strings.EndorseAndVote.description },
		{ selector: "div#PremiumDownload legend", text: translate_strings.PremiumDownload.message },
		{ selector: "div#PremiumDownload div#DownloadTip", text: translate_strings.PremiumDownload.description },
		{ selector: "div#CDN_speed_PopUp legend", text: translate_strings.CDNTest_legend.message },
		{ selector: "div#CDN_speed_PopUp div#CDN_downloadMsg", html: translate_strings.CDNTest_legend.description },
		{ selector: "div#CDN_speed_PopUp div#Start_Test", text: translate_strings.CDNTest_start.message }
	];

	elementsToUpdate.forEach(item => {
		const el = document.querySelector(item.selector);
		if (el) {
			if (item.attribute) {
				el[item.attribute] = item.text;
			} else if (item.html) {
				el.innerHTML = item.html;
			} else {
				el.innerText = item.text;
			}
		}
	});

	if (document.querySelector("fieldset#modTips")) {
		document.querySelector("legend#nexusTitle").innerText = messages.modTab_title.message;
		document.querySelector("div#modTips").innerHTML = messages.modTab_title.description;
	}

	document.querySelector("div#timeoutPanel div.message span#usageWarning").innerText = translate_strings.MODS_DELAY_MESSAGE.description;
	document.querySelector("div#timeoutPanel div.message span#dailyUsage").innerText = RestanteDiario + translate_strings.MODS_DELAY_USAGE.message;
	document.querySelector("div#timeoutPanel div.message span#hourUsage").innerText = RestanteHorario + translate_strings.MODS_DELAY_USAGE.description;
	document.querySelector("input#modFilter").value = '';
	document.querySelector("h2#notLoggedDesc a").addEventListener("click", connect);
	LoadHiddenWords();
	 LoadMods();
}

async function LoadHiddenWords() {
	
	chrome.runtime.sendMessage({
		action: 'Load_WordList',
	}, function (response) {
		if (chrome.runtime.lastError) {
			console.error("Error sending message:", chrome.runtime.lastError.message);
		} else {
			if (!response.success) {
				console.log("No Banned Words YET!");
				return;
			}
			if (response && response.success) {
				WORD_LIST = response.message.toString().replaceAll("#-#", "\n");
				document.querySelector("textarea#HiddenContentArea").value = WORD_LIST;
			} else {
				console.error("Error in response:", response.error);
			}
		}
	});
}

async function loadMessages(locale) {
	let donateLink = 'https://www.paypal.com/donate/?hosted_button_id=ZCJ7S9ZK42ZS2';

	if (locale === 'portuguese') {
		locale = 'pt_BR';
		donateLink = 'https://livepix.gg/caiota';
	}
	if (locale === 'english') locale = 'en';
	if (locale === 'alemao') locale = 'de';
	if (locale === 'polones') locale = 'pl';

	const response = await fetch(`/_locales/${locale}/messages.json`);
        const messages = await response.json();

        translate_strings = messages;

        updateContent(messages);

			// só adiciona o listener depois de recriar o DOM
			document
				.querySelector("div#moreOptions span#more_DonatePls")
				.addEventListener('click', () => window.open(donateLink));
		
}


async function ReloadOptions(options) {
	Object.keys(options).forEach(function (key) {
		try {
			if (key == "LAST_MOD_UPDATE_CHECK" || key == 'light_1' || key == 'mod_organizer' || key == 'dark_1') {
				return;
			}
			var value = options[key];

			if (key == "language" || key == "themeSelector" || key == "TrackingMods_RenderBy") {
				document.querySelector("select#" + key).value = value;
			}
			else if (key == "BlockSize_input") {

				document.querySelector("input#" + key).value = value;
			}
			else if (key == "GameBlockSize_input") {

				document.querySelector("input#" + key).value = value;
			}
			else {
				if (document.querySelector("input#" + key)) {
					document.querySelector("input#" + key).checked = value;
				}
			}
		} catch (e) {
			console.error("Error " + key + " " + value, e);
			return;
		}
	});
	await loadTheme(options['themeSelector']);
	await loadMessages(options['language']);

	document.querySelector("div#content").style.display = 'block';
}
