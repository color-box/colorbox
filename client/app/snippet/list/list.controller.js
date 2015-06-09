'use strict';

angular.module('colorboxApp')
  .controller('SnippetListCtrl', function ($scope, crud, $sce, $location) {
    $scope.$watch(function(){return $location.search().skip;}, function(skip) {
      getSnippets(skip);
    });

    $scope.del = function(id){
      if(!confirm('确认删除片段' + id)) return;
      crud.snippets.del(id)
        .success(function(){
          var skip = $location.search().skip || 1;
          if($scope.snippets.length === 1 && skip !== 1){
            $location.search('skip', skip - 1);
          }
          getSnippets(skip);
        });
    };

    $scope.publish = function(snippet){
      crud.snippets.publish(snippet._id)
        .success(function(){
          snippet.publish = true;
        });
    };

    function getSnippets(skip){
      $scope.loading = true;
      crud.snippets.getSnippets(skip)
        .success(function (snippets) {
          $scope.snippets = snippets;
          angular.forEach(snippets, function (n, i) {
            n.preview = $sce.trustAsResourceUrl('/api/snippets/thumbnail/' + n._id);
          });
        })
        .then(function(){
          $scope.loading = false;
        });
    }
  })

  .controller('SnippetListPaginationCtrl', function ($scope, crud, $sce, $location) {
    $scope.currentPage = 1;
    $scope.pageSize = 6;
    $scope.total = 0;
    $scope.change = function(){
      $location.search('skip', $scope.currentPage);
    };

    crud.snippets.countByUser()
      .success(function(data){
        $scope.total = data.count;
      });

    $scope.$watch(function(){return $location.search().skip;}, function(skip){
      $scope.currentPage = skip || 1;
    });
  });
