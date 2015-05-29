'use strict';
EnmanApp.controller('MetersController', ['$scope', 'formData', 'meterSettings',
    function($scope, formData, meterSettings) {
        $("#loadingWidget").fadeIn();

        formData.getFormFor('METERS', 'FACILITY').then(function(data) {
            $scope.facility_id = data.facility_id;
            $scope.meterFormConfig = data.FormDetails;
            meterSettings.get($scope.facility_id).then(function(info) {
                console.log(info)
                $scope.meterGrid.data = info;
            });
        });

        $scope.columns = [{
            field: 'Name'
        }, {
            field: 'ID'
        }, {
            field: 'Gateway'
        }, {
            field: 'Description'
        }, {
            field: 'Type'
        }, {
            field: 'Status'
        }];
        $scope.meterGrid = {
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

        var gridInput = {
            'facility_id': $scope.facility_id,
        }
        

        $scope.booleanToInt = { true : 1, false: 0};
        $scope.intToBoolean = { 1 : true, 0: false};

        $scope.delete = function() {
            //only deletes if a row is selected
            if ($scope.rowSelect) {
                console.log($scope.rowDetail);
                var rowDetails = {
                    'meter_id': $scope.rowDetail['details'].ID
                }
                meterSettings.deleteMeter(rowDetails).then(function(responseData) {
                    //small bug where ui-grid index does not update after a delete
                    //$scope.gatewayGrid.data.splice($scope.rowDetail['index'], 1);
                    console.log('row deleted')
                    $scope.meterGrid.data = []
                    meterSettings.get(gridInput['facility_id']).then(function(responseData) {
                        $scope.meterGrid.data = responseData;
                    });

                    formData.getFormFor('METERS', 'FACILITY').then(function(responseData) {
                        $scope.meterFormConfig = responseData.FormDetails;
                    });
                });

            }
        };

        $scope.edit = function() {
            if ($scope.rowSelect) {
                formData.getFormFor('METERS', 'FACILITY').then(function(responseData) {
                    responseData.FormDetails[0].fields[0].value = $scope.rowDetail['details'].Name;
                    responseData.FormDetails[0].fields[1].value = $scope.rowDetail['details'].Description;
                    responseData.FormDetails[0].fields[2].value = $scope.rowDetail['details'].associatedBaseVariables;
                    responseData.FormDetails[0].fields[3].value = $scope.rowDetail['details'].rejectedBaseVariables;
                    responseData.FormDetails[0].fields[4].value = $scope.rowDetail['details'].reference;
                    responseData.FormDetails[0].fields[5].value = $scope.intToBoolean[$scope.rowDetail['details'].Status]
                    $scope.meterFormConfig = responseData.FormDetails;
                });
            }
        };

        $scope.update = function() {
            if ($scope.rowSelect) {
                if ($scope.meterForm.$invalid) {
                    $scope.$broadcast('record:invalid');
                } else {
                    var meterFormResults = {
                        //frontend bug if the user clicks on a row other than the current row being modifed, thus
                        //the meter_id for the active row gets used instead of the edited row
                        'meter_id': $scope.rowDetail['details'].ID,
                        'meter_name': meterForm[0].value,
                        'meter_description': meterForm[1].value,
                        'associatedBaseVariables': meterForm[2].value,
                        'rejectedBaseVariables': meterForm[3].value,
                        'reference_meter': $scope.booleanToInt[$scope.meterFormConfig[0].fields[4].value],
                        'status': $scope.booleanToInt[$scope.meterFormConfig[0].fields[5].value]
                    }
                    console.log(meterFormResults);
                    meterSettings.put(meterFormResults).then(function(responseData) {
                        $scope.meterGrid.data = []
                        meterSettings.get($scope.rowDetail['details'].facility_id).then(function(responseData) {

                            $scope.meterGrid.data = responseData
                        });
                    });

                }
            }
        };
    }
]);