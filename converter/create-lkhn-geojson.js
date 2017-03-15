var fs = require('fs')
var csv = require('csv')
var async = require('async')
var nominatim = require('nominatim')

var trimAll = function (line) {
  for (var column = 0; column < line.length; column++) {
    line[column] = line[column].trim()
  }
}

var generateZoneId = function (line) {
  var idParts = []
  var addIdPart = function (value) {
    if (value && idParts.indexOf(value) < 0) {
      idParts.push(value)
    }
  }

  addIdPart(line[0])
  addIdPart(line[1])
  if (line[2]) {
    addIdPart(line[3])
  }
  return idParts.join(' ')
}

csv().from('Wasserdaten Landkreis Heilbronn.csv').to.array(function (data) {
  delete data[0]

  var locations = {}
  data.forEach(function (line) {
    trimAll(line)

    var locationName = line[0]
    if (line[2] && line[2] !== 'alle anderen Straßen') {
      locationName += ', ' + line[2]
    } else if (line[1] && line[1] !== line[0] && line[1] !== 'Kernstadt') {
      locationName += ' ' + line[1]
    }

    locations[locationName] = generateZoneId(line)
  })

  var features = []
  async.eachLimit(Object.keys(locations), 1, function (locationName, finalCallback) {
    nominatim.search({
      q: locationName
    }, function (err, opts, results) {
      if (err) {
        console.error(err)
      }
      console.log(results)
      finalCallback()
    })
  }, function () {
    console.log(features)
  })
})
