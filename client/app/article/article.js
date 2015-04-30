'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('articleEdit', {
        url: '/article/edit',
        templateUrl: 'app/article/edit/edit.html',
        controller: 'ArticleEditCtrl',
        authenticate: true
      });
  });
