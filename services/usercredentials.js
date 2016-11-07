/**
 * New node file
 */
var MongoClient = require('mongodb').MongoClient;//rabbit

//var mysqlconnpool = require('../routes/mysqlconn').pool;
var bcrypt = require('bcryptjs');
//var mysqlconn = require('../routes/mysql');//connection pool test
var logFile = require('../routes/log');

var mongoconn = require('../routes/mongodb');//mongo

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
	var itemAuction = 0;
	if(req.body.auction){
		itemAuction = 1;
	}
	
	params = [{"itemname":req.body.itemname,"itemdesc":req.body.description,"itemprice":req.body.price,"itemavailable":req.body.quantity,"itemsold":0,"itemowner":req.session.email,"itemshippingfrom":req.body.shipping,"itemcondition":req.body.status,"itemupdated":today,"itemfeature1":req.body.feature1,"itemfeature2":req.body.feature2,"itemfeature3":req.body.feature3,"itemfeature4":req.body.feature4,"itemfeature5":req.body.feature5,"itemauction":itemAuction,"itemstartingbid":req.body.startingbid,"category":req.body.category,"onsale":1,"currentbid":req.body.startingbid,"bidenddate":bidend}];
	
	console.log("auction :",req.body.auction);
	mongoconn.connect(function(_connection){
		
		var itemdata = _connection.collection('itemdata');
		itemdata.insert({"itemname":req.body.itemname,"itemdesc":req.body.description,"itemprice":req.body.price,"itemavailable":req.body.quantity,"itemsold":0,"itemowner":req.session.email,"itemshippingfrom":req.body.shipping,"itemcondition":req.body.status,"itemupdated":today,"itemfeature1":req.body.feature1,"itemfeature2":req.body.feature2,"itemfeature3":req.body.feature3,"itemfeature4":req.body.feature4,"itemfeature5":req.body.feature5,"itemauction":itemAuction,"itemstartingbid":req.body.startingbid,"category":req.body.category,"onsale":1,"currentbid":req.body.startingbid,"bidenddate":bidend,"numberbids":0},function(err,docsInserted){
			console.log(docsInserted);

	     	setTimeout(function() {
			    settleBid(docsInserted[0]._id);
			}, 600000);
	     	
			if(err){

				result = {"condition":"fail"};
				res
				.status(200)
				.json(result);
			}
			

			result = {"condition":"success"};
			res
			.status(200)
			.json(result);
			
		});
		

		
	});
	
	
	
}


/*function settleBid(itemid){
	console.log("Settling the bid for"+itemid);
	
	var getSql = "select * from bid_details where itemid = '"+itemid+"' and bidingamount = (select max(bidingamount) from bid_details where itemid ='"+ itemid+ "' )";
	
	mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);					
			return;
		}
		
            var ans = JSON.stringify(results);
            var ans1 = JSON.parse(ans);                      
             
            
            
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
	
	
	
}*/

module.exports.registerUser = function(req,callback){
	console.log("I am gonna register user");
	//logFile.logToFile(req,res,'Action: Register new user'+req.body.firstname);
	console.log(req.body);
	

	
	mongoconn.connect(function(_connection){
		
		
		var userdata = _connection.collection('userdata');
		
		userdata
		.find({"email":req.body.email})
		.toArray(function(err,docs){
			console.log("same record++++",docs);
			
			if(docs.length == 0){
				
				console.log("doc is empty!!!!!!",docs.length);
				userdata.insert({"email":req.body.email,"password":req.body.password,"firstname":req.body.firstname,"lastname":req.body.lastname,"phone":req.body.phone});
				
				console.log('Got result from DB');
				result = {"condition":"success"};
				
				
				console.log('Going to release DB connection to the Pool');
				
				callback(null, result);
				/*res
				.status(200)
				.json(result);*/
				return;
			}
			else{
				console.log("Doc is not empty",docs.length);
				result = {"condition":"fail"};	
				/*res
				.status(200)
				.json(result);*/
				callback(null, result);
				return;
			}
			
			
		});
				
	});

	//testing mongo
		
	
};


module.exports.getAccountDetails = function(req,callback){
	console.log("here to get details");
	//logFile.logToFile(req,res,'Action: Get account details of user :'+req.session.email);
	var sql = "SELECT firstname,lastname,phone,handle,birthday,address,cardnumber,expiry,cvv FROM userdata where email = ?";	
	params =[req.session.email];
	//var json_responses = {"firstname":"yashas"}; 

	result = {};
	
	
	//mongo changes starts
	mongoconn.connect(function(_connection){
		var userdata = _connection.collection('userdata');
		console.log("Gonna fetch records",req.session.email);
		userdata
		.find({'email':req.session.email},{'firstname':1,'lastname':1,'phone':1,'handle':1,'birthday':1,'address':1,'cardnumber':1,'expiry':1,'cvv':1})
		.toArray(function(err,docs){
			console.log("what did i get",docs);
			if(err){
				console.log("Failed");            	
            	result = {"condition":"fail"};
			}
			else{
				
				console.log("Got records",docs);
				
				result.firstname = docs[0].firstname;
	            result.lastname = docs[0].lastname;
	            result.ebayhandle = docs[0].handle;
	            result.birthday = docs[0].birthday;
	            result.address = docs[0].address;
	            result.phone = docs[0].phone;
	            result.cardnumber = docs[0].cardnumber;
	            result.expiry = docs[0].expiry;
	            result.cvv = docs[0].cvv;
			}

			callback(null, result);
   		 /*res
   		.status(200)
   		.send(result);*/
		});
		
	});
	
	//mongo changes ends
		
};


module.exports.signinvalidate = function(req,callback){
	console.log("i am gonna validate signin lets seeeeeeeeee");
	
	/*json_responses = {"statusCode" : 200,"id":"emma","time":"",
    		"username":"emma","email":"emma@gmail.com","lastloggedin":""};
	callback(null, json_responses);
	
	return;*/
	
	//var mongoURL = 'mongodb://localhost:27017/ebaydb';
	
	//logFile.logToFile(req,res,'Action: Validate signin for user :'+req.email);
	console.log("Hey i just passed logging");
	var test ="";
	 //req.body.password
	 //var sql = "SELECT firstname,lastloggedin,password FROM userdata where email = ?";
	    // get a connection from the pool
	    //var arr =[req.body.email];
	/*
	MongoClient.connect(mongoURL, function(err, _db){
        console.log("Creating a new connection in the pool with MongoDB at : "+mongoURL);
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        
        // Adding the connection to the pool.
        //connPool.push(db);
        //connected = true;
        //console.log(connected +" is connected?");
    });*/
	    
	//return;
	    mongoconn.connect(function(_connection){
	    	//req.body.password
	    	//req.body.email

			var userdata = _connection.collection('userdata');
			console.log("req data",req);
			userdata
			.find({"email":req.email,"password":req.password})
			.toArray(function(err,docs){
				if(docs.length == 0){
					json_responses = {"statusCode" : 401,"id":"","time":""};
					console.log("failed new",err);
	        		/*res
	        		.status(200)
	        		.json(json_responses);
	        		*/
	        		callback(null, json_responses);
				}
				else{
					console.log(docs);
					console.log('------------');
					console.log(docs[0].email);
					console.log("failed");
					
					/*req.session.username = docs[0].firstname;
		            
		            req.session.email = req.body.email;
		            req.session.lastloggedin =docs[0].lastloggedin;*/
		            json_responses = {"statusCode" : 200,"id":docs[0].firstname,"time":docs[0].lastloggedin,
		            		"username":docs[0].firstname,"email":req.email,"lastloggedin":docs[0].lastloggedin};
		            
		           
			            var date = new Date(Date.now()).toLocaleString();
			            
			            console.log("date is:"+date);
			            
			            //var updateLoginTime = "update userdata set lastloggedin = '"+date+"' where email = '"+req.body.email+"'";
			            userdata.update({"email":req.email},{$set:{"lastloggedin":date}});
/*
		        		res
		        		.status(200)
		        		.json(json_responses);*/
			            
		        		callback(null, json_responses);//rabbitmq
		         
				}
			});

	    	
	    	
	    });
	    
	    console.log("Going back!!!!!!!!");
	    

};


module.exports.setAccountDetails = function(req,callback){
	console.log("I am going to edit account details");
	//logFile.logToFile(req,res,'Action: update account details for user :'+req.body.firstname);
	//console.log(req.body.birthday);
	//console.log(req.body.birthday.length);
	//console.log(req.body.expiry);
	//console.log(req.body.expiry.length);
	
    var n = req.body.birthday.indexOf("T");
    req.body.birthday = req.body.birthday.substring(0, n);      
    req.body.expiry = req.body.birthday.substring(0, 7);
	
	var sql = "UPDATE userdata SET ? WHERE email = "+"'"+req.session.email+"'";
	params = [{"firstname":req.body.firstname,"lastname":req.body.lastname,"phone":req.body.phone,"handle":req.body.ebayhandle,"birthday":req.body.birthday,"address":req.body.address,"cardnumber":req.body.cardnumber,"expiry":req.body.expiry,"cvv":req.body.cvv}];

	//console.log(sql);
	var result;
	req.body.cardnumber = "yashascardnumber";
    mongoconn.connect(function(_connection){
    	
    	try{
    		
    		var phoneNumb = Number(req.body.phone);
    		
    		if(isNaN(phoneNumb)){
    			console.log("Given phone number-->",req.body.phone);
    			console.log("Phone number should be numbers");
    			result = {"condition":"fail"};
    			callback(null, result);//rabbitmq
    		}
    		
    		var cardNumb = Number(req.body.cardnumber);
    		
    		if(isNaN(cardNumb)){
    			console.log("Given card number-->",req.body.cardnumber);
    			console.log("Card number should be numbers");
    			result = {"condition":"fail"};
    			callback(null, result);//rabbitmq
    		}
    		
    	}
    	catch(Exception){
    		
    		console.log(Exception);
    	}
    	
    	
    	var userdata = _connection.collection('userdata');
    	userdata
    	.update({"email":req.session.email},
    			{$set:{"firstname":req.body.firstname,"lastname":req.body.lastname,"phone":req.body.phone,"handle":req.body.ebayhandle,"birthday":req.body.birthday,"address":req.body.address,"cardnumber":req.body.cardnumber,"expiry":req.body.expiry,"cvv":req.body.cvv}}
    	,function(err,docs){
    		console.log("Should faile here");
    		if (err) {
    			console.log('MySql connection error: ' + err);
    			//callback(err, true);
    			result = {"condition":"fail"};
    			return;
    		}
    		console.log('Got result from DB');
    		result = {"condition":"success"};
    	
    		console.log('Going to release DB connection to the Pool');
    		callback(null, result);//rabbitmq
    		/*res
    		.status(200)
    		.json(result);*/
    	})
    });
    
};
