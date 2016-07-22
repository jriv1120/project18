var express = require('express');
var router = express.Router();
var scrape = require('../scripts/scrape.js');
var headlinesController = require('../controllers/headlines.js');
var notesController = require('../controllers/notes.js');

//basic route use cb return json data from mongodb
router.get('/', function(req, res) {
    res.render('home');
});

//route for testing scrape
router.get('/test', function(req,res) {
    scrape("http://www.nytimes.com", function(data) {
        res.json(data);
    });
});

//get grab web scrape
router.post('/fetch', function(req, res) {
    headlinesController.fetch();
    res.send('success');
});

//check the mongodb for data
router.get('/check', function(req, res) {
    headlinesController.check(function(data) {
        res.json(data);
    });
});

//get notes from mongodb
router.post('/gather', function(req, res) {
    notesController.gather(req.body, function(data) {
        res.json(data);
    });
});

//post save note into mongodb
router.post('/save', function(req, res) {
    notesController.save(req.body, function(data) {
        res.json(data);
    });
});

//delete note from mongodb
router.delete('/delete', function(req, res) {
    notesController.delete(req.body, function(data) {
        res.json(data);
    });
});


module.exports = router;