'use strict';

angular.module('colorboxApp')
  .controller('SnippetEditCtrl', function ($scope, $modal, $location, crud, $sce) {
    var preview = '';

    $scope.layoutConfig = {
      direction: 'y',
      minSize: 10,
      animateClass: 'animate',
      boxs: [
        {id: 2, parentId: 1, template: 'snippet-html', title: 'html'},
        {id: 3, parentId: 1, template: 'snippet-css', title: 'css'},
        {id: 5, parentId: 1, template: 'snippet-javascript', title: 'javascript'},
        {id: 6, parentId: 4, template: 'snippet-result', title: 'result'},
        {id: 1},
        {id: 4}
      ],
      onResize: function(){
        $scope.$broadcast('resizeUpdate');
      }
    };

    //隐藏显示区块
    $scope.toggleBlock = function(i){
      var id = $scope.layoutConfig.boxs[i].id;
      var box = $scope.splitBox.find('id', id);
      var hide = !$scope.layoutConfig.boxs[i].isHide;

      if(hide){
        var show = 0;
        angular.forEach($scope.layoutConfig.boxs, function(n){
          if(!n.isHide && n.id !== 1) show++;
        });
        if(show <= 1) return;
      }

      $scope.layoutConfig.boxs[i].isHide = hide;
      box.hide(hide);
      $scope.$broadcast('resizeUpdate');
    };

    $scope.reloadIframe = function(){
      $scope.preview = preview + '?t=' + new Date().getTime();
    };

    $scope.open = function () {
      var modalInstance = $modal.open({
        templateUrl: 'snippet-detail',
        controller: 'SnippetDetailCtrl',
        size: 'lg',
        resolve: {
          data: function(){
            return {name: $scope.snippet.name, desc: $scope.snippet.desc};
          }
        }
      });

      modalInstance.result.then(function(data){
        if(data){
          angular.extend($scope.snippet, data);
          data._id = $scope.snippet._id;
          crud.snippets.save(data);
        }
      });
    };

    if(!$location.search()._id){
      crud.snippets.add({})
        .success(function(snippet){
          $scope.snippet = snippet;
          preview = $sce.trustAsResourceUrl('/api/snippets/preview/' + snippet._id);
          $scope.open();
        });
    }else{
      crud.snippets.get($location.search()._id)
        .success(function(snippet){
          $scope.snippet = snippet;
          preview = $sce.trustAsResourceUrl('/api/snippets/preview/' + snippet._id);
          $scope.reloadIframe();
        });
    }

    $scope.$on('editorSaving', function($event, type, content){
      var data = {_id: $scope.snippet._id };
      data[type] = {content: content, mode: $scope.snippet[type].mode};
      crud.snippets.save(data)
        .success(function(){
          $scope.$broadcast('editorSaved:' + type);
          $scope.reloadIframe();
        });
    });
  })

  .controller('SnippetDetailCtrl', function($scope, $modalInstance, data){
    $scope.data = data;

    $scope.submit = function(){
      $modalInstance.close($scope.data);
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    };
  });
