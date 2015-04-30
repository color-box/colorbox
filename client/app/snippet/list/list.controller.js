'use strict';

angular.module('colorboxApp')
  .controller('SnippetListCtrl', function ($scope, crud) {
    crud.snippets.getSnippets()
      .success(function(snippets){
        $scope.snippets = snippets;
      });
  });
