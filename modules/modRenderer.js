var modData = {

}
async function CreateModTables(mods, title) {
	try{
	line = 0;
	lineOutdated = 0;
	lineElement_Outdated = document.createElement("div");
	lineElement_Outdated.classList = 'container';
	//document.querySelector("div#mod_content").appendChild(document.createElement("br"));
	document.querySelector("div#mod_content").appendChild(lineElement_Outdated);
	lineElement = document.createElement("div");
	lineElement.classList = 'container';
	//document.querySelector("div#mod_content").appendChild(document.createElement("br"));
	document.querySelector("div#mod_content").appendChild(lineElement);
	tempMods = {};

	tempMods = Object.entries(mods);
	if (options['TrackingMods_RenderBy'] == 'alfabetico_FileName') {
		tempMods.sort((a, b) => {
			return a[0].localeCompare(b[0]);
		});
	}
	else if (options['TrackingMods_RenderBy'] == 'alfabetico_ModName') {
		tempMods.sort((a, b) => {
			return a[1].full_name.localeCompare(b[1].full_name);
		});
	}
	else if (options['TrackingMods_RenderBy'] == 'alfabetico_category') {
		tempMods.sort((a, b) => {
			return a[1].category.localeCompare(b[1].category);
		});
	}
	else if (options['TrackingMods_RenderBy'] == 'alfabetico_gameName') {
		tempMods.sort((a, b) => {
			return a[1].game_number.localeCompare(b[1].game_number);
		});
		tempMods.reverse();
	}
	else {
		console.log("Renderizando Padrão")
		tempMods.sort((a, b) => {
			return a[1].full_name.localeCompare(b[1].full_name);
		});
		options['TrackingMods_RenderBy'] = 'alfabetico_FileName';
		await saveCheckbox('TrackingMods_RenderBy', 'alfabetico_FileName');
	}

	// Converter o array de volta para um objeto
	tempMods = Object.fromEntries(tempMods);
	tempMods_permanent = tempMods;
	tempMods = searchInObject(tempMods, title);
	console.log("%cCarregando " + Object.entries(tempMods).length + " MODS", "padding:2px;background: yellowgreen;font-weight:bold;color:black");
	console.log("%cRenderizando com " + options['TrackingMods_RenderBy'], "padding:2px;background: yellowgreen;font-weight:bold;color:black");

	for (const [mod_name, modInfo] of Object.entries(tempMods)) {
		const {
			mod_id,
			game,
			game_number,
			gameName,
			version,
			updatedLegible,
			category,
			file_id,
			full_name,
		} = modInfo;
		console.log(modInfo)
		if (lineOutdated == 3) {
			lineOutdated = 0;
			lineElement_Outdated = document.createElement("div");
			lineElement_Outdated.classList = 'container';
			document.querySelector("div#mod_content").prepend(lineElement_Outdated);
		}
		if (line == 3) {
			line = 0;
			lineElement = document.createElement("div");
			lineElement.classList = 'container';
			document.querySelector("div#mod_content").appendChild(lineElement);
		}

		modTable = document.createElement("div");

		lineElement.appendChild(modTable);
		modTable.id = "modTable";

		modTable.addEventListener('click', function (ev) {
			const deleteDiv = ev.target.closest("div#TOP_CONTENT").querySelector("i#delete");
			const updateDiv = ev.target.closest("div#TOP_CONTENT").querySelector("i#update");
			if (ev.relatedTarget == deleteDiv || ev.target == deleteDiv || ev.relatedTarget == updateDiv || ev.target == updateDiv) {
				return;
			}
			temp_changelog = bbcodeToHtml(mod_tempItems[ev.target.closest("div#modTable").getAttribute("file_id")]["CHANGELOG"]);
			temp_description = bbcodeToHtml(mod_tempItems[ev.target.closest("div#modTable").getAttribute("file_id")]["DESCRIPTION"]);
			mod_latestVersion = mod_tempItems[ev.target.closest("div#modTable").getAttribute("file_id")].latestVersion;
			if (mod_tempItems[ev.target.closest("div#modTable").getAttribute("file_id")].PIC) {
				document.querySelector("div#modViewDiv img").src = mod_tempItems[ev.target.closest("div#modTable").getAttribute("file_id")].PIC.replace("/thumbnails", "")
			} else {
				document.querySelector("div#modViewDiv img").src = "https://www.nexusmods.com/assets/images/default/noimage.svg"
			}
			document.querySelector("div#modViewDiv").setAttribute('mod_id', ev.target.closest("div#modTable").getAttribute("mod_id"))
			document.querySelector("div#modViewDiv").setAttribute('game', ev.target.closest("div#modTable").getAttribute("game"))
			document.querySelector("div#modViewDiv").setAttribute('game_id', ev.target.closest("div#modTable").getAttribute("game_number"))
			changelog_element = document.querySelector("div#modViewDiv div#Changelog");
			changelog_element.innerHTML = "";
			document.querySelector("div#modViewDiv span#modTitle").innerText = ev.target.closest("div#modTable").getAttribute("mod_title");
			document.querySelector("div#modViewDiv a#mainNameTitle").innerText = ev.target.closest("div#modTable").getAttribute("mod_fullname");
			document.querySelector("div#modViewDiv a#mainNameTitle").href = ev.target.closest("div#modTable").getAttribute("mod_href");
			const h2 = document.createElement("h2");
			if (temp_changelog != 0 && temp_changelog != null && temp_changelog != undefined) {
				h2.innerText = translate_strings.mod_description.description + mod_latestVersion;
				changelog_element.innerHTML = temp_changelog;
			} else {

				h2.innerText = translate_strings.mod_description.description + mod_latestVersion + translate_strings.mod_changelogFailure.message;
			}

			changelog_element.prepend(h2);

			const h22 = document.createElement("h2");

			if (temp_description != 0 && temp_description != '' && temp_description != null && temp_description != undefined) {
				h22.innerText = translate_strings.mod_description.message + mod_latestVersion;
				changelog_element.appendChild(h22);
				changelog_element.innerHTML += temp_description;
			} else {
				h22.innerText = translate_strings.mod_description.message + mod_latestVersion + translate_strings.mod_descriptionFailure.message;
				changelog_element.appendChild(h22);
			}
			chrome.runtime.sendMessage({
				action: 'UnlockYoutube'
			});
			document.querySelector("div#Posts").innerHTML = '';
			document.querySelector("div#Logs").innerHTML = '';
			document.querySelector("div#Bugs").innerHTML = '';
			document.querySelector("div#viewDescription").click();
			document.querySelector("div#modViewDiv").style.display = 'block';
			document.querySelector("div#overflow").style.display = 'block';
		})

		mod_title = document.createElement("div");
		mod_title.id = 'modTitleDiv'

		mod_span = document.createElement('span');
		mod_span.id = "title"
		mod_span.innerText = mod_name;

		mod_span_version = document.createElement('span');
		mod_span_version.id = "version";
		mod_span_version.classList = "modSubSpan";

		mod_span_game = document.createElement('span');
		mod_span_game.id = "gameName";
		mod_span_game.classList = "modSubSpan";
		if(gameName=="site"){
		mod_span_game.innerText = "Modding Tools";
		modTable.setAttribute("gameName", "Modding Tools");
		}else{
		mod_span_game.innerText = gameName;
		modTable.setAttribute("gameName", gameName);
		}
		mod_span_updated = document.createElement('span');
		mod_span_updated.id = "updated";
		mod_span_updated.innerText = updatedLegible || 0;
		mod_span_updated.classList = "modSubSpan";

		mod_span_category = document.createElement('span');
		mod_span_category.id = "category";
		mod_span_category.innerText = translate_strings.category.message + category;
		mod_span_category.classList = "modSubSpan";
		modTable.setAttribute("category", category);

		mod_span_size = document.createElement('span');
		mod_span_size.id = "size";
		mod_span_size.innerText = translate_strings.size.message + formatBytes(size);
		mod_span_size.classList = "modSubSpan";

		mod_span_FullMod = document.createElement('span');
		mod_span_FullMod.id = "full_name";
		mod_span_FullMod.innerText = translate_strings.main_name.message + full_name;
		mod_span_FullMod.classList = "modSubSpan";

		//MOD UPDATE STATUS
		modStatus = document.createElement("span");
		modStatus.classList = 'ModStatus';
		modStatus.id = 'modUpdated'
		modStatus.innerText = translate_strings.modStatus_updated.message;
		//UPDATE MOD OPTION
		update_mod = document.createElement("i");
		update_mod.id = "update";
		update_mod.setAttribute("aria-hidden", true);
		update_mod.classList = 'fa fa-cloud-download';
		update_mod.addEventListener('click', async function (ev) {
			const updateVersion = ev.target.closest("div#modTable").getAttribute("new_file_id");
			const mod_name = ev.target.closest("div#modTable").getAttribute('mod_title');
			const mod_Fullname = ev.target.closest("div#modTable").getAttribute('mod_fullname');
			const newVersion = ev.target.closest("div#modTable").getAttribute("NEW_VERSION");
			const mod_id = ev.target.closest("div#modTable").getAttribute('mod_id');
			const game_number = ev.target.closest("div#modTable").getAttribute('game_number');
			const updateStatus = ev.target.closest("div#modTable").classList[0];
			const newSize=ev.target.closest("div#modTable").getAttribute('NEW_SIZE');
			const category = ev.target.closest("div#modTable").getAttribute('category');
			const thumbnail = ev.target.closest("div#modTable").getAttribute('thumbnail');
			const gameName = ev.target.closest("div#modTable").getAttribute('game');
			if (!is_premium) {
				window.open("https://www.nexusmods.com/" + gameName + "/mods/" + mod_id + "/?tab=files&NAdvance_ScrollToFile=" + updateVersion);
			} else {
				console.log("%cPremium Download " + mod_Fullname, "padding:2px;background: #da8e35;font-weight:bold;color:black");
				modData.file_id = updateVersion;
				modData.new_version = newVersion;
				modData.modName = mod_name;
				modData.category = category;
				modData.thumbnail = thumbnail;
				modData.game_id = game_number;
				modData.size=newSize;
				modData.game_name = gameName;
				GetPremiumDownload(game_number, mod_id, updateVersion, mod_Fullname, newVersion);
			}
		});

		update_modMessage = document.createElement("span");
		update_modMessage.classList = 'ModMessage';
		update_modMessage.id = 'updateMsg';
		update_modMessage.innerText = translate_strings.modOption_update.message;

		//DELETE BUTTON SETTING
		delete_modDIV = document.createElement("div");
		delete_modDIV.classList = 'deleteDiv';

		delete_modMessage = document.createElement("span");
		delete_modMessage.classList = 'ModMessage';
		delete_modMessage.id = 'deleteMsg';
		delete_modMessage.innerText = translate_strings.modOption_delete.message;

		delete_mod = document.createElement("i");
		delete_modDIV.appendChild(delete_mod);
		delete_modDIV.appendChild(delete_modMessage);
		delete_modDIV.appendChild(update_mod);
		delete_modDIV.appendChild(update_modMessage);
		delete_mod.id = "delete";
		delete_mod.setAttribute("aria-hidden", true);
		delete_mod.classList = 'fa fa-trash';
		delete_mod.addEventListener('click', function (ev) {
			chrome.runtime.sendMessage({
				action: 'DeleteMod',
				mod_name: ev.target.closest("div#modTable").getAttribute('mod_title'),
				modId: ev.target.closest("div#modTable").getAttribute('mod_id')
			}, function (response) {
				if (chrome.runtime.lastError) {
					console.error("Error sending message:", chrome.runtime.lastError.message);
				} else {

					if (response && response.success) {
						ev.target.closest("div#modTable").remove();
					} else {
						console.error("Error in response:", response.error);
					}
				}
			});
		})

		DIV_TOP = document.createElement("div");
		DIV_TOP.id = 'TOP_CONTENT';
		DIV_THUMB = document.createElement("div");
		DIV_THUMB.classList = 'THUMBNAIL'
		DIV_INFO = document.createElement("div");
		DIV_INFO.id = "TOP_DETAILS";
		DIV_TOP.appendChild(DIV_THUMB);
		DIV_TOP.appendChild(DIV_INFO);

		mod_title.appendChild(mod_span);
		DIV_INFO.appendChild(mod_title);
		DIV_INFO.appendChild(mod_span_game);
		DIV_INFO.appendChild(mod_span_version);

		DIV_INFO.appendChild(modStatus);
		DIV_INFO.appendChild(mod_span_updated);
		DIV_INFO.appendChild(mod_span_category);
		DIV_INFO.appendChild(mod_span_size);
		DIV_INFO.appendChild(mod_span_FullMod);
		DIV_INFO.appendChild(delete_modDIV);

		DIV_THUMB.addEventListener('mouseleave', function (ev) {
			const deleteDiv = ev.target.closest("div#TOP_CONTENT").querySelector("i#delete");
			const updateDiv = ev.target.closest("div#TOP_CONTENT").querySelector("i#update");
			const deleteMessage = ev.target.closest("div#TOP_CONTENT").querySelector("span#deleteMsg");
			const updateMessage = ev.target.closest("div#TOP_CONTENT").querySelector("span#updateMsg");
			const modStatus = ev.target.closest("div#TOP_CONTENT").querySelector("span.ModStatus");
			if (ev.relatedTarget != deleteDiv && ev.relatedTarget != deleteMessage && ev.relatedTarget != updateMessage && ev.relatedTarget != updateDiv && ev.relatedTarget != modStatus) {
				updateMessage.style.display = 'none';
				deleteMessage.style.display = 'none';
				deleteDiv.style.visibility = 'hidden';
				deleteDiv.style.opacity = '0';
				if (modStatus) {
					modStatus.style.display = 'block';
				}
				updateDiv.style.visibility = 'hidden';
				updateDiv.style.opacity = '0';
			}
		}, true);
		DIV_THUMB.addEventListener('mousemove', function (ev) {
			const deleteDiv = ev.target.closest("div#TOP_CONTENT").querySelector("i#delete");
			const updateDiv = ev.target.closest("div#TOP_CONTENT").querySelector("i#update");
			const deleteMessage = ev.target.closest("div#TOP_CONTENT").querySelector("span#deleteMsg");
			const updateMessage = ev.target.closest("div#TOP_CONTENT").querySelector("span#updateMsg");
			const modStatus = ev.target.closest("div#TOP_CONTENT").querySelector("span.ModStatus");

			if (!deleteDiv) return;
			const rect = ev.target.getBoundingClientRect();
			const mouseX = ev.clientX - rect.left;
			const mouseY = ev.clientY - rect.top;
			const distanceFromRight = rect.width - mouseX;
			const distanceFromTop = mouseY;
			const proximityMargin = 100;

			if (distanceFromRight < proximityMargin && distanceFromTop < proximityMargin) {
				deleteMessage.style.display = 'block';
				deleteDiv.style.visibility = 'visible';
				deleteDiv.style.opacity = '1';
				if (modStatus) {
					modStatus.style.display = 'none';
				}
				updateDiv.style.visibility = 'visible';
				updateDiv.style.opacity = '1';

				updateMessage.style.display = 'block';
			} else {
				updateMessage.style.display = 'none';
				deleteMessage.style.display = 'none';
				deleteDiv.style.visibility = 'hidden';
				deleteDiv.style.opacity = '0';

				if (modStatus) {
					modStatus.style.display = 'block';
				}
				updateDiv.style.visibility = 'hidden';
				updateDiv.style.opacity = '0';
			}
		}, true);
		modTable.appendChild(DIV_TOP);
		modTable.setAttribute("mod_id", mod_id);
		modTable.setAttribute("game_number", game_number);
		modTable.setAttribute("game",game)
		modTable.setAttribute("mod_title", mod_name);
		modTable.setAttribute("mod_fullName", full_name);
		modTable.setAttribute("size", size);
		modTable.setAttribute("mod_href", "https://www.nexusmods.com/" + game + "/mods/" + mod_id);
		modTable.setAttribute("file_id", file_id);
		if (mod_tempData[mod_id] && mod_tempData[mod_id]["LAST_LOAD_" + file_id] && mod_tempData[mod_id]["LAST_LOAD_" + file_id]["Last_Load_Timestamp"]) {

			//18000
			if ((Math.floor(Date.now() / 1000) - mod_tempData[mod_id]["LAST_LOAD_" + file_id]["Last_Load_Timestamp"]) > 18000 && options['MemoryMode'] == false) {
				console.log("%cTimestamp do Mod " + mod_name + " expirou.", "padding:2px;background: #da8e35;font-weight:bold;color:black");
				await GetFileInfo(mod_id, Number(file_id), game, version, 0, mod_name, modTable, lineElement, 'normal',game);
			} else {
				await GetFileInfo_ByCache(mod_tempData[mod_id], mod_id, Number(file_id), game, version, mod_name, modTable, lineElement, 200, 'normal',game);
			}
		} else {
			console.log("%cNovo Mod Carregando: " + mod_name, "padding:2px;background: #4c970f;font-weight:bold;color:black");
			await GetFileInfo(mod_id, Number(file_id), game, version, size=0, mod_name, modTable, lineElement, 'normal',game);

		}
	};
	if (Object.keys(AllMods).length > 0) {
		chrome.runtime.sendMessage({
			action: 'SaveMods_Cache',
			modsData: AllMods
		}, function (response) {
			if (chrome.runtime.lastError) {
				console.error("Error sending message:", chrome.runtime.lastError.message);
			} else {
				if (response && response.success) {
					console.log("%c" + response.message, 'background: yellow; color: black;');
					//window.location.reload();
					AllMods = {};

				} else {
					console.error("Error in response:", response.error);
				}
			}
		});
	}

	GetApi_Data();
	document.querySelector("div#modLoading").style.display = 'none';
	}catch(e){
		//setTimeout(()=>{window.location.reload();},1500);
		throw e;
	}
}
async function CreateModTables_SimpleMode(mods, title) {
	lineElement_Outdated = document.createElement("div");
	lineElement_Outdated.classList = 'container simple';
	document.querySelector("div#mod_content").prepend(lineElement_Outdated);
	lineElement = document.createElement("div");
	lineElement.classList = 'container simple';
	//document.querySelector("div#mod_content").appendChild(document.createElement("br"));
	document.querySelector("div#mod_content").appendChild(lineElement);
	tempMods = {};

	tempMods = Object.entries(mods);
	if (options['TrackingMods_RenderBy'] == 'alfabetico_FileName') {
		tempMods.sort((a, b) => {
			return a[0].localeCompare(b[0]);
		});
	}
	else if (options['TrackingMods_RenderBy'] == 'alfabetico_ModName') {
		tempMods.sort((a, b) => {
			return a[1].full_name.localeCompare(b[1].full_name);
		});
	}
	else if (options['TrackingMods_RenderBy'] == 'alfabetico_category') {
		tempMods.sort((a, b) => {
			return a[1].category.localeCompare(b[1].category);
		});
	}
	else if (options['TrackingMods_RenderBy'] == 'alfabetico_gameName') {
		tempMods.sort((a, b) => {
			return a[1].game_number.localeCompare(b[1].game_number);
		});
		tempMods.reverse();
	}
	else {
		tempMods.sort((a, b) => {
			return a[1].full_name.localeCompare(b[1].full_name);
		});
		options['TrackingMods_RenderBy'] = 'alfabetico_FileName';
		await saveCheckbox('TrackingMods_RenderBy', 'alfabetico_FileName');
	}

	console.log("%cCarregando " + Object.entries(tempMods).length + " MODS na lista Simples", "padding:2px;background: yellowgreen;font-weight:bold;color:black");
	console.log("%cRenderizando com " + options['TrackingMods_RenderBy'], "padding:2px;background: yellowgreen;font-weight:bold;color:black");
	// Converter o array de volta para um objeto
	tempMods = Object.fromEntries(tempMods);
	tempMods_permanent = tempMods;
	tempMods = searchInObject(tempMods, title);

	for (const [mod_name, modInfo] of Object.entries(tempMods)) {
		const {
			mod_id,
			game_number,
			gameName,
			game,
			version,
			updated,
			category,
			file_id,
			full_name,
			size
		} = modInfo;

		modTable = document.createElement("div");

		lineElement.appendChild(modTable);
		modTable.id = "modTable_simple";

		modTable.addEventListener('click', function (ev) {
			if (ev.target == ev.target.closest("div#modTable_simple").querySelector("span#title") || ev.target == ev.target.closest("div#modTable_simple").querySelector("i#delete_simple") || ev.target == ev.target.closest("div#modTable_simple").querySelector("i#update_simple")) {
				return;
			}
			temp_changelog = bbcodeToHtml(mod_tempItems[ev.target.closest("div#modTable_simple").getAttribute("file_id")]["CHANGELOG"]);
			temp_description = bbcodeToHtml(mod_tempItems[ev.target.closest("div#modTable_simple").getAttribute("file_id")]["DESCRIPTION"]);
			mod_latestVersion = mod_tempItems[ev.target.closest("div#modTable_simple").getAttribute("file_id")].latestVersion;
			if (mod_tempItems[ev.target.closest("div#modTable_simple").getAttribute("file_id")].PIC) {
				document.querySelector("div#modViewDiv img").src = mod_tempItems[ev.target.closest("div#modTable_simple").getAttribute("file_id")].PIC.replace("/thumbnails", "");
			}
			document.querySelector("div#modViewDiv").setAttribute('mod_id', ev.target.closest("div#modTable_simple").getAttribute("mod_id"))
			document.querySelector("div#modViewDiv").setAttribute('game_id', ev.target.closest("div#modTable_simple").getAttribute("game_number"))
			changelog_element = document.querySelector("div#modViewDiv div#Changelog");
			changelog_element.innerHTML = "";
			document.querySelector("div#modViewDiv span#modTitle").innerText = ev.target.closest("div#modTable_simple").getAttribute("mod_title");
			document.querySelector("div#modViewDiv a#mainNameTitle").innerText = ev.target.closest("div#modTable_simple").getAttribute("mod_fullname");
			document.querySelector("div#modViewDiv a#mainNameTitle").href = ev.target.closest("div#modTable_simple").getAttribute("mod_href");
			const h2 = document.createElement("h2");
			if (temp_changelog != '0' && temp_changelog != null) {
				h2.innerText = "Changelog: " + mod_latestVersion;
				changelog_element.innerHTML = temp_changelog;
			} else {
				h2.innerText = "Changelog: " + mod_latestVersion + translate_strings.mod_changelogFailure.message;
			}

			changelog_element.prepend(h2);

			const h22 = document.createElement("h2");

			if (temp_description != '0' && temp_description != '' && temp_description != null) {
				h22.innerText = translate_strings.mod_description.message + mod_latestVersion;
				changelog_element.appendChild(h22);
			} else {
				h22.innerText = translate_strings.mod_description.message + mod_latestVersion + translate_strings.mod_descriptionFailure.message;
				changelog_element.appendChild(h22);
			}
			changelog_element.innerHTML += temp_description;
			chrome.runtime.sendMessage({
				action: 'UnlockYoutube'
			});
			document.querySelector("div#viewDescription").click();

			document.querySelector("div#modViewDiv").style.display = 'block';
			document.querySelector("div#overflow").style.display = 'block';
		})

		mod_title = document.createElement("div");
		mod_title.id = 'modTitleDiv'
		mod_title.classList = 'modTitleDiv_simple';
		mod_span = document.createElement('span');
		mod_span.id = "title"
		mod_span.innerText = mod_name;

		mod_span_version = document.createElement('span');
		mod_span_version.id = "version";
		mod_span_version.classList = "modSubSpan subSpan_simple";

		mod_span_size = document.createElement('span');
		mod_span_size.id = "size";
		mod_span_size.innerText = translate_strings.size.message + formatBytes(size);
		mod_span_size.classList = "modSubSpan";

		mod_span_game = document.createElement('span');
		mod_span_game.id = "gameName";
		mod_span_game.classList = "modSubSpan";
		mod_span_game.innerText =game_number;

		mod_span_FullMod = document.createElement('span');
		mod_span_FullMod.id = "full_name";
		mod_span_FullMod.innerText = full_name;
		mod_span_FullMod.classList = "modSubSpan subSpan_simple";

		mod_span_updated = document.createElement('span');
		mod_span_updated.id = "updated";
		mod_span_updated.innerText = formatDate(updated);
		mod_span_updated.classList = "modSubSpan";

		mod_span_category = document.createElement('span');
		mod_span_category.id = "category";
		mod_span_category.innerText = translate_strings.category.message + category;
		mod_span_category.classList = "modSubSpan";

		//MOD UPDATE STATUS

		modStatus = document.createElement("span");
		modStatus.classList = 'ModStatus';
		modStatus.id = 'modUpdated'
		modStatus.innerText = translate_strings.modStatus_updated.message;
		//UPDATE MOD SETTING (IN PROGRESS)
		const update_mod = document.createElement("i");
		update_mod.id = "update_simple";
		update_mod.setAttribute("aria-hidden", true);
		update_mod.classList = 'fa fa-cloud-download';
		update_mod.addEventListener('click', async function (ev) {
			const updateVersion = ev.target.closest("div#modTable_simple").getAttribute("new_file_id");
			const mod_name = ev.target.closest("div#modTable_simple").getAttribute('mod_title');
			const mod_Fullname = ev.target.closest("div#modTable_simple").getAttribute('mod_fullname');
			const newVersion = ev.target.closest("div#modTable_simple").getAttribute("NEW_VERSION");
			const mod_id = ev.target.closest("div#modTable_simple").getAttribute('mod_id');
			const game_number = ev.target.closest("div#modTable_simple").getAttribute('game_number');
			const updateStatus = ev.target.closest("div#modTable_simple").classList[0];
			const category = ev.target.closest("div#modTable_simple").getAttribute('category');
			const thumbnail = ev.target.closest("div#modTable_simple").getAttribute('thumbnail');
			const game=ev.target.closest("div#modTable_simple").getAttribute('game');
			const gameName = ev.target.closest("div#modTable_simple").getAttribute('gameName');
			console.log(thumbnail)
			if (!is_premium) {
				window.open("https://www.nexusmods.com/" + gameName + "/mods/" + mod_id + "/?tab=files&NAdvance_ScrollToFile=" + updateVersion);
			} else {
				console.log("%cPremium Download " + mod_Fullname, "padding:2px;background: #da8e35;font-weight:bold;color:black");
				modData.file_id = updateVersion;
				modData.new_version = newVersion;
				modData.modName = mod_name;
				modData.category = category;
				modData.thumbnail = thumbnail;
				modData.game=game;
				modData.game_id = game_number;
				modData.game_name = gameName;
				GetPremiumDownload(game_number, mod_id, updateVersion, mod_Fullname, newVersion);
			}
		});

		//DELETE BUTTON SETTING

		delete_mod = document.createElement("i");
		delete_mod.id = "delete_simple";
		delete_mod.setAttribute("aria-hidden", true);
		delete_mod.classList = 'fa fa-trash';
		delete_mod.addEventListener('click', function (ev) {
			chrome.runtime.sendMessage({
				action: 'DeleteMod',
				mod_name: ev.target.closest("div#modTable_simple").getAttribute('mod_title'),
				modId: ev.target.closest("div#modTable_simple").getAttribute('mod_id')
			}, function (response) {
				if (chrome.runtime.lastError) {
					console.error("Error sending message:", chrome.runtime.lastError.message);
				} else {

					if (response && response.success) {
						ev.target.closest("div#modTable_simple").remove();
					} else {
						console.error("Error in response:", response.error);
					}
				}
			});
		})

		DIV_TOP = document.createElement("div");
		DIV_TOP.id = 'TOP_CONTENT_simple';
		DIV_INFO = document.createElement("div");
		DIV_INFO.id = "TOP_DETAILS_simple";
		DIV_TOP.appendChild(DIV_INFO);

		mod_title.appendChild(mod_span);
		mod_title.appendChild(mod_span_version);
		DIV_INFO.appendChild(mod_title);
		DIV_INFO.appendChild(mod_span_FullMod);

		DIV_TOP.addEventListener('mousemove', function (ev) {
			const deleteDiv = ev.target.closest("div#modTable_simple").querySelector("i#delete_simple");
			const updateDiv = ev.target.closest("div#modTable_simple").querySelector("i#update_simple");
			if (!deleteDiv) return;
			const rect = ev.target.getBoundingClientRect();
			const mouseX = ev.clientX - rect.left;
			const distanceFromRight = rect.width - mouseX;
			const proximityMargin = 100;

			if (distanceFromRight < proximityMargin) {

				deleteDiv.style.visibility = 'visible';
				deleteDiv.style.opacity = '1';

				updateDiv.style.visibility = 'visible';
				updateDiv.style.opacity = '1';
			} else {
				deleteDiv.style.visibility = 'hidden';
				deleteDiv.style.opacity = '0';
				updateDiv.style.visibility = 'hidden';
				updateDiv.style.opacity = '0';
			}
		}, true);
		modTable.addEventListener("mouseleave", function (ev) {
			const deleteDiv = ev.target.closest("div#modTable_simple").querySelector("i#delete_simple");
			const updateDiv = ev.target.closest("div#modTable_simple").querySelector("i#update_simple");
			deleteDiv.style.visibility = 'hidden';
			deleteDiv.style.opacity = '0';
			updateDiv.style.visibility = 'hidden';
			updateDiv.style.opacity = '0';
		});

		modTable.appendChild(DIV_TOP);
		DIV_TOP.appendChild(update_mod);
		DIV_TOP.appendChild(delete_mod);

		modTable.setAttribute("mod_id", mod_id);
		modTable.setAttribute("game_number", game_number);
		modTable.setAttribute("mod_title", mod_name);
		modTable.setAttribute("mod_fullName", full_name);
		modTable.setAttribute("mod_href", "https://www.nexusmods.com/" + game_number + "/mods/" + mod_id);
		modTable.setAttribute("file_id", file_id);
		if (mod_tempData[mod_id] && mod_tempData[mod_id]["LAST_LOAD_" + file_id] && mod_tempData[mod_id]["LAST_LOAD_" + file_id]["Last_Load_Timestamp"]) {
			//18000
			if ((Math.floor(Date.now() / 1000) - mod_tempData[mod_id]["LAST_LOAD_" + file_id]["Last_Load_Timestamp"]) > 18000 && options['MemoryMode'] == false) {
				console.log("%cTimestamp do Mod " + mod_name + " expirou.", "padding:2px;background: #da8e35;font-weight:bold;color:black")
				await GetFileInfo(mod_id, Number(file_id), gameName, version, size, mod_name, modTable, lineElement, 'simple',game);
			} else {
				await GetFileInfo_ByCache(mod_tempData[mod_id], mod_id, Number(file_id), gameName, version, mod_name, modTable, lineElement, 200, 'simple',game);
			}
		} else {
			await GetFileInfo(mod_id, Number(file_id), gameName, version, size, mod_name, modTable, lineElement, 'simple',game);

		}
	};
	if (Object.keys(AllMods).length > 0) {
		chrome.runtime.sendMessage({
			action: 'SaveMods_Cache',
			modsData: AllMods
		}, function (response) {
			if (chrome.runtime.lastError) {
				console.error("Error sending message:", chrome.runtime.lastError.message);
			} else {
				if (response && response.success) {
					console.log("%c" + response.message, 'background: yellow; color: black;');
					console.log(response.data);
					//window.location.reload();
					AllMods = {};

				} else {
					console.error("Error in response:", response.error);
				}
			}
		});
	}
	GetApi_Data();
	document.querySelector("div#modLoading").style.display = 'none';
}
function timeoutLoop() {
	if (reloadDelay > 0) {
		const differenceInSeconds = Math.floor(Date.now() / 1000) - reloadDelay;
		const secondsIn24Hours = 2 * 60 * 60;
		const remainingSeconds = secondsIn24Hours - differenceInSeconds;
		const remainingSecondsNonNegative = Math.max(remainingSeconds, 0);
		const hours = Math.floor(remainingSecondsNonNegative / 3600);
		const minutes = Math.floor((remainingSecondsNonNegative % 3600) / 60);
		const seconds = remainingSecondsNonNegative % 60;
		const REMAIN_TIME = hours + ":" + minutes + ":" + seconds;

		document.querySelector("div#loadTimeout").innerText = translate_strings.MODS_DELAY_MESSAGE.message + REMAIN_TIME;
		if (hours + minutes + seconds <= 0) {
			reloadDelay = 0;
			document.querySelector("div#loadTimeout").innerText = ""
			chrome.runtime.sendMessage({
				action: 'SaveBox',
				item: 'LAST_MOD_UPDATE_CHECK',
				checado: Math.floor(Date.now() / 1000)
			}, function () {
				window.location.reload();
			})
		}
	}
}

document.querySelector("input#modFilter").addEventListener('input', function (ev) {

	text = ev.target.value;
	clearTimeout(filterDelay);

	filterDelay = setTimeout(function () {
		document.querySelector("div#mod_content").innerHTML = "";
		if (options['SimpleMode'] == true) {
			CreateModTables_SimpleMode(tempMods_permanent, text);
		} else {
			CreateModTables(tempMods_permanent, text);
		}
	}, 200);
})
async function GetFileInfo(modIde, file_id, gameId, version, sizeBytes, title, element, tableElement, mode,game) {
	if (temp_FetchCache[gameId] && temp_FetchCache[gameId][modIde]) {

		DATA = temp_FetchCache[gameId][modIde].response;
		console.log("%cCarregando " + title + " do Cache de FetchCache", "padding:2px;background: #ff2f2f;font-weight:bold;color:black");

	} else {
		const response = await fetch("https://api.nexusmods.com/v1/games/" + game + "/mods/" + modIde + "/files.json", api_headers);
		DATA = await response.json();
		if (!response.ok) {
			console.error("Erro de Conexão: " + response.status);
			if (response.status == 403) {
				alert("Error loading mod " + title + " MOD Doest not exist anymore.");
				chrome.runtime.sendMessage({
					action: 'DeleteMod',
					mod_name: title,
					modId: modIde
				}, function (response) {
					window.location.reload();
				});
				return;
			}
			await GetFileInfo_ByCache(mod_tempData[modIde], modIde, file_id, gameId, version, title, element, tableElement, response.status, mode);
			return;
		}
		if (!temp_FetchCache[gameId]) {
			temp_FetchCache[gameId] = {};
		}
		temp_FetchCache[gameId][modIde] = {
			response: DATA
		};
	}
	const dldUrl = "https://www.nexusmods.com/"+gameId;
	let latestVersion = null;
	let latestFile = null;
	let MOD_STATUS = "outdated";
	mod_tempItems[file_id] = {
		"latestVersion": 0,
		"CHANGELOG": 0,
		"DESCRIPTION": 0,
		"PIC": ""
	}
	DATA.files.forEach(update => {
		if (update.name === title) {
			latestFile = update;
			lastVersion_FileID = latestFile.file_id;
		}
		if ((update.category_name === "MAIN" || update.category_name === "OPTIONAL" || update.category_name === "MISCELLANEOUS" || update.category_name === "UPDATE") && update.name === title) {
			if (!latestVersion || update.version > latestVersion) {
				latestVersion = update.version;
			}
		}
	});

	DATA.files.forEach(update => {
		if (Number(update.file_id) === file_id) {
			size = update.size_in_bytes;
			if (update.category_name === "MAIN" || update.category_name === "OPTIONAL" || update.category_name === "MISCELLANEOUS" || update.category_name === "UPDATE") {
				//console.log(title+" atualizado: " + update.version);
				if (update.description) {
					DESCRIPTION = update.description.replaceAll("\n", "<br>-");
				} else {
					DESCRIPTION = 0;
				}
				if (update.changelog_html) {
					CHANGELOG = update.changelog_html.replaceAll("\n", "<br>-");
				} else {
					CHANGELOG = 0;
				}
				VERSION = update.version;
				MOD_STATUS = "updated";
				if (mode != "simple") {
					element.querySelector("span.ModStatus").innerText = translate_strings.modStatus_updated.message;
					element.querySelector("span.ModStatus").id = 'modUpdated'
					element.querySelector("span#size").innerText = translate_strings.size.message + formatBytes(update.size_in_bytes);
				}
				element.querySelector("span#version").innerText = translate_strings.version.message + VERSION;
				element.classList.add('updated');
				tableElement.appendChild(element);
				line++;
			} else {
				lastVersion_FileID = latestFile.file_id;
				if (latestVersion && update.version < latestVersion) {
					if (latestFile.description) {
						DESCRIPTION = latestFile.description.replaceAll("\n", "<br>-");
					} else {
						DESCRIPTION = 0;
					}
					if (latestFile.changelog_html) {
						CHANGELOG = latestFile.changelog_html.replaceAll("\n", "<br>-");
					} else {
						CHANGELOG = 0;
					}
					VERSION = version;
					MOD_STATUS = "outdated";
					// console.log("Versão mais recente disponível: " + latestVersion + " (" + latestFile.file_name + ")");
					if (mode != "simple") {
						element.querySelector("span.ModStatus").innerText = translate_strings.modStatus_outdated.message;
						element.querySelector("span.ModStatus").id = 'modOutdated'
						element.querySelector("span#size").innerText = translate_strings.size.message + formatBytes(update.size_in_bytes);
						element.querySelector("span#updateMsg").style.visibility = 'visible';
						element.querySelector("i#update").style.display = 'flex';
					} else {
						element.querySelector("i#update_simple").style.display = 'flex';
					}
					element.setAttribute("NEW_FILE_ID", lastVersion_FileID);
					element.setAttribute("NEW_VERSION", latestVersion);
					element.setAttribute("NEW_SIZE", size);
					element.querySelector("span#version").style.color = "white";
					element.querySelector("span#version").innerText = translate_strings.version.message + VERSION;
					element.classList.add('outdated');
					//element.querySelector("span#title").innerText += " (" + translate_strings.new_update.message + ")";
					lineElement_Outdated.prepend(element);
					lineOutdated++;

				} else {
					if (update.description) {
						DESCRIPTION = update.description.replaceAll("\n", "<br>");
					} else {
						DESCRIPTION = 0;
					}
					if (update.changelog_html) {
						CHANGELOG = update.changelog_html.replaceAll("\n", "<br>");
					} else {
						CHANGELOG = 0;
					}
					VERSION = latestVersion;
					if (latestVersion == null) {
						VERSION = version;
						latestVersion = version;
					}
					MOD_STATUS = "old_file";
					//console.log("Versão mais recente disponível: " + latestVersion + " (" + update.file_name + ")");

					if (mode != "simple") {
						element.querySelector("span.ModStatus").innerText = translate_strings.modStatus_error.message;
						element.querySelector("span.ModStatus").id = 'modError'
						element.querySelector("span#size").innerText = translate_strings.size.message + formatBytes(update.size_in_bytes);
					}
					element.querySelector("span#version").style.color = "white";
					element.classList.add('oldFile');
					element.querySelector("span#version").innerText = "v." + latestVersion + translate_strings.not_found.message;
					lineElement_Outdated.prepend(element);
					lineOutdated++;
				}
			}
		}
	});
	mod_tempItems[file_id].latestVersion = latestVersion

	if (DESCRIPTION != null || DESCRIPTION != undefined) {

		mod_tempItems[file_id].DESCRIPTION = DESCRIPTION
	}
	if (CHANGELOG != null || CHANGELOG != undefined) {
		mod_tempItems[file_id].CHANGELOG = CHANGELOG

	} else {

		mod_tempItems[file_id].CHANGELOG = "0"
	}
	if (!AllMods[modIde]) {
		AllMods[modIde] = {};
	}
	const MOD_TEMP_DATA = {
		"Last_Load_Timestamp": Math.floor(Date.now() / 1000),
		"mod_name": title,
		"update_state": MOD_STATUS,
		"size": size,
		'mod_id': modIde,
		"changelog": CHANGELOG,
		"description": DESCRIPTION,
		'lastVersion': latestVersion,
		'last_FileID': lastVersion_FileID
	}
	AllMods[modIde][file_id] = MOD_TEMP_DATA;
	if (mode != "simple") {
		if (!mod_tempData[modIde]) {
			await GetMod_info(file_id, modIde, gameId, element);
			mod_tempItems[file_id].PIC = mod_tempData[modIde].thumbnail;
		} else {
			if (!mod_tempData[modIde].thumbnail) {
				await GetMod_info(file_id, modIde, gameId, element);
			}
			element.querySelector("div.THUMBNAIL").style.background = 'url(' + mod_tempData[modIde].thumbnail + ')';

			if (mod_tempData[modIde].thumbnail == 0) {
				await GetMod_info(file_id, modIde, gameId, element);
			}

			mod_tempItems[file_id].PIC = mod_tempData[modIde].thumbnail;
		}
	}
	element.setAttribute("thumbnail", mod_tempData[modIde].thumbnail);
	element.querySelector("span#title").addEventListener("click", function (ev) {
		window.open(dldUrl + "/mods/" + modIde);
	});
}
async function GetFileInfo_ByCache(cache_item, modIde, file_id, gameId, version, title, element, tableElement, HTTP_STATUS, mode) {
	const dldUrl = "https://www.nexusmods.com/"+gameId;
	const update = cache_item;
	size = update["LAST_LOAD_" + file_id].size || 0;

	DESCRIPTION = update["LAST_LOAD_" + file_id].description;
	CHANGELOG = update["LAST_LOAD_" + file_id].changelog;
	VERSION = update["LAST_LOAD_" + file_id].lastVersion;
	if (!VERSION) {
		VERSION = version;
	}

	mod_tempItems[file_id] = {
		"latestVersion": VERSION,
		"CHANGELOG": CHANGELOG,
		"DESCRIPTION": DESCRIPTION
	}
	if (HTTP_STATUS == '200' || HTTP_STATUS == 200) {
		switch (update["LAST_LOAD_" + file_id]['update_state']) {
			case 'updated':
				element.classList.add('updated');
				element.querySelector("span#version").innerText = translate_strings.version.message + version;

				if (options['MemoryMode'] == true && mode != "simple") {
					element.querySelector("span.ModStatus").remove();

				}
				tableElement.appendChild(element);
				line++;

				break;
			case 'outdated':

				if (options['MemoryMode'] == false) {
					if (mode != "simple") {
						element.querySelector("span.ModStatus").innerText = translate_strings.modStatus_outdated.message;
						element.querySelector("span.ModStatus").id = 'modOutdated'
						element.querySelector("span#updateMsg").style.visibility = 'visible';
						element.querySelector("i#update").style.display = 'flex';
					} else {
						element.querySelector("i#update_simple").style.display = 'flex';
					}
					element.setAttribute("NEW_VERSION", VERSION);
					element.setAttribute("NEW_FILE_ID", update["LAST_LOAD_" + file_id].last_FileID);
					element.setAttribute("NEW_SIZE", size);
					element.querySelector("span#version").style.color = "white";
					element.querySelector("span#version").innerText = translate_strings.version.message + version;
					element.classList.add('outdated');
					lineElement_Outdated.prepend(element);
					lineOutdated++;

				} else {
					if (mode != "simple") {
						element.querySelector("span.ModStatus").remove();
					}
					element.querySelector("span#version").innerText = translate_strings.version.message + version;
					element.classList.add('updated');
					tableElement.appendChild(element);
					line++;
				}
				break;
			case 'old_file':
				if (options['MemoryMode'] == false) {
					if (mode != "simple") {
						element.querySelector("span.ModStatus").innerText = translate_strings.modStatus_error.message;
						element.querySelector("span.ModStatus").id = 'modError';
					}
					element.querySelector("span#version").innerText = "v." + version + translate_strings.not_found.message;
					element.querySelector("span#version").style.color = "white";
					element.classList.add('oldFile');
					lineElement_Outdated.prepend(element);
					lineOutdated++;
				} else {
					if (mode != "simple") {
						element.querySelector("span.ModStatus").remove();
					}
					element.querySelector("span#version").innerText = translate_strings.version.message + version;
					element.classList.add('updated');
					tableElement.appendChild(element);
					line++;
				}
				break;
		}

	} else {
		element.querySelector("span#version").style.color = "white";
		element.classList.add('oldFile');
		element.querySelector("span.ModStatus").innerText = translate_strings.modStatus_error.message;
		element.querySelector("span.ModStatus").id = 'modError';
		element.querySelector("span#version").innerText = "v." + version + translate_strings.not_found.message;
		lineElement_Outdated.prepend(element);
		lineOutdated++;
		if (!AllMods[modIde]) {
			AllMods[modIde] = {};
		}
		const MOD_TEMP_DATA = {
			"Last_Load_Timestamp": Math.floor(Date.now() / 1000),
			"mod_name": title,
			"update_state": 'old_file',
			"size": size,
			'mod_id': modIde,
			"changelog": CHANGELOG,
			"description": DESCRIPTION
		}
		AllMods[modIde][file_id] = MOD_TEMP_DATA;
	}

	if (mode != "simple") {
		element.querySelector("span#size").innerText = translate_strings.size.message + formatBytes(size);
	}
	mod_tempItems[file_id].PIC = update['thumbnail'];

	element.setAttribute("thumbnail", update['thumbnail']);
	element.setAttribute("update_state", update["LAST_LOAD_" + file_id]['update_state']);
	if (mode != "simple") {
		if (update['thumbnail'] != "0") {
			element.querySelector("div.THUMBNAIL").style.background = 'url(' + update['thumbnail'] + ')';
		} else {
			await GetMod_info(file_id, modIde, gameId, element);
		}
	}

	element.querySelector("span#title").addEventListener("click", function (ev) {
		if (ev.target.closest("div#modTable")) {
			if (ev.target.closest("div#modTable").getAttribute("update_state") != "updated") {
				const updateVersion = ev.target.closest("div#modTable").getAttribute("new_file_id");
				window.open(dldUrl + "/mods/" + modIde + "/?tab=files&NAdvance_ScrollToFile=" + updateVersion)
			} else {
				window.open(dldUrl + "/mods/" + modIde);
			}
		} else {
			if (ev.target.closest("div#modTable_simple").getAttribute("update_state") != "updated") {
				const updateVersion = ev.target.closest("div#modTable_simple").getAttribute("new_file_id");
				window.open(dldUrl + "/mods/" + modIde + "/?tab=files&NAdvance_ScrollToFile=" + updateVersion)
			} else {
				window.open(dldUrl + "/mods/" + modIde);
			}
		}
	});
	updated = 0;
}
function bbcodeToHtml(bbcode) {
	if (!bbcode) {
		return bbcode;
	}

	// Substitui [img]...[/img] por <img src="...">
	bbcode = bbcode.replace(/\[img\](.*?)\[\/img\]/g, '<img src="$1" draggable="false">');

	// Substitui [url=...]...[/url] por <a href="...">...</a>
	bbcode = bbcode.replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="blank_" title="$1">$2</a>');

	// Substitui [center]...[/center] por <center>...</center>
	bbcode = bbcode.replace(/\[center\](.*?)\[\/center\]/g, '<center>$1</center>');

	// Substitui [b]...[/b] por <b>...</b>
	bbcode = bbcode.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');

	// Substitui [i]...[/i] por <i>...</i>
	bbcode = bbcode.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');

	// Substitui [color=#33cc00]...[/color] por <span style="color:#33cc00">...</span>
	bbcode = bbcode.replace(/\[color=(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\](.*?)\[\/color\]/g, '<span style="color:$1">$2</span>');

	// Substitui URLs simples que não estão dentro de tags BBCode por <a href="...">...</a>
	bbcode = bbcode.replace(/(^|[^\"\]]|\s)(https?:\/\/[^\s<]+)(\s|$)/g, '$1<a href="$2" target="blank_" title="$2">$2</a>$3');

	bbcode = bbcode.replace(/\[font=(.*?)\](.*?)\[\/font\]/g, '<span style="font-family:$1">$2</span>');

	// Remove [size=...]...[/size] mantendo apenas o conteúdo
	bbcode = bbcode.replace(/\[size=(.*?)\](.*?)\[\/size\]/g, '$2');

	return bbcode;
}

async function GetMod_info(fileId, modId, game_number, element) {
	const response = await fetch("https://api.nexusmods.com/v1/games/" + game_number + "/mods/" + modId + ".json", api_headers);
	const DATA = await response.json();
	if (DATA.picture_url) {
		var parts = DATA.picture_url.split('/images/');
		var newUrl = parts[0] + '/images/thumbnails/' + parts[1];
	} else {
		newUrl = "https://www.nexusmods.com/assets/images/default/noimage.svg";
	}
	mod_tempData[modId] = {
		"thumbnail": newUrl
	};

	mod_tempItems[fileId].PIC = DATA.picture_url;
	element.setAttribute("thumbnail", mod_tempData[modId].thumbnail);
	element.querySelector("div.THUMBNAIL").style.background = 'url(' + mod_tempData[modId].thumbnail + ")";
	chrome.runtime.sendMessage({
		action: 'SaveMods_Thumbnails',
		modId: modId,
		fileId: fileId,
		item: newUrl
	}, function (response) {
		if (chrome.runtime.lastError) {
			console.error("Error sending message:", chrome.runtime.lastError.message);
		} else {
			if (response && response.success) {
				console.log("Thumbnail do Mod " + modId + " salvo.");
			} else {
				console.error("Error in response:", response.error);
			}
		}
	});
}

async function GET_GAMES() {
	if (!NEXUS_API || NEXUS_API == "0" || NEXUS_API == 0) {
		console.log("Error Starting ModLoader: API Required!")
		return;
	}
	await LoadMods();
}

async function LoadMods() {
	chrome.runtime.sendMessage({
		action: 'LoadMods'
	},async function (responseData) {
		if (chrome.runtime.lastError) {
			console.error("Error sending message:", chrome.runtime.lastError.message);
		} else {
			if (responseData && responseData.success) {
				if (Object.keys(responseData.data).length > 0) {
					document.querySelector("div#mod_content").innerHTML = "";
					document.querySelector("div#modSettings").style.display = 'block';
				} else {
					document.querySelector("div#modSettings").style.display = 'none';
					document.querySelector("div#loadTimeout").style.display = 'none';
					document.querySelector("div#modLoading").style.display = 'none';
				}
				chrome.runtime.sendMessage({
					action: 'LoadMods_Thumbnails'
				}, async function (response) {
					if (chrome.runtime.lastError) {
						console.error("Error sending message:", chrome.runtime.lastError.message);
					} else {
						if (response.success) {
							if (Object.keys(response.data).length > 0) {
								mod_tempData = response.data;
								if (options['SimpleMode'] == true) {
									await CreateModTables_SimpleMode(responseData.data, "");
								} else {
									await CreateModTables(responseData.data, "");
								}
							} else {
								document.querySelector("div#loadTimeout").style.display = 'none';
							}

						} else {
							if (options['SimpleMode'] == true) {
								await CreateModTables_SimpleMode(responseData, "");

							} else {
								await CreateModTables(responseData.data, "");
							}
							console.error("Error in response:", response.error);
						}
						console.warn(options)
		reloadDelay = options.LAST_MOD_UPDATE_CHECK;
		if(reloadDelay==0){
			reloadDelay=Math.floor(Date.now() / 1000);
			chrome.runtime.sendMessage({
				action: 'SaveBox',
				item: 'LAST_MOD_UPDATE_CHECK',
				checado: Math.floor(Date.now() / 1000)
			}, function () {
				window.location.reload();
			})
		}
		setInterval(timeoutLoop, 1000);
	
					}
				});
			} else {
				console.error("Error in response:", responseData.error);
			}
		}
	});
}
