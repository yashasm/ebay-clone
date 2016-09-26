/**
 * New node file
 */

var ebayApp = angular.module('ebayApp',['ngMaterial','ngAnimate','ngAria']);


ebayApp.controller('signincontroller',['$scope',function($scope){
	
}]);


ebayApp.controller('registercontroller',['$scope',function($scope){
	
	$scope.emailClicked = false;
	$scope.reemailClicked = false;
	$scope.characters = 5;
	$scope.reemailreason = 1;
	$scope.shotHint = false; 
	
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
		
}]);

