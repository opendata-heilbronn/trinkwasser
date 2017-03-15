(function (tw, $) {
  'use strict'

  var isRange = function (value) {
    return value.toString().indexOf('-') > -1
  }

  var getRange = function (value) {
    var indexOfHyphen = value.indexOf('-')
    var min = parseInt(value.substr(0, indexOfHyphen), 10)
    var max = parseInt(value.substr(indexOfHyphen + 1), 10)
    return [min, max]
  }

  var getMeanValue = function (value) {
    if (!value || !isRange(value)) {
      return value
    }
    var minMax = getRange(value)
    return minMax[0] + ((minMax[1] - minMax[0]) / 2)
  }

  var returnArgument = function (d) {
    return d
  }

  tw.utils = {
    'isRange': isRange,
    'getRange': getRange,
    'getMeanValue': getMeanValue,
    'returnArgument': returnArgument
  }
})(tw, jQuery)
