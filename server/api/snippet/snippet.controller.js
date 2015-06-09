'use strict';

var _ = require('lodash');
var Snippet = require('./snippet.model');
var page = require('./snippet.template');
var Message = require('../message/message.model');

function count(query, res){
  Snippet.find(query)
    .count()
    .exec(function(err, count){
      if(err) { return handleError(res, err); }
      return res.json(200, {count: count});
    });
}

// Get list of snippets
exports.index = function(req, res) {
  var pageSize = 6;
  var sort = {};

  if(req.query.sort === 'starsCount'){
    sort.starsCount = -1;
  }else{
    sort.createDate = -1;
  }

  Snippet.find({publish: true})
    .limit(pageSize)
    .sort(sort)
    .skip(((+req.query.skip || 1) - 1) * pageSize)
    .exec(function (err, snippets) {
    if(err) { return handleError(res, err); }
    return res.json(200, snippets);
  });
};

exports.count = function(req, res){
  count({publish: true}, res);
};

exports.countByUser = function(req, res){
  count({user: req.user.name}, res);
};

exports.page = function(req, res){
  Snippet.findById(req.params.id, function (err, snippet) {
    if(err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    return res.end(page.generateSnippetHtml(snippet));
  });
};

exports.thumbnail = function(req, res){
  Snippet.findById(req.params.id, function (err, snippet) {
    if(err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    return res.end(page.generateThumbnailHtml(snippet));
  });
};

// Get list of snippets by user
exports.listByUser = function(req, res) {
  var pageSize = 6;

  Snippet.find()
    .where({user: req.user.name})
    .limit(pageSize)
    .skip(((+req.query.skip || 1) - 1) * pageSize)
    .exec(function (err, snippets) {
      if(err) { return handleError(res, err); }
      return res.json(200, snippets);
    });
};

// Get a single snippet
exports.show = function(req, res) {
  Snippet.findById(req.params.id, function (err, snippet) {
    if(err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    return res.json(snippet);
  });
};

// Creates a new snippet in the DB.
exports.create = function(req, res) {
  req.body.user = req.user.name;
  Snippet.create(req.body, function(err, snippet) {
    if(err) { return handleError(res, err); }
    return res.json(201, snippet);
  });
};

// Updates an existing snippet in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Snippet.findById(req.params.id, function (err, snippet) {
    if (err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    if(snippet.user !== req.user.name) { return res.send(403); }
    var updated = _.merge(snippet, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, snippet);
    });
  });
};

exports.publish = function(req, res) {
  Snippet.findById(req.params.id, function (err, snippet) {
    if (err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    if(snippet.user !== req.user.name) { return res.send(403); }
    snippet.publish = true;
    snippet.publishDate = new Date();
    snippet.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, {});
    });
  });
};

// Deletes a snippet from the DB.
exports.destroy = function(req, res) {
  Snippet.findById(req.params.id, function (err, snippet) {
    if(err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    if(snippet.user !== req.user.name) { return res.send(403); }
    snippet.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.star = function(req, res) {
  Snippet.findById(req.params.id, function (err, snippet) {
    if (err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    if(!snippet.stars){ snippet.stars = {}; }
    snippet.stars[req.user.name] = true;
    snippet.starsCount = Object.keys(snippet.stars).length;

    var setO = {'$set': {}};
    setO.$set['stars.' + req.user.name] = true;
    setO.starsCount = snippet.starsCount;

    // 生成通知
    Message.create({
      user: snippet.user,
      infos: [{text: req.user.name, url: '/user/' + req.user.name},
        {text: '喜欢你的代码片段'},
        {text: snippet.name, url: '/snippet/edit?_id=' + snippet._id}]
    });

    snippet.update(setO, function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, snippet);
    });
  });
};

exports.unstar = function(req, res) {
  Snippet.findById(req.params.id, function (err, snippet) {
    if (err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    if(snippet.stars) { delete snippet.stars[req.user.name]; }
    snippet.starsCount = Object.keys(snippet.stars).length;

    var unset = {'$unset': {}};
    unset.$unset['stars.' + req.user.name] = true;
    unset.starsCount = snippet.starsCount;

    snippet.update(unset, function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, snippet);
    });
  });
};

// 添加评论
exports.comment = function(req, res){
  Snippet.findById(req.params.id, function (err, snippet) {
    if (err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }

    var comment = req.body;
    var opera = {'$push': {}};
    comment.user = req.user.name;
    comment.date = new Date;
    opera.$push.comments = comment;

    // 生成通知
    Message.create({
      user: snippet.user,
      infos: [{text: req.user.name, url: '/user/' + req.user.name},
        {text: '评论了你的代码片段'},
        {text: snippet.name, url: '/snippet/edit?_id=' + snippet._id}]
    });

    snippet.update(opera, function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, comment);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
