// Initialize our namespace
var tw = tw || { data: {}};

(function (tw, d3) {
  'use strict';
  var bottleInstance;
  var referenceWater;
  var valueLabel;
  var attribute;
  var selfValue;
  var Bottle = function (svg) {
    var limit = 0;
    var yValueStop = 265;
    var yValueMaxHeight = 554;
    var yValueStart = yValueStop + yValueMaxHeight;


    /** Bottle lines */
    var linesToDisplay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    var calculateLineY = function (lineNumber) {
      var ratio = lineNumber / 20;
      var y = yValueStart - Math.round(yValueMaxHeight * ratio);
      return y - 2;
    };

    var calculateLineX2 = function (lineNumber) {
      return lineNumber % 5 === 0 ? 68 : 48;
    };
    var renderLines = function () {
      var gaugeLines = svg.select('.gauge-lines').selectAll('line').data(linesToDisplay);
      var enter = gaugeLines.enter().append('line');
      enter.attr('x1', 36).attr('x2', calculateLineX2);
      enter.attr('y1', calculateLineY).attr('y2', calculateLineY);
    };

    /** Bottle line labels */
    var labelsToDisplay = [];
    var calculateLabelY = function (label) {
      var lineNumber = (label / (limit / 4)) * 5;
      return calculateLineY(lineNumber) + 6;
    };

    var updateLabels = function () {
      var updateElements = function (d3Element) {
        d3Element.text(function (label) {
          return label;
        }).attr('x', 78).attr('y', calculateLabelY).attr('text-anchor', 'start');
      };

      var gaugeLineLabels = svg.select('.gauge-lines').selectAll('text').data(labelsToDisplay);
      updateElements(gaugeLineLabels);
      updateElements(gaugeLineLabels.enter().append('text'));
      gaugeLineLabels.exit().remove();
    };

    var updateLabelsToDisplay = function () {
      labelsToDisplay = [];
      for (var longLineNumber = 1; longLineNumber < 5; longLineNumber++) {
        labelsToDisplay.push(limit / 4 * longLineNumber);
      }
    };

    this.updateIndicator = function (value) {
      var averageIndicatorY = calculateBarY(value);
      svg.select('.average-indicator').transition().duration(300).ease('outCirc').attr('y1', averageIndicatorY).attr('y2', averageIndicatorY);
    };


    this.applyAttribute = function (nutrient) {
      var temp = tw.utils.getLimit(nutrient, 'object');
      limit = temp.value;
      if (limit) {
        updateLabelsToDisplay();
        updateLabels();
        svg.select('.gauge-unit').text(temp.uom);
      }
      return this;
    };

    /** Bottle value */
    var calculateBarY = function (value) {
      var ratio = value < 1 ? 0 : value / limit;
      var y = yValueStart - Math.round(ratio * yValueMaxHeight) - 1;
      return y;
    };

    var calculateBarHeight = function (value) {
      var height = yValueStart - calculateBarY(value);
      return height;
    };

    var updateBar = function (selector, y, height, transition) {
      var bar = svg.select(selector);
      if (transition) {
        bar = bar.transition().duration(300).ease('outCirc');
      }
      bar.attr('y', function () {
        return y;
      }).attr('height', height);
    };

    var updateBars = function (value) {
      var valueHeight = calculateBarHeight(value);
      var startY = calculateBarY(0);
      var bubbleBarBreakpoint = 150;

      if (valueHeight > bubbleBarBreakpoint) {
        updateBar('.gauge-value-bubble-cut', startY - bubbleBarBreakpoint, bubbleBarBreakpoint, true);
        updateBar('.gauge-value', startY - valueHeight, valueHeight - bubbleBarBreakpoint + 1, true);
      } else {
        updateBar('.gauge-value-bubble-cut', startY - valueHeight, valueHeight, true);
        updateBar('.gauge-value', startY - valueHeight, 0, true);
      }
    };

    this.applyValue = function (value) {
      updateBars(tw.utils.getMeanValue(value));
      return this;
    };
    renderLines();
  };

  var getValue = function (type, callback) {
    tw.utils.getProduct(referenceWater, function(data){
      callback(tw.utils.getProductValue(attribute, data, type));
    });
  };

  var updateDescription = function () {
    getValue('label', function(result){
      if(result){
        d3.selectAll('.comparison-water-value').text(result);
        d3.selectAll('.comparison-water-label').text(valueLabel);
      } else {
        d3.selectAll('.comparison-water-label').text(valueLabel);
        d3.selectAll('.comparison-water-value').text('-');
      }
    });
  };

  var update = function (newAttribute, value) {
    attribute = newAttribute;
    selfValue = tw.utils.getMeanValue(value);

    bottleInstance.applyAttribute(attribute);
    bottleInstance.updateIndicator(selfValue);

    d3.selectAll('.comparison-water-value-self').text(tw.utils.getValue(attribute, 'label'));

    if (referenceWater) {
      getValue(null, function(result){
        if(result){
          bottleInstance.applyValue(result);
          updateDescription();
        } else {
          bottleInstance.applyValue(0);
          updateDescription();
        }
      });
    }
  };

  var updateReferenceWater = function () {
    d3.select('.compare-nav').selectAll('button').classed('active', false);

    var currentElement = d3.select(this);
    currentElement.classed('active', true);
    referenceWater = currentElement.attr('data-water');
    valueLabel = currentElement.text();
    if (referenceWater) {
      getValue(null, function(result){
        if(result){
          bottleInstance.applyValue(result);
          updateDescription();
        } else {
          bottleInstance.applyValue(0);
          updateDescription();
        }
      });
    }
  };

  var init = function () {
    bottleInstance = new Bottle(d3.select('.bottle-img'));
    d3.select('.compare-nav').selectAll('button').on('click', updateReferenceWater);
    return this;
  };

  /**
   * Initialize the comparison module
   */
  tw.comparison = {
    'init': init,
    'update': update
  };

})(tw, d3);
