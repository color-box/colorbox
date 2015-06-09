'use strict';

angular.module('colorboxApp')
  .factory('crud', function ($http) {
    var Crud = {
      messages: {
        list: function(skip){
          return $http.get('/api/messages/user' + (skip ? ('?skip=' + skip) : ''));
        },
        save: function(data){
          return $http.put('/api/messages/' + data._id, data);
        },
        unreadCount: function(){
          return $http.get('/api/messages/unreadCount');
        },
        count: function(){
          return $http.get('/api/messages/count');
        }
      },
      articles: {
        get: function(id){
          return $http.get('/api/articles/' + id);
        },
        add: function(data){
          return $http.post('/api/articles', data);
        },
        del: function(id){
          return $http.delete('/api/articles/' + id);
        },
        save: function(data){
          return $http.put('/api/articles/' + data._id, data);
        },
        getArticles: function(skip){
          return $http.get('/api/articles/user' + (skip ? ('?skip=' + skip) : ''));
        },
        getAllArticles: function(skip, sort){
          return $http.get('/api/articles/?sort=' + sort + '&skip=' + skip);
        },
        count: function(){
          return $http.get('/api/articles/count');
        },
        countByUser: function(){
          return $http.get('/api/articles/countByUser');
        },
        star: function(id){
          return $http.get('/api/articles/star/' + id);
        },
        unstar: function(id){
          return $http.get('/api/articles/unstar/' + id);
        },
        comment: function(id, data){
          return $http.post('/api/articles/comment/' + id, data);
        },
        publish: function(id){
          return $http.post('/api/articles/publish/' + id);
        }
      },
      snippets: {
        get: function(id){
          return $http.get('/api/snippets/' + id);
        },
        add: function(data){
          return $http.post('/api/snippets', data);
        },
        del: function(id){
          return $http.delete('/api/snippets/' + id);
        },
        save: function(data){
          return $http.put('/api/snippets/' + data._id, data);
        },
        getSnippets: function(skip){
          return $http.get('/api/snippets/user' + (skip ? ('?skip=' + skip) : ''));
        },
        getAllSnippets: function(skip, sort){
          return $http.get('/api/snippets/?sort=' + sort + '&skip=' + skip);
        },
        count: function(){
          return $http.get('/api/snippets/count');
        },
        countByUser: function(){
          return $http.get('/api/snippets/countByUser');
        },
        star: function(id){
          return $http.get('/api/snippets/star/' + id);
        },
        unstar: function(id){
          return $http.get('/api/snippets/unstar/' + id);
        },
        comment: function(id, data){
          return $http.post('/api/snippets/comment/' + id, data);
        },
        publish: function(id){
          return $http.post('/api/snippets/publish/' + id);
        }
      }
    };

    return Crud;
  });
