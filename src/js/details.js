(function(tw, $) {
	'use strict';

	var update = function(attribute) {
		tw.gauge.update(attribute);
	};

	var setupTabs = function(startAttribute) {
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			var attribute = $(e.target).data('attribute');
			update(attribute);
		});
		$('a[data-attribute="' + startAttribute + '"]').parent().addClass('active').closest('.nav-li-main').addClass('active');
	};

	var init = function() {
		var startAttribute = 'nitrat';
		setupTabs(startAttribute);
		tw.gauge.init().update(startAttribute);
		tw.barChart.init().update();
	};

	tw.details = {
		'init': init
	};
})(tw, jQuery);
