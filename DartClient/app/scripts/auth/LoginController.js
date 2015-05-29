'use strict';

EnmanApp.controller('LoginController', ['$scope','$state', 'AuthServices','$rootScope',
    function($scope,$state,AuthServices,$rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        $scope.loading = false;
        $("#loadingWidget").fadeOut('slow');
    });

    if(AuthServices.isAuthenticated()){
         $state.go('dashboard');
    }


    $scope.user = {
        "username": "",
        "password": ""
    };

    $scope.submit = function(){
    	AuthServices.login($scope.user);
    };
    
    $scope.forgotPass = function(){
    	
    	if(! $scope.user.username){
    		$rootScope.errMessage = "Please enter user name";
    		return;
    	}
    	
    	$rootScope.errMessage = "";
    	
    	AuthServices.forgotPass($scope.user.username);
    };

}]);