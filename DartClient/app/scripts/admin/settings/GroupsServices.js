'use strict';

var apiUrl = window.apiUrl;

EnmanApp.service('groupSettings', ['$http', function($http, Session) {
    var groupSettings = {};

    groupSettings.get = function(information) {
        return $http
            .get(apiUrl + 'gateways/group', {
                params: {
                    'facility_id': information['facility_id'],
                    'sub_method': information['method']
                }
            })
            .then(function(res) {
                return res.data;
            })
            .catch(function(e) {
                return e.data
            });
    };

    groupSettings.put = function(information) {
        return $http
            .put(apiUrl + 'gateways/group', JSON.stringify(information))
            .then(function(res) {
                return res.data;
            })
            .catch(function(e) {
                return e.data
            });
    };

    groupSettings.deleteGroup = function(information) {
        return $http
            .delete(apiUrl + 'gateways/group', {
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
    return groupSettings;
}]);