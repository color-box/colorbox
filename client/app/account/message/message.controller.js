'use strict';

angular.module('colorboxApp')
  .controller('MessageCtrl', function ($scope, crud, $location, $rootScope) {
    $scope.read = function(message){
      var data = {_id: message._id, read: true};

      crud.messages.save(data)
        .success(function(){
          message.read = true;
          $rootScope.read();
        });
    };

    $scope.readAll = function(){
      crud.messages.readAll()
        .success(function(){
          $rootScope.getUnreadCount();
          $scope.messages.forEach(function(n){
            n.read || (n.read = true);
          });
        });
    };

    $scope.$watch(function(){return $location.search().skip;}, function(skip) {
      getMessages(skip);
    });

    function getMessages(skip) {
      $scope.loading = true;
      crud.messages.list(skip)
        .success(function (messages) {
          $scope.messages = messages;
        })
        .then(function(){
          $scope.loading = false;
        });
    }
  })

  .controller('MessagePaginationCtrl', function ($scope, crud, $sce, $location) {
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.total = 0;
    $scope.change = function(){
      $location.search('skip', $scope.currentPage);
    };

    crud.messages.count()
      .success(function(data){
        $scope.total = data.count;
      });

    $scope.$watch(function(){return $location.search().skip;}, function(skip){
      $scope.currentPage = skip || 1;
    });
  });
