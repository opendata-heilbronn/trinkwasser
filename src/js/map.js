(function (tw, d3) {
  'use strict'

  var areaData = null
  var zoneData = null

  var Map = function (svg) {
    var width = 1170
    var height = 1170
    var center = [9.171, 49.16]
    var scale = 400
    var offset = [width / 2, height / 2]
    var projection = d3.geo.mercator().scale(scale).center(center).translate(offset)
    var path = d3.geo.path().projection(projection)

    var bounds = path.bounds(areaData)
    var hscale = scale * width / (bounds[1][0] - bounds[0][0])
    var vscale = scale * height / (bounds[1][1] - bounds[0][1])
    scale = (hscale < vscale) ? hscale : vscale
    offset = [width - (bounds[0][0] + bounds[1][0]) / 2, height - (bounds[0][1] + bounds[1][1]) / 2]

    projection = d3.geo.mercator().center(center).scale(scale).translate(offset)
    path = path.projection(projection)

    svg.select('.areas').selectAll('path').data(areaData.features).enter().append('path').attr('d', path)

    var z = d3.scale.linear().domain([9, 16]).range(['#2166ac', '#b2182b'])
    svg.select('.zones').selectAll('path').data(zoneData.features).enter().append('path').attr('d', path).attr('stroke', function (d) {
      return z(tw.utils.getMeanValue(d.properties.haertegrad))
    })

    var hnZones = {
      '14-18': tw.data.zones['Heilbronn 14-18'],
      '14': tw.data.zones['Heilbronn 14'],
      '10': tw.data.zones['Heilbronn 10'],
      '9': tw.data.zones['Heilbronn 9']
    }

    this.update = function (attribute) {
      var values = []
      Object.keys(hnZones).forEach(function (hnZone) {
        values.push(tw.utils.getMeanValue(hnZones[hnZone][attribute]))
      })

      z = d3.scale.linear().domain([d3.min(values), d3.max(values)]).range(['#2166ac', '#b2182b'])
      svg.select('.zones').selectAll('path').transition().duration(300).ease('outCirc').attr('stroke', function (d) {
        var hnZone = hnZones[d.properties.haertegrad]
        if (hnZone) {
          return z(tw.utils.getMeanValue(hnZone[attribute]))
        }
      })
    }
  }

  var mapInstance = null

  var init = function () {
    $.getJSON('data/gemeinden_simplify20_hn.geojson', function (data) {
      areaData = data
      $.getJSON('data/hn-streets.geojson', function (hnData) {
        zoneData = hnData
        mapInstance = new Map(d3.select('.map-img'))
      })
    })
    return this
  }

  var update = function (attribute) {
    if (mapInstance) {
      mapInstance.update(attribute)
    }
  }

  tw.map = {
    'init': init,
    'update': update
  }
})(tw, d3)
