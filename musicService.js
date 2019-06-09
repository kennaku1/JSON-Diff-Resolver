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
				diffs[currentKey] = this[currentKey].getArrayDiffs(newSettings[currentKey], this.resolveTypedObject.bind(this, currentKey));
			} else throw 'Invalid key provided';
		}
		return new MusicSettings(diffs);
	}

	resolveTypedObject(key, obj) {
		let res;
		switch(key) {
			case 'users':
				res = new User(obj);
				break;

			case 'playlists':
				res = new PlaylistItem(obj);
				break;

			case 'songs':
				res = new Song(obj);
				break;
		}
		return res;
	}

}

/** Music Settings Types **/

class User {
	constructor({ id, name }) {
		this.id = typeof id !== 'undefined' && isId(id) ? id : null;
		this.name = typeof name === "string" ? name : null;
	}
}

class PlaylistItem {
	constructor({ id, user_id, song_ids }) {
		this.id = typeof id !== 'undefined' && isId(id) ? id : null;
		this.user_id = typeof id !== 'undefined' && isId(id) ? id : null;
		this.song_ids = !song_ids.some(val => parseInt(val) === NaN) ? song_ids : null;
	}
}

class Song {
	constructor({ id, artist, title }) {
		this.id = typeof id !== 'undefined' && isId(id) ? id : null;
		this.artist = typeof artist === "string" ? artist : null;
		this.title = typeof title === "string" ? title : null;
	}
}

const isId = val => {
	return typeof val !== 'undefined' && parseInt(val) !== NaN;
};

Array.prototype.getArrayDiffs = function(diffArray, resolver) {
	if (!diffArray) return this;
	let res = [];
	for (let element of this) {
		const stringVal = JSON.stringify(element);
		const diffIndex = diffArray.findIndex(row => JSON.stringify(row) === stringVal);
		if(diffIndex >=0) {
			diffArray.splice(diffIndex,1);
			res.push(resolver(element)); 
		} 
	}
	//Resolving net new objects as type User, PlaylistItem or Song
	diffArray = diffArray.map(diff => resolver(diff));
	return [...res, ...diffArray];	
};

module.exports = {
	MusicSettings: MusicSettings,
	resolveDiffs: resolveDiffs
};
