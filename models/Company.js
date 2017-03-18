(function() {
    var mongoose = require('mongoose');
    var Product = require('./Product.js').schema;
    var Schema = new mongoose.Schema({
        code: String,
        name: String,
        url: String,
        country: String,
        entered_at: {type: Date, required: true, default: Date}
    });
    exports.schema = Schema;
    exports.model = mongoose.model('Vendor', Schema);
}());
