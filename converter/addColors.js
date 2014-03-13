var fs = require('fs');
var argv = require('optimist').usage('Add colors to json file with street points\nUsage: $0 [jsonfile]').demand(1).argv;

var colors = {
	'25': '#08306b',
	'14-18': '#2171b5',
	'14': '#4292c6',
	'10': '#9ecae1',
	'9': '#deebf7'
};

var newGeojson = {
	"type": "FeatureCollection",
	"features": []
};

var geojson = fs.readFile(argv._[0], {
	encoding: 'utf-8'
}, function(err, data) {
	var geojson = JSON.parse(data);

	var values = {};
	geojson.features.forEach(function(feature) {
		var haerte = feature.properties.haerte;
		if (haerte) {
			haerte = haerte.trim();
			if (haerte != '10') {
				haerte = haerte.substr(0, haerte.length - 1);
			}
			if (haerte == '14°') {
				haerte = haerte.substr(0, haerte.length - 1);
			}
			if (haerte && haerte != '-1' && haerte != '14-1') {
				if (!values[haerte]) {
					feature.properties['haerte'] = haerte;
					feature.properties['marker-symbol'] = 'circle-stroked';
					feature.properties['marker-color'] = colors[haerte];
				}
			}
		}

		if (feature.geometry.coordinates.length === 2) {
			newGeojson.features.push(feature);
		}
	});

	var geojsonString = JSON.stringify(newGeojson, null, '\t');
	fs.writeFile('result-with-colors.geojson', geojsonString);
});
