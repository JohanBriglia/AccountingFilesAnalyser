
import SieFileManager from "./SieFileManager.js";

export default class SieFileParser extends SieFileManager {
    splitWordsFromFile(aFileContent) {
		let recordTypes = aFileContent
			.split(/\s/)
			.filter(word => word[0] === "#");
		return recordTypes;
    };
}
