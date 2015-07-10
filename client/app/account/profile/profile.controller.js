'use strict';

angular.module('colorboxApp')
  .controller('ProfileCtrl', function ($scope, Auth, $state) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.tabs = [
      {name: 'snippets', text: '代码片段'},
      {name: 'articles', text: '文档'},
      //{name: 'notes', text: '笔记'}
    ]

    $scope.isActive = function(name){
      return $state.includes('profile.' + name);
    }
  });
