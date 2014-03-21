var tw = {
	data: {}
};

(function(tw, $) {
	'use strict';

	var zoneData = {}, zoneId = '', attribute = null, hasSelectedFirstLocation = false;

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

		$('.results').toggle(hasSelectedFirstLocation);
		$('.choose-location').toggle(!hasSelectedFirstLocation);

		if (hasSelectedFirstLocation) {
			var newZoneId = generateZoneId(city, district, streetZone);
			if (newZoneId !== zoneId) {
				zoneId = newZoneId;
				zoneData = tw.data.zones[zoneId];
				updateResult();
			}
		}

	};

	var updateResult = function() {
		if (zoneData && zoneData[attribute]) {
			$('.result-without-value').hide();
			$('.result-with-value').show();
			tw.gauge.update(attribute, zoneData[attribute]);
			tw.barChart.update(attribute, zoneData[attribute], zoneId);
		} else {
			$('.result-with-value').hide();
			$('.result-without-value').show();
		}
	};

	var setupTabs = function(startAttribute) {
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			attribute = $(e.target).data('attribute');
			$('.current-attribute-label').text($(e.target).text());
			updateResult();
		});

		var startAttributeElement = $('a[data-attribute="' + startAttribute + '"]');
		startAttributeElement.parent().addClass('active').closest('.nav-li-main').addClass('active');
		$('.current-attribute-label').text(startAttributeElement.text());
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
		var districts = city ? Object.keys(tw.data.locations[city]) : [];

		if (districts.length < 2) {
			$('.select-district').hide();
			$('.district').html('');
		} else {
			$('.district').html(generateOptionsHtml(districts));
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

		var streets = city ? tw.data.locations[city][district] : {};
		if (!streets || Object.keys(streets).length <= 0) {
			$('.select-street').hide();
			$('.streetZone').html('');
		} else {
			var html = '';
			Object.keys(streets).forEach(function(zone) {
				html += '<optgroup label="' + zone + '">';
				streets[zone].forEach(function(street) {
					html += '<option value="' + zone + '">' + street + '</option>';
				});
				html += '</optgroup>';
			});
			$('.streetZone').html(html);
			$('.select-street').show();
		}
	};

	var onSubmit = function() {
		hasSelectedFirstLocation = $('#city').val() ? true : false;
		updateZone();
		return false;
	};

	var setupQuickForm = function() {
		var quickForm = $('.form-choose-location-quick');

		var bindMirrorEvent = function(attribute) {
			quickForm.find('.' + attribute).on('change', function() {
				$('#' + attribute).val($(this).val()).trigger('change');
			});
			$('#' + attribute).on('change', function() {
				quickForm.find('.' + attribute).val($(this).val());
			});
		};

		bindMirrorEvent('city');
		bindMirrorEvent('district');
		bindMirrorEvent('streetZone');
		quickForm.on('change', onSubmit);
	};

	var setupForm = function() {
		$('#city').on('change', updateFormDistricts);
		$('#district').on('change', updateFormStreetZones);
		$('#streetZone').on('change', updateZone);
		$('.form-choose-location').on('submit', onSubmit);

		var cities = Object.keys(tw.data.locations);
		$('.city').html(generateOptionsHtml(cities, true));
	};

	var setupSectionSwitch = function() {
		$('.switch-to-section').on('click', function() {
			$('.section').hide();
			$('.section-' + $(this).data('section')).show();

			$('.switch-to-section').removeClass('active');
			$(this).addClass('active');
		});
	};

	var completeReferenceWaters = function() {
		Object.keys(tw.data.referenceWaters).forEach(function(name) {
			var values = tw.data.referenceWaters[name];
			values.hardness = Math.round(((0.14 * values.calcium) + (0.23 * values.magnesium)) * 10) / 10;
		});
	};

	tw.init = function() {
		completeReferenceWaters();
		setupForm();
		setupQuickForm();
		setupTabs('hardness');
		setupSectionSwitch();
		tw.gauge.init();
		tw.barChart.init();
		tw.map.init();
		$('.city').val('Erlenbach').trigger('change');
	};
})(tw, jQuery);