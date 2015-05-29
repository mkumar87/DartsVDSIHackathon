EnmanApp.value('FieldTypes', {
  text: ['Text', 'should be text'],
  email: ['Email', 'should be a valid email address'],
  number: ['Number', 'should be a number'],
  date: ['Date', 'should be a date'],
  datetime: ['DateTime', 'should be a datetime'],
  time: ['Time', 'should be a time'],
  month: ['Month', 'should be a month'],
  week: ['Week', 'should be week'],
  url: ['URL', 'should be a valid URL'],
  tel: ['Phone Number', 'should be a phone number'],
  color: ['Color', 'should be a color']
});

EnmanApp.value('TERMS', {
  "monthly": ["January", "Febrary", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"],
  "weekly": ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week"],
  "daily": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "quaterly": ["1st Quater", "2nd Quater", "3rd Quater", "4th Quater"],
  "halfyearly": ["1st Half", "2nd Half"]
});


EnmanApp.value('Months', [{
  "label": "January",
  "value": 0
}, {
  "label": "Febrary",
  "value": 1
}, {
  "label": "March",
  "value": 2
}, {
  "label": "April",
  "value": 3
}, {
  "label": "May",
  "value": 4
}, {
  "label": "June",
  "value": 5
}, {
  "label": "July",
  "value": 6
}, {
  "label": "Augest",
  "value": 7
}, {
  "label": "September",
  "value": 8
}, {
  "label": "October",
  "value": 9
}, {
  "label": "November",
  "value": 10
}, {
  "label": "December",
  "value": 11
}]);

EnmanApp.value('Seasons', [{
  "label": "Spring",
  "value": 0
}, {
  "label": "Summer",
  "value": 1
}, {
  "label": "Winter",
  "value": 2
}]);

EnmanApp.value('Days', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

EnmanApp.value('plotChartOption', {
  "type": "serial",
  "categoryField": "key",
  "categoryAxis": {
    //"parseDates" : true,
    "minPeriod" : "hh",
    "gridPosition": "start",
    "axisAlpha": 0,
    "tickLength": 0
  },
  "graphs": [{
    "fillAlphas": 1,
    "type": "column",
    "valueField": "value"
  }],
  "chartCursor": {
    "oneBalloonOnly": true,
    "categoryBalloonDateFormat": "YYYY-MM-DD JJ:NN:SS"
  },
  "responsive": {
    "enabled": true
  },
  "dataDateFormat": "YYYY-MM-DD JJ:NN:SS"
});

EnmanApp.directive('gcurvRatemapper', function(Months, Seasons, Days, $window, $document) {
  return {
    restrict: 'EA',
    templateUrl: '/views/directives/gcurv-ratemapper.html',
    requires: '^ngModel',
    scope: {
      reqOptions: '=',
      tariffPattern: '='
    },
    controller: function($scope, $element) {

      $scope.selectedTariff = {};
      $scope.selectedTariffIndex = 0;

      $scope.moveLeft = function() {
        //console.log($scope.SelectedMonth);
        if ($scope.SelectedMonth.value > 0) {
          $scope.SelectedMonth = $scope.blockOptions[$scope.SelectedMonth.value - 1];
        }
      };

      $scope.moveRight = function() {
        //console.log($scope.SelectedMonth);
        if ($scope.SelectedMonth.value < $scope.blockOptions.length - 1) {
          $scope.SelectedMonth = $scope.blockOptions[$scope.SelectedMonth.value + 1];
        }
      };

      $scope.selectedBlock = function($event, selected, index) {

        $scope.selectedTariff = selected;
        $scope.selectedTariffIndex = index;
        var el = $event.currentTarget;
      };

      $scope.applySelected = function(block, day, hr) {

        $scope.reqOptions.HourlyTariffValues[parseInt(block)].HourBlockMapping[parseInt(day)][parseInt(hr)] = {
          "BlockName": $scope.selectedTariff.BlockName,
          "BlockColor": $scope.selectedTariff.BlockColor,
        };
        //var el = $event.currentTarget;
        //el.style.color = $scope.selectedTariff.color;
      };


      // drag and select
      var startCell = null;
      var dragging = false;

      function mouseUp(el) {
        dragging = false;
      }

      function mouseDown(el) {
        dragging = true;
        setStartCell(el);
        setEndCell(el);
      }

      function mouseEnter(el) {
        if (!dragging) return;
        setEndCell(el);
      }

      function setStartCell(el) {
        startCell = el;
      }

      function setEndCell(el) {
        cellsBetween(startCell, el).each(function() {
          var el = angular.element(this);
          var params = el.attr('class').split('-');
          $scope.applySelected(parseInt(params[0]), parseInt(params[1]), parseInt(params[2]));
        });
      }

      function cellsBetween(start, end) {
        var coordsStart = getCoords(start);
        var coordsEnd = getCoords(end);
        var topLeft = {
          column: $window.Math.min(coordsStart.column, coordsEnd.column),
          row: $window.Math.min(coordsStart.row, coordsEnd.row),
        };
        var bottomRight = {
          column: $window.Math.max(coordsStart.column, coordsEnd.column),
          row: $window.Math.max(coordsStart.row, coordsEnd.row),
        };

        return $element.find('.selectable').filter(function() {
          var el = angular.element(this);
          var coords = getCoords(el);
          return coords.column >= topLeft.column && coords.column <= bottomRight.column && coords.row >= topLeft.row && coords.row <= bottomRight.row;
        });
      }

      function getCoords(cell) {
        var row = cell.parents('row');
        return {
          column: cell[0].cellIndex,
          row: cell.parent()[0].rowIndex
        };
      }

      function wrap(fn) {
        return function() {
          var el = angular.element(this);
          $scope.$apply(function() {
            fn(el);
          });
        }
      }

      $element.delegate('.selectable', 'mousedown', wrap(mouseDown));
      $element.delegate('.selectable', 'mouseenter', wrap(mouseEnter));
      $document.delegate('body', 'mouseup', wrap(mouseUp));


    },
    link: function($scope, elem, attrs, ngModel) {
      switch ($scope.tariffPattern) {
        case "monthly":
          $scope.blockOptions = Months;
          $scope.nav = true;
          break;
        case "seasons":
          $scope.blockOptions = Seasons;
          $scope.nav = true;
          break;

        default:
          $scope.blockOptions = [{
            "label": "Yearly",
            "value": 0
          }];
          $scope.nav = false;
          break;
      };
      $scope.SelectedMonth = $scope.blockOptions[0];
      $scope.days = Days;
    }
  };
});



EnmanApp.directive('gcurvBasicField', function(FieldTypes) {
  return {
    restrict: 'EA',
    replace: false,
    templateUrl: '/views/directives/gcurv-basic-field.html',
    scope: {
      fieldDtl: '='
    },
    controller: function($scope, $element) {
      // Datepicker requiredments
      $scope.open = function($event) {
        $event.stopPropagation();
        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
    },
    link: function($scope, elem, attrs, $index) {
      $scope.$on('record:invalid', function() {
        //console.log( $scope[$scope.fieldDtl.name]);
        $scope[$scope.fieldDtl.name].$setDirty();

      });
      $scope.types = FieldTypes;
    }
  };
});


EnmanApp.directive('gcurvWidgetChart', function(dashboardServices, plotChartOption) {
  return {
    restrict: 'EA',
    replace: false,
    templateUrl: '/views/directives/gcurv-widget-chart.html',
    scope: {
      widgetEdit: '=',
      widgetLists: '=',
      widget: '=',
      widgetPosition: '=',
      dropdownConfigs: '='
    },
    controller: function($scope, $element, $modal) {
      $scope.getWidget = function(){
      dashboardServices.getWidget($scope.widget.WidgetId).then(function(res) {
        $scope.widgetChartData = res.data;
        $scope.widgetConfig = $scope.widgetChartData.widget_config;
        $scope.widgetData = $scope.widgetChartData.widget_data;
        $scope.widgetType = $scope.widgetConfig.widgetType;
        console.log($scope.widgetChartData.widget_config.widgetTitle, $scope.widgetChartData);
        if ($scope.widgetType === "CONSUMPTION_PLOT" || $scope.widgetType === "COST_PLOT") {
          var currentChartData = [];
          if (!$.isEmptyObject($scope.widgetData) && $scope.widgetData.CurrentPlotData.label.length > 0) {
            for (var i = 0; i < $scope.widgetData.CurrentPlotData.label.length; i++) {
              currentChartData.push({
                "key": $scope.widgetData.CurrentPlotData.label[i],
                "value": $scope.widgetData.CurrentPlotData.value[i],
              });
            }
          }else{
            alert("No data Availability for "+$scope.widgetChartData.widget_config.widgetTitle);
          }
          $scope.chartOptions = plotChartOption;
          $scope.chartOptions.data = currentChartData;
        }
      });
    }
    $scope.getWidget();

      $scope.editWidget = function(widget_id) {
        $("#loadingWidget").fadeIn();
        dashboardServices.editWidget("WIDGET_GENERAL", "WIDGET", widget_id).then(function(data) {
          $scope.widgetFormFields = data;
          $scope.widgetEditForm("lg", widget_id)
        });
      };

      $scope.widgetEditForm = function(size) {
        var modalInstance = $modal.open({
          templateUrl: 'addWidget.html',
          controller: 'addWidgetCtrl',
          size: size,
          resolve: {
            widgetFormFields: function() {
              return $scope.widgetFormFields;
            },
            dropdownconfigs: function() {
              return $scope.dropdownConfigs;
            }
          }
        });

        modalInstance.result.then(function(result) {
          $("#loadingWidget").fadeIn('fast');
          $scope.widgetFormFields = result;

          dashboardServices.addWidget($scope.widgetFormFields).then(function(resData) {
            //console.log("Edit widget Id :", resData.data.widget_id);
            if (resData.data.process_status === "SUCCESS") {
              $scope.getWidget();
            } else {
              alert("Something went wrong, Try Again!!")
            }
          });
        });
      };

      $scope.refreshWidget = function() {
        $scope.getWidget();
      }

      $scope.deleteWidget = function(wid, widgetPosition) {
        // Loader
        $("#loadingWidget").fadeIn();
        dashboardServices.deleteWidget("WIDGET", wid).then(function(data) {
          console.log(data);
          $scope.widgetLists.splice(widgetPosition, 1);
        });
      }

    },
    link: function($scope, elem, attrs) {}
  };
});
