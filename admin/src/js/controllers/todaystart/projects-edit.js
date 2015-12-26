app.controller('CompanysEditCtrl', ['$scope', "$http", "FileUploader", "$timeout", "$stateParams", "$state", "$localStorage", "$window", function($scope, $http, FileUploader, $timeout, $stateParams, $state, $localStorage, $window) {


    $scope.articleTypeList = [];

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
        $scope.logo_path = response.file_path;
        $scope.form.logo_path = $scope.logo_path;
        $("#logo_path").val($scope.logo_path);
        $scope.$apply();

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
            });
        }
        readyArticleList();

    })();


    $("#companyForm").validator({
        stopOnError: false,
        timely: true,
        fields: {
            'name': 'required;length[4~14];',
            'type': "required;",
            'province': "required;",
            'city': "required;",
            'address': "required;",
            'logo_path': "required;",
        }
    });






    $scope.ckSave = function() {
        $("#companyForm").isValid(function(v) {
            if (v) {
                var postData = $scope.form;

                var q = $http({
                    method: "POST",
                    url: _Api + "/admin/company/save",
                    data: {
                        "jsonCom": JSON.stringify(postData)
                    }
                });
                q.success(function(data) {
                    if (data.result) {
                        layer.msg("保存成功", {
                            time: 1000
                        });
                        $scope.form.id = data.company_id;
                    } else {
                        layer.msg("保存失败", {
                            time: 1000
                        });
                    }

                });
            }
        });
    }









}]);
