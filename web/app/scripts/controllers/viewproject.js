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

        $scope.shareData = {
            title: $scope.project.descript,
            link: location.href,
            imgUrl: "http://" + location.host + "/" + $scope.project.main_image_path,
            desc: $scope.project.descript
        };
    });

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



    var ticket = $http({
        method: "GET",
        url: shareApiUrl,
        params: {
            shareUrl: shareUrl
        }
    });
    ticket.success(function(data) {
        //  readyWeiXinConfig(data.appId, data.timestamp, data.nonceStr, data.signature);
    });


    function readyWeiXinConfig(appId, timestamp, nonceStr, signature) {
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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

        // if (!!WeixinJSBridge) {
        //     WeixinJSBridge.invoke("shareTimeline", {
        //         "img_url": $scope.shareData.imgUrl,
        //         "link": $scope.shareData.link,
        //         "desc": $scope.shareData.desc,
        //         "title": $scope.shareData.title
        //     });
        // }
        // // console.log(shareData);
        // wx.onMenuShareTimeline({
        //     title: shareData.title,
        //     link: shareData.link,
        //     imgUrl: shareData.imgUrl,
        //     trigger: function(res) {
        //         // alert("用户点击分享到朋友圈");
        //         //console.log("用户点击分享到朋友圈");
        //     },
        //     success: function(res) {
        //         //  alert("已分享");
        //         // console.log("已分享");
        //     },
        //     cancel: function(res) {
        //         //alert('已取消');
        //         //console.log("已取消");
        //     },
        //     fail: function(res) {
        //         //alert('失败');
        //         //alert(JSON.stringify(res));
        //     }
        // });


        // title: $scope.project.descript,
        //            link: location.href,
        //            imgUrl: "http://" + location.host + "/" + $scope.project.main_image_path,
        //            desc: $scope.project.descript

        alert("click send contact");
        //weixinShareTimeline($scope.shareData.title, $scope.shareData.desc, $scope.shareData.link, $scope.shareData.imgUrl);
        // weixinSendAppMessage($scope.shareData.title, $scope.shareData.desc, $scope.shareData.link, $scope.shareData.imgUrl);

        // weixinShareWeibo($scope.shareData.title, $scope.shareData.link);
        weixinAddContact("szwzscom");
        alert("after click");
    };



    //分享到朋友圈
    function weixinShareTimeline(title, desc, link, imgUrl) {
        WeixinJSBridge.invoke('shareTimeline', {
            "img_url": imgUrl,
            "link": link,
            "desc": desc,
            "title": title
        });
    }
    //发送给好友
    function weixinSendAppMessage(title, desc, link, imgUrl) {
        WeixinJSBridge.invoke('sendAppMessage', {
            "appid": appId,
            "img_url": imgUrl,
            "link": link,
            "desc": desc,
            "title": title
        });
    };

    //分享到腾讯微博
    function weixinShareWeibo(title, link) {
        WeixinJSBridge.invoke('shareWeibo', {
            "content": title + link,
            "url": link


        });
    };

    //关注指定的微信号
    function weixinAddContact(name) {
        WeixinJSBridge.invoke("addContact", {
            webtype: "1",
            username: name
        }, function(e) {
            WeixinJSBridge.log(e.err_msg);
            //e.err_msg:add_contact:added 已经添加    
            //e.err_msg:add_contact:cancel 取消添加   
            //e.err_msg:add_contact:ok 添加成功     
            if (e.err_msg == 'add_contact:added' || e.err_msg == 'add_contact:ok') {
                //关注成功，或者已经关注过     
            }
        })
    };




});
