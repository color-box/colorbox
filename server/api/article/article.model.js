'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  name: String,
  user: String,
  content: String,
  comments: [{content: String, date: Date, user: String, reply: String}],
  stars: Object,
  starsCount: {type: Number, default: 0},
  viewCount: {type: Number, default: 0},
  createDate: {type: Date, default: Date.now},
  publish: {type: Boolean, default: false},
  publishDate: {type: Date}
});

module.exports = mongoose.model('Article', ArticleSchema);
