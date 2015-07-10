'use strict';

var _ = require('lodash');
var Timeline = require('./timeline.model');

// Get list of timelines
exports.index = function(req, res) {
  Timeline.find(function (err, timelines) {
    if(err) { return handleError(res, err); }
    return res.json(200, timelines);
  });
};

// Get list of snippets by user
exports.listByUser = function(req, res) {
  var pageSize = 6;

  Timeline.find()
    .where({user: req.query.user})
    .sort({date: -1})
    .limit(pageSize)
    .skip(((+req.query.skip || 1) - 1) * pageSize)
    .exec(function (err, timelines) {
      if(err) { return handleError(res, err); }
      return res.json(200, timelines);
    });
};

// Get a single timeline
exports.show = function(req, res) {
  Timeline.findById(req.params.id, function (err, timeline) {
    if(err) { return handleError(res, err); }
    if(!timeline) { return res.send(404); }
    return res.json(timeline);
  });
};

// Creates a new timeline in the DB.
exports.create = function(req, res) {
  Timeline.create(req.body, function(err, timeline) {
    if(err) { return handleError(res, err); }
    return res.json(201, timeline);
  });
};

// Updates an existing timeline in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Timeline.findById(req.params.id, function (err, timeline) {
    if (err) { return handleError(res, err); }
    if(!timeline) { return res.send(404); }
    var updated = _.merge(timeline, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, timeline);
    });
  });
};

// Deletes a timeline from the DB.
exports.destroy = function(req, res) {
  Timeline.findById(req.params.id, function (err, timeline) {
    if(err) { return handleError(res, err); }
    if(!timeline) { return res.send(404); }
    timeline.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
