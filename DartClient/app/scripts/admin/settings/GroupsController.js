'use strict';
EnmanApp.controller('GroupsController', ['$scope', 'formData', 'groupSettings',
    function($scope, formData, groupSettings) {
        $("#loadingWidget").fadeIn();
        formData.getFormFor('GROUPS','FACILITY').then(function(responseData) {
            $scope.facility_id = responseData.facility_id;
            $scope.groupFormConfig = responseData.FormDetails;
            groupSettings.get({
            'facility_id': $scope.facility_id,
            'method': 'getSelect'
            }).then(function(meterData) {
                $scope.meterData = meterData;
                // $scope.meterData = responseData
            });



            groupSettings.get({
                'facility_id': $scope.facility_id,
                'method': 'getGrid'
            }).then(function(gridData) {
                console.log(gridData);
                $scope.groupGrid.data = gridData;
            });
        });

        $scope.meterData = [];
        $scope.meterVar = {};
        $scope.meterVar.holder = [];

        $scope.columns = [{
            field: 'Name'
        }, {
            field: 'Description'
        }, {
            field: 'TotalMeters'
        }];
        $scope.groupGrid = {
            columnDefs: $scope.columns,
            multiSelect: false,
            paginationPageSizes: [25, 50, 75, 100],
            paginationPageSize: 25,
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'myFile.csv',
            exporterMenuPdf:false,

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
        

        $scope.delete = function() {
            //only deletes if a row is selected
            if ($scope.rowSelect) {
                var rowDetails = {
                    'facility_id': $scope.rowDetail['details'].facility_id,
                    'meter_id': $scope.rowDetail['details'].ID,
                }
                groupSettings.deleteGroup(rowDetails).then(function(responseData) {
                    //small bug where ui-grid index does not update after a delete
                    //$scope.gatewayGrid.data.splice($scope.rowDetail['index'], 1);
                    console.log('row deleted')
                    $scope.groupGrid.data = []
                    groupSettings.get({
                        'facility_id': $scope.facility_id,
                        'method': 'getGrid'
                    }).then(function(responseData) {
                        $scope.groupGrid.data = responseData
                    });
                });

            }
        };

        $scope.booleanToInt = { true : 1, false: 0};
        $scope.intToBoolean = { 1 : true, 0: false};

        $scope.save = function() {
            if ($scope.groupForm.$invalid) {
                $scope.$broadcast('record:invalid');
            } else {
                var groupFormResults = {
                    'name': groupForm[0].value,
                    'type': groupForm[2].value,
                    'description': groupForm[1].value,
                    'meterValues': $scope.meterVar.holder,
                    'reference': $scope.booleanToInt[$scope.groupFormConfig[0].fields[3].value],
                    'facility_id': $scope.facility_id
                }
                groupSettings.put(groupFormResults).then(function(responseData) {
                    $scope.groupGrid.data = []
                    groupSettings.get({
                        'facility_id': $scope.facility_id,
                        'method': 'getGrid'
                    }).then(function(gridData) {
                        console.log(responseData)
                        $scope.groupGrid.data = gridData
                    });

                    //currently adding the data without checking for a 200
                    //also no group id so impossible to delete
                    //$scope.groupGrid.data.push({
                    //    "Name": groupForm[0].value,
                    //    "MAC Address": groupForm[2].value,
                    //    "IP Address": groupForm[3].value,
                    //    "Time Zone": groupForm[7].value,
                    //    //needs to actually recieve the group status after the call
                    //    "Status": parseInt(groupForm[8].value)
                    //})
                });
                //$state.transitionTo('admin.meters');
            }
        };

        $scope.cancel = function() {
            formData.getFormFor('GROUPS', 'FACILITY').then(function(responseData) {
                $scope.groupFormConfig = responseData.FormDetails;
            });
        };

        $scope.edit = function() {
            if ($scope.rowSelect) {
                formData.getFormFor('GROUPS', 'FACILITY').then(function(responseData) {
                    responseData.FormDetails[0].fields[0].value = $scope.rowDetail['details'].Name;
                    responseData.FormDetails[0].fields[1].value = $scope.rowDetail['details'].Description;
                    responseData.FormDetails[0].fields[2].value = $scope.rowDetail['details'].Type;
                    responseData.FormDetails[0].fields[3].value = $scope.intToBoolean[$scope.rowDetail['details'].reference]
                    $scope.groupFormConfig = responseData.FormDetails;

                });
                groupSettings.get({
                    'facility_id': $scope.facility_id,
                    'method': 'getGrid'
                }).then(function(gridData) {
                    console.log(gridData);
                    $scope.groupGrid.data = gridData;
                });
            }
        };

        $scope.update = function() {
            if ($scope.rowSelect) {
                if ($scope.groupForm.$invalid) {
                    $scope.$broadcast('record:invalid');
                } else {
                    var groupFormResults = {
                        'meter_name': groupForm[0].value,
                        //frontend bug if the user clicks on a row other than the current row being modifed, thus
                        //the meter_id for the active row gets used instead of the edited row
                        'meter_id': $scope.rowDetail['details'].ID,
                        'facility_id': $scope.rowDetail['details'].facility_id,
                        'meter_description': groupForm[1].value,
                        'meter_type_code': groupForm[2].value,
                        'reference_meter': $scope.booleanToInt[$scope.groupFormConfig[0].fields[3].value],
                        'associatedMeters': $scope.meterVar.holder
                    }
                    groupSettings.put(groupFormResults).then(function(responseData) {
                        $scope.groupGrid.data = []
                        groupSettings.get({
                            'facility_id': $scope.facility_id,
                            'method': 'getGrid'
                        }).then(function(responseData) {

                            $scope.groupGrid.data = responseData
                        });
                    });

                }
            }
        };

    }
]);