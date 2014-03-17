(function(tw, $, d3) {
	'use strict';

	var Gauge = function(svg) {
		var limit = svg.attr('data-limit');
		var yLineStart = 65, yLineRange = 300;
		this.nutrient = svg.attr('data-nutrient');
		this.value = 0;

		/** lines */
		var linesToDisplay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
		var calculateLineY = function(lineNumber) {
			var ratio = lineNumber / 20;
			var y = yLineStart + yLineRange - Math.round(yLineRange * ratio);
			return y;
		};
		var calculateLineX1 = function(lineNumber) {
			return lineNumber % 5 === 0 ? 38 : 47;
		};
		var renderLines = function() {
			var gaugeLines = svg.select('.gauge-lines').selectAll('line').data(linesToDisplay);
			var enter = gaugeLines.enter().append('line');
			enter.attr('x1', calculateLineX1).attr('x2', 55);
			enter.attr('y1', calculateLineY).attr('y2', calculateLineY);
		};

		/** line labels */
		var labelsToDisplay = [];
		for ( var longLineNumber = 0; longLineNumber < 5; longLineNumber++) {
			labelsToDisplay.push(limit / 4 * longLineNumber);
		}
		var calculateLabelY = function(label) {
			var lineNumber = (label / (limit / 4)) * 5;
			return calculateLineY(lineNumber) + 6;
		};
		var renderLabels = function() {
			var gaugeLineLabels = svg.select('.gauge-lines').selectAll('text').data(labelsToDisplay);
			var enter = gaugeLineLabels.enter().append('text');
			enter.attr('x', 33).attr('y', calculateLabelY).attr('text-anchor', 'end');
			enter.text(function(label) {
				return label;
			});
		};

		/** value */
		var applyValueToGauge = function(gaugeSelector, start, stop) {
			var calculateValueY = function(value) {
				var ratio = value / limit;
				var y = (yLineStart + yLineRange) - (ratio * yLineRange) - 1;
				return y;
			};
			var calculateValueHeight = function() {
				var height = (yLineStart + yLineRange) - calculateValueY(start - stop);
				return height;
			};

			svg.select(gaugeSelector).attr('y', function() {
				return calculateValueY(start);
			}).attr('height', calculateValueHeight);
		};

		this.applyValue = function(rawValue) {
			var value = rawValue, value2 = 0;
			if (rawValue.indexOf('-')) {
				value = parseInt(rawValue.substr(0, rawValue.indexOf('-')), 10);
				value2 = parseInt(rawValue.substr(rawValue.indexOf('-') + 1), 10);
			}
			console.log('value: ' + value + ' - value2: ' + value2);

			applyValueToGauge('.gauge-value', value, 0);
			applyValueToGauge('.gauge-value-2', value2, value);
		};

		/** render it */
		renderLines();
		renderLabels();
	};

	var init = function() {
		var nutrientValues = tw.data.heilbronn.analysis[tw.data.heilbronn.streets['Allee']];
		d3.selectAll('.gauge').each(function() {
			var gauge = new Gauge(d3.select(this));
			var value = nutrientValues[gauge.nutrient];
			gauge.applyValue(value);
		});
	};

	tw.details = {
		'init': init
	};
})(tw, jQuery, d3);
