angular.module('colorboxApp')
.directive('comments', function(){
    return {
      restrict: 'A',
      scope: {
        comments: '=comments',
        submit: '&onComment'
      },
      templateUrl: 'components/comments/comments.html',
      controller: function($scope, Auth){
        $scope.data = {};
        $scope.isLoggedIn = Auth.isLoggedIn();

        $scope.onSubmit = function(form){
          if(form.$valid) {
            $scope.submit({data: $scope.data})
              .success(function(comment){
                $scope.comments.push(comment);
              });
          }
        };
      }
    };
  });
