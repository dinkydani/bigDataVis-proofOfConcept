var mongodb = require('mongodb');
var connect = require('connect');
var db = null;

var DatabaseConnection = function(mongoUri){
	mongodb.Db.connect(mongoUri, { server: { auto_reconnect: true, safe: false } }, function (err, database) {
		if(!err) console.log("Connected to " + mongoUri);
		if(err) throw err;

		db = database;
	});
}

/*var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var DatabaseConnection = function(host, port) {
  this.db = new Db('proofofconcept', new Server(host, port, {safe: true}, {auto_reconnect: true}, {}));
  this.db.open(function(err, db){
	if(!err){
		console.log("Connected to " + host + ":" + port);
	}
  });
};
*/
//get the collection
DatabaseConnection.prototype.getCollection = function(callback) {
	db.collection('status', function(err, collection) {
		if( err ) callback(err);
    	else callback(null, collection);
	});
};

//find all statuses
DatabaseConnection.prototype.findAll = function(callback) {
    this.getCollection(function(err, collection) {
      if( err ) callback(err)
      else {
        collection.find().toArray(function(err, object) {
          	if( err ) {
          		console.warn(err.message);
          		callback(err);
          	}
          	else {
          		console.log("findAll successful");
          		callback(null, object);
          	}
        });
      }
    });
};

DatabaseConnection.prototype.upsert = function(data, callback){
	console.log(data.id);
	this.getCollection(function(err, collection){
		if(err) callback(err);
		else{
			collection.update({"id":data.id}, {$set: data}, {upsert:true}, function(err, object){
				if( err ) {
	          		console.warn(err.message);
	          		callback(err);
	          	}
	          	else {
	          		console.log("Upsert successful");
	          		callback(null, object);
	          	}
			});
		}
	});
};


DatabaseConnection.prototype.insert = function(data, callback){
	this.getCollection(function(err, collection){
		if(err) callback(err);
		else{
			collection.insert(data, function(){
				callback(null, data);
			});
		}
	});
};

module.exports = DatabaseConnection;