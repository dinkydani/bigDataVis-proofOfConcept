var credentials = require('./credentials.js');
	util = require('util'),
	twitter = require('twitter'),
	express = require('express'),
	http = require('http');

var app = express();

var DatabaseConnection = require('./mongo.js').DatabaseConnection,
	mongoHost = 'localhost',
	mongoPort = 27017,
	dbConnection = new DatabaseConnection(mongoHost, mongoPort);

var port = 8000;

var twit = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});
	
//app.use(express.static(__dirname + '/public'));
app.use(express.logger());

app.get('/', function(req, res){
	dbConnection.findAll(function(err, data){
		//console.log(data);
		res.send(data);
	});
});

//The convenience APIs aren't finished, but you can get started with the basics://
twit.get('/statuses/show/27593302936.json', {include_entities:true}, function(data) {
    //console.log(util.inspect(data));
	console.log("Status retrieved from Twitter");
	dbConnection.insert(data, function(err, res){
		if(err)console.log(err);
		else console.log("Success inserting to database");
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