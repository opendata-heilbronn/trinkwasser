var tw = {
  data: {}
};

(function (tw, $) {
  'use strict'

  var zoneData = {}
  var zoneId = ''
  var attribute = null
  var hasSelectedFirstLocation = false
  var section = 'explanation'
  var attributes = ['natrium', 'kalium', 'calcium', 'magnesium', 'chlorid', 'nitrat', 'sulfat']

  var generateZoneId = function (city, district, streetZone) {
    var idParts = []
    var addIdPart = function (value) {
      if (value && idParts.indexOf(value) < 0) {
        idParts.push(value)
      }
    }

    addIdPart(city)
    addIdPart(district)
    addIdPart(streetZone)
    return idParts.join(' ')
  }

  var updateZoneInfo = function () {
    if (zoneData) {
      $('.zone-id').text(zoneId)
      $('.zone-data-year').text(zoneData.year)
      $('.zone-description').html(zoneData.description)
      $('.zone-about').toggle(!!((zoneData.year || zoneData.description)))
      $('.zone-year-container').toggle(!!zoneData.year)
    }
  }

  var updateDisabledTabs = function () {
    $('.nav-li-main').removeClass('disabled')
    attributes.forEach(function (attribute) {
      if (!zoneData[attribute]) {
        $('a[data-toggle="tab"][data-attribute="' + attribute + '"]').parent().addClass('disabled')
      }
    })
  }

  var updateZone = function () {
    var city = $('#city').val()
    var district = $('#district').val()
    var streetZone = $('#streetZone').val()
    var zone = streetZone ? streetZone.substr(0, streetZone.indexOf('|')) : ''

    $('.results').toggle(hasSelectedFirstLocation)
    $('.choose-location').toggle(!hasSelectedFirstLocation)
    $('body').toggleClass('state-1', !hasSelectedFirstLocation)

    if (hasSelectedFirstLocation) {
      var newZoneId = generateZoneId(city, district, zone)
      if (newZoneId !== zoneId) {
        zoneId = newZoneId
        zoneData = tw.data.zones[zoneId]
        updateZoneInfo()
        updateAttributeContent()
        updateDisabledTabs()
      }
    }
  }

  var updateAttributeContent = function () {
    if (attribute === 'info') {
      $('.result-with-value, .result-without-value').hide()
      $('.info-container').show()
    } else {
      $('.info-container').hide()

      if (zoneData && zoneData[attribute]) {
        $('.result-without-value').hide()
        $('.result-with-value').show()

        tw.gauge.update(attribute)
        if (section === 'explanation') {
          tw.gauge.updateValue(attribute, zoneData[attribute], zoneData)
        }
        if (section === 'compare') {
          tw.comparison.update(attribute, zoneData[attribute])
        }
        if (section === 'map') {
          tw.map.update(attribute)
        }
      } else {
        $('.result-with-value').hide()
        $('.result-without-value').show()
      }
    }
  }

  var setupTabs = function (startAttribute) {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      attribute = $(e.target).data('attribute')
      $('.current-attribute-label').text($(e.target).text())
      section = 'explanation'
      updateSection()
      updateAttributeContent()
    })

    var startAttributeElement = $('a[data-attribute="' + startAttribute + '"]')
    startAttributeElement.parent().addClass('active').closest('.nav-li-main').addClass('active')
    $('.current-attribute-label').text(startAttributeElement.text())
    attribute = startAttribute
  }

  var stringComparator = function (a, b) {
    a = a.toLowerCase()
    a = a.replace(/ä/g, 'a')
    a = a.replace(/ö/g, 'o')
    a = a.replace(/ü/g, 'u')
    a = a.replace(/ß/g, 's')

    b = b.toLowerCase()
    b = b.replace(/ä/g, 'a')
    b = b.replace(/ö/g, 'o')
    b = b.replace(/ü/g, 'u')
    b = b.replace(/ß/g, 's')

    return (a === b) ? 0 : (a > b) ? 1 : -1
  }

  var onSubmit = function (e) {
    e.preventDefault();
    hasSelectedFirstLocation = !!$('#city').val();
    updateZone();
  }

  var setupQuickForm = function () {
    var quickForm = $('.form-choose-location-quick')

    var bindMirrorEvent = function (attribute) {
      quickForm.find('.' + attribute).on('change', function () {
        $('#' + attribute).val($(this).val()).trigger('change')
      })
      $('#' + attribute).on('change', function () {
        quickForm.find('.' + attribute).val($(this).val())
      })
    }

    bindMirrorEvent('city')
    quickForm.on('change', onSubmit)
  }

  var setupForm = function () {
    $('#city').autocomplete({
      paramName: 'q',
      serviceUrl: 'http://open.mapquestapi.com/nominatim/v1/search.php',
      minChars: 4,
      params: {
        key:"BJlOjYiGd1RjyCk1VVDE3YLjDruBpngY",
        format:"json",
        addressdetails:"1",
        limit: 3
      },
      transformResult: function(response) {
        response = JSON.parse(response);
        return {
            suggestions: $.map(response, function(result) {
                return { value: result.display_name, data: result };
            })
        };
      },
      onSelect: function (suggestion) {
        alert('You selected: ' + suggestion.value );
      }
    });
    $('.form-choose-location').on('submit', onSubmit)
  }

  var updateSection = function () {
    $('.section').hide()
    $('.section-' + section).show()
    if ($('body').scrollTop() > $('.result-with-value').offset().top) {
      $('body').scrollTop($('.result-with-value').offset().top)
    }
  }

  var setupSectionSwitch = function () {
    $('.switch-to-section').on('click', function () {
      section = $(this).data('section')
      updateSection()
      updateAttributeContent()
    })
  }

  var completeReferenceWaters = function () {
    if(tw.data.referenceWaters){
      Object.keys(tw.data.referenceWaters).forEach(function (name) {
        var values = tw.data.referenceWaters[name]
        values.hardness = Math.round(((0.14 * values.calcium) + (0.23 * values.magnesium)) * 10) / 10
      });
    }
  }

  tw.init = function () {
    completeReferenceWaters()
    setupForm()
    setupQuickForm()
    setupTabs('natrium')
    setupSectionSwitch()
    tw.gauge.init()
    tw.comparison.init()
    tw.map.init()

    if (window.location.href.indexOf('embed') < 0) {
      $('h1').show()
    }
  }
})(tw, jQuery)
