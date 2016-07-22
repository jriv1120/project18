var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

/*Mongoose Connect*/
var db = 'mongodb://localhost/mongoHeadlines';
mongoose.connect(db, function(err){
  if(err){
    console.log(err);
  } else {
    console.log('mongoose connection is sucessful');
  }
});

app.use(express.static(__dirname + '/public'));
var port = 3000;

var expressHandlebars = require('express-handlebars');
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

var routes = require('./config/routes.js');

app.use('/', routes);
app.use('/test', routes);
app.use('/fetch', routes);
app.use('/gather', routes);
app.use('/check', routes);
app.use('/save', routes);
app.use('/delete', routes);


app.listen(port, function() {
    console.log("lisenting on port:" + port);
});