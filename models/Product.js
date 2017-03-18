/**
 * Bottled water product
 * This is basically a set of observation from labels on the bottle
 */
(function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var Vendor = require('./Company.js').schema;
    var Observation = require('./Observation.js').schema;
    var schema = new mongoose.Schema({
        vendor: {type: Schema.ObjectId, ref: 'Vendor'}, //Company/Vendor that produces this bottled water
        observations: [{type: Schema.ObjectId, ref: 'Observation'}], //Array of water quality indicators from the bottle label
        volume: Number, //The content volume in liters of the bottle
        sources: Array, //url references to sources for this information
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = schema;
    exports.model = mongoose.model('Product', schema);
}());
