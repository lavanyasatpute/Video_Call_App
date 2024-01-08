console.log('In main.js!');

var labelUsername = document.querySelector('#label-username');
var usernameInput = document.querySelector('#username');
var btnJoin = document.querySelector('#btn-join');

var username;
var webSocket;

function webSocketOnMessage(event) {
    var parsedData = JSON.parse(event.data);
    var message = parsedData['message'];

    console.log('message: ', message);
}

btnJoin.addEventListener('click', () => {
    username = usernameInput.value;

    console.log('username: ', username);
    if (username === '') {
        return;
    }

    usernameInput.value = '';
    usernameInput.disabled = true;
    usernameInput.style.visibility = 'hidden';

    btnJoin.disabled = true;
    btnJoin.style.visibility = 'hidden';

    labelUsername.innerHTML = username;

    var loc = window.location;
    var wsStart = 'ws://';  // Change to 'ws://' for non-secure (http) connections

    if (loc.protocol === 'https:') {
        wsStart = 'wss://';
    }

    var endpoint = wsStart + loc.host + loc.pathname;

    console.log('endpoint: ', endpoint);

    webSocket = new WebSocket(endpoint);  // Fix variable name (endPoint to endpoint)
    webSocket.addEventListener('open', (e) => {
        console.log('Connection Opened!');
    });
    webSocket.addEventListener('message', webSocketOnMessage);
    webSocket.addEventListener('close', (e) => {
        console.log('Connection Closed!');
    });
    webSocket.addEventListener('error', (e) => {
        console.log('Error Occurred!');
    });
});
