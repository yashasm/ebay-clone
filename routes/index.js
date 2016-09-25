var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req, res, next) {
	  res.render('signin', { title: 'Sign In' });
	});

router.get('/register', function(req, res, next) {
	  res.render('register', { title: 'Register' });
	});

module.exports = router;
