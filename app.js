// var credentials = require('./credentials.js');
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

// var twit = new twitter({
//     consumer_key: credentials.consumer_key,
//     consumer_secret: credentials.consumer_secret,
//     access_token_key: credentials.access_token_key,
//     access_token_secret: credentials.access_token_secret
// });

var twit = new twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
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
    //console.log(util.inspect(data));
	console.log("Retrieving status from Twitter");
    console.log(process.env.CONSUMER_KEY);
    console.log(data);
	/*db.insert(data, function(err, res){
		if(err)console.log(err);
		else console.log("Success inserting to database");
	});*/
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