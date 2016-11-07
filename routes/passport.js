/**
 * New node file
 */
/*Passport.js*/

var passport = require("passport");
var mq_client = require('../rpc/client');
var LocalStrategy = require("passport-local").Strategy;
var logger = require('./logger');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
    	console.log("In passport.js");
    	 process.nextTick(function () {
    	            var msg_payload = {username : username, password: password};
    	            console.log(msg_payload);
    	            mq_client.make_request('login_queue',msg_payload, function(err, results){
    	                 console.log(results);
    	                if (results.statusCode === 401) {
    	                    done(null, username);
    	                }
    	                else {
    	                    console.log("username in passport.js" + username);
    	                    done(null, results);
    	                }
    	            });

    	        });
    }));
}


/*Client side function call*/

exports.checkSignIn = function(req, res, next) {
	var passport=require('passport');
    require('./passport')(passport);
    console.log(req.body);
    
    var response; 
    
    passport.authenticate('login', function(err, user, info) {
		  
		console.log("In Passport authenticate");
	    if(err) {
	      return next(err);
	    }

	    if(!user) {
	    	response={"statusCode" : 401};
			res.send(response);	
	    } else {
	    	req.logIn(user, {session:false}, function(err) {
	        if(err) {
	          return next(err);
	        }

	      console.log("USER Details!!!!!!_-------------"+user.user.email + " id : " + user.user._id);
	      req.session.user = user.user;
			console.log(req.session.user);
	      console.log("session initilized");
	      response = {
					"statuscode" : 200,
					"user" : req.session.user
			};
	      res.send(response);	
	    });
	    }
	  })(req, res, next);
}