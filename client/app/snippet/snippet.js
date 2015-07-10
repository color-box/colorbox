'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('snippetSquare', {
        url: '/snippet/square',
        templateUrl: 'app/snippet/square/square.html',
        controller: 'SnippetSquareCtrl'
      })
      .state('snippetEdit', {
        url: '/snippet/edit',
        templateUrl: 'app/snippet/edit/edit.html',
        controller: 'SnippetEditCtrl'
      })
      .state('snippetView', {
        url: '/snippet/view',
        templateUrl: 'app/snippet/view/view.html',
        controller: 'SnippetViewCtrl'
      });
  });
