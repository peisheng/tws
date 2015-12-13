'use strict';

describe('Controller: ViewprojectCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var ViewprojectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewprojectCtrl = $controller('ViewprojectCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ViewprojectCtrl.awesomeThings.length).toBe(3);
  });
});
