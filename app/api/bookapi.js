/**
 * Created by PCPL_Android03 on 9/30/2016.
 */

var BookModal = require('../modal/bookmodal');
var User   = require('../modal/user'); // get our mongoose model
var jwt    = require('jsonwebtoken');// used to create, sign, and verify tokens



module.exports=function(app){

    //set the user security
    app.post('/setup', function(req, res) {
        // create a sample user
        var nick = new User({
            name: req.body.name,
            password: req.body.password,
            admin: true
        });
        nick.save(function(err) {
            if (err) throw err;

            console.log('User saved successfully');
            res.json({ success: true });
        });
    });

    //api is working
    app.get('/', function(req, res) {
        res.send('Hello! The API is at');
    });


// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:5000/api/authenticate
    app.post('/authenticate', function(req, res) {
        // find the user
        User.findOne({
            name: req.body.name
        }, function(err, user) {

            if (err) throw console.log(err);

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });

    // ---------------------------------------------------------
    // route middleware to authenticate and check token
    // ---------------------------------------------------------
    app.use(function(req, res, next) {

        console.log('hello');

        // check header or url parameters or post parameters for token
        //var token = req.param('token') ;//req.body.token; //|| req.param('token') || req.headers['x-access-token'];
        //var token = req.body.token;//this is using for the post event only

        var token = req.headers['x-access-token'];

        console.log(token);

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    console.log('go ahead');
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }

    });

    // ---------------------------------------------------------
    // authenticated routes
    // ---------------------------------------------------------
    app.get('/autho', function(req, res) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    });

    app.get('/api/Book', function (req, res) {
        console.log('getall Book');
        return BookModal.find( function( err, books ) {
            if( !err ) {
                return res.send( books );
            } else {
                return console.log( err );
            }
        });
    });

    app.get('/api/Book/:id', function (req, res) {
        console.log('getbyid');
        return BookModal.findById( req.params.id, function( err, book ) {
            if( !err ) {
                return res.send( book );
            } else {
                return console.log( err );
            }
        });
    });

    app.post('/api/Book', function (req, res) {
        console.log('add');
        var book = new BookModal({
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher,
            isbn: req.body.isbn
        });
        book.save( function( err ) {
            if( !err ) {
                console.log( 'created' );
                return res.send( book );
            } else {
                return console.log( err );
            }
        });
    });

    app.put('/api/Book', function (req, res) {
        console.log('update');
    });

    app.delete('/api/Book/:id', function (req, res) {
        console.log('delete');
    });
}
