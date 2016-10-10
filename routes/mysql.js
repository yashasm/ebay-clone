/**
 * New node file
 */
var ejs = require('ejs');
var mysql = require('mysql');
var connectionList = [];
var requestList = [];

function getConnection(callback, sqlQuery, callCallback) {
	console.log("inside get connection");
	if (counter > 0) {
		var connection = connectionList.pop();
		counter--;
		callCallback(callback, sqlQuery, connection);
	} else {
		requestList.push({
			"callback" : callback,
			"sqlQuery" : sqlQuery
		});
		setInterval(function() {
			if (counter > 0 && requestList.length>0) {
				var connection = connectionList.pop();
				counter--;
				callCallback(requestList[requestList.length-1].callback, requestList[requestList.length-1].sqlQuery, connection);
				requestList.pop();
			}
		}, 0);
		
	}
};

exports.getDetails = function() {
	/*setInterval(function(){
		console.log("requestList"+requestList.length);
		console.log("counter"+counter);
		console.log("connectionList"+connectionList.length);
	},3000);*/
};

exports.createPool = function() {
	console.log("creating pool");
	for (i = 0; i < 100; i++) {
		connectionList.push(mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'root',
			database : 'test',
			multipleStatements: true,
			port : 3306
		}));
	}
	counter = 100;
	console.log("pool created");
};

function fetchData(callback, sqlQuery,params) {

	console.log("\nSQL Query::" + sqlQuery);

	var connection = getConnection(callback, sqlQuery, function(callback,
			sqlQuery, connection) {
		
		if(params==""){
			console.log("inside without params");
		connection.query(sqlQuery, function(err, rows, fields) {
			if (err) {
				console.log("ERROR: " + err.message);
			} else { // return err or result
				console.log("DB Results:" + rows);
				callback(err, rows);
			}
		});
		}
		else{
			console.log("inside params");
			connection.query(sqlQuery,params, function(err, rows, fields) {
				if (err) {
					console.log("ERROR: " + err.message);
				} else { // return err or result
					console.log("DB Results:" + rows);
					callback(err, rows);
				}
			});
			
		}
		
		console.log("\nConnection released..");
		connectionList.push(connection);
		console.log("requestList"+requestList.length);
		console.log("counter"+counter);
		console.log("connectionList"+connectionList.length);
		counter++;
	});

}

exports.fetchData = fetchData;
