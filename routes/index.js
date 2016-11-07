var express = require('express');
var router = express.Router();
var controller = require('../controllers/usercredentials');
var searchController = require('../controllers/searchvalidations');
var logFile = require('./log');
var mq_client = require('../rpc/client');

var amqp = require('amqplib/callback_api');

/* GET home page. */
router.get('/', function(req, res, next) {
	
	logFile.logToFile(req,res,'Action: Loaded home page');
		console.log(req.session.username);
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
	
	
	logFile.logToFile(req,res,'Action: signin');
	console.log(req.session.username);
	  res.render('signin', { title: 'Sign In' });
	});

router.get('/confirm-login', function (req, res) {
	console.log("session variable!!!");
	logFile.logToFile(req,res,'Action: Retrieving data from session');
	
	
	
	var cartCount = 0;
	if(typeof req.session.cartitems !== "undefined"){
		cartCount = req.session.cartitems.length; 
	}
	var tempid = 0;
	if(typeof req.session.tempid !== "undefined"){
		tempid = req.session.tempid;
	}
	
	var lastloggedin ='';
	if(typeof req.session.lastloggedin !== "undefined"){
		lastloggedin =req.session.lastloggedin; 
	}
	
	var user = {"id":req.session.username ,"cartcount":cartCount,"tempid":tempid,"lastloggedin":lastloggedin};
    res.send(user)
}
);


/*router.get('/search-details/:searchstring', function(req,res){
	
	console.log("Inside new test variable");
	console.log(req);
	res
	.status(200)
	.send();
});
*/

//router.get('/account-details', controller.getAccountDetails);

router.get('/account-details', function(req,res){

	console.log("lets get account details");	
	msgTest = {"body":req.body,"session":req.session};
	//console.log(msgTest);
	mq_client.make_request('get_account_details',msgTest, function(err,results){

		console.log("lets register new user");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{										
			
			res
			.status(200)
			.json(results);
		}  
	});


});


//router.post('/account-details',controller.setAccountDetails);

router.post('/account-details',function(req,res){
	console.log("lets set account details");	
	msgTest = {"body":req.body,"session":req.session};		
	mq_client.make_request('set_account_details',msgTest, function(err,results){

		console.log("lets register new user");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{				
			
			
			
			res
			.status(200)
			.json(results);
		}  
	});

});


//router.get('/search-mycollection', searchController.getMyCollectionData);
router.get('/search-mycollection', function(req,res){
	console.log("lets search my collection");	
	msgTest = {"body":req.body,"session":req.session,"query":req.query};		
	mq_client.make_request('search_my_collection',msgTest, function(err,results){

		console.log("search_my_collection");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{							
			res
			.status(200)
			.json(results);
		}  
	});

});


//router.get('/search-getmypurchasehistory', searchController.getMyPurchaseHistory);

router.get('/search-getmypurchasehistory', function(req,res){
	console.log("lets my purchase history");	
	msgTest = {"body":req.body,"session":req.session,"query":req.query};		
	mq_client.make_request('search_my_history',msgTest, function(err,results){

		console.log("search_my_history");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{							
			res
			.status(200)
			.json(results);
		}  
	});	
});


//router.get('/search-bidinghistory', searchController.getMyBidingHistory);
router.get('/search-bidinghistory', function(req,res){
	console.log("lets my bid history");	
	msgTest = {"body":req.body,"session":req.session,"query":req.query};		
	mq_client.make_request('my_bid_history',msgTest, function(err,results){

		console.log("search_my_history");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{							
			res
			.status(200)
			.json(results);
		}  
	});	
});



//router.get('/search-details', searchController.searchData);
router.get('/search-details', function(req,res){
	console.log("lets my search-details");	
	msgTest = {"body":req.body,"session":req.session,"query":req.query};		
	mq_client.make_request('search_details',msgTest, function(err,results){

		console.log("search_details");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{							
			res
			.status(200)
			.json(results);
		}  
	});
});



//router.get('/search-item', searchController.searchItem);

router.get('/search-item', function(req,res){
	console.log("lets my search-items");	
	msgTest = {"body":req.body,"session":req.session,"query":req.query};		
	mq_client.make_request('search_item',msgTest, function(err,results){

		console.log("search_item");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{						
			
			req.session.tempid = result.tempid;
			res
			.status(200)
			.json(results);
		}  
	});	
});

router.post('/addtocart',searchController.addToCart);
router.get('/getcart-details',searchController.getCart);
router.get('/confirmcart-details',searchController.confirmCart);

router.post('/deleteitem',searchController.deleteFromCart);
router.post('/pay',searchController.payConfirm);

router.post('/bid',searchController.saveBid);
router.post('/cartcardconfirm',function(req, res){
	
	logFile.logToFile(req,res,'Action: Validate credit card before purchase');
	console.log("card details");
	console.log(req.body.cardnumber);
	console.log(req.body.expiration);
	console.log(req.body.cvv);
	console.log(typeof req.body.cardnumber);
	console.log("card details ends");
	
	if(req.body.cardnumber == "" || req.body.expiration == ""|| req.body.cvv == ""){
		console.log("inside null");
		var data = {"condition":"failed"};
		res
		.status(200)
		.send(data);
		return;
	}
	cardLength = req.body.cardnumber.toString();
	if(cardLength.length != 16){
		console.log("inside length failure",req.body.cardnumber.length);
		var data = {"condition":"failed"};
		res
		.status(200)
		.send(data);
		return;
	}
	
	var data = {"condition":"success"};
	res
	.status(200)
	.send(data);
});


router.post('/sell', controller.storeItem);

router.get('/logout', function (req, res) {
	logFile.logToFile(req,res,'Action: Logging out!! Bye');
	console.log("session variable!!!destroy");
	var user = {"id":""};
	req.session.destroy();
    res.send(user)
}
);

//rabbitmq test
//router.post('/signin',controller.signinvalidate);
router.post('/signin',function(req,res){
	console.log("lets take a new route........");	
	msgTest = {"email":req.body.email,"password":req.body.password};		
mq_client.make_request('login_test',msgTest, function(err,results){
	
		console.log("lets take a new route");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{				
			if(results.statusCode == 200){
				console.log("inside if of staus");
				req.session.username = results.username;
	            
	            req.session.email = results.email;
	            req.session.lastloggedin =results.lastloggedin;
			}
			
			console.log("lets send it backs");
			json_responses = {"statusCode" : results.statusCode,"id":results.id,"time":results.time};
			res
    		.status(200)
    		.json(json_responses);
		}  
	});
});

//rabbitmq test
router.get('/register', function(req, res, next) {
	logFile.logToFile(req,res,'Action: Loading register page');
	  res.render('register', { title: 'Register' });
	});

//router.post('/register',controller.registerUser);//rabbit

router.post('/register',function(req,res){
	console.log("lets register new user");	
	msgTest = {"body":req.body};		
	mq_client.make_request('register_user',msgTest, function(err,results){
	
		console.log("lets register new user");
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{				
			
			
			
			res
    		.status(200)
    		.json(results);
		}  
	});
});



module.exports = router;
