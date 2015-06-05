'use strict';

angular.module('colorboxApp')
  .controller('MainCtrl', function ($scope, crud) {

    crud.articles.getAllArticles()
      .success(function(articles){
        $scope.articles = articles;
      });

    crud.snippets.getAllSnippets()
      .success(function(snippets){
        $scope.snippets = snippets;
      });
  });
