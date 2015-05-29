'use strict';
EnmanApp.controller('AnalyticsController', ['$scope', 'AuthServices', '$state', 'analyticsService',
    function($scope, AuthServices, $state,  analyticsService) {

        //All tabs
        $scope.meterList = [];
        $scope.commodityList = [];
        $scope.ymeterList = [];
        $scope.xmeterList = [];
        $scope.demandList = [];
        $scope.isLoaded = false;
        $scope.compare = true;

        analyticsService.get().then(function(responseData) {
            //deep cloning
            var xlist = JSON.parse(JSON.stringify(responseData));
            var ylist = JSON.parse(JSON.stringify(responseData));
            $scope.ymeterList = xlist.meterList;
            $scope.xmeterList = ylist.meterList;
            
            $scope.meterList = responseData.meterList;
            $scope.demandList = responseData.demandList;
            $scope.commodityList = responseData.commodityList;
            
            //console.log('<');
            $scope.request = {
                'meter': $scope.meterList[0].meter_id,
                'base_variable': $scope.meterList[0].base_variables[0].sm_code,
                'frequency': "H",
                'sampling_rate' : "15min",
                'fromDate' : (moment().subtract('days', 3)).format('YYYY-M-DD') + "T",
                'toDate' : (moment()).format('YYYY-M-DD') + "T"
            }
            $scope.isLoaded = true;
            $scope.loading = false;
            $("#loadingWidget").fadeOut('slow');
        });
        
        $state.go('analytics.subview', {"subview":"heatmap"});
        // Links
        $scope.AnalyticsTypes = [{
            "active": true,
            "class": "active",
            "name": "heatmap",
            "displayName": "Heatmap"
        },{
            "active": false,
            "class": "active",
            "name": "treemap",
            "displayName": "Treemap"
        },{
            "active": false,
            "class": "active",
            "name": "regression",
            "displayName": "Linear Regression"
        },
        {
            "active": false,
            "class": "active",
            "name": "demand",
            "displayName": "Demand"
        },
        /**{
            "active": false,
            "class": "active",
            "name": "sankey",
            "displayName": "Sankey"
        },*/
        {
            "active": false,
            "class": "active",
            "name": "basic",
            "displayName": "Basic Stats"
        },
        {
            "active": false,
            "class": "active",
            "name": "comparative",
            "displayName": "Comparative"
        },];

    }
]);