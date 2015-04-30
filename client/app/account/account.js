'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/profile', '/profile/snippets')

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/account/profile/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('profile.articles', {
        url: '/articles',
        views: {
          '': {
            templateUrl: 'app/article/list/list.html',
            controller: 'ArticleListCtrl'
          }
        }
      })
      .state('profile.snippets', {
        url: '/snippets',
        views: {
          '': {
            templateUrl: 'app/snippet/list/list.html',
            controller: 'SnippetListCtrl'
          }
        }
      });
  });
