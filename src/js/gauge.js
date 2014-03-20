(function(tw, d3) {
	'use strict';

	var GaugeGlass = function(svg) {
		var limit = 0;
		var nutrientLimits = {
			"natrium": 200,
			"kalium": 12,
			"calcium": 400,
			"magnesium": 60,
			"chlorid": 240,
			"nitrat": 60,
			"sulfat": 240
		};
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
		this.applyAttribute = function(nutrient) {
			limit = nutrientLimits[nutrient];
			updateLabelsToDisplay();
			updateLabels();
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
			document.getElementsByClassName('gauge-glass-img')[0].style.display = '';
			return this;
		};
		this.hide = function() {
			document.getElementsByClassName('gauge-glass-img')[0].style.display = 'none';
			return this;
		};

		renderLines();
	};

	var GaugeBar = function(svg) {
		var attribute = 'hardness', value = 0;
		var totalHeight = 600;
		var defs = {
			'hardness': {
				'min': 0,
				'max': 28,
				'parts': [{
					'id': 1,
					'y': 420,
					'height': 180,
					'label': 'weich',
					'rangeLabel': '&lt; 8,4 °dH',
				}, {
					'id': 2,
					'y': 300,
					'height': 120,
					'label': 'mittel',
					'rangeLabel': '8,4 - 14 °dH',
				}, {
					'id': 3,
					'y': 0,
					'height': 300,
					'label': 'hart',
					'rangeLabel': '&gt; 14 °dH',
				}]
			}
		};

		/** attribute */
		var updatePartLabels = function() {
			var calculatY = function(partDef) {
				return (partDef.height / 2) - 12 + partDef.y;
			};
			var updateElements = function(d3Element) {
				d3Element.attr('y', calculatY).attr('transform', function(partDef) {
					return 'rotate(-90,23,' + calculatY(partDef) + ')';
				}).attr('x', 23).attr('text-anchor', 'middle').html(function(partDef) {
					return '<tspan x="10" dy="1.2em">' + partDef.rangeLabel + '</tspan><tspan x="10" dy="1.2em">' + partDef.label + '</tspan>';
				});
			};

			var barLabels = svg.select('.gauge-bar-labels').selectAll('text').data(defs[attribute].parts);
			updateElements(barLabels);
			updateElements(barLabels.enter().append('text'));
			barLabels.exit().remove();
		};
		var resizeParts = function() {
			var updateElements = function(d3Element) {
				d3Element.attr('y', function(partDef) {
					return partDef.y;
				}).attr('height', function(partDef) {
					return partDef.height;
				}).attr('class', function(partDef) {
					return 'gauge-bar-' + partDef.id;
				}).attr('x', 50).attr('width', 25);
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
		var calculateValueY = function(valueNumber) {
			return totalHeight - (totalHeight / (defs[attribute].max - defs[attribute].min) * valueNumber);
		};
		var updateBallPosition = function() {
			svg.select('.gauge-bar-ball').transition().duration(300).ease('outCirc').attr('cy', calculateValueY(tw.utils.getMeanValue(value)));
		};
		var updateRangeIndicatorPosition = function() {
			var value1 = value, value2 = value;
			if (tw.utils.isRange(value)) {
				var range = tw.utils.getRange(value);
				value1 = range[0], value2 = range[1];
			}
			var value1Y = calculateValueY(value1), value2Y = calculateValueY(value2);
			svg.select('.gauge-bar-range-indicator').attr('y', value2Y).attr('height', (value1Y - value2Y));
		};
		this.applyValue = function(newValue) {
			value = newValue;
			updateBallPosition();
			updateRangeIndicatorPosition();
			return this;
		};
		this.getValueLabel = function() {
			var matchingPart = {}, valueY = calculateValueY(tw.utils.getMeanValue(value));
			defs[attribute].parts.forEach(function(part) {
				if ((part.y + part.height) >= valueY) {
					matchingPart = part;
				}
			});
			return matchingPart.label;
		};

		/** display */
		this.show = function() {
			document.getElementsByClassName('gauge-bar-img')[0].style.display = '';
			return this;
		};
		this.hide = function() {
			document.getElementsByClassName('gauge-bar-img')[0].style.display = 'none';
			return this;
		};
	};

	var glassInstance = null;
	var barInstance = null;

	var toggleDescription = function(attribute, value, valueLabel) {
		var elements = document.getElementsByClassName('gauge-description');
		for ( var i = 0; i < elements.length; ++i) {
			elements[i].style.display = 'none';
		}

		var attributeElement = document.getElementsByClassName('gauge-description-' + attribute)[0];
		attributeElement.style.display = '';
		attributeElement.getElementsByClassName('value')[0].innerHTML = value.toString().replace(/\./g, ',');

		var valueLabelElement = attributeElement.getElementsByClassName('value-label');
		if (valueLabelElement[0]) {
			valueLabelElement[0].innerHTML = valueLabel;
		}
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
