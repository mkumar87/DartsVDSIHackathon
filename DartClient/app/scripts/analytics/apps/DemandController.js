'use strict';

EnmanApp.controller('DemandController', ['$scope', 'AuthServices', '$state', 'analyticsService',
    function($scope, AuthServices, $state, analyticsService) {
        $scope.hideGrid = true;

        $scope.chartData =[{}];
        $scope.freqs = [{
            "label": "10min",
            "value": "10min"
        }, {
            "label": "15min",
            "value": "15min"
        },{
            "label": "30min",
            "value": "30min"
        }];

        $scope.columns = [{
            field: 'date',
            name: 'Time Stamp'
        },
        {
            field: 'contracted_demand',
            name: 'Contracted Demand'
        },
        {
            field: 'actual',
            name: 'Demand'
        }];
        AmCharts.checkEmptyData = function (chart) {
            if ( 0 == chart.dataProvider.length ) {
                // set min/max on the value axis
                chart.valueAxes[0].minimum = 0;
                chart.valueAxes[0].maximum = 100;
                
                // add dummy data point
                var dataPoint = {
                    dummyValue: 0
                };
                dataPoint[chart.categoryField] = '';
                chart.dataProvider = [dataPoint];
                
                // add label
                chart.addLabel(0, '50%', 'The chart contains no data', 'center');
                
                // set opacity of the chart div
                chart.chartDiv.style.opacity = 0.5;
                
                // redraw it
                chart.validateNow();
            }
        }
        $scope.demandData = []

        $scope.dataGrid = {
            columnDefs: $scope.columns,
            multiSelect: false,
            paginationPageSizes: [25, 50, 75, 100],
            paginationPageSize: 25,
            enableGridMenu: true,
            enableSelectAll: false,
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

        $scope.freq = 0;

        $scope.selectfrq = function ($index) {
            $scope.freq = $scope.freqs[$index]
       	}
       	
         $scope.update = function() {
            var query = {
                'method': "demand",
                'meter': $scope.demandList.selected[0].meter_id,
                'sampling_rate': $scope.freq.value,
                'fromDate' : $scope.date.startDate,
                'toDate' : $scope.date.endDate
            }
            
            document.getElementById("chartdiv1").className = "ng-hide";
            document.getElementById("loader").className = "ng-show";
            $scope.hideGrid = true;
	        analyticsService.analyze(query).then(function(information) {
                if (information.chartData.length == 0){
                    document.getElementById("loader").className = "ng-hide";
                    alert('No data found for' + $scope.demandList.selected[0].meter_name + ' in this time range');
                }
                else{
                var chart = AmCharts.makeChart("chartdiv1", {
                    type: "serial",
                    theme: "none",
                    dataProvider: information.chartData,
                    valueAxes: [
                        {
                            title: "kW"
                        }
                    ],
                    graphs: [{
                        lineColor: "#337ab7",
                        balloonText: "[[title]]: [[value]]",
                        lineThickness: 2,
                        title: "kW",
                        valueField: "actual"
                    },{
                        lineColor: "#B2B34D",
                        balloonText: "[[title]]: [[value]]",
                        lineThickness: 2,
                        title: "Contracted demand",
                        valueField: "contracted_demand"
                    }],
                    zoomOutButtonRollOverAlpha: 0.15,
                    chartCursor: {
                        categoryBalloonDateFormat: "MMM DD MM:NN",
                        cursorPosition: "mouse",
                        showNextAvailable: true
                    },
                    autoMarginOffset: 5,
                    columnWidth: 1,
                    categoryField: "date",
                    categoryAxis: {
                        minPeriod: "mm",
                        parseDates: true
                    },

                    exportConfig: {
                        menuTop: "20px",
                        menuRight: "20px",
                        menuItems: [{
                            icon: '/lib/3/images/export.png',
                            format: 'png'
                        }]
                    }
                });
                AmCharts.checkEmptyData(chart);
	        	$scope.dataGrid.data = information.chartData;
                $scope.hideGrid = false;
                document.getElementById("chartdiv1").className = "ng-show";
	        	document.getElementById("loader").className = "ng-hide";
            }
	        });

			
	    }
    }
]);