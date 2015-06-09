'use strict';

angular.module('colorboxApp')
  .controller('UserCtrl', function ($scope, $state) {
    $scope.currentUser = $state.params.user;
    $scope.tabs = [
      {name: 'snippets', text: '代码片段'},
      {name: 'articles', text: '文档'},
      {name: 'notes', text: '笔记'}
    ];

    $scope.isActive = function(name){
      return $state.includes('user.' + name);
    };
  });
