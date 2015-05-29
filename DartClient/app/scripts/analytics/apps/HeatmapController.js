'use strict';

EnmanApp.controller('HeatmapController', ['$scope', 'AuthServices', '$state', 'analyticsService',
    function($scope, AuthServices, $state, analyticsService) {
        $scope.hideGrid = true;
        $scope.variables = [];
        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'heatmap',
                    marginTop: 40,
                    marginBottom: 80
                },
                 colorAxis: {
                    stops: [
                        [0, '#3060cf'],
                        [0.5, '#fffbbc'],
                        [0.9, '#c4463a'],
                        [1, '#c4463a']
                    ],
                    min: null,
                    max: null,
                    startOnTick: false,
                    endOnTick: false,
                    labels: {
                        format: '{value}'
                    }
                },
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },
                tooltip: {
                formatter: function () {
                    return this.point.name
                }
            },
            },
            title : {
                text: null
            },
            xAxis: {
                categories: null
            },

            yAxis: {
                categories: null,
                title: null
            },
            
            series: [{
                name: null,
                borderWidth: 1,
                data: null,
                turboThreshold: Number.MAX_VALUE
            }]
        }

        $scope.$watch('isLoaded', function(newVal, oldVal) {
            if (newVal != oldVal || newVal == $scope.compare) {
                var temp = $scope.request;
                temp['method'] = 'heatmap'
                analyticsService.analyze(temp).then(function(information) {
                    if (information.chartData.length == 0){
                        $scope.meterList.selected = [$scope.meterList[0]]
                        $scope.variables.selected = [$scope.meterList[0].base_variables[0]]
                    }
                    else{
                    $scope.hideGrid = false;
                    $scope.meterList.selected = [$scope.meterList[0]]
                    $scope.variables.selected = [$scope.meterList[0].base_variables[0]]
                    $scope.dataGrid.data = information.chartData;
                    $scope.chartConfig.options.colorAxis.min =  information.min;
                    $scope.chartConfig.options.colorAxis.max =  information.max;
                    $scope.chartConfig.xAxis.categories =  information.x_category;
                    $scope.chartConfig.yAxis.categories =  information.y_category;
                    $scope.chartConfig.series[0].data =  information.chartData;
                    document.getElementById("chart1").className = "ng-show";
                    }
                });
                
            }
        });



        $scope.updateVar = function($item, $model) {
            //console.log($scope.variable.selected.sm_code)
            $scope.variables = $scope.meterList.selected[0].base_variables;
        }

        $scope.columns = [{
            field: 'name',
            name: 'Timestamp'
        },{
            field: 'value',
            name: 'Value'
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
                'method': "heatmap",
                'meter': $scope.meterList.selected[0].meter_id,
                'base_variable': $scope.variables.selected[0].sm_code,
                'frequency': $scope.freq.value,
                'fromDate' : $scope.date.startDate,
                'toDate' : $scope.date.endDate
            }
            console.log(query);
            document.getElementById("loader").className = "ng-show";
            document.getElementById("chart1").className = "ng-hide";
            $scope.hideGrid = true;
            analyticsService.analyze(query).then(function(information) {
                if (information.chartData.length == 0){
                    document.getElementById("loader").className = "ng-hide";
                    alert('No data found for ' + $scope.meterList.selected[0].meter_name + ' in this time range');
                }
                else{
                    document.getElementById("loader").className = "ng-hide";
                $scope.dataGrid.data = information.chartData;
                $scope.chartConfig.options.colorAxis.min = information.min;
                $scope.chartConfig.options.colorAxis.max = information.max;
                $scope.chartConfig.xAxis.categories = information.x_category;
                $scope.chartConfig.yAxis.categories = information.y_category;
                $scope.chartConfig.series[0].data = [];
                $scope.hideGrid = false;
                $scope.chartConfig.series[0].data = information.chartData;
                document.getElementById("chart1").className = "ng-show";
                }
            });
        };

        
    }


    
]);