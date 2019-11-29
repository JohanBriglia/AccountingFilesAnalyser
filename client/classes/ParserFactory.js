import SieFileParser from "./SieFileParser.js"

export default class ParserFactory {
    newParserFor(aDom) {
	let aFileType = aDom.importType
	switch(aFileType){
	case "SIE":
	    this.parserLewis = new SieFileParser(aDom);
	    break;
	default:
	    throw `ParserFactory error: Unknown ${aFileType} file type to parse`
	};
	return this.parserLewis;
    };
};
