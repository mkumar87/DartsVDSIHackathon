'use strict';

var apiUrl = window.apiUrl;

EnmanApp.service('alertServices', ['$http', function ($http, Session) {
    var alertServices = {};
    
    
    
    alertServices.get = function (queryParams) {       
        return $http
          .get(apiUrl+ 'alerts/all',{
              params: queryParams
          })
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

      alertServices.put = function (information) {       
        return $http
          .put(apiUrl+ 'alerts/alert', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

      alertServices.deletealert = function (alertId) {     
        return $http
          .delete(apiUrl+ 'alerts/alert/' + alertId)
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };
    
    
    
    
    
    return alertServices;
}]);