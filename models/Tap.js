(function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var Operator = require('./Company.js').schema;
    var schema = new mongoose.Schema({
        operator: {type: Schema.ObjectId, ref: 'Operator'},
        name: String,
        location: {type: [Number], index: '2d'},
        type: {
          type: String,
          enum: ['Tap', 'Pump'],
        },
        access: {
          type: String,
          enum: ['Free', 'Commercial'],
        },
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = schema;
    exports.model = mongoose.model('Tap', schema);
}());
