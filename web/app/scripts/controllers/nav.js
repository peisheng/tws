'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('navCtrl', ["$scope", "$routeParams", "$location", function($scope, $routeParams, $location) {
        var projectListPath = "/projects";
        var companyListPath = "/companys";
        $scope.$on('$routeChangeStart', function(next, current) {
            changeScope();

        });

        function changeScope() {
            var path = $.trim($location.path()).toLowerCase();
            if (path == "/projects") {
                $scope.isProjectList = true;
            } else {
                $scope.isProjectList = false;
            }
            $scope.isCompanyList = !$scope.isProjectList;
            if (path == projectListPath || path == companyListPath || path == "/") {
                $scope.isShowHead = true;
            } else {
                $scope.isShowHead = false;
            }
        }
        changeScope();


        $scope.ckProjects = function() {
            var path = $.trim($location.path()).toLowerCase();
            if (path != projectListPath) {
                $location.path(projectListPath);
            }
        }
        $scope.ckCompanys = function() {
            var path = $.trim($location.path()).toLowerCase();
            if (path != companyListPath) {
                $location.path(companyListPath);
            }
        }




    }]);
