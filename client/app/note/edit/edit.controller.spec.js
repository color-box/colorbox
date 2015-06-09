'use strict';

describe('Controller: NoteEditCtrl', function () {

  // load the controller's module
  beforeEach(module('colorboxApp'));

  var EditCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditCtrl = $controller('NoteEditCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
