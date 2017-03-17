(function () {
  'use strict'
  module.exports.get = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'GET'}, null, 2))
  }

  module.exports.post = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'POST'}, null, 2))
  }

  module.exports.put = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'PUT'}, null, 2))
  }
  module.exports.delete = function (req, res, next) {
    var params = req.swagger.params
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({'operation': 'DELETE'}, null, 2))
  }
}())
