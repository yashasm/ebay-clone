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
	.when('/cart',{templateUrl:'angular/cart.ejs'})
	.when('/confirmation',{templateUrl:'angular/confirmation.ejs'})
	
});



ebayApp.controller('confirmationcontroller',['$scope','userservice','$http',function($scope,userservice,$http){

	$scope.$on('$routeChangeSuccess', function () {
		  console.log("executed now");
		  $scope.totalprice = 0;
		  $http({
				method : "GET",
				url : '/confirmcart-details',		
			}).success(function(details) {
				console.log("cart get success");
		    	$scope.loop = details.cartdetails;
		    	
		    	for(val in $scope.loop){
		    		console.log("inside loop"+$scope.loop[val].itemprice);
		    		$scope.totalprice = $scope.totalprice + (Number($scope.loop[val].itemprice) *  Number($scope.loop[val].quantity));    		    		
		    	}
		    	console.log("total"+$scope.totalprice);
		    	$scope.totalprice = $scope.totalprice.toFixed(2);
		    	console.log("total"+$scope.totalprice);
		    	
		    	$scope.cardnumber = details.condition[0].cardnumber;
		    	$scope.expiration = details.condition[0].expiry;
		    	$scope.firstname = details.condition[0].firstname;
		    	$scope.lastname = details.condition[0].lastname;
		    	$scope.address = details.condition[0].address;
		    	$scope.phone = details.condition[0].phone;
		    	$scope.itemcount = userservice.cartcount;
		    	
		    	userservice.cartcount = 0;
			});
		  
		});
}]);


ebayApp.controller('mycollection',['$scope','userservice','$http',function($scope,userservice,$http){

	$scope.$on('$routeChangeSuccess', function () {
		  console.log("executed now");
		  
		  $scope.values = [];
			$http({
				method : "GET",
				url : '/search-mycollection'
				
			}).success(function(details) {		
		    	$scope.values = details.condition;
			});
			
			
			$scope.history = [];
			$http({
				method : "GET",
				url : '/search-getmypurchasehistory'
				
			}).success(function(details) {
				
		    	$scope.history = details.condition;
			});
			
			$scope.bids = [];
			$http({
				method : "GET",
				url : '/search-bidinghistory'
				
			}).success(function(details) {
				
		    	$scope.bids = details.condition;
			});
		});
		$scope.showshipping = true;
	
	$scope.collectionClicked = function(){		
		$scope.showhist = false;
		$scope.showshipping = true;
		$scope.showbid = false;
	};
	$scope.historyClicked = function(){		
		$scope.showhist = true;
		$scope.showshipping = false;
		$scope.showbid = false;
	};
	
	$scope.bidsClicked = function(){		
		$scope.showhist = false;
		$scope.showshipping = false;
		$scope.showbid = true;
	};
	
	
	$scope.$watch(function(){
	    return userservice.collection;
	}, function (newValue) {	
		if(newValue == "collection"){			
			$scope.showhist = false;
			$scope.showshipping = true;
			$scope.showbid = false;
		}
		else if(newValue == "bid"){
			$scope.showhist = false;
			$scope.showshipping = false;
			$scope.showbid = true;
		}
		else{
			$scope.showhist = true;
			$scope.showshipping = false;
			$scope.showbid = false;
		}
		
	});
	
	if(userservice.collection == "collection"){
		$scope.showshipping = false;
	}
	else{
		$scope.showshipping = true;
	}
	
}]);

ebayApp.controller('cartcontroller',['$scope','userservice','$http','$mdDialog',function($scope,userservice,$http,$mdDialog){
	
	$scope.totalprice = 0;
	$scope.cardnumber = "";
	$scope.expiration = "";
	$scope.cvv = "";
	$scope.showError = false;
	$scope.allowPayment = false;
	$scope.validateClicked = false;
	
	
	$scope.validateCard = function(){
		console.log("validating card");
		$scope.validateClicked = true;
		var cardValidate = {
				"cardnumber": $scope.cardnumber,
				"expiration":$scope.expiration,
				"cvv" : $scope.cvv					
		}
		
		$http({
			  method: 'POST',
			  url: '/cartcardconfirm',
			  data: cardValidate
			  			  			  
			}).then(function successCallback(response) {
					        
					        $scope.showError = false;
					        if(response.data.condition != "success"){
					        	$scope.showError = true;
					        	$scope.allowPayment = false; 
					        }
					        else{
					        	console.log("failure card")
					        	$scope.allowPayment = true;
					        }
					        				
			  }, function errorCallback(response) {
				  
			  });
		
	};
	
	
	$scope.pay = function(req,res){
		
		if($scope.allowPayment){
		
		var cartData = {
				"cardnumber": $scope.cardnumber,
				"firstname": $scope.firstname,
				"lastname": $scope.lastname,
				"address":$scope.address,
				"totalprice":$scope.totalprice
		};
	
		$http({
			  method: 'POST',
			  url: '/pay',
			  data: cartData
			  			  			  
			}).then(function successCallback(response) {
					        console.log("successfully removed");
					        window.location.assign("/#/confirmation");        
				
			  }, function errorCallback(response) {
				  
				  
			  });
	
	}
	else{
		
		$mdDialog.show(
			      $mdDialog.alert()
			        .parent(angular.element(document.querySelector('#popupContainer')))
			        .clickOutsideToClose(true)
			        .title('Please confirm the card before payment')
			        .textContent('Invalid Card details.')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Got it!')
			        );
		
	}
		
	}
	
	$scope.deleteItem = function(val){
		
		var cartData = {"itemid":val};
		$http({
			  method: 'POST',
			  url: '/deleteitem',
			  data : cartData			  			  
			}).then(function successCallback(response) {
					        console.log("successfully removed");
					        
				
			    $scope.loop= [];	        
				$scope.loop = response.data;
				userservice.cartcount = response.data.length;
		    	$scope.itemcount = userservice.cartcount;
				var numb = 0;
				for(val in $scope.loop){
		    	
		    		numb = numb + Number($scope.loop[val].itemprice) * $scope.loop[val].quantity;    		    		
		    	}
				
				$scope.totalprice = numb.toFixed(2);
		        
				
			  }, function errorCallback(response) {
				  
				  
			  });

		
	};
	
	$http({
		method : "GET",
		url : '/getcart-details',		
	}).success(function(details) {
		
		
    	$scope.loop = details.cartdetails;
    	
    	for(val in $scope.loop){
    		console.log("inside loop"+$scope.loop[val].itemprice);
    		$scope.totalprice = $scope.totalprice + (Number($scope.loop[val].itemprice) *  Number($scope.loop[val].quantity));    		    		
    	}
    	console.log("total"+$scope.totalprice);
    	$scope.totalprice = $scope.totalprice.toFixed(2);
    	console.log("total"+$scope.totalprice);
    	
    	$scope.cardnumber = details.condition[0].cardnumber;
    	$scope.expiration = details.condition[0].expiry;
    	$scope.firstname = details.condition[0].firstname;
    	$scope.lastname = details.condition[0].lastname;
    	$scope.address = details.condition[0].address;
    	$scope.phone = details.condition[0].phone;
    	$scope.itemcount = userservice.cartcount;
    	
    	
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
			//console.log("account---"+details.condition[0].itemid);
	    	$scope.values = details.condition;
		});		
		
	});		
}]);


ebayApp.controller('itemdetailscontroller',['$scope','userservice','$http','$mdDialog',function($scope,userservice,$http,$mdDialog){
	$scope.id = userservice.id;
	console.log("service id is"+userservice.id);
	$scope.cartlink = "";
	$scope.addlink = "";
	$scope.bidlink  = '';
	$scope.quantityselected = 1;
	$scope.addToCartSuccess = false;
	$scope.showmessage = false;
	$scope.bidAmountLess = false;
	//cart changes starts
	
	$scope.username = userservice.username;
	
	$scope.sellerClicked = function(){
		userservice.searchquery = $scope.itemowner;
	}
	
	if($scope.username == ""){		
		
		$scope.cartlink = 'http://localhost:3000/signin';
		$scope.addlink  = 'http://localhost:3000/signin';
		$scope.bidlink  = 'http://localhost:3000/signin';
	}
	else{
		
		$scope.cartlink = '#/cart';
		$scope.addlink = '';
		$scope.bidlink  = '';
	}
	
	$scope.validateQuantity = function(){
		//alert('loude bev');
		if($scope.quantityselected > $scope.itemavailable || isNaN($scope.quantityselected)){
			//alert('not loude');
			$scope.quantityselected = 1;
			$scope.showmessage = true;
		}
	else{
			//alert('loude');
			$scope.showmessage = false;
		}
		
		
		
	};
	
	$scope.addToCart = function(id,action){
		if($scope.username != "" && typeof $scope.username !== "undefined"){
			console.log("gonna add to cart"+id);
			var cartData = {"itemid":$scope.id,
					"quantity":$scope.quantityselected,
					"itemname":$scope.itemname,
					"itemprice":$scope.itemprice,
					"seller":$scope.itemowner,
					"itemavailable":$scope.itemavailable,
					"itemsold":$scope.itemsold
			}
			$http({
				  method: 'POST',
				  url: '/addtocart',
				  data : cartData			  			  
				}).then(function successCallback(response) {
					addToCartSuccess = true;
					console.log("added successfully");
					userservice.cartcount = response.data.cartcount; 
					
					if(action == 'cart'){
					var confirm = $mdDialog.confirm()
	                  .title('Successfully added to the cart!')
	                  .textContent("Why don't you check other items.")
	                  .ariaLabel('Cart!')
	                  
	                  .ok('Ok');
	                  
	                  $mdDialog.show(confirm).then(function() {
	                     console.log("Do u think it ll work");
	     				window.location.assign("/");
	                     }, function() {
	                    	 console.log("it worked");
	                  });        
						        
					}
					
				  }, function errorCallback(response) {
					  addToCartSuccess = false;
					  
				  });

		}
	}
	
	$scope.$watch(function(){
	    return userservice.username;
	}, function (newValue) {	    
	    $scope.username = newValue;
	
	    if($scope.username == "" ){
	    				
			$scope.cartlink = 'http://localhost:3000/signin';
			$scope.addlink  = 'http://localhost:3000/signin';
			$scope.bidlink  = 'http://localhost:3000/signin';
		}
	    else if(typeof $scope.username === "undefined"){
	    	
			
			$scope.cartlink = 'http://localhost:3000/signin';
			$scope.addlink  = 'http://localhost:3000/signin';
			$scope.bidlink  = 'http://localhost:3000/signin';
	    }	    
	    else{
	    	
	    	$scope.cartlink = '#/cart';
	    	$scope.addlink = '';
	    	$scope.bidlink  = '';
	    }
	});
	
	
	//cart changes ends
	
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
	    	$scope.item = $scope.values[0].itemid;
	    	$scope.itemname = $scope.values[0].itemname;
	    	$scope.itemdesc = $scope.values[0].itemdesc;
	    	$scope.itemprice = $scope.values[0].itemprice;
	    	$scope.itemavailable = $scope.values[0].itemavailable;
	    	$scope.itemsold = $scope.values[0].itemsold;
	    	$scope.itemowner = $scope.values[0].itemowner;
	    	$scope.itemshippingfrom = $scope.values[0].itemshippingfrom;
	    	$scope.itemcondition = $scope.values[0].itemcondition;
	    	$scope.itemupdated = $scope.values[0].itemupdated;
	    	$scope.itemfeature1 = $scope.values[0].itemfeature1;
	    	$scope.itemfeature2 = $scope.values[0].itemfeature2;
	    	$scope.itemfeature3 = $scope.values[0].itemfeature3;
	    	$scope.itemfeature4 = $scope.values[0].itemfeature4;
	    	$scope.itemfeature5 = $scope.values[0].itemfeature5;
	    	$scope.itemauction = $scope.values[0].itemauction;
	    	$scope.itemstartingbid = $scope.values[0].itemstartingbid;
	    	$scope.category = $scope.values[0].category;
	    	$scope.numberbids = $scope.values[0].numberbids;
	    	$scope.currentbid = $scope.values[0].currentbid;
	    	$scope.predictedbid = Number($scope.currentbid) + 1;
	    	$scope.bidenddate = $scope.values[0].bidenddate;
	    	
	    	$scope.average = ($scope.itemsold / ($scope.itemsold + $scope.itemavailable)) * 100; 
	    	
		});
		
		
	});
	$scope.showshipping = false;
	
	$scope.shippingClicked = function(){
		$scope.showshipping = true;
	};
	$scope.detailClicked = function(){
		$scope.showshipping = false;
	};
	
	$scope.bidItem = function(){
		if($scope.username != "" && typeof $scope.username !== "undefined"){
		if($scope.bidplaced < $scope.predictedbid){
			$scope.bidAmountLess = true;
		}
		else{
			$scope.bidAmountLess = false;
		var bidData = {"itemid":$scope.id,
				"numberbids":$scope.numberbids,
				"itemname":$scope.itemname,
				"bidamount":$scope.bidplaced,
				"seller":$scope.itemowner				
		}
		
		$http({
			  method: 'POST',
			  url: '/bid',
			  data : bidData			  			  
			}).then(function successCallback(response) {
				//addToCartSuccess = true;
				console.log("added successfully");
				$scope.currentbid = response.data.bidamount;
				$scope.numberbids = response.data.numberbids;
				$scope.predictedbid = Number($scope.currentbid) + 1; 
				$mdDialog.show(
					      $mdDialog.alert()
					        .parent(angular.element(document.querySelector('#popupContainer')))
					        .clickOutsideToClose(true)
					        .title('Successfully placed the bid!')
					        .textContent('Why dont you check other items.')
					        .ariaLabel('Alert Dialog Demo')
					        .ok('Cool!')
					        );
				
			}, function errorCallback(response) {
				  addToCartSuccess = false;
				  
			  });
		
	}
	}
	}
	
}]);


ebayApp.controller('searchcontroller',['$scope','userservice',function($scope,userservice){
	
	$scope.searchquery = userservice.searchquery;
	
	 
	
	$scope.searchClicked = function(){
		console.log("search clicked");
		userservice.searchquery = $scope.searchitem;
	};
	
	
	$scope.myFunct = function(keyEvent) {
		  if (keyEvent.which === 13){
			  userservice.searchquery = $scope.searchitem;
				window.location.assign("#/basicsearch");
			  
		  }
		}
	
	
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
	this.lastloggedin = "";
	this.id = "";
	this.collection="";
	var curr = this;	
	this.searchquery = "default";
	this.cartcount = 0;
	
	
	$http.get('/confirm-login')
    .success(function (user) {
    	console.log("login---"+user.id);
    	curr.cartcount = user.cartcount; 
    	curr.username = user.id;
        curr.id = user.tempid;
        curr.lastloggedin = user.lastloggedin;
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
				
				console.log("inside success");
				if(response.condition == "fail"){
					$scope.successreg = false;
				}
				else{
				$scope.successreg = true;
				}
				
			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				  console.log("inside failure");
			  });
		
	};
	
}]);

ebayApp.controller('headercontroller',['$scope','userservice','$http',function($scope,userservice,$http){
	
	console.log("I am in headercontroller");
	
	$scope.showHeader = false;
	$scope.username = userservice.username;
	$scope.cartcount = userservice.cartcount;
	$scope.lastloggedin = userservice.lastloggedin;	
	
	
	if($scope.username == ""){		
		$scope.historylink = 'http://localhost:3000/signin';
		$scope.bidslink = 'http://localhost:3000/signin';
		$scope.selllink = 'http://localhost:3000/signin';
		$scope.cartlink = 'http://localhost:3000/signin';
		$scope.showHeader = true;
	}
	else{
		$scope.historylink = '#/myCollection';
		$scope.bidslink = '#/myCollection';
		$scope.selllink = '#/sell';
		$scope.cartlink = '#/cart';
	}
	
	$scope.$watch(function(){
	    return userservice.cartcount;
	}, function (newValue) {
		
		$scope.cartcount = newValue;
	});
	

	$scope.$watch(function(){
	    return userservice.lastloggedin;
	}, function (newValue) {
		
		$scope.lastloggedin = newValue;
	});
	
	$scope.$watch(function(){
	    return userservice.username;
	}, function (newValue) {
	    
	    $scope.username = newValue;
	
	    if($scope.username == "" ){
	    	$scope.historylink = 'http://localhost:3000/signin';
	    	$scope.bidslink = 'http://localhost:3000/signin';
			$scope.showHeader = true;
			$scope.selllink = 'http://localhost:3000/signin';
			$scope.cartlink = 'http://localhost:3000/signin';
		}
	    else if(typeof $scope.username === "undefined"){
	    	
			$scope.showHeader = true;
			$scope.historylink = 'http://localhost:3000/signin';
			$scope.bidslink = 'http://localhost:3000/signin';
			$scope.selllink = 'http://localhost:3000/signin';
			$scope.cartlink = 'http://localhost:3000/signin';
	    }	    
	    else{
	    	$scope.selllink = '#/sell';	
	    	$scope.showHeader = false;
	    	$scope.cartlink = '#/cart';
	    	$scope.historylink = '#/myCollection';
	    	$scope.bidslink = '#/myCollection';
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
	
	$scope.collectionClicked = function(req,res){
		userservice.collection = "collection";
	};
	
	$scope.purchaseClicked = function(req,res){
		userservice.collection = "purchase";
	};
	
	$scope.bidsClicked = function(req,res){
		userservice.collection = "bid";
	};
}]);


ebayApp.controller('signincontroller',['$scope','$http','userservice',function($scope,$http,userservice){
	console.log("I am in signincontroller");
	$scope.emailsign = "";
	$scope.passwordsign = "";
	$scope.userservice = userservice;
	$scope.errorfound = false;
	$scope.username = "";
	
	$scope.$watch('username',function(newVal){
		console.log("hiiiii"+newVal);
		userservice.username =$scope.username; 
	},true);
	
	$scope.myFunct = function(keyEvent) {
		  if (keyEvent.which === 13){
			  
			  $scope.signinclicked();
			  
		  }
		}
	
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
			console.log("signed in");
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				//write failure code
				$scope.errorfound = true;
			}
			else {
				//Making a get call to the '/redirectToHomepage' API
				$scope.errorfound = false;								
				$scope.username = data.id;
				$scope.lastloggedin = data.time;
				console.log("last logged in:"+data.time);
				if( typeof $scope.lastloggedin === "undefined"){
					window.location.assign("/#/account");
				}
				else if($scope.lastloggedin == ""){
					window.location.assign("/#/account");
				}
				else{
				window.location.assign("/");
				}
			}
			
		}).error(function(error) {
			//write failure code
			$scope.errorfound = true;
		});
	} 
	
}]);


ebayApp.controller('registercontroller',['$scope','$http',function($scope,$http){
	
	console.log("I am in registercontroller");
	
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
	
	$scope.myFunct = function(keyEvent) {
		  if (keyEvent.which === 13){
			  
			  $scope.registerValidation();
			  
		  }
		}
	
	
	$scope.registerValidation = function(){
		
		if($scope.reason == 2){
			
			$scope.errorfound = true;
		}
		else if($scope.regpassword == ""){
			
			$scope.errorfound = true;
			
		}
		
		else if(Number($scope.regpassword.length) < 6){
			
			$scope.errorfound = true;
		}
		else if(Number($scope.regpassword.length) > 64){
			
			$scope.errorfound = true;
		}
		else if($scope.regfirstname == "" || $scope.reglastname == ""){			
			$scope.errorfound = true;
		}
		else if($scope.regphonenum == ""){			
			$scope.errorfound = true;
		}
		else if($scope.regphonenum.length < 10 || $scope.regphonenum.length > 10){			
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
						$scope.errorfound = false;
					}
					else{
						//alert('fail');
						$scope.errorfound = true;
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

	console.log("I am in sellcontroller");
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
	
	$scope.callPurchase = function(){
		userservice.collection = "purchase";
	}
	
	$scope.callBid = function(){
		userservice.collection = "bid";
	}
	
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
				"startingbid":$scope.price,
				"status":$scope.status
		}
		
		$http({
			  method: 'POST',
			  url: '/sell',
			  data : itemDetails			  			  
			}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				userservice.collection = "collection";				
				console.log("should reload");
				window.location.assign("/#/myCollection");
			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
				  
			  });
		}
	};
	
}]);
