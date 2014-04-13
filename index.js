var express = require('express');
var app = express();

app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.render('index.html')
});

app.get('/play', function(req, res){
  res.render('play.html')
});

app.listen(3000);