/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Snippet = require('./snippet.model');

exports.register = function(socket) {
  Snippet.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Snippet.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('snippet:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('snippet:remove', doc);
}