'use strict';

var apiUrl = window.apiUrl;

EnmanApp.service('gatewaySettings', ['$http', function ($http, Session) {
    var gatewaySettings = {};
    gatewaySettings.check = function (information) {        
        return $http
          .post(apiUrl+ 'gateways/testconnection', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

    gatewaySettings.get= function (information) {       
        return $http
          .get(apiUrl+ 'gateways/gateway', {params: { 'facility_id': information }})
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

    gatewaySettings.put= function (information) {       
        return $http
          .put(apiUrl+ 'gateways/gateway', JSON.stringify(information), {params: { 'SUB_METHOD': 'CREATE' }})
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

    gatewaySettings.deleteGateway= function (information) {     
        return $http
          .delete(apiUrl+ 'gateways/gateway', {params: 
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
      };
    return gatewaySettings;
}]);