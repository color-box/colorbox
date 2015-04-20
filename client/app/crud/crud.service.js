'use strict';

angular.module('colorboxApp')
  .factory('crud', function ($http) {
    var Crud = {};

    Crud.articles = {
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
        return $http.get('/api/articles');
      }
    }

    return Crud;
  });
