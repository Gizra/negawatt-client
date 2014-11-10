'use strict';

/**
 * Dashboard controller.
 */
angular.module('app')
  .controller('DashboardCtrl', function ($scope, Account, Meter, Electricity, ChartLine, Utils, $filter) {
    // Initialization need by the leaflet directive.
    $scope.center = {};
    $scope.events = {};

    // Get initial data from server.
    Account.getAccount()
      .then(function(response) {
        $scope.account = response.data;

        // Center of the map, according the account.
        $scope.center = $scope.account.location;

        Meter.get().then(function(response) {
          $scope.meters = response.data;

          // Load the total of consumption of the markers in the map.
          Electricity.get()
            .then(ChartLine.getLineChartTotals)
            .then(function(response) {
              $scope.line = {
                data: response.data,
                options: response.options
              };
            });

        });

      });

    // Observers.
    $scope.$on('leafletDirectiveMarker.click', function(event, args){
      $scope.meterSelected = $scope.meters[args.markerName];
      $scope.$broadcast('negawatt.markerSelected', $scope.meterSelected);
    });

    $scope.$on('negawatt.account.loaded', function(event, account) {
      $scope.account = account;
    });

    $scope.$on('negawatt.category.filterBy', function(event, id) {
      //$scope.meters = Meter.filterBy(id, $scope.meters);
      //console.log('$on negawatt.menu.filterBy: ', id, Utils.toArray($scope.meters), $filter('filter')(Utils.toArray($scope.meters), {meter_code: 442}));
      console.log('$on negawatt.menu.filterBy: ', id, $scope.meters, Meter.filterBy(id, $scope.meters));
    });

  });
