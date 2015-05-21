var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/classroom-examples';

var putDocument = function(req, res) {
  var json = req.body;
  var noteNum = Number(req.params.num);
  // Set up the connection to the local db
  MongoClient.connect(url, function(err, db) {
    if (err) {
      return console.dir(err);
    }
    // Connect to the collection
    db.collection('notes', {strict: true}, function(err, collection) {
      if (err) {
        return console.dir(err);
      }
      // Need to check it exists first, then update it if it does
      var query = { noteId: noteNum };
      collection.find(query).toArray(function(err, documents) {
        if (err) {
          throw err;
        }
        var note = documents[0];
        if (!note) {
          res.status(200).send('Note not found. Not updated.');
        } else {
          // Ready to rock and roll
          collection.update(query, {$set: json}, {w: 1}, function(err, result) {
          if (err) {
            return console.dir(err);
          }
          var body = 'UPDATED Note ID: ' + noteNum;
          res.status(200).send(body);
        });
        }
      });
    });
  });
};

var deleteDocument = function(req, res) {
  var noteNum = Number(req.params.num);
  // Set up the connection to the local db
  MongoClient.connect(url, function(err, db) {
    if (err) {
      return console.dir(err);
    }
    // Connect to the collection
    db.collection('notes', {strict: true}, function(err, collection) {
      if (err) {
        return console.dir(err);
      }
      // Ready to rock and roll
      var query = { noteId: noteNum };
      collection.findOne(query, function(err, note) {
        if (!note) {
          res.status(200).send('Note not found. Try another number.');
        } else {
          collection.remove(query, function(err, note) {
            var body = 'Your note (note id: ' + noteNum +
            ') has been deleted.';
            res.status(200).send(body);
          });
        }
      });
    });
  });
};

var insertDocument = function(req, res) {
  var json = req.body;
  // Set up the connection to the local db
  MongoClient.connect(url, function(err, db) {
    if (err) {
      return console.dir(err);
    }
    // Connect to the collection, or create if it doesn't exist
    db.collection('notes', function(err, collection) {
      if (err) {
        return console.dir(err);
      }
      // Get the current highest note ID and then increase it by one
      collection.find().sort({noteId: -1}).limit(1).toArray(
        function(err, documents) {
        if (err) {
          throw err;
        }
        if (documents[0]) {
          json.noteId = documents[0].noteId + 1;
        } else {
          json.noteId = 1;
        }
        collection.insert(json, {w: 1}, function(err, result) {
          if (err) {
            return console.dir(err);
          }
          var body = 'Your note has been saved with and ID of: ' + json.noteId;
          res.status(200).send(body);
        });
      });
    });
  });
};

var getDocument = function(req, res) {
  var noteNum = Number(req.params.num);
  // Set up the connection to the local db
  MongoClient.connect(url, function(err, db) {
    if (err) {
      return console.dir(err);
    }
    // Connect to the collection
    db.collection('notes', {strict: true}, function(err, collection) {
      if (err) {
        return console.dir(err);
      }
      // Ready to rock and roll
      var query = { noteId: noteNum};
      collection.find(query).toArray(function(err, documents) {
        if (err) {
          throw err;
        }
        var note = documents[0];
        if (!note) {
          res.status(200).send('Note not found. Try another number.');
        } else {
          var body = 'Here is the note you requested: <br>' +
            note.noteBody + '<br>' + '(note id: ' + note.noteId + ')';
          res.status(200).send(body);
        }
      });
    });
  });
};

exports.getDocument = getDocument;
exports.insertDocument = insertDocument;
exports.deleteDocument = deleteDocument;
exports.putDocument = putDocument;










