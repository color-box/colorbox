'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingSchema = new Schema({
  user: String,
  color: String,
  code: {type: String, default: ''},
  height: Number
});

module.exports = mongoose.model('Setting', SettingSchema);
