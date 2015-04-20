'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('snippetEdit', {
        url: '/snippet/edit',
        templateUrl: 'app/snippet/edit/edit.html',
        controller: 'SnippetEditCtrl'
      });
  });
