'use strict';
EnmanApp.controller('GeneralController', ['$rootScope', '$scope', '$state', 'formData', "CacheFactory",
  function($rootScope, $scope, $state, formData, CacheFactory) {
    $("#loadingWidget").fadeIn();

    $scope.$watch("facilityEditId", function(newVal, oldVal) {
      //console.log("facilityEditId", newVal);
      if (newVal) {
        $scope.generateForm();
      }
    });

    // Watch in data change in country and papulating states
    $scope.$watch('settingGeneral.FormDetails[0].fields[9].value', function(newVal, oldVal) {
      if (typeof newVal !== undefined) {

        formData.states(newVal).then(function(data) {
          //console.log("states",data);
          $scope.states = data;
          $scope.settingGeneral.FormDetails[0].fields[10].options = $scope.states;
        });
      }
    });

    $scope.generateForm = function() {
      // params (category_code, entity_object, sm_group, sm_category)
      formData.getFormFor("GENERAL", "FACILITY").then(function(responseData) {
        // Modifing input type to autocomplete
        responseData.FormDetails[0].fields[9].type = "autocomplete";
        responseData.FormDetails[0].fields[10].type = "autocomplete";
        // Papulating Countries Field
        formData.countries().then(function(data) {
          responseData.FormDetails[0].fields[9].options = data;
        });

        $scope.settingGeneral = responseData;
      });
    }

    $scope.generateForm();




    $scope.addCommodity = function(index, data) {
      var dataCopy = angular.copy(data);
      $scope.settingGeneral.FormDetails[2].values.push(dataCopy);
    };

    $scope.removeCommodity = function(index) {
      $scope.settingGeneral.FormDetails[2].values.splice(index, 1);
    };

    // Full form summissions
    $scope.save = function() {
      $scope.generalForm.$error;
      if ($scope.generalForm.$invalid) {
        $scope.$broadcast('record:invalid');
      } else {
        $("#loadingWidget").fadeIn();
        formData.saveSettings($scope.settingGeneral).then(function(data) {
          if (data.process_status === 'FAILURE') {
            alert("Attn Dev \n" + data.message);
          } else if (data.process_status === 'SUCCESS') {
            formData.setFacilityId(data.facility_id);
            facilityListCache.removeAll();
            formData.getfacilities().then(function(responseData) {
              angular.forEach(responseData, function(value, key) {
                value.id = value.facility_id;
                value.parent = '#';
                value.text = value.facility_description;
                this.push(value);
              }, $rootScope.treeModel);

            });
            $state.go('admin.subview', {
              "subview": "tariff"
            });
          }
        });
      }

      console.log($scope.settingGeneral)
    };
  }
]);
