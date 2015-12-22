'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:ViewcompanyCtrl
 * @description
 * # ViewcompanyCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('ViewcompanyCtrl', function($scope, $routeParams, $http, $timeout) {
        var id = $routeParams.id;
        var url = "/api/company/get?id=" + id;
        var q = $http({
            method: "GET",
            url: url
        });
        q.success(function(data) {
            $scope.company = data;
            if (!!$scope.company.introduce_page) {
                var _url = "/api/project/setviewcount?id=" + $scope.company.introduce_page.id;
                setTimeout(function() {
                    var c = $http({
                        method: "GET",
                        url: _url
                    });
                    c.success(function() {
                        console.log("update sucess");
                    });

                }, 3000);
            }

        });




        $scope.conActive = "active";
        $scope.prjActive = "";
        $scope.showList = false;
        $scope.ckShow = function(type) {
            if (type == 1) {
                $scope.showList = true;
                $scope.conActive = "";
                $scope.prjActive = "active";
            } else if (type == 2) {
                $scope.showList = false;
                $scope.conActive = "active";
                $scope.prjActive = "";
            }
        };
        $scope.loadNext = function() {
            ReadyData($scope.nextPage);
        }


        $scope.totalRecord = 0;
        $scope.currentPage = 0;
        $scope.prePage = 1;
        $scope.nextPage = 1;
        var page_size = 20;
        var max_size = 1000;
        $scope.items = [];

        function ReadyData(index) {
            var url = "/api/project/list?" + "page_index=" + index + "&page_size=" + page_size + "&keyword=&company_id=" + id;

            var p = $http({
                method: "GET",
                url: url
            });
            p.success(function(data) {
                $scope.totalRecord = data.total_count;
                $scope.nextPage = data.current_page + 1;
                if ($scope.items.length == 0) {
                    $scope.items = data.items;
                } else if ($scope.items.length <= 1000) {
                    _.each(data.items, function(it) {
                        $scope.items.push(it);
                    });
                }
                var uniques = _.map(_.groupBy($scope.items, function(doc) {
                    return doc.id
                }), function(grouped) {
                    return grouped[0];
                });
                var ret = _.sortBy(uniques, function(it) {
                    return -it.id;
                });
                if ($scope.items.length < $scope.totalRecord) {
                    $scope.showMore = true;
                } else {
                    $scope.showMore = false;
                }

                $scope.items = ret;

            });
        }
        ReadyData(1);


    });
