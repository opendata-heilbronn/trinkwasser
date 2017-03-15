(function() {
    'use strict';
    var vendor = require('../models/Vendor.js');
    var product = require('../models/Product.js');

    module.exports.get = function(req, res, next) {
        var params = req.swagger.params;
        var wueteria = new vendor.model({
          name: 'Wüteria Mineralquellen GmbH & Co. KG',
          url: 'http://wueteria.de',
          country: "Germany"
        });
        var prod = new product.model({
          name: 'HEILIGENQUELLE CLASSIC',
          natrium: 10.7,
          kalium: 2.6,
          calcium: 118,
          magnesium: 48,
          fluorid: 0.22,
          chlorid: 43,
          sulfat: 68,
          hydrogene: 455,
          sources: ['http://wueteria.de/unser-wasser/unsere-mineralwasserquellen/'],
          vendor: wueteria
        });
        var output = wueteria.toObject();
        output.products = [prod.toObject()];
        res.setHeader('content-type', 'application/json');
        res.setHeader('charset','utf-8');
        res.end(JSON.stringify(output, null, 2));
    };

    module.exports.post = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "POST"}, null, 2));
    };

    module.exports.put = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "PUT"}, null, 2));
    };
    module.exports.delete = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
    };
}());
