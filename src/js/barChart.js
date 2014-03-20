(function(tw, d3) {
	'use strict';

	var BarChart = function(svg) {
		var margin = {
			top: 20,
			right: 20,
			bottom: 30,
			left: 110
		}, width = 600 - margin.left - margin.right, height = 514 - margin.top - margin.bottom;

		svg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.ordinal().rangeRoundBands([height, 0], .1);
		var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
		var yAxis = d3.svg.axis().scale(y).orient("left");

		var data = [{
			name: "Wüteria Heilquelle",
			value: 1
		}, {
			name: "Teusser Naturell",
			value: 1
		}, {
			name: "Volvic",
			value: 1
		}, {
			name: "Vittel",
			value: 1
		}, {
			name: "Heilbronn",
			value: 20
		}, {
			name: "Neckarsulm",
			value: 10
		}, {
			name: "Bad Wimpfen",
			value: 15
		}, {
			name: "Jagsthausen",
			value: 30
		}];

		var yDomains = [];
		data.forEach(function(entry) {
			yDomains.push(entry.name);
		});

		x.domain([0, 50]);
		y.domain(yDomains);

		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
		svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style(
				"text-anchor", "end");

		svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("y", function(d) {
			return y(d.name);
		}).attr("height", y.rangeBand()).attr("x", -1).attr("width", function(d) {
			return x(d.value);
		});
	};

	var barChartInstance = null;

	var update = function(attribute) {
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
