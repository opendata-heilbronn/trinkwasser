(function() {
    'use strict';
    var vendor = require('../models/Vendor.js');
    var product = require('../models/Product.js');

    module.exports.get = function(req, res, next) {
        var params = req.swagger.params;
        var wueteria = new vendor.model({
          code: 'wueteria',
          name: 'Wüteria Mineralquellen GmbH & Co. KG',
          url: 'http://wueteria.de',
          country: "Germany"
        });
        var teusser = new vendor.model({
          code: 'teuser',
          name: 'Teusser Mineralbrunnen Karl Rössle GmbH & Co KG',
          url: 'http://wueteria.de',
          country: "Germany"
        });
        var heiligenquelleclassic = new product.model({
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
        var teussernaturell = new product.model({
          name: 'Teusser Naturell',
          natrium: 53,
          kalium: 7,
          calcium: 537,
          nitrat: 0.5,
          magnesium: 92,
          fluorid: 0.21,
          chlorid: 27,
          sulfat: 1462,
          hydrogene: 357,
          sources: ['http://www.teusser.de/index.php?id=225'],
          vendor: teusser
        });

        var output = [heiligenquelleclassic.toObject(), teussernaturell.toObject()];
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
