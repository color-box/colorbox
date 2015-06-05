'use strict';

angular.module('colorboxApp')
  .controller('ArticleViewCtrl', function ($scope, crud, $location) {
    $scope.currentFile = {};
    $scope.defaultName = '未命名';
    var layoutConfig =
    $scope.layoutConfig = {
      direction: 'y',
      barWidth: 10,
      minSize: 10,
      animateClass: 'animate',
      boxs: [
        {id: 3, parentId: 1, template: 'article-view-list', title: '列表', size: 20, isHide: false},
        {id: 2, parentId: 1, template: 'article-preview', title: '预览', size: 80, isHide: false}
      ]
    };

    //获取文档列表
    crud.articles.getAllArticles()
      .success(function(articles){
        $scope.files = articles;
      });

    if($location.search()._id){
      crud.articles.get($location.search()._id)
        .success(function(article){
          $scope.currentFile = article;
          $scope.html = $scope.currentFile.content;
          if($scope.files){
            for(var i = 0, len = $scope.files.length; i < len; i++){
              if($scope.files[i]._id === $scope.currentFile._id){
                $scope.files[i] = $scope.currentFile;
              }
            }
          }
        });
    }

    //隐藏显示区块
    $scope.toggleBlock = function(i){
      var id = layoutConfig.boxs[i].id;
      var box = $scope.splitBox.find('id', id);
      var hide = !layoutConfig.boxs[i].isHide;

      if(hide){
        var show = 0;
        angular.forEach(layoutConfig.boxs, function(n){
          if(!n.isHide && n.id !== 1) show++;
        });
        if(show <= 1) return;
      }

      layoutConfig.boxs[i].isHide = hide;
      box.hide(hide);
      $scope.$broadcast('resizeUpdate');
    };

    $scope.$watch(function(){return $location.search()._id;}, function(id){
      if(!id || !$scope.files || $scope.currentFile._id === id) return;

      for(var i = 0, len = $scope.files.length; i < len; i++){
        if($scope.files[i]._id === id){
          break;
        }
      }

      if($scope.files[i]){
        $scope.currentFile = $scope.files[i];
        $scope.html = $scope.currentFile.content;
      }

      if(angular.isUndefined($scope.currentFile.content)){
        crud.articles.get( $scope.currentFile._id)
          .success(function(article){
            $scope.files[i] = $scope.currentFile = article;
            $scope.html = $scope.currentFile.content;
          });
      }
    });

    $scope.selectFile = function(_id){
      if($scope.currentFile._id === _id) return;

      $location.search('_id', _id);
    };
  });
