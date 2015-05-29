'use strict';

var apiUrl = window.apiUrl;

EnmanApp.service('budgetSettings', ['$http', function ($http, Session) {
    var budgetSettings = {};
    

    budgetSettings.fetchBudgetData= function (information) {       
        return $http
          .post(apiUrl+ 'budget/budget', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

    budgetSettings.put= function (information) {       
        return $http
          .put(apiUrl+ 'budget/budget', JSON.stringify(information))
          .then(function (res) {
            return res.data;
          })
          .catch(function(e){
            return e.data
          });
      };

    
    return budgetSettings;
}]);