var fs = require('fs'), csv = require('csv'), async = require('async');
var argv = require('optimist').usage('Convert csv file of streets in hn\nUsage: $0 [csvfile]').demand(1).argv;
var gm = require('googlemaps');

var input = csv().from(argv._[0], {
	delimiter: ';'
}).to.array(function(data) {
	var result = [];
	async.eachLimit(data, 1, function(line, callback) {
		var address = 'Heilbronn, ' + line[0];
		console.log(address);
		var entry = {
			'type': 'Feature',
			'properties': {
				'haerte': line[1]
			},
			'geometry': {
				'type': 'Point',
				'coordinates': []
			}
		};
		result.push(entry);
		gm.geocode(address, function(err, gmData) {
			if (gmData && gmData.results[0] && gmData.results[0].geometry && gmData.results[0].geometry.location && gmData.results[0].geometry.location.lat) {
				entry.geometry.coordinates[0] = gmData.results[0].geometry.location.lng;
				entry.geometry.coordinates[1] = gmData.results[0].geometry.location.lat;
			} else {
			}
			setTimeout(callback, 500);
		});
	}, function(err) {
		var geojson = {
			"type": "FeatureCollection",
			"features": result
		};
		var geojsonString = JSON.stringify(geojson, null, '\t');
		console.log(geojsonString);
		fs.writeFile('result.geojson', geojsonString);
	});
});
