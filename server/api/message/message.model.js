'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  user: String,
  infos: Array,
  read: {type: Boolean, default: false},
  createDate: {type: Date, default: Date.now},
  readDate: Date
});

module.exports = mongoose.model('Message', MessageSchema);
