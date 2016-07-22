var scrape = require('../scripts/scrape.js');
var makeDate = require('../scripts/date.js');
var Headline = require('../models/Headline');
var Note = require('../models/Note');


//export this function as "fetch"
exports.fetch = function() {

  //run scrape function
  scrape("http://www.nytimes.com", function(data) {
    var obj = data;

    //create user-readable date
    var formattedDate = makeDate();

    //loop over object's results
    for (var i in obj) {
      addIfNotFound(i);
    }

    //check to see if entry exists, add if it does not
    function addIfNotFound(current) {
      //find one by its headline
      Headline.findOne({
        'headline': obj[current][0]
      }, function(err, res) {
        if (err) {
          console.log(err);
        }
        //if there is no match
        if (res === null) {
          //new entry object
          var headlineEntry = new Headline({
            headline: obj[current][0],
            summary: obj[current][1],
            date: formattedDate
          });
          //save new entry to db
          headlineEntry.save(function(err) {
            if (err) {
              // console.log(err);
            } else {
              console.log('successfully added');
            }
          });
        }
      });
    }

  });
};

//export this function as "check"
exports.check = function(cb) {
  //get scraped data, sort starting from most recent
  Headline.find()
    .sort({
      _id: -1
    })
    .exec(function(err, doc) {
      //once finished, pass the list into the callback function
      cb(doc);
    });
};