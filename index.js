var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cons = require('consolidate');
var models = require('./models');

app.use(bodyParser());

app.engine('html', cons.hogan);

// default to html
app.set('view engine', 'html');

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
		else {
			models.Album
			.find({ _list: list._id })
			.sort('-_id')
			.exec(function (err, albums) {
			  if (err) return next(err);
			  res.render('play.html', {list:list, albums:albums})
			})
		}
	});
})

// adding an album
app.post('/lists/:id', function(req, res, next){

	models.List.findById(req.params.id, function (err, list) {
		if(err) next(err)
		else if(!list) next("list not found");
		else {

			var album = new models.Album({
				_list:list._id,
				uri: req.param("uri"),
				prior: req.param("prior")
			});

			album.attempt_populate(function(){
				album.save(function(err, album){
				  if (err) return next(err);
				  res.redirect("/lists/" + req.params.id)
				});

			});
		}
	});

})

app.post('/lists/:list_id/:id', function (req, res, next){
	// update an element
	if(req.param('destroy')){
		models.Album.remove({
			_id:   req.params.id,
			_list: req.params.list_id
		}, function (err){
			if (err) return mext(err);
			res.redirect("/lists/" + req.params.list_id)
		})		
	} else {
		models.Album.findOneAndUpdate({
			_id:   req.params.id,
			_list: req.params.list_id
		}, 
		{post: req.param('post')},
		function (err){
			if (err) return mext(err);
			res.redirect("/lists/" + req.params.list_id)
		})	
	}


	// Tank.remove({ size: 'large' }, function (err) {
 //  if (err) return handleError(err);
 //  // removed!
	// });
})

app.get('/play', function(req, res){
  res.render('play.html')
});

app.listen(process.env.PORT || 3000);