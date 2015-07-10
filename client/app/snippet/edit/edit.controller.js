'use strict';

// cdn地址
// https://cdnjs.com/libraries
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

    $scope.open = function () {
      var modalInstance = $modal.open({
        templateUrl: 'snippet-detail',
        controller: 'SnippetDetailCtrl',
        size: 'lg',
        resolve: {
          data: function(){
            return {name: $scope.snippet.name, desc: $scope.snippet.desc, comments: $scope.snippet.comments};
          }
        }
      });

      modalInstance.result.then(function(data){
        if(data){
          data._id = $scope.snippet._id;
          crud.snippets.save(data)
            .success(function(){
              angular.extend($scope.snippet, data);
            });
        }
      });
    };

    if(!$location.search()._id){
      crud.snippets.add({})
        .success(function(snippet){
          $scope.snippet = snippet;
          $scope.preview = $sce.trustAsResourceUrl('/api/snippets/preview/' + snippet._id);
          $scope.open();
        });
    }else{
      crud.snippets.get($location.search()._id)
        .success(function(snippet){
          $scope.snippet = snippet;
          $scope.preview = $sce.trustAsResourceUrl('/api/snippets/preview/' + snippet._id);
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

    $scope.openSettings = function (tab) {
      var modalInstance = $modal.open({
        templateUrl: 'app/snippet/edit/settings.html',
        controller: 'SnippetSettingsCtrl',
        size: 'lg',
        resolve: {
          data: function(){
            return {
              tab: tab, snippet: function () {
                var l = ['html', 'css', 'javascript'];
                var r = {};

                angular.forEach(l, function (n) {
                  r[n] = {
                    mode: $scope.snippet[n].mode,
                    resources: $scope.snippet[n].resources.slice(0)
                  }
                });

                return r;
              }()
            }
          }
        }
      });

      modalInstance.result.then(function(data){
        if(data){
          data._id = $scope.snippet._id;
          crud.snippets.updateSettings(data)
            .success(function(){
              angular.extend($scope.snippet, data);
            });
        }
      });
    };
  })

  .controller('SnippetDetailCtrl', function($scope, $modalInstance, data){
    $scope.data = data;

    $scope.$on('$stateChangeStart', function(){
      $scope.cancel();
    });

    $scope.submit = function(){
      $modalInstance.close($scope.data);
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('SnippetSettingsCtrl', function($scope, $modalInstance, data, $sce){
    $scope.data = data;
    $scope.showCdn = false;
    $scope.tabs = ['html', 'css', 'javascript'];
    $scope.placeholders = {
      'html': '输入头信息，如：<meta name="viewport" content="width=device-width">',
      'css': '输入正确url，如：https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.3.0/animate.min.css',
      'javascript': '输入正确url，如：https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js'
    };
    $scope.modes = {
      'html': ['html', 'jade'],
      'css': ['css', 'less'],
      'javascript': ['javascript', 'coffeescript']
    };

    $scope.$on('$stateChangeStart', function(){
      $scope.cancel();
    });

    $scope.submit = function(form){
      if(form.$valid) {
        $modalInstance.close($scope.data.snippet);
      }
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.addResource = function(tab){
      data.snippet[tab].resources.push('');
    };

    $scope.removeResource = function(tab, i){
      data.snippet[tab].resources.splice(i, 1);
    };

    $scope.search = function() {
      if(!$scope.showCdn) {
        $scope.cdnSearch = $sce.trustAsResourceUrl('https://cdnjs.com/libraries');
      }
      $scope.showCdn = !$scope.showCdn;
    }
  });
