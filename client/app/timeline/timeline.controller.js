'use strict';

angular.module('colorboxApp')
  .controller('TimelineCtrl', function ($scope, crud, $sce, $state, Auth) {
    var user = $state.params.user;
    var loginUser = Auth.getCurrentUser().name;

    $scope.skip = 1;
    $scope.records = [];
    $scope.showMore = true;

    $scope.star = function(id, item, type){
      crud[type + 's'].star(id)
        .success(function(s){
          item.hasStar = true;
          item.starsCount = s.starsCount;
        });
    };

    $scope.unstar = function(id, item, type){
      crud[type + 's'].unstar(id)
        .success(function(s){
          item.hasStar = false;
          item.starsCount = s.starsCount;
        });
    };

    $scope.toggleComment = function(item){
      if($scope.commenting === item._id){
        $scope.commenting = null;
      }else{
        $scope.commenting = item._id;
      }
    };

    $scope.comment = function(data, type, id){
      return crud[type + 's'].comment(id, data);
    };

    $scope.getTimelines = function getTimelines(skip) {
      skip && ($scope.skip = skip);
      $scope.loading = true;
      crud.timelines.list(user, $scope.skip)
        .success(function(records){
          $scope.records.push.apply($scope.records, records);

          if(records.length < 6){
            $scope.showMore = false;
          }

          angular.forEach(records, function(n){
            getDetail(n);
          });
          $scope.loading = false;
        })
    }

    function getDetail(record){
      var table = 'snippets';

      if(record.type === 'article'){
        table = 'articles';
      }

      crud[table].get(record.id)
        .success(function(item){
          record.item = item;
          item.hasStar = item.stars && loginUser && (loginUser in item.stars);
          if(record.type === 'snippet') {
            item.preview = $sce.trustAsResourceUrl('/api/snippets/thumbnail/' + item._id);
          }
        });
    }

    $scope.getTimelines();
  });
