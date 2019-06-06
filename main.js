//HighSpot
const ms = require('./MusicService');
const fileService = require('./fileService');
const MusicSettings = ms.MusicSettings;

const init = () => {
	if (!process.argv || process.argv.length < 5) throw 'Missing options';

	const params =  fileService.getFileParams(process.argv);
	let originalSettings;
	let newSettings;
	fileService.getJSON(params.inputFile)
	.then(jsonRes => {
		originalSettings = new MusicSettings(JSON.parse(jsonRes));
		return fileService.getJSON(params.updateFile);
	})
	.then(jsonRes => {
		console.log('getting new settings...');
		newSettings = new MusicSettings(JSON.parse(jsonRes));
		try {
			//console.log(originalSettings.mergeSettings(newSettings));
			ms.resolveDiffs(originalSettings, newSettings, params.outputPath);
		} catch(err) {
			throw err;
		}
	})
	.catch(err => console.log('ERROR!: ', err))
}

init();