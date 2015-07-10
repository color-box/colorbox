'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SnippetSchema = new Schema({
  name: String,
  user: String,
  desc: String,
  html: {
    mode: {type: String, default: 'html'},
    content: String,
    resources: {type: Array, default: ['']}
  },
  css: {
    mode: {type: String, default: 'css'},
    content: String,
    resources: {type: Array, default: ['']}
  },
  javascript: {
    mode: {type: String, default: 'javascript'},
    content: String,
    resources: {type: Array, default: ['']}
  },
  comments: [{content: String, date: Date, user: String, reply: String}],
  stars: Object,
  starsCount: {type: Number, default: 0},
  viewCount: {type: Number, default: 0},
  createDate: {type: Date, default: Date.now},
  fork: Boolean,
  publish: {type: Boolean, default: false},
  publishDate: {type: Date}
});

module.exports = mongoose.model('Snippet', SnippetSchema);
