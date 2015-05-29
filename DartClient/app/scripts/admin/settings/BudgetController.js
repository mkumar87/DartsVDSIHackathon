'use strict';
EnmanApp.controller('BudgetController', ['$scope', '$filter', 'TERMS', 'AuthServices', 'formData','budgetSettings',
    function($scope, $filter, TERMS, AuthServices, formData, budgetSettings) {
        /*formData.getFormFor('BUDGETS').then(function(responseData) {
           // $scope.budgetData = responseData;
            console.log("Budget",responseData);
            alert("Budget Category does not returns any form fields!!");
        });*/


        // FormMeta Assumption
        $scope.budgetData = {
            "facilityId": $scope.$parent.facilityEditId,
            "code": "BUDGET_OPTION",
            "displayName": "Budget Option",
            "icon": "fa fa-target",
            "fields": [{
                    "class": "col-sm-9",
                    "display": 1,
                    "label": "Budget Year",
                    "mandatory": 1,
                    "max_length": 45,
                    "min_length": 2,
                    "name": "budgetYear",
                    "placeholder": "Example : 2015",
                    "type": "text",
                    "value": "",
                    "weight": 0
                }, {
                    "class": "col-sm-9",
                    "display": 1,
                    "label": "Budget Term",
                    "mandatory": 1,
                    "max_length": 45,
                    "min_length": 2,
                    "name": "budgetTerm",
                    "placeholder": "",
                    "type": "dropdown",
                    "options": {
                        "YEARLY": "Yearly",
                        "HALFYEARLY": "Half Yearly",
                        "QUATERLY": "Quaterly",
                        "MONTHLY": "Monthly"
                    },
                    "callback": "termChange()",
                    "value": "YEARLY",
                    "weight": 0
                }, {
                    "class": "col-sm-9",
                    "display": 1,
                    "label": "Enter Yearly Data",
                    "mandatory": 1,
                    "max_length": 45,
                    "min_length": 2,
                    "name": "budgetYearData",
                    "placeholder": "120000",
                    "type": "dynamicfields",
                    "fields": [],
                    "value": "",
                    "weight": 0
                }, {
                    "class": "col-sm-9",
                    "display": 1,
                    "label": "Automatic Distribution",
                    "name": "amd",
                    "type": "dynamicfields",
                    "fields": [],
                    "value": "",
                    "weight": 0
                }
            ]
        };

        $scope.quaterlyFields = {
                "labels": ['Q1', 'Q2', 'Q3', 'Q4']
            };
        $scope.halfYearlyFields = {
                "labels": ['H1', 'H2']
            };

        $scope.amd = $filter('filter')($scope.budgetData.fields, {
            "name": "amd"
        });
        angular.forEach(TERMS.monthly, function(value) {
            this.push({
                "label": value,
                "type": "text",
                "value": "",
                "disable": true
            });
        }, $scope.amd[0]["fields"]);

        $scope.budgetYearData = $filter('filter')($scope.budgetData.fields, {
            "name": "budgetYearData"
        });

    	$scope.budgetYearData[0]["label"]="Enter Yearly Data";
    	$scope.budgetYearData[0]["type"]="text";
    	$scope.budgetYearData[0].display=1;
    	$scope.amd[0].label="Automatic Distribution";
    	angular.forEach($scope.amd[0]["fields"], function(field) {
    		field.disable=true;
        });

        $scope.saveInputData={
        		"facilityId":$scope.$parent.facilityEditId,
        		"BudgetDataForm": {
                	"budgetTerm": "",
                	"budgetValue": [],
                	"year":0
              	}
        };

        function disableOrEnableAMD (flag) {
        	angular.forEach($scope.amd[0]["fields"], function(field) {
        		if (flag == "disable") {
        			field.disable=true;
        		} else {
        			field.disable=false;
        		}
            });
        }

        // watching for budget term change and papulating Automatic distribution
        $scope.$watch('budgetData.fields[1].value', function(newVal, oldVal) {

            if (oldVal !== newVal) {
            	$scope.budgetYearData[0].value=0;
            	$scope.saveInputData['BudgetDataForm']['budgetValue']=[];
            	$scope.saveInputData['BudgetDataForm']['budgetTerm']=newVal;
            	angular.forEach($scope.amd[0]["fields"], function(obj, key) {
            		obj.disable=false;
                }, $scope.amd[0]["fields"]);
                // cleaaring existing fields
            	$scope.budgetYearData[0]["fields"] = [];
                switch (newVal) {
                    case "YEARLY":
                    	$scope.budgetYearData[0]["label"]="Enter Yearly Data";
                    	$scope.budgetYearData[0]["type"]="text";
                    	$scope.budgetYearData[0].display=1;
                    	$scope.budgetYearData[0].value=0;
                    	$scope.amd[0].label="Automatic Distribution";
                    	disableOrEnableAMD("disable");
                        break;
                    case "HALFYEARLY":
                    	$scope.budgetYearData[0]["label"] = "Enter Halfyearly Data";
                    	$scope.budgetYearData[0]["type"]="dynamicfields";
                    	$scope.budgetDataFields = $scope.halfYearlyFields;
                    	$scope.budgetYearData[0].display=1;
                    	$scope.amd[0].label="Automatic Distribution";
                    	angular.forEach($scope.budgetDataFields.labels, function(value) {
                            this.push({
                                "label": value,
                                "type": "text",
                                "value": "",
                                "disable": false
                            });
                        }, $scope.budgetYearData[0]["fields"]);

                    	disableOrEnableAMD("disable");

                    	$scope.H1 = $filter('filter')($scope.budgetData.fields[2].fields, {
                            "label": "H1"
                        });
                    	$scope.H2 = $filter('filter')($scope.budgetData.fields[2].fields, {
                            "label": "H2"
                        });

                    	$scope.$watch("H1[0].value", function(newVal, oldVal) {
                    		distributeData(newVal, oldVal, 0, 5, "HALFYEARLY");
                        });
                    	$scope.$watch("H2[0].value", function(newVal, oldVal) {
                    		distributeData(newVal, oldVal, 6, 11, "HALFYEARLY");
                        });

                        break;
                    case "QUATERLY":
                    	$scope.budgetYearData[0]["label"] = "Enter Quaterly Data";
                    	$scope.budgetYearData[0]["type"]="dynamicfields";
                    	$scope.budgetDataFields = $scope.quaterlyFields;
                    	$scope.budgetYearData[0].display=1;
                    	$scope.amd[0].label="Automatic Distribution";
                    	angular.forEach($scope.budgetDataFields.labels, function(value) {
                            this.push({
                                "label": value,
                                "type": "text",
                                "value": "",
                                "disable": false
                            });
                        }, $scope.budgetYearData[0]["fields"]);

                    	disableOrEnableAMD("disable");

                    	$scope.Q1 = $filter('filter')($scope.budgetData.fields[2].fields, {
                            "label": "Q1"
                        });
                    	$scope.Q2 = $filter('filter')($scope.budgetData.fields[2].fields, {
                            "label": "Q2"
                        });
                    	$scope.Q3 = $filter('filter')($scope.budgetData.fields[2].fields, {
                            "label": "Q3"
                        });
                    	$scope.Q4 = $filter('filter')($scope.budgetData.fields[2].fields, {
                            "label": "Q4"
                        });

                    	$scope.$watch('Q1[0].value', function(newVal, oldVal) {
                    		distributeData(newVal, oldVal, 0, 2, "QUATERLY");
                        });
                    	$scope.$watch('Q2[0].value', function(newVal, oldVal) {
                    		distributeData(newVal, oldVal, 3, 5, "QUATERLY");
                        });
                    	$scope.$watch('Q3[0].value', function(newVal, oldVal) {
                    		distributeData(newVal, oldVal, 6, 8, "QUATERLY");
                        });
                    	$scope.$watch('Q4[0].value', function(newVal, oldVal) {
                    		distributeData(newVal, oldVal, 9, 11, "QUATERLY");
                        });
                        break;
                    case "MONTHLY":
                    	$scope.budgetYearData[0].display=0;
                    	$scope.amd[0].label="Enter Monthly Data";
                    	disableOrEnableAMD("enable");
                        break;
                    default:
                    	$scope.budgetYearData[0]["label"]="Enter Yearly Data";
                    	$scope.budgetYearData[0]["type"]="text";
                    	$scope.budgetYearData[0].display=1;
                    	$scope.budgetYearData[0].value=0;
                    	$scope.amd[0].label="Automatic Distribution";
                    	disableOrEnableAMD("disable");
                }
            }
        });

        // Watch in data change in budgetYearData
        $scope.$watch('budgetData.fields[2].value', function(newVal, oldVal) {
            updateAutomaticDist(newVal, oldVal);
        });

        function updateAutomaticDist(newVal, oldVal) {
            $scope.amd = $filter('filter')($scope.budgetData.fields, {
                "name": "amd"
            });

            if (oldVal !== newVal) {
            	if (newVal != undefined && newVal > 0) {
            		$scope.saveInputData['BudgetDataForm']['budgetValue'].push(newVal);
            	}
                angular.forEach($scope.amd[0]["fields"], function(obj, key) {
                    var amt = newVal / $scope.amd[0]["fields"].length;
                    obj.value = amt;
                }, $scope.amd[0]["fields"]);

            }
        }

        function distributeData(newVal, oldVal, startfield, endfield, budgetTerm) {
            $scope.amd = $filter('filter')($scope.budgetData.fields, {
                "name": "amd"
            });
            if (oldVal !== newVal) {
            	var amt=0;
               for (var i=startfield;i<=endfield;i++) {
                	if (budgetTerm == "QUATERLY") {
                		amt = newVal /3;
                	} else if (budgetTerm == "HALFYEARLY") {
                		amt = newVal /6;
                	}
                	$scope.amd[0]["fields"][i].value=amt;
                }
            }
        }
        function generateSaveDataInput () {
        	$scope.saveInputData['BudgetDataForm']['year']=budgetForm[0].value
        	if ($scope.saveInputData['BudgetDataForm']['budgetTerm'] == "QUATERLY") {
        		$scope.saveInputData['BudgetDataForm']['budgetValue']=[];
        		$scope.saveInputData['BudgetDataForm']['budgetValue'].push($scope.Q1[0].value);
        		$scope.saveInputData['BudgetDataForm']['budgetValue'].push($scope.Q2[0].value);
        		$scope.saveInputData['BudgetDataForm']['budgetValue'].push($scope.Q3[0].value);
        		$scope.saveInputData['BudgetDataForm']['budgetValue'].push($scope.Q4[0].value);
        	} else if ($scope.saveInputData['BudgetDataForm']['budgetTerm'] == "HALFYEARLY"){
        		$scope.saveInputData['BudgetDataForm']['budgetValue']=[];
        		$scope.saveInputData['BudgetDataForm']['budgetValue'].push($scope.H1[0].value);
        		$scope.saveInputData['BudgetDataForm']['budgetValue'].push($scope.H2[0].value);
        	} else if ($scope.saveInputData['BudgetDataForm']['budgetTerm'] == "MONTHLY") {
        		$scope.saveInputData['BudgetDataForm']['budgetValue']=[];
        		angular.forEach($scope.amd[0].fields, function(field) {
        			$scope.saveInputData['BudgetDataForm']['budgetValue'].push(field.value);
                });
        	} else {
        		$scope.saveInputData['BudgetDataForm']['budgetValue']=[];
        		$scope.saveInputData['BudgetDataForm']['budgetTerm']="YEARLY";
        		$scope.saveInputData['BudgetDataForm']['budgetValue'].push($scope.budgetYearData[0].value);
        	}
        }

        $scope.save = function() {
            if ($scope.budgetForm.$invalid) {
                $scope.$broadcast('record:invalid');
            } else {
            	generateSaveDataInput();
            	budgetSettings.put($scope.saveInputData).then(function(responseData) {
                  alert (responseData);
                  //used for populating the ui-grid with budget under a facility
                    var gridInput = {
                    		'facilityId': $scope.$parent.facilityEditId,
                            'mappingName':'budgetTable',
                            'smCode': 'BUDGET'
                    };
                    budgetSettings.fetchBudgetData(gridInput).then(function(responseData) {
                    	console.log(responseData)
                        $scope.budgetGrid.data = responseData
                    });
                }, function(response) {
                    // TODO: handle the error somehow
                }).finally(function() {
                    // called no matter success or failure
                    $scope.loading = false;
                    $(".spinner-drop").fadeOut('slow');
                });

            }
        };

        $scope.budgetTableColumns =
        	[{
        		field: 'Year'
        	 }, {
        		field: 'Budget Term'
             }, {
            	field: 'Jan'
            }, {
            	field: 'Feb'
            }, {
            	field: 'Mar'
            }, {
            	field: 'Apr'
            }, {
            	field: 'May'
            }, {
            	field: 'Jun'
            }, {
            	field: 'Jul'
            }, {
            	field: 'Aug'
            }, {
            	field: 'Sep'
            }, {
            	field: 'Oct'
            }, {
            	field: 'Nov'
            }, {
            	field: 'Dec'
            }];

        $scope.budgetGrid = {
        		columnDefs: $scope.budgetTableColumns,
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

                    });
                }
        };


        //used for populating the ui-grid with budget under a facility
        var gridInput = {
        		'facilityId': $scope.$parent.facilityEditId,
                'mappingName':'budgetTable',
                'smCode': 'BUDGET'
        };
        budgetSettings.fetchBudgetData(gridInput).then(function(responseData) {
        	console.log(responseData)
            $scope.budgetGrid.data = responseData
        });
    }
]);