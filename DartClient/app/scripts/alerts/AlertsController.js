'use strict';

EnmanApp.controller('AlertsController', ['$scope', '$modal','AuthServices', 'FormMetaDataServices', 'alertServices', '$q', '$state',
    function($scope, $modal, AuthServices, FormMetaDataServices, alertServices, $q, $state) {

    	$scope.$on('$viewContentLoaded', function() { 
	        $scope.loading = false;
	        $("#loadingWidget").fadeOut('slow');
    	});

        $scope.AlertTypes = [{
            "active": true,
            "class": "active",
            "name": "nodata",
            "displayName": "No Data"
        },{
            "active": false,
            "class": "active",
            "name": "threshold",
            "displayName": "Threshold"
        },
        {
            "active": false,
            "class": "active",
            "name": "cost",
            "displayName": "Cost"
        }];
        
        
        $state.go('alerts.subview', {"subview":"nodata"});

    }
]);