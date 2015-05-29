'use strict';
EnmanApp.controller('GatewayController', ['$scope', 'formData', 'gatewaySettings',
    function($scope, formData, gatewaySettings) {
        $("#loadingWidget").fadeIn();
        formData.getFormFor('GATEWAY', 'FACILITY').then(function(responseData) {
            $scope.settingGateway = responseData;
            gatewaySettings.get($scope.settingGateway.facility_id).then(function(info) {
                $scope.gatewayGrid.data = info;
            });
            //gatewayForm[8] = false;
        });
        $scope.columns = [{
            field: 'Name'
        }, {
            field: 'MAC Address'
        }, {
            field: 'IP Address'
        }, {
            field: 'Time Zone'
        }, {
            field: 'Status'
        }];
        $scope.gatewayGrid = {
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
                        //selected row details get updated, index for delete
                    $scope.rowDetail = {
                        'details': row.entity,
                        'index': row.index
                    };
                });
            }
        };


        $scope.newGateway = {
            "title": "New GateWay",
            "icon": "fa fa-globe"
        };

        $scope.gateways = {};

        $scope.gatewayFields = {
            "gateway": {
                "weight": 1,
                "label": "gate Name",
                "name": "gateWay",
                "value": "",
                "type": "text",
                "placeholder": "Gateway",
                "required": true
            }
        };

        $scope.booleanToInt = { true : 1, false: 0};
        $scope.intToBoolean = { 1 : true, 0: false};



        $scope.save = function() {
            if ($scope.gatewayForm.$invalid) {
                $scope.$broadcast('record:invalid');
            } else {
                var gatewayFormResults = {
                    'facility_id': $scope.settingGateway.facility_id,
                    'name': gatewayForm[0].value,
                    'serial': gatewayForm[1].value,
                    //mac address validation
                    'mac_address': gatewayForm[2].value,
                    'ip_address': gatewayForm[3].value,
                    //integer validation required here
                    'port_no': gatewayForm[4].value,
                    'user_name': gatewayForm[5].value,
                    'password': gatewayForm[6].value,
                    'time_zone': gatewayForm[7].value,
                    'gateway_type_code': 'ECHELON',
                    //will come from a dropdown
                    'active': $scope.booleanToInt[$scope.settingGateway.FormDetails[0].fields[8].value]
                }
                gatewaySettings.put(gatewayFormResults).then(function(responseData) {
                    alert(responseData)

                    $scope.gatewayGrid.data = []
                    gatewaySettings.get($scope.settingGateway.facility_id).then(function(gridData) {
                        console.log(responseData)
                        $scope.gatewayGrid.data = gridData
                    });

                    //currently adding the data without checking for a 200
                    //also no gateway id so impossible to delete
                    //$scope.gatewayGrid.data.push({
                    //    "Name": gatewayForm[0].value,
                    //    "MAC Address": gatewayForm[2].value,
                    //    "IP Address": gatewayForm[3].value,
                    //    "Time Zone": gatewayForm[7].value,
                    //    //needs to actually recieve the gateway status after the call
                    //    "Status": parseInt(gatewayForm[8].value)
                    //})
                });
                //$state.transitionTo('admin.meters');
            }
        };

        $scope.update = function() {
            if ($scope.rowSelect) {
                if ($scope.gatewayForm.$invalid) {
                    $scope.$broadcast('record:invalid');
                } else {

                    var gatewayFormResults = {
                        'gateway_id': $scope.rowDetail['details'].gateway_id,
                        'facility_id': $scope.rowDetail['details'].facility_id,
                        'name': gatewayForm[0].value,
                        'serial': gatewayForm[1].value,
                        //mac address validation
                        'mac_address': gatewayForm[2].value,
                        'ip_address': gatewayForm[3].value,
                        //integer validation required here
                        'port_no': gatewayForm[4].value,
                        'user_name': gatewayForm[5].value,
                        'password': gatewayForm[6].value,
                        'time_zone': gatewayForm[7].value,
                        'gateway_type_code': 'ECHELON',
                        //will come from a dropdown
                        'active': $scope.booleanToInt[$scope.settingGateway.FormDetails[0].fields[8].value]
                    }
                    gatewaySettings.put(gatewayFormResults).then(function(responseData) {
                        alert(responseData)
                        $scope.gatewayGrid.data = []
                        gatewaySettings.get($scope.rowDetail['details'].facility_id).then(function(responseData) {

                            $scope.gatewayGrid.data = responseData
                        });
                    });

                }
            }
        };

        $scope.delete = function() {
            //only deletes if a row is selected
            if ($scope.rowSelect) {
                console.log($scope.rowDetail)
                var rowDetails = {
                    'facility_id': $scope.rowDetail['details'].facility_id,
                    'gateway_id': $scope.rowDetail['details'].gateway_id,
                }
                gatewaySettings.deleteGateway(rowDetails).then(function(responseData) {
                    //small bug where ui-grid index does not update after a delete
                    //$scope.gatewayGrid.data.splice($scope.rowDetail['index'], 1);
                    console.log('row deleted')
                    $scope.gatewayGrid.data = []
                    gatewaySettings.get($scope.settingGateway.facility_id).then(function(responseData) {
                        $scope.gatewayGrid.data = responseData
                    });
                });

            }
        };

        $scope.cancel = function() {
            formData.getFormFor('GATEWAY', 'FACILITY').then(function(responseData) {
                $scope.settingGateway = responseData.FormDetails;
            });
        };

        $scope.test = function() {
            //directly pass ip val
            var checkForm = {
                'ip_address': gatewayForm[3].value
            }
            gatewaySettings.check(checkForm).then(function(responseData) {
                alert(responseData)
            });
        };

        $scope.edit = function() {
            if ($scope.rowSelect) {
                formData.getFormFor('GATEWAY', 'FACILITY').then(function(responseData) {
                    //not dynamic
                    responseData.FormDetails[0].fields[0].value = $scope.rowDetail['details'].Name
                    responseData.FormDetails[0].fields[1].value = $scope.rowDetail['details'].serial
                    responseData.FormDetails[0].fields[2].value = $scope.rowDetail['details']['MAC Address']
                    responseData.FormDetails[0].fields[3].value = $scope.rowDetail['details']['IP Address']
                    responseData.FormDetails[0].fields[4].value = $scope.rowDetail['details'].port_no
                    responseData.FormDetails[0].fields[5].value = $scope.rowDetail['details'].user_name
                    responseData.FormDetails[0].fields[6].value = $scope.rowDetail['details'].password
                    responseData.FormDetails[0].fields[7].value = $scope.rowDetail['details']['Time Zone']
                    responseData.FormDetails[0].fields[8].value = $scope.intToBoolean[$scope.rowDetail['details'].Status]
                    $scope.settingGateway = responseData;
                });
            }
        };

    }
]);