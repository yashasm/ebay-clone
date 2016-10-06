/**
 * New node file
 */
var mysql_pool = require('mysql');
var pool  = mysql_pool.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	port     : 3306,
	database : 'test',
	connectionLimit : '10',
		multipleStatements: true
});

exports.pool = pool;