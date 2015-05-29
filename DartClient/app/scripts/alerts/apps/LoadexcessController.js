'use strict';

EnmanApp.controller('LoadexcessController', ['$scope', 'AuthServices', '$state', 'FormMetaDataServices',
    function($scope, AuthServices, $state, FormMetaDataServices) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.loading = false;
            $(".spinner-drop").fadeOut('slow');            
        });

        var category = {
            sm_category: 'ALERT_SETTINGS',
            sm_group: 'CATEGORY',
            CATEGORY_CODE: 'ALERT_EXCESS',
            Entity_object: 'ALERT'
        };

        FormMetaDataServices.getCategoryDetails(category).then(function(responseData) {
            console.log(responseData);
                $scope.reportForms = responseData;
            },
            function(response) {
                // TODO: handle the error somehow
            }).finally(function() {
            // called no matter success or failure 
            $scope.loading = false;
            $(".spinner-drop").fadeOut('slow');
        });

        
        $scope.modalMessage = {};
        $scope.meterData = [{
        	Description: "",
        	Gateway: 133,
        	ID: 267,
        	Name: "meter932b",
        	Type: "ELEC",
        	company_id: 1,
        	facility_id: 25,
        	meter_type_code: "ELEC",
        	poll_interval: 5,
        	reference: 0,
        	status: 0
        },
        {
        	Description: "",
        	Gateway: 133,
        	ID: 267,
        	Name: "main_load5",
        	Type: "ELEC",
        	company_id: 1,
        	facility_id: 25,
        	meter_type_code: "ELEC",
        	poll_interval: 5,
        	reference: 0,
        	status: 0
        },
        {
        	Description: "",
        	Gateway: 133,
        	ID: 267,
        	Name: "main_load9",
        	Type: "ELEC",
        	company_id: 1,
        	facility_id: 25,
        	meter_type_code: "ELEC",
        	poll_interval: 5,
        	reference: 0,
        	status: 0
        },
        {
        	Description: "",
        	Gateway: 133,
        	ID: 267,
        	Name: "meter23",
        	Type: "ELEC",
        	company_id: 1,
        	facility_id: 25,
        	meter_type_code: "ELEC",
        	poll_interval: 5,
        	reference: 0,
        	status: 0
        }];
        $scope.meterVar = {};
        $scope.meterVar.holder = [];

        $scope.save = function () {
        	alert("Alert saved")
        }

        $scope.AlertTypes = [{
            "active": true,
            "class": "active",
            "name": "nodata",
            "displayName": "No Data"
        },{
            "active": false,
            "class": "active",
            "name": "loadexcess",
            "displayName": "Load Excess"
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

        $scope.alertColumns = [{
            field: 'Date'
        }, {
            field: 'Gateway'
        },
        {
            field: 'Message'
        }, {
            field: 'Type'
        }];


        $scope.alertGrid = {            
            columnDefs: $scope.alertColumns,
            multiSelect: false,
            paginationPageSizes: [25, 50, 75, 100],
            paginationPageSize: 25,
            enableGridMenu: true,
            enableSelectAll: true,
           //exporterCsvFilename: 'myFile.csv',
            exporterMenuPdf:false,         

            //function fired twice, on row change
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    //sets rowSelect to True or False based on if a row is selected
                    $scope.rowSelectReport = row.isSelected;
                    console.log(row.entity)
                        //selected row details get updated, index for delete
                    $scope.rowDetailReport = {
                        'details': row.entity,
                        'index': row.index
                    };
                });
            }
        };
        //$state.go('admin.subview', {"subview":"general"});
    }
]);