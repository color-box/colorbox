'use strict';

angular.module('colorboxApp')
  .controller('SnippetUserCtrl', function ($scope, crud, $sce, $location, $state, Auth) {
    var user = $state.params.user;
    var loginUser = Auth.getCurrentUser().name;

    $scope.star = function(id, snippet){
      crud.snippets.star(id)
        .success(function(s){
          snippet.hasStar = true;
          snippet.starsCount = s.starsCount;
        });
    };

    $scope.unstar = function(id, snippet){
      crud.snippets.unstar(id)
        .success(function(s){
          snippet.hasStar = false;
          snippet.starsCount = s.starsCount;
        });
    };

    $scope.$watch(function(){return $location.search().skip;}, function(skip) {
      getSnippets(skip);
    });

    function getSnippets(skip){
      $scope.loading = true;
      crud.snippets.getPublicSnippetsByUser(user, skip)
        .success(function (snippets) {
          $scope.snippets = snippets;
          angular.forEach(snippets, function (n, i) {
            n.preview = $sce.trustAsResourceUrl('/api/snippets/thumbnail/' + n._id);
            n.hasStar = n.stars && loginUser && (loginUser in n.stars);
          });
        })
        .then(function(){
          $scope.loading = false;
        });
    }
  })

  .controller('SnippetUserPaginationCtrl', function ($scope, crud, $location, $state) {
    var user = $state.params.user;

    $scope.currentPage = 1;
    $scope.pageSize = 6;
    $scope.total = 0;
    $scope.change = function(){
      $location.search('skip', $scope.currentPage);
    };

    crud.snippets.publicCountByUser(user)
      .success(function(data){
        $scope.total = data.count;
      });

    $scope.$watch(function(){return $location.search().skip;}, function(skip){
      $scope.currentPage = skip || 1;
    });
  });
