var makeDate = require('../scripts/date.js');
var Headline = require('../models/Headline');
var Note = require('../models/Note');


exports.save = function(data, cb) {
  //create date
  var formattedDate = makeDate();

        var newNote = new Note ({
          _headlineId:data.id,
          date:data.date,
          noteText:data.note
        });

        newNote.save(function(err, doc){
          if (err) {
            console.log(err);
        } else{
          console.log(doc);
          cb(doc);
        }
      });
    };

  exports.gather = function(data, cb) {
      Note.find({
          _headlineId: data.id
      })
      .sort({
        id: -1
      })
      .exec(function(err, doc) {
          cb(doc);
      });
  };

  exports.delete = function(data, cb) {
      Note.remove({
        _headlineId:data.id
      }, function(err, removed){
        if(err){
          console.log(err);
        } else {
          console.log("Delete Sucessful");
          cb(removed);
        }
      });
  };