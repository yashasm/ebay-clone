/**
 * New node file
 */

var mysqlconnpool = require('../routes/mysqlconn').pool;
var InsertQuery = require('mysql-insert-multiple');
//var mysql = require('mysql');


module.exports.payConfirm = function(req,res){
	
	console.log("inside pay and confirm");
		
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
	
	mysqlconnpool.getConnection(function (err, connection) {
		if (err) {
			console.log('MySql connection error: ' + err);

			return;
		}
		console.log("Query is >>>>>"+updatequery);
		var qResult = connection.query(updatequery);
		qResult.on('error', function(err) {
			console.log('MySql query error---------------: ' + err);
			result = {"condition":"fail"};
			return;
		});
		qResult.on('result', function(rows) {
			console.log('Got result from DB----------');
			result = {"condition":"success"};

		});
		qResult.on('end', function() {
			console.log('Going to release DB connection to the Pool--------');
			connection.release();			
		});
	});

	
console.log("-----------------------------------------");
	//multiple update test
	
	
	console.log("outside loop lets print");
	console.log("outside the loop"+JSON.stringify(dataInsert));
		
		console.log("inserting purchase history");
		
		mysqlconnpool.getConnection(function (err, connection) {
			if (err) {
				console.log('MySql connection error: ' + err);
	
				return;
			}
			console.log("Query is >>>>>"+sql);
			var qResult = connection.query(sql, [dataInsert]);
			qResult.on('error', function(err) {
				console.log('MySql query error: ' + err);
				result = {"condition":"fail"};
				return;
			});
			qResult.on('result', function(rows) {
				console.log('Got result from DB');
				result = {"condition":"success"};
	
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

module.exports.deleteFromCart = function(req,res){
	console.log("delete cart details");
	
	
	
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

module.exports.getCart = function(req,res){
	console.log("get cart details");
	console.log("req.session.username"+req.session.username);
	
	//cart changes
	var sql = "SELECT firstname,lastname,cardnumber,expiry,address,phone FROM userdata where  email = '"+req.session.email+"'";
	
	result = {};
	   mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);

	        	return;
	        	}
	        // make the query
	        //connection.query(sql, params, function(err, results) {
	        connection.query(sql, function(err, results) {
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
		            
		            
		            
		            //var tempData = {};
		            /*for(var item in ans1){
		            	console.log("found id"+ans1[item].itemid);
		            	tempData.itemid = ans1[item].itemid;
		            	tempData.itemname = ans1[item].itemname;
		            	tempData.itemprice = ans1[item].itemprice;
		            	tempData.itemavailable = ans1[item].itemavailable;
		            	tempData.itemsold = ans1[item].itemsold;
		            	//console.log("hiiii"+tempData.itemname);
		            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemdesc":ans1[item].itemdesc,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold,"itemowner":ans1[item].itemowner,"itemshippingfrom":ans1[item].itemshippingfrom,"itemcondition":ans1[item].itemcondition,"itemupdated":ans1[item].itemupdated,"itemfeature1":ans1[item].itemfeature1,"itemfeature2":ans1[item].itemfeature2,"itemfeature3":ans1[item].itemfeature3,"itemfeature4":ans1[item].itemfeature4,"itemfeature5":ans1[item].itemfeature5,"itemauction":ans1[item].itemauction,"itemstartingbid":ans1[item].itemstartingbid,"category":ans1[item].category});
		            	
		            }*/
		            //console.log("Checking after out"+JSON.stringify(result));
		            //result = {"condition":"success"};
		            
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
	            
	        });
	    });
	
	//cart changes
	
}

module.exports.addToCart = function(req,res){
	console.log("saving to cart");
	console.log("req.session.username"+req.session.username);
	
	
	//console.log("cart id"+req.session,cartitems[0].itemid);	
	if(typeof req.session.cartitems === "undefined"){
		console.log("inside if");
		
		req.session.cartitems = [];
		console.log("inside part1");
		var temp = {"itemid":req.body.itemid,"quantity":req.body.quantity,"itemname":req.body.itemname,
				"itemprice":req.body.itemprice,"seller":req.body.seller,"itemavailable":req.body.itemavailable,"itemsold":req.body.itemsold};
		req.session.cartitems.push(temp);
		console.log("inside part2");
		//req.session.cartitems.push("test");	
		
	}
	else{
		console.log("inside else");
		var temp = {"itemid":req.body.itemid,"quantity":req.body.quantity,"itemname":req.body.itemname,
				"itemprice":req.body.itemprice,"seller":req.body.seller,"itemavailable":req.body.itemavailable,"itemsold":req.body.itemsold};
		req.session.cartitems.push(temp);
		console.log("req.session.cartitem"+req.session.cartitems.length);
		//req.session.cartitems.push("test");
	}
	
	//console.log("cart length"+req.session.cartitems.length);
	console.log("Done");
	var result = {"cartcount":req.session.cartitems.length};
	res
	.status(200)
	.send(result);
	
}

module.exports.searchItem = function(req,res){
	console.log("here to get item details");
	
	var sql = "SELECT * FROM itemdata where  itemid = '"+req.query.searchid+"'";
	
	result = {};
	   mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	return;
	        	}
	        // make the query
	        //connection.query(sql, params, function(err, results) {
	        connection.query(sql, function(err, results) {
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
		            
		            //result.firstname = ans1[0].firstname;
		            
		            
		            result = {"condition":[]}
		            //var tempData = {};
		            for(var item in ans1){
		            	console.log("found id"+ans1[item].itemid);
		            	/*tempData.itemid = ans1[item].itemid;
		            	tempData.itemname = ans1[item].itemname;
		            	tempData.itemprice = ans1[item].itemprice;
		            	tempData.itemavailable = ans1[item].itemavailable;
		            	tempData.itemsold = ans1[item].itemsold;*/
		            	//console.log("hiiii"+tempData.itemname);
		            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemdesc":ans1[item].itemdesc,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold,"itemowner":ans1[item].itemowner,"itemshippingfrom":ans1[item].itemshippingfrom,"itemcondition":ans1[item].itemcondition,"itemupdated":ans1[item].itemupdated,"itemfeature1":ans1[item].itemfeature1,"itemfeature2":ans1[item].itemfeature2,"itemfeature3":ans1[item].itemfeature3,"itemfeature4":ans1[item].itemfeature4,"itemfeature5":ans1[item].itemfeature5,"itemauction":ans1[item].itemauction,"itemstartingbid":ans1[item].itemstartingbid,"category":ans1[item].category});
		            	
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
	            
	        });
	    });
}


/////////////////////


module.exports.getMyCollectionData = function(req,res){
console.log("here to get collection details");
	
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
	var sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold FROM itemdata where  onsale = 1 && itemowner = '"+req.session.email+"'";
	//params =[req.session.email];
	//itemowner = ? and
	
	console.log(sql);
	
	result = {};
	   mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	return;
	        	}
	        // make the query
	        //connection.query(sql, params, function(err, results) {
	        connection.query(sql, function(err, results) {
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
		            
		            //result.firstname = ans1[0].firstname;
		            
		            
		            result = {"condition":[]}
		            var tempData = {};
		            for(var item in ans1){
		            	console.log("found id"+ans1[item].itemid);
		            	/*tempData.itemid = ans1[item].itemid;
		            	tempData.itemname = ans1[item].itemname;
		            	tempData.itemprice = ans1[item].itemprice;
		            	tempData.itemavailable = ans1[item].itemavailable;
		            	tempData.itemsold = ans1[item].itemsold;*/
		            	console.log("hiiii"+tempData.itemname);
		            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold  });
		            	
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
	            
	        });
	    });
	   
   
}






module.exports.getMyPurchaseHistory = function(req,res){
	console.log("here to get collection details");
		
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
		   mysqlconnpool.getConnection(function(err, connection) {
		        if(err) {
		        	console.log(err);
		        	//callback(true);
		        	return;
		        	}
		        // make the query
		        //connection.query(sql, params, function(err, results) {
		        connection.query(sql, function(err, results) {
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
			            
			            //result.firstname = ans1[0].firstname;
			            
			            
			            result = {"condition":[]}
			            var tempData = {};
			            for(var item in ans1){
			            	//console.log("found id"+ans1[item].itemid);
			            	/*tempData.itemid = ans1[item].itemid;
			            	tempData.itemname = ans1[item].itemname;
			            	tempData.itemprice = ans1[item].itemprice;
			            	tempData.itemavailable = ans1[item].itemavailable;
			            	tempData.itemsold = ans1[item].itemsold;*/
			            				            	
			            	console.log("hiiii"+tempData.itemname);
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
		            
		        });
		    });
		   
	   
	}







///////////////////////

module.exports.searchData = function(req,res){
	
	console.log("here to get search details");
	
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
	
	var sql = "SELECT itemid,itemname,itemprice,itemavailable,itemsold FROM itemdata where  onsale = 1 && (itemname like '%"+searchvar+"%' or category like '%"+searchvar+"%')";	
	//params =[req.session.email];
	//itemowner = ? and
	
	console.log(sql);
	
	result = {};
	   mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);
	        	//callback(true);
	        	return;
	        	}
	        // make the query
	        //connection.query(sql, params, function(err, results) {
	        connection.query(sql, function(err, results) {
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
		            
		            //result.firstname = ans1[0].firstname;
		            
		            
		            result = {"condition":[]}
		            var tempData = {};
		            for(var item in ans1){
		            	console.log("found id"+ans1[item].itemid);
		            	/*tempData.itemid = ans1[item].itemid;
		            	tempData.itemname = ans1[item].itemname;
		            	tempData.itemprice = ans1[item].itemprice;
		            	tempData.itemavailable = ans1[item].itemavailable;
		            	tempData.itemsold = ans1[item].itemsold;*/
		            	console.log("hiiii"+tempData.itemname);
		            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold  });
		            	
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
	            
	        });
	    });
	
};




module.exports.confirmCart = function(req,res){
	console.log("get cart details");
	console.log("req.session.username"+req.session.username);
	
	//cart changes
	var sql = "SELECT firstname,lastname,cardnumber,expiry,address,phone FROM userdata where  email = '"+req.session.email+"'";
	
	result = {};
	   mysqlconnpool.getConnection(function(err, connection) {
	        if(err) {
	        	console.log(err);

	        	return;
	        	}
	        // make the query
	        //connection.query(sql, params, function(err, results) {
	        connection.query(sql, function(err, results) {
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
		            
		            
		            
		            //var tempData = {};
		            /*for(var item in ans1){
		            	console.log("found id"+ans1[item].itemid);
		            	tempData.itemid = ans1[item].itemid;
		            	tempData.itemname = ans1[item].itemname;
		            	tempData.itemprice = ans1[item].itemprice;
		            	tempData.itemavailable = ans1[item].itemavailable;
		            	tempData.itemsold = ans1[item].itemsold;
		            	//console.log("hiiii"+tempData.itemname);
		            	result.condition.push({"itemid":ans1[item].itemid, "itemname":ans1[item].itemname,"itemdesc":ans1[item].itemdesc,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold,"itemowner":ans1[item].itemowner,"itemshippingfrom":ans1[item].itemshippingfrom,"itemcondition":ans1[item].itemcondition,"itemupdated":ans1[item].itemupdated,"itemfeature1":ans1[item].itemfeature1,"itemfeature2":ans1[item].itemfeature2,"itemfeature3":ans1[item].itemfeature3,"itemfeature4":ans1[item].itemfeature4,"itemfeature5":ans1[item].itemfeature5,"itemauction":ans1[item].itemauction,"itemstartingbid":ans1[item].itemstartingbid,"category":ans1[item].category});
		            	
		            }*/
		            //console.log("Checking after out"+JSON.stringify(result));
		            //result = {"condition":"success"};
		            
	            }
	            //console.log(ans1[0].firstname);
	            else{
	            	console.log("Failed");
	            	//json_responses = {"statusCode" : 401,"id":""};
	            	result = {"condition":[],"cartdetails":[]}
	            }
	    		
	    		//console.log(req.body);
	            req.session.cartitems = [];
	    		 res
	    		.status(200)
	    		.send(result);
	    		 
	        });
	    });
	
	//cart changes
	
}
