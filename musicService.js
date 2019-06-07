const fileService = require('./fileservice');

const resolveDiffs = function (originalSettings, newSettings, outputPath) {
	try {
		const resolvedSettings = originalSettings.mergeSettings(newSettings);
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
	//Restricting to musicSettings objects only
	mergeSettings(newSettings) {
		let keys = ['users', 'playlists', 'songs'];
		let diffs = {};
		while(keys.length) {
			let currentKey = keys.shift();
			if (this[currentKey]) {
				diffs[currentKey] = this[currentKey].getArrayDiffs(newSettings[currentKey]);
			} else throw 'Invalid key provided';
		}
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
