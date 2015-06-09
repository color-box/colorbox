'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('articleSquare', {
        url: '/article/square',
        templateUrl: 'app/article/square/square.html',
        controller: 'ArticleSquareCtrl'
      })
      .state('articleEdit', {
        url: '/article/edit',
        templateUrl: 'app/article/edit/edit.html',
        controller: 'ArticleEditCtrl',
        authenticate: true
      })
      .state('articleView', {
        url: '/article/view',
        templateUrl: 'app/article/view/view.html',
        controller: 'ArticleViewCtrl'
      });
  });
