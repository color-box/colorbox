'use strict';

var express = require('express');
var controller = require('./article.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/count', controller.count);
router.get('/view/:id', controller.view);
router.get('/star/:id', auth.isAuthenticated(), controller.star);
router.get('/unstar/:id', auth.isAuthenticated(), controller.unstar);
router.get('/countByUser', auth.isAuthenticated(), controller.countByUser);
router.get('/publicCountByUser', controller.publicCountByUser);
router.post('/comment/:id', auth.isAuthenticated(), controller.comment);
router.post('/publish/:id', auth.isAuthenticated(), controller.publish);
router.get('/user', auth.isAuthenticated(), controller.listByUser);
router.get('/user/publiclist', controller.publicListByUser);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
