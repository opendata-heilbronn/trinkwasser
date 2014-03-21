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

	var updateZoneInfo = function() {
		if (zoneData) {
			console.log(zoneData);
			$('.zone-id').text(zoneId);
			$('.zone-data-year').text(zoneData.year);
			$('.zone-description').text(zoneData.description);
			$('.zone-about').toggle((zoneData.year || zoneData.description) ? true : false);
			$('.zone-year-container').toggle(zoneData.year ? true : false);
		}
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
				updateZoneInfo();
				updateAttributeContent();
			}
		}
	};

	var updateAttributeContent = function() {
		if (attribute === 'info') {
			$('.result-with-value, .result-without-value').hide();
			$('.info-container').show();
		} else {
			$('.info-container').hide();

			if (zoneData && zoneData[attribute]) {
				$('.result-without-value').hide();
				$('.result-with-value').show();
				tw.gauge.update(attribute, zoneData[attribute]);
				tw.barChart.update(attribute, zoneData[attribute], zoneId);
			} else {
				$('.result-with-value').hide();
				$('.result-without-value').show();
			}
		}
	};

	var setupTabs = function(startAttribute) {
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			attribute = $(e.target).data('attribute');
			$('.current-attribute-label').text($(e.target).text());
			updateAttributeContent();
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

	var stringComparator = function(a, b) {
		a = a.toLowerCase();
		a = a.replace(/ä/g, "a");
		a = a.replace(/ö/g, "o");
		a = a.replace(/ü/g, "u");
		a = a.replace(/ß/g, "s");

		b = b.toLowerCase();
		b = b.replace(/ä/g, "a");
		b = b.replace(/ö/g, "o");
		b = b.replace(/ü/g, "u");
		b = b.replace(/ß/g, "s");

		return (a == b) ? 0 : (a > b) ? 1 : -1;
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
			if (city === 'Heilbronn') {
				var allStreets = {};
				Object.keys(streets).forEach(function(zone) {
					streets[zone].forEach(function(street) {
						allStreets[street] = zone;
					});
				});
				var allStreetNames = Object.keys(allStreets);
				allStreetNames.sort(stringComparator);
				allStreetNames.forEach(function(streetName) {
					html += '<option value="' + allStreets[streetName] + '">' + streetName + '</option>';
				});
			} else {
				Object.keys(streets).forEach(function(zone) {
					html += '<optgroup label="' + zone + '">';
					streets[zone].forEach(function(street) {
						html += '<option value="' + zone + '">' + street + '</option>';
					});
					html += '</optgroup>';
				});
			}
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