'use strict';

angular.module('colorboxApp')
  .controller('UserCtrl', function ($scope, $state, crud, $sce) {
    $scope.currentUser = $state.params.user;
    $scope.tabs = [
      {name: 'timeline', text: '时间轴'},
      {name: 'snippets', text: '代码片段'},
      {name: 'articles', text: '文档'},
      //{name: 'notes', text: '笔记'}
    ];

    $scope.isActive = function(name){
      return $state.includes('user.' + name);
    };

    crud.settings.get($scope.currentUser)
      .success(function(settings){
        $scope.settings = settings;
        if(settings) {
          $scope.settings.preview = $sce.trustAsResourceUrl('/api/snippets/preview/' + settings.code);
        }
      });
  });
