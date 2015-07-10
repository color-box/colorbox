'use strict';

var _ = require('lodash');
var Message = require('./message.model');

function count(query, res){
  Message.find(query)
    .count()
    .exec(function(err, count){
      if(err) { return handleError(res, err); }
      return res.json(200, {count: count});
    });
}

// Get list of messages
exports.list = function(req, res) {
  var pageSize = 10;

  Message.find()
    .where({user: req.user.name})
    .limit(pageSize)
    .sort({createDate: -1})
    .skip(((+req.query.skip || 1) - 1) * pageSize)
    .exec(function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.json(200, messages);
    });
};

exports.count = function(req, res){
  count({user: req.user.name}, res);
};

exports.unreadCount = function(req, res){
  count({user: req.user.name, read: false}, res);
};

// Get a single message
exports.show = function(req, res) {
  Message.findById(req.params.id, function (err, message) {
    if(err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    return res.json(message);
  });
};

// Creates a new message in the DB.
exports.create = function(req, res) {
  Message.create(req.body, function(err, message) {
    if(err) { return handleError(res, err); }
    return res.json(201, message);
  });
};

// Updates an existing message in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Message.findById(req.params.id, function (err, message) {
    if (err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    var updated = _.merge(message, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, message);
    });
  });
};

// Updates an existing message in the DB.
exports.updateList = function(req, res) {
  Message
    .where({user: req.user.name, read: false})
    .setOptions({ multi: true})
    .update({$set: {read: true}}, function (err, messages) {
    if (err) { return handleError(res, err); }
      return res.json(200, true);
    });
};

// Deletes a message from the DB.
exports.destroy = function(req, res) {
  Message.findById(req.params.id, function (err, message) {
    if(err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    message.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
