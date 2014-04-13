var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('mongodb connected') });

var ListSchema = mongoose.Schema({
    name: String,
    // albums : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }]
});

var AlbumSchema = mongoose.Schema({
  _list    : { type: String, ref: 'List' },

  uri      : String,

  prior    : String,
  post     : String,

  // todo - populate server side
  title    : String,
  artist   : String
});


exports.List  = mongoose.model('List',  ListSchema)
exports.Album = mongoose.model('Album', AlbumSchema)