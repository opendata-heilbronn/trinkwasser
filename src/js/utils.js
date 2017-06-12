// Initialize our namespace
var tw = tw || { data: {}};

(function (tw, $) {
  'use strict';

  /**
   * Get the language from the path
   */
  var getLang = function(){
    var pathArray = window.location.pathname.split( '/' );
    //get the two letter code from the array
    for (var i = 0; i < pathArray.length; i++) {
      if(pathArray[i].length === 2){
        return pathArray[i];
      }
    }
    return 'en'; //Default language
  };

  /**
   * Get the List of products (bottled water)
   * @param {function} callback function to pass the result to
   */
  var getProducts = function(callback){
    //Get the zone for the current location.
    $.getJSON(tw.config.api_endpoint + '/products',{lang: getLang()}, function(data){
      if (data) {
        data.forEach(function (attribute) {
          //create a tab for each observation
          $('#products').append('<button type="button" class="btn btn-primary btn-lg btn-block" data-water="' + attribute.id + '">' + attribute.name +
          //'<br /><small class="vendor-small">' + attribute.vendor.name + '</small>' +
          '</button>');
        });
        callback(data);
      }
    });
  };

  /**
   * Get the averages of all substances.
   * @param {function} callback function to pass the result to
   */
  var getAverages = function (callback) {
    $.getJSON(tw.config.api_endpoint + '/observations/average',{lang: getLang()}, function(data){
      if (data) {
        callback(data);
      }
    });
  };

  /**
   * Get the legal limits for the given location, let us default to EU for now.
   * @param {string} code the code to retrieve the values from
   * @param {function} callback function to pass the result to
   */
  var getLimits = function (code, callback) {
    $.getJSON(tw.config.api_endpoint + '/limit',{code: code, lang: getLang()}, function(data){
      if (data) {
        callback(data);
      }
    });
  };

  /**
   * Get the value for a limit from tw.data.limits
   */
  var getLimit = function(nutrient, type) {
    for (var i = 0; i < tw.data.limits.length; i++) {
      if(tw.data.limits[i].code === nutrient){
        switch(type){
          case 'label':
            return tw.data.limits[i].value.toFixed(2) + " " + tw.data.limits[i].uom;
          case 'object':
            return tw.data.limits[i];
          default:
            return tw.data.limits[i].value;
        }
      }
    }
    return; //Not found
  };

  /**
   * Get the value for a observation from tw.data.report
   */
  var getValue = function(nutrient, asLabel) {
    for (var i = 0; i < tw.data.report.observations.length; i++) {
      if(tw.data.report.observations[i].code === nutrient){
        if(asLabel){
          return tw.data.report.observations[i].value.toFixed(2) +
            " " +
            tw.data.report.observations[i].uom;
        }
        return tw.data.report.observations[i].value;
      }
    }
    return; //Not found
  };

  /**
   * Get the value for a observation from tw.data.report
   */
  var getProductValue = function(nutrient, product, type) {
    for (var i = 0; i < product.observations.length; i++) {
      if(product.observations[i].code === nutrient){
        switch(type){
          case 'label':
            return product.observations[i].value.toFixed(2) +
              " " +
              product.observations[i].uom;
          case 'object':
            return product.observations[i];
          default:
            return product.observations[i].value;
        }
      }
    }
    return; //Not found
  };

  /**
   * Get the legal limits for the given location, let us default to EU for now.
   * @param {float} lat latitude of the user location
   * @param {float} lon longitude of the user location
   * @param {function} callback function to pass the result to
   */
  var getProduct = function (id, callback) {
    $.getJSON(tw.config.api_endpoint + '/product/' + id, {lang: getLang()}, function(data){
        callback(data);
    });
  };

  /**
   * Get the legal limits for the given location, let us default to EU for now.
   * @param {float} lat latitude of the user location
   * @param {float} lon longitude of the user location
   * @param {function} callback function to pass the result to
   */
  var getReport = function (lat, lon, callback) {
    lat = lat || 49.1925;
    lon = lon || 9.2254;
    $.getJSON(tw.config.api_endpoint + '/report',{lat: lat, lon: lon, lang: getLang()}, function(data){
      if (data.zone) {
        $('.zone-id').text(data.zone.name);
        $('.zone-data-year').text(data.year);
        $('.zone-description').html(data.description);
        $('.zone-about').toggle(!!((data.year || data.description)));
        $('.zone-year-container').toggle(!!data.year);
        $('.nav-li-main').removeClass('disabled');
        data.observations.forEach(function (attribute) {
          //create a tab for each observation
          $('#observations').append('<li class="nav-li-main"><a data-toggle="tab" data-attribute="' + attribute.code + '">' + attribute.code + '</a></li>');
        });
        callback(data);
      } else {
        callback();
      }
    });
  };

  /**
   *
   * @param {*} value
   */
  var isRange = function (value) {
    return value.toString().indexOf('-') > -1;
  };

  /**
   *
   * @param {*} value
   */
  var getRange = function (value) {
    var indexOfHyphen = value.indexOf('-');
    var min = parseInt(value.substr(0, indexOfHyphen), 10);
    var max = parseInt(value.substr(indexOfHyphen + 1), 10);
    return [min, max];
  };

  /**
   *
   * @param {*} value
   */
  var getMeanValue = function (value) {
    var temp = 0;
    if (value || !isRange(value)) {
      temp = value;
    } else {
      var minMax = getRange(value);
      temp = minMax[0] + ((minMax[1] - minMax[0]) / 2);
    }
    return temp;
  };

  /**
   *
   * @param {*} d
   */
  var returnArgument = function (d) {
    return d;
  };

  /**
   * Where does this formula originate from?
   * http://www.who.int/water_sanitation_health/dwq/chemicals/hardness.pdf
   * @param {*} calcium
   * @param {*} magnesium
   */
  var calculateHardness = function(calcium, magnesium){
    return Math.round(((0.14 * calcium) + (0.23 * magnesium)) * 10) / 10;
  };

  /**
   * Initialize the utils module
   */
  tw.utils = {
    'getLimits': getLimits,
    'getLimit': getLimit,
    'getLang': getLang,
    'getValue': getValue,
    'getProductValue': getProductValue,
    'getAverages': getAverages,
    'getProducts': getProducts,
    'getProduct': getProduct,
    'getReport': getReport,
    'isRange': isRange,
    'getRange': getRange,
    'getMeanValue': getMeanValue,
    'returnArgument': returnArgument,
    'calculateHardness': calculateHardness
  };
})(tw, jQuery);
