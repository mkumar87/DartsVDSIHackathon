'use strict';

var apiUrl = window.apiUrl;

EnmanApp.factory('tariffSettings', ['$http', function($http, Session) {
    var tariffSettings = {};

    tariffSettings.demoData = function() {
        return $http.get('demo-json/tariffScreenLoad.json')
            .then(function(res) {
                return res.data;
            })
            .catch(function(e) {
                return e.data
            });
    }
    
    
    tariffSettings.puttariff = function (information) {       
        return $http
          .put(apiUrl+ 'tariffdata/tariff', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };
      
      
      tariffSettings.gettariff = function (queryParams) {       
      return $http
        .get(apiUrl+ 'tariffdata/tariff',{
            params: queryParams
        })
        .then(function (res) {
          return res.data;
        })
        .catch(function(e){
          return e.data
        });
    };

    tariffSettings.deletetariff = function (queryParams) {     
      return $http
        .delete(apiUrl+ 'tariffdata/tariff',{
            params: queryParams
        })
        .then(function (res) {
          return res.data;
        })
        .catch(function(e){
          return e.data
        });
    };


    return tariffSettings;
}]);