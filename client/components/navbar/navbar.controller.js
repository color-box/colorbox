'use strict';

'use strict';

angular.module('colorboxApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $state) {
    $scope.menu = [{
        'title': '文章',
        'link': '/article/square',
        'state': 'articleSquare'
      },
      {
        'title': '代码片段',
        'link': '/snippet/square',
        'state': 'snippetSquare'
      //},
      //{
      //  'title': '笔记',
      //  'link': '/note/square'
      }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return $state.includes(route);
    };
  });
