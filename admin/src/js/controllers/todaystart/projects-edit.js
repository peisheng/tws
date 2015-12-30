app.controller('ProjectsEditCtrl', ['$scope', "$http", "FileUploader", "$timeout", "$stateParams", "$state", "$localStorage", "$window", function($scope, $http, FileUploader, $timeout, $stateParams, $state, $localStorage, $window) {


    $scope.articleTypeList = [];
    $scope.imgList = [];
    $scope.form = {
        'title': '',
        'descript': "",
        'type_id': "",
        'content': "",
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
            return this.queue.length < 10;
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
                            'type_id': data.type_id,
                            'content': data.content,
                            'main_image_path': data.main_image_path,
                            'company_id': data.company_id,
                            'is_company_intro': data.is_company_intro,
                            "view_count": data.view_count,
                            "is_publish": data.is_publish
                        };
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

    $("#projectForm").validator({
        stopOnError: false,
        timely: true,
        fields: {
            'title': 'required;length[4~14];',
            'descript': "required;",
            'type_id': "required;",
            'content': "required;length[20~]",
            'main_image_path': "required;"
        }
    });

    $scope.ckSave = function() {
        $("#projectForm").isValid(function(v) {
            if (v) {
                var postData = $scope.form;
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

    function addSplitToField($t, myValue) {
        if (document.selection) {
            $t.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
            $t.focus();
        } else if ($t.selectionStart || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
            this.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
        } else {
            $t.value += myValue;
            $t.focus();
        }
    }

    $scope.addImg = function(imgpath) {
        var img = "<p><img  src='" + imgpath + "'/></p>";

        $scope.form.content += img;

    }










}]);
