'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/user', auth.isAuthenticated(), controller.list);
router.get('/unreadCount', auth.isAuthenticated(), controller.unreadCount);
router.get('/count', auth.isAuthenticated(), controller.count);
router.post('/readAll', auth.isAuthenticated(), controller.updateList);
//router.get('/:id', controller.show);
//router.post('/', controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
