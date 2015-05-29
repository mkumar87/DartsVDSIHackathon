'use strict';

EnmanApp.controller('ComparativeController', ['$scope', 'AuthServices', '$state', 'analyticsService',
    function($scope, AuthServices, $state, analyticsService) {
        
        $scope.hideGrid = true;
        $scope.variables = [];
        //TODO select-multiple needs to be select-single, can't allow more than one input

        $scope.updateVar = function($item, $model) {
            //console.log($scope.variable.selected.sm_code)
            $scope.variables = $scope.meterList.selected[0].base_variables;
        }

        $scope.$watch('isLoaded', function(newVal, oldVal) {
            if (newVal != oldVal || newVal == $scope.compare) {
                var temp = $scope.request;
                temp['method'] = 'comparative'
                $scope.meterList.selected = [$scope.meterList[0]]
                $scope.variables.selected = [$scope.meterList[0].base_variables[0]]
                analyticsService.analyze(temp).then(function(information) {
                    if (information.chartData.length == 0){
                        $scope.meterList.selected = [$scope.meterList[0]]
                        $scope.variables.selected = [$scope.meterList[0].base_variables[0]]
                    }
                    else{
                        var graphList = [];
                        $scope.updatedColumns = [{field: 'time'}];

                        console.log(information.dates);
                        for (var i = 0; i < information.dates.length; i++) {
                            $scope.updatedColumns.push({field : information.dates[i]});
                            graphList.push({
                                balloonText: "[[title]]: [[value]]",
                                lineThickness: 2,
                                title: information.dates[i],
                                valueField: information.dates[i]
                            });
                        }
                        console.log($scope.updatedColumns);
                        $scope.dataGrid.columnDefs = $scope.updatedColumns;

                        $scope.dataGrid.data = information.chartData;
                        var comparativeChart = AmCharts.makeChart("chartdiv", {
                        type: "serial",
                        theme: "none",
                        dataProvider: information.chartData,
                        valueAxes: [
                            {
                                title: information.unit
                            }
                        ],
                        graphs: graphList,
                        zoomOutButtonRollOverAlpha: 0.15,
                        chartCursor: {
                            cursorPosition: "mouse",
                            showNextAvailable: true
                        },
                        autoMarginOffset: 5,
                        columnWidth: 1,
                        categoryField: "time",

                        exportConfig: {
                            menuTop: "20px",
                            menuRight: "20px",
                            menuItems: [{
                                icon: '/lib/3/images/export.png',
                                format: 'png'
                            }]
                        }
                        });
                        document.getElementById("chartdiv").className = "ng-show";
                    document.getElementById("loader").className = "ng-hide";
                    $scope.hideGrid = false;   
                    }
                    
                

                });

            }
        });

        $scope.columns = [{
            field: 'time'
        }];

        $scope.dataGrid = {
            columnDefs: $scope.columns,
            multiSelect: false,
            paginationPageSizes: [25, 50, 75, 100],
            paginationPageSize: 25,
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'myFile.csv',
            exporterMenuPdf: false,
            //function fired twice, on row change
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    //sets rowSelect to True or False based on if a row is selected
                    $scope.rowSelect = row.isSelected;
                    console.log(row.entity)
                        //selected row details get updated, index for delete
                    $scope.rowDetail = {
                        'details': row.entity,
                        'index': row.index
                    };
                });


            }
        };

        $scope.freqs = [{
            "label": "Quarter",
            "value": "15min"
        }, {
            "label": "Hourly",
            "value": "H"
        }, 
            /**{
            "label": "Day",
            "value": "D"
        }*/];

        $scope.freq = 0;

        $scope.selectfrq = function ($index) {
            $scope.freq = $scope.freqs[$index]
        }
       	
         $scope.update = function() {
            var query = {
                'method': "comparative",
                'meter': $scope.meterList.selected[0].meter_id,
                'base_variable': $scope.variables.selected[0].sm_code,
                'frequency': $scope.freq.value,
                'fromDate' : $scope.date.startDate,
                'toDate' : $scope.date.endDate
            }
            document.getElementById("chartdiv").className = "ng-hide";
            document.getElementById("loader").className = "ng-show";
            $scope.hideGrid = true;

	        analyticsService.analyze(query).then(function(information) {
                if (information.chartData.length == 0){
                    document.getElementById("loader").className = "ng-hide";
                    alert('No data found for ' + $scope.meterList.selected[0].meter_name + ' in this time range');
                }
                else {
	        	var graphList = [];
	        	$scope.updatedColumns = [{field: 'time'}];
	        	console.log(information.dates);
				for (var i = 0; i < information.dates.length; i++) {
					$scope.updatedColumns.push({field : information.dates[i]});
				    graphList.push({
				        balloonText: "[[title]]: [[value]]",
				        lineThickness: 2,
				        title: information.dates[i],
				        valueField: information.dates[i]
				    });
				}
				console.log($scope.updatedColumns);
				$scope.dataGrid.columnDefs = $scope.updatedColumns;

				$scope.dataGrid.data = information.chartData;
	        	var comparativeChart = AmCharts.makeChart("chartdiv", {
	                type: "serial",
	                theme: "none",
	                dataProvider: information.chartData,
	                valueAxes: [
	                    {
	                        title: information.unit
	                    }
	                ],
	                graphs: graphList,
	                zoomOutButtonRollOverAlpha: 0.15,
	                chartCursor: {
	                    cursorPosition: "mouse",
	                    showNextAvailable: true
	                },
	                autoMarginOffset: 5,
	                columnWidth: 1,
	                categoryField: "time",

	                exportConfig: {
	                    menuTop: "20px",
	                    menuRight: "20px",
	                    menuItems: [{
	                        icon: '/lib/3/images/export.png',
	                        format: 'png'
	                    }]
	                }
            	});
                }
                document.getElementById("loader").className = "ng-hide";
                $scope.hideGrid = false;
                document.getElementById("chartdiv").className = "ng-show";
	        });

			
	    }
    }
]);