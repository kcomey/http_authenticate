var mongoose = require('../authenticate/mongoose');

var setup = function() {
  mongoose.User.insert({username: 'Bond', password: '007'});
  return;
};

exports.setup = setup;
