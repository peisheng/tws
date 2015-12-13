'use strict';

/**
 * @ngdoc directive
 * @name webappApp.directive:tabhead
 * @description
 * # tabhead
 */
angular.module('webappApp')
  .directive('tabhead', function () {
    return {
      template: '<div class="row"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the tabhead directive');
      }
    };
  });
