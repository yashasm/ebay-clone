var amqp = require('amqp');

var connection = amqp.createConnection({url:'amqp://localhost'});
console.log("-------->"+connection);
var rpc = new (require('./amqprpc'))(connection);

//make request to rabbitmq
function make_request(queue_name, msg_payload, callback){
	console.log("inside make queue");
	rpc.makeRequest(queue_name, msg_payload, function(err, response){
		if(err)
			console.error(err);
		else{
			console.log("response", response);
			callback(null, response);
		}
	});
}

exports.make_request = make_request;
