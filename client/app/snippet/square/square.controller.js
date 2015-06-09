'use strict';

angular.module('colorboxApp')
  .controller('SnippetSquareCtrl', function ($scope, crud, $sce, $location, Auth) {

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

      crud.snippets.getAllSnippets(search.skip, search.sort)
        .success(function(snippets){
          $scope.snippets = snippets;
          angular.forEach(snippets, function(n, i){
            n.preview = $sce.trustAsResourceUrl('/api/snippets/thumbnail/' + n._id);
            n.hasStar = n.stars && user && (user in n.stars);
          });
        });
    });

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
  })

.controller('SnippetSquarePaginationCtrl', function ($scope, crud, $sce, $location) {

  $scope.currentPage = 1;
  $scope.pageSize = 6;
  $scope.total = 0;
  $scope.change = function(){
    $location.search('skip', $scope.currentPage);
  };

  crud.snippets.count()
    .success(function(data){
      $scope.total = data.count;
    });

  $scope.$watch(function(){return $location.search().skip;}, function(skip){
    $scope.currentPage = skip || 1;
  });
});
