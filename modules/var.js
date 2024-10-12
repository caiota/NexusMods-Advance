var link, lineElement, modTable, mod_title, mod_span, mod_span_version, mod_span_size, mod_span_game, mod_span_updated, mod_span_category, mod_span_FullMod, modStatus, reload_mod, delete_modDIV, delete_modMessage, delete_mod, DIV_TOP, DIV_THUMB, DIV_INFO, update, DESCRIPTION, CHANGELOG, VERSION, temp_changelog, temp_description, mod_latestVersion, changelog_element, text, DATA;

var is_premium = false;
var lastVersion_FileID = 0;
var size = 0;
var lineElement_Outdated;
var line = 3;
var lineOutdated = 3;
var tempMods = {};
var tempMods_permanent = {};
var reloadDelay = 0;

var filterDelay = null;
var AllMods = {};
let temp_FetchCache = {};
var mod_tempData = {}
var NEXUS_API = "0";
var api_headers = {
	method: 'GET',
	headers: {
		'accept': 'application/json',
		'apikey': NEXUS_API
	}
}

var NOTIFICATIONS_COUNT = 0;
var GAMES = [];
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
}
var application_slug = "nmadvance";
var options = {}
var HIDDEN_MODS = {};

let RestanteDiario = 10000;
let RestanteHorario = 500;

let mod_tempItems = {

}
var translate_strings;
const CDN_testServers = [
	{
		name: 'Global CDN',
		url: 'https://cf-speedtest.nexusmods.com/100M'
	},
	{
		name: 'EU - Amsterdam',
		url: 'https://amsterdam.nexus-cdn.com/100M'
	},
	{
		name: 'EU - Prague',
		url: 'https://prague.nexus-cdn.com/100M'
	},
	{
		name: 'US - Los Angeles',
		url: 'https://la.nexus-cdn.com/100M'
	},
	{
		name: 'US - Chicago',
		url: 'https://chicago.nexus-cdn.com/100M'
	},
	{
		name: 'US - Miami',
		url: 'https://miami.nexus-cdn.com/100M'
	},
];