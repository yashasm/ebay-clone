/**
 * New node file
 */

var ebayApp = angular.module('ebayApp',['ngMaterial','ngAnimate','ngAria','ngRoute'])



ebayApp.config(function($routeProvider){
		
	$routeProvider	
	.when('/',{
		templateUrl:'angular/main.ejs'		
	})
	.when('/account',{templateUrl:'angular/account.ejs'})
	.when('/home',{templateUrl:'angular/main.ejs'})
	.when('/basicsearch',{templateUrl:'angular/search.ejs'})
	.when('/myCollection',{templateUrl:'angular/mycollection.ejs'})
	.when('/sell',{templateUrl:'angular/sell.ejs'})
	.when('/itemdetails',{templateUrl:'angular/itemdetails.ejs'})
	
});


ebayApp.controller('mycollection',['$scope','userservice','$http',function($scope,userservice,$http){

	$scope.$on('$routeChangeSuccess', function () {
		  console.log("executed now");
		});
}]);

ebayApp.controller('searchpage',['$scope','userservice','$http',function($scope,userservice,$http){
	$scope.values = [];
	
	$scope.searchquery = userservice.searchquery;
		
	$scope.searchClicked = function(val){
		console.log("search clicked");
		userservice.searchquery = val;
		$scope.searchquery = val;
	};

	
	$scope.itemClicked = function(val){
		console.log("clicked"+val);
		userservice.id = val;
	}
	
	$scope.$watch(function(){
	    return userservice.searchquery;
	}, function (newValue) {
	    
		
		formDetails = {"searchstring":newValue};			
		$scope.values = [];
		$http({
			method : "GET",
			url : '/search-details',
			params : formDetails
		}).success(function(details) {
			console.log("account---"+details.condition[0].itemid);
	    	$scope.values = details.condition;
		});			

		
		
	});		
}]);


ebayApp.controller('itemdetailscontroller',['$scope','userservice','$http',function($scope,userservice,$http){
	$scope.id = userservice.id;
	
	
	
	$scope.$watch(function(){
	    return userservice.id;
	}, function (newValue) {	    				
		$scope.id = newValue;
		
		
		formDetails = {"searchid":newValue};			
		$scope.values = [];
		$http({
			method : "GET",
			url : '/search-item',
			params : formDetails
		}).success(function(details) {
			
			
	    	$scope.values = details.condition;
	    	console.log("item---"+$scope.values[0].itemname);
	    	console.log("item---"+$scope.values[0].category);
		});
		
		
	});
	$scope.showshipping = false;
	
	$scope.shippingClicked = function(){
		$scope.showshipping = true;
	}
	$scope.detailClicked = function(){
		$scope.showshipping = false;
	}
	
}]);


ebayApp.controller('searchcontroller',['$scope','userservice',function($scope,userservice){
	
	$scope.searchquery = userservice.searchquery;
	
	 
	
	$scope.searchClicked = function(){
		console.log("search clicked");
		userservice.searchquery = $scope.searchitem;
	};
	
}]);


ebayApp.controller('indexcontroller',['$scope','userservice',function($scope,userservice){
	$scope.searchquery = userservice.searchquery;
	
	$scope.searchClicked = function(val){
		console.log("search clicked");
		userservice.searchquery = val;
		$scope.searchquery = val;
	};
	
}]);

ebayApp.service('userservice',['$http',function($http){
	
	this.username = "";
	this.id = "";
	var curr = this;
	this.searchquery = "default";
	
	$http.get('/confirm-login')
    .success(function (user) {
    	console.log("login---"+user.id);
    		
    	curr.username = user.id;
        
    });
	
}]);


ebayApp.controller('accountcontroller',['$scope','userservice','$http',function($scope,userservice,$http){
	
	$scope.username = userservice.username;
	$scope.successreg = false;
	$scope.$watch(function(){
	    return userservice.username;
	}, function (newValue) {
	    
	    $scope.username = newValue;
	    
	    
		$http.get('/account-details')
	    .success(function (details) {
	    	console.log("account---"+details.birthday);
	    		
	    	
	    	$scope.firstname = details.firstname;	    		    
			$scope.lastname = details.lastname; 
			$scope.ebayhandle = details.ebayhandle;
			$scope.birthday =  new Date(details.birthday);
			$scope.address = details.address;
			$scope.phone = details.phone;
			$scope.cardnumber = Number(details.cardnumber);
			$scope.expiry = new Date(details.expiry);
			$scope.cvv = details.cvv;
	    	
	    });
		
	});
	
	$scope.saveDetails = function(){
		var formDetails = {
				"firstname":$scope.firstname,
				"lastname":$scope.lastname,
				"ebayhandle":$scope.ebayhandle,
				"birthday":$scope.birthday,
				"address":$scope.address,
				"phone":$scope.phone,
				"cardnumber":$scope.cardnumber,
				"expiry":$scope.expiry,
				"cvv":$scope.cvv
		};
		
		$http({
			  method: 'POST',
			  url: 'account-details',
			  data : formDetails
			  
			  
			}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				
				/*if(response.data.condition == "success"){
					$scope.registeredsuccess = true;
				}
				else{
					$scope.registeredsuccess = false;
				}*/
				console.log("inside success");
				$scope.successreg = true;
				
				
			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				  console.log("inside failure");
			  });
		
	};
	
}]);

ebayApp.controller('headercontroller',['$scope','userservice','$http',function($scope,userservice,$http){
		
	
	$scope.showHeader = false;
	$scope.username = userservice.username;
	
	if($scope.username == ""){		
		$scope.historylink = 'http://localhost:3000/signin';
	}
	else{
		$scope.historylink = '';
	}
	
	if($scope.username == ""){		
		$scope.bidslink = 'http://localhost:3000/signin';
	}
	else{
		$scope.bidslink = '';
	}
	
	if($scope.username == ""){		
		$scope.selllink = 'http://localhost:3000/signin';
	}
	else{
		$scope.selllink = '#/sell';
	}
	
	
	////
	if($scope.username == "" ){
		$scope.showHeader = true;
	}
	
	
	$scope.$watch(function(){
	    return userservice.username;
	}, function (newValue) {
	    
	    $scope.username = newValue;
	
	    if($scope.username == "" ){
	    	
			$scope.showHeader = true;
			$scope.selllink = 'http://localhost:3000/signin';
		}
	    else if(typeof $scope.username === "undefined"){
	    	
			$scope.showHeader = true;
			$scope.selllink = 'http://localhost:3000/signin';
	    }	    
	    else{
	    	$scope.selllink = '#/sell';	
	    	$scope.showHeader = false;
	    }
	});
	
	
	$scope.logout = function(){
		$http.get('/logout')
	    .success(function (user) {
	    	console.log("logout---"+user.id);
	    		
	    	$scope.username = "";    	
	    	window.location.assign("/");
	        
	    });
	};
	
	
}]);


ebayApp.controller('signincontroller',['$scope','$http','userservice',function($scope,$http,userservice){
	
	$scope.emailsign = "";
	$scope.passwordsign = "";
	$scope.userservice = userservice;
	$scope.errorfound = false;
	$scope.username = "";
	
	$scope.$watch('username',function(newVal){
		console.log("hiiiii"+newVal);
		userservice.username =$scope.username; 
	},true);
	
	$scope.signinclicked = function(){
		var dataval = {
				"email":$scope.emailsign,
				"password":$scope.passwordsign
		};			
		
		$http({
			method : "POST",
			url : '/signin',
			data : dataval
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				//write failure code
				$scope.errorfound = true;
			}
			else {
				//Making a get call to the '/redirectToHomepage' API
				$scope.errorfound = false;
				console.log("return success"+data.id);
				//userservice.set(data.id);
				$scope.username = data.id;
				
				
				window.location.assign("/");
			}
			
		}).error(function(error) {
			//write failure code
			$scope.errorfound = true;
		});
	} 
	
}]);


ebayApp.controller('registercontroller',['$scope','$http',function($scope,$http){
	
	$scope.emailClicked = false;
	$scope.reemailClicked = false;
	$scope.characters = 5;
	$scope.reemailreason = 1;
	$scope.shotHint = false;
	$scope.errorfound = false;
	$scope.regpassword = "";
	$scope.regfirstname = "";
	$scope.reglastname = "";
	$scope.regphonenum = "";
	$scope.registeredsuccess = false;
	
	$scope.emailClickedFirst = function(){
		$scope.emailClicked = true;
		$scope.emailError = true;
		$scope.reason = 1;
	};
	
	$scope.reemailClickedFirst = function(){
		$scope.reemailClicked = true;	
	};
	
	$scope.reemailVal = function(){
		if($scope.reemailCheck != $scope.emailCheck){
			$scope.reemailreason = 2;
		}
		else{
			$scope.reemailreason = 1;
		}
	};
	
	$scope.emailVal = function(){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    if(re.test($scope.emailCheck)){
		$scope.reason = 3;
		$scope.emailError = false;
	    }
	    else{
	    	$scope.emailError = true;
	    	$scope.reason = 2;	
	    }
	};
	
	$scope.showPasswordHint = function(op){
				
		
		if(op == "show"){
			$scope.shotHint = true;
		}
		else{
			$scope.shotHint = false;	
		}
	};
	
	
	$scope.registerValidation = function(){
		
		if($scope.reason == 2){
			alert("here");
			$scope.errorfound = true;
		}
		else if($scope.regpassword == ""){
			alert("here1");
			$scope.errorfound = true;
			
		}
		
		else if(Number($scope.regpassword.length) < 6){
			alert("here2");
			$scope.errorfound = true;
		}
		else if(Number($scope.regpassword.length) > 64){
			alert("here3");
			$scope.errorfound = true;
		}
		else if($scope.regfirstname == "" || $scope.reglastname == ""){
			alert("here4");
			$scope.errorfound = true;
		}
		else if($scope.regphonenum == ""){
			alert("here5");
			$scope.errorfound = true;
		}
		else{
			var dataval =  {"email": $scope.emailCheck,"reemail":$scope.reemailCheck,"password":$scope.regpassword,"firstname":$scope.regfirstname,"lastname":$scope.reglastname,"phone":$scope.regphonenum};
			$http({
				  method: 'POST',
				  url: '/register',
				  data : dataval
				  
				  
				}).then(function successCallback(response) {
				    // this callback will be called asynchronously
				    // when the response is available
					
					if(response.data.condition == "success"){
						$scope.registeredsuccess = true;
					}
					else{
						$scope.registeredsuccess = false;
					}
					
					
				  }, function errorCallback(response) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
					  
				  });		
		
		}
	}; 
		
}]);

ebayApp.controller('sellcontroller',['$scope','userservice','$http',function($scope,userservice,$http){
	
	$scope.category = "";
	$scope.itemname = "";
	$scope.description = "";
	$scope.price = "";
	$scope.quantity = "";
	$scope.shipping = "";
	$scope.feature1 = "";
	$scope.feature2 = "";
	$scope.feature3 = "";
	$scope.feature4 = "";
	$scope.feature5 = "";
	$scope.auction = 0;
	$scope.startingbid = "";
	$scope.status = "";
	$scope.error = false;
	
	
	$scope.storeItem = function(){
		if($scope.category == ""){
		
			$scope.error = true;		
		}
		else if($scope.itemname == ""){
	
			$scope.error = true;		
		}
		else if($scope.description == ""){
		
			$scope.error = true;		
		}
		else if($scope.price == ""){
		
			$scope.error = true;		
		}
		else if($scope.quantity == ""){

			$scope.error = true;		
		}
		else if($scope.shipping == ""){
	
			$scope.error = true;		
		}
		else if($scope.feature1 == ""){
		
			$scope.error = true;		
		}
		else if($scope.feature2 == ""){
		
			$scope.error = true;		
		}
		else if($scope.feature3 == ""){
	
			$scope.error = true;		
		}
		else if($scope.auction &&  $scope.startingbid== ""){
		
			$scope.error = true;		
		}
		else if($scope.status == ""){
	
			$scope.error = true;		
		}
		
		else{
		var itemDetails = {
				"category":$scope.category,
				"itemname":$scope.itemname,
				"description":$scope.description,
				"price":$scope.price,
				"quantity":$scope.quantity,
				"shipping":$scope.shipping,
				"feature1":$scope.feature1,
				"feature2":$scope.feature2,
				"feature3":$scope.feature3,
				"feature4":$scope.feature4,
				"feature5":$scope.feature5,
				"auction":$scope.auction,
				"startingbid":$scope.startingbid,
				"status":$scope.status
		}
		
		$http({
			  method: 'POST',
			  url: '/sell',
			  data : itemDetails			  			  
			}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				
				/*if(response.data.condition == "success"){
					$scope.registeredsuccess = true;
				}
				else{
					$scope.registeredsuccess = false;
				}*/
				console.log("should reload");
				window.location.assign("/#/myCollection");
			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				  
			  });
		}
	};
	
}]);
