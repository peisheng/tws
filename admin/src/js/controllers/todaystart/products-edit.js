app.controller('ProductsEditCtrl', ['$scope', "$http", "taSelection", "FileUploader", "$timeout", "$stateParams", "$state", "$localStorage", "$window",
    function($scope, $http, taSelection, FileUploader, $timeout, $stateParams, $state, $localStorage, $window) {

        $scope.category_list = [];
        $scope.imgList = [];
        $scope.showMore = false;
        $scope.country_list = ['美国', '加拿大', '英国', '法国'];
        $scope.form = {
            "id": "",
            'product_name': '',
            'product_desc': "",
            'categoryid': "",
            'amazon_url': "",
            'germany_amazon_url': "",
            "franch_amazon_url": "",
            "Italy_amazon_url": "",
            "spanish_amazon_url": "",
            "japan_amazon_url": "",
            "uk_amazon_url": "",
            "seo_link_text":"",
            'seo_title': "",
            'seo_keyword': '',
            'seo_desc': "",
            'product_features': '',
            'product_specification': "",
            'is_publish': 0,
            'main_image_id': ""
        };

        $scope.showPublishBtn = false;
        $scope.showNoPublishBtn = false;
        $scope.isView = !$localStorage.edit;




        var uploader = $scope.uploader = new FileUploader({
            url: _Api + '/file/upload'
        });

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                $scope.currentImageList = [];
                return this.queue.length < 30;
            }
        });

        $scope.ckUpload = function() {
                $("#myUpload").click();
            }
            // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            // console.info('onAfterAddingFile', fileItem);
            uploader.uploadAll();

        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            // console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            // console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            // console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if (response.length > 0) {
                $scope.imgList.push(response[0]);
                // $scope.currentImageList.push(response[0]);
                $scope.$apply();

            }

        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            // console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            // console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            // console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            // console.info('onCompleteAll');

            // var html = "";
            // $.each($scope.currentImageList, function(i, item) {
            //     // umEditor.execCommand("insertimage", [{
            //     //     src: item.small_path
            //     // }]);
            //     html = html + "<p><img src='" + item.small_path + "' /></p>";
            // });
            // umEditor.execCommand("inserthtml", html);

        };

        //绑定下拉列表
        (function() {


            function getCategroyList() {
                $http({
                    method: "GET",
                    url: _Api + "/admin/category/list"
                }).success(function(data) {
                    $scope.category = data;
                    $scope.$apply();
                });
            };

            function readyProduct() {
                $http({
                    method: "GET",
                    url: _Api + "/admin/category/list"
                }).success(function(data) {
                    $scope.category_list = data;
                    if (!!$stateParams.id) {
                        $http({
                            method: "GET",
                            url: _Api + "/admin/product/get",
                            params: {
                                id: $stateParams.id
                            }
                        }).success(function(data) {
                            $scope.form = {
                                'product_name': data.product_name,
                                'product_desc': data.product_desc,
                                'categoryid': data.categoryid,
                                'amazon_url': data.amazon_url,
                                'germany_amazon_url': data.germany_amazon_url,
                                "franch_amazon_url": data.franch_amazon_url,
                                "Italy_amazon_url": data.Italy_amazon_url,
                                "spanish_amazon_url": data.spanish_amazon_url,
                                "japan_amazon_url": data.japan_amazon_url,
                                "uk_amazon_url": data.uk_amazon_url,
                                "seo_link_text":data.seo_link_text,
                                'seo_title': data.seo_title,
                                'seo_keyword': data.seo_keyword,
                                'seo_desc': data.seo_desc,
                                'product_features': data.product_features,
                                'product_specification': data.product_specification,
                                'main_image_id': data.main_image_id
                            };
                            $scope.imgList = data.images;
                            sepecialEditor.setContent(data.product_specification);
                            featureEditor.setContent(data.product_features);
                            $scope.showMore = true;
                            if (data.is_publish == 0) {
                                $scope.showPublishBtn = true;
                                $scope.showNoPublishBtn = false;
                            };
                            if (data.is_publish == 1) {
                                $scope.showPublishBtn = false;
                                $scope.showNoPublishBtn = true;
                            };

                            $scope.$apply();
                        });
                    }
                });
            };
            readyProduct();

        })();


        $scope.ckPublish = function(type) {
            var params = {
                id: $stateParams.id,
                type: type
            };
            $http({
                method: "GET",
                url: _Api + "/admin/product/setpublish",
                params: params
            }).success(function(data) {
                $scope.form.is_publish = type;
                if (type > 0) {
                    $scope.showPublishBtn = false;
                    $scope.showNoPublishBtn = true;
                    layer.msg("发布成功");
                } else if (type == 0) {
                    $scope.showPublishBtn = true;
                    $scope.showNoPublishBtn = false;
                    layer.msg("撤消成功");
                }


            });
        }

        $scope.changeShowMore = function() {
            $scope.showMore = true;
        }


        UM.getEditor('product_specification', {
            //传入配置参数,可配参数列表看umeditor.config.js 

        }).destroy();
        var sepecialEditor = UM.getEditor('product_specification', {
            //传入配置参数,可配参数列表看umeditor.config.js 

        });
        UM.getEditor("product_features", {}).destroy();
        var featureEditor = UM.getEditor("product_features", {})


        $("#projectForm").validator({
            stopOnError: false,
            timely: true,
            fields: {
                'product_name': 'required',
                'product_desc': "required;length[2~200]",
                'category_id': "required",
                'amazon_url': "length[5~500]",
                'germany_amazon_url': "length[5~500]",
                "franch_amazon_url": "length[5~500]",
                "Italy_amazon_url": "length[5~500]",
                "spanish_amazon_url": "length[5~500]",
                "japan_amazon_url": "length[5~500]",
                "uk_amazon_url": "length[5~500]",
                'seo_link_text':'length[~255]',
                'seo_title': "length[~150]",
                'seo_keyword': 'length[~200]',
                'seo_desc': "length[~255]",
                'product_features': "required;length[20~]",
                'product_specification': "required;length[20~]",
                'main_image_id': "required;"
            }
        });
        $scope.ckSave = function() {
            $("#projectForm").isValid(function(v) {
                if (v) {
                    if (!$scope.form.main_image_id) {
                        layer.msg("必须先设置一张主图", {
                            time: 1000
                        });
                        return;
                    }
                    var postData = $scope.form;
                    postData.product_features = featureEditor.getContent();
                    postData.product_specification = sepecialEditor.getContent();
                    var imageIds = [];
                    for (var i = 0; i < $scope.imgList.length; i++) {
                        var item = $scope.imgList[i];
                        imageIds.push(item.id);
                    }
                    if (!!$stateParams.id) {
                        postData.id = $stateParams.id;
                    } else {
                        var isAdd = true;
                        postData.id = 0;
                    }
                    var q = $http({
                        method: "POST",
                        url: _Api + "/admin/product/save",
                        data: {
                            "productObj": JSON.stringify(postData),
                            "imageIds": imageIds
                        }
                    });
                    q.success(function(data) {
                        if (data) {
                            layer.msg("保存成功", {
                                time: 1000
                            });
                            $scope.form.id = data.project_id;
                            if (isAdd) {
                                $scope.showPublishBtn = true;
                                $scope.showNoPublishBtn = false;
                            }
                        } else {
                            layer.msg("保存失败", {
                                time: 1000
                            });
                        }

                    });
                }
            });

        };

        $scope.setMainImage = function(id) {
            $scope.form.main_image_id = id;
        }

        $scope.removeImg = function(id) {
            //$scope.form.main_image_id = id;
            if ($scope.form.main_image_id == id) {
                layer.msg("主图不可删除，请先设置其它图片为主图！", { time: 2000 });
                return;
            }
            layer.confirm("确定要删除当前图片吗？", {
                btn: ["确定", "取消"]
            }, function() {
                var list = [];
                for (var i = 0; i < $scope.imgList.length; i++) {
                    var item = $scope.imgList[i];
                    if (item.id != id) {
                        list.push(item);
                    }
                }
                $scope.imgList = list;
                $scope.$apply();
                layer.closeAll();
            }, function() {
                layer.closeAll();
            });
        }

        $scope.openBigImg = function(imagePath) {
            window.open(imagePath);
        }


    }
]);
