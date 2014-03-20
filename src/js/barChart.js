(function(tw, d3) {
	'use strict';

	var BarChart = function(svg) {
		var margin = {
			top: 20,
			right: 25,
			bottom: 30,
			left: 110
		};
		var width = 600 - margin.left - margin.right, height = 350 - margin.top - margin.bottom;
		var limits = {
			"natrium": 200,
			"kalium": 12,
			"calcium": 400,
			"magnesium": 60,
			"chlorid": 240,
			"nitrat": 50,
			"sulfat": 240,
			"hardness": 150
		};

		svg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.ordinal().rangeRoundBands([height, 0], .1);
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
		var yAxis = d3.svg.axis().scale(y).orient("left");

		var referenceData = [];
		Object.keys(tw.data.referenceWaters).forEach(function(name) {
			referenceData.push({
				'name': name,
				'values': tw.data.referenceWaters[name]
			});
		});
		var referenceZones = [];
		referenceZones.forEach(function(zoneId) {
			referenceData.push({
				'name': zoneId,
				'values': tw.data.zones[zoneId]
			});
		});

		var xAxisElement = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")");
		var xAxisTextElement = xAxisElement.append("text").attr("transform", "rotate(90)").attr("y", 5).attr("dy", -481).style("text-anchor", "middle");
		var yAxisElement = svg.append("g").attr("class", "y axis");

		this.update = function(attribute, value, zoneLabel) {
			var data = [];
			referenceData.forEach(function(reference) {
				data.push({
					'name': reference.name,
					'value': tw.utils.getMeanValue(reference.values[attribute])
				});
			});
			data.push({
				'name': zoneLabel,
				'value': tw.utils.getMeanValue(value)
			});

			x.domain([0, Math.max(limits[attribute], d3.max(data, function(d) {
				return d.value;
			}))]);
			y.domain(data.map(function(d) {
				return d.name;
			}));

			xAxisElement.call(xAxis);
			xAxisTextElement.text(function() {
				return attribute === 'hardness' ? '°dH' : 'mg/l';
			});
			yAxisElement.call(yAxis);

			var updateElements = function(d3Element) {
				d3Element.attr("y", function(d) {
					return y(d.name);
				}).attr("height", y.rangeBand()).attr("x", -1).attr('fill', function(d) {
					return d.name === zoneLabel ? '#FFCEA3' : '#FFF';
				}).transition().duration(300).ease('outCirc').attr("width", function(d) {
					return x(d.value);
				});
			};
			var bars = svg.selectAll(".bar").data(data);
			updateElements(bars);
			updateElements(bars.enter().append("rect").attr("class", "bar"));
			bars.exit().remove();
		};
	};

	var barChartInstance = null;

	var toggleDescription = function(attribute) {
		var elements = document.getElementsByClassName('comparison-description');
		for ( var i = 0; i < elements.length; ++i) {
			elements[i].style.display = 'none';
		}

		var attributeElement = document.getElementsByClassName('comparison-description-' + attribute)[0];
		attributeElement.style.display = '';
	};

	var update = function(attribute, value, zoneLabel) {
		toggleDescription(attribute);
		barChartInstance.update(attribute, value, zoneLabel);
	};

	var init = function() {
		barChartInstance = new BarChart(d3.select('.bar-chart-img'));
		return this;
	};

	tw.barChart = {
		'init': init,
		'update': update
	};
})(tw, d3);
