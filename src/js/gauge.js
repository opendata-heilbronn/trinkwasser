(function(tw, d3) {
	'use strict';

	var nutrientLimits = {
		"natrium": 200,
		"kalium": 12,
		"calcium": 400,
		"magnesium": 60,
		"chlorid": 240,
		"nitrat": 60,
		"sulfat": 240
	};

	var nutrientLegalLimits = {
		"natrium": '200 mg/l',
		"kalium": '-',
		"calcium": '-',
		"magnesium": '-',
		"chlorid": '250 mg/l',
		"nitrat": '50 mg/l',
		"sulfat": '250 mg/l'
	};

	var GaugeGlass = function(svg) {
		var limit = 0;
		var yValueStop = 220, yValueMaxHeight = 602, yValueStart = yValueStop + yValueMaxHeight;

		/** lines */
		var linesToDisplay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
		var calculateLineY = function(lineNumber) {
			var ratio = lineNumber / 20;
			var y = yValueStart - Math.round(yValueMaxHeight * ratio);
			return y - 2;
		};
		var calculateLineX2 = function(lineNumber) {
			return lineNumber % 5 === 0 ? 68 : 48;
		};
		var renderLines = function() {
			var gaugeLines = svg.select('.gauge-lines').selectAll('line').data(linesToDisplay);
			var enter = gaugeLines.enter().append('line');
			enter.attr('x1', 36).attr('x2', calculateLineX2);
			enter.attr('y1', calculateLineY).attr('y2', calculateLineY);
		};

		/** line labels */
		var labelsToDisplay = [];
		var calculateLabelY = function(label) {
			var lineNumber = (label / (limit / 4)) * 5;
			return calculateLineY(lineNumber) + 6;
		};
		var updateLabels = function() {
			var updateElements = function(d3Element) {
				d3Element.text(function(label) {
					return label;
				}).attr('x', 78).attr('y', calculateLabelY).attr('text-anchor', 'start');
			};

			var gaugeLineLabels = svg.select('.gauge-lines').selectAll('text').data(labelsToDisplay);
			updateElements(gaugeLineLabels);
			updateElements(gaugeLineLabels.enter().append('text'));
			gaugeLineLabels.exit().remove();
		};
		var updateLabelsToDisplay = function() {
			labelsToDisplay = [];
			for ( var longLineNumber = 1; longLineNumber < 5; longLineNumber++) {
				labelsToDisplay.push(limit / 4 * longLineNumber);
			}
		};
		var updateAverageIndicator = function(attribute) {
			var averageIndicatorY = calculateBarY(tw.data.averageValues[attribute]);
			svg.select('.average-indicator').transition().duration(300).ease('outCirc').attr('y1', averageIndicatorY).attr('y2', averageIndicatorY);
		};
		this.applyAttribute = function(nutrient) {
			limit = nutrientLimits[nutrient];
			updateLabelsToDisplay();
			updateLabels();
			updateAverageIndicator(nutrient);
			return this;
		};

		/** value */
		var calculateBarY = function(value) {
			var ratio = value < 1 ? 0 : value / limit;
			var y = yValueStart - Math.round(ratio * yValueMaxHeight) - 1;
			return y;
		};
		var calculateBarHeight = function(value) {
			var height = yValueStart - calculateBarY(value);
			return height;
		};
		var updateBar = function(selector, y, height) {
			svg.select(selector).transition().duration(300).ease('outCirc').attr('y', function() {
				return y;
			}).attr('height', height);
		};
		var calculateBubbleBarBreakpoint = function(valueHeight) {
			return (valueHeight >= 123) ? 123 : 17;
		};
		var updateBars = function(value1, value2) {
			var valueHeight = calculateBarHeight(Math.max(value1, value2));
			var startY = calculateBarY(0);
			var value2Diff = value2 > value1 ? value2 - value1 : 0;
			var bubbleBarBreakpoint = calculateBubbleBarBreakpoint(valueHeight);

			if (bubbleBarBreakpoint > valueHeight) {
				updateBar('.gauge-value-bubble-cut', startY, 0);
				updateBar('.gauge-value', startY, valueHeight);
			} else {
				updateBar('.gauge-value-bubble-cut', startY - bubbleBarBreakpoint, bubbleBarBreakpoint);
				updateBar('.gauge-value', startY - valueHeight, valueHeight - bubbleBarBreakpoint + 1);
			}
			updateBar('.gauge-value-2', calculateBarY(value2) - 1, calculateBarHeight(value2Diff));
		};
		this.applyValue = function(value) {
			var value1 = value, value2 = 0;
			if (tw.utils.isRange(value)) {
				var minMax = tw.utils.getRange(value);
				value1 = minMax[0], value2 = minMax[1];
			}

			updateBars(value1, value2);
			return this;
		};
		this.getValueLabel = function() {
			return "";
		};

		/** display */
		this.show = function() {
			d3.selectAll('.gauge-glass-container').attr('style', '');
			return this;
		};
		this.hide = function() {
			d3.selectAll('.gauge-glass-container').attr('style', 'display:none;');
			return this;
		};

		renderLines();
	};

	var GaugeBar = function(svg) {
		var attribute = 'hardness', value = 0;
		var totalWidth = 750;
		var defs = {
			'hardness': {
				'min': 0,
				'max': 28,
				'parts': [{
					'id': 1,
					'x': 0,
					'width': 225,
					'label': 'weich',
					'rangeLabel': '&lt; 8,4 °dH',
				}, {
					'id': 2,
					'x': 225,
					'width': 150,
					'label': 'mittel',
					'rangeLabel': '8,4 - 14 °dH',
				}, {
					'id': 3,
					'x': 375,
					'width': 375,
					'label': 'hart',
					'rangeLabel': '&gt; 14 °dH',
				}]
			}
		};

		/** attribute */
		var updatePartLabels = function() {
			var calculatX = function(partDef) {
				return (partDef.width / 2) + partDef.x;
			};
			var updateElements = function(d3Element) {
				d3Element.attr('x', calculatX).attr('y', 20).attr('text-anchor', 'middle').html(
						function(partDef) {
							return '<tspan x="' + calculatX(partDef) + '">' + partDef.rangeLabel + '</tspan><tspan x="' + calculatX(partDef)
									+ '" dy="1.3em" style="font-weight:bold;">' + partDef.label + '</tspan>';
						});
			};

			var barLabels = svg.select('.gauge-bar-labels').selectAll('text').data(defs[attribute].parts);
			updateElements(barLabels);
			updateElements(barLabels.enter().append('text'));
			barLabels.exit().remove();
		};
		var resizeParts = function() {
			var updateElements = function(d3Element) {
				d3Element.attr('x', function(partDef) {
					return partDef.x;
				}).attr('width', function(partDef) {
					return partDef.width;
				}).attr('class', function(partDef) {
					return 'gauge-bar-' + partDef.id;
				}).attr('y', 60).attr('height', 36);
			};

			var bars = svg.select('.gauge-bars').selectAll('rect').data(defs[attribute].parts);
			updateElements(bars);
			updateElements(bars.enter().append('rect'));
			bars.exit().remove();
		};
		this.applyAttribute = function(newAttribute) {
			attribute = newAttribute;
			resizeParts();
			updatePartLabels();
			return this;
		};

		/** value */
		var calculateValueX = function(valueNumber) {
			return (totalWidth / (defs[attribute].max - defs[attribute].min) * valueNumber);
		};
		var updateBallPosition = function() {
			svg.select('.gauge-bar-ball').transition().duration(300).ease('outCirc').attr('cx', calculateValueX(tw.utils.getMeanValue(value)));
		};
		var updateRangeIndicatorPosition = function() {
			var value1 = value, value2 = value;
			if (tw.utils.isRange(value)) {
				var range = tw.utils.getRange(value);
				value1 = range[0], value2 = range[1];
			}
			var value1X = calculateValueX(value1), value2X = calculateValueX(value2);
			svg.select('.gauge-bar-range-indicator').attr('x', value1X).attr('width', (value2X - value1X));
		};
		this.applyValue = function(newValue) {
			value = newValue;
			updateBallPosition();
			updateRangeIndicatorPosition();
			return this;
		};
		this.getValueLabel = function() {
			if (attribute === 'hardness' && value > 21.3) {
				return '(sehr) hart';
			}
			var matchingPart = {}, valueX = calculateValueX(tw.utils.getMeanValue(value));
			defs[attribute].parts.forEach(function(part) {
				if (part.x <= valueX && (part.x + part.width) > valueX) {
					matchingPart = part;
				}
			});
			return matchingPart.label;
		};

		/** display */
		this.show = function() {
			d3.selectAll('.gauge-bar-container').attr('style', '');
			return this;
		};
		this.hide = function() {
			d3.selectAll('.gauge-bar-container').attr('style', 'display:none;');
			return this;
		};
	};

	var glassInstance = null;
	var barInstance = null;

	var toggleDescription = function(attribute, value, valueLabel) {
		d3.selectAll('.attribute-description').attr('style', 'display:none;');
		d3.selectAll('.attribute-description-' + attribute).attr('style', '');

		d3.selectAll('.gauge-value').text(value.toString().replace(/\./g, ','));
		d3.selectAll('.gauge-legal-limit').text(nutrientLegalLimits[attribute]);
		d3.selectAll('.gauge-daily-dosis').text(tw.data.nutrientDailyDosis[attribute]);
		d3.selectAll('.gauge-daily-dosis-container').attr('style', (tw.data.nutrientDailyDosis[attribute]) ? '' : 'display:none;');
		d3.selectAll('.gauge-value-label').text(valueLabel);
		d3.selectAll('.gauge-average-value').text(tw.data.averageValues[attribute].toString().replace(/\./g, ','));
	};

	var update = function(attribute, value) {
		var instanceToShow = glassInstance, instanceToHide = barInstance;
		if (attribute === 'hardness') {
			instanceToShow = barInstance, instanceToHide = glassInstance;
		}

		instanceToHide.hide();
		instanceToShow.show().applyAttribute(attribute).applyValue(value);
		toggleDescription(attribute, value, instanceToShow.getValueLabel());
	};

	var init = function() {
		glassInstance = new GaugeGlass(d3.select('.gauge-glass-img'));
		barInstance = new GaugeBar(d3.select('.gauge-bar-img'));
		return this;
	};

	tw.gauge = {
		'init': init,
		'update': update
	};
})(tw, d3);
