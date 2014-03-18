(function(tw, $) {
	'use strict';

	var isRange = function(value) {
		return value.indexOf('-') > -1;
	};

	var getRange = function(value) {
		var indexOfHyphen = value.indexOf('-');
		var min = parseInt(value.substr(0, indexOfHyphen), 10);
		var max = parseInt(value.substr(indexOfHyphen + 1), 10);
		return [min, max];
	};

	tw.utils = {
		'isRange': isRange,
		'getRange': getRange
	};
})(tw, jQuery);
