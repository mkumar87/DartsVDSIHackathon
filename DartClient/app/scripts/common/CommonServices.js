//Remove this once all service translated
(function() {
  "use strict";
  window.apiUrl = window.apiUrl || "http://enman.gcurv.com:8000/api/v2/";
//  window.apiUrl = window.apiUrl || "http://localhost:8000/api/v2/";
  
  EnmanApp.factory('FormMetaDataServices', ['$http',
    function($http) {
      var apiUrl = window.apiUrl;

      var FormMetaDataServices = {
        getCategoryList: function(categoryFor) {
          return $http
            .post(apiUrl + 'util/getcategorymeta', JSON.stringify(categoryFor))
            .then(function(res) {
                return res.data;
              },
              function(res) {
                //Throw error
              });
        },

        getCategoryDetails: function(queryParams) {
          return $http
            .get(apiUrl + 'util/getbasicformjson', {
              params: queryParams
            })
            .then(function(res) {
              return res.data;
            });
        },

        getTariffForm: function(queryParams) {
          return $http
            .get(apiUrl + 'util/gettariffformjson', {
              params: queryParams
            })
            .then(function(res) {
              return res.data;
            });
        },


        saveForm: function(fullFormDtl) {
          return $http
            .post(apiUrl + 'formstore/storebasic', JSON.stringify(fullFormDtl))
            .then(function(res) {
              return res.data;
            });
        },

        referenceDropdownConfig: function() {
          return $http
            .get(apiUrl + 'util/fetchaccessdropdownconfig')
            .then(function(res) {
              return res.data;
            });
        },
      }

      return FormMetaDataServices;
    }
  ]);

}());



// application wide common data
(function() {
  "use strict";
  EnmanApp.factory("geoLocations", ["$http", "$q", geoLocations]);

  function geoLocations($http, $q) {

    // Retriving all countries
    function countries() {
      var deferred = $q.defer();
      $http.get(apiUrl + 'util/allcountry')
        .success(function(data, status) {
          deferred.resolve(data);
        }).error(function() {
          deferred.reject();
        });
      return deferred.promise;
    };

    // Retriving all states that belongs to Country code
    function states(code) {
      var deferred = $q.defer();
      $http.get(apiUrl + 'util/allstates/' + code)
        .success(function(data, status) {
          deferred.resolve(data);
        }).error(function() {
          deferred.reject();
        });
      return deferred.promise;
    };

    return {
      countries: countries,
      states: states
    };
  };

  // Access Dropdown configs
  EnmanApp.factory("AccessDropdownConfigs", ["$http", "$q", "CacheFactory", AccessDropdownConfigs]);

  function AccessDropdownConfigs($http, $q, CacheFactory) {
    self.dropdownconfigdataCache = CacheFactory.get("dropdownconfigdataCache");

    function fetchConfigs() {
      var deferred = $q.defer(),
        cacheKey = "dropdownconfigs",
        dropdownconfigdata = self.dropdownconfigdataCache.get(cacheKey);

      if (dropdownconfigdata) {
        console.log("dropdownconfigdata Found in Cache", dropdownconfigdata);
        $("#loadingWidget").fadeOut('slow');
        deferred.resolve(dropdownconfigdata);
      }

      $http.post(apiUrl + 'util/fetchaccessdropdownconfig')
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          self.dropdownconfigdataCache.put(cacheKey, data);
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };
    return {
      fetchConfigs: fetchConfigs
    };
  };
}());


(function() {
	  "use strict";
	  EnmanApp.factory('MenuListServices', ['$http',
	    function($http) {
	      var apiUrl = window.apiUrl;

	      var MenuListServices = {
	        getMenuList: function() {
	          return $http
	            .post(apiUrl + 'util/menulist')
	            .then(function(res) {
	                return res.data;
	              },
	              function(res) {
	                //Throw error
	              });
	        }
	      }

	      return MenuListServices;
	    }
	  ]);

	}());




