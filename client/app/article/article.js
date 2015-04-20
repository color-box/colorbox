'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('edit', {
        url: '/article/edit',
        templateUrl: 'app/article/edit/edit.html',
        controller: 'ArticleEditCtrl'
      })
      .state('list', {
        url: '/article/list',
        templateUrl: 'app/article/list/list.html',
        controller: 'ArticleListCtrl'
      });
  });
