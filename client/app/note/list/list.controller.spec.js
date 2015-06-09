'use strict';

describe('Controller: NoteListCtrl', function () {

  // load the controller's module
  beforeEach(module('colorboxApp'));

  var ListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListCtrl = $controller('NoteListCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
