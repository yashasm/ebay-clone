/**
 * New node file
 */

var ebayApp = angular.module('ebayApp',['ngMaterial','ngAnimate','ngAria','ngRoute']);


ebayApp.config(function($routeProvider){
		
	$routeProvider	
	.when('/',{
		templateUrl:'angular/main.ejs'		
	})
	
	
});


ebayApp.controller('indexcontroller',['$scope','userservice',function($scope,userservice){

	
}]);


ebayApp.controller('searchcontroller',['$scope',function($scope){
	
	
}]);

ebayApp.service('userservice',['$http',function($http){
	
	this.username = "";
	var curr = this;
	
	
	$http.get('/confirm-login')
    .success(function (user) {
    	console.log("login---"+user.id);
    		
    	curr.username = user.id;
        
    });
	

	
	this.printName = function(){
		console.log("gonna check the value"+this.username);
	};
	
	

}]);


ebayApp.controller('headercontroller',['$scope','userservice','$http',function($scope,userservice,$http){
		
	
	$scope.showHeader = false;
	$scope.username = userservice.username;
	
	
	if($scope.username == "" ){
		$scope.showHeader = true;
	}
	$scope.click = function(){
		userservice.printName();
	};
	
	$scope.clickset = function(){
		userservice.setName();
	};
	
	$scope.$watch(function(){
	    return userservice.username;
	}, function (newValue) {
	    
	    $scope.username = newValue;
	
	    if($scope.username == "" ){
	    	
			$scope.showHeader = true;
		}
	    else if(typeof $scope.username === "undefined"){
	    	
			$scope.showHeader = true;
	    }	    
	    else{
	    	
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

