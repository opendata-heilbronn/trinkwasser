(function(tw, $, d3) {
	'use strict';

	var Gauge = function(svg) {
		var calculateY = function(lineNumber) {
			var maxLineNumber = 20;
			var start = 75;
			var yRange = 300;

			var ratio = lineNumber / maxLineNumber;
			var y = start + yRange - Math.round(yRange * ratio);
			return y;
		};

		var calculateX1 = function(lineNumber) {
			return lineNumber % 5 === 0 ? 35 : 45;
		};

		var linesToDisplay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
		var gaugeLines = svg.select('.gauge-lines').selectAll('line').data(linesToDisplay);
		var enter = gaugeLines.enter().append('line');
		enter.attr('x1', calculateX1).attr('x2', 55);
		enter.attr('y1', calculateY).attr('y2', calculateY);

		var calculateLabelY = function(lineNumber) {
			return calculateY(lineNumber) + 6;
		};

		var labelsToDisplay = [0, 5, 10, 15, 20];
		var gaugeLineLabels = svg.select('.gauge-lines').selectAll('text').data(labelsToDisplay);
		var enter = gaugeLineLabels.enter().append('text');
		enter.attr('x', 15).attr('y', calculateLabelY);
		enter.text(function(label) {
			return label;
		});
	};

	var init = function() {
		new Gauge(d3.select('#gauge'));
	};

	tw.details = {
		'init': init
	};
})(tw, jQuery, d3);
