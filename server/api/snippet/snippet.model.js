'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SnippetSchema = new Schema({
  name: String,
  user: String,
  desc: String,
  html: {
    mode: {type: String, default: 'html'},
    content: String
  },
  css: {
    mode: {type: String, default: 'css'},
    content: String
  },
  javascript: {
    mode: {type: String, default: 'javascript'},
    content: String
  },
  comments: String,
  stars: Object,
  fork: Boolean
});

module.exports = mongoose.model('Snippet', SnippetSchema);
