'use strict';

angular.module('colorboxApp')
  .controller('SettingsCtrl', function ($scope) {
    $scope.tabs = [
      {name: 'back', text: '设置主页背景'},
      {name: 'changepassword', text: '修改密码'}
    ];
    $scope.currentTab = $scope.tabs[0];

    $scope.select = function(tab){
      $scope.currentTab = tab;
    };
  })

  .controller('SettingsBackgroundCtrl', function ($scope, crud, Auth, toaster) {
    var user = Auth.getCurrentUser().name;

    $scope.settings = {color: '#000000', code: ''};
    $scope.message = '';
    $scope.codes = [{name: '请选择', _id: ''}];

    crud.snippets.getAllSnippetsByUser()
      .success(function(snippets){
        $scope.codes = $scope.codes.concat(snippets);
      });

    crud.settings.get(user)
      .success(function(settings){
        if(!settings){
          $scope.settings = {
            color: '#000000',
            user: user
          };
          crud.settings.add($scope.settings)
            .success(function(settings){
              $scope.settings = settings;
            });
        }else {
          $scope.settings = settings;
        }
      });

    $scope.setting = function(){
      if(!$scope.settings._id){
        $scope.message = '保存失败，稍后再试';
      }
      crud.settings.save($scope.settings)
        .success(function(){
          $scope.message = '';
          toaster.pop({
            type: 'success',
            title: '保存背景设置成功'
          });
        })
    };
  })

  .controller('SettingsChangePasswordCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
          .then( function() {
            $scope.message = '修改密码成功';
          })
          .catch( function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
