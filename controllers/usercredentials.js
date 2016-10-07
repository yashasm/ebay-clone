/**
 * New node file
 */


var mysqlconnpool = require('../routes/mysqlconn').pool;
var bcrypt = require('bcryptjs');

module.exports.storeItem = function(req,res){
	console.log("I am gonna store the item");
	console.log(req.body);
	
	var sql = "INSERT into itemdata SET ?";
	var today = new Date();
	params = [{"itemname":req.body.itemname,"itemdesc":req.body.description,"itemprice":req.body.price,"itemavailable":req.body.quantity,"itemsold":0,"itemowner":req.session.email,"itemshippingfrom":req.body.shipping,"itemcondition":req.body.status,"itemupdated":today,"itemfeature1":req.body.feature1,"itemfeature2":req.body.feature2,"itemfeature3":req.body.feature3,"itemfeature4":req.body.feature4,"itemfeature5":req.body.feature5,"itemauction":req.body.auction,"itemstartingbid":req.body.startingbid,"category":req.body.category,"onsale":1}];
	
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

	
}

module.exports.registerUser = function(req,res){
	console.log("I am gonna register user");
	console.log(req.body);
		
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.password, salt);
	
	console.log("encrypted pass"+hash);
	var sql = "INSERT into userdata SET ?";
	params = [{"email":req.body.email,"password":hash,"firstname":req.body.firstname,"lastname":req.body.lastname,"phone":req.body.phone,"logid":"1"}];
	
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

module.exports.getAccountDetails = function(req,res){
	console.log("here to get details");
	
	var sql = "SELECT firstname,lastname,phone,handle,birthday,address,cardnumber,expiry,cvv FROM userdata where email = ?";	
	params =[req.session.email];
	//var json_responses = {"firstname":"yashas"}; 

	result = {};
	   mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	return;
	        	}
	        // make the query
	        connection.query(sql, params, function(err, results) {
	            connection.release();
	            if(err) {
	            	console.log(err);
	            	
	            	//callback(true);
	            	return;
	            	}
	            
	            console.log(typeof(results.length));
	            if(results.length !== 0){
		            var ans = JSON.stringify(results);
		            var ans1 = JSON.parse(ans);
		            //console.log(ans1);
		            
		            result.firstname = ans1[0].firstname;
		            result.lastname = ans1[0].lastname;
		            result.ebayhandle = ans1[0].handle;
		            result.birthday = ans1[0].birthday;
		            result.address = ans1[0].address;
		            result.phone = ans1[0].phone;
		            result.cardnumber = ans1[0].cardnumber;
		            result.expiry = ans1[0].expiry;
		            result.cvv = ans1[0].cvv;
	            }
	            //console.log(ans1[0].firstname);
	            else{
	            	console.log("Failed");
	            	//json_responses = {"statusCode" : 401,"id":""};
	            	result = {"condition":"fail"};
	            }
	    		
	    		//console.log(req.body);
	    		
	    		 res
	    		.status(200)
	    		.send(result);
	            
	        });
	    });
		
};

module.exports.signinvalidate = function(req,res){
	console.log("i am gonna validate signin");
	
	var test ="";
	 //req.body.password
	 var sql = "SELECT firstname,lastloggedin,password FROM userdata where email =?";
	    // get a connection from the pool
	    var arr =[req.body.email];
	    mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	return;
	        	}
	        // make the query
	        connection.query(sql, arr, function(err, results) {
	            
	            if(err) {
	            	console.log(err);
	            	//callback(true);
	            	connection.release();
	            	return;
	            	}
	            
	            
	            
	            
	            console.log(typeof(results.length));
	            if(results.length !== 0){
		            var ans = JSON.stringify(results);
		            var ans1 = JSON.parse(ans);
		            //console.log(ans1);
		            
		            //var salt = bcrypt.genSaltSync(10);
		            //var hash = bcrypt.hashSync(req.body.password, salt);
		            var hash = ans1[0].password;
		            if(bcrypt.compareSync(req.body.password, hash)){
		            
		            req.session.username = ans1[0].firstname;
		            console.log("testingggg");
		            test = ans1[0].firstname;
		            req.session.username = test;
		            req.session.email = req.body.email;
		            req.session.lastloggedin =ans1[0].lastloggedin;
		            try{
		            var date = new Date(Date.now()).toLocaleString();
		            
		            console.log("date is:"+date);
		            json_responses = {"statusCode" : 200,"id":req.session.username,"time":date};
		            var updateLoginTime = "update userdata set lastloggedin = '"+date+"' where email = '"+req.body.email+"'";
		            connection.query(updateLoginTime, function(error, resultsupdate) {
		            	if(error){
		            		console.log(error);
		            	}
		            	
		            	
		            });
		            
		            	 
		            }
		            catch(err){
		            	console.log(err);
		            }
	            }
	            else{
	            	//write failure code
	            	json_responses = {"statusCode" : 401,"id":"","time":""};
	            }
	            }
	            //console.log(ans1[0].firstname);
	            else{
	            	console.log("Failed");
	            	json_responses = {"statusCode" : 401,"id":"","time":""};
	            }
	    		
	    		//console.log(req.body);
	            connection.release();
	    		 res
	    		.status(200)
	    		.send(json_responses);
	            
	        });
	    });

};

module.exports.setAccountDetails = function(req,res){
	console.log("I am going to edit account details");
	
	console.log(req.body.birthday);
	console.log(req.body.birthday.length);
	console.log(req.body.expiry);
	console.log(req.body.expiry.length);
	
    var n = req.body.birthday.indexOf("T");
    req.body.birthday = req.body.birthday.substring(0, n);      
    req.body.expiry = req.body.birthday.substring(0, 7);
	
	var sql = "UPDATE userdata SET ? WHERE email = "+"'"+req.session.email+"'";
	params = [{"firstname":req.body.firstname,"lastname":req.body.lastname,"phone":req.body.phone,"handle":req.body.ebayhandle,"birthday":req.body.birthday,"address":req.body.address,"cardnumber":req.body.cardnumber,"expiry":req.body.expiry,"cvv":req.body.cvv}];

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

	
};
