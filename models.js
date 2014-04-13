var mongoose = require('mongoose');
var request = require('request');
var qs = require('querystring');
var findOrCreate = require('mongoose-findorcreate')

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('mongodb connected') });

var ListSchema = mongoose.Schema({
    name: String,
    // albums : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }]
});

var AlbumSchema = mongoose.Schema({
  _list    : { type: String, ref: 'List' }, // todo - remove
  
  _user    : { type: String, ref: 'User' },

  uri      : String,

  prior    : String,
  post     : String,

  // todo - populate server side
  name     : String,
  artist   : String
});

var UserSchema = mongoose.Schema({
	id_str: String,
	screen_name: String,
	name: String,
	location: String,
	description: String
});


UserSchema.plugin(findOrCreate);

AlbumSchema.methods.attempt_populate = function (callback) {
	var uri = this.uri;

	var self = this;
	if(uri){
		var url = 'http://ws.spotify.com/lookup/1/.json?' + qs.encode({uri:uri});
		request.get({url:url, json:true}, function(error, response, body){ 
			try{
				self.name   = body.album.name;
				self.artist = body.album.artist
			} catch (e){
				console.log("error populating for - '"+uri+"'");
			}
			callback && callback()
		});
	}
	
}


exports.List  = mongoose.model('List',  ListSchema)
exports.Album = mongoose.model('Album', AlbumSchema)
exports.User  = mongoose.model('User',  UserSchema)