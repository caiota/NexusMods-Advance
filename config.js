"use strict"

document.querySelector('textarea#HiddenContentArea').addEventListener('change', function (item) {

	chrome.runtime.sendMessage({
		action: 'Save_WordList',
		itens: item.target.value.split("\n")
	}, function (response) {
		if (response && response.success) {
			console.log(response)
		}
	});

});
document.querySelectorAll("fieldset[hasPopupTip]").forEach(function (fieldset) {
	fieldset.querySelector("legend").addEventListener("mouseover", function (ev) {
		ev.target.closest("fieldset").querySelector("div#msgPopup").style.display = 'block';
	})

	fieldset.querySelector("legend").addEventListener("mouseout", function (ev) {
		ev.target.closest("fieldset").querySelector("div#msgPopup").style.display = 'none';
	})

});

document.querySelectorAll("input[type='checkbox']").forEach(function (box) {
	box.addEventListener("click", function (ev) {
		saveCheckbox(ev.target.id, ev.target.checked);

		if (ev.target.closest('label').getAttribute("needRestart") == "true") {
			window.location.reload();
		}
	});
	
});

document.querySelectorAll("label").forEach(function (box) {

	if(box.querySelector("div#msgPopup")){
	box.addEventListener("mouseover", function (ev) {
		ev.currentTarget.querySelector("div#msgPopup").style.display = 'block';
	})

	box.addEventListener("mouseout", function (ev) {
		ev.currentTarget.querySelector("div#msgPopup").style.display = 'none';
	})
}	
});

document.querySelector("div#overflow").addEventListener("click", function () {
	document.querySelector("div#overflow").style.display = 'none';
	document.querySelector("div#CDN_speed_PopUp").style.display = 'none';
	document.querySelector("div#PremiumDownload").style.display = 'none';
	document.querySelector("div#PremiumDownload div#Links").innerHTML = "";
	document.querySelector("div#modViewDiv").style.display = 'none';

})

document.querySelector("div#loadTimeout").addEventListener("mouseover", function (ev) {

	document.querySelector("div#timeoutPanel div.message span#dailyUsage").innerText = RestanteDiario + translate_strings.MODS_DELAY_USAGE.message;
	document.querySelector("div#timeoutPanel div.message span#hourUsage").innerText = RestanteHorario + translate_strings.MODS_DELAY_USAGE.description;
	ev.target.closest("div#timeoutPanel").querySelector("div.message").style.display = 'block';
});

document.querySelector("div#loadTimeout").addEventListener("mouseout", function (ev) {
	ev.target.closest("div#timeoutPanel").querySelector("div.message").style.display = 'none';
});

document.querySelector("i#fa-sun").addEventListener("click", function () {
	const selectElement = document.querySelector("select#themeSelector");
	const currentIndex = selectElement.selectedIndex;
	const nextIndex = (currentIndex + 1) % selectElement.options.length; // Calcula o próximo índice, voltando ao primeiro se estiver no último
	selectElement.selectedIndex = nextIndex; // Atualiza o índice selecionado para o próximo item
	saveCheckbox('themeSelector', selectElement.options[nextIndex].value)
	loadTheme(selectElement.options[nextIndex].value);
});
document.querySelector("i#fa-reload").addEventListener("click", function () {
	window.location.reload();
});
document.querySelector("i#nexusMods_Post").addEventListener("click", function () {
	document.querySelector("div#moreOptions").classList.toggle("open")
});

document.querySelector("div#viewDescription").addEventListener('click', function () {
	document.querySelector("div#Changelog").style.display = 'block';
	document.querySelector("div#Bugs").style.display = 'none';
	document.querySelector("div#Posts").style.display = 'none';
	document.querySelector("div#Logs").style.display = 'none';
	document.querySelector("img#LoadingDecoil").style.display = 'none';
	previewPage = "Description";
})
var previewPage = "Description";
var stillLoading = false;
let maxPages1 = 1;
document.querySelector("div#viewPosts").addEventListener('click', async function (ev) {
	maxPages1 = 1;
	actualPage = 1;
	document.querySelector("div#Changelog").style.display = 'none';
	document.querySelector("div#Posts").style.display = 'block';
	document.querySelector("div#Logs").style.display = 'none';
	document.querySelector("div#Bugs").style.display = 'none';
	document.querySelector("div#Posts").innerHTML = '';
	document.querySelector("img#LoadingDecoil").style.display = 'block';
	const mod_id = ev.target.closest('div#modViewDiv').getAttribute('mod_id');
	console.log(ev.target.closest("div#modViewDiv"))
	const game_id = ev.target.closest('div#modViewDiv').getAttribute('game');
	const game_number=ev.target.closest('div#modViewDiv').getAttribute('game_id');
	console.error(game_id)
	const response = await fetch("https://www.nexusmods.com/" + game_id + "/mods/" + mod_id, {
		"headers": {
			"accept": "text/html, */*; q=0.01",
			"accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"priority": "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://www.nexusmods.com/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});

	previewPage = "Posts";

	if (!response.ok) {
		document.querySelector("div#Posts").innerHTML = "<h2>NexusMods Error (" + response.status + ")</h2>";
		stillLoading = false;
		return;
	}

	const htmlContent = await response.text();

	// Parseia o HTML string para um objeto Document
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, 'text/html');
	const params = new URLSearchParams(doc.querySelector("ul.modtabs li#mod-page-tab-posts a").getAttribute('data-target').split('?')[1]);
	const threadId = params.get('thread_id');
	if (threadId) {
		window.thread = threadId;
		window.mod_id = mod_id;
		window.game_id = game_number;
		chrome.runtime.sendMessage({
			action: 'UnlockYoutube'
		});
		await ProcessPosts(threadId, mod_id, game_number, 1);
	} else {
		stillLoading = false;
		document.querySelector("div#Posts").innerHTML = translate_strings.bugsPage.message;
	}

	document.querySelector("img#LoadingDecoil").style.display = 'none';
})

document.querySelector("div#viewLogs").addEventListener('click', async function (ev) {
	document.querySelector("div#Changelog").style.display = 'none';
	document.querySelector("div#Bugs").style.display = 'none';
	document.querySelector("div#Posts").style.display = 'none';
	document.querySelector("div#Logs").style.display = 'block';
	document.querySelector("div#Logs").innerHTML = '';
	document.querySelector("img#LoadingDecoil").style.display = 'block';
	const mod_id = ev.target.closest('div#modViewDiv').getAttribute('mod_id');
	const game_id = ev.target.closest('div#modViewDiv').getAttribute('game_id');
	const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModActionLogTab?id=" + mod_id + "&game_id=" + game_id, {
		"headers": {
			"accept": "text/html, */*; q=0.01",
			"accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"priority": "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://www.nexusmods.com/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});

	if (!response.ok) {
		document.querySelector("div#Logs").innerHTML = "<h2>NexusMods Error (" + response.status + ")</h2>";
		stillLoading = false;
		return;
	}
	// Transforma a resposta em texto HTML
	const htmlContent = await response.text();

	// Parseia o HTML string para um objeto Document
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, 'text/html');
	if (doc.body.querySelectorAll('dl.accordion dd.act-log-container div.log-block ul li').length > 0) {

		previewPage = "Logs";
		const ulElement = doc.body.querySelectorAll('dl.accordion dd.act-log-container div.log-block ul');

		if (ulElement) {
			// Itera sobre os elementos <li> e insere um <hr> após cada um, exceto o último
			ulElement.forEach(function (ulIterate) {

				const liElements = ulIterate.querySelectorAll('li');
				liElements.forEach((li, index) => {
					if (index < liElements.length - 1) {
						const hr = document.createElement('hr');
						li.after(hr);
					}
				});
				doc.body.querySelectorAll('img').forEach(function (img) {
					img.src = img.src.replace('/thumbnails', '');
					img.style.width = '100%';
					img.style.maxWidth = '100%';
					img.style.maxHeight = '100%';
				})
			})
		}

		document.querySelector("img#LoadingDecoil").style.display = 'none';
		document.querySelector("div#Logs").innerHTML = doc.body.querySelector('dl.accordion dd.act-log-container div.log-block').innerHTML;
	}
})

async function ProcessPosts(thread, mod_id, game_id, page) {
	if (actualPage > maxPages1) {
		maxPages1 = 1;
		actualPage = 1;
		stillLoading = false;
		document.querySelector("img#LoadingDecoil").style.display = 'none';
		return;
	}
	const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/CommentContainer?RH_CommentContainer=search_text:,tabbed=1,object_id=" + mod_id + ",game_id=" + game_id + ",object_type=1,thread_id=" + thread + ",skip_opening_post=0,user_is_blocked=,searchable=false,page_size:10,page:" + page, {
		"headers": {
			"accept": "text/html, */*; q=0.01",
			"accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"priority": "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://www.nexusmods.com/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});

	previewPage = "Posts";

	if (!response.ok) {
		document.querySelector("div#Posts").innerHTML = "<h2>NexusMods Error (" + response.status + ")</h2>";
		stillLoading = false;
		return;
	}

	const htmlContent = await response.text();

	// Parseia o HTML string para um objeto Document
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, 'text/html');

	doc.querySelector("ol").querySelectorAll('div.comment-actions').forEach((e) => { if (e) { e.remove(); } });
	doc.querySelector("ol").querySelectorAll('a').forEach((e) => { if (e) { e.setAttribute('target', '_blank'); } });
	doc.querySelector("ol").querySelectorAll('iframe').forEach((e) => { if (e) { e.setAttribute("allowfullscreen", true); } });
	doc.querySelector("ol").querySelectorAll('img.emoticon').forEach((e) => { if (e) { e.src = 'https://www.nexusmods.com' + e.getAttribute("src"); } });
	if (doc.querySelector('ol') && doc.querySelector('ol').childElementCount > 0) {
		if (page == 1) {
			function isNumberElement(element) {
				return element.tagName === 'LI' && !isNaN(parseInt(element.innerText.trim(), 10));
			}

			// Primeira paginação
			const firstPageSelect = doc.body.querySelector("div.pagination ul.clearfix");
			if (firstPageSelect) {
				const part_1_document = firstPageSelect.closest("div.pagination");
				let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;

				while (part_1_pages && !isNumberElement(part_1_pages)) {
					part_1_pages = part_1_pages.previousElementSibling;
				}

				maxPages1 = part_1_pages ? parseInt(part_1_pages.innerText.trim(), 10) : 1;
				console.log("Primeira Paginação: " + maxPages1);
			}

			document.querySelector("div#Posts").innerHTML = doc.querySelector("ol").innerHTML;
		} else {

			doc.querySelector("ol").querySelectorAll('li.comment-sticky').forEach((e) => { if (e) { e.remove() } });
			document.querySelector("div#Posts").innerHTML += doc.querySelector("ol").innerHTML;
		}
		stillLoading = false;
	} else {

		document.querySelector("div#Posts").innerHTML = translate_strings.bugsPage.message;
		stillLoading = false;
	}

}

document.querySelector("div#viewBugs").addEventListener('click', async function (ev) {
	maxPages1 = 1;
	actualPage = 1;
	document.querySelector("div#Changelog").style.display = 'none';
	document.querySelector("div#Posts").style.display = 'none';
	document.querySelector("div#Logs").style.display = 'none';
	document.querySelector("div#Bugs").style.display = 'block';
	document.querySelector("div#Bugs").innerHTML = '';
	document.querySelector("img#LoadingDecoil").style.display = 'block';
	const mod_id = ev.target.closest('div#modViewDiv').getAttribute('mod_id');
	const game_id = ev.target.closest('div#modViewDiv').getAttribute('game_id');
	const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModBugsTab?id=" + mod_id + "&game_id=" + game_id, {
		"headers": {
			"accept": "text/html, */*; q=0.01",
			"accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"priority": "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://www.nexusmods.com/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});

	previewPage = "Bugs";

	if (!response.ok) {
		document.querySelector("div#Bugs").innerHTML = "<h2>NexusMods Error (" + response.status + ")</h2>";
		stillLoading = false;
		return;
	}

	const htmlContent = await response.text();

	// Parseia o HTML string para um objeto Document
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, 'text/html');
	if (doc.querySelector('table.forum-bugs') && doc.querySelector('table.forum-bugs').childElementCount > 0) {

		doc.querySelector("table.forum-bugs").querySelectorAll('span.table-inline-hidden').forEach((e) => { if (e) { e.remove() } });
		doc.querySelector("table.forum-bugs").querySelectorAll('td.table-bug-priority').forEach((e) => { if (e) { e.remove() } });
		doc.querySelector("table.forum-bugs").querySelectorAll('span[id^="issueFixedInVersion"]').forEach((e) => { if (e) { e.style.color = '#44f244'; e.style.display = 'block' } });
		doc.querySelector("table.forum-bugs").querySelectorAll('a').forEach((e) => { if (e) { e.setAttribute('target', '_blank') } });
		doc.querySelector("table.forum-bugs th.table-bug-priority").remove();

		function isNumberElement(element) {
			return element.tagName === 'LI' && !isNaN(parseInt(element.innerText.trim(), 10));
		}

		// Primeira paginação
		const firstPageSelect = doc.body.querySelector("div.pagination ul.clearfix");
		if (firstPageSelect) {
			const part_1_document = firstPageSelect.closest("div.pagination");
			let part_1_pages = part_1_document.querySelector('ul.clearfix').lastElementChild;

			while (part_1_pages && !isNumberElement(part_1_pages)) {
				part_1_pages = part_1_pages.previousElementSibling;
			}

			maxPages1 = part_1_pages ? parseInt(part_1_pages.innerText.trim(), 10) : 1;
			console.log("Primeira Paginação: " + maxPages1);
		}

		document.querySelector("div#Bugs").innerHTML = doc.querySelector("table.forum-bugs").outerHTML;

		document.querySelectorAll("table.forum-bugs tbody tr[data-issue-id]:not([replyElement])").forEach((row, index) => {
			const replyDivtr = document.createElement('tr');
			const replyDivtd = document.createElement('td');
			const replyDiv = document.createElement('div');
			replyDivtd.classList = row.id;
			replyDivtr.id = 'tr_Reply';
			replyDivtd.setAttribute('colspan', '100%');
			replyDivtr.appendChild(replyDivtd);
			replyDivtd.appendChild(replyDiv);
			row.parentNode.insertBefore(replyDivtr, row.nextSibling);
			row.setAttribute("replyElement", true);
		});
		document.querySelector("div#Bugs").querySelectorAll('a.issue-title:not([eventAdded])').forEach((e) => { if (e) { e.setAttribute("eventAdded", true); e.removeAttribute('onclick'); e.removeAttribute('href'); e.addEventListener('click', async function (ev) { await loadIssueReplies(ev) }); } });
		stillLoading = false;
	} else {

		document.querySelector("div#Bugs").innerHTML = translate_strings.bugsPage.message;
		stillLoading = false;
	}

	document.querySelector("img#LoadingDecoil").style.display = 'none';
})

async function FetchAndAdd(mod_id, game_id, page) {
	if (actualPage > maxPages1) {
		maxPages1 = 1;
		actualPage = 1;
		stillLoading = false;

		document.querySelector("img#LoadingDecoil").style.display = 'none';
		return;
	}
	const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModBugsTab?RH_ModBugsTab=issue_id:,id=" + mod_id + ",game_id=" + game_id + ",priority:-1,status:-1,sort_by:date,order:DESC,page_size:10,page:" + page, {
		"headers": {
			"accept": "text/html, */*; q=0.01",
			"accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"priority": "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://www.nexusmods.com/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});

	previewPage = "Bugs";
	// Transforma a resposta em texto HTML
	if (!response.ok) {
		stillLoading = false;
		return;
	}
	const htmlContent = await response.text();
	// Parseia o HTML string para um objeto Document
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, 'text/html');
	if (doc.querySelector('table.forum-bugs')) {
		doc.querySelector("table.forum-bugs").querySelectorAll('span.table-inline-hidden').forEach((e) => { if (e) { e.remove() } });
		doc.querySelector("table.forum-bugs").querySelectorAll('td.table-bug-priority').forEach((e) => { if (e) { e.remove() } });
		doc.querySelector("table.forum-bugs").querySelectorAll('span[id^="issueFixedInVersion"]').forEach((e) => { if (e) { e.style.color = '#44f244'; e.style.display = 'block' } });

		doc.querySelector("table.forum-bugs th.table-bug-priority").remove();
		doc.querySelectorAll("table.forum-bugs tbody tr").forEach(function (data) {
			document.querySelector("div#Bugs table.forum-bugs tbody").appendChild(data);
		});
		stillLoading = false;
		document.querySelectorAll("table.forum-bugs tbody tr[data-issue-id]:not([replyElement])").forEach((row, index) => {
			const replyDivtr = document.createElement('tr');
			const replyDivtd = document.createElement('td');
			const replyDiv = document.createElement('div');
			replyDivtd.classList = row.id;
			replyDivtr.id = 'tr_Reply';
			replyDivtd.setAttribute('colspan', '100%');
			replyDivtr.appendChild(replyDivtd);
			replyDivtd.appendChild(replyDiv);
			row.parentNode.insertBefore(replyDivtr, row.nextSibling);
			row.setAttribute("replyElement", true);
		});
		document.querySelector("div#Bugs").querySelectorAll('a.issue-title:not([eventAdded])').forEach((e) => { if (e) { e.setAttribute("eventAdded", true); e.removeAttribute('onclick'); e.removeAttribute('href'); e.addEventListener('click', async function (ev) { await loadIssueReplies(ev) }); } });
		document.querySelector("img#LoadingDecoil").style.display = 'none';
	}
	if (actualPage == maxPages1) {
		maxPages1 = 1;
		actualPage = 1;
	}
}

document.querySelector("img#nexusIcon").addEventListener('click', function () { window.open('https://www.nexusmods.com/site/mods/1018'); })
document.querySelector("div#moreOptions span#more_OfficialPost").addEventListener('click', function () { window.open('https://www.nexusmods.com/site/mods/1018'); })

function WheelListener(ev) {
	const modFilter = document.querySelector('#modFilter');
	const settingsButton = document.querySelector('.modSettingsBtn');
	const rect = settingsButton.getBoundingClientRect();
	if (rect.bottom < 0) {
		modFilter.classList.add("modFilterFixed");
	} else {
		modFilter.classList.remove("modFilterFixed");
	}

}
var actualPage = 1;
document.querySelector("div#modViewDiv").addEventListener("wheel", async function (ev) {
	let modViewDiv = document.querySelector("div#modViewDiv");
	let scrollTop = modViewDiv.scrollTop;
	let scrollHeight = modViewDiv.scrollHeight;
	let clientHeight = modViewDiv.clientHeight;
	if (scrollTop + clientHeight >= scrollHeight - 500) {
		if (modViewDiv.style.display != 'none' && stillLoading == false) {
			stillLoading = true;
			actualPage++;
			if (actualPage > maxPages1) {
				maxPages1 = 1;
				actualPage = 1;
				stillLoading = false;
				document.querySelector("img#LoadingDecoil").style.display = 'none';
				return;
			}
			if (previewPage == 'Bugs') {
				document.querySelector("img#LoadingDecoil").style.display = 'block';
				await FetchAndAdd(modViewDiv.getAttribute('mod_id'), modViewDiv.getAttribute('game_id'), actualPage);
			}
			if (previewPage == 'Posts') {
				document.querySelector("img#LoadingDecoil").style.display = 'block';
				await ProcessPosts(window.thread, modViewDiv.getAttribute('mod_id'), modViewDiv.getAttribute('game_id'), actualPage);
			}
		}
	}
});
async function loadIssueReplies(ev) {
	const issue_id = ev.target.id.replace('issueClickLink_', '');
	if (document.querySelector("td.issue_" + issue_id).parentElement.getAttribute("open")) {
		document.querySelector("td.issue_" + issue_id + " div").innerHTML = "";
		document.querySelector("td.issue_" + issue_id).parentElement.classList = '';
		document.querySelector("td.issue_" + issue_id).parentElement.removeAttribute("open");

		return;
	}
	const response = await fetch("https://www.nexusmods.com/Core/Libs/Common/Widgets/ModBugReplyList", {
		"headers": {
			"accept": "*/*",
			"accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			"priority": "u=1, i",
			"sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "none",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://www.nexusmods.com/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": "issue_id=" + issue_id,
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});

	previewPage = "Bugs";
	// Transforma a resposta em texto HTML
	if (!response.ok) {
		stillLoading = false;
		return;
	}
	const htmlContent = await response.text();
	// Parseia o HTML string para um objeto Document
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlContent, 'text/html');

	doc.querySelectorAll('div.comment-actions').forEach((e) => { if (e) { e.remove() } });

	doc.querySelectorAll('a').forEach((e) => { if (e) { e.setAttribute('target', '_blank') } });
	if (!document.querySelector("td.issue_" + issue_id).parentElement.getAttribute("open")) {
		document.querySelector("td.issue_" + issue_id + " div").innerHTML = doc.body.innerHTML;
		document.querySelector("td.issue_" + issue_id).parentElement.setAttribute("open", true);
		document.querySelector("td.issue_" + issue_id).parentElement.classList = 'show';

		return;
	}
}
document.addEventListener("keydown", function (k) {
	if ((k.key == "Escape" || k.key == "Enter") && document.querySelector("div#modViewDiv").style.display != 'none') {
		k.preventDefault();
		document.querySelector("div#modViewDiv").style.display = 'none';
		document.querySelector("div#overflow").style.display = 'none';

		document.querySelector("div#Changelog").innerHTML = "";
		document.querySelector("div#Posts").innerHTML = "";
		document.querySelector("div#Logs").innerHTML = "";
		document.querySelector("div#Bugs").innerHTML = "";
	}
	if (/^[a-zA-Z]$/.test(k.key)) {
		document.querySelector("input#modFilter").focus();
		document.querySelector("input#modFilter").click();
	}

	// Verifica se é um número
	if (/^\d$/.test(k.key)) {
		document.querySelector("input#modFilter").focus();
		document.querySelector("input#modFilter").click();
	}
});
window.addEventListener("load", function () {
	if (window.location.href.indexOf("?popup=true") == -1) {
		chrome.runtime.sendMessage({
			action: 'PopupConfig',
			type: 'normal'
		}, function (response) {
			if (response && response.success) {
				window.close();
			}
		});

	}

	if (!document.querySelector("link#fontAwesome")) {
		let faLink = document.createElement('link');
		faLink.rel = 'stylesheet';
		faLink.id = 'fontAwesome'
		faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';

		faLink.onload = function () {
			chrome.runtime.sendMessage({
				action: 'LoadBox'
			}, async function (response) {
				if (chrome.runtime.lastError) {
					console.error("Error sending message:", chrome.runtime.lastError.message);
				} else {
					if (response && response.success) {
						chrome.runtime.sendMessage({
							action: 'Load_NEXUSAPI'
						}, async function (response3) {
							NEXUS_API = response3.data;
							api_headers = {
								method: 'GET',
								headers: {
									'accept': 'application/json',
									'apikey': NEXUS_API
								}
							}

							options = response.data;
							if (window.location.href.indexOf("tab=myMods") != -1) {
								document.addEventListener("scroll", WheelListener);
								document.querySelector("div.mods").click();
							}
							if (window.location.href.indexOf("run=CdnTest") != -1) {
								document.querySelector("div#overflow").style.display = 'block';
								document.querySelector("div#CDN_speed_PopUp").style.display = 'block';
							}
							await ReloadOptions(options);
							await LOAD_HIDDEN_MODS();
							await GetApi_Data();
							if (options['Endorsed'] == false) {
								chrome.runtime.sendMessage({
									action: 'ShowEndorsePopup'
								}, async function (response3) {
									if (response3.message == true && response3.success)
										document.querySelector("div#PleaseEndorse").style.display = 'block';
								});
							}
						});

					} else {
						console.error("Error in response:", response.error);
					}
				}
			});
		}

		document.head.appendChild(faLink);
	}
})

document.querySelector("select#TrackingMods_RenderBy").addEventListener("change", async function (ev) {

	await saveCheckbox(ev.target.id, ev.target.value);
	window.location.reload();

});

document.querySelector("select#language").addEventListener("change", async function (ev) {

	await saveCheckbox(ev.target.id, ev.target.value);
	window.location.reload();

});
document.querySelector("input#BlockSize_input").addEventListener("change", async function (ev) {
	if (ev.target.value.trim() == "") {
		ev.target.value = "20%";
	}
	await saveCheckbox(ev.target.id, ev.target.value);

});

document.querySelector("div#PleaseEndorse div#closeMe").addEventListener("click", function (ev) {
	chrome.runtime.sendMessage({
		action: 'SaveBox',
		item: 'Endorsed',
		checado: true
	});

	ev.currentTarget.closest("div#PleaseEndorse").style.display = 'none';
});

document.querySelector("div.modSettingsBtn").addEventListener("click", function (ev) {
	if (document.querySelector("div#modSettings_inputs").style.display != 'block') {
		ev.target.id = "selected";
		document.querySelector("div#modSettings_inputs").style.display = 'block';
	} else {
		document.querySelector("div#modSettings_inputs").style.display = 'none';
		ev.target.id = "tabItens";
	}

});
document.querySelector("div.settings").addEventListener("click", function (ev) {
	document.removeEventListener("scroll", WheelListener);
	updateURLParameter('tab', 'settings');
	document.querySelector("div#mods").style.display = 'none';
	document.querySelector("div.mods").id = '';
	document.querySelector("div#settings").style.display = 'block';
	document.querySelector("div.settings").id = 'selected';
});
document.querySelector("div.mods").addEventListener("click", function (ev) {
	document.addEventListener("scroll", WheelListener);
	updateURLParameter('tab', 'myMods');
	//document.querySelector("div#modLoading").style.display = 'flex';
	document.querySelector("div#mods").style.display = 'block';
	document.querySelector("div.settings").id = '';
	document.querySelector("div#settings").style.display = 'none';
	document.querySelector("div.mods").id = 'selected';
	document.querySelector("input#modFilter").value = '';
	document.querySelector("input#modFilter").focus();
	document.querySelector("input#modFilter").click();
	//setTimeout(function(){loadMessages(options['language']);},100)
	if (NEXUS_API == "0" || !NEXUS_API) {
		document.querySelector("div#notLogged").style.display = 'block';
	} else {
		//document.querySelector("div#modSettings").style.display = 'none';
		document.querySelector("div#modContent").style.display = 'block';
		if (!NEXUS_API || NEXUS_API == "0" || NEXUS_API == 0) {
		console.log("Error Starting ModLoader: API Required!")
		return;
	}
	}
});
async function loadTheme(theme) {
	if (!document.querySelector("link#theme")) {
		link = document.createElement('link');
		link.rel = 'stylesheet';
		link.id = 'theme';
		document.head.appendChild(link);
	}
	switch (theme) {
		case 'light_1':
			link.href = 'themes/light_1.css';
			break;
		case 'dark_1':
			link.href = 'themes/dark_1.css';
			break;
		case 'mod_organizer':
			link.href = 'themes/MO2.css';
			break;
	}

}
async function GetApi_Data() {
	if (NEXUS_API != "0" && NEXUS_API) {
		const response = await fetch("https://api.nexusmods.com/v1/users/validate.json", api_headers);
		const dailyRemaining = response.headers.get('x-rl-daily-remaining');
		const hourlyLimit = response.headers.get('x-rl-hourly-remaining');
		RestanteDiario = dailyRemaining;
		RestanteHorario = hourlyLimit;
		const DATA = await response.json();
		if (!response.ok && response.status == 401 && DATA.message == "Please provide a valid API Key") {
			chrome.runtime.sendMessage({
				action: 'SaveBox',
				item: 'NEXUS_API',
				checado: 0
			}, function () {
				window.location.reload();
			})
		}
		document.querySelector("img#profileImg").src = DATA.profile_url;
		document.querySelector("span#userName").innerText = DATA.name;
		if (DATA.is_premium == true) {
			is_premium = true;
			document.querySelector("span#userName").classList.add("Premium");
		} else {
			is_premium = false;
		}
		document.querySelector("div#profile").style.display = 'block';
		document.querySelector("div#timeoutPanel div.message span#dailyUsage").innerText = RestanteDiario + translate_strings.MODS_DELAY_USAGE.message;
		document.querySelector("div#timeoutPanel div.message span#hourUsage").innerText = RestanteHorario + translate_strings.MODS_DELAY_USAGE.description;
	} else {
		document.querySelector("div#profile").style.display = 'none';
	}
}

document.querySelector("i#test_CDNSpeed").addEventListener("click", function () {
	document.querySelector("div#overflow").style.display = 'block';
	document.querySelector("div#CDN_speed_PopUp").style.display = 'block';
});
document.querySelector("div#CDN_speed_PopUp div#Start_Test").addEventListener("click", function () {
	document.querySelector("div#Start_Test").style.display = 'none';
	CDN_SPEEDTEST();
});

async function CDN_SPEEDTEST() {
	for (const server of CDN_testServers) {
		console.log(`Testing server: ${server.name}`);
		const field = document.createElement("fieldset");
		const cdnLegend = document.createElement("legend");
		cdnLegend.innerText = server.name;
		field.appendChild(cdnLegend);
		//barra de progresso em procentagem
		const dld_barDiv = document.createElement("div");
		dld_barDiv.classList = "progress-container";
		const progressBar = document.createElement("div");
		progressBar.classList = "progress-bar";
		dld_barDiv.appendChild(progressBar);
		//textos de resultado
		const dldSpeed = document.createElement("div")
		dldSpeed.id = server.name;
		dldSpeed.classList = 'cdn_dldSpeed';
		const dldTime = document.createElement("div");
		dldSpeed.innerText = ""
		dldTime.id = server.name;
		dldTime.classList = 'cdn_dldTime';

		field.appendChild(dld_barDiv)
		field.appendChild(dldSpeed)
		field.appendChild(dldTime)
		document.querySelector("div#cdn_results").appendChild(field);
		const result = await measureDownloadSpeed(server.url, progressBar);
		if (result) {
			document.querySelector("div.cdn_dldSpeed[id='" + server.name + "']").innerText = translate_strings.cdnTest_responseSpeed.message + result.speedMbps.toFixed(2) + " Mbps";
			document.querySelector("div.cdn_dldTime[id='" + server.name + "']").innerText = convertSeconds(result.durationInSeconds);
			console.log(`Server: ${server.name}, Speed: ${result.speedMbps.toFixed(2)} Mbps, Duration: ${result.durationInSeconds.toFixed(2)} s`);
		}
	}
}

async function measureDownloadSpeed(url, progressElement) {
	const startTime = performance.now();

	try {
		const response = await fetch(url);
		const reader = response.body.getReader();
		let receivedLength = 0;
		const contentLength = +response.headers.get('Content-Length');

		// Recebe os dados em blocos
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			receivedLength += value.length;

			// Calcula a porcentagem do progresso
			const percentage = (receivedLength / contentLength) * 100;

			// Atualiza a barra de progresso
			progressElement.style.width = percentage.toFixed(2) + '%';
			progressElement.textContent = percentage.toFixed(2) + '%';
		}

		const endTime = performance.now();
		const durationInSeconds = (endTime - startTime) / 1000;
		const speedMbps = (receivedLength * 8) / (durationInSeconds * 1000 * 1000);

		console.log(`Download completed from ${url}`);
		console.log(`Time: ${durationInSeconds.toFixed(2)} seconds`);
		console.log(`Speed: ${speedMbps.toFixed(2)} Mbps`);

		progressElement.parentElement.style.display = 'none';
		return { durationInSeconds, speedMbps };
	} catch (error) {
		progressElement.parentElement.style.display = 'none';
		console.error(`Error downloading from ${url}:`, error);
		return null;
	}
}

function convertSeconds(seconds) {
	seconds = parseFloat(seconds.toFixed(2));

	if (seconds >= 60) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = (seconds % 60).toFixed(2);
		return `${translate_strings.meansureResponse.message + minutes + " " + translate_strings.timeMeansure.description + " " + remainingSeconds + " " + translate_strings.timeMeansure.message + translate_strings.meansureResponse.description}`;
	} else {
		return `${translate_strings.meansureResponse.message + seconds + " " + translate_strings.timeMeansure.message + translate_strings.meansureResponse.description}`;
	}
}