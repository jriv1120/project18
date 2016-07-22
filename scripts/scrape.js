var request = require('request');
var cheerio = require('cheerio');

//scrape times
var scrape = function(url, cb) {

    if (url == "http://www.nytimes.com") {
        request(url, function(err, res, body) {
            var $ = cheerio.load(body);
            var obj = {};

            $('.theme-summary').each(function(i, element){
              //Each article is grouped under a class of theme-summary
              //we can use the jQuery .children() to find the headings and summaries for a single article, guaranteeing that they will stay together
              var head = $(this).children(".story-heading").text();
              var sum = $(this).children(".summary").text();

              if (head !== "" && sum !== ""){
                // this allows to filter out the below things from the data to make it look nicer
                // like extra lines, extra spacing, extra tabs, ...
                // we also trim it, to remove spacing on both sides of the data
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                obj[i] = [headNeat]; //initialize an array and put headNeat into it and we ill push more data into obj[i] below
                obj[i].push(sumNeat);
              }
            });
            console.log(obj); //good for testing

            cb(obj);
        });
    }
};

module.exports = scrape;