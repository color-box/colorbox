'use strict';

angular.module('colorboxApp')
  .controller('ProfileCtrl', function ($scope, Auth, $state) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.$state = $state;
  });
