/**
 * New node file
 */
var ejs = require('ejs');
var mysql = require('mysql');
var connectionList = [];
var requestList = [];

function getConnection(callback, sqlQuery, callCallback) {
	console.log("Getting the connection from pool");
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

exports.createPool = function() {
	console.log("Create a connection pool");
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
	console.log("Connection pool is ready");
};

function fetchData(callback, sqlQuery,params) {

	console.log("\n SQL --> " + sqlQuery);

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
		counter++;
	});

}

exports.fetchData = fetchData;
