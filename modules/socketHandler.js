
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function connect() {

	document.querySelector("h2#notLoggedDesc").innerHTML = translate_strings.ApiPendente.message;
	window.socket = new WebSocket("wss://sso.nexusmods.com");

	// Connect to SSO service
	socket.onopen = function (event) {
		var uuid = null;
		var token = null;
		uuid = sessionStorage.getItem("uuid");
		token = sessionStorage.getItem("connection_token");

		if (uuid == null) {
			uuid = uuidv4();
			sessionStorage.setItem('uuid', uuid);
		}

		if (uuid !== null) {

			var data = {
				id: uuid,
				token: token,
				protocol: 2
			};
			socket.send(JSON.stringify(data));
			window.open("https://www.nexusmods.com/sso?id=" + uuid + "&application=" + application_slug);
		}
		else
			console.error("ID was not calculated correctly.")
	};
	socket.onclose = function (event) {
		console.log("CONNECTION CLOSED;");
	}
	socket.onmessage = function (event) {
		var response = JSON.parse(event.data);

		if (response && response.success) {
			if (response.data.hasOwnProperty('connection_token')) {
				sessionStorage.setItem('connection_token', response.data.connection_token);
			}
			else if (response.data.hasOwnProperty('api_key')) {
				console.log("API Key Received: " + response.data.api_key);
				chrome.runtime.sendMessage({
					action: 'SaveBox',
					item: 'NEXUS_API',
					checado: response.data.api_key
				}, function (response) {
					document.querySelector("h1#notLoggedText").innerHTML = translate_strings.NeedApi_Success.message;
					document.querySelector("h2#notLoggedDesc").innerHTML = translate_strings.NeedApi_Success.description;
					document.querySelector("i.fa-check-circle").style.display = 'block';
					document.querySelector("i.fa-exclamation-circle").style.display = 'none';

					socket.close();
					socket = null;
				})
			}
		}
		else {
			console.error("Something went wrong! " + response.error)
		}
	}
}