/**
 * Contains individual observations regarding water quality
 * Can also be from the label of bottled water (official producer values)
 *
 */

(function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var Uom = require('./Uom.js').schema;
    var Code = require('./Code.js').schema;
    var schema = new mongoose.Schema({
        value: Number,
        uom: {type: Schema.ObjectId, ref: 'Uom'},
        code: {type: Schema.ObjectId, ref: 'Code'},
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = schema;
    exports.model = mongoose.model('Observation', schema);
}());
