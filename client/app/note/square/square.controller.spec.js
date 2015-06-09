'use strict';

describe('Controller: NoteSquareCtrl', function () {

  // load the controller's module
  beforeEach(module('colorboxApp'));

  var SquareCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SquareCtrl = $controller('NoteSquareCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
