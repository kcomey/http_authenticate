var mongo = require('./mongoose.js');

// Expose this function to our app using module.exports
module.exports.authenticate = function(username, password, callback) {
  var keygen = require('keygen');

    mongo.User.findOne({ username: username }, function (err, user) {
        if (!user) {
          return err;
        }
        if (user.password != password) {
          return err;
        }
        // If username and password match
        var userKey = keygen.url(keygen.medium);
        // Write the keygen to the user file to check later
        mongo.User.findOneAndUpdate({_id: user.id}, {keygen: userKey}, {new: true},
          function(err, result) {
            if (err) {
              return false;
            };
          }
        )
        console.log('User was logged in successfully' + userKey);
        callback(userKey);
    });
};




