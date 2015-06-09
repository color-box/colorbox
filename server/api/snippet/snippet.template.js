var jade = require('jade');
var fs = require('fs');
var template = {};
var headScripts = fs.readFileSync(__dirname + '/snippet.headscripts.js');
var headScripts1 = fs.readFileSync(__dirname + '/snippet.headscripts-1.js');
var scripts = fs.readFileSync(__dirname + '/snippet.scripts.js');
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
    style.
      *::before, *::after { animation-play-state: paused !important; }
    script
      != headScripts
    script
      != headScripts1
    body
      != html
      script(type='text/javascript')
        != javascript
      script
        != scripts
 */}));
var thumbnail = (function(fn){
  return fn.toString().replace(/^function.*?\/\*\!\s*/, '').replace(/\s*\*\/\}$/, '');
}(function(){/*!
doctype html
html
  head
    meta(charset="utf-8")
    title #{title}
    style(ret="stylesheet")
      != css
    script
      != headScripts
  body
    != html
    script(type='text/javascript')
      != javascript
 */}));

template.generateThumbnailHtml = function(snippet){
  var data = {};
  data.title = (snippet.name || '') + ' - colorbox';
  data.css = snippet.css.content;
  data.html = snippet.html.content;
  data.javascript = snippet.javascript.content;
  data.scripts = scripts;
  data.headScripts = headScripts;
  data.headScripts1 = headScripts1;

  return jade.compile(str, {})(data);
};

template.generateSnippetHtml = function(snippet){
  var data = {};
  data.title = (snippet.name || '') + ' - colorbox';
  data.css = snippet.css.content;
  data.html = snippet.html.content;
  data.javascript = snippet.javascript.content;
  data.headScripts = headScripts;

  return jade.compile(thumbnail, {})(data);
};

module.exports = template;
