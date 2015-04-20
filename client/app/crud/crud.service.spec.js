'use strict';

describe('Service: crud', function () {

  // load the service's module
  beforeEach(module('colorboxApp'));

  // instantiate service
  var crud;
  beforeEach(inject(function (_crud_) {
    crud = _crud_;
  }));

  it('should do something', function () {
    expect(!!crud).toBe(true);
  });

});
