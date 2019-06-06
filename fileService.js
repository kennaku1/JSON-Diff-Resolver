//FileService
const fs =  require('fs');

const saveFile = (path, data) => {
	try {
		console.log('path & data: ', path);
		fs.writeFile(path, data, err => {
			if (err) throw `Error saving file: ${err}`;

			console.log('save successful');
		});
	} catch(err) {
		throw `Error occured during save:  ${err}`;
	}

};

const getFileParams = args => {
	return {
		inputFile: getPath(args[2]),
		updateFile: getPath(args[3]),
		outputPath: getPath(args[4])
	};
};

const getPath = (file, isRequired = false) => {
	const path = `${__dirname}/TestData/${file}`;
	if (isRequired && !fs.existsSync(path)) throw `${file} does not exist in the TestData directory`;
	return path;
};

const getJSON = filePath => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) reject(`Error loading ${filePath}: ${err}`);
			resolve(data);
		});
	});
}

module.exports = {
	saveFile: saveFile,
	getFileParams: getFileParams,
	getJSON: getJSON
};