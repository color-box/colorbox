'use strict';

angular.module('colorboxApp')
  .controller('LoginCtrl', function ($scope, Auth, $location,$rootScope) {
    $scope.first = true;
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
          $rootScope.getUnreadCount();
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
