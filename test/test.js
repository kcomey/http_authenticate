var index = require('../src/server.js');
var mongoose = require('../authenticate/mongoose');
var mongo_functions = require('../src/mongo_functions');
var user = require('../authenticate/usersetup');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var token;

//setup database
mongoose.User.findOneAndUpdate({username: 'Bond'}, {username: 'Bond', password: '007'},
  {upsert: true},  function(err, result) {
      if (err) {
        return err;
      }
    }
);

describe('http server with persistence', function() {

  it('Should return 401 status code if accessing notes without logging in',
    function(done) {
      chai.request('http://localhost:3000')
      .get('/note/')
      .set('Content-Type', 'application/json')
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        expect(res).to.have.status(401);
        done();
    });
  });

  it('Should return 401 status code if logging in with invalid credentials',
    function(done) {
       chai.request('http://localhost:3000')
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({username: 'Superman', password: 'Fail'})
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should return 200 status code if logging in with valid credentials',
    function(done) {
       chai.request('http://localhost:3000')
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({username: 'Bond', password: '007'})
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        token = res.text;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('POST to /note successfully creates a new note', function(done) {
    chai.request('http://localhost:3000')
    .post('/note')
    .send({ noteBody: 'This is a note' })
    .set('Accept', 'application/json')
    .set('x-api-key', token)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      expect(res).to.have.status(200);
      done();
    });
  });
});









