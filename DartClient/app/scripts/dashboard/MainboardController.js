'use strict';
EnmanApp.controller('MainboardController', ['$scope', '$state', '$filter', '$modal',
  'AuthServices', 'dashboardServices', 'formData', 'AccessDropdownConfigs',
  function($scope, $state, $filter, $modal, AuthServices, dashboardServices, formData, AccessDropdownConfigs) {
    // check user login
    if (!AuthServices.isAuthenticated()) {
      $state.go('login');
    }

    // Loader
    $("#loadingWidget").fadeIn();

    $scope.dashboards = {};
    $scope.dashboard = {};

    // get  dashboard list
    $scope.getDashboards = function(dash_id) {
      dashboardServices.getDashboards().then(function(res) {
        $scope.dashboards = res.data;
        console.log("dashboards: ", $scope.dashboards);
        var defaultSelect = $filter('filter')($scope.dashboards.DashboardList, {
          "DashboardCode": $scope.dashboards.DefaultLoading
        });

        if(dash_id){
          angular.forEach($scope.dashboards.DashboardList,
                function(obj, key) {
                  // console.log(obj.DashboardId, dash_id);
                  if (obj.DashboardId == dash_id) {
                    $scope.dashboard.selected = obj;
                  }
            });
        }else{
          $scope.dashboard.selected = defaultSelect[0];
        }
        // console.log("dashboard selected: ", $scope.dashboard.selected);
      });


      // Add New Dashboard
      formData.getFormFor("DASHBOARD_GENERAL", "DASHBOARD").then(function(responseData) {
        //// console.log(responseData.FormDetails[0].fields);
        $scope.dashboardFormFields = responseData;
      });

      // Add New widget
      formData.getFormFor("WIDGET_GENERAL", "WIDGET").then(function(responseData) {
        //// console.log(responseData.FormDetails[0].fields);
        $scope.widgetFormFields = responseData;
      });


    }
    $scope.getDashboards();

    // watching dashboard change and setting dashboard id
    $scope.$watch('dashboard.selected', function(newVal, oldVal) {
      if (typeof newVal !== undefined) {
        //console.log("selected dash", newVal);
        $scope.currentDashboard = newVal;
      }
    });

    // dropdownconfigdata
    AccessDropdownConfigs.fetchConfigs().then(function(data) {
      //// console.log(data.MetaData);
      $scope.dropdownconfigs = data.MetaData;
    });

    // Modal for adding dash board
    $scope.addDashboard = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'addDashboard.html',
        controller: 'addDashboardCtrl',
        size: size,
        resolve: {
          dashboardFormFields: function() {
            return $scope.dashboardFormFields;
          },
          dropdownconfigs: function() {
            return $scope.dropdownconfigs;
          }
        }
      });

      modalInstance.result.then(function(result) {
        // Do Adding Dashboard here
        $("#loadingWidget").fadeIn();
        $scope.dashboardFormFields = result;
        dashboardServices.addDashboard($scope.dashboardFormFields).then(function(resData) {
          if (resData.data.process_status === "SUCCESS") {
             // console.log("resdaa",resData);
              $scope.getDashboards(resData.data.dashboard_id);
          }
        });

      });
    };

    $scope.deleteDashboard = function(dash_id){
      $("#loadingWidget").fadeIn();
        dashboardServices.deleteDashboard("DASHBOARD", dash_id).then(function(data) {
          $scope.getDashboards();
        });
    }

    // Modal for addWidget
    $scope.addWidget = function(size) {
      var modalInstance = $modal.open({
        templateUrl: 'addWidget.html',
        controller: 'addWidgetCtrl',
        size: size,
        resolve: {
          widgetFormFields: function() {
            return $scope.widgetFormFields;
          },
          dropdownconfigs: function() {
            return $scope.dropdownconfigs;
          }
        }
      });

      modalInstance.result.then(function(result) {
        $("#loadingWidget").fadeIn('fast');
        // Do Adding Widget here
        // console.log("has widget_id ",$scope.widgetFormFields);
        $scope.widgetFormFields = result;
        angular.forEach($scope.widgetFormFields.FormDetails[0].fields,
          function(obj, key) {
            if (obj.name == 'dashboardCode') {
              obj.value = $scope.currentDashboard.DashboardCode;
            }
        });
        dashboardServices.addWidget($scope.widgetFormFields).then(function(resData) {
          if (resData.data.process_status === "SUCCESS") {
              dashboardServices.getDashboards().then(function(res) {
                $scope.dashboards = res.data;
                angular.forEach($scope.dashboards.DashboardList,
                function(obj, key) {
                  // console.log(obj, $scope.dashboard.selected.DashboardId);
                  if (obj.DashboardId === $scope.dashboard.selected.DashboardId) {
                    $scope.dashboard.selected.WidgetsList = obj.WidgetsList;
                    //$scope.$apply();
                    // console.log("dashboards on add : ", $scope.dashboard.selected.WidgetsList);
                  }
              });

              });
            // console.log("Current Dash : ", $scope.dashboard.selected.DashboardId);
          }else{
            alert("Something went wrong, Try Again!!")
          }
        });
      });
    };

    $scope.editWidget = function(widget_id) {
        // Do widget edit
        dashboardServices.editWidget("WIDGET_GENERAL", "WIDGET", widget_id).then(function(data) {
          $scope.widgetFormFields = data;
          $scope.addWidget("lg", widget_id)
        });
      }

  }
]);

EnmanApp.controller('addDashboardCtrl',
  function($scope, $modalInstance, $filter, dashboardFormFields, dropdownconfigs) {

    $scope.dashboardFormFields = dashboardFormFields;
    //// console.log($scope.dashboardFormFields);

    // Watching changes in widgetbased (widget subject)
    $scope.$watch('dashboardFormFields.FormDetails[0].fields[1].value', function(newVal, oldVal) {
      //// console.log(dropdownconfigs[newVal]);
      $scope.dashboardFormFields.FormDetails[0].fields[2].options = {};
      angular.forEach(dropdownconfigs[newVal], function(obj, key) {
        // Generating Wedget referancess
        $scope.dashboardFormFields.FormDetails[0].fields[2].options[obj.id] = obj.label;
      });
    });
    $scope.addDashboard = function() {
      if ($scope.dashboardForm.$invalid) {
        $scope.$broadcast('record:invalid');
      } else {
        $modalInstance.close($scope.dashboardFormFields);
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });


EnmanApp.controller('addWidgetCtrl',
  function($scope, $modalInstance, $filter, widgetFormFields, dropdownconfigs) {

    $scope.widgetFormFields = widgetFormFields;
    //// console.log($scope.widgetFormFields);

    // Watching changes in widgetbased (widget subject)
    $scope.$watch('widgetFormFields.FormDetails[0].fields[3].value', function(newVal, oldVal) {
      //// console.log(dropdownconfigs[newVal]);
      $scope.widgetFormFields.FormDetails[0].fields[5].options = {};
      angular.forEach(dropdownconfigs[newVal], function(obj, key) {
        // Generating Wedget referancess
        $scope.widgetFormFields.FormDetails[0].fields[5].options[obj.id] = obj.label;
      });
    });
    $scope.addWidget = function() {
      if ($scope.widgetForm.$invalid) {
        $scope.$broadcast('record:invalid');
      } else {
        $modalInstance.close($scope.widgetFormFields);
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
