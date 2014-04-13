var express = require('express');
var app = express();
var everyauth = require('everyauth');
var bodyParser = require('body-parser');
var cons = require('consolidate');
var models = require('./models');
var dotenv = require('dotenv');
dotenv.load();


// var usersByTwitId = {};

// function addUser (source, sourceUser) {
//   var user;
//   if (arguments.length === 1) { // password-based
//     user = sourceUser = source;
//     user.id = ++nextUserId;
//     return usersById[nextUserId] = user;
//   } else { // non-password-based
//     user = usersById[++nextUserId] = {id: nextUserId};
//     user[source] = sourceUser;
//   }
//   return user;
// }

// var u = {ben:"true"};

everyauth.everymodule.findUserById( function (userId, callback) {
  models.User.findById(userId, callback);
});

everyauth
  .twitter
    .consumerKey(process.env.CONSUMERKEY)
    .consumerSecret(process.env.CONSUMERSECRET)
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
    	var promise = this.Promise();

    	models.User.findOrCreate(
    		{
    			id_str: twitUser.id_str
    		},
    		{
				screen_name: twitUser.screen_name,
				name: twitUser.name,
				location: twitUser.location,
				description: twitUser.description
			},
    		function(err, user, created){
    			if(err) return console.log("error saving user", err);
    			promise.fulfill(user);
    		}
    	);

       return promise;
    })
    .redirectPath('/');

var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser());
app.use(cookieParser())
// app.use(session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}))
app.use(session({secret: 'whodunnit'}))


app.use(everyauth.middleware(app));

app.engine('html', cons.hogan);

// default to html
app.set('view engine', 'html');

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
	if(req.user){
		res.redirect('/users/' + req.user.screen_name)
	}
	console.log("----", req.user)
	  res.render('index.html')
});

app.get('/users/:screen_name', function(req, res, next){

	models.User.findOne({
		screen_name:req.params.screen_name
	},
		function (err, user) {
			if(err) next(err)
			else if(!user) next("not found");
			else {
				models.Album
				.find({ _user: user._id })
				.sort('-_id')
				.exec(function (err, albums) {
				  if (err) return next(err);
				  res.render('play.html', {albums:albums, displayedUser: user})
				})
			}
		}
	)

});

app.post('/users/:screen_name', function(req, res, next){

	if(!req.user || (req.params.screen_name !== req.user.screen_name))
		return next("not authorised")
	

	models.User.findOne({screen_name:req.params.screen_name}, function (err, user) {
		if(err) next(err)
		else if(!user) next("user not found");
		else {

			var album = new models.Album({
				_user:user._id,
				uri: req.param("uri"),
				prior: req.param("prior")
			});

			album.attempt_populate(function(){
				album.save(function(err, album){
				  if (err) return next(err);
				  res.redirect("/users/" + req.params.screen_name)
				});

			});
		}
	});

});

app.post('/users/:screen_name/:id', function (req, res, next){

	if(!req.user || (req.params.screen_name !== req.user.screen_name))
		return next("not authorised")

	models.User.findOne({screen_name:req.params.screen_name}, function (err, user) {
		if(err) next(err)
		else if(!user) next("user not found");

		// update an element
		if(req.param('destroy')){
			models.Album.remove({
				_id:   req.params.id,
				_user: user._id
			}, function (err){
				if (err) return mext(err);
				res.redirect("/users/" + req.params.screen_name)
			})		
		} else {
			models.Album.findOneAndUpdate({
				_id:   req.params.id,
				_user: user._id
			}, 
			{post: req.param('post')},
			function (err){
				if (err) return mext(err);
				res.redirect("/users/" + req.params.screen_name)
			})	
		}

	});

})





// // create a list
// app.post('/', function(req, res, next){
// 	var list = new models.List;

// 	list.save(function(err, list){
// 	  if (err) next(err);
// 	  else res.redirect("/lists/" + list.id)
// 	})
// })

// app.get('/lists/:id', function(req,res, next){
// 	models.List.findById(req.params.id, function (err, list) {
// 		if(err) next(err)
// 		else if(!list) next("not found");
// 		else {
// 			models.Album
// 			.find({ _list: list._id })
// 			.sort('-_id')
// 			.exec(function (err, albums) {
// 			  if (err) return next(err);
// 			  res.render('play.html', {list:list, albums:albums})
// 			})
// 		}
// 	});
// })

// // adding an album
// app.post('/lists/:id', function(req, res, next){

// 	models.List.findById(req.params.id, function (err, list) {
// 		if(err) next(err)
// 		else if(!list) next("list not found");
// 		else {

// 			var album = new models.Album({
// 				_list:list._id,
// 				uri: req.param("uri"),
// 				prior: req.param("prior")
// 			});

// 			album.attempt_populate(function(){
// 				album.save(function(err, album){
// 				  if (err) return next(err);
// 				  res.redirect("/lists/" + req.params.id)
// 				});

// 			});
// 		}
// 	});

// })

// app.post('/lists/:list_id/:id', function (req, res, next){
// 	// update an element
// 	if(req.param('destroy')){
// 		models.Album.remove({
// 			_id:   req.params.id,
// 			_list: req.params.list_id
// 		}, function (err){
// 			if (err) return mext(err);
// 			res.redirect("/lists/" + req.params.list_id)
// 		})		
// 	} else {
// 		models.Album.findOneAndUpdate({
// 			_id:   req.params.id,
// 			_list: req.params.list_id
// 		}, 
// 		{post: req.param('post')},
// 		function (err){
// 			if (err) return mext(err);
// 			res.redirect("/lists/" + req.params.list_id)
// 		})	
// 	}

// })

// app.get('/play', function(req, res){
//   res.render('play.html')
// });

app.listen(process.env.PORT || 3000);