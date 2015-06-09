'use strict';

var _ = require('lodash');
var Article = require('./article.model');
var Message = require('../message/message.model');

function count(query, res){
  Article.find(query)
    .count()
    .exec(function(err, count){
      if(err) { return handleError(res, err); }
      return res.json(200, {count: count});
    });
}

// Get list of articles
exports.index = function(req, res) {
  var pageSize = 6;
  var sort = {};

  if(req.query.sort === 'starsCount'){
    sort.starsCount = -1;
  }else{
    sort.createDate = -1;
  }

  Article.find({publish: true})
    .limit(pageSize)
    .sort(sort)
    .skip(((+req.query.skip || 1) - 1) * pageSize)
    .exec(function (err, articles) {
      if(err) { return handleError(res, err); }
      return res.json(200, articles);
    });
};

exports.count = function(req, res){
  count({publish: true}, res);
};

exports.countByUser = function(req, res){
  count({user: req.user.name}, res);
};

// Get list of snippets by user
exports.listByUser = function(req, res) {
  Article.find()
    .where({user: req.user.name})
    .limit(10)
    .exec(function (err, articles) {
      if(err) { return handleError(res, err); }
      return res.json(200, articles);
    });
};

// Get a single article
exports.show = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    return res.json(article);
  });
};

// Creates a new article in the DB.
exports.create = function(req, res) {
  req.body.user = req.user.name;
  Article.create(req.body, function(err, article) {
    if(err) { return handleError(res, err); }
    return res.json(201, article);
  });
};

// Updates an existing article in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    if(article.user !== req.user.name) { return res.send(403); }
    var updated = _.merge(article, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

exports.publish = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    if(article.user !== req.user.name) { return res.send(403); }
    article.publish = true;
    article.publishDate = new Date();
    article.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, {});
    });
  });
};

// Deletes a article from the DB.
exports.destroy = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    if(article.user !== req.user.name) { return res.send(403); }
    article.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// 喜欢
exports.star = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    if(!article.stars){ article.stars = {}; }
    article.stars[req.user.name] = true;
    article.starsCount = Object.keys(article.stars).length;

    var setO = {'$set': {}};
    setO.$set['stars.' + req.user.name] = true;
    setO.starsCount = article.starsCount;

    // 生成通知
    Message.create({
      user: article.user,
      infos: [{text: req.user.name, url: '/user/' + req.user.name},
        {text: '喜欢你的文章'},
        {text: article.name, url: '/article/view?_id=' + article._id}]
    });

    article.update(setO, function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

// 取消喜欢
exports.unstar = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    if(article.stars) { delete article.stars[req.user.name]; }
    article.starsCount = Object.keys(article.stars).length;

    var unset = {'$unset': {}};
    unset.$unset['stars.' + req.user.name] = true;
    unset.starsCount = article.starsCount;

    article.update(unset, function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, article);
    });
  });
};

// 添加评论
exports.comment = function(req, res){
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }

    var comment = req.body;
    var opera = {'$push': {}};
    comment.user = req.user.name;
    comment.date = new Date;
    opera.$push.comments = comment;

    // 生成通知
    Message.create({
      user: article.user,
      infos: [{text: req.user.name, url: '/user/' + req.user.name},
        {text: '评论了你的文章'},
        {text: article.name, url: '/article/view?_id=' + article._id}]
    });

    article.update(opera, function (err) {
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
