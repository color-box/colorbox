'use strict';

angular.module('colorboxApp')
  .controller('SnippetViewCtrl', function($scope, $location, $sce, crud, Auth, $cookieStore, $modal){
    var id = $location.search()._id;
    var user = Auth.getCurrentUser().name;
    var record = $cookieStore.get('viewRecord') || '';

    $scope.preview = $sce.trustAsResourceUrl('/api/snippets/preview/' + id);

    if(record.indexOf(id) < 0) {
      crud.snippets.view(id)
        .success(function () {
          $cookieStore.put('viewRecord', record  + ',' + id);
        });
    }

    crud.snippets.get(id)
      .success(function(snippet){
        snippet.hasStar = snippet.stars && (user in snippet.stars);
        $scope.snippet = snippet;
      });

    $scope.star = function(id, snippet){
      crud.snippets.star(id)
        .success(function(s){
          snippet.stars = s.stars;
          snippet.hasStar = true;
          snippet.starsCount = s.starsCount;
        });
    };

    $scope.unstar = function(id, snippet){
      crud.snippets.unstar(id)
        .success(function(s){
          snippet.stars = s.stars;
          snippet.hasStar = false;
          snippet.starsCount = s.starsCount;
        });
    };

    $scope.open = function () {
      var modalInstance = $modal.open({
        templateUrl: 'snippet-comments',
        controller: 'SnippetViewDialogCtrl',
        size: 'lg',
        resolve: {
          data: function(){
            return {snippet: $scope.snippet};
          }
        }
      });
    };
  })

  .controller('SnippetViewDialogCtrl', function($scope, crud, $modalInstance, data){
    $scope.snippet = data.snippet;

    $scope.$on('$stateChangeStart', function(){
      $scope.cancel();
    });

    // 评论
    $scope.comment = function(data){
      return crud.snippets.comment($scope.snippet._id, data);
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.star = function(id, snippet){
      crud.snippets.star(id)
        .success(function(s){
          snippet.stars = s.stars;
          snippet.hasStar = true;
          snippet.starsCount = s.starsCount;
        });
    };

    $scope.unstar = function(id, snippet){
      crud.snippets.unstar(id)
        .success(function(s){
          snippet.stars = s.stars;
          snippet.hasStar = false;
          snippet.starsCount = s.starsCount;
        });
    };
  });
