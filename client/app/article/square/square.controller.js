'use strict';

angular.module('colorboxApp')
  .controller('ArticleSquareCtrl', function ($scope, crud, $sce, $location, Auth) {

    $scope.labels = [
      {name: 'createDate', text: '最新'},
      {name: 'starsCount', text: '最热'}
    ];

    $scope.$watch(function(){
      var search = $location.search();
      return search.skip + "|" + search.sort;
    }, function(str){
      var search = $location.search();
      var user = Auth.getCurrentUser().name;

      $scope.currentLabel = search.sort || 'createDate';

      crud.articles.getAllArticles(search.skip, search.sort)
        .success(function(articles){
          $scope.articles = articles;
          angular.forEach(articles, function(n, i){
            n.hasStar = n.stars && user && (user in n.stars);
          });
        });
    });

    $scope.star = function(id, article){
      crud.articles.star(id)
        .success(function(s){
          article.hasStar = true;
          article.starsCount = s.starsCount;
        });
    };

    $scope.unstar = function(id, article){
      crud.articles.unstar(id)
        .success(function(s){
          article.hasStar = false;
          article.starsCount = s.starsCount;
        });
    };
  })

  .controller('ArticleSquarePaginationCtrl', function ($scope, crud, $sce, $location) {

    $scope.currentPage = 1;
    $scope.pageSize = 6;
    $scope.total = 0;
    $scope.change = function(){
      $location.search('skip', $scope.currentPage);
    };

    crud.articles.count()
      .success(function(data){
        $scope.total = data.count;
      });

    $scope.$watch(function(){return $location.search().skip;}, function(skip){
      $scope.currentPage = skip || 1;
    });
  });
