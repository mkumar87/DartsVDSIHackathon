'use strict';

var apiUrl = window.apiUrl;

EnmanApp.service('metricsSettings', ['$http', function ($http, Session) {
    var metricsSettings = {};

    metricsSettings.get= function (information) {

        return $http
          .post(apiUrl+ 'metrics/metric', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };
      
      metricsSettings.getstation= function (information) {
          return $http
            .post(apiUrl+ 'degreedays/fetchstation', JSON.stringify(information))
            .then(function (res) {
              return res.data;
            })
            .catch(function(e){
              return e.data
            });
      };


      /*metricsSettings.put= function (information) {     
        return $http
          .put(apiUrl+ 'formstore/storebasic', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };*/
      
      metricsSettings.put= function (information) {     
        return $http
          .put(apiUrl+ 'metrics/metric', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

      /*metricsSettings.deleteMetric= function (information) {      
        return $http
          .delete(apiUrl+ 'metrics/metric', {params: 
            {
            'facility_id': information['facility_id'], 
            'gateway_id': information['gateway_id'] }
            })
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };*/
    return metricsSettings;
}]);