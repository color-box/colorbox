'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/user/:user', '/user/:user/snippets');

    $stateProvider
      .state('user', {
        url: '/user/:user',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      })
      .state('user.articles', {
        url: '/articles',
        views: {
          '': {
            templateUrl: 'app/article/list/list.html',
            controller: 'ArticleListCtrl'
          }
        }
      })
      .state('user.snippets', {
        url: '/snippets',
        views: {
          '': {
            templateUrl: 'app/snippet/list/list.html',
            controller: 'SnippetListCtrl'
          }
        }
      })
      .state('user.notes', {
        url: '/notes',
        views: {
          '': {
            templateUrl: 'app/note/list/list.html',
            controller: 'NoteListCtrl'
          }
        }
      });
  });
