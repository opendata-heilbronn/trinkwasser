(function(tw, d3) {
	'use strict';

	var Map = function(svg) {
		var width = 1170;
		var height = 1170;
		var center = [9.171, 49.16];
		var scale = 400;
		var offset = [width / 2, height / 2];
		var projection = d3.geo.mercator().scale(scale).center(center).translate(offset);
		var path = d3.geo.path().projection(projection);

		var bounds = path.bounds(tw.data.geoLayer);
		var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
		var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
		var scale = (hscale < vscale) ? hscale : vscale;
		var offset = [width - (bounds[0][0] + bounds[1][0]) / 2, height - (bounds[0][1] + bounds[1][1]) / 2];

		projection = d3.geo.mercator().center(center).scale(scale).translate(offset);
		path = path.projection(projection);

		var z = d3.scale.linear().domain([9, 16]).range(colorbrewer.RdBu[9]);

		svg.select('.areas').selectAll("path").data(tw.data.geoLayer.features).enter().append("path").attr("d", path);
		svg.select('.zones').selectAll("path").data(tw.data.zonesGeo.features).enter().append("path").attr("d", path).attr('stroke', function(d) {
			return z(tw.utils.getMeanValue(d.properties.haertegrad));
		});
	};

	var mapInstance = null;

	var update = function() {
	};

	var init = function() {
		mapInstance = new Map(d3.select('.map-img'));
		return this;
	};

	tw.map = {
		'init': init,
		'update': update
	};
})(tw, d3);
