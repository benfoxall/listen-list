var express = require('express');
var app = express();
var models = require('./models');

app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.render('index.html')
});

// create a list
app.post('/', function(req, res, next){
	var list = new models.List;

	list.save(function(err, list){
	  if (err) next(err);
	  else res.redirect("/lists/" + list.id)
	})
})

app.get('/lists/:id', function(req,res, next){
	models.List.findById(req.params.id, function (err, list) {
		if(err) next(err)
		else if(!list) next("not found");
		else res.render('play.html', list)
	});
})

app.get('/play', function(req, res){
  res.render('play.html')
});

app.listen(process.env.PORT || 3000);