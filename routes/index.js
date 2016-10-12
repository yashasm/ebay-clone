var express = require('express');
var router = express.Router();
var controller = require('../controllers/usercredentials');
var searchController = require('../controllers/searchvalidations');
var logFile = require('./log');


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
router.get('/account-details', controller.getAccountDetails);
router.post('/account-details',controller.setAccountDetails);


router.get('/search-mycollection', searchController.getMyCollectionData);
router.get('/search-getmypurchasehistory', searchController.getMyPurchaseHistory);


router.get('/search-details', searchController.searchData);
router.get('/search-item', searchController.searchItem);

router.post('/addtocart',searchController.addToCart);
router.get('/getcart-details',searchController.getCart);
router.get('/confirmcart-details',searchController.confirmCart);

router.post('/deleteitem',searchController.deleteFromCart);
router.post('/pay',searchController.payConfirm);

router.post('/bid',searchController.saveBid);
router.post('/cartcardconfirm',function(req, res){
	
	logFile.logToFile(req,res,'Action: Validate credit card before purchase');
	
	if(req.body.cardnumber == "" || req.body.expiration == ""|| req.body.cvv == ""){
		var data = {"condition":"failed"};
		res
		.status(200)
		.send(data);
	}
	
	if(req.body.cardnumber.length != 16){
		var data = {"condition":"failed"};
		res
		.status(200)
		.send(data);
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


router.post('/signin',controller.signinvalidate);

router.get('/register', function(req, res, next) {
	logFile.logToFile(req,res,'Action: Loading register page');
	  res.render('register', { title: 'Register' });
	});

router.post('/register',controller.registerUser);



module.exports = router;
