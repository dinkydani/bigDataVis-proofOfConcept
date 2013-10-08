//var credentials = require('./credentials.js');
var	util = require('util');
var	twitter = require('twitter');
var	express = require('express');
var	http = require('http');
var path = require('path');

var app = express();

var Mongo = require('./mongo.js');
var uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/proofofconcept';
var	db = new Mongo(uri);

var port = process.env.PORT || 8000;
/*var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});*/
var ck = process.env.CONSUMER_KEY;
var cs = process.env.CONSUMER_SECRET
var atk = process.env.ACCESS_TOKEN_KEY
var ats = process.env.ACCESS_TOKEN_SECRET

var twit = new twitter({
    consumer_key: ck,
    consumer_secret: cs,
    access_token_key: atk,
    access_token_secret: ats
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));

app.get('/getAll', function(req, res){
	db.findAll(function(err, data){
		res.json(data);
	});
});

//The convenience APIs aren't finished, but you can get started with the basics://
twit.get('/statuses/show/27593302936.json', {include_entities:true}, function(data) {
	db.upsert(data, function(err, res){
		if(err)console.warn(err.message);
		else console.log("Success inserting status into database");
	});
});

//Note that all functions may be chained//
/*
twit
	.verifyCredentials(function(data) {
        console.log(util.inspect(data));
    })
    .updateStatus('Test tweet from node-twitter/' + twitter.VERSION,
        function(data) {
            console.log(util.inspect(data));
        }
    );
*/

//The stream() callback receives a Stream-like EventEmitter//
/*
twit.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
        console.log(util.inspect(data));
    });
});
*/

//node-twitter also supports user, filter and site streams:// 
/*
twit.stream('user', {track:'nodejs'}, function(stream) {
    stream.on('data', function(data) {
        console.log(util.inspect(data));
    });
    // Disconnect stream after five seconds
    setTimeout(stream.destroy, 5000);
});
*/

app.listen(port, function() {
	console.log("Listening on " + port);
});