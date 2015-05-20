var request = require('superagent');

request
  .post('http://localhost:3000/login')
  .send({ username: "Bond", password: "007" })
  .set('Accept', 'application/json')
  .end(function(err, res) {
  });




