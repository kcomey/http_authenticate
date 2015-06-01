var mongo = require('../authenticate/mongoose');

module.exports = function(req, res, next) {
var token = (req.session.token || req.headers['x-api-key']);
if (token) {
  console.log('get to validate 12 ' + token);
  // Authorize the user to see if s/he can access our resources
  mongo.User.findOne({ keygen: token }, function (err, userToken) {
    if (userToken){
        req.session.token = token;
        res.send(token);
        next();
    } else {
      res.status(401);
      res.json({
      "status": 401,
      "message": "Not Authorized"
      });
      return;
    }
  });
} else {
  res.status(401).send('Cannot login');
  }
};



