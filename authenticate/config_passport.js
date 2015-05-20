var mongo = require('./mongoose.js');

// Expose this function to our app using module.exports
module.exports = function(passport) {
var LocalStrategy = require('passport-local').Strategy;
var keygen = require('keygen');

passport.use(new LocalStrategy(
  function(username, password, done) {
    mongo.User.findOne({ username: username }, function (err, user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password != password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        // If username and password match
        var userKey = keygen.url(keygen.medium);
        // Write the keygen to the user file to check later
        mongo.User.findOneAndUpdate({_id: user.id}, {keygen: userKey}, {new: true},
          function(err, result) {
            if (err) {
              return done(null, false);
            };
          }
        )
        console.log('User was logged in successfully');
        return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    mongo.User.findOne({ _id: id },function(err, user) {
    done(err, user);
  });
});
};

