/**
 * New node file
 */

var mysqlconnpool = require('../routes/mysqlconn').pool;

module.exports.searchData = function(req,res){
	
	console.log("here to get search details");
	
	var searchvar = "";
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
	
	var sql = "SELECT itemname,itemprice,itemavailable,itemsold FROM itemdata where  onsale = 1 and itemname like '%"+searchvar+"%' or category like '%"+searchvar+"%'";	
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
		            	
		            	tempData.itemname = ans1[item].itemname;
		            	tempData.itemprice = ans1[item].itemprice;
		            	tempData.itemavailable = ans1[item].itemavailable;
		            	tempData.itemsold = ans1[item].itemsold;
		            	console.log("hiiii"+tempData.itemname);
		            	result.condition.push({"itemname":ans1[item].itemname,"itemprice":ans1[item].itemprice,"itemavailable":ans1[item].itemavailable,"itemsold":ans1[item].itemsold  });
		            	
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