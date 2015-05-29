(function() {
  'use strict';
  EnmanApp.controller('AppController', ['$scope','fileUpload',
    function($scope, fileUpload) {
	  
	 
	  $scope.submit = function(){
		  fileUpload.uploadFileToUrl($scope.myFile, "http://localhost:8000/api/v1/util/processfile");
	  }

	  $scope.submitNaive = function(){
		  fileUpload.uploadFileToUrl($scope.myFile, "http://localhost:8000/api/v1/util/processfilenaive");
	  }

	  $scope.submitTrain = function(){
		  fileUpload.uploadFileToUrl($scope.myFile, "http://localhost:8000/api/v1/util/processfiletrain");
	  }

	  $scope.submitTrainData = function(){
		  fileUpload.uploadTrainDataToUrl($scope.trainingFile, "http://localhost:8000/api/v1/util/addtraindata");
	  }

	  $scope.wipeTrainData = function(){
		  fileUpload.wipeTrainDataToUrl("http://localhost:8000/api/v1/util/wipetraindata");
	  }

	  $scope.initiateNaive = function(){
		  fileUpload.initiateDataToUrl("http://localhost:8000/api/v1/util/preparenayebayesreport");
	  }

	  $scope.fetchNaive = function(){
		  fileUpload.fetchNaiveDataToUrl("http://localhost:8000/api/v1/util/fetchbayesreport");
	  }
    }
  ]);
  
  
  EnmanApp.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            
	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);
  
  EnmanApp.service('fileUpload', ['$http', function ($http) {
	    this.uploadFileToUrl = function(file, uploadUrl){
	        var fd = new FormData();
	        fd.append('file', file);
	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(data){
	        	console.log(data);

				var rowData = [];
				var patternDtls = data.patternDtls;
				var patternCountMap = data.patternCountMap;

				for(var i = 0, c = patternDtls.length; i < c  ; i++ )
				{

					rowData.push([patternDtls[i].feedback, patternDtls[i].sentiment, patternDtls[i].polarity]);
				}
				
				 $('#newTable').DataTable({"data" : rowData, "destroy": true});

				 var chart = AmCharts.makeChart( "chartdiv", {
							  "type": "pie",
							  "theme": "light",
							  "path": "http://www.amcharts.com/lib/3/",
							  "colors" : ["#7CCF72", "#C6B8E6", "#DB5656"],
							  "legend": {
								"markerType": "circle",
								"position": "right",
								"marginRight": 80,
								"autoMargins": false
							  },
							  "dataProvider": [ {
								"sentiment": "Positive",
								"count": patternCountMap['Positive']
							  }, {
								"sentiment": "Neutral",
								"count": patternCountMap['Neutral']
							  }, {
								"sentiment": "Negative",
								"count": patternCountMap['Negative']
							  } ],
							  "valueField": "count",
							  "titleField": "sentiment",
							  "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
							  "export": {
								"enabled": true
							  }
							} );

	        })
	        .error(function(){
	        });
	    };


		this.fetchNaiveDataToUrl = function(uploadUrl){

	        $http.get(uploadUrl)
	        .success(function(data){
	        	console.log(data);

				var rowData = [];
				var patternDtls = data;
								//var patternCountMap = data.patternCountMap;

				for(var i = 0, c = patternDtls.length; i < c  ; i++ )
				{

					rowData.push([patternDtls[i].feedback, patternDtls[i].sentiment, "NA"]);
				}
				
				 $('#newTable').DataTable({"data" : rowData, "destroy": true});

				

	        })
	        .error(function(){
	        });
	    };

		
		this.uploadTrainDataToUrl = function(file, uploadUrl){
	        var fd = new FormData();
	        fd.append('file', file);
	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(data){

				alert("Successfully updated training document");

	        })
	        .error(function(){
	        });
	    };

		this.wipeTrainDataToUrl = function(uploadUrl){
	       
	        $http.get(uploadUrl)
	        .success(function(data){

				alert("Successfully cleared training document");

	        })
	        .error(function(){
	        });
	    };

		this.initiateDataToUrl = function(uploadUrl){
	       
	        $http.get(uploadUrl)
	        .success(function(data){

				alert("NaiveBayes Analysis has started in backgroud. Will take around 10 mins. Please check reports to see the results");

	        })
	        .error(function(){
	        });
	    }

	}]);
}());
