var tw = {
	data: {}
};

(function(tw, $) {
	'use strict';

	var zoneData = {}, zoneId = '', attribute = null;

	var generateZoneId = function(city, district, streetZone) {
		var idParts = [];
		var addIdPart = function(value) {
			if (value && idParts.indexOf(value) < 0) {
				idParts.push(value);
			}
		};

		addIdPart(city);
		addIdPart(district);
		addIdPart(streetZone);
		return idParts.join(' ');
	};

	var updateZone = function() {
		var city = $('#city').val();
		var district = $('#district').val();
		var streetZone = $('#streetZone').val();

		var newZoneId = generateZoneId(city, district, streetZone);
		if (newZoneId !== zoneId) {
			zoneId = newZoneId;
			zoneData = tw.data.zones[zoneId];
			updateResult();
		}
	};

	var updateResult = function() {
		$('.results').toggle(zoneData && Object.keys(zoneData).length > 0);

		if (zoneData[attribute]) {
			$('.result-without-value').hide();
			$('.result-with-value').show();
			tw.gauge.update(attribute, zoneData[attribute]);
			tw.barChart.update();
		} else {
			$('.result-with-value').hide();
			$('.result-without-value').show();
		}
	};

	var setupTabs = function(startAttribute) {
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			attribute = $(e.target).data('attribute');
			updateResult();
		});
		$('a[data-attribute="' + startAttribute + '"]').parent().addClass('active').closest('.nav-li-main').addClass('active');
		attribute = startAttribute;
	};

	var generateOptionsHtml = function(values, withEmptyOption) {
		var html = withEmptyOption ? '<option value="">Bitte auswählen</option>' : '';
		values.forEach(function(value) {
			html += '<option value="' + value + '">' + value + '</option>';
		});
		return html;
	};

	var updateFormDistricts = function() {
		var city = $('#city').val();
		var districts = Object.keys(tw.data.locations[city]);

		if (districts.length < 2) {
			$('.select-district').hide();
			$('#district').html('');
		} else {
			$('#district').html(generateOptionsHtml(districts));
			$('.select-district').show();
		}

		updateFormStreetZones();
	};

	var updateFormStreetZones = function() {
		var city = $('#city').val();
		var district = $('#district').val();
		if (!district) {
			district = '';
		}

		var streets = tw.data.locations[city][district];
		if (!streets || Object.keys(streets).length <= 0) {
			$('.select-street').hide();
			$('#streetZone').html('');
		} else {
			var html = '';
			Object.keys(streets).forEach(function(zone) {
				html += '<optgroup label="' + zone + '">';
				streets[zone].forEach(function(street) {
					html += '<option value="' + zone + '">' + street + '</option>';
				});
				html += '</optgroup>';
			});
			$('#streetZone').html(html);
			$('.select-street').show();
		}

		updateZone();
	};

	var setupForm = function() {
		$('#city').on('change', updateFormDistricts);
		$('#district').on('change', updateFormStreetZones);
		$('#streetZone').on('change', updateZone);

		var cities = Object.keys(tw.data.locations);
		$('#city').html(generateOptionsHtml(cities, true));
	};

	tw.init = function() {
		setupForm();
		setupTabs('hardness');
		tw.gauge.init();
		tw.barChart.init();
	};
})(tw, jQuery);