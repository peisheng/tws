'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:ViewcompanyCtrl
 * @description
 * # ViewcompanyCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
    .controller('ViewcompanyCtrl', function($scope, $sce, $routeParams, $http, $timeout, $location) {
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
            $scope.company.phone = $scope.company.phone || $scope.company.mobile;
            $scope.company.introduce_page.content = $sce.trustAsHtml($scope.company.introduce_page.content);



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
                var desc = $scope.company.name + '的主页';
                var link = shareUrl;
                var imgUrl = 'http://' + location.host + $scope.company.logo_path;
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
                    title: "来自公众号：今日开工", // $scope.shareData.title, // 分享标题
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

        });

        $scope.conActive = "";
        $scope.prjActive = "iactive";
        $scope.showList = true;
        $scope.ckShow = function(type) {
            if (type == 1) {
                $scope.showList = true;
                $scope.conActive = "";
                $scope.prjActive = "iactive";
            } else if (type == 2) {
                $scope.showList = false;
                $scope.conActive = "iactive";
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
            if (window.localStorage) {
                var prj_v_ids = localStorage.getItem("prj_visits");
                if (prj_v_ids != null) {
                    prj_v_ids = JSON.parse(prj_v_ids);
                }
            }

            var p = $http({
                method: "GET",
                url: url
            });
            p.success(function(data) {
                $scope.totalRecord = data.total_count;
                $scope.nextPage = data.current_page + 1;

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

        $scope.ckVisit = function(id) {
            // if (!window.localStorage) {
            //     console.log("not support the localStorage");
            //     return;
            // }
            // var prj_visits = localStorage.getItem("prj_visits");
            // if (prj_visits == null) {
            //     prj_visits = [];
            // } else {
            //     prj_visits = JSON.parse(prj_visits);
            // }

            // prj_visits.push(id);
            // if (prj_visits.length > 100) {
            //     _.sortBy(prj_visits);
            //     while (prj_visits.length > 100) {
            //         prj_visits.shift(0);
            //     }
            // }
            // prj_visits = JSON.stringify(_.uniq(prj_visits));
            // localStorage.setItem("prj_visits", prj_visits);
            $location.path("view-project/" + id);
        }





    });
