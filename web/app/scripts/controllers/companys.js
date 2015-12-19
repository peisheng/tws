'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:CompanysCtrl
 * @description
 * # CompanysCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('CompanysCtrl', ["$scope", "$http", "$timeout", function($scope, $http, $timeout) {
        $scope.prePage = 1;
        $scope.nextPage = 1;
        var page_size = 20;
        var max_size = 300;
        $scope.items = [];
        $scope.keyword = "";
        $scope.ckSearch = function() {
            $scope.items = [];
            ReadyData(1);

        };

        function ReadyData(index) {
            var url = "/api/company/list?" + "page_index=" + index + "&page_size=" + page_size + "&keyword=" + $scope.keyword;

            $scope.totalRecord = 0;
            $scope.currentPage = 0;
            var p = $http({
                method: "GET",
                url: url
            });
            p.success(function(data) {
                $scope.totalRecord = data.total_record;
                $scope.currentIndex = data.current_index;
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
                console.log($scope.items.length);

                $timeout(function() {
                    myScroll.refresh();
                    $(".remark-text").addClass("hide")
                });
            });
        }


        ReadyData(1);
        var myScroll;
        var pullDownEl, pullDownL;
        var pullUpEl, pullUpL;
        var Downcount = 0,
            Upcount = 0;
        var loadingStep = 0;
        //加载状态0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新



        function pullDownAction() { //下拉事件  
            setTimeout(function() {
                ReadyData(1);
                console.log("pull down");
                pullDownEl.removeClass('loading');
                // pullDownL.html('下拉显示更多...');
                pullDownEl['class'] = pullDownEl.attr('class');
                pullDownEl.attr('class', '').hide();
                //  myScroll.refresh();
                loadingStep = 0;
            }, 1000); //1秒  
        }

        function pullUpAction() { //上拉事件  
            setTimeout(function() {

                $scope.nextPage = $scope.nextPage + 1;
                ReadyData($scope.nextPage);
                pullUpEl.removeClass('loading');
                //pullUpL.html('上拉显示更多...');
                pullUpEl['class'] = pullUpEl.attr('class');
                pullUpEl.attr('class', '').hide();
                //myScroll.refresh();
                loadingStep = 0;
            }, 1000);
        }


        function loaded() {
            pullDownEl = $('#pullDown');
            pullDownL = pullDownEl.find('.pullDownLabel');
            pullDownEl['class'] = pullDownEl.attr('class');
            pullDownEl.attr('class', '').hide();
            pullUpEl = $('#pullUp');
            pullUpL = pullUpEl.find('.pullUpLabel');
            pullUpEl['class'] = pullUpEl.attr('class');
            pullUpEl.attr('class', '').hide();
            myScroll = new IScroll('#content', {
                probeType: 2, //probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。  
                scrollbars: true, //有滚动条  
                mouseWheel: true, //允许滑轮滚动  
                fadeScrollbars: true, //滚动时显示滚动条，默认影藏，并且是淡出淡入效果  
                bounce: true, //边界反弹  
                interactiveScrollbars: true, //滚动条可以拖动  
                shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩。'clip' or 'scale'.  
                click: true, // 允许点击事件  
                keyBindings: true, //允许使用按键控制  
                momentum: true // 允许有惯性滑动  
            });
            //滚动时  
            myScroll.on('scroll', function() {

                if (loadingStep == 0 && !pullDownEl.attr('class').match('flip|loading') && !pullUpEl.attr('class').match('flip|loading')) {
                    if (this.y > 5) {
                        //下拉刷新效果  
                        pullDownEl.attr('class', pullUpEl['class'])
                        pullDownEl.show();
                        myScroll.refresh();
                        pullDownEl.addClass('flip');
                        // pullDownL.html('准备刷新...');
                        $(".remark-text").removeClass("hide");
                        loadingStep = 1;
                    } else if (this.y < (this.maxScrollY - 5)) {
                        //上拉刷新效果  
                        pullUpEl.attr('class', pullUpEl['class'])
                        pullUpEl.show();
                        myScroll.refresh();
                        pullUpEl.addClass('flip');
                        // pullUpL.html('准备刷新...');
                        $(".remark-text").removeClass("hide");
                        loadingStep = 1;
                    }
                }
            });
            //滚动完毕  
            myScroll.on('scrollEnd', function() {
                if (loadingStep == 1) {
                    if (pullUpEl.attr('class').match('flip|loading')) {
                        pullUpEl.removeClass('flip').addClass('loading');
                        pullUpL.html('Loading...');
                        loadingStep = 2;
                        pullUpAction();
                    } else if (pullDownEl.attr('class').match('flip|loading')) {
                        pullDownEl.removeClass('flip').addClass('loading');
                        pullDownL.html('Loading...');
                        loadingStep = 2;
                        pullDownAction();
                    }
                }
                $(".remark-text").addClass("hide");
            });

        }
        angular.element("#colntent").ready(loaded);
    }]);
