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
        $scope.moreText = "正在加载";

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
            $scope.moreText = "正在加载";
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
                            data.items[i].color = "color: rgb(16, 16, 16);";
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
                            topSpacing: 10
                        });
                        $scope.isactive = true;
                    }
                    $(".remark-text").addClass("hide");
                    $scope.moreText = "上滑加载更多";
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



        $scope.ckLoadMore = function() {
            $scope.nextPage = $scope.nextPage + 1;
            ReadyData($scope.nextPage);
        }

        $(window).scroll(function() {
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                if ($scope.showLoadMore) {
                    $scope.ckLoadMore();
                }
            }
        });




        var shareApiUrl = "/api/jssdk/jsapi";
        var shareUrl = location.href;
        setTimeout(function() {
            var ticket = $http({
                method: "GET",
                url: shareApiUrl,
                params: {
                    shareUrl: shareUrl
                }
            });
            ticket.success(function(data) {
                readyWeiXinConfig(data.appId, data.timestamp, data.nonceStr, data.signature);
            });
        }, 500);
        wx.ready(function() {
            var desc = "今日开工-建筑业企业平台";
            var link = shareUrl;
            var imgUrl = 'http://' + location.host + "/web/images/logo.jpg";
            wx.onMenuShareTimeline({
                title: desc, // $scope.shareData.title, // 分享标题
                imgUrl: imgUrl, //$scope.shareData.desc, // 分享描述
                link: link,
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {
                    //alert('已取消');
                    //console.log("已取消");

                },
                fail: function(res) {
                    //alert('失败');
                    //alert(JSON.stringify(res));
                }
            });
            wx.onMenuShareAppMessage({
                title: "今日开工", // $scope.shareData.title, // 分享标题
                desc: desc, //$scope.shareData.desc, // 分享描述
                link: link, //$scope.shareData.link, // 分享链接
                imgUrl: imgUrl, //$scope.shareData.imgUrl, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户确认分享后执行的回调函数

                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });

        });

        function readyWeiXinConfig(appId, timestamp, nonceStr, signature) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature, // 必填，签名，
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            });



        };




    }]);
