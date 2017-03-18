/**
 * Taken from the WISE Code lists
 * http://www.eea.europa.eu/data-and-maps/data/waterbase-water-quality#tab-additional-information
 *
 * Code list FieldName: observedPropertyDeterminandCode
 */
(function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var schema = new mongoose.Schema({
        standard: {
          type: String,
          enum: ['CAS', 'EC', 'ICSC', 'RTECS', 'UN', 'UNII', 'EEA'],
        },
        value: String,
        label: String,
        definition: String,
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = schema;
    exports.model = mongoose.model('EQR', schema);
}());
