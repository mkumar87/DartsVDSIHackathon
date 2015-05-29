'use strict';

EnmanApp.controller('TreemapController', ['$scope', 'AuthServices', '$state', 'analyticsService',
    function($scope, AuthServices, $state, analyticsService) {

        $scope.dimensionList = [{ "name" : "Surface Area"}, {"name" : "Consumption"}];

        $scope.update = function() {
            document.getElementById("loader").className = "ng-show";
            document.getElementById("chart1").className = "ng-hide";
            var query = {
                'method': "treemap",
                'fromDate' : $scope.date.startDate,
                'toDate' : $scope.date.endDate,
                'commodity' : $scope.commodityList.selected[0].sm_code,
                'dimension' : $scope.dimensionList.selected[0].name
            }
            

            analyticsService.analyze(query).then(function(information) {
            	console.log(information);
                $scope.chartConfig = {
			        options: {
			            chart: {
			                type: 'treemap'
			            },
			            colorAxis: {
                            stops: [
                                [0, '#3060cf'],
                                [0.5, '#fffbbc'],
                                [0.9, '#c4463a'],
                                [1, '#c4463a']
                            ],
                            startOnTick: false,
                            endOnTick: false,
                            labels: {
                                format: '{value}'
                            }
                        },
                         tooltip: {
                        formatter: function () {
                            return '<b>' + this.point.facility_name + '</b> Ratio: <br><b>' +
                    this.point.colorValue + '</b> Consumption: <br><b>' + this.point.consumption + '</b>';
                        }
                    },
			        },
			        title: {
			            text: null,
			        },

			        loading: false,
			        series: [{
		            type: "treemap",
		            layoutAlgorithm: 'squarified',
		            data: information.chartData
		        }],
			    }
                document.getElementById("loader").className = "ng-hide";
                document.getElementById("chart1").className = "ng-show";
            });
        };
    }
]);