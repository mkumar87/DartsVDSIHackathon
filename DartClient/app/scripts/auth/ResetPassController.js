'use strict';

EnmanApp.controller('ResetPassController', ['$scope','$state', 'AuthServices', '$rootScope',
    function($scope,$state,AuthServices, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        $scope.loading = false;
        $("#loadingWidget").fadeOut('slow');
    });

    $scope.user = {
        "login_name": "",
        "old_password": "",
        "new_password": "",
        "new_password_confirm": ""
    };

    $scope.submit = function(){
    	
    	if($scope.user.new_password != $scope.user.new_password_confirm){
    		$rootScope.errMessage = "New Password and Confirm New Password should match";
    		
    		return;
    	}
    	
    	$rootScope.errMessage = "";
    	
    	AuthServices.resetpass($scope.user);
    };

}]);