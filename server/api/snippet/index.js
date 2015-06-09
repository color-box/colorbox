'use strict';

var express = require('express');
var controller = require('./snippet.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/count', controller.count);
router.get('/star/:id', auth.isAuthenticated(), controller.star);
router.get('/unstar/:id', auth.isAuthenticated(), controller.unstar);
router.get('/countByUser', auth.isAuthenticated(), controller.countByUser);
router.post('/comment/:id', auth.isAuthenticated(), controller.comment);
router.post('/publish/:id', auth.isAuthenticated(), controller.publish);
router.get('/preview/:id', controller.page);
router.get('/thumbnail/:id', controller.thumbnail);
router.get('/user', auth.isAuthenticated(), controller.listByUser);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
