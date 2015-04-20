'use strict';

angular.module('colorboxApp')
  .controller('SnippetEditCtrl', function ($scope) {
    $scope.layoutConfig = {
      direction: 'y',
      minSize: 10,
      boxs: [
        {id: 1},
        {id: 2, parentId: 1, template: 'snippet-html'},
        {id: 3, parentId: 1, template: 'snippet-css'},
        {id: 4},
        {id: 5, parentId: 4, template: 'snippet-javascript'},
        {id: 6, parentId: 4, template: 'snippet-result'}
      ]
    };

    $scope.html = {
      mode: 'html'
    };

    $scope.css = {
      mode: 'css'
    };

    $scope.javascript = {
      mode: 'javascript'
    };
  });
