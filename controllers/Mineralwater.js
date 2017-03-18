(function() {
    'use strict';
    var company = require('../models/Company.js');
    var product = require('../models/Product.js');
    var observation = require('../models/Observation.js');
    var Uom = require('../models/Uom.js').schema;
    var Code = require('../models/Code.js').schema;
    module.exports.get = function(req, res, next) {
        var params = req.swagger.params;
        var mg_l = new Uom.model({
          value: "mg/L",
          label: "Milligram per liter, Mass concentration unit. Conversion to SI unit: 1 kg/m3 = 10^3 mg/L"
        });
        var natrium = new Code.model({standard: 'CAS', value: "7440-23-5", label: "Sodium"});
        var kalium = new Code.model({standard: 'CAS', value: "7440-09-7", label: "Potassium"});
        var calcium = new Code.model({standard: 'CAS', value: "7440-70-2", label: "Calcium"});
        var magnesium = new Code.model({standard: 'CAS', value: "7439-95-4", label: "Magnesium"});
        var fluorid = new Code.model({standard: 'CAS', value: "16984-48-8", label: "Fluoride"});
        var chlorid = new Code.model({standard: 'CAS', value: "16887-00-6", label: "Chloride"});
        var sulfat = new Code.model({standard: 'CAS', value: "14808-79-8", label: "Sulfate"});
        var hydrogene = new Code.model({standard: 'CAS', value: "1333-74-0", label: "Hydrogen"});
        var nitrat = new Code.model({standard: 'CAS', value: "14797-55-8", label: "Nitrate"});

        var wueteria = new company.model({
          code: 'wueteria',
          name: 'Wüteria Mineralquellen GmbH & Co. KG',
          url: 'http://wueteria.de',
          country: "Germany"
        });
        var teusser = new company.model({
          code: 'teuser',
          name: 'Teusser Mineralbrunnen Karl Rössle GmbH & Co KG',
          url: 'http://wueteria.de',
          country: "Germany"
        });
        var jointhepipe = new company.model({
          code: 'jointhepipe',
          name: 'Join-The-Pipe',
          url: 'http://join-the-pipe.org/',
          country: "Netherlands"
        });
        var heiligenquelleclassic = new product.model({
          name: 'HEILIGENQUELLE CLASSIC',
          observations: [
            new observation.model({value: 10.7, uom: mg_l, eqr: natrium}),
            new observation.model({value: 2.6, uom: mg_l, eqr: kalium}),
            new observation.model({value: 118, uom: mg_l, eqr: calcium}),
            new observation.model({value: 48, uom: mg_l, eqr: magnesium}),
            new observation.model({value: 0.22, uom: mg_l, eqr: fluorid}),
            new observation.model({value: 43, uom: mg_l, eqr: chlorid}),
            new observation.model({value: 68, uom: mg_l, eqr: sulfat}),
            new observation.model({value: 455, uom: mg_l, eqr: hydrogene})
          ],
          sources: ['http://wueteria.de/unser-wasser/unsere-mineralwasserquellen/'],
          vendor: wueteria
        });
        var teussernaturell = new product.model({
          name: 'Teusser Naturell',
          observations: [
            new observation.model({value: 53, uom: mg_l, eqr: natrium}),
            new observation.model({value: 7, uom: mg_l, eqr: kalium}),
            new observation.model({value: 537, uom: mg_l, eqr: calcium}),
            new observation.model({value: 0.5, uom: mg_l, eqr: nitrat}),
            new observation.model({value: 92, uom: mg_l, eqr: magnesium}),
            new observation.model({value: 0.21, uom: mg_l, eqr: fluorid}),
            new observation.model({value: 27, uom: mg_l, eqr: chlorid}),
            new observation.model({value: 1467, uom: mg_l, eqr: sulfat}),
            new observation.model({value: 357, uom: mg_l, eqr: hydrogene})
          ],
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
