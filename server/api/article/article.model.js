'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  name: String,
  user: String,
  content: String
});

module.exports = mongoose.model('Article', ArticleSchema);
