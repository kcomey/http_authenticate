'use strict';

var mongo = require('./mongo_functions');
var express = require('express');
var http = require('http');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('../authenticate/mongoose');
var passport = require('../authenticate/config_passport');
var validate = require('../authenticate/validateRequest');


// This is the middleware
app.use(bodyParser.json());
app.use(session({
  resave: true,
  secret: 'JohnWayne',
  saveUninitialized: true,
}));

// Crediting Arvind Ravulavaru and Nick Peters
app.all('/note/*', function(req, res, next) {
  console.log(token);
  var token = (req.session.token || req.headers['x-api-key']);
  if (!token) {
    res.status(401).send('Not valid user');
  } else {
    // Authorize the user to see if s/he can access our resources
    mongoose.User.findOne({
      keygen: token,
    }, function(err, userToken) {
      // Good to go
      if (userToken) {
        next();
      } else {
        res.status(401).send('Not authorized');
      }
    });
  }
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  passport.authenticate(username, password, function(err, goodLogin) {
    // User has successfully logged in here (working)
    if (!goodLogin) {
      res.status(401).send('Could not log user in');
    } else {
      req.session.token = goodLogin;
      res.status(200).send(goodLogin);
    }
  });
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

/* Var isAuthenticated = function(req, res, next) {
  // If they are just logging in they don't need to be authenticated yet
  if (req.path === '/login') return next();

  console.log('getting here');
  console.log(req.headers);

  var apiKey = req.headers['x-api-key'];
    mongoose.User.findOne({ keygen: apiKey },function(err, user) {
      //console.log('user is ' + user);
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
};*/
