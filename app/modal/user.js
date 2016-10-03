/**
 * Created by PCPL_Android03 on 9/30/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));
