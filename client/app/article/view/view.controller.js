'use strict';

angular.module('colorboxApp')
  .controller('ArticleViewCtrl', function ($scope, crud, $location, Auth, $cookieStore) {
    var user = Auth.getCurrentUser().name;

    $scope.currentFile = {};
    $scope.defaultName = '未命名';
    var commentConfig = {id: 3, parentId: 1, template: 'article-comments', icon:'fa-comment', title: '评论', size: 40, isHide: true};
    var layoutConfig =
    $scope.layoutConfig = {
      direction: 'x',
      barWidth: 10,
      minSize: 10,
      animateClass: 'animate',
      boxs: [
        {id: 1},
        {id: 4, parentId: 1, template: 'article-table', icon: 'fa-list', title: '目录', size: 20, isHide: true},
        {id: 2, parentId: 1, template: 'article-preview-pro', icon: 'fa-eye', title: '预览', size: 40, isHide: false},
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
        var record = $cookieStore.get('viewRecord') || '';

        if(record.indexOf(id) < 0) {
          crud.articles.view(id)
            .success(function () {
              $cookieStore.put('viewRecord', record  + ',' + id);
            });
        }
        crud.articles.get( id)
          .success(function(article){
            article.hasStar = article.stars && (user in article.stars);
            $scope.currentFile = article;
            $scope.html = $scope.currentFile.content;
            commentConfig.title = "评论（" + article.comments.length + '）';
          });
      }
    });

    // 评论
    $scope.comment = function(data){
      return crud.articles.comment($scope.currentFile._id, data);
    };

    $scope.star = function(id, article){
      crud.articles.star(id)
        .success(function(s){
          article.stars = s.stars;
          article.hasStar = true;
          article.starsCount = s.starsCount;
        });
    };

    $scope.unstar = function(id, article){
      crud.articles.unstar(id)
        .success(function(s){
          article.stars = s.stars;
          article.hasStar = false;
          article.starsCount = s.starsCount;
        });
    };
  });
