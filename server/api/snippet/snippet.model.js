'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SnippetSchema = new Schema({
  name: String,
  user: String,
  description: String,
  html: {
    mode: String,
    content: String
  },
  css: {
    mode: String,
    content: String
  },
  javascript: {
    mode: String,
    content: String
  },
  comments: String,
  stars: Object,
  fork: Boolean
});

module.exports = mongoose.model('Snippet', SnippetSchema);
