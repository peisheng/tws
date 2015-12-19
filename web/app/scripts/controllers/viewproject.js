'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:ViewprojectCtrl
 * @description
 * # ViewprojectCtrl
 * Controller of the webappApp
 */
angular.module('webappApp').controller('ViewprojectCtrl', function($scope, $routeParams, $http) {
    var id = $routeParams.id;
    var url = "/api/project/get?id=" + id;
    var q = $http({
        method: "GET",
        url: url
    });
    q.success(function(data) {
        $scope.project = data;
        $scope.company = data.company;
        if (!$scope.company.phone) {
            $scope.company.phone = $scope.company.mobile;
        }
    });
});
