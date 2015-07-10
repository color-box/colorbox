'use strict';

angular.module('colorboxApp')

//自动获取焦点
  .directive('autoFocus',
  ['$timeout',
    function($timeout){
      return {
        restrict: 'A',
        link: function(scope, element, attrs){
          scope.$watch(attrs.autoFocus, function(val){
            if(val){
              $timeout(function(){
                element[0].focus();
                element[0].select();
                scope[attrs.autoFocus] = false;
              }, 0);
            }
          });
        }
      };
    }
  ])

  .factory('safeApply',
  ['$rootScope',
    function($rootScope){
      return function(fn) {
        var phase = $rootScope.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        }else {
          this.$apply(fn);
        }
      };
    }
  ])

  .value('article::layoutConfig',
  {
    direction: 'x',
    barWidth: 10,
    minSize: 10,
    animateClass: 'animate',
    boxs: [
      {id: 1, size: 60},
      //{id: 4, parentId: 1, template: 'article-list', title: '列表', size: 20, isHide: true},
      {id: 3, parentId: 1, template: 'article-editor', title: '编辑', size: 40, isHide: false},
      {id: 2, parentId: 1, template: 'article-preview', title: '预览', size: 40, isHide: false},
      {id: 5, template: 'article-console', title: '日志', size: 40, isHide: true}
    ]
  })

  .value('article::functions',
  [
    {title: '保存', icon: 'fa fa-floppy-o', command: 'save', key: 'Ctrl-S', disable: '!currentFile.isChange || layoutConfig.items[1].hide'},
    {title: '加粗 <strong>', icon: 'fa fa-bold', command: 'replaceText', params: ['**%s**', '加粗文本'], key: 'Ctrl-B'},
    {title: '斜体 <em>', icon: 'fa fa-italic', command: 'replaceText', params: ['_%s_', '斜体文本'], key: 'Ctrl-I'},
    {title: '超链接 <a>', icon: 'fa fa-link', command: 'dialogOpen', key: 'Ctrl-L', params: 'link'},
    {title: '图片 <img>', icon: 'fa fa-image', command: 'dialogOpen', key: 'Ctrl-Q', params: 'image'},
    {title: '块引用 <blockquote>', icon: 'fa fa-quote-right', command: 'replaceText', params: ['\n> %s\n', '引用'], key: 'Ctrl-K'},
    {title: '代码 <code>', icon: 'fa fa-code', command: 'replaceText', params: ['\n```\n%s\n```\n', '代码'], key: 'Ctrl-G'},
    {title: '有序列表 <ol>', icon: 'fa fa-list-ol', command: 'replaceText', params: ['\n1. %s\n', '列表项'], key: 'Ctrl-O'},
    {title: '无序列表 <ul>', icon: 'fa fa-list-ul', command: 'replaceText', params: ['\n* %s\n', '列表项'], key: 'Ctrl-U'},
    {title: '标题 <h1>~<h6>', icon: 'fa fa-header', command: 'replaceText', params: ['\n# %s\n', '标题'], key: 'Ctrl-H'},
    {title: '分隔线 <hr>', icon: 'fa fa-ellipsis-h ', command: 'replaceText', params: ['\n***\n', ''], key: 'Ctrl-R'},
    {title: '撤销', icon: 'fa fa-undo', command: 'editor.undo', disable: '!editor.session.getUndoManager().hasUndo() || layoutConfig.items[1].hide', key: 'Ctrl-Z'},
    {title: '还原', icon: 'fa fa-repeat', command: 'editor.redo', disable: '!editor.session.getUndoManager().hasRedo() || layoutConfig.items[1].hide', key: 'Ctrl-Y'},
  ])

  .controller('ArticleEditCtrl',
  ['$scope', '$location','article::layoutConfig', 'article::functions', 'crud', '$timeout', 'safeApply', '$modal',
    function($scope,   $location,   layoutConfig,    functions,   crud,   $timeout,   safeApply, $modal){
      $scope.prompts = [];
      $scope.currentFile = {};

      //获取文档列表
      //crud.articles.getArticles()
      //  .success(function(articles){
      //    $scope.files = articles;
      //  });

      //获取当前编辑文档
      if($location.search()._id){
        crud.articles.get($location.search()._id)
          .success(function(article){
            $scope.currentFile = article;
            //if($scope.files){
            //  for(var i = 0, len = $scope.files.length; i < len; i++){
            //    if($scope.files[i]._id === $scope.currentFile._id){
            //      $scope.files[i] = $scope.currentFile;
            //    }
            //  }
            //}
          });
      }else{
        $timeout(function(){
          $scope.addArticle();
        }, 0);
      }

      angular.forEach(functions.slice(1, -2), function(n){
        n.disable = 'layoutConfig.boxs[2].isHide';
      });

      layoutConfig.onResize = function(){
        $scope.$broadcast('resizeUpdate');
      }

      $scope.layoutConfig = layoutConfig;
      $scope.functions = functions;
      $scope.defaultName = '未命名';
      $scope.status = {
        editingName: false
      };

      $scope.dialogOpen = function(type){
        var modalInstance = $modal.open({
          templateUrl: 'app/article/edit/settings.html',
          controller: 'ArticleEditSettingsCtrl',
          size: 'md',
          resolve: {
            data: function(){
              return {type: type}
            }
          }
        });

        modalInstance.result.then(function(data){
          if(data){
            if(data.type === 'image') {
              var url = data.url || '';
              $scope.replaceText(['![%s](' + url + ')', '图片描述']);
            }else if(data.type === 'link'){
              var url = data.url || $location.absUrl();
              $scope.replaceText(['[%s](' + url + ')', '链接']);
            }
          }
        });
      };

      $scope.keydownSaveName = function(e){
        if(e.keyCode === 13){
          e.target.blur();
        }
      };

      //保存文件名
      $scope.saveName = function(e){
        var data = {
          _id: $scope.currentFile._id,
          name: $scope.currentFile.name
        };

        if(!$scope.currentFile.name){
          e.preventDefault();
          return;
        }

        $scope.prompts.push({
          message: '重命名文档' + data._id + '为' + data.name,
          status: 'doing'
        });

        crud.articles.save(data)
          .success(function(){
            $scope.prompts.push({
              message: '重命名文档' + data._id + '为' + data.name + '成功',
              status: 'success'
            });
            $scope.editName(false);
          })
          .error(function(){
            $scope.prompts.push({
              message: '重命名文档' + data._id + '为' + data.name + '失败',
              status: 'error'
            });
          });
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

      $scope.editName = function(mark){
        $scope.status.editingName = mark;
      };

      //$scope.$watch(function(){return $location.search()._id;}, function(id){
      //  if(!id || !$scope.files || $scope.currentFile._id === id) return;
      //
      //  for(var i = 0, len = $scope.files.length; i < len; i++){
      //    if($scope.files[i]._id === id){
      //      break;
      //    }
      //  }
      //
      //  $scope.files[i] && ($scope.currentFile = $scope.files[i]);
      //
      //  if(angular.isUndefined($scope.currentFile.content)){
      //    crud.articles.get( $scope.currentFile._id)
      //      .success(function(article){
      //        $scope.files[i] = $scope.currentFile = article;
      //      });
      //  }
      //});

      //$scope.selectFile = function(_id){
      //  if($scope.currentFile._id === _id) return;
      //
      //  $location.search('_id', _id);
      //};

      $scope.disable = function(fun){
        return $scope.$eval(fun.disable);
      };

      //操作
      $scope.opera = function(fun){
        if($scope.editor){
          var expression = [fun.command, '(', ')'];
          expression.splice(2, 0, angular.toJson(fun.params));
          $scope.$eval(expression.join(''));
        }
      };

      $scope.replaceText = function(params){
        var ranges = $scope.editor.selection.getAllRanges();
        angular.forEach(ranges, function(n, i){
          //替换选择的文本
          var selectionText = $scope.editor.session.getTextRange(n);
          var tpl = params[0];
          var text = selectionText || params[1];
          var range = $scope.editor.session.replace(n, tpl.replace('%s', text));
          var offset = tpl.indexOf('%s');

          if(text.length){
            //选中提供编辑的文本
            var start = {
              row: range.row,
              column: range.column
            };
            var end = {};

            if(offset > -1){
              while(tpl[offset++] !== undefined){
                if(tpl[offset] === '\n'){
                  start.row--;
                }
              }
            }
            tpl.replace(/(?:^|\n)(.*)%s/, function(s, m){
              if(start.row !== range.row){
                start.column = m.length;
              }else{
                start.column = n.start.column + m.length;
              }
            });
            end.row = start.row;
            end.column = start.column + text.length;

            $scope.editor.selection.setSelectionRange({end: end, start: start});
          }
        });

        $scope.editor.focus();
      };

      //保存文档内容
      $scope.save = function(){
        if(!$scope.currentFile.isChange) return;
        var content = $scope.editor.getValue();
        var data = {
          _id: $scope.currentFile._id,
          content: content
        };

        $scope.prompts.push({
          message: '正在保存' + data._id + '内容',
          status: 'doing'
        });

        crud.articles.save(data)
          .success(function(){
            $scope.prompts.push({
              message: '保存' + data._id + '内容成功',
              status: 'success'
            });
            $scope.$broadcast('editorSaved');
          })
          .error(function(){
            $scope.prompts.push({
              message: '保存' + data._id + '内容失败',
              status: 'error'
            });
          });
      };

      $scope.addArticle = function(){
        $scope.prompts.push({
          message: '新增文档',
          status: 'doing'
        });
        crud.articles.add({})
          .success(function(article){
            $scope.prompts.push({
              message: '新增文档成功',
              status: 'success'
            });
            //$scope.files.push(article);
            $scope.currentFile = article;
            $location.search('_id', article._id);
          });
      };

      //删除文件
      $scope.delArticle = function(e, id, index){
        e.stopPropagation();
        if(confirm('确认删除文件 '+ id + '?')){

          $scope.prompts.push({
            message: '正在删除' + id,
            status: 'doing'
          });
          crud.articles.del(id)
            .success(function(data){
              $scope.prompts.push({
                message: '删除' + id + '成功',
                status: 'success'
              });
              //$scope.files.splice(index, 1);
              //$scope.selectFile($scope.files[0]._id);
            });
        }
      };

      $scope.$watch('prompts.length', function(val, old){
        if(val > old){
          $scope.prompts[val - 1].time = new Date();
        }
      });
    }
  ])

  .controller('ArticleEditSettingsCtrl', function($scope, $modalInstance, data){
    $scope.data = data;

    if(data.type === 'link'){
      $scope.placeholder = '请输入链接';
    }else{
      $scope.placeholder = '请输入图片地址';
    }

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

  .directive('articleEditor',
  ['$timeout', '$sce', 'safeApply',
    function($timeout,   $sce,   safeApply){
      return {
        restrict: 'A',
        link: function(scope, element, attrs){
          var resizeTimer;
          var editor = ace.edit(element[0]);

          scope.editor = editor;

          editor.renderer.setShowGutter(false);
          editor.renderer.setPadding(20);
          editor.renderer.setScrollMargin(20);
          editor.setOption("scrollPastEnd", .9);
          editor.session.highlight(false);
          editor.setTheme('ace/theme/chrome');

          editor.on('input', function(){
            if(!scope[attrs.articleEditor]) return;
            if(editor.session.getUndoManager().isClean()){
              scope[attrs.articleEditor].isChange = false;
            }else{
              scope[attrs.articleEditor].isChange = true;
            }
            scope.html = editor.getValue();
            scope.$apply();
          });

          //给编辑按钮绑定快捷键
          angular.forEach(scope.functions.slice(0, -2), function(n, i){
            editor.commands.addCommand({
              name: n.title,
              bindKey: {win: n.key,  mac: n.key.replace('Ctrl', 'Command')},
              exec: function(editor) {
                scope[n.command](n.params);
              },
              readOnly: false
            });
          });

          scope.$on('editorSaved', function(){
            editor.session.getUndoManager().markClean();
            safeApply(function(){
              scope[attrs.articleEditor].isChange = false;
            });
          });

          scope.$watch(attrs.articleEditor, function(file){
            if(file){
              if(!file.editSession){
                file.editSession = ace.createEditSession(file.content || '');
              }
              editor.setSession(file.editSession);
              editor.session.setMode("ace/mode/markdown");
              editor.session.setUseWrapMode(true);
              editor.focus();
              scope.html =  editor.getValue();

              ace.config.loadModule("ace/ext/language_tools", function(){
                editor.setOptions({
                  enableBasicAutocompletion: true,
                  enableSnippets: true,
                  enableLiveAutocompletion: true
                });
              });

              editor.session.on('changeScrollTop', function(){

              });
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
    }
  ])

  .directive('markdownPreview',
  ['$sanitize', '$document', '$timeout', 'markdownDiagram', '$location',
    function($sanitize,   $document,   $timeout,   markdownDiagram,   $location){
      return {
        restrict: 'A',
        link: function(scope, element, attrs){
          var converter = new Showdown.converter({extensions: ['table']});
          var renderTimer = 0;

          scope.$watch(attrs.markdownPreview, function(val){
            if(renderTimer){
              $timeout.cancel(renderTimer);
            }
            if(val){
              renderTimer = $timeout(function(){
                render(val);
              }, 100);
            }else{
              element.html('');
            }
          });

          function render(val){
            try{
              markdownDiagram($sanitize(converter.makeHtml(val)), function(html, hs){
                element.html(html);
                if(attrs.markdownPreviewTable){
                  scope[attrs.markdownPreviewTable] = hs;
                }
              });
            }catch(e){
              throw e;
//                                 element.html(converter.makeHtml(val));
            }
          }
        }
      };
    }
  ])

  .factory('markdownDiagram',
  ['$q',
    function($q){
      var codeReg = /<code class="(.+?)">([\S\s]*?)<\/code>/g;
      var hashReg = /<a href="(#.+?)">/g;
      var hReg = /<h([1-6])>(.+?)<\/h\1>/g;
      var noReg = /[\s\.]*/g;
      var div = angular.element('<div></div>');
      div.css({
        height: '400px',
        width: '400px',
        position: 'fixed',
        top: 0,
        left: '-400px',
        overflow: 'hidden'
      });
      div = div[0];

      document.body.appendChild(div);

      var cache = {
        flow: {},
        sequence: {},
        highlight: {}
      };
      var Diagram;
      var flowchart;
      var color = '#666';

      function generateSequenceDiagram(code){
        return generate('sequence', code, function(text){
          var diagram = Diagram.parse(text);
          div.innerHTML = '';
          diagram.drawSVG(div, {theme: 'simple'});
          return div.innerHTML;
        });
      }

      function generateFlowChart(code){
        return generate('flow', code, function(text){
          var diagram = flowchart.parse(text);
          div.innerHTML = '';
          diagram.drawSVG(div);
          return div.innerHTML;
        });
      }

      function generateHighlight(lang, code){
        return generate('highlight', code, function(text){
          return hljs.highlight(lang, text).value;
        });
      }

      function generate(type, code, parse){
        var key = angular.toJson(code);
        var text = code;

        if(key in cache[type]){
          cache[type][key].store = true;
          return cache[type][key].content;
        }else{
          div.innerHTML = code;
          try{
            //将被转义的字符转义回来
            text = parse(div.textContent);
          }catch(e){
            console.log(e);
          }

          //以文本为键，缓存解析好的字符
          cache[type][key] = {
            content: text,
            store: true
          }

          return cache[type][key].content;
        }
      }

      function removeCache(){
        //删除不再需要的缓存
        for(var type in cache){
          for(var n in cache[type]){
            if(!cache[type][n].store)
              delete cache[type][n];
          }
        }
      }

      return function(mdStr, callback){
        var strList = [];
        var promises = [];
        var lastIndex = 0;
        var hs = [];

        mdStr = mdStr.replace(hashReg, function(match, hash){
          return match.replace(hash, '#' + hash);
        });
        //给没有id的h1~h6加上id
        mdStr = mdStr.replace(hReg, function(match, h, hContent){
          div.innerHTML = hContent;
          hs.push([h, div.textContent, div.textContent.replace(noReg, '')]);
          return '<h' + h + ' id="' + hContent.replace(noReg, '') + '">' + hContent + '</h' + h + '>';
        });
        mdStr.replace(codeReg, function(match, type, code, index){
          strList.push(mdStr.substring(lastIndex, index));
          lastIndex = index + match.length;
          strList.push({
            match: match,
            type: type,
            code: code
          });
          return '';
        });

        strList.push(mdStr.substring(lastIndex));

        angular.forEach(strList, function(n, i, strList){
          if(!n.type) return;

//                 if(n.type === 'sequence'){
//                     if(!Diagram){
//                         var defered = $q.defer();
//                         promises.push(defered.promise);
//                         require(['sequence-diagram'], function(d){
//                             Diagram = d;
//                             strList.splice(i, 1, generateSequenceDiagram(n.code));
//                             defered.resolve();
//                         });
//                     }else{
//                         strList.splice(i, 1, generateSequenceDiagram(n.code));
//                     }
//                 }else if(n.type === 'flow'){
//                     if(!flowchart){
//                         var defered = $q.defer();
//                         promises.push(defered.promise);
//                         require(['flowchart'], function(f){
//                             flowchart = f;
//                             strList.splice(i, 1, generateFlowChart(n.code));
//                             defered.resolve();
//                         });
//                     }else{
//                         strList.splice(i, 1, generateFlowChart(n.code));
//                     }
//                 }else if(n.type){
//          if(typeof hljs === 'undefined'){
//            var defered = $q.defer();
//            promises.push(defered.promise);
//            require(['highlight'], function(){
//              strList.splice(i, 1, generateHighlight(n.type, n.code));
//              defered.resolve();
//            });
//          }else{
            strList.splice(i, 1, generateHighlight(n.type, n.code));
          //}
//                 }
        });

        if(promises.length){
          $q
            .all(promises)
            .then(function(){
              callback(strList.join(''), hs);
              removeCache();
            });
        }else{
          callback(strList.join(''), hs);
          removeCache();
        }
      }
    }
  ])
