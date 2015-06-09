'use strict';

angular.module('colorboxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('noteSquare', {
        url: '/note/square',
        templateUrl: 'app/note/square/square.html',
        controller: 'NoteSquareCtrl'
      })
      .state('noteEdit', {
        url: '/note/edit',
        templateUrl: 'app/note/edit/edit.html',
        controller: 'NoteEditCtrl',
        authenticate: true
      })
      .state('noteView', {
        url: '/note/view',
        templateUrl: 'app/note/view/view.html',
        controller: 'NoteViewCtrl'
      });;
  });
