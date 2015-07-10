'use strict';

angular.module('colorboxApp')
  .controller('ArticleListCtrl', function ($scope, crud, $location) {
    $scope.$watch(function(){return $location.search().skip;}, function(skip) {
      getArticles(skip);
    });

    $scope.del = function(id, name){
      if(!confirm('确认删除文档：' + name)) return;
      crud.articles.del(id)
        .success(function(){
          var skip = $location.search().skip || 1;
          if($scope.articles.length === 1 && skip !== 1){
            $location.search('skip', skip - 1);
          }
          getArticles(skip);
        });
    };

    $scope.publish = function(article){
      crud.articles.publish(article._id)
        .success(function(){
          article.publish = true;
        });
    };

    function getArticles(skip){
      $scope.loading = true;
      crud.articles.getArticles(skip)
        .success(function (articles) {
          $scope.articles = articles;
        })
        .then(function(){
          $scope.loading = false;
        });
    }
  })

  .controller('ArticleListPaginationCtrl', function ($scope, crud, $sce, $location) {
    $scope.currentPage = 1;
    $scope.pageSize = 6;
    $scope.total = 0;
    $scope.change = function(){
      $location.search('skip', $scope.currentPage);
    };

    crud.articles.countByUser()
      .success(function(data){
        $scope.total = data.count;
      });

    $scope.$watch(function(){return $location.search().skip;}, function(skip){
      $scope.currentPage = skip || 1;
    });
  });
