'use strict';

var apiUrl = window.apiUrl;

EnmanApp.service('meterSettings', ['$http', function($http, Session) {
    var meterSettings = {};

    meterSettings.get = function(information) {
        return $http
            .get(apiUrl + 'gateways/meter', {
                params: {
                    'facility_id': information
                }
            })
            .then(function(res) {
                return res.data;
            })
            .catch(function(e) {
                return e.data
            });
    };

    meterSettings.put = function(information) {
        return $http
            .put(apiUrl + 'gateways/meter', JSON.stringify(information), {
                params: {
                    'SUB_METHOD': 'UPDATE'
                }
            })
            .then(function(res) {
                return res.data;
            })
            .catch(function(e) {
                return e.data
            });
    };

    meterSettings.deleteMeter = function(information) {
        return $http
            .delete(apiUrl + 'gateways/meter', {
                params: {
                    'facility_id': information['facility_id'],
                    'meter_id': information['meter_id']
                }
            })
            .then(function(res) {
                return res.data;
            })
            .catch(function(e) {
                return e.data
            });
    };
    return meterSettings;
}]);