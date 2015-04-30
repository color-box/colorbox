'use strict';

var _ = require('lodash');
var Snippet = require('./snippet.model');
var page = require('./snippet.template');

// Get list of snippets
exports.index = function(req, res) {
  Snippet.find(function (err, snippets) {
    if(err) { return handleError(res, err); }
    return res.json(200, snippets);
  });
};

exports.page = function(req, res){
  Snippet.findById(req.params.id, function (err, snippet) {
    if(err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    return res.end(page.generateSnippetHtml(snippet));
  });
};

// Get list of snippets by user
exports.listByUser = function(req, res) {
  Snippet.find()
    .where({user: req.user.name})
    .limit(10)
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
    var updated = _.merge(snippet, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, snippet);
    });
  });
};

// Deletes a snippet from the DB.
exports.destroy = function(req, res) {
  Snippet.findById(req.params.id, function (err, snippet) {
    if(err) { return handleError(res, err); }
    if(!snippet) { return res.send(404); }
    snippet.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
