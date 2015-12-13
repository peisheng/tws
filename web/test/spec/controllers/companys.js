'use strict';

describe('Controller: CompanysCtrl', function () {

  // load the controller's module
  beforeEach(module('webappApp'));

  var CompanysCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanysCtrl = $controller('CompanysCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanysCtrl.awesomeThings.length).toBe(3);
  });
});
