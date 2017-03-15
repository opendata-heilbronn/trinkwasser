(function (tw, d3) {
  'use strict'
// TODO - Lookup limits from Guidelines
  var nutrientLimits = {
    'hardness': 180,
    'natrium': 120,
    'kalium': 12,
    'calcium': 600,
    'magnesium': 120,
    'chlorid': 240,
    'nitrat': 60,
    'sulfat': 1600
  }

  var Bottle = function (svg) {
    var limit = 0
    var yValueStop = 265
    var yValueMaxHeight = 554
    var yValueStart = yValueStop + yValueMaxHeight

/** lines */
    var linesToDisplay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    var calculateLineY = function (lineNumber) {
      var ratio = lineNumber / 20
      var y = yValueStart - Math.round(yValueMaxHeight * ratio)
      return y - 2
    }
    var calculateLineX2 = function (lineNumber) {
      return lineNumber % 5 === 0 ? 68 : 48
    }
    var renderLines = function () {
      var gaugeLines = svg.select('.gauge-lines').selectAll('line').data(linesToDisplay)
      var enter = gaugeLines.enter().append('line')
      enter.attr('x1', 36).attr('x2', calculateLineX2)
      enter.attr('y1', calculateLineY).attr('y2', calculateLineY)
    }

/** line labels */
    var labelsToDisplay = []
    var calculateLabelY = function (label) {
      var lineNumber = (label / (limit / 4)) * 5
      return calculateLineY(lineNumber) + 6
    }
    var updateLabels = function () {
      var updateElements = function (d3Element) {
        d3Element.text(function (label) {
          return label
        }).attr('x', 78).attr('y', calculateLabelY).attr('text-anchor', 'start')
      }

      var gaugeLineLabels = svg.select('.gauge-lines').selectAll('text').data(labelsToDisplay)
      updateElements(gaugeLineLabels)
      updateElements(gaugeLineLabels.enter().append('text'))
      gaugeLineLabels.exit().remove()
    }
    var updateLabelsToDisplay = function () {
      labelsToDisplay = []
      for (var longLineNumber = 1; longLineNumber < 5; longLineNumber++) {
        labelsToDisplay.push(limit / 4 * longLineNumber)
      }
    }
    this.updateIndicator = function (value) {
      var averageIndicatorY = calculateBarY(value)
      svg.select('.average-indicator').transition().duration(300).ease('outCirc').attr('y1', averageIndicatorY).attr('y2', averageIndicatorY)
    }
    this.applyAttribute = function (nutrient) {
      limit = nutrientLimits[nutrient]
      updateLabelsToDisplay()
      updateLabels()
      svg.select('.gauge-unit').text(getUnit())
      return this
    }

/** value */
    var calculateBarY = function (value) {
      var ratio = value < 1 ? 0 : value / limit
      var y = yValueStart - Math.round(ratio * yValueMaxHeight) - 1
      return y
    }
    var calculateBarHeight = function (value) {
      var height = yValueStart - calculateBarY(value)
      return height
    }
    var updateBar = function (selector, y, height, transition) {
      var bar = svg.select(selector)
      if (transition) {
        bar = bar.transition().duration(300).ease('outCirc')
      }
      bar.attr('y', function () {
        return y
      }).attr('height', height)
    }
    var updateBars = function (value) {
      var valueHeight = calculateBarHeight(value)
      var startY = calculateBarY(0)
      var bubbleBarBreakpoint = 150

      if (valueHeight > bubbleBarBreakpoint) {
        updateBar('.gauge-value-bubble-cut', startY - bubbleBarBreakpoint, bubbleBarBreakpoint, true)
        updateBar('.gauge-value', startY - valueHeight, valueHeight - bubbleBarBreakpoint + 1, true)
      } else {
        updateBar('.gauge-value-bubble-cut', startY - valueHeight, valueHeight, true)
        updateBar('.gauge-value', startY - valueHeight, 0, true)
      }
    }
    this.applyValue = function (value) {
      updateBars(tw.utils.getMeanValue(value))
      return this
    }
    this.getValueLabel = function () {
      return ''
    }

    renderLines()
  }

  var bottleInstance = null
  var referenceWater = 'volvic'
  var valueLabel = 'Volvic'
  var attribute = null
  var selfValue = null

  var getValue = function () {
    return (referenceWater === 'self') ? selfValue : tw.data.referenceWaters[referenceWater][attribute]
  }

  var getUnit = function () {
    return attribute === 'hardness' ? '°dH' : 'mg/l'
  }

  var formatValue = function (value) {
    return value ? value.toString().replace(/\./g, ',') : '-'
  }

  var updateDescription = function () {
    d3.selectAll('.comparison-water-value').text(formatValue(tw.utils.getMeanValue(getValue())) + ' ' + getUnit())
    d3.selectAll('.comparison-water-label').text(valueLabel)
  }

  var update = function (newAttribute, value) {
    attribute = newAttribute
    selfValue = tw.utils.getMeanValue(value)

    bottleInstance.applyAttribute(attribute)
    bottleInstance.updateIndicator(selfValue)

    d3.selectAll('.comparison-water-value-self').text(formatValue(selfValue) + ' ' + getUnit())

    if (referenceWater) {
      bottleInstance.applyValue(getValue())
      updateDescription()
    }
  }

  var updateReferenceWater = function () {
    d3.select('.compare-nav').selectAll('button').classed('active', false)

    var currentElement = d3.select(this)
    currentElement.classed('active', true)
    referenceWater = currentElement.attr('data-water')
    valueLabel = currentElement.text()

    updateDescription()
    bottleInstance.applyValue(getValue())
  }

  var init = function () {
    bottleInstance = new Bottle(d3.select('.bottle-img'))
    d3.select('.compare-nav').selectAll('button').on('click', updateReferenceWater)
    return this
  }

  tw.comparison = {
    'init': init,
    'update': update
  }
})(tw, d3)
