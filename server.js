/**
 * Created by PCPL_Android03 on 9/29/2016.
 */
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan      = require('morgan'); //log rquest to console

var port=5000;



//mongodb connection
var mongoose = require('mongoose');                     // mongoose for mongodb
var mongodatabaseurl=require('./database/database');//database connection

//connect mongoose databse
mongoose.connect(mongodatabaseurl.url); // connect to database
app.set('superSecret', mongodatabaseurl.secret); // secret variable

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

//app uses
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(morgan('dev'));// use morgan to log requests to the console

require('./app/api/bookapi')(app);

// routes ======================================================================
//require('./api/book')(app); //api crude using query using sql server database
//require('./api/text')(app); //read the text file

var server = app.listen(port, function () {
    console.log('Server is running..');
    console.log()
});

console.log('http://localhost:' + port);
