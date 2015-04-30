'use strict';

angular.module('colorboxApp')
  .controller('ArticleListCtrl', function ($scope, crud) {
    crud.articles.getArticles()
      .success(function(articles){
        $scope.articles = articles;
      });
  });
