(function(tw, $) {
	'use strict';

	var update = function(attribute) {
		tw.gauge.update(attribute);
	};

	var setupTabs = function() {
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			var attribute = $(e.target).data('attribute');
			update(attribute);
		});
	};

	var init = function() {
		setupTabs();
		tw.gauge.init().update('natrium');
	};

	tw.details = {
		'init': init
	};
})(tw, jQuery);
