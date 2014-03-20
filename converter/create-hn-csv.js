var fs = require('fs');

var result = {};
var previousStreetName = '';

var getPreviousStreetNameWithoutSpecificRange = function() {
	var cutIndex1 = previousStreetName.indexOf('ab Nr');
	var cutIndex2 = previousStreetName.indexOf('Nr.');
	if (cutIndex1 > -1 || cutIndex2 > -1) {
		var cutIndex = cutIndex1 > -1 && cutIndex2 === -1 ? cutIndex1 : cutIndex2;
		return previousStreetName.substr(0, cutIndex).trim();
	}
	return previousStreetName;
};

var Line = function(value) {
	value = value.trim();
	var longestHardnessValueLength = '14-18°'.length;

	var lastCharIsDegreeSign = function() {
		return value.length > 0 && value.indexOf('°') === (value.length - 1);
	};
	var lastCharIsNumber = function() {
		return value.length > 0 && /^\d{1}$/.test(value.slice(-1));
	};

	this.isStreetWithValue = function() {
		return value.length > 5 && (lastCharIsDegreeSign() || lastCharIsNumber());
	};
	this.isStreetWithoutValue = function() {
		return !this.isStreetWithValue() && value.toLowerCase().indexOf('straße') >= 0;
	};

	var formatStreetName = function(streetName) {

		var formattedStreetName = streetName.replace(/–/g, '-').replace(/  /g, ' ').replace(/ - /g, '-').replace(/ -/g, '-').replace(/- /g, '-').replace(
				/Str\./, 'Straße').replace(/Str \./, 'Straße').replace(/str\./, 'straße').replace(/Strasse/, 'Straße').replace(/strasse/, 'straße').replace(
				/Friedr\./, 'Friedrich').replace(/Erh\./, 'Erhard').replace(/Gerh\./, 'Gerhart').replace(/Geschw\./, 'Geschwister').replace(/Pl\./, 'Platz')
				.replace(/Theod\./, 'Theodor');

		var replaceStreetAbbrWithoutSign = function(abbr, replacement) {
			if (formattedStreetName.indexOf(abbr) === (formattedStreetName.length - abbr.length) && formattedStreetName.indexOf(replacement) === -1) {
				return formattedStreetName.replace(new RegExp(abbr), replacement);
			}
			return formattedStreetName;
		};

		formattedStreetName = replaceStreetAbbrWithoutSign('Str', 'Straße');
		formattedStreetName = replaceStreetAbbrWithoutSign('St', 'Straße');
		formattedStreetName = replaceStreetAbbrWithoutSign('str', 'straße');
		return formattedStreetName;
	};

	this.getStreetName = function() {
		if (this.isStreetWithoutValue()) {
			return formatStreetName(value);
		}

		var hardness = this.getWaterHardness();
		var streetName = value.substr(0, value.lastIndexOf(hardness)).trim();
		if (streetName.indexOf('→') === 0) {
			var specificRange = streetName.substr(1).trim();
			streetName = getPreviousStreetNameWithoutSpecificRange() + ' ' + specificRange;
		}
		return formatStreetName(streetName);
	};

	this.getWaterHardness = function() {
		var hardness = value.slice(longestHardnessValueLength * -1).trim();
		if (hardness.indexOf(' ') >= 0) {
			hardness = hardness.substr(hardness.lastIndexOf(' ') + 1);
		}
		if (lastCharIsDegreeSign()) {
			hardness = hardness.substr(0, hardness.length - 1);
		}
		return hardness;
	};
};

var convertLine = function(lineValue) {
	var line = new Line(lineValue, previousStreetName);
	if (line.isStreetWithValue()) {
		var streetName = line.getStreetName();
		var hardness = line.getWaterHardness();

		if (hardness === '4-18') {
			hardness = '14-18';
		}

		result[streetName] = hardness;
		previousStreetName = streetName;
	} else if (line.isStreetWithoutValue()) {
		previousStreetName = lineValue.trim();
	}
};

var convert = function() {
	var rawData = fs.readFileSync('hn-haerte-je-strasse.raw.txt', {
		'encoding': 'utf8'
	});
	var rawDataLines = rawData.toString().split(/\r?\n/);
	rawDataLines.forEach(convertLine);
};

var writeResult = function() {
	var analysisPerHardness = {
		"14": {
			"natrium": 7,
			"kalium": 2,
			"calcium": 70,
			"magnesium": 17,
			"chlorid": 16,
			"nitrat": 13,
			"sulfat": 35,
			"hardness": 14
		},
		"14-18": {
			"natrium": "6-12",
			"kalium": "1-3",
			"calcium": "80-92",
			"magnesium": "14-20",
			"chlorid": "20-25",
			"nitrat": "18-22",
			"sulfat": "37-57",
			"hardness": "14-18"
		},
		"10": {
			"natrium": "6-7",
			"kalium": "1-2",
			"calcium": "55-60",
			"magnesium": "11-12",
			"chlorid": "9-10",
			"nitrat": "8-9",
			"sulfat": "91-92",
			"hardness": 10
		},
		"9": {
			"natrium": "5-6",
			"kalium": "1-2",
			"calcium": "48-52",
			"magnesium": "7-9",
			"chlorid": "8-9",
			"nitrat": "5-7",
			"sulfat": 32,
			"hardness": 9
		}
	};

	var csv = '';
	Object.keys(result).forEach(
			function(streetName) {
				var analysis = analysisPerHardness[result[streetName]];
				if (analysis) {
					csv += 'Heilbronn;;' + streetName + ';' + analysis.hardness + ';' + analysis.hardness + ';' + analysis.natrium + ';' + analysis.kalium
							+ ';' + analysis.calcium + ';' + analysis.magnesium + ';' + analysis.chlorid + ';' + analysis.nitrat + ';' + analysis.sulfat
							+ ";;;\n";
				}
			});
	fs.writeFile('hn.csv', csv);
};

convert();
writeResult();