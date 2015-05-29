'use strict';

EnmanApp.controller('RegressionController', ['$scope', 'AuthServices', '$state', 'analyticsService',
    function($scope, AuthServices, $state, analyticsService) {
        //$state.go('admin.subview', {"subview":"general"});
        $scope.hideGrid = true;
        $scope.xvariables = [];
        $scope.yvariables = [];
        

        $scope.columns = [{
            field: 'coefficent',
            name: 'Correlation'
        },
         {
            field: 'poly',
            name: 'Formula'
        }];

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

        

        $scope.updateVarX = function($item, $model) {
            //console.log($scope.variable.selected.sm_code)
            $scope.xvariables = $scope.xmeterList.selected[0].base_variables;
        }

        $scope.updateVarY = function($item, $model) {
            //console.log($scope.variable.selected.sm_code)
            $scope.yvariables = $scope.ymeterList.selected[0].base_variables;
        }

        $scope.freqs = [{
            "label": "H",
            "value": "H"
        }, {
            "label": "D",
            "value": "D"
        },{
            "label": "W",
            "value": "w"
        },
        {
            "label": "M",
            "value": "M"
        }];

        $scope.freq = 0;

        $scope.selectfrq = function ($index) {
            $scope.freq = $scope.freqs[$index]
        }

        $scope.update = function() {
            $scope.hideGrid = true;
            document.getElementById("loader").className = "ng-show";
            document.getElementById("chart1").className = "ng-hide";
            var query = {
                "method" : "regression",
                "x_device" : $scope.xmeterList.selected[0].meter_id,
                "y_device" : $scope.ymeterList.selected[0].meter_id,
                "xbase_variable" : $scope.xvariables.selected[0].sm_code,
                "ybase_variable" : $scope.yvariables.selected[0].sm_code,
                "frequency" : $scope.freq.value,
                "fromDate" : $scope.date.startDate,
                "toDate" : $scope.date.endDate
            }

            analyticsService.analyze(query).then(function(information) {
                $scope.dataGrid.data = [{coefficent : _linear(information.chartData).equation[2], poly :  _linear(information.chartData).string }]
                $scope.chartConfig = {
        
                    xAxis: {
                            title: {
                                enabled: false,
                                text: null
                            },
                            startOnTick: true,
                            endOnTick: true,
                            showLastLabel: true
                        },
                        yAxis: {
                            title: {
                                enabled: false,
                                text: null
                            }
                        },
                    title: {
                        text: null
                    },
                    legend: {
                            layout: 'vertical',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 100,
                            y: 70,
                            floating: true,
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1
                        },
                        plotOptions: {
                            scatter: {
                                marker: {
                                    radius: 5,
                                    states: {
                                        hover: {
                                            enabled: true,
                                            lineColor: 'rgb(100,100,100)'
                                        }
                                    }
                                },
                                states: {
                                    hover: {
                                        marker: {
                                            enabled: false
                                        }
                                    }
                                },
                                tooltip: {
                                    headerFormat: '<b>{series.name}</b><br>',
                                    pointFormat: '{point.x} cm, {point.y} kg'
                                }
                            }
                        },
                    series: [{
                        type: 'line',
                        name: 'Regression Line',
                        data: _linear(information.chartData).points,
                        marker: {
                            enabled: false
                        },
                        states: {
                            hover: {
                                lineWidth: 0
                            }
                        },
                        enableMouseTracking: false
                    }, {
                        type: 'scatter',
                        name: 'Observations',
                        data: information.chartData,
                        marker: {
                            radius: 4
                        }
                    }]
                }
                $scope.hideGrid = false;
                document.getElementById("loader").className = "ng-hide";
               document.getElementById("chart1").className = "ng-show";
            });
            
        };

        /**
         * Code extracted from https://github.com/Tom-Alexander/regression-js/
         * Human readable formulas: 
         * 
         *              N * Σ(XY) - Σ(X) 
         * intercept = ---------------------
         *              N * Σ(X^2) - Σ(X)^2
         * 
         * correlation = N * Σ(XY) - Σ(X) * Σ (Y) / √ (  N * Σ(X^2) - Σ(X) ) * ( N * Σ(Y^2) - Σ(Y)^2 ) ) )
         * 
         */
        function _linear(data) {
            var sum = [0, 0, 0, 0, 0], n = 0, results = [], N = data.length;

            for (; n < data.length; n++) {
              if (data[n]['x']) {
                data[n][0] = data[n]['x'];
                data[n][1] = data[n]['y'];
              }
              if (data[n][1]) {
                sum[0] += data[n][0]; //Σ(X) 
                sum[1] += data[n][1]; //Σ(Y)
                sum[2] += data[n][0] * data[n][0]; //Σ(X^2)
                sum[3] += data[n][0] * data[n][1]; //Σ(XY)
                sum[4] += data[n][1] * data[n][1]; //Σ(Y^2)
              }
            }

            var gradient = (n * sum[3] - sum[0] * sum[1]) / (n * sum[2] - sum[0] * sum[0]);
            var intercept = (sum[1] / n) - (gradient * sum[0]) / n;
            var correlation = (n * sum[3] - sum[0] * sum[1]) / Math.sqrt((n * sum[2] - sum[0] * sum[0]) * (n * sum[4] - sum[1] * sum[1]));
           
            for (var i = 0, len = data.length; i < len; i++) {
                var coordinate = [data[i][0], data[i][0] * gradient + intercept];
                results.push(coordinate);
            }

            results.sort(function(a,b){
               if(a[0] > b[0]){ return 1}
                if(a[0] < b[0]){ return -1}
                  return 0;
            });

            var string = 'y = ' + Math.round(gradient*100) / 100 + 'x + ' + Math.round(intercept*100) / 100;
            console.log({equation: [gradient, intercept, correlation], points: results, string: string});
            return {equation: [gradient, intercept, correlation], points: results, string: string};
        }

    }
]);