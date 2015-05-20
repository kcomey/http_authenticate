var index = require('../src/server.js');
var mongo_functions = require('../src/mongo_functions');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

describe('http server with persistence', function() {
  before(function(done) {


  });

  it('POST to /note successfully creates a new note', function(done) {
    chai.request('http://localhost:3000')
    .post('/note')
    .send({ noteBody: 'This is a note' })
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      expect(res).to.have.status(200);
      expect(res.text).to.contain('Your note has been saved');
      done();
    });
  });

  it('expect GET /note/1 to show the note if it exists', function (done) {
    chai.request('http://localhost:3000')
    .get('/note/1')
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      expect(res).to.have.status(200);
      expect(res.text).to.contain('Here is the note');
      expect(res.text).to.contain('note id: 1');
      done();
      });
    });

  it('expect GET /note/157 to show a not found message if note does not exist',
    function (done) {
    chai.request('http://localhost:3000')
    .get('/note/157')
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      expect(res.text).to.contain('Note not found');
      done();
      });
  });

  it('expect PUT /note/1 to update existing note', function (done) {
     chai.request('http://localhost:3000')
     .put('/note/1')
     .send({ noteBody: 'This is an UPDATED note' })
     .set('Accept', 'application/json')
     .end(function(err, res) {
        if (err) {
          throw err;
        }
      expect(res.text).to.contain('UPDATED');
      done();
      });
  });

  it('expect PUT /note/207 to send message if note does not exist', function (done) {
     chai.request('http://localhost:3000')
     .put('/note/207')
     .end(function(err, res) {
        if (err) {
          throw err;
        }
      expect(res.text).to.contain('Not updated');
      done();
      });
  });

  it('expect PATCH /note/1 to update existing note (same as PUT)', function (done) {
     chai.request('http://localhost:3000')
     .patch('/note/1')
     .send({ noteBody: 'This is an UPDATED note' })
     .set('Accept', 'application/json')
     .end(function(err, res) {
        if (err) {
          throw err;
        }
      expect(res.text).to.contain('UPDATED');
      done();
      });
  });

  it('expect PATCH /note/207 to send message if note does not exist (same as PUT)',
   function (done) {
     chai.request('http://localhost:3000')
     .put('/note/207')
     .end(function(err, res) {
        if (err) {
          throw err;
        }
      expect(res.text).to.contain('Not updated');
      done();
      });
  });

  it('expect DELETE /note/204 to send message if note does not exist', function (done) {
      chai.request('http://localhost:3000')
      .del('/note/204')
      .end(function(err, res) {
        if (err) {
          throw err;
        }
      expect(res.text).to.contain('Note not found');
      done();
      });
  });

  it('expect DELETE /note/1 to delete note', function (done) {
      chai.request('http://localhost:3000')
      .del('/note/1')
      .end(function(err, res) {
        if (err) {
          throw err;
        }
      expect(res.text).to.contain('has been deleted');
      done();
      });
  });
});









