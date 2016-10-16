/**
 * New node file
 */

//var mysqlconnpool = require('../routes/mysqlconn').pool;
var InsertQuery = require('mysql-insert-multiple');
var mysqlconn = require('../routes/mysql');//connection pool test
var logFile = require('../routes/log');


module.exports.deleteFromCart = function(req,res){
	console.log("delete cart details");
	logFile.logToFile(req,res,'Action: Deleting from cart!');
	
	
	for(i=0;i<req.session.cartitems.length;i++){
		if(req.session.cartitems[i].itemid === req.body.itemid){
			req.session.cartitems.splice(i, 1);
			break;
		}
	}
	
	var result = req.session.cartitems;
	
	
	res
	.status(200)
	.send(result);
	
}

module.exports.addToCart = function(req,res){
	console.log("saving to cart");
	
	logFile.logToFile(req,res,'Action: Adding this item to cart cart'+req.body.itemname);
	
		
	if(typeof req.session.cartitems === "undefined"){
		console.log("inside if");
		
		req.session.cartitems = [];
		console.log("inside part1");
		var temp = {"itemid":req.body.itemid,"quantity":req.body.quantity,"itemname":req.body.itemname,
				"itemprice":req.body.itemprice,"seller":req.body.seller,"itemavailable":req.body.itemavailable,"itemsold":req.body.itemsold};
		req.session.cartitems.push(temp);
		console.log("inside part2");
		
		
	}
	else{
		console.log("inside else");
		var temp = {"itemid":req.body.itemid,"quantity":req.body.quantity,"itemname":req.body.itemname,
				"itemprice":req.body.itemprice,"seller":req.body.seller,"itemavailable":req.body.itemavailable,"itemsold":req.body.itemsold};
		req.session.cartitems.push(temp);
	
	}
	
	
	
	var result = {"cartcount":req.session.cartitems.length};
	res
	.status(200)
	.send(result);
	
}


module.exports.confirmCart = function(req,res){
	console.log("get cart details");
	
	logFile.logToFile(req,res,'Action: Confirm the cart before pay');
	var sql = "SELECT firstname,lastname,cardnumber,expiry,address,phone FROM userdata where  email = '"+req.session.email+"'";
	
	result = {};
	   //mysqlconnpool.getConnection(function(err, connection) {
	mysqlconn.fetchData(function(err, results) {
	        if(err) {
	        	console.log(err);

	        	return;
	        	}
	       // connection.query(sql, function(err, results) {
	           // connection.release();
	            if(err) {
	            	console.log(err);
	            	
	            	//
	            	return;
	            	}
	            
	            console.log(typeof(results.length));
	            if(results.length !== 0){
		            var ans = JSON.stringify(results);
		            var ans1 = JSON.parse(ans);		            
		            cartDetails = [];
		            if(typeof req.session.cartitems !== "undefined"){
		        		cartDetails = req.session.cartitems; 
		        	}
		            
		            result = {"condition":[],"cartdetails":cartDetails}
		            result.condition.push({"firstname":ans1[0].firstname,
		            	"lastname":ans1[0].lastname,
		            	"address":ans1[0].address,
		            	"cardnumber":ans1[0].cardnumber,
		            	"expiry":ans1[0].expiry,
		            	"phone":ans1[0].phone
		            	});
		            		            		           		            
	            }
	            
	            else{
	            	console.log("Failed");	            	
	            	result = {"condition":[],"cartdetails":[]}
	            }
	    			    		
	            req.session.cartitems = [];
	    		 res
	    		.status(200)
	    		.send(result);
	    		 
	        //});
	    },sql,"");
	
	//cart changes
	
}

module.exports.searchData = function(req,res){
	
	console.log("Inside new connection pool code");
	logFile.logToFile(req,res,'Action: Search the itemname :'+req.query.searchstring);
	var searchvar = "";
		
	 if(typeof req.query.searchstring === "undefined"){
		 searchvar = "";
	}
	 else if(req.query.searchstring == "default"){
		 searchvar = "";
	 }
	 else{
		 searchvar = req.query.searchstring;
	 }
	 var sql = "";
	 if(typeof req.session.email === "undefined"){
		 sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold,itemauction,itemstartingbid,numberbids FROM itemdata where  onsale = 1 && (itemname like '%"+searchvar+"%' or category like '%"+searchvar+"%' or itemowner like '%"+searchvar+"%')";
	}
	 else{
		 sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold,itemauction,itemstartingbid,numberbids FROM itemdata where  onsale = 1 && itemowner != '"+req.session.email +"' && (itemname like '%"+searchvar+"%' or category like '%"+searchvar+"%')";
	 }
	 
	 if(req.query.searchstring === "list-all"){
		 sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold,itemauction,itemstartingbid,numberbids FROM itemdata where  onsale = 1 && itemowner != '"+req.session.email +"';";
	}
	 else if(req.query.searchstring === "list-bid"){
		 sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold,itemauction,itemstartingbid,numberbids FROM itemdata where  onsale = 1 && itemauction = '1' && itemowner != '"+req.session.email +"';";
	 }
	 else if(req.query.searchstring === "list-nobid"){
		 sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold,itemauction,itemstartingbid,numberbids FROM itemdata where  onsale = 1 && itemauction = '0' && itemowner != '"+req.session.email +"';";
	 }
	 
			
	console.log(sql);
	
	result = {};
	mysqlconn.fetchData(function(err, results) {
	        
		console.log("returning from query");
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
		            
		            //result.firstname = ans1[0].firstname;
		            
		            
		            result = {"condition":[]}
		            var tempData = {};
		            for(var item in ans1){
		            	console.log("found id"+ans1[item].itemid);		            	
		            	console.log("hiiii"+tempData.itemname);
		            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold,"itemauction":ans1[item].itemauction,"itemstartingbid":ans1[item].itemstartingbid,"numberbids":ans1[item].numberbids});
		            	
		            }
		            console.log("Checking after out"+JSON.stringify(result));		       
		            
	            }
	            
	            else{
	            	console.log("Failed");	            
	            	result = {"condition":[]}
	            }	    			    
	    		
	    		 res
	    		.status(200)
	    		.send(result);
	            
	        //});
	    },sql,"");	
};


module.exports.payConfirm = function(req,res){
	
	console.log("inside pay and confirm");
	logFile.logToFile(req,res,'Action: Pay and purchase the item');	
	var sql = "INSERT into purchase_history (orderid,itemid,itemname,quantity,itemprice,itemowner,customerid,customerfirstname,customerlastname,purchasedate,cardused,shippingaddress,orderprice) VALUES ?";
	var today = new Date();
	var orderid = today.getTime();
	//		
		var dataInsert = [];
		//var updateParams =[];
		var updatequery = '';
	for(i=0;i<req.session.cartitems.length;i++){
		console.log("inside loop lets print");
	
		var params = [orderid,req.session.cartitems[i].itemid,req.session.cartitems[i].itemname,
		              req.session.cartitems[i].quantity,req.session.cartitems[i].itemprice,req.session.cartitems[i].seller,
		  			req.session.email,req.session.username,req.body.lastname,
		  			today,req.body.cardnumber,req.body.address,req.body.totalprice];
		dataInsert.push(params);
		var onsaleval = 1;
		if((Number(req.session.cartitems[i].itemavailable) - Number(req.session.cartitems[i].quantity)) == 0){
			onsaleval = 0;
		}
		
		console.log("===================================="+req.session.cartitems[i].itemavailable);
		console.log("===================================="+req.session.cartitems[i].itemsold);
		
		var itemspending = Number(req.session.cartitems[i].itemavailable) - Number(req.session.cartitems[i].quantity);
		var itemssoldupdate = Number(req.session.cartitems[i].itemsold) + Number(req.session.cartitems[i].quantity);
		console.log("itemspending"+itemspending);
		console.log("itemssoldupdate"+itemssoldupdate);
		updatequery+= "Update itemdata set itemavailable = "+ itemspending +", itemsold = "+ itemssoldupdate +", onsale = " + onsaleval +" where itemid ="+req.session.cartitems[i].itemid+";";
		console.log("update query so far"+updatequery);
		//updateParams.push({itemavailable:100,itemid:req.session.cartitems[i].itemid});
		
	}
	
	//multiple update test
	console.log("update params");	

	
	console.log("testinggggg"+JSON.stringify(updatequery));
	
	//mysqlconnpool.getConnection(function (err, connection) {
	mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);
			console.log('MySql query error---------------: ' + err);
			result = {"condition":"fail"};
			return;
		}
		console.log("Query is >>>>>"+updatequery);
		console.log('Got result from DB----------');
		result = {"condition":"success"};
	},updatequery,"");

	
console.log("-----------------------------------------");
	//multiple update test
	
	
	console.log("outside loop lets print");
	console.log("outside the loop"+JSON.stringify(dataInsert));
		
		console.log("inserting purchase history");
		
		//mysqlconnpool.getConnection(function (err, connection) {
		mysqlconn.fetchData(function(err, results) {
			if (err) {
				console.log('MySql connection error: ' + err);
				result = {"condition":"fail"};
				return;
			}
			
			result = {"condition":"success"};
	

			res
			.status(200)
			.json(result);
			
		},sql,[dataInsert]);
		
		
}


module.exports.getCart = function(req,res){
	console.log("get cart details");
	console.log("req.session.username"+req.session.username);
	logFile.logToFile(req,res,'Action: Get cart details');
	//cart changes
	var sql = "SELECT firstname,lastname,cardnumber,expiry,address,phone FROM userdata where  email = '"+req.session.email+"'";
	
	result = {};
	   //mysqlconnpool.getConnection(function(err, connection) {
	mysqlconn.fetchData(function(err, results) {
	        if(err) {
	        	console.log(err);

	        	return;
	        	}
	        
	            
	            console.log(typeof(results.length));
	            if(results.length !== 0){
		            var ans = JSON.stringify(results);
		            var ans1 = JSON.parse(ans);
		            //console.log(ans1);
		            
		            //result.firstname = ans1[0].firstname;
		            cartDetails = [];
		            if(typeof req.session.cartitems !== "undefined"){
		        		cartDetails = req.session.cartitems; 
		        	}
		            
		            result = {"condition":[],"cartdetails":cartDetails}
		            result.condition.push({"firstname":ans1[0].firstname,
		            	"lastname":ans1[0].lastname,
		            	"address":ans1[0].address,
		            	"cardnumber":ans1[0].cardnumber,
		            	"expiry":ans1[0].expiry,
		            	"phone":ans1[0].phone
		            	});
		            
		            
		            		            
	            }
	            //console.log(ans1[0].firstname);
	            else{
	            	console.log("Failed");
	            	//json_responses = {"statusCode" : 401,"id":""};
	            	result = {"condition":[],"cartdetails":[]}
	            }
	    		
	    		//console.log(req.body);
	    		
	    		 res
	    		.status(200)
	    		.send(result);
	            
	        //});
	    },sql,"");
	
	//cart changes
	
}



module.exports.searchItem = function(req,res){
	console.log("here to get item details new code");
	logFile.logToFile(req,res,'Action: Get the item with item id :'+req.query.searchid);
	var sql = "SELECT * FROM itemdata where  itemid = '"+req.query.searchid+"'";
	
	result = {};
	   //mysqlconnpool.getConnection(function(err, connection) {
	mysqlconn.fetchData(function(err, results) {
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
		            
		            //result.firstname = ans1[0].firstname;
		            
		            
		            result = {"condition":[]}
		            //var tempData = {};
		            for(var item in ans1){
		            	console.log("found id"+ans1[item].itemid);
		            	
		            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemdesc":ans1[item].itemdesc,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold,"itemowner":ans1[item].itemowner,"itemshippingfrom":ans1[item].itemshippingfrom,"itemcondition":ans1[item].itemcondition,"itemupdated":ans1[item].itemupdated,"itemfeature1":ans1[item].itemfeature1,"itemfeature2":ans1[item].itemfeature2,"itemfeature3":ans1[item].itemfeature3,"itemfeature4":ans1[item].itemfeature4,"itemfeature5":ans1[item].itemfeature5,"itemauction":ans1[item].itemauction,"itemstartingbid":ans1[item].itemstartingbid,"category":ans1[item].category,"numberbids":ans1[item].numberbids,"currentbid":ans1[item].currentbid,"bidenddate":ans1[item].bidenddate});
		            	
		            }
		            console.log("Checking after out"+JSON.stringify(result));
		            //result = {"condition":"success"};
		            
	            }
	            //console.log(ans1[0].firstname);
	            else{
	            	console.log("Failed");
	            	//json_responses = {"statusCode" : 401,"id":""};
	            	result = {"condition":[]}
	            }
	    		
	    		//console.log(req.body);
	    		req.session.tempid = req.query.searchid;
	    		 res
	    		.status(200)
	    		.send(result);
	            
	        //});
	    },sql,"");
}



module.exports.getMyCollectionData = function(req,res){
	console.log("here to get collection details");
	logFile.logToFile(req,res,'Action: Get my collection data');	
		var searchvar = "";
		
		console.log("testing rest+++++++++++++++++++");
		console.log(req);
		
		console.log("testing rest+++++++++++++++++++");
		console.log(req.query.searchstring);
		
		console.log(typeof req.query.searchstring);
		
		 if(typeof req.query.searchstring === "undefined"){
			 searchvar = "";
		}
		 else if(req.query.searchstring == "default"){
			 searchvar = "";
		 }
		 else{
			 searchvar = req.query.searchstring;
		 }
		
		//var sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold FROM itemdata where  onsale = 1 && (itemname like '%"+searchvar+"%' or category like '%"+searchvar+"%')";
		var sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold,currentbid,numberbids,itemauction FROM itemdata where  itemowner = '"+req.session.email+"'";
		//params =[req.session.email];
		//itemowner = ? and
		
		console.log(sql);
		
		result = {};
		   //mysqlconnpool.getConnection(function(err, connection) {
		mysqlconn.fetchData(function(err, results) {
			   
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
			            
			            //result.firstname = ans1[0].firstname;
			            
			            
			            result = {"condition":[]}
			            var tempData = {};
			            for(var item in ans1){
			            	console.log("found id"+ans1[item].itemid);
			            	
			            	console.log("hiiii"+tempData.itemname);
			            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold,"itemauction":ans1[item].itemauction,"currentbid":ans1[item].currentbid,"numberbids":ans1[item].numberbids  });
			            	
			            }
			            console.log("Checking after out"+JSON.stringify(result));
			            //result = {"condition":"success"};
			            
		            }
		            //console.log(ans1[0].firstname);
		            else{
		            	console.log("Failed");
		            	//json_responses = {"statusCode" : 401,"id":""};
		            	result = {"condition":[]}
		            }
		    		
		    		//console.log(req.body);
		    		
		    		 res
		    		.status(200)
		    		.send(result);
		            
		        //});
		    },sql,"");
		   
	   
	}


module.exports.getMyBidingHistory = function(req,res){
	
	console.log("here to get collection details");
	logFile.logToFile(req,res,'Action: Get my Bidding history');	
		//var searchvar = "";
		
	
		var sql = "SELECT * FROM bid_details where customerid = '"+req.session.email+"'";
		//params =[req.session.email];
		//itemowner = ? and
		
		console.log(sql);
		
		result = {};
		   //mysqlconnpool.getConnection(function(err, connection) {
		mysqlconn.fetchData(function(err, results) {
		        if(err) {
		        	console.log(err);
		        	//callback(true);
		        	return;
		        	}
		            
		            console.log(typeof(results.length));
		            if(results.length !== 0){
			            var ans = JSON.stringify(results);
			            var ans1 = JSON.parse(ans);			            
			            result = {"condition":[]}
			            var tempData = {};
			            for(var item in ans1){
			            				            	
			            	
			            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemowner":ans1[item].itemowner,
			            		"customerid":ans1[item].customerid,"bidingamount":ans1[item].bidingamount });
			            	
			            }
			            console.log("Checking after out"+JSON.stringify(result));
			            //result = {"condition":"success"};
			            
		            }
		            //console.log(ans1[0].firstname);
		            else{
		            	console.log("Failed");
		            	//json_responses = {"statusCode" : 401,"id":""};
		            	result = {"condition":[]}
		            }
		    		
		    		//console.log(req.body);
		    		
		    		 res
		    		.status(200)
		    		.send(result);
		            
		        //});
		    },sql,"");
	
};


module.exports.getMyPurchaseHistory = function(req,res){
	console.log("here to get collection details");
	logFile.logToFile(req,res,'Action: Get my purchase history');	
		var searchvar = "";
		
		console.log("testing rest+++++++++++++++++++");
		console.log(req);
		
		console.log("testing rest+++++++++++++++++++");
		console.log(req.query.searchstring);
		
		console.log(typeof req.query.searchstring);
		
		
		
		//var sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold FROM itemdata where  onsale = 1 && (itemname like '%"+searchvar+"%' or category like '%"+searchvar+"%')";
		//var sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold FROM itemdata where  onsale = 1 && itemowner = '"+req.session.email+"'";
		var sql = "SELECT itemname,itemprice,quantity,itemowner,orderid,shippingaddress,orderprice FROM purchase_history where customerid = '"+req.session.email+"'";
		//params =[req.session.email];
		//itemowner = ? and
		
		console.log(sql);
		
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
		        //connection.query(sql, function(err, results) {
		            //connection.release();
		            
		            
		            console.log(typeof(results.length));
		            if(results.length !== 0){
			            var ans = JSON.stringify(results);
			            var ans1 = JSON.parse(ans);			            
			            result = {"condition":[]}
			            var tempData = {};
			            for(var item in ans1){
			            				            	
			            	
			            	result.condition.push({"orderid":ans1[item].orderid, "itemname":ans1[item].itemname,"itemprice":ans1[item].itemprice,
			            		"quantity":ans1[item].quantity,"itemowner":ans1[item].itemowner,"shippingaddress":ans1[item].shippingaddress,"orderprice":ans1[item].orderprice  });
			            	
			            }
			            console.log("Checking after out"+JSON.stringify(result));
			            //result = {"condition":"success"};
			            
		            }
		            //console.log(ans1[0].firstname);
		            else{
		            	console.log("Failed");
		            	//json_responses = {"statusCode" : 401,"id":""};
		            	result = {"condition":[]}
		            }
		    		
		    		//console.log(req.body);
		    		
		    		 res
		    		.status(200)
		    		.send(result);
		            
		        //});
		    },sql,"");		  	  
	}


module.exports.saveBid = function(req,res){
	logFile.logToFile(req,res,'Action: Biding for the item');
	console.log('+++++++++++++++++++++++++++++');
	try{
	logFile.bidLogToFile(req,res,req.body.itemid,req.body.bidamount,'Placing a new bid for item:');
	}
	catch(err){
		console.log(err)
	}
	console.log('+++++++++++++++++++++++++++++');
	var updateSql = "Update itemdata set numberbids = numberbids + 1, currentbid = "+ req.body.bidamount +" where itemid ="+req.body.itemid+";"
	var insertSql = updateSql+"INSERT into bid_details (itemid,itemname,itemowner,customerid,bidingamount) values ("+req.body.itemid+",'"+req.body.itemname+"','"+req.body.seller+"','"+req.session.email+"','"+req.body.bidamount+"');"; 
				
	console.log("query is:"+insertSql);
	mysqlconn.fetchData(function(err, results) {
		if (err) {
			console.log('MySql connection error: ' + err);
			console.log('MySql query error---------------: ' + err);
			result = {"condition":"fail"};
			return;
		}
		console.log("Query is >>>>>"+insertSql);
		console.log('Got result from DB----------');
		result = {"condition":"success","bidamount":req.body.bidamount,"numberbids":Number(req.body.numberbids) + 1};
	

		res
		.status(200)
		.json(result);
	},insertSql,"");
}

