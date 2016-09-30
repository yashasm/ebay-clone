var express = require('express');
var router = express.Router();
var controller = require('../controllers/usercredentials');


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
	var user = {"id":req.session.username};
    res.send(user)
}
);

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
