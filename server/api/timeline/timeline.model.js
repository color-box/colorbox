'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimelineSchema = new Schema({
  user: String,
  date: {type: Date, default: Date.now},
  type: String,
  id: String
});

module.exports = mongoose.model('Timeline', TimelineSchema);
