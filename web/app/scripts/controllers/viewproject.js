'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:ViewprojectCtrl
 * @description
 * # ViewprojectCtrl
 * Controller of the webappApp
 */
angular.module('webappApp').controller('ViewprojectCtrl', function($scope, $sce, $routeParams, $http, $location) {
    var id = $routeParams.id;
    $scope.hasCompany = false;
    var url = "/api/project/get?id=" + id;
    $scope.opacity = "0.5";
    var q = $http({
        method: "GET",
        url: url
    });
    q.success(function(data) {

        var content = data.content;
        var p = "<div style='font-size:17px;'></div>";
        var obj = $.parseHTML(p);
        p = $(p).html(content);
        var contentOK = $(p).prop("outerHTML");
        $scope.project = data;
        $scope.company = data.company;
        if (!$scope.company.phone) {
            $scope.company.phone = $scope.company.mobile;
        }
        if (!!$scope.company.name) {
            $scope.hasCompany = true;
        }


        $scope.shareData = {
            title: $scope.project.descript,
            link: location.href,
            imgUrl: "http://" + location.host + "/" + $scope.project.main_image_path,
            desc: $scope.project.descript
        };

        $scope.project.content = $sce.trustAsHtml(contentOK.replace(/font-family/ig, "fon2t-fa-mily"));

        if (!$scope.project.descript) {
            $scope.opacity = "0";
            $scope.project.descript = $sce.trustAsHtml("&nbsp;");
        }
    });

    $scope.ckCompany = function(com_id) {
        $location.path("view-company/" + com_id);
    }

    $scope.isShowShare = true;
    $scope.showMark = false;

    var _url = "/api/project/setviewcount?id=" + id;
    setTimeout(function() {
        var c = $http({
            method: "GET",
            url: _url
        });
        c.success(function() {
            console.log("update sucess");
        });
    }, 3000);

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

        var q = $http({
            method: "GET",
            url: url
        });
        q.success(function(data) {
            var content = data.content;
            var p = "<div style='font-size:17px;'></div>";
            var obj = $.parseHTML(p);
            p = $(p).html(content);
            var contentOK = $(p).prop("outerHTML");
            var descript = "";
            var descript_title = "";
            $scope.project = data;
            $scope.project.content = $sce.trustAsHtml(contentOK.replace(/font-family/ig, "fon2t-fa-mily"));

            $scope.company = data.company;
            if (!$scope.company.phone) {
                $scope.company.phone = $scope.company.mobile;
            }
            if (!!$scope.company.name) {
                $scope.hasCompany = true;
            }
            if (!$scope.project.descript) {
                descript = $scope.project.title;
                descript_title = $scope.project.title;
            } else {
                descript = $scope.project.descript;
                descript_title = descript + "-" + $scope.project.title;
            }

            $scope.shareData = {
                title: $scope.project.descript,
                link: location.href,
                imgUrl: "http://" + location.host + "/" + $scope.project.main_image_path,
                desc: $scope.project.descript
            };

            var title = $scope.shareData.title + '';
            var app_title = $scope.company.name + '';
            if (!app_title) {
                app_title = title;
            }

            var desc = $scope.shareData.desc + '';
            var link = $scope.shareData.link + '';
            var imgUrl = $scope.shareData.imgUrl + '';
            wx.onMenuShareTimeline({
                title: descript_title, // $scope.shareData.title, // 分享标题
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
                title: app_title, // $scope.shareData.title, // 分享标题
                desc: descript_title, //$scope.shareData.desc, // 分享描述
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


    $scope.ckShareToFriends = function() {
        // console.log(shareData);
        $scope.showMark = !$scope.showMark;


    };

    $scope.ckHide = function() {
        $scope.showMark = false;
    }








});
