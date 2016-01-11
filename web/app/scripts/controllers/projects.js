'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('ProjectsCtrl', ["$scope", "$timeout", "$http", "$location", function($scope, $timeout, $http, $location) {

        var projectListPath = "/projects";
        var companyListPath = "/companys";
        $scope.$on('$routeChangeStart', function(next, current) {
            changeScope();
        });
        $scope.showQbar = false;

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
        $scope.ckShowQbar = function() {
            $scope.showQbar = true;
        }

        $scope.ckHideQbar = function() {
            $scope.showQbar = false;
        }




        $scope.prePage = 1;
        $scope.nextPage = 1;
        var page_size = 10;
        var max_size = 300;
        $scope.items = [];
        $scope.showLoadMore = true;
        $scope.isactive = false;

        function ReadyData(index) {
            var url = "/api/project/list?" + "page_index=" + index + "&page_size=" + page_size;
            if (window.localStorage) {
                var prj_v_ids = localStorage.getItem("prj_visits");
                if (prj_v_ids != null) {
                    prj_v_ids = JSON.parse(prj_v_ids);
                }
            }
            $scope.totalRecord = 0;
            $scope.currentPage = 0;
            var p = $http({
                method: "GET",
                url: url
            });
            p.success(function(data) {
                $scope.totalRecord = data.total_count;
                $scope.currentIndex = data.current_index;
                if (!!prj_v_ids) {
                    for (var i = 0, j = data.items.length; i < j; i++) {
                        if (!_.contains(prj_v_ids, data.items[i].id)) {
                            data.items[i].color = "color:#000;";
                        } else {
                            data.items[i].color = "color:#bbb;";
                        }
                    }
                } else {
                    for (var i = 0, j = data.items.length; i < j; i++) {
                        data.items[i].color = "color:#000;";
                    }
                }

                if ($scope.items.length == 0) {
                    $scope.items = data.items;
                } else if ($scope.items.length <= max_size) {
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

                $scope.items = ret;



                if ($scope.items.length < data.total_count) {
                    $scope.showLoadMore = true;
                } else {
                    $scope.showLoadMore = false;
                }


                $timeout(function() {
                    //  myScroll.refresh();


                    if (!$scope.isactive) {
                        $("#navbar").sticky({
                            topSpacing: 15
                        });
                        $scope.isactive = true;
                    }
                    $(".remark-text").addClass("hide")
                });
            });
        }


        $scope.ckVisit = function(id) {
            if (!window.localStorage) {
                console.log("not support the localStorage");
                return;
            }
            var prj_visits = localStorage.getItem("prj_visits");
            if (prj_visits == null) {
                prj_visits = [];
            } else {
                prj_visits = JSON.parse(prj_visits);
            }

            prj_visits.push(id);
            if (prj_visits.length > 100) {
                _.sortBy(prj_visits);
                while (prj_visits.length > 100) {
                    prj_visits.shift(0);
                }
            }
            prj_visits = JSON.stringify(_.uniq(prj_visits));
            localStorage.setItem("prj_visits", prj_visits);
            $location.path("view-project/" + id);
        }
        ReadyData(1);
        // var myScroll;
        // var pullDownEl, pullDownL;
        // var pullUpEl, pullUpL;
        // var Downcount = 0,
        //     Upcount = 0;
        // var loadingStep = 0;
        //加载状态0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新



        // function pullDownAction() { //下拉事件  
        //     setTimeout(function() {
        //         ReadyData(1);
        //         console.log("pull down");
        //         pullDownEl.removeClass('loading');
        //         // pullDownL.html('下拉显示更多...');
        //         pullDownEl['class'] = pullDownEl.attr('class');
        //         pullDownEl.attr('class', '').hide();
        //         //  myScroll.refresh();
        //         loadingStep = 0;
        //     }, 1000); //1秒  
        // }

        // function pullUpAction() { //上拉事件  
        //     setTimeout(function() {

        //         $scope.nextPage = $scope.nextPage + 1;
        //         ReadyData($scope.nextPage);
        //         pullUpEl.removeClass('loading');
        //         //pullUpL.html('上拉显示更多...');
        //         pullUpEl['class'] = pullUpEl.attr('class');
        //         pullUpEl.attr('class', '').hide();
        //         //myScroll.refresh();
        //         loadingStep = 0;
        //     }, 1000);
        // }


        // function loaded() {

        //     pullDownEl = $('#pullDown');
        //     pullDownL = pullDownEl.find('.pullDownLabel');
        //     pullDownEl['class'] = pullDownEl.attr('class');
        //     pullDownEl.attr('class', '').hide();
        //     pullUpEl = $('#pullUp');
        //     pullUpL = pullUpEl.find('.pullUpLabel');
        //     pullUpEl['class'] = pullUpEl.attr('class');
        //     pullUpEl.attr('class', '').hide();
        //     myScroll = new IScroll('#project-content', {
        //         probeType: 2, //probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。  
        //         scrollbars: true, //有滚动条  
        //         mouseWheel: true, //允许滑轮滚动  
        //         fadeScrollbars: true, //滚动时显示滚动条，默认影藏，并且是淡出淡入效果  
        //         bounce: true, //边界反弹  
        //         interactiveScrollbars: true, //滚动条可以拖动  
        //         shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.  
        //         click: true, // 允许点击事件  
        //         keyBindings: true, //允许使用按键控制  
        //         momentum: true // 允许有惯性滑动  
        //     });
        //     //滚动时  
        //     myScroll.on('scroll', function() {

        //         if (loadingStep == 0 && !pullDownEl.attr('class').match('flip|loading') && !pullUpEl.attr('class').match('flip|loading')) {
        //             if (this.y > 5) {
        //                 //下拉刷新效果  
        //                 pullDownEl.attr('class', pullUpEl['class'])
        //                 pullDownEl.show();
        //                 myScroll.refresh();
        //                 pullDownEl.addClass('flip');
        //                 // pullDownL.html('准备刷新...');
        //                 $(".remark-text").removeClass("hide");
        //                 loadingStep = 1;
        //             } else if (this.y < (this.maxScrollY - 5)) {
        //                 //上拉刷新效果  
        //                 pullUpEl.attr('class', pullUpEl['class'])
        //                 pullUpEl.show();
        //                 myScroll.refresh();
        //                 pullUpEl.addClass('flip');
        //                 // pullUpL.html('准备刷新...');
        //                 $(".remark-text").removeClass("hide");
        //                 loadingStep = 1;
        //             }
        //         }
        //     });
        //     //滚动完毕  
        //     myScroll.on('scrollEnd', function() {
        //         if (loadingStep == 1) {
        //             if (pullUpEl.attr('class').match('flip|loading')) {
        //                 pullUpEl.removeClass('flip').addClass('loading');
        //                 pullUpL.html('Loading...');
        //                 loadingStep = 2;
        //                 pullUpAction();
        //             } else if (pullDownEl.attr('class').match('flip|loading')) {
        //                 pullDownEl.removeClass('flip').addClass('loading');
        //                 pullDownL.html('Loading...');
        //                 loadingStep = 2;
        //                 pullDownAction();
        //             }
        //         }
        //         $(".remark-text").addClass("hide");
        //     });
        // }


        $scope.ckLoadMore = function() {
            $scope.nextPage = $scope.nextPage + 1;
            ReadyData($scope.nextPage);
        }



        // angular.element("#project-colntent").ready(loaded);




    }]);
