'use strict';

angular.module('colorboxApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'splitbox',
  'toaster'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('errorInterceptor');
  })

  .factory('errorInterceptor', function( $q, toaster){
    return {
      responseError: function(response){
        if(response.status === 403) {
          toaster.pop({
            type: 'error',
            title: '没有权限',
            body: '您没有权限进行此操作'
          });
        }
        return $q.reject(response);
      }
    };
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        $rootScope.waiting++;
        return config;
      },

      response: function(response){
        $rootScope.waiting--;
        return response;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        $rootScope.waiting--;

        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, crud) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });

    $rootScope.waiting = 0;
    var unreadCount = 0;
    $rootScope.getUnreadCount = function(){
      crud.messages.unreadCount()
        .success(function(d){
          unreadCount = d.count;
        });
    };
    $rootScope.unreadCount = function(){
      return unreadCount > 0 ? unreadCount : 0;
    };
    $rootScope.read = function(){
      unreadCount--;
    };

    // 配置ace路径
    ace.config.set('themePath', '/bower_components/ace-builds/src-min/');
    ace.config.set('workerPath', '/bower_components/ace-builds/src-min/');
    ace.config.set('modePath', '/bower_components/ace-builds/src-min/');
  });
