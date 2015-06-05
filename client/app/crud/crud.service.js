'use strict';

angular.module('colorboxApp')
  .factory('crud', function ($http) {
    var Crud = {
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
        getArticles: function(){
          return $http.get('/api/articles/user');
        },
        getAllArticles: function(){
          return $http.get('/api/articles/');
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
        getSnippets: function(){
          return $http.get('/api/snippets/user');
        },
        getAllSnippets: function(){
          return $http.get('/api/snippets/');
        }
      }
    };

    return Crud;
  });
