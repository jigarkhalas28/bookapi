/**
 * Created by PCPL_Android03 on 9/30/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define model ================================================================
module.exports = mongoose.model('BookModal',new Schema({
    title: String,
    author: String,
    publisher: String,
    isbn: String
}));
