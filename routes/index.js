var express = require('express');
var router = express.Router();
var controller = require('../controllers/usercredentials');
var searchController = require('../controllers/searchvalidations');


/* GET home page. */
router.get('/', function(req, res, next) {
	
	console.log(req.session.username);
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
	
	console.log(req.session.username);
	  res.render('signin', { title: 'Sign In' });
	});

router.get('/confirm-login', function (req, res) {
	console.log("session variable!!!");
	var cartCount = 0;
	if(typeof req.session.cartitems !== "undefined"){
		cartCount = req.session.cartitems.length; 
	}
	var tempid = 0;
	if(typeof req.session.tempid !== "undefined"){
		tempid = req.session.tempid;
	}
	
	var user = {"id":req.session.username ,"cartcount":cartCount,"tempid":tempid};
    res.send(user)
}
);


router.get('/search-details/:searchstring', function(req,res){
	console.log("Inside new test variable");
	console.log(req);
	res
	.status(200)
	.send();
});

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


router.post('/sell', controller.storeItem);

router.get('/logout', function (req, res) {
	console.log("session variable!!!destroy");
	var user = {"id":""};
	req.session.destroy();
    res.send(user)
}
);


router.post('/signin',controller.signinvalidate);

router.get('/register', function(req, res, next) {
	  res.render('register', { title: 'Register' });
	});

router.post('/register',controller.registerUser);



module.exports = router;
