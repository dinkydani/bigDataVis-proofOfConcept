var mongo = require('mongodb');
var Server = mongo.Server;
var	Db = mongo.Db;
var	Connection = mongo.Connection;
var	BSON = mongo.BSON;

var DatabaseConnection = function(host, port) {
  this.db = new Db('proofofconcept', new Server(host, port, {safe: true}, {auto_reconnect: true}, {}));
  this.db.open(function(err, db){
	if(!err){
		console.log("Connected to " + host + ":" + port);
	}
  });
};

//get the collection
DatabaseConnection.prototype.getCollection = function(callback) {
  this.db.collection('status', function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

//find all statuses
DatabaseConnection.prototype.findAll = function(callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

DatabaseConnection.prototype.insertUpdate = function(data, callback){
	this.getCollection(function(error, collection){
		if(error) callback(error);
		else{
			collection.update(data,{upsert:true},function(error, result){
				if(error) callback(error)
				else callback(null, result)
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