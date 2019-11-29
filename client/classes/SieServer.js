 import {submitCRUD} from "../lib/htmlSetup.js";

export default class SieServer {
    constructor(aDomConstruction) {
	this.dom = aDomConstruction;
	this.setupWebsocket('ws://127.0.0.1:1337');
	this.filesRequest = new Request('http://localhost:8081/api/files');
    };

    setupWebsocket(anAdress) {
	window.WebSocket = window.WebSocket || window.MozWebSocket;
	this.wsConnection = new WebSocket(anAdress);
	this.wsConnection.onmessage = messageReceived => {
	    switch (messageReceived.data) {
	    case "update":
		this.dom.refreshFilesList();
		break;
	    default:
		throw `Websocket error: doesn't understand ${messageReceived.data} as a valid websocket onmessage`
	    };
	};
    };

    async getFilesList() {
	let anUList = document.getElementById("filesList")
	anUList.innerHTML = "";
	let jsonFilesList = await fetch(this.filesRequest)
            .then(prom => {return prom.json()})
            .then(x => {return x});
	return jsonFilesList;
    };

    async removeFile(anID) {
	await submitCRUD("DELETE", {"id":anID});
	document.getElementById("chartContainer").innerHTML = "";
	this.wsConnection.send("update");
    };

    async getFile(anID) {
	let file = await fetch(
	    new Request('http://localhost:8081/api/sie/'+anID))       
            .then(prom => {return prom.json()})
            .then(x => {return x[0]});
	return file;
    };
}
