// New for meta service for new setting forms
(function() {
  "use strict";
  EnmanApp.factory("formData", ["$http", "$q", "CacheFactory", formData]);

  function formData($http, $q, CacheFactory) {
    self.settingCategoriesCache = CacheFactory.get("settingCategoriesCache");
    self.facilityListCache = CacheFactory.get("facilityListCache");
    self.categoryFormCache = CacheFactory.get("categoryFormCache");
    self.geoCountryDataCache = CacheFactory.get("geoCountryDataCache");
    self.geoStateDataCache = CacheFactory.get("geoStateDataCache");

    var facilityId = false;

    // Retrive form setting categories
    function getCategoryList(categoryFor) {
      var deferred = $q.defer(),
        cacheKey = "settingCategories",
        settingCategoriesData = self.settingCategoriesCache.get(cacheKey);

      if (settingCategoriesData) {
        //console.log("Setting Categories Found in Cache", settingCategoriesData);
        $("#loadingWidget").fadeOut('slow');
        deferred.resolve(settingCategoriesData);
      }

      $http.post(apiUrl + 'util/getcategorymeta', JSON.stringify(categoryFor))
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          self.settingCategoriesCache.put(cacheKey, data);
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };

    // retrive form fields based on category
    // params (category_code, entity_object, sm_group, sm_category)
    function getFormFor(category_code, entity_object, sm_group, sm_category) {
      var deferred = $q.defer(),
      categoryFor ={},
      cacheKey = "categoryForm_" + category_code,
      categoryFormData = self.categoryFormCache.get(cacheKey);

      if(category_code){
        categoryFor.CATEGORY_CODE = category_code;
      }

      if(entity_object){
        categoryFor.Entity_object = entity_object;
      }

      if(sm_group){
        categoryFor.sm_group = sm_group;
      }
      if(sm_category){
        categoryFor.sm_category= sm_category;
      }

      if (facilityId) {
        categoryFor.facility_id = facilityId
      }

      if (categoryFormData && !facilityId) {
        //console.log("category Form Data Found in Cache", categoryFormData);
        $("#loadingWidget").fadeOut('slow');
        deferred.resolve(categoryFormData);
      }

      $http.get(apiUrl + 'util/getbasicformjson', {
          params: categoryFor
        })
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          self.categoryFormCache.put(cacheKey, data);
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };


    // save and update settings
    function saveSettings(facility) {
      var deferred = $q.defer();
      var call;
      if(typeof facility.facility_id === undefined || facility.facility_id == "0" ){
        call = $http.put(apiUrl + 'formstore/storebasic', JSON.stringify(facility));
      }else{
        call = $http.post(apiUrl + 'formstore/storebasic', JSON.stringify(facility));
      }
        call
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

    // retrive all facility
    function getfacilities() {
      var deferred = $q.defer(),
        cacheKey = "facilityList",
        facilityListData = self.facilityListCache.get(cacheKey);

      // if found in cache set data from cache
      if (facilityListData) {
        console.log("Facility List Data founf in cache", facilityListData);
        $("#loadingWidget").fadeOut('slow');
        deferred.resolve(facilityListData);
      };

      $http.get(apiUrl + 'facilities/all')
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          // set data in cache
          self.facilityListCache.put(cacheKey, data);
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };

    // Delete a facility
    function deleteFacility(id) {
      var deferred = $q.defer();
      $http.delete(apiUrl + 'facilities/facility/' + id)
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
           // $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
            //$("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };

    function setFacilityId(facility_id) {
      facilityId = facility_id;
      return facilityId;
    };

    // Countries and State

    // Retriving all countries
    function countries() {
      var deferred = $q.defer(),
      cacheKey = "countries",
      geoCountryDataCache = self.geoCountryDataCache.get(cacheKey);

      if (geoCountryDataCache) {
        //console.log("Countries Found in Cache", geoCountryDataCache);
        $("#loadingWidget").fadeOut('slow');
        deferred.resolve(geoCountryDataCache);
      }

      $http.get(apiUrl + 'util/allcountry')
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          self.geoCountryDataCache.put(cacheKey, data);
          deferred.resolve(data);
        }).error(function() {
          deferred.reject();
        });
      return deferred.promise;
    };

    // Retriving all states that belongs to Country code
    function states(code) {
      var deferred = $q.defer(),
      cacheKey = "states_"+code,
      geoStateDataCache = self.geoStateDataCache.get(cacheKey);

      if (geoStateDataCache) {
        //console.log("States Found in Cache", geoStateDataCache);
        $("#loadingWidget").fadeOut('slow');
        deferred.resolve(geoStateDataCache);
      }

      $http.get(apiUrl + 'util/allstates/' + code)
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
            $("#loadingWidget").fadeOut('slow');
          }
          self.geoStateDataCache.put(cacheKey, data);
          deferred.resolve(data);
        }).error(function() {
          deferred.reject();
        });
      return deferred.promise;
    };

    // retrive form fields based on category
    function getTariffForm() {

    	var tariffFormInput = {
    							"Entity_object" : 'FACILITY',
    							"CATEGORY_CODE" : 'TARIFF',
    						  };
      if (facilityId) {
    	  tariffFormInput.facility_id = facilityId
      }

      var deferred = $q.defer();
      if (facilityId) {
    	  tariffFormInput.facility_id = facilityId;
      }

      $http.get(apiUrl + 'util/gettariffformjson', {
          params: tariffFormInput
        })
        .success(function(data, status) {
          if ($http.pendingRequests.length < 1) {
//            $("#loadingWidget").fadeOut('slow');
          }
          deferred.resolve(data);
        }).error(function() {
          if ($http.pendingRequests.length < 1) {
//            $("#loadingWidget").fadeOut('slow');
          }
          deferred.reject();
        });
      return deferred.promise;
    };

    return {
      getCategoryList: getCategoryList,
      getFormFor: getFormFor,
      saveSettings: saveSettings,
      getfacilities: getfacilities,
      deleteFacility: deleteFacility,
      setFacilityId: setFacilityId,
      countries: countries,
      states: states,
      getTariffForm : getTariffForm
    };
  };
}());
