'use strict';

/**
 * @ngdoc overview
 * @name webappApp
 * @description
 * # webappApp
 *
 * Main module of the application.
 */
angular
    .module('webappApp', [
        // 'ngAnimate',
        // 'ngAria',
        // 'ngCookies',
        // 'ngMessages',
        // 'ngResource',
        'ngRoute',
        'ngSanitize'
        // 'ngTouch'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/companys.html',
                controller: 'CompanysCtrl',
                controllerAs: 'companys'
            })
            .when('/companys', {
                templateUrl: 'views/companys.html',
                controller: 'CompanysCtrl',
                controllerAs: 'companys'
            })
            .when('/view-company/:id', {
                templateUrl: 'views/view-company.html',
                controller: 'ViewcompanyCtrl',
                controllerAs: 'viewcompany'
            })
            .when('/projects', {
                templateUrl: 'views/projects.html',
                controller: 'ProjectsCtrl',
                controllerAs: 'projects'
            })
            .when('/view-project/:id', {
                templateUrl: 'views/view-project.html',
                controller: 'ViewprojectCtrl',
                controllerAs: 'viewproject'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
