'use strict';

angular.module('colorboxApp')
  .directive('snippetEditor', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var config = {};
        var editor = ace.edit(element[0]);
        var resizeTimer = 0;

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

        var watch = scope.$watch('snippet.' + attrs.snippetEditor, function(c){
          if(!c){
            return;
          }

          watch();

          config = c;
          editor.setSession(ace.createEditSession(config.content || ''));
          //editor.renderer.setShowGutter(false);
          editor.renderer.setPadding(10);
          editor.session.highlight(false);
          editor.setTheme('ace/theme/chrome');
          editor.session.setMode("ace/mode/" + config.mode);
        });

        scope.$on('editorSaved:' + attrs.snippetEditor, function(){
          editor.session.getUndoManager().markClean();
          config.isChange = false;
        });

        //保存
        editor.commands.addCommand({
          name: '保存',
          bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
          exec: function(editor) {
            scope.$emit('editorSaving', attrs.snippetEditor, editor.getValue());
          },
          readOnly: false
        });

        angular.element(element[0].querySelector('.ace_gutter')).bind('click', function(e){
          var $target = angular.element(e.target);
          if($target.hasClass('ace_gutter-cell')){
            var line = +$target.text() - 1;
            editor.session[$target.hasClass('ace_breakpoint') ? 'clearBreakpoint' : 'setBreakpoint'](line);
          }
        });

        scope.$on('resizeUpdate', resize);

        function resize(){
          if(resizeTimer){
            resizeTimer = $timeout.cancel(resizeTimer);
          }
          $timeout(function(){
            editor.resize();
          }, 300);
        }
      }
    };
  });
