angular.module('colorboxApp')
  .directive('at', function($compile, $window){
    var atHtml = '<div class="at">' +
                '<div class="list-group" ng-repeat="user in userList">' +
                '<a class="list-group-item" href="javascript:;">{{user}}</a>'
                '</div></div>';

    function openAt($at){

    }

    return {
      restrict: 'A',
      scope: {
        userList: '=at'
      },
      link: function(scope, element, attrs){
        var reg = /(^|\s)@$/;
        var $at = angular.element(atHtml);
        var open = false;

        $compile($at)(scope);
        element.parent().append($at);

        element.bind('focus', function(){
          var text = this.value.slice(0,this.selectionStart);
        });

        element.bind('input', function(){
          var text = this.value.slice(0,this.selectionStart);
          if(text.match(reg)){
            open = true;
            $at.show();
          }else{
            open = false;
            $at.hide();
          }
        });

        element.bind('keydown', function(e){
          if(open){

          }
        });
      }
    };
  })

  .filter('atfilter', function(){
    return function(input){

    }
  });
