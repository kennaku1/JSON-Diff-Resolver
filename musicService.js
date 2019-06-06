const fileService = require('./fileservice');

const resolveDiffs = function (originalSettings, newSettings, outputPath) {
	try {
		const resolvedSettings = originalSettings.mergeSettings(newSettings);
		console.log('resolvedSettings', resolvedSettings);
		fileService.saveFile(outputPath, JSON.stringify(resolvedSettings));
	} catch (err) {
		console.log('Error resolveDiffs: ', err);
	}
};


class MusicSettings {
	constructor({ playlists, songs, users }) {
		this.users = users || [];
		this.playlists = playlists || [];
		this.songs = songs || [];
	}

	mergeSettings(newSettings) {
		let keys = Object.keys(newSettings);
		let diffs = {};
		while(keys.length) {
			let currentKey = keys.shift();
			console.log(currentKey);
			if (this[currentKey]) {
				diffs[currentKey] = this[currentKey].getArrayDiffs(newSettings[currentKey]);
			}
		}
		console.log('diffs: ', diffs);
		return new MusicSettings(diffs);
	}

}

Array.prototype.getArrayDiffs = function(diffArray) {
	if (!diffArray) return this;

	let res = [];
	let counter = 0;
	for (let element of this) {
		const diffIndex = diffArray.indexOf(element);
		if(diffIndex >=0) {
			diffArray.splice(counter,1);
			res.push(element); 
		} 
		counter++;
	}
	return [...res, ...diffArray];	
};

module.exports = {
	MusicSettings: MusicSettings,
	resolveDiffs: resolveDiffs
};