'use strict';

var mongo = require('./mongo_functions');
var passport = require('passport');
var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('../authenticate/mongoose');
require('../authenticate/config_passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

// This is the middleware
app.use(bodyParser.json());

app.use(function (req, res, next) {
  isAuthenticated(req, res, next);
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res, next) {
    // User has successfully logged in here (working), send wherever you want them to go
    var apiKey = mongoose.getAPI(req, res);
    console.log(req.headers);
    //res.addHeader("x-api-key", apiKey);
    res.redirect('/note');
  });

app.get('/', function(req, res) {
  res.status(200).send('Please use /note to access pages');
});

app.post('/note', function(req, res) {
  // Write the note if you have a POST request
  mongo.insertDocument(req, res);
});

app.route('/note/:num')
  .get(function(req, res) {
    // Send back the note if it exists, otherwise message it does not exist
    mongo.getDocument(req, res);
  })
  .put(function(req, res) {
    // Update the note, PUT or PATCH request
    mongo.putDocument(req, res);
  })
  .delete(function(req, res) {
    // Delete the note, DELETE request
    mongo.deleteDocument(req, res);
  })
  .patch(function(req, res) {
    // Update the note, PUT or PATCH request
    mongo.putDocument(req, res);
  });

app.listen(process.env.PORT || 3000, function() {
  console.log('server started');
});

var isAuthenticated = function(req, res, next) {
  // If they are just logging in they don't need to be authenticated yet
  if (req.path === '/login') return next();

  console.log('getting here');
  //console.log(req);

  var apiKey = req.headers['x-api-key'];
    mongoose.User.findOne({ keygen: apiKey },function(err, user) {
      console.log('user is ' + user);
      if (err) {
        return err;
      }
      // If key is found, send them on their way
      if (user) {
        next();
      }
      else {
        // Are not authorized
        res.redirect('/login');
      }
  });
};





