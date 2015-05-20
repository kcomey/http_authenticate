var authenticateUser = require('./authenticate.js');
var bodyParser = require('body-parser');
var passport = require('passport');
var authenticateUser = require('./authenticate.js');
require('./config_passport')(passport);
var game = require('./solitaire/game.js');
var state = require('./state');

module.exports = function router(app) {

app.use(passport.initialize());
app.use(passport.session());
// This is middleware
app.use(bodyParser.json());
app.use(function (req, res, next) {
  authenticateUser.isAuthenticated(req, res, next);
});

app.get('/login', function(req, res) {
  // Authenticate the user here
  console.log('This will be where the user can login');
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res, next) {
    // User has successfully logged in here, send wherever you want them to go
    authenticateUser.setCookie(req, res, next);
  });

app.get('/solitaire/newgame', function(req, res) {
  var newGame = game.create();
  var gameID = newGame.options.id;
  state.saveGame(gameID);
  res.redirect('/solitaire/' + gameID);
});

app.route('/solitaire/:ID')
  .get(function(req, res) {
    var currentGame = state.getGame(req.params.ID);
    res.send(currentGame);
  })
  .post(function(req, res) {
    var gameID = req.params.ID;

  // Send to draw function
  //res.redirect('/game/' + gameID)
  });

};
