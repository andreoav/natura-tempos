'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('natura.tempos'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a empty list of "atletas" to the scope', function () {
    expect(scope.atletas.cadastrados.length).toBe(0);
  });
});
