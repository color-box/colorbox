'use strict';

angular.module('colorboxApp')
  .controller('ArticleUserCtrl', function ($scope, crud, $sce, $location, $state, Auth) {
    var user = $state.params.user;
    var loginUser = Auth.getCurrentUser().name;

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

    $scope.$watch(function(){return $location.search().skip;}, function(skip) {
      getarticles(skip);
    });

    function getarticles(skip){
      $scope.loading = true;
      crud.articles.getPublicArticlesByUser(user, skip)
        .success(function (articles) {
          $scope.articles = articles;
          angular.forEach(articles, function(n, i){
            n.hasStar = n.stars && loginUser && (loginUser in n.stars);
          });
        })
        .then(function(){
          $scope.loading = false;
        });
    }
  })

  .controller('ArticleUserPaginationCtrl', function ($scope, crud, $location, $state) {
    var user = $state.params.user;

    $scope.currentPage = 1;
    $scope.pageSize = 6;
    $scope.total = 0;
    $scope.change = function(){
      $location.search('skip', $scope.currentPage);
    };

    crud.articles.publicCountByUser(user)
      .success(function(data){
        $scope.total = data.count;
      });

    $scope.$watch(function(){return $location.search().skip;}, function(skip){
      $scope.currentPage = skip || 1;
    });
  });
