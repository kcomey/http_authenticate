var mongo = require('./mongoose.js');
var keygen = require('keygen');
var cookieParser = require('cookie-parser');

exports.setCookie = function(req, res, next) {
  var userKey = keygen.url(keygen.medium);
  // Write the keygen to the user file to check later
  mongo.User.findOneAndUpdate({username: req.body.username}, {session: userKey}, {new: true},
    function(err, result) {
      if (err) {
        return err;
      };
    }
  )
  res.cookie('session', userKey).status(200).send('User logged in');
}

exports.isAuthenticated = function(req, res, next) {
  // If they are just logging in they don't need to be authenticated yet
  if (req.path === '/login') return next();

  var sessionCookie = res.cookie['session'];
    mongo.User.findOne({ session: sessionCookie },function(err, user) {
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




