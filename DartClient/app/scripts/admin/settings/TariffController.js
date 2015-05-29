'use strict';
EnmanApp.controller('TariffController', ['$scope', '$state', 'formData', 'tariffSettings',
  function($scope, $state, formData, tariffSettings) {
    $("#loadingWidget").fadeIn();
    // Retriving form
    
    
    $scope.loadFormData = function() {
    	
    	formData.getTariffForm().then(function(data){
            $scope.settingTariff = data;
            
            $scope.transactionalTariffData = {};
            $scope.tariffResultGrid = {};
            angular.forEach($scope.settingTariff.FormDetails, function(singleCommodity, key) {
            	
    			
            	$scope.transactionalTariffData[singleCommodity.uniqueCode] = {"DefineBlocksValues" : [{},]
            																 }
            	
            	var tempBlockData = [];
            	$scope.transactionalTariffData[singleCommodity.uniqueCode]["HourlyTariffValues"] = tempBlockData;
            	
            	var tempSingleBlockData = {};
            	
            	var tempHourBlockMap = [];
            	
            	for(var d=0; d < 7; d++){
            		var tempSingleDay = [];
            		for(var h=0; h < 24; h++){
            			tempSingleDay.push({"BlockName":"NA",
            								"BlockColor":"#000000",});
                	}
            		tempHourBlockMap.push(tempSingleDay);
            	}
            	
            	tempSingleBlockData["HourBlockMapping"] = tempHourBlockMap;
            	tempBlockData.push(tempSingleBlockData);
            	
            	var tariffResultCols = [
    							        	{
    							                field: 'contractName'
    							            }, {
    							                field: 'commodityMeter'
    							            },
    							            {
    							                field: 'contractDuration'
    							            }, {
    							                field: 'consumptionModel'
    							            },
    							            {
    							                field: 'commodityType'
    							            }, {
    							                field: 'status'
    							            }
    					            	];
            	
            	var tariffResultData = [];
            	
            	if(singleCommodity.existingTariffs && singleCommodity.existingTariffs.gridData){
            		tariffResultData = singleCommodity.existingTariffs.gridData;
            	}
            	
            	$scope.tariffResultGrid[singleCommodity.uniqueCode] = {            
                        columnDefs: tariffResultCols,
                        data: tariffResultData,
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
                                console.log(row.entity)
                            });
                        }
                    };
            	
        	});
            $("#loadingWidget").fadeOut();
        });
    	
    };
    
    $scope.loadFormData();
    
    $scope.tariffPattern = "yearly";

    // manipulating blocks rates
    $scope.addRateBlock = function(index, data) {
    	data.push({});
    	console.log(data);
    };

    $scope.removeRateBlock = function(index, data) {
      data.splice(index, 1);
      console.log(data);
      
    };

    // Full form summissions
    $scope.save = function(singleCategoryDetails, transactionalDetails) {
      if ($scope[singleCategoryDetails.uniqueCode].$invalid) {
        $scope.$broadcast('record:invalid');
      } else {
    	var isAllBlockSelected = true;
    	
    	if(singleCategoryDetails.type == 'HOURLY_TARIFF'){
    		for (var i = 0, len = transactionalDetails.HourlyTariffValues.length; i < len; i++) {
        		
        		if(! isAllBlockSelected){
        			break;
        		}
        		
        		var singleBlock = transactionalDetails.HourlyTariffValues[i]['HourBlockMapping'];
        		
        		for(var d=0; d < 7; d++){
        			if(! isAllBlockSelected){
            			break;
            		}
        			
            		var tempSingleDay = singleBlock[d];
            		for(var h=0; h < 24; h++){
            			
            			var tempHour = tempSingleDay[h];
            			
            			if(tempHour.BlockName == "NA"){
            				isAllBlockSelected = false;
            				break;
            			}
                	}
            	}
        		
        	}
        	  
    	}
    	
    	if(isAllBlockSelected){
    		$("#loadingWidget").fadeIn();
        	
            
            var tariffData = {"facility_id" : $scope.settingTariff.facility_id,
            				  "Entity_object" : $scope.settingTariff.Entity_object,
            				  "type" : singleCategoryDetails.type,
            				  "fields" : singleCategoryDetails.fields,
            				  "DefineBlocksValues" : transactionalDetails.DefineBlocksValues,
            				  "HourlyTariffValues" : transactionalDetails.HourlyTariffValues,
            				  };
           
            if(transactionalDetails['tariff_id']){
            	tariffData['tariff_id'] = transactionalDetails['tariff_id'];
            }
            
            tariffSettings.puttariff(tariffData).then(function(responseData) {
            	
            	alert(responseData.message);
            	
            	if(responseData.process_status == "SUCCESS"){
            		$scope.loadFormData();
            	}
            	else{
            		$("#loadingWidget").fadeOut();
            	}
            });
    	}
    	else{
    		alert("All block should be selected");
    	}
            
      }
    };
    
    
    $scope.delete = function() {
        //only deletes if a row is selected
        if ($scope.rowSelect) {
        	$("#loadingWidget").fadeIn();
            
            tariffSettings.deletetariff({"tariff_id" : $scope.rowDetail['tariff_id']}).then(function(responseData) {
            	$scope.loadFormData();
            	alert(responseData.message);
            });
        }
        else{
        	console.log("row is notselected");
        }
    };

    $scope.cancel = function() {
    	$("#loadingWidget").fadeIn();
    	$scope.loadFormData();
    };

    $scope.edit = function(singleCategoryDetails, transactionalDetails) {
        if ($scope.rowSelect) {
        	$("#loadingWidget").fadeIn();
        	tariffSettings.gettariff({"tariff_id" : $scope.rowDetail['tariff_id']}).then(function(responseData) {
        		
        		if(responseData.process_status == 'SUCCESS'){
        			 transactionalDetails['DefineBlocksValues'] = responseData.DefineBlocksValues;
                     transactionalDetails['HourlyTariffValues'] = responseData.HourlyTariffValues;
                     transactionalDetails['tariff_id'] = $scope.rowDetail['tariff_id'];
                     
                     angular.forEach(singleCategoryDetails.fields, function(singleField, key) {
                     	
                     	singleField.value = responseData['TariffDetails'][singleField.name];
                     	
                     });
        		}
        		else{
        			alert(responseData.message);
        		}
                
                $("#loadingWidget").fadeOut();
                
            });
        }
    };

    // utils to open date popup
    // TODO : attach below function to the gcurv field directives
    $scope.opened = true;
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      console.log("works");
      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  }
]);
