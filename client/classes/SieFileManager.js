import {submitCRUD} from "../lib/htmlSetup.js";

export default class SieFileManager {
    constructor(aDomConstruction) {
	this.dom = aDomConstruction;
    };
    
    setImportButtonReference(anImportButton) {
	this.importButton = anImportButton;
    };
    
    readFileToImportOnClick(event) {
	let reader = new FileReader();
	reader.onload = aFile => {
	    let fileName = this.importButton.files[0].name;
	    let fileContent = aFile.target.result;
	    this.importFile(fileName, fileContent);
	};
	reader.readAsText(event.currentTarget.files[0]);
    };

    importFile(aFileName, aFileContent) {
	submitCRUD("POST", {"name":aFileName, "data":aFileContent});
	this.analyseChartAndShowResults(aFileName, aFileContent);
	this.dom.server.wsConnection.send("update");
    };
    
    parseFile(aFileName, aFileContent) {
	let recordTypes = this.splitWordsFromFile(aFileContent);
	let dataSize = recordTypes.length;
	let recordTypesOccurences = this.parseRecordTypes(recordTypes);
	let recordTypesData =
	    this.countOccurenceOfEachType(recordTypesOccurences, dataSize);
	return recordTypesData;
    };
    
    countOccurenceOfEachType(recordTypesOccurences, dataSize) {	
	let recordTypesData = [];
	for (let key in recordTypesOccurences) {
	    let aPercentage = recordTypesOccurences[key] / dataSize;
	    recordTypesData.push({
		name:key+": "+recordTypesOccurences[key],
		y:aPercentage
	    });
	};
	return recordTypesData;
    };
    
    parseRecordTypes(aList) {
	let occurences = {};
	let aSet = new Set(aList);
	[...aSet].map(eachRecordType => occurences[eachRecordType] = 0);
	aList.map(aRecordType => occurences[aRecordType]++);
	return occurences;
    };

    analyseChartAndShowResults(aFileName, aFileContent) {
	let recordTypesData = this.parseFile(aFileName, aFileContent);
	this.dom.showChart(aFileName+" Analysis", recordTypesData);
    };
}
