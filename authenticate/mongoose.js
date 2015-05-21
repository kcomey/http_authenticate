var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/classroom-examples';
var db = mongoose.createConnection(url);

module.exports.getAPI = function(req, res) {
  console.log(req.headers);
  var apiKey = req.headers['x-api-key'];
  return apiKey;
}

module.exports.User = db.model('users', {
    username: String,
    password: String,
    keygen: String,
});



