'use strict';

EnmanApp.controller('NodataController', ['$scope', 'AuthServices', '$state', 'FormMetaDataServices', 'alertServices',
    function($scope, AuthServices, $state, FormMetaDataServices, alertServices) {
	
	$("#loadingWidget").fadeIn('slow');
	
        var category = {
            sm_category: 'ALERT_SETTINGS',
            sm_group: 'CATEGORY',
            CATEGORY_CODE: 'ALERT_NO_DATA',
            Entity_object: 'ALERT'
        };
        
        $scope.loadFormData = function() {
        	$scope.loading = true;
        	FormMetaDataServices.getCategoryDetails(category).then(function(responseData) {
                    $scope.reportForms = responseData;
                    
                    $scope.$watch(function(){
                    	
                    	var alertBasedValue = "";
                    	angular.forEach($scope.reportForms.FormDetails, function(subcatDetails, key) {
                    		if(subcatDetails.type == "SEQUENTIAL"){
                    			angular.forEach(subcatDetails.fields, function(fieldDetails, key) {
                    				if(fieldDetails.name == "AlertBased"){
                    					
                    					alertBasedValue = fieldDetails.value;
                    					
                    				}
                            	});
                    		}
                    	});
                    	
                    	return alertBasedValue;
                    },
                    function(newVal, oldVal) {
                    if (typeof newVal !== undefined && newVal != "") {
                    	
                    	angular.forEach($scope.reportForms.FormDetails, function(subcatDetails, key) {
                    		if(subcatDetails.type == "SEQUENTIAL"){
                    			angular.forEach(subcatDetails.fields, function(fieldDetails, key) {
                    				
                    				if(fieldDetails.name == "AlertReference"){
                    					var tempOption = {};
                    					
                    					if (typeof $scope.dropdownMeta !== undefined) {
                    						angular.forEach($scope.dropdownMeta[newVal], function(metadata, key) {
                        						tempOption[metadata.id] = metadata.label;
                        					});
                        					
                        					fieldDetails.options = tempOption;
                    					}
                    				}
                            	});
                    		}
                    	});
                      
                    }
                   });
                    window.setTimeout(function(){
                        $(window).resize();
                        $(window).resize();
                        $("#loadingWidget").fadeOut();
                    }, 1000);
                    
                },
                function(response) {
                    // TODO: handle the error somehow
                }).finally(function() {
                // called no matter success or failure 
                $scope.loading = false;
                $(".spinner-drop").fadeOut('slow');
            });
        	
        };
        
        $scope.loadFormData();
        
        FormMetaDataServices.referenceDropdownConfig().then(function(responseData) {
        	
        	if(responseData.process_status == "SUCCESS"){
        		$scope.dropdownMeta = responseData.MetaData;
        	}
        	else{
        		$scope.dropdownMeta = {};
        	}
                
            },
            function(response) {
                // TODO: handle the error somehow
            }).finally(function() {
            // called no matter success or failure 
        });
        
        alertServices.get({"AlertType":"NO_DATA"}).then(function(responseData) {
                 $scope.alertGrid.data = [];
                 if(responseData.AlertList){
                 	$scope.alertGrid.data = responseData.AlertList;
                 }
         });
        
        $scope.thresholdAlertColumns = [{
            field: 'AlertName'
        }, {
            field: 'AlertParameter'
        }, {
            field: 'NoOfConsecutive'
        },];
        
        $scope.alertGrid = {            
                columnDefs: $scope.thresholdAlertColumns,
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
                        $scope.rowSelect = row.isSelected;
                        $scope.rowDetail = row.entity;
                    });
                }
        };
        
        $scope.alertGrid.data = [];

        
        $scope.modalMessage = {};
        $scope.save = function () {
        	$("#loadingWidget").fadeIn('slow');
        	var tempJson = {};
        	var alertSubjectDisp = "";
        	var alertRefDisp = "";
        	
        	angular.forEach($scope.reportForms.FormDetails, function(subcatDetails, key) {
        		if(subcatDetails.type == "SEQUENTIAL"){
        			angular.forEach(subcatDetails.fields, function(fieldDetails, key) {
        				tempJson[fieldDetails.name] = fieldDetails.value;
        				
        				if(fieldDetails.name == 'AlertBased'){
        					if(fieldDetails.options){
        						alertSubjectDisp = fieldDetails.options[fieldDetails.value];
        					}
        				}
        				else if(fieldDetails.name == 'AlertReference'){
        					if(fieldDetails.options){
        						alertRefDisp = fieldDetails.options[fieldDetails.value];
        					}
        				}
        				
                	});
        		}
        		else if(subcatDetails.type == "MULTI_ROW_GRID"){
        			tempJson['NotificationDetails'] = subcatDetails.values;
        		}
        	});
        	
        	if($scope.reportForms.alert_id){
        		tempJson['alert_id'] = $scope.reportForms.alert_id;
        	}
        	
        	tempJson['AlertForDisplay'] = alertSubjectDisp + " - " + alertRefDisp;
        	
        	alertServices.put(tempJson).then(function(responseData) {
        		alert(responseData.message);
                alertServices.get({"AlertType":"NO_DATA"}).then(function(responseData) {
                	
                     $scope.alertGrid.data = [];
                     if(responseData.AlertList){
                     	$scope.alertGrid.data = responseData.AlertList;
                     }
                     
                     $("#loadingWidget").fadeOut('slow');
                 });
             });
        	
        }

        $scope.delete = function() {
            //only deletes if a row is selected
            if ($scope.rowSelect) {
            	$("#loadingWidget").fadeIn('slow');
                
                alertServices.deletealert($scope.rowDetail['alert_id']).then(function(responseData) {
                    //small bug where ui-grid index does not update after a delete
                    //$scope.gatewayGrid.data.splice($scope.rowDetail['index'], 1);
                	alert(responseData.message);
                    
                    alertServices.get({"AlertType":"NO_DATA"}).then(function(responseData) {
                        $scope.alertGrid.data = [];
                        if(responseData.AlertList){
                        	$scope.alertGrid.data = responseData.AlertList;
                        }
                        $("#loadingWidget").fadeOut('slow');
                    });
                    
                });

            }
            else{
            	alert("Make selection to delete");
            }
        };

        $scope.cancel = function() {
        	$("#loadingWidget").fadeIn('slow');
        	$scope.loadFormData();
        };

        $scope.edit = function() {
            if ($scope.rowSelect) {
            	$("#loadingWidget").fadeIn('slow');
            	$scope.reportForms.alert_id = $scope.rowDetail['alert_id'];
            	
            	angular.forEach($scope.reportForms.FormDetails, function(subcatDetails, key) {
            		if(subcatDetails.type == "SEQUENTIAL"){
            			angular.forEach(subcatDetails.fields, function(fieldDetails, key) {
            				fieldDetails.value = $scope.rowDetail[fieldDetails.name];
                    	});
            		}
            		else if(subcatDetails.type == "MULTI_ROW_GRID"){
            			subcatDetails.values = $scope.rowDetail['NotificationDetails'];
            		}
            	});
            	
            	$("#loadingWidget").fadeOut('slow');
            }
        };
        
        $scope.addCommodity = function(index, data) {
            $scope.reportForms.FormDetails[1].values.push({});
          };

          $scope.removeCommodity = function(index) {
            $scope.reportForms.FormDetails[1].values.splice(index, 1);
          };
    }
]);