'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/user/:user', '/user/:user/timeline');

    $stateProvider
      .state('user', {
        url: '/user/:user',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      })
      .state('user.timeline', {
        url: '/timeline',
        views: {
          '': {
            templateUrl: 'app/timeline/timeline.html',
            controller: 'TimelineCtrl'
          }
        }
      })
      .state('user.articles', {
        url: '/articles',
        views: {
          '': {
            templateUrl: 'app/article/user/user.html',
            controller: 'ArticleUserCtrl'
          }
        }
      })
      .state('user.snippets', {
        url: '/snippets',
        views: {
          '': {
            templateUrl: 'app/snippet/user/user.html',
            controller: 'SnippetUserCtrl'
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
