/**
 * New node file
 */

var mysqlconnpool = require('../routes/mysqlconn').pool;
module.exports.registerUser = function(req,res){
	console.log("I am gonna register user");
	console.log(req.body);
	

	var sql = "INSERT into userdata SET ?";
	params = [{"email":req.body.email,"password":req.body.password,"firstname":req.body.firstname,"lastname":req.body.lastname,"phone":req.body.phone,"logid":"1"}];
	
	console.log(sql);
	var result;
	//testing 
	mysqlconnpool.getConnection(function (err, connection) {
		if (err) {
			console.log('MySql connection error: ' + err);
			//callback(err, true);
			return;
		}
		console.log("Query is >>>>>"+sql);
		var qResult = connection.query(sql, params);
		qResult.on('error', function(err) {
			console.log('MySql query error: ' + err);
			result = {"condition":"fail"};
			return;
		});
		qResult.on('result', function(rows) {
			console.log('Got result from DB');
			result = {"condition":"success"};
			//callback(false, rows);
		});
		qResult.on('end', function() {
			console.log('Going to release DB connection to the Pool');
			connection.release();
			res
			.status(200)
			.json(result);
		});
	});
	//testing
	
};


module.exports.signinvalidate = function(req,res){
	console.log("i am gonna validate signin");
	
	
	
	var test ="";
	
	 
	 
	 ////////////////////////////////////////
	 
	 var sql = "SELECT firstname FROM userdata where email =? and password =? ";
	    // get a connection from the pool
	    var arr =[req.body.email,req.body.password];
	    mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	return;
	        	}
	        // make the query
	        connection.query(sql, arr, function(err, results) {
	            connection.release();
	            if(err) {
	            	console.log(err);
	            	callback(true);
	            	return;
	            	}
	            
	            console.log(typeof(results.length));
	            if(results.length !== 0){
		            var ans = JSON.stringify(results);
		            var ans1 = JSON.parse(ans);
		            //console.log(ans1);
		            
		            req.session.username = ans1[0].firstname;
		            console.log("testingggg");
		            test = ans1[0].firstname;
		            req.session.username = test;
		            req.session.email = req.body.email;
		            json_responses = {"statusCode" : 200,"id":req.session.username};
	            }
	            //console.log(ans1[0].firstname);
	            else{
	            	console.log("Failed");
	            	json_responses = {"statusCode" : 401,"id":""};
	            }
	    		
	    		//console.log(req.body);
	    		
	    		 res
	    		.status(200)
	    		.send(json_responses);
	            
	        });
	    });
	    
	    

	    
};