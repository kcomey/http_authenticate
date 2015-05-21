var mongo = require('./mongoose.js');

// Expose this function to our app using module.exports
module.exports.authenticate = function(username, password, callback) {
  var keygen = require('keygen');

    mongo.User.findOne({ username: username }, function (err, user) {
        if (!user) {
          callback();
        }
        else if (user.password != password) {
          callback();
        }
        else {
        // If username and password match
        var userKey = keygen.url(keygen.medium);
        // Write the keygen to the user file to check later
        mongo.User.findOneAndUpdate({username: username}, {keygen: userKey}, {new: true},
          function(err, user) {
            callback(err, user);
          });
      }
    });
};




