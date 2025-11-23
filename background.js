"use strict";

var options = {
	"LAST_MOD_UPDATE_CHECK": 0,
	"language": "english",
	"themeSelector": "dark_1",
	"TrackingMods_RenderBy": 'alfabetico_FileName',
	"FastViewButton": true,
	"FastDownloadButton": true,
	"FastDescriptionButton": true,
	"FastDownloadTranslates": true,
	"FastIgnoreButton": true,
	"JustBlur_IgnoredMods":false,
	"AwaysChangelogs": true,
	"OriginalImages": false,
	"FastDownloadModManager": true,
	"DescriptionOnMouse": true,
	"NotifyUpdates": true,
	"InfiniteScroll": true,
	"AutoTrackDownloaded": false,
	"largerYoutubeVideos": true,
	"showImagesPopup": true,
	"showVideosPopup": true,
	"ProfileOnMouse": false,
	"BetterModBlocks": true,
	"NotRenderTrackMods_Button": false,
	"ArticlesOnMouse": true,
	"SimpleMode": false,
	"HideRequerimentsTab": false,
	"HideTranslationsTab": false,
	"HidePermissionsTab": false,
	"HideChangelogsTab": false,
	"HideDonationsTab": false,
	"HideModCollections":false,
	"HideStickyPosts": false,
	"hideContentWords": false,
	"WideWebsite": false,
	"HideHiddenMods": false,
	"FixedModMenu": true,
	"Endorsed": false,
	"SharePostsLinks": true,
	"BlockYoutube": true,
	"HideModStatus": false,
	"HideCollections_ModPage":false,
	"ModBlock_Render": false,
	"BlockSize_input": "20%",
	"MemoryMode": false,
	"PauseExternalGifs": true,
	"Following_EditMenu": true,
	"NewTab_ExternalURL": true,
	"Prevent_TrackOnDownload":false,
	"ModBlock_ImageFillDivs":true
};
var hiddenContent = "";
var hiddenMods = {};
var NEXUS_API = 0;
var mods = {};
var MOD_CACHE = {};
var mods_data = {};
var YOUTUBE_STATUS = 'lock';

  

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	(async () => {
		try {
			const { action, item, lang, modsData, modId, mod_id, fileId, game, mod_name, gameId } = message;

			switch (action) {
				case "SaveBox":
					await handleSaveBox(item, message.checado, sendResponse);
					break;

				case "Load_Messages":
					await handleLoadMessages(lang, sendResponse);
					break;

				case "SaveMods_Cache":
					await handleSaveModsCache(modsData, sendResponse);
					break;

				case "SaveMods_Thumbnails":
					await handleSaveModsThumbnails(modId, fileId, message.item, sendResponse);
					break;

				case "LoadMods_Thumbnails":
					await handleLoadModsThumbnails(sendResponse);
					break;

				case "LoadBox":
					await handleLoadBox(sendResponse);
					break;

				case "Load_NEXUSAPI":
					await handleLoadNexusAPI(sendResponse);
					break;

				case "Load_WordList":
					await loadHiddenContent(sendResponse);
					break;

				case "Save_WordList":
					await saveHiddenContent(message.itens, sendResponse);
					break;

				case "Save_HiddenMod":
					await handleSaveHiddenMod(game, mod_id, mod_name, gameId, sendResponse);
					break;

				case "Load_HiddenMods":
					await handleLoadHiddenMods(sendResponse);
					break;

				case "Remove_HiddenMod":
					await delete_HiddenMod(game, message.mod, sendResponse);
					break;

				case "PopupConfig":
					await handlePopupConfig(message.type, sendResponse);
					break;

				case "TrackMod":
					await handleTrackMod(message, sendResponse);
					break;

				case "LoadMods":
					await loadMods();
					sendResponse({ success: true, data: mods });
					break;

				case "DeleteMod":
					await LOAD_MODDATA();
					await deleteMod(message.mod_name, message.modId, sendResponse);
					break;
				case 'UnlockYoutube':
					await SETUP_YOUTUBE_DEFER("unlock");
					YOUTUBE_STATUS = 'unlock';
					await chrome.storage.local.set({ "YOUTUBE_STATUS": YOUTUBE_STATUS })
					sendResponse({ success: true, message: "Youtube Desbloqueado", YOUTUBE_STATUS: 'unlock' });
					break;
				case 'lockYoutube':
					await SETUP_YOUTUBE_DEFER("block");
					YOUTUBE_STATUS = 'lock';
					await chrome.storage.local.set({ "YOUTUBE_STATUS": YOUTUBE_STATUS })
					sendResponse({ success: true, message: "Youtube Bloqueado", YOUTUBE_STATUS: 'lock' });
					break;
				case 'ShowEndorsePopup':

					sendResponse({ success: true, message: canShowEndorse });
					break;
				case 'Block_InitialLoad':
					//BLOCK_GAME_IMAGES();
					sendResponse({ success: true });
					break;
				case 'Unblock_InitialLoad':
					//UNBLOCK_GAME_IMAGES();
					sendResponse({ success: true });
					break;
				default:
					sendResponse({ success: false, message: "Ação desconhecida" });
					break;
			}
		} catch (e) {
			console.error("Error in background.js:", e);
			sendResponse({ success: false, message: e.message });
		}
	})();
	return true;
});
async function handleSaveBox(item, checado, sendResponse) {
	if (item === 'NEXUS_API') {
		await chrome.storage.local.set({ "nexususer": checado });
		sendResponse({ success: true });
		return;
	}
	options[item] = checado;
	await SAVE_OPTIONS(item);
	if (item === "NotifyUpdates") {
		clearInterval(UpdateLoop);
		UpdateLoop = setInterval(UpdateStartUp, 61000);
		UpdateStartUp();
	}
	sendResponse({ success: true, message: `Opção ${item} Salvo` });
}

async function handleLoadMessages(lang, sendResponse) {
	const response = await fetch(`/_locales/${lang}/messages.json`);
	const messages = await response.json();
	sendResponse({ success: true, message: messages });

}

async function handleSaveModsCache(modsData, sendResponse) {
	await LOAD_MODDATA();
	for (const [modId, fileData] of Object.entries(modsData)) {
		mods_data[modId] = mods_data[modId] || { 'thumbnail': '0' };
		for (const [fileId, modData] of Object.entries(fileData)) {
			mods_data[modId][`LAST_LOAD_${fileId}`] = modData;
			mods_data[modId][`LAST_LOAD_${fileId}`]['size'] ||= 0;
		}
	}
	await saveMods();
	await SAVE_MODDATA();
	sendResponse({ success: true, message: "Caches de Mods salvos!", data: mods });
}

async function handleSaveModsThumbnails(modId, fileId, item, sendResponse) {
	await LOAD_MODDATA();
	mods_data[modId] = mods_data[modId] || {
		"thumbnail": item,
		[`LAST_LOAD_${fileId}`]: { "Last_Load_Timestamp": 0, "changelog": 0, "description": 0, "mod_name": 0, "size": 0, "update_state": 'outdated' }
	};
	mods_data[modId]['thumbnail'] = item;
	await SAVE_MODDATA();
	sendResponse({ success: true });
}

async function handleLoadModsThumbnails(sendResponse) {
	await LOAD_MODDATA();
	sendResponse({ success: true, data: mods_data });
}

async function handleLoadBox(sendResponse) {
	await LOAD_OPTIONS();
	sendResponse({ success: true, data: options });
}

async function handleLoadNexusAPI(sendResponse) {
	await Load_NEXUSAPI();
	sendResponse({ success: true, data: NEXUS_API });
}

async function handleSaveHiddenMod(game, modId, mod_name, gameId, sendResponse) {
	await LOAD_HIDDEN_MODS();
	await HIDE_MOD(game, modId, mod_name, gameId, sendResponse);
}

async function handleLoadHiddenMods(sendResponse) {
	await LOAD_HIDDEN_MODS();
	sendResponse({ success: true, data: hiddenMods });
}

async function handlePopupConfig(type, sendResponse) {
	if (popupWindowId !== null) {
		chrome.windows.get(popupWindowId, { populate: true }, (window) => {
			if (window) {
				const popupTab = window.tabs.find(tab => tab.url.includes("config.html?popup=true"));
				if (popupTab) {
					chrome.windows.remove(popupWindowId, () => {
						popupWindowId = null;
						openPopup(type);
					});
				} else {
					openPopup(type);
				}
			} else {
				popupWindowId = null;
				openPopup(type);
			}
		});
	} else {
		openPopup(type);
	}
	sendResponse({ success: true, data: options });
}

async function handleTrackMod(message, sendResponse) {
	await loadMods();
	await SAVE_MOD(message.mod, message.mod_name, message.file_id, message.game, message.version, message.updated, message.category, message.mod_Fullname, message.mod_thumbnail, message.gameName,message.game_number);
	sendResponse({ success: true, message: `Mod ${message.mod_name} Atualizado!` });
}


let popupWindowId = null;

function openPopup(tipo) {
	if (tipo == "mods") {
		var u = "config.html?popup=true&tab=myMods";
	}
	else if (tipo == "cdn_test") {
		var u = "config.html?popup=true&tab=settings&run=CdnTest";
	}
	else {
		var u = "config.html?popup=true&tab=settings";
	}
	chrome.windows.create({
		url: chrome.runtime.getURL(u),
		type: "popup",
		width: 810,
		height: 1000,
		focused: true
	}, (newWindow) => {
		popupWindowId = newWindow.id;
	});
}
chrome.windows.onRemoved.addListener((windowId) => {
	if (windowId === popupWindowId) {
		popupWindowId = null;
	}
});
async function loadMods() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('mods', (result) => {
			if (result.mods) {
				mods = result.mods;
			}
			resolve();
		});
	});
}

async function SAVE_MODDATA() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({
			mods_data: mods_data
		}, () => {
			resolve();
		});
	});
}

async function LOAD_MODDATA() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('mods_data', (result) => {
			if (result.mods_data) {
				mods_data = result.mods_data;
			}
			resolve();
		});
	});
}

function saveMods() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({
			mods: mods
		}, () => {
			resolve();
		});
	});
}

function resetMods() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.remove('mods', () => {
			mods = {};
			mods_data = {};
			SAVE_MODDATA();
			saveMods();
			resolve();
		});
	});
}

async function SAVE_OPTIONS(item) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({
			"options_data": options
		}, () => {
			resolve();
		});
	});
}

async function LOAD_OPTIONS() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get("options_data", (data) => {
			if (data.options_data) {
				options = Object.assign(options, data.options_data);
			}
			resolve(options);
		});
	});
}

async function Load_NEXUSAPI() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get("nexususer", (data) => {
			if (data) {
				NEXUS_API = data.nexususer;
				api_headers = {
					method: 'GET',
					headers: {
						'accept': 'application/json',
						'apikey': NEXUS_API
					}
				}

			}
			resolve();
		});
	});
}

async function deleteMod(modName, modId, sendResponse) {
	chrome.storage.local.get('mods', (result) => {
		if (result.mods) {
			mods = result.mods;
			if (mods.hasOwnProperty(modName)) {
				delete mods[modName];
				delete mods_data[modId];
				console.log(`Mod "${modName}" removido com sucesso.`);
				sendResponse({
					success: true,
					message: "Mod " + modName + " Deletado"
				});
				SAVE_MODDATA();
				saveMods();
			} else {
				sendResponse({
					success: true,
					message: "Mod " + modName + " Não encontrado"
				});
				console.error(`Mod "${modName}" não encontrado.`);
			}
		}
	});
}

async function SAVE_MOD(mod, mod_name, file_id, game, version, updated, category, fullname, thumbnail, gameName,game_number) {
	return new Promise(async (resolve, reject) => {
		if (!mods[mod] || mods[mod].mod_name !== mod_name || mods[mod].file_id !== file_id || mods[mod].game !== game || mods[mod].version !== version || mods[mod].updated !== updated || mods[mod].category !== category || mods[mod].fullname !== fullname || mods[mod].gameName !== gameName||mods[mod].game_number!==game_number) {
			mods[mod_name] = {
				mod_id: mod,
				game_number:game_number,
				game: game,
				file_id: file_id,
				updated: updated,
				updatedLegible: formatDate(updated),
				version: version,
				category: category,
				gameName: gameName,
				full_name: fullname
			};
			await LOAD_MODDATA();
			if (!mods_data[mod]) {
				mods_data[mod] = {
					'thumbnail': thumbnail
				};
			}
			await SAVE_MODDATA();
			saveMods().then(() => {
				console.log(mods_data[mod]);
				console.log('Mod salvo:', mods[mod_name], mods_data[mod]);
				resolve();
			});
		} else {
			console.log('Mod já está salvo:', mods[mod]);
			resolve();
		}
	});
}
async function HIDE_MOD(game, modId, name, gameId, sendResponse) {
	return new Promise(async (resolve, reject) => {
		if (!hiddenMods[game]) {
			hiddenMods[game] = {};
		}

		if (!hiddenMods[game][modId] || hiddenMods[game][modId].mod_name !== name) {
			hiddenMods[game][modId] = {
				mod_name: name,
				mod_id: modId,
				game_id: gameId
			};

			// Salva as modificações
			SAVE_HIDDEN_MOD().then(() => {
				console.log('Mod Oculto:', hiddenMods[game][modId].mod_name, hiddenMods[game]);

				resolve();
			});
		} else {
			console.log('Mod já foi Oculto:', hiddenMods[game]);
			resolve();
		}

		// Envia a resposta com o status de sucesso
		sendResponse({
			success: true,
			data: hiddenMods
		});
	});
}

async function LOAD_HIDDEN_MODS() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('hiddenMods', (result) => {
			if (result.hiddenMods) {
				hiddenMods = result.hiddenMods;
			}
			resolve();
		});
	});
}
async function delete_HiddenMod(game, modId, sendResponse) {
	chrome.storage.local.get('hiddenMods', async (result) => {
		if (result.hiddenMods) {
			hiddenMods = result.hiddenMods;
			if (hiddenMods.hasOwnProperty(game)) {
				delete hiddenMods[game][modId];
				if (Object.entries(hiddenMods[game]).length <= 0) {
					delete hiddenMods[game];
				}
				await SAVE_HIDDEN_MOD();
				sendResponse({
					success: true,
					message: "Mod Deletado"
				});
			}
		}
	});
}

function SAVE_HIDDEN_MOD() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({
			hiddenMods: hiddenMods
		}, () => {
			resolve();
		});
	});
}

async function loadHiddenContent(sendResponse) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('hiddenContent', (result) => {
			if (result.hiddenContent) {
				hiddenContent = result.hiddenContent;
				sendResponse({
					success: true,
					message: hiddenContent
				});
			} else {
				sendResponse({
					success: false,
					message: "No Words Yet"
				});
			}
			resolve();
		});
	});
}
async function saveHiddenContent(word, sendResponse) {
	return new Promise((resolve, reject) => {
		const dadosUnicos = [...new Set(word.filter(value => value.trim() !== ""))];
		const dadosFormatados = [dadosUnicos.join("#-#")];
		chrome.storage.local.get({
			hiddenContent: word
		}, data => {
			chrome.storage.local.set({
				"hiddenContent": dadosFormatados
			}, () => {
				sendResponse({
					success: true,
					message: dadosFormatados
				});
				resolve();
			});
		});
	});
}
var outdated_mods = 0;
async function CheckModUpdates() {
	if (options['MemoryMode'] == true) {
		console.error("Can't Update Mods: Memory Mode Option Enabled")
		return;
	}
	for (const [modName, modInfo] of Object.entries(mods)) {
		const {
			mod_id,
			game,
			version,
			updated,
			category,
			game_number,
			full_name,
			file_id,
		} = modInfo;
		await GetFileInfo(mod_id, game, version, updated, modName, Number(file_id),game_number);

	};
	if (outdated_mods > 0) {
		if (options['language'] == "english") {
			var mods_message = " Mods Outdated!"
		} else if (options['language'] == "portuguese") {
			var mods_message = " Mods Desatualizados!"
		} else if (options['language'] == "alemao") {
			var mods_message = " Veraltete Mods!"
		} else if (options['language'] == "polones") {
			var mods_message = " Przestarzałe mody!"
		}
		chrome.notifications.create('ModUpdateCheck', {
			type: 'basic',
			iconUrl: 'icon.png',
			title: 'NexusMods Advance',
			message: outdated_mods + mods_message,
			priority: 2
		});
		outdated_mods = 0;
	}
	temp_FetchCache = {};

}
var api_headers = {
	method: 'GET',
	headers: {
		'accept': 'application/json',
		'apikey': "0"
	}
}
var temp_FetchCache = {};
var DESCRIPTION, CHANGELOG;
var activeRequests = {};
async function GetFileInfo(modIde, gameId, version, updated, title, file_id,game_number) {
	try {
		if (activeRequests[modIde]) {
			console.log("Aguardando requisição já em andamento para " + title);
			return await activeRequests[modIde];
		}
		let DATA;
		if (temp_FetchCache[gameId] && temp_FetchCache[gameId][modIde]) {
			DATA = temp_FetchCache[gameId][modIde].response;
			console.log("%cCarregando " + title + " do Cache de FetchCache", "padding:2px;background: #ff2f2f;font-weight:bold;color:black");
		} else {
			activeRequests[modIde] = fetch("https://api.nexusmods.com/v1/games/" + gameId + "/mods/" + modIde + "/files.json", api_headers);
			const response = await activeRequests[modIde];
			DATA = await response.json();

			if (!response.ok) {
				console.error("Erro de Conexão: " + response.status);
				if (response.status == 403) {
					console.log("Error loading mod " + title + " MOD Doest not exist anymore.");
					outdated_mods++;
				}
				delete activeRequests[modIde]; // Remove a requisição ativa
				return;
			}

			if (!temp_FetchCache[gameId]) {
				temp_FetchCache[gameId] = {};
			}
			temp_FetchCache[gameId][modIde] = { response: DATA };

			delete activeRequests[modIde];
		}
		let latestVersion = 0;
		let latestFile = null;
		if (!mods_data[modIde] || !mods_data[modIde]["LAST_LOAD_" + file_id]) {
			mods_data[modIde]["LAST_LOAD_" + file_id] = {

			}
		}

		DATA.files.forEach(update => {
			if ((update.category_name === "MAIN" || update.category_name === "OPTIONAL" || update.category_name === "MISCELLANEOUS" || update.category_name === "UPDATE") && update.name === title) {
				if (!latestVersion || update.version > latestVersion) {
					latestVersion = update.version;
					latestFile = update;
				}
			}
		});

		DATA.files.forEach(async (update) => {
			if (Number(update.file_id) === file_id) {
				if (update.category_name === "MAIN" || update.category_name === "OPTIONAL" || update.category_name === "MISCELLANEOUS" || update.category_name === "UPDATE") {
					mods_data[modIde]["LAST_LOAD_" + file_id].update_state = 'updated';
				} else {
					outdated_mods++;
					console.log(title + " Desatualizado");
					if (latestVersion && update.version < latestVersion) {

						mods_data[modIde]["LAST_LOAD_" + file_id].update_state = 'outdated';
					} else {
						mods_data[modIde]["LAST_LOAD_" + file_id].update_state = 'old_file';
					}
				}
				if (mods_data[modIde]) {
					if (mods_data[modIde]["LAST_LOAD_" + file_id]) {
						mods_data[modIde]["LAST_LOAD_" + file_id].Last_Load_Timestamp = Math.floor(Date.now() / 1000);
						
						if (latestFile&&latestFile.description) {
							DESCRIPTION = latestFile.description.replaceAll("\n", "<br>");
						} else {
							DESCRIPTION = 0;
						}
						if (latestFile&&latestFile.changelog_html) {
							CHANGELOG = latestFile.changelog_html.replaceAll("\n", "<br>");
						} else {
							CHANGELOG = 0;
						}
						mods_data[modIde]["LAST_LOAD_" + file_id].lastVersion = latestVersion;
						mods_data[modIde]["LAST_LOAD_" + file_id].changelog = CHANGELOG;
						mods_data[modIde]["LAST_LOAD_" + file_id].description = DESCRIPTION;
						mods_data[modIde]["LAST_LOAD_" + file_id].size = latestFile ? latestFile.size_in_bytes : 0;
						mods_data[modIde]["LAST_LOAD_" + file_id].last_FileID = latestFile ? latestFile.file_id : file_id;
						await SAVE_MODDATA();
					}
				}
			}
		});

	} catch (error) {
		delete activeRequests[modIde];
		console.error('Error Loading API Data:', error);
	}
}



function formatDate(unixTimestamp) {
	const date = new Date(unixTimestamp * 1000);
	const formattedDate = date.toLocaleString();

	return formattedDate;
}
var GAMES = [];


var NOTIFICATIONS_COUNT = 0;

async function UpdateStartUp() {
	await LOAD_OPTIONS();
	await Load_NEXUSAPI();
	await checkOneWeekPassed();
	await SETUP_YOUTUBE_DEFER("block");
	if (NEXUS_API == 0 || NEXUS_API == "0" || !NEXUS_API) {
		console.error("Cant check Mod Updates: NexusMods Account not connected!");
		clearInterval(UpdateLoop);
		return;
	}
	console.log("Checking Mod Updates");
	if (options.LAST_MOD_UPDATE_CHECK == undefined || options.LAST_MOD_UPDATE_CHECK == 0) {
		options.LAST_MOD_UPDATE_CHECK = Math.floor(Date.now() / 1000);
		SAVE_OPTIONS();
	}
	const lastModUpdateCheck = options.LAST_MOD_UPDATE_CHECK;
	const currentTimeUnix = Math.floor(Date.now() / 1000);
	const twentyFourHoursInSeconds = 2 * 60 * 60;
	//const twentyFourHoursInSeconds = 1*60;
	const isMoreThan5Hours = (currentTimeUnix - lastModUpdateCheck) >= twentyFourHoursInSeconds;
	if (options['MemoryMode'] == true) {
		console.error("Can't Update Mods: Memory Mode Option Enabled");
		options.LAST_MOD_UPDATE_CHECK = Math.floor(Date.now() / 1000);
		await SAVE_OPTIONS();
		return;
	}
	if (options['NotifyUpdates'] == true && isMoreThan5Hours == true) {
		
			await loadMods();
			await LOAD_MODDATA();
			CheckModUpdates();

			options.LAST_MOD_UPDATE_CHECK = Math.floor(Date.now() / 1000);
			await SAVE_OPTIONS();
		
	}

}

chrome.webNavigation.onCommitted.addListener(function (details) {
	if (details.url) {
		SETUP_YOUTUBE_DEFER('block');

	}
}, { url: [{ urlMatches: 'https://www.nexusmods.com' }] });

async function BLOCK_GAME_IMAGES() {
	await chrome.declarativeNetRequest.updateDynamicRules({
		addRules: [{
			"id": 2,
			"priority": 1,
			"action": { "type": "block" },
			"condition": {
				"urlFilter": "staticdelivery.nexusmods.com",
				"resourceTypes": ["image"]
			}
		}],
		removeRuleIds: []
	});
}
async function UNBLOCK_GAME_IMAGES() {
	await chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [2]
	});
}

async function SETUP_YOUTUBE_DEFER(type) {
	if (options['BlockYoutube'] == true) {
		if (type === "block") {
			
			await chrome.declarativeNetRequest.updateDynamicRules({
				removeRuleIds: [1]
				
			});
			
			await chrome.declarativeNetRequest.updateDynamicRules({
				addRules: [{
					"id": 1,
					"priority": 1,
					"action": { "type": "block" },
					"condition": {
						"urlFilter": "youtube.com",
						"resourceTypes": ["sub_frame"],
						"initiatorDomains": ["nexusmods.com"]
					}
				}],
				removeRuleIds: []  // Remove regras adicionais, se necessário
			});
			console.warn("Youtube Bloqueado");
			chrome.storage.local.set({ "YOUTUBE_STATUS": 'lock' })
		} else {
			
			console.warn("Youtube Desbloqueado");
			await chrome.declarativeNetRequest.updateDynamicRules({
				removeRuleIds: [1]
			});
			chrome.storage.local.set({ "YOUTUBE_STATUS": 'unlock' })
		}
	} else {

		console.warn("Youtube Desbloqueado");
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: [1]  // Remove a regra com id 1
		});
		chrome.storage.local.set({ "YOUTUBE_STATUS": 'unlock' })
	}
}


var canShowEndorse = false;
async function checkOneWeekPassed() {
	if (options['Endorsed'] == false) {
		chrome.storage.local.get(['installTime'], (result) => {
			if (result.installTime) {
				const installTime = result.installTime;
				const oneWeekInMillis = 3 * 24 * 60 * 60 * 1000; // 1 semana em milissegundos
				const currentTime = Date.now();

				if ((currentTime - installTime) >= oneWeekInMillis) {
					console.log('Já se passou 3 dias desde a instalação!');
					canShowEndorse = true;
				} else {
					const daysLeft = Math.ceil((oneWeekInMillis - (currentTime - installTime)) / (24 * 60 * 60 * 1000));
					console.log(`Ainda faltam ${daysLeft} dias.`);
				}
			} else {
				console.log('A data de instalação não foi encontrada.');
				const installTime = Date.now();
				chrome.storage.local.set({ installTime }, () => {
					console.log('Data de instalação salva:', new Date(installTime).toLocaleString());
				});
				
			}
		});
	}
}

var UpdateLoop, NotificationLoop;
chrome.runtime.onInstalled.addListener(async (details) => {

	if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
		const installTime = Date.now();
		chrome.storage.local.set({ installTime }, () => {
			console.log('Data de instalação salva:', new Date(installTime).toLocaleString());

		});
		await LOAD_OPTIONS();
		const userLanguage = navigator.language || navigator.userLanguage;
		switch (userLanguage) {
			case 'en':
			case 'en-US':
				options['language'] = 'english';
				break;
			case 'pt-BR':
				options['language'] = 'portuguese';
				break;
			case 'de':
			case 'de-DE':
				options['language'] = 'alemao';
				break;
			case 'pl':
				options['language'] = 'polones';
				break;
			default:
				userLanguage="en"
				options['language'] = 'english';
				console.log("Idioma não reconhecido ou não suportado.");
				break;
		}
		await SAVE_OPTIONS();
		
	}
	clearInterval(UpdateLoop);
	UpdateLoop = setInterval(UpdateStartUp, 61000);
	UpdateStartUp();
	chrome.action.setBadgeBackgroundColor({
		color: 'orange'
	});
});

chrome.runtime.onStartup.addListener(async () => {

	chrome.action.setBadgeBackgroundColor({
		color: 'orange'
	});
	clearInterval(UpdateLoop);
	UpdateLoop = setInterval(UpdateStartUp, 61000);
	UpdateStartUp();

});

chrome.notifications.onClicked.addListener(notificationId => {
	if (notificationId === 'ModUpdateCheck') {
		chrome.windows.create({
			url: chrome.runtime.getURL('config.html?popup=true&tab=myMods'),
			type: 'popup',
			width: 810,
			height: 1000
		});
	}

});
chrome.action.onClicked.addListener(() => {

	chrome.windows.create({
		url: chrome.runtime.getURL("config.html?tab=settings"),
		type: "popup",
		width: 1,
		height: 1
	});
});
var http_headers = {
	headers: {
		"accept": "text/html, */*; q=0.01",
		"accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
		"priority": "u=1, i",
		"sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Windows\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
		"x-requested-with": "XMLHttpRequest"
	},
	referrer: "https://www.nexusmods.com",
	referrerPolicy: "strict-origin-when-cross-origin",
	method: "GET",
	mode: "cors",
	credentials: "include"
};
