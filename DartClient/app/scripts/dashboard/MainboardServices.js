'use strict';
EnmanApp.service('dashboardServices', ['$http', '$q', function($http, $q) {

  var dashboardServices = {};
  dashboardServices.getDashboards = function() {
    var deferred = $q.defer();
    $http.get(apiUrl + 'util/fetchdashboardconfig')
      .then(function(results) {
        if ($http.pendingRequests.length < 1) {
           $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(results)
        },
        function(errors) {
          if ($http.pendingRequests.length < 1) {
           $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject(errors);
        },
        function(updates) {
          deferred.update(updates);
        });
    return deferred.promise;
  };

  dashboardServices.getWidget = function(wid) {
    var deferred = $q.defer();

    $http.get(apiUrl + 'widgets/widget/'+ wid )
      .then(function(results) {
          if ($http.pendingRequests.length < 1) {
           $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(results)
        },
        function(errors) {
          if ($http.pendingRequests.length < 1) {
           $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject(errors);
        },
        function(updates) {
          deferred.update(updates);
        });
    return deferred.promise;
  };

  dashboardServices.addWidget = function(data) {
    var callType;
    var deferred = $q.defer();

    if(data.widget_id){
      callType = $http.post(apiUrl + 'formstore/storebasic', data);
    }else{
      callType = $http.put(apiUrl + 'formstore/storebasic', data)
    }
    callType.then(function(results) {
          deferred.resolve(results)
        },
        function(errors) {
          if ($http.pendingRequests.length < 1) {
           $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject(errors);
        },
        function(updates) {
          deferred.update(updates);
        });
    return deferred.promise;
  };

  dashboardServices.editWidget = function(category_code, entity_object, widget_id){
      var deferred = $q.defer();
      var categoryFor ={};
      categoryFor.CATEGORY_CODE = category_code;
      categoryFor.Entity_object = entity_object;
      categoryFor.widget_id = widget_id;

      $http.get(apiUrl + 'util/getbasicformjson', {
          params: categoryFor
        })
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };

    dashboardServices.deleteWidget = function(entity_object, widget_id){
      var deferred = $q.defer();
      var categoryFor ={};
      categoryFor.Entity_object = entity_object;
      categoryFor.widget_id = widget_id;

      $http.delete(apiUrl + 'formstore/deletebasic', {
          params: categoryFor
        })
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };

  dashboardServices.addDashboard = function(data) {
    var deferred = $q.defer();
    $http.put(apiUrl + 'formstore/storebasic', data)
      .then(function(results) {
          if ($http.pendingRequests.length < 1) {
           $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(results)
        },
        function(errors) {
          if ($http.pendingRequests.length < 1) {
           $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject(errors);
        },
        function(updates) {
          deferred.update(updates);
        });
    return deferred.promise;
  };

  dashboardServices.deleteDashboard = function(entity_object, dash_id){
      var deferred = $q.defer();
      var categoryFor ={};
      categoryFor.Entity_object = entity_object;
      categoryFor.dashboard_id = dash_id;

      $http.delete(apiUrl + 'formstore/deletebasic', {
          params: categoryFor
        })
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };

  return dashboardServices;
}]);
