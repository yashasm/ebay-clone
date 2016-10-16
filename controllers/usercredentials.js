/**
 * New node file
 */


//var mysqlconnpool = require('../routes/mysqlconn').pool;
var bcrypt = require('bcryptjs');
var mysqlconn = require('../routes/mysql');//connection pool test
var logFile = require('../routes/log');

module.exports.storeItem = function(req,res){
	console.log("I am gonna store the item");
	console.log(req.body);
	logFile.logToFile(req,res,'Action: Store the item to sell!'+req.body.itemname);
	var sql = "INSERT into itemdata SET ?";
	var today = new Date();
	try{
	var bidend = new Date(today);
	bidend.setDate(bidend.getDate() + 4);
	}
	catch(err){
		console.log(err);
	}
	console.log("Before insertin the item");
	
	
	params = [{"itemname":req.body.itemname,"itemdesc":req.body.description,"itemprice":req.body.price,"itemavailable":req.body.quantity,"itemsold":0,"itemowner":req.session.email,"itemshippingfrom":req.body.shipping,"itemcondition":req.body.status,"itemupdated":today,"itemfeature1":req.body.feature1,"itemfeature2":req.body.feature2,"itemfeature3":req.body.feature3,"itemfeature4":req.body.feature4,"itemfeature5":req.body.feature5,"itemauction":req.body.auction,"itemstartingbid":req.body.startingbid,"category":req.body.category,"onsale":1,"currentbid":req.body.startingbid,"bidenddate":bidend}];
	
	//mysqlconnpool.getConnection(function (err, connection) {
	mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);
			//callback(err, true);
			result = {"condition":"fail"};
			return;
		}
		
		console.log('Got result from DB');
		result = {"condition":"success"};
		
		console.log('Going to release DB connection to the Pool');
		
		res
		.status(200)
		.json(result);
		
		
	},sql,params);

	var createTimer = 'select max(itemid) numb from itemdata';
	mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);
			//callback(err, true);
			//result = {"condition":"fail"};
			return;
		}
		
		 var ans = JSON.stringify(results);
         var ans1 = JSON.parse(ans);
         //console.log(ans1);
         
         
		
     	setTimeout(function() {
		    settleBid(ans1[0].numb);
		}, 600000);
		
		
		console.log('Got result from DB');
		
		
		console.log('Going to release DB connection to the Pool');
	},createTimer,"");
	
}


function settleBid(itemid){
	console.log("Settling the bid for"+itemid);
	
	var getSql = "select * from bid_details where itemid = '"+itemid+"' and bidingamount = (select max(bidingamount) from bid_details where itemid ='"+ itemid+ "' )";
	
	mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);					
			return;
		}
		//console.log("Query is >>>>>"+sql);
		
		//if(results.length !== 0){
            var ans = JSON.stringify(results);
            var ans1 = JSON.parse(ans);                      
             //= ans1[0].itemid;
             //= ans1[0].lastname;
            
            
		var today = new Date();
		var orderid = today.getTime();
		
		
		var sqlbid = "INSERT into purchase_history (orderid,itemid,itemname,quantity,itemprice,itemowner,customerid," +
		"customerfirstname,customerlastname,purchasedate,orderprice)" +
		" VALUES ('"+orderid+"','"+ ans1[0].itemid+"','"+ ans1[0].itemname +"','"+1+"','"+ans1[0].bidingamount+"','"+ans1[0].itemowner+"','"+ans1[0].customerid+"','"+ans1[0].customerfirstname+"','"+ans1[0].customerlastname+"','"+today+"','"+ans1[0].bidingamount+"');";
		sqlbid += "Update itemdata set onsale = 0 where itemid ="+ ans1[0].itemid+";";

		
		console.log("bid sql is:"+sqlbid);
		logFile.bidLogToFile(req,res,ans1[0].itemid,ans1[0].bidingamount,'Settling the bid after the time');	
		mysqlconn.fetchData(function(err, results) {
			if (err) {
				console.log('MySql connection error: ' + err);					
				return;
			}
		},sqlbid,"");
			
	},getSql,"");
	
	
	
}

module.exports.registerUser = function(req,res){
	console.log("I am gonna register user");
	logFile.logToFile(req,res,'Action: Register new user'+req.body.firstname);
	console.log(req.body);
		
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.password, salt);
	
	console.log("encrypted pass"+hash);
	var sql = "INSERT into userdata SET ?";
	params = [{"email":req.body.email,"password":hash,"firstname":req.body.firstname,"lastname":req.body.lastname,"phone":req.body.phone,"logid":"1"}];
	
	console.log(sql);
	var result;
	//testing 
	//mysqlconnpool.getConnection(function (err, connection) {
	mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);
			//callback(err, true);
			result = {"condition":"fail"};
			return;
		}
		console.log("Query is >>>>>"+sql);
		//var qResult = connection.query(sql, params);
		
		console.log('Got result from DB');
		result = {"condition":"success"};
		
		
		console.log('Going to release DB connection to the Pool');
		
		res
		.status(200)
		.json(result);
		
	},sql,params);
	//testing
	
};


module.exports.getAccountDetails = function(req,res){
	console.log("here to get details");
	logFile.logToFile(req,res,'Action: Get account details of user :'+req.session.email);
	var sql = "SELECT firstname,lastname,phone,handle,birthday,address,cardnumber,expiry,cvv FROM userdata where email = ?";	
	params =[req.session.email];
	//var json_responses = {"firstname":"yashas"}; 

	result = {};
	   //mysqlconnpool.getConnection(function(err, connection) {
	mysqlconn.fetchData(function(err, results) {
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	return;
	        	}
	        // make the query
	        //connection.query(sql, params, function(err, results) {
	           // connection.release();
	            
	            
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
	            
	        //});
	    },sql, params);
		
};


module.exports.signinvalidate = function(req,res){
	console.log("i am gonna validate signin");
	logFile.logToFile(req,res,'Action: Validate signin for user :'+req.body.email);
	var test ="";
	 //req.body.password
	 var sql = "SELECT firstname,lastloggedin,password FROM userdata where email = ?";
	    // get a connection from the pool
	    var arr =[req.body.email];
	    //mysqlconnpool.getConnection(function(err, connection) {
	    mysqlconn.fetchData(function(err, results) {
	    	
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	console.log("Failed");
            	json_responses = {"statusCode" : 401,"id":"","time":""};

        		res
        		.status(200)
        		.json(result);
	        	}
	        // make the query
	        //connection.query(sql, arr, function(err, results) {
	            
	            
	            
	            
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
		            json_responses = {"statusCode" : 200,"id":req.session.username,"time":req.session.lastloggedin};
		            try{
		            var date = new Date(Date.now()).toLocaleString();
		            
		            console.log("date is:"+date);
		            
		            var updateLoginTime = "update userdata set lastloggedin = '"+date+"' where email = '"+req.body.email+"'";
		            
		            ///test this
		            
		            
		            mysqlconn.fetchData(function(error, results) {
		            	
		            	if(error){
		            		console.log(error);
		            	}
		            	
		            },updateLoginTime, "");
		            ///test this
		            	 
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
	            //connection.release();
	    		 res
	    		.status(200)
	    		.send(json_responses);
	            
	        //});
	    },sql, arr);

};


module.exports.setAccountDetails = function(req,res){
	console.log("I am going to edit account details");
	logFile.logToFile(req,res,'Action: update account details for user :'+req.body.firstname);
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
	//mysqlconnpool.getConnection(function (err, connection) {
    mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);
			//callback(err, true);
			result = {"condition":"fail"};
			return;
		}
		console.log('Got result from DB');
		result = {"condition":"success"};
	
		console.log('Going to release DB connection to the Pool');
		
		res
		.status(200)
		.json(result);
		
	},sql,params);

	
};
