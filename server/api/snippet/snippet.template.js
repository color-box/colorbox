var jade = require('jade');
var template = {};
var str = (function(fn){
  return fn.toString().replace(/^function.*?\/\*\!\s*/, '').replace(/\s*\*\/\}$/, '');
}(function(){/*!
doctype html
html
  head
    meta(charset="utf-8")
    title #{title}
    style(ret="stylesheet")
      != css
    body
      != html
      script(type='text/javascript')
        != javascript
 */}));

template.generateSnippetHtml = function(snippet){
  var data = {};
  data.title = (snippet.name || '') + ' - colorbox';
  data.css = snippet.css.content;
  data.html = snippet.html.content;
  data.javascript = snippet.javascript.content;

  return jade.compile(str, {})(data);
};

module.exports = template;
