app.controller('ProjectsEditCtrl', ['$scope', "$http", "taSelection", "FileUploader", "$timeout", "$stateParams", "$state", "$localStorage", "$window",
    function($scope, $http, taSelection, FileUploader, $timeout, $stateParams, $state, $localStorage, $window) {

        $scope.articleTypeList = [];
        $scope.imgList = [];
        $scope.showMore = false;
        $scope.project_type_list = ['住宅', '办公', '商业', '酒店', '餐厅', '别墅', '公共', '其它'];
        $scope.form = {
            'title': '',
            'descript': "",
            'type_id': "",
            'content': "",
            'project_contact_phone': "",
            'project_address': '',
            'project_action_company': "",
            'project_design_company': '',
            'project_type': "",
            'project_name': "",
            'project_area': "",
            'product_metal': "",
            "product_ruler": "",
            "product_cence": "",
            "product_price": "",
            "product_address": "",
            'is_product': 0,
            'main_image_path': "",
            'company_id': $localStorage.company_id,
            'is_company_intro': "0",
            "id": 0,
            "view_count": 0,
            "is_publish": 0
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
                $scope.currentImageList.push(response[0]);
                $scope.$apply();

            }
            // $scope.logo_path = response.file_path;
            // $scope.form.logo_path = $scope.logo_path;
            // $("#logo_path").val($scope.logo_path);
            // $scope.$apply();
            // console.info('onSuccessItem', fileItem, response, status, headers);
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

            var html = "";
            $.each($scope.currentImageList, function(i, item) {
                // umEditor.execCommand("insertimage", [{
                //     src: item.small_path
                // }]);
                html = html + "<p><img src='" + item.small_path + "' /></p>";

            });
            umEditor.execCommand("inserthtml", html);

        };

        //绑定下拉列表
        (function() {

            function readyArticleList() {
                $http({
                    method: "GET",
                    url: _Api + "/admin/dictionary/GetArticleTypeList"
                }).success(function(data) {
                    $scope.articleTypeList = data;
                    if (!!$stateParams.id) {
                        $http({
                            method: "GET",
                            url: _Api + "/admin/project/get",
                            params: {
                                id: $stateParams.id
                            }
                        }).success(function(data) {
                            $scope.form = {
                                "id": data.id,
                                'title': data.title,
                                'descript': data.descript,
                                'project_contact_phone': data.project_contact_phone,
                                'project_address': data.project_address,
                                'project_action_company': data.project_action_company,
                                'project_design_company': data.project_design_company,
                                'project_type': data.project_type,
                                'project_name': data.project_name,
                                'project_area': data.project_area,
                                'product_metal': data.product_metal,
                                "product_ruler": data.product_ruler,
                                "product_cence": data.product_cence,
                                "product_price": data.product_price,
                                "product_address": data.product_address,
                                'is_product': data.is_product,
                                'type_id': data.type_id,
                                'content': data.content.replace(/font-family/ig, "fon2t-fa-mily"),
                                'main_image_path': data.main_image_path,
                                'company_id': data.company_id,
                                'is_company_intro': data.is_company_intro,
                                "view_count": data.view_count,
                                "is_publish": data.is_publish
                            };
                            umEditor.setContent(data.content);
                            $scope.showMore = true;
                            if (data.is_publish == 0) {
                                $scope.showPublishBtn = true;
                                $scope.showNoPublishBtn = false;
                            }
                            if (data.is_publish == 1) {
                                $scope.showPublishBtn = false;
                                $scope.showNoPublishBtn = true;
                            };
                        });
                    }
                });
            };
            readyArticleList();

        })();


        $scope.ckPublish = function(type) {
            var params = {
                id: $scope.form.id,
                type: type
            };
            $http({
                method: "GET",
                url: _Api + "/admin/project/setpublish",
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


        UM.getEditor('container', {
            //传入配置参数,可配参数列表看umeditor.config.js 

        }).destroy();
        var umEditor = UM.getEditor('container', {
            //传入配置参数,可配参数列表看umeditor.config.js 

        });


        $("#projectForm").validator({
            stopOnError: false,
            timely: true,
            fields: {
                'title': 'required;',
                'descript': "length[2~200]",
                'type_id': "required;",
                'content': "required;length[20~]",
                'main_image_path': "required;",
                'view_count': "digits;",
                'project_contact_phone': 'length[6~13]',
                'project_address': 'length[~20]',
                'project_action_company': 'length[~20]',
                'project_design_company': 'length[~20]',
                'project_type': 'length[~10]',
                'project_name': 'length[~20]',
                'project_area': 'digits;',
                'product_metal': 'length[~20]',
                "product_ruler": 'length[~20]',
                "product_cence": 'length[~20]',
                "product_price": 'length[~20]',
                "product_address": 'length[~20]'
            }
        });


        $scope.ckChangeCheck = function($event) {
            if (!!$scope.form.id > 0) {
                if ($scope.form.is_company_intro == 1) {
                    var msg = "确定设内容简介吗？";
                } else {
                    var msg = "确定修改为非内容简介吗？";
                }
                layer.confirm(msg, {
                        btn: ['确定', '取消']
                    },
                    function() {
                        layer.closeAll();

                    },
                    function() {
                        if ($scope.form.is_company_intro == 1) {
                            $scope.form.is_company_intro = 0;
                        } else {
                            $scope.form.is_company_intro = 1;
                        }
                        $scope.$apply();
                        layer.closeAll();
                    });

            }

        };
        $scope.ckSave = function() {
            $("#projectForm").isValid(function(v) {
                if (v) {
                    var postData = $scope.form;
                    postData.content = umEditor.getContent();
                    if (!!$stateParams.id) {
                        postData.id = $stateParams.id;
                    } else {
                        var isAdd = true;
                    }
                    var q = $http({
                        method: "POST",
                        url: _Api + "/admin/project/save",
                        data: {
                            "proj": JSON.stringify(postData)
                        }
                    });
                    q.success(function(data) {
                        if (data.result) {
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

        $scope.setMainPath = function(path) {
            $scope.form.main_image_path = path;
        }




        $scope.addImg = function(imgpath) {
            var img = "<p><img  src='" + imgpath + "'/></p>";
            // var element = $(img);


            //  taSelection.insertHTML(img);
            //insertTextAtCursor(img);
            umEditor.execCommand("inserthtml", img);



        }

    }
]);
