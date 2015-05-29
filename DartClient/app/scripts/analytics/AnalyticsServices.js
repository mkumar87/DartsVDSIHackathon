'use strict';

var apiUrl = window.apiUrl;

EnmanApp.service('analyticsService', ['$http', function ($http, Session) {
    var analyticsService = {};
    analyticsService.get = function(information) {
        return $http
            .get(apiUrl + 'analytics/getform', {
                params: {
                    'method': JSON.stringify(information)
                }
            })
            .then(function(res) {
                return res.data;
            })
            .catch(function(e) {
                return e.data
            });
    };

    analyticsService.getall = function(information) {
       return $http
          .post(apiUrl+ 'analytics/getall', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

    analyticsService.analyze = function (information) {        
        return $http
          .post(apiUrl+ 'analytics/analyze', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };
    return analyticsService;
}]);