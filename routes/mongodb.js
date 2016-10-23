/**
 * New node file
 */

/*var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/ebaydb';

var _connection = null;

var open = function(){
	MongoClient.connect(dburl,function(err, db){
		if(err){
			console.log("DB connection failed");		
		}
		
		_connection = db;
		
		console.log("DB connection success",db);
	});
};

var get = function(){
	return _connection;
};

module.exports = {
		open: open,
		get: get
}*/

var ejs = require('ejs');
//var mysql = require('mysql');
//var MongoClient = require('mongodb').MongoClient;
var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var mongoURL = 'mongodb://localhost:27017/ebaydb';
var connectionList = [];
var requestList = [];

/**
 * 
 */



/**
 * Connects to the MongoDB Database with the provided URL
 */
/*exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};*/


  /*Returns the collection on the selected database*/

exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);  
};

var connPool = [];

function addnewconnectionobjectTopool(){
    return MongoClient.connect(mongoURL, function(err, _db){
        console.log("Creating a new connection in the pool with MongoDB at : "+mongoURL);
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        // Adding the connection to the pool.
        connPool.push(db);
        connected = true;
        console.log(connected +" is connected?");
    });
}

var dbPool = {
    "maxPoolSize": 100
};
/*
*   Creating the connection  pool of 5*10=50
* */
exports.createrconnectionpool = function createrconnectionpool(){
    for(var i = 0; i < dbPool.maxPoolSize; i++){
        addnewconnectionobjectTopool();
    }
};

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(callback){

    if(connPool.length > 0){
        callback(connPool.pop());
    } else {
        console.log("Pool empty. Filling connection pool");
        this.createrconnectionpool();
        callback(connPool.pop());
    }
    console.log("pool connection length: "+connPool.length);

};