var fs = require('fs'), csv = require('csv'), async = require('async'), assert = require('assert');

var locations = {}, zones = {};

var convertCsv = function(filename, finalCallback) {
	var generateZoneId = function(line) {
		var idParts = [];
		var addIdPart = function(value) {
			if (value && idParts.indexOf(value) < 0) {
				idParts.push(value);
			}
		};

		addIdPart(line[0]);
		addIdPart(line[1]);
		if (line[2]) {
			addIdPart(line[3]);
		}
		return idParts.join(' ');
	};

	var generateZoneValues = function(line) {
		if (!line[4]) {
			return null;
		}

		var convertNumericValue = function(value) {
			value = value.replace(/,/g, '.');
			if (value === 'k.A.') {
				value = '';
			}
			if (value === '' || value.indexOf('-') > -1) {
				return value;
			} else {
				var number = parseFloat(value, 10);
				if (isNaN(number)) {
					console.log('is not a number: ' + value);
				}
				return isNaN(number) ? '' : number;
			}
		};

		return {
			"natrium": convertNumericValue(line[5]),
			"kalium": convertNumericValue(line[6]),
			"calcium": convertNumericValue(line[7]),
			"magnesium": convertNumericValue(line[8]),
			"chlorid": convertNumericValue(line[9]),
			"nitrat": convertNumericValue(line[10]),
			"sulfat": convertNumericValue(line[11]),
			"hardness": convertNumericValue(line[4]),
			"year": line[13],
			"description": line[14]
		};
	};

	var fillZones = function(line) {
		var zoneId = generateZoneId(line);
		var zoneValues = generateZoneValues(line);
		if (zoneValues) {
			if (zones[zoneId]) {
				try {
					assert.deepEqual(zoneValues, zones[zoneId]);
				} catch (e) {
					console.log('Werte innerhalb einer Zone unterschiedlich! ' + zoneId);
				}
			} else {
				zones[zoneId] = zoneValues;
			}
			fillLocations(line);
		}
	};

	var addProperty = function(parent, property, value, force) {
		if ((property || force) && !parent[property]) {
			parent[property] = value;
		}
	};

	var fillLocations = function(line) {
		addProperty(locations, line[0], {});
		addProperty(locations[line[0]], line[1], {}, line[2] ? true : false);

		if (line[2]) {
			var parentProperty = locations[line[0]][line[1]];
			addProperty(parentProperty, line[3], [], true);
			parentProperty[line[3]].push(line[2]);
		}
	};

	var trimAll = function(line) {
		for ( var column = 0; column < line.length; column++) {
			line[column] = line[column].trim();
		}
	};

	var convertLine = function(line) {
		trimAll(line);
		fillZones(line);
	};

	csv().from(filename).to.array(function(data) {
		delete data[0];
		data.forEach(convertLine);
		finalCallback();
	});
};

var writeLocationFile = function() {
	var stringifyResult = JSON.stringify(locations, null, '\t');
	fs.writeFile('../src/data/locations.js', 'tw.data.locations = ' + stringifyResult + ';');
};
var writeZonesFile = function() {
	var stringifyResult = JSON.stringify(zones, null, '\t');
	fs.writeFile('../src/data/zones.js', 'tw.data.zones = ' + stringifyResult + ';');
};

async.eachLimit(['hn.csv', 'Wasserdaten Landkreis Heilbronn.csv'], 1, convertCsv, function(err) {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	writeLocationFile();
	writeZonesFile();
});