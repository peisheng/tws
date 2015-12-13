'use strict';

describe('Controller: ViewcompanyCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var ViewcompanyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewcompanyCtrl = $controller('ViewcompanyCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ViewcompanyCtrl.awesomeThings.length).toBe(3);
  });
});
