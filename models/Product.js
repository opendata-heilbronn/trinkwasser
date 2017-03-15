(function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var Vendor = require('./Vendor.js').schema;
    var schema = new mongoose.Schema({
        vendor: {type: Schema.ObjectId, ref: 'Vendor'},
        name: String,
        natrium: Number,
        kalium: Number,
        calcium: Number,
        magnesium: Number,
        fluorid: Number,
        chlorid: Number,
        nitrat: Number,
        sulfat: Number,
        hydrogene: Number,
        sources: Array,
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = schema;
    exports.model = mongoose.model('Product', schema);
}());
