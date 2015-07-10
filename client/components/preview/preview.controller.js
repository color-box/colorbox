'use strict';

angular.module('colorboxApp')
  .directive('preview', function($sce, $window, $timeout){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        if(element[0].tagName !== 'IFRAME') return;

        var index = 0;
        $timeout(function(){
          var iframe = $window.frames[index];
          var config = {};

          try {
            config = angular.fromJson(attrs.preview);
          }catch(e){}

          if(config.reload){
            scope[config.reload] = function(){
              if(config.loadMark){
                scope[config.loadMark] = true;
              }
              iframe.location.reload();
            };
          }

          if(config.writePage){
            scope[config.writePage] = function(str){
              iframe.document.write(str);
            };
          }

          if(config.loadMark){
            scope[config.loadMark] = true;
            element.bind('load', function(){
              scope[config.loadMark] = false;
            });
          }
        }, 0);
      }
    };
  });
