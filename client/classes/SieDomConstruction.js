import {addHTMLElement, submitCRUD} from "../lib/htmlSetup.js";
import SieServer from "./SieServer.js";
import ParserFactory from "./ParserFactory.js";

export class SieDomConstruction {
    constructor() {
	this.server = new SieServer(this);
	this.importTypesList = {"SIE":".se"};
	this.importType = "SIE";
	this.updateParser();
    };

    updateParser() {
	this.fileManager = new ParserFactory().newParserFor(this);
    };

    async domConstruction() {
	let globalContainer = addHTMLElement(
	    "div", document.body, {id: "globalContainer"}
	);
	addHTMLElement(
	    "h1", globalContainer, {innerHTML:"Accounting files Analyser"}
	);
	let chartsWindow = addHTMLElement(
	    "div", globalContainer, {id:"chartsWindow"}
	);
	this.filesDiv = addHTMLElement(
	    "div", chartsWindow
	);
	this.filesDivConstruction();
	await this.refreshFilesList();
	addHTMLElement(
	    "div", chartsWindow, {id:"chartContainer"}
	);
    };

    filesDivConstruction() {
	addHTMLElement(
	    "label", this.filesDiv, {innerHTML:"Import file:"}
	);
	this.setImportButton(this.filesDiv);
	this.setDropdownButton(this.filesDiv);
	addHTMLElement(
	    "ul", this.filesDiv, {id:"filesList"}
	);
    };

    setImportButton(aDiv) {
	let anImportButton = addHTMLElement(
	    "input", aDiv, {type:"file", accept:".se", id:"input"}
	);
	anImportButton.addEventListener(
	    "change", anEvent => this.importFileEvent(anEvent)
	);
	this.fileManager.setImportButtonReference(anImportButton);
    };
    
    changeImportType() {
	this.importType = this.getDropDownValue();
	this.updateParser;
	let importButton = document.getElementById("import");
	let typeExtension = importTypesList[this.importType];
	importButton.accept:typeExtension;
    };

    setDropdownButton(aDiv) {
	let aDropDown = addHTMLElement(
	    "select", aDiv, {id: "droopy"}
	);
	this.importTypesList.forEach(function(typeElement) {
            addHTMLElement(
		"option", droopy,
		{id:typeElement, value:typeElement, innerHTML:typeElement}
	    );
	});
	document.getElementById(this.importType).selected = "selected";
	aDropDown.addEventListener(
	    "change", anEvent => this.changeImportType()
	);
    };

    getDropdownValue() {
	let aDropDown = document.getElementById("droopy");
	return aDropDown.options[aDropDown.selectedIndex].text
    };
 
    importFileEvent(anEvent) {
	this.fileManager.readFileToImportOnClick(anEvent);
	this.server.wsConnection.send("update");
    };
 
    showChart(aTitle, someData) {
	$('#chartContainer').highcharts({
            chart: {
		plotBackgroundColor: null,
		type: 'pie'
            },
            title: {text: aTitle},
            tooltip: {
		pointFormat: '{series.name}: <b>{point.percentage:.01f}%</b>'},
            plotOptions: {
		pie: {
                    allowPointSelect: true,
                    dataLabels: {
			enabled: false},
		    showInLegend: true,
		}
            },
            series: [{name:'Percentage', data:someData}]
	});
    };

    async refreshFilesList() {
	let aJsonFilesList = await this.server.getFilesList();
	this.constructFilesListInDom(aJsonFilesList);
    };

    constructFilesListInDom(aJsonFilesList) {
	let anUList = document.getElementById("filesList");
	anUList.innerHTML = "";
	for (let i = 0 ; i < aJsonFilesList.length ; i++){
	    this.constructEachFileLI(anUList, aJsonFilesList[i]);
	};
    };

    constructEachFileLI(anUList, aJsonFile) {
	let li = addHTMLElement(
	    "li", anUList, {id:aJsonFile["_id"]}
	);
	li.addEventListener(
	    "click", anEvent => this.refreshChartDiv(anEvent.currentTarget.id)
	);
	addHTMLElement(
	    "label", li, {innerHTML:aJsonFile["name"]}
	);
	let removeButton = addHTMLElement(
	    "button", li, {innerHTML:"remove File"}
	);
	removeButton.addEventListener(
	    "click", anEvent => this.removeFileEvent(anEvent)
	);
    };

    async removeFileEvent(anEvent) {
	anEvent.stopPropagation();
	let fileId = anEvent.currentTarget.parentNode.id;
	await this.server.removeFile(fileId);
    };

    async refreshChartDiv(anID) {
	let aChartFile = await this.server.getFile(anID);
	let aFileName = aChartFile["name"];
	let aFileContent = aChartFile["data"];
	this.fileManager.analyseChartAndShowResults(aFileName, aFileContent);
    };
}
