var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { console.log('mongodb connected') });

var ListSchema = mongoose.Schema({
    name: String
});

exports.List = mongoose.model('List', ListSchema)