'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('articleEdit', {
        url: '/article/edit',
        templateUrl: 'app/article/edit/edit.html',
        controller: 'ArticleEditCtrl'
      })
      .state('articleList', {
        url: '/article/list',
        templateUrl: 'app/article/list/list.html',
        controller: 'ArticleListCtrl'
      });
  });
