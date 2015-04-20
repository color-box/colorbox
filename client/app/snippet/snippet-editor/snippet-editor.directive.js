'use strict';

angular.module('colorboxApp')
  .directive('snippetEditor', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var config = scope[attrs.snippetEditor];
        var editor = ace.edit(element[0]);

        scope[attrs.snippetEditor].editor = editor;

        editor.renderer.setShowGutter(false);
        editor.renderer.setPadding(10);
        editor.session.highlight(false);
        editor.setTheme('ace/theme/chrome');
        editor.session.setMode("ace/mode/" + config.mode);

        editor.on('input', function(){
          if(!config) return;
          if(editor.session.getUndoManager().isClean()){
            config.isChange = false;
          }else{
            config.isChange = true;
          }
          config.content = editor.getValue();
          scope.$apply();
        });

        scope.$on('editorSaved:' + attrs.snippetEditor, function(){
          editor.session.getUndoManager().markClean();
          safeApply(function(){
            config.isChange = false;
          });
        });
      }
    };
  });
