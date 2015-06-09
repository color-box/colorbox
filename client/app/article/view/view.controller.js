'use strict';

angular.module('colorboxApp')
  .controller('ArticleViewCtrl', function ($scope, crud, $location) {
    $scope.currentFile = {};
    $scope.defaultName = '未命名';
    var commentConfig = {id: 3, parentId: 1, template: 'article-comments', title: '评论', size: 50, isHide: true};
    var layoutConfig =
    $scope.layoutConfig = {
      direction: 'x',
      barWidth: 10,
      minSize: 10,
      animateClass: 'animate',
      boxs: [
        {id: 1},
        {id: 2, parentId: 1, template: 'article-preview', title: '预览', size: 50, isHide: false},
        commentConfig
      ]
    };

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
      if(!id || $scope.currentFile._id === id) return;

      if(angular.isUndefined($scope.currentFile.content)){
        crud.articles.get( id)
          .success(function(article){
            $scope.currentFile = article;
            $scope.html = $scope.currentFile.content;
            commentConfig.title = "评论（" + article.comments.length + '）';
          });
      }
    });

    $scope.selectFile = function(_id){
      if($scope.currentFile._id === _id) return;

      $location.search('_id', _id);
    };

    // 评论
    $scope.comment = function(data){
      return crud.articles.comment($scope.currentFile._id, data);
    };
  });
