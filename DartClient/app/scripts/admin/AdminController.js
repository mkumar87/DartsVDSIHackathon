(function() {
  "use strict";
  EnmanApp.controller('AdminController', ['$rootScope','$scope', '$state', '$modal', '$filter', '$q', 'formData',
    function($rootScope, $scope, $state, $modal, $filter, $q, formData) {
      $scope.facilityEditID = false;
      $("#loadingWidget").fadeIn();

      formData.getCategoryList({sm_category: 'FACILITY_SETTINGS', sm_group: 'CATEGORY'})
      .then(function(responseData) {
        $scope.settingTabs = responseData;
        console.log("setting wizard menu :", responseData);
      });

      $rootScope.treeModel = [];
      formData.getfacilities().then(function(responseData) {
        angular.forEach(responseData, function(value, key) {
          value.id = value.facility_id;
          value.parent = '#';
          value.text = value.facility_description;
          this.push(value);
        }, $rootScope.treeModel);
      });


      // Adding Tree View
      $scope.treeTitle = "Newell Rubbermaid";

      $scope.typesConfig = {
        "default": {
          "icon": "glyphicon glyphicon-cog"
        }
      };

      // Edit on select Tree node
      $scope.selectedCB = function(e, data) {
        //console.log("selected Facility", data.node);
        $("#loadingWidget").fadeIn();
        $scope.selectedNode = data;
        $scope.facilityEditId = formData.setFacilityId(data.node.id);
        $state.go('admin.subview', {
          "subview": "general"
        });

        $scope.configFor = angular.uppercase(data.node.text);
      }


      // Create New Facility
      $scope.newFacility = function() {
        $("#loadingWidget").fadeIn();
        $scope.facilityEditId = formData.setFacilityId("0");
        //console.log($scope.treeModel);
        $(".jstree #"+$scope.selectedNode.node.id+" .jstree-wholerow").removeClass("jstree-wholerow-clicked");
        $state.go('admin.subview', {
          "subview": "general"
        });
        $scope.configFor = angular.uppercase('New');
      };


      // deleted Selected facility
      $scope.deleteSelected = function() {
        $("#loadingWidget").fadeIn();
        formData.deleteFacility($scope.selectedNode.node.id).then(function(responseData) {
          console.log("deleted", responseData);
          if (responseData.msg === "ok") {
            //reset facility id to false
            $scope.facilityEditId = formData.setFacilityId("0");
            // Reload facilities
            facilityListCache.removeAll();
            formData.getfacilities().then(function(responseData) {
              angular.forEach(responseData, function(value, key) {
                value.id = value.facility_id;
                value.parent = '#';
                value.text = value.facility_description;
                this.push(value);
              },$rootScope.treeModel);
            });

            $state.reload();
          }
        });
      };


      $scope.detroySelected = function() {
        //console.log("Selected", $scope.selectedNode);
        $scope.modalMessage.modalTitle = 'Are You Sure ?';
        $scope.modalMessage.bodyText = 'Do want delete following facilitie?';

        var temp = [];
        angular.forEach($scope.selectedNode.selected, function(value, key) {
          var filteredList = $filter('filter')($scope.treeModel, {
            id: value
          }, 'strict');
          // Store Expected match
          temp.push(filteredList[0]);
        });

        $scope.modalMessage.items = temp;
        $scope.open('sm');
      };



      //Alert
      $scope.modalConfirmation = false;
      $scope.open = function(size) {

        var deferred = $q.defer();
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            modalMessage: function() {
              return $scope.modalMessage;
            }
          }
        });

        modalInstance.result.then(function(result) {
          if (result) {
            $scope.deleteSelected();
          }
        });
      };

      // confirm Modal message
      $scope.modalMessage = {};
      $scope.closepop = function() {
        $scope.isClosed = true;
      };
    }
  ]);

  EnmanApp.controller('ModalInstanceCtrl', function($scope, $modalInstance, modalMessage) {

    $scope.modalMessage = modalMessage;

    $scope.ok = function() {
      $scope.modalMessage.confirm = true;
      $modalInstance.close($scope.modalMessage.confirm);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });

}());
