'use strict';
EnmanApp.controller('MetricsController', ['$scope','$filter', 'formData', 'metricsSettings',
    function($scope, $filter, formData, metricsSettings) {	    
        $("#loadingWidget").fadeIn();

        formData.getFormFor('METRICS','FACILITY').then(function(responseData) {
            $scope.settingMetrics = responseData;
            
           $scope.degreeDaysSource = $filter('filter')($scope.settingMetrics.FormDetails[2].fields, {
                "name": "degreeDaysSource"
           });
           
           $scope.$watch('degreeDaysSource[0].value', function(newVal, oldVal) {
               handleDegreeDaysSource(newVal, oldVal);
           });
           
           var fetchStationInput = {
               facilityId: $scope.settingMetrics.facility_id
           }
           
           metricsSettings.getstation(fetchStationInput).then(function(stationData) {
               $scope.stations = stationData
               $scope.degreeDaysStation[0].options=$scope.stations
               $scope.degreeDaysStation[0].display=1;
           });
           
           $scope.degreeMap={};
           for (var i=-22;i<105;i++){
        	   $scope.degreeMap[i]=i+" F";  
           }
           
           $scope.degreeDaysBaseTemp = $filter('filter')($scope.settingMetrics.FormDetails[2].fields, {
               "name": "baseTemperature"
           });
           
            $scope.degreeDaysBaseTemp[0].options=$scope.degreeMap;
    		$scope.degreeDaysBaseTemp[0].value="65";
			$scope.degreeDaysBaseTemp[0].display=1;
			$scope.degreeDaysBaseTemp[0].disable=true;
			

           
            //used for populating the ui-grid with area under a facility
            var gridInput = {
            	facilityId: $scope.settingMetrics.facility_id,
                mappingName:'metricsAreaTable',
                smCode: 'AREA'
            }
            metricsSettings.get(gridInput).then(function(responseData) {
                console.log(responseData)
                $scope.areaGrid.data = responseData
            });
            gridInput = {
                facilityId: $scope.settingMetrics.facility_id,
                mappingName:'metricsOccupancyTable',
                smCode: 'OCCUPANCY'
            }
            metricsSettings.get(gridInput).then(function(responseData) {
                console.log(responseData)
                $scope.occupancyGrid.data = responseData
           });

        });        

        $scope.areaTableColumns = [{
            field: 'Year'
        }, {
            field: 'Area'
        }, {
            field: 'Unit'
        }];

        $scope.areaGrid = {
            columnDefs: $scope.areaTableColumns,
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
                	var oldYear = "";
                	var oldArea = "";
                    if (row.isSelected) {
                    	oldYear = metricsFormArea[0].value;
                    	oldArea = metricsFormArea[1].value;
                    	$scope.areaRowIndex=row.index
                    	metricsFormArea[0].value = row.entity.Year;
                    	metricsFormArea[1].value = row.entity['Area'];
                    } else {
                    	metricsFormArea[0].value = oldYear;
                    	metricsFormArea[1].value = oldArea;
                    }

                });
            }
        };



        $scope.occupancyTableColumns = [{
            field: 'Year'
        }, {
            field: 'Number of Occupants'
        }, {
            field: 'Unit'
        }];

        $scope.occupancyGrid = {
            columnDefs: $scope.occupancyTableColumns,
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
                	var oldYear = "";
                	var oldOccupancy = "";
                    if (row.isSelected) {
                    	oldYear = metricsFormOccupancy[0].value;
                    	oldOccupancy = metricsFormOccupancy[1].value;
                    	$scope.occupancyRowIndex=row.index
                    	metricsFormOccupancy[0].value = row.entity.Year;
                    	metricsFormOccupancy[1].value = row.entity['Number of Occupants'];
                    } else {
                    	metricsFormOccupancy[0].value = oldYear;
                    	metricsFormOccupancy[1].value = oldOccupancy;
                    }
                });
            }
        };        

        $scope.save = function(form) {
            if ($scope.metricsForm+form.$invalid) {
                $scope.$broadcast('record:invalid');
            } else {
                var inputJson = {
                		Entity_object: 'METRICS',
                		facilityId:$scope.settingMetrics.facility_id,
                		smCode:'',
                		year:''
                };

            	if (form == "Area") {
            		inputJson['smCode']='AREA';
            		inputJson['value']=metricsFormArea[1].value;
            		inputJson['year']=metricsFormArea[0].value;
            		inputJson['unit']='ft2';
            	} else if (form == "Occupancy") {
            		inputJson['smCode']='OCCUPANCY';
                	inputJson['value']=metricsFormOccupancy[1].value;
                	inputJson['year']=metricsFormOccupancy[0].value;
                	inputJson['unit']='N/A';
            	} else {            		
            		inputJson['smCode']='DEGREE_DAYS';
            	 	if (metricsFormDegreeDay[0].value == "WUNDERGROUND"){
            			inputJson['value']=metricsFormDegreeDay[2].value;
            	 	} else if (metricsFormDegreeDay[0].value == "GCURV_TEMP_SENSOR") {
            			inputJson['value']=metricsFormDegreeDay[1].value;
            	 	}
            	}
            	metricsSettings.put(inputJson).then(function(responseData) {
            		if (form == "Area") {
            	        var gridInput = {
            	        	facilityId: $scope.settingMetrics.facility_id,
            	            mappingName:'metricsAreaTable',
            	            smCode: 'AREA'
            	        }
            	        metricsSettings.get(gridInput).then(function(responseData) {
            	        	console.log(responseData)
            	            $scope.areaGrid.data = responseData
            	        });

                	} else if (form == "Occupancy") {
                		var gridInput = {
                            facilityId: $scope.settingMetrics.facility_id,
                            mappingName:'metricsOccupancyTable',
                            smCode: 'OCCUPANCY'
                        }
                        metricsSettings.get(gridInput).then(function(responseData) {
                            console.log(responseData)
                            $scope.occupancyGrid.data = responseData
                        });
                	}
                    console.log(responseData.data)

                }, function(response) {
                    // TODO: handle the error somehow
                }).finally(function() {
                    // called no matter success or failure
                    $scope.loading = false;
                    $(".spinner-drop").fadeOut('slow');
                });
            }
        };
        
        function handleDegreeDaysSource(newVal, oldVal) {
        	$scope.degreeDaysStation = $filter('filter')($scope.settingMetrics.FormDetails[2].fields, {
                "name": "station"
           });           
        	
        	if (oldVal !== newVal) {
        		if (newVal == "WUNDERGROUND") {        			
        			$scope.degreeDaysBaseTemp[0].value="65";
        			$scope.degreeDaysBaseTemp[0].display=1;
        			$scope.degreeDaysBaseTemp[0].disable=true;
        			
        			$scope.degreeDaysStation[0].display=1;
        		} else {
        			$scope.degreeDaysStation[0].display=0;
        			$scope.degreeDaysBaseTemp[0].disable=false;
        		}            	
            }
        }


    }
]);