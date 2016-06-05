app.controller('PagesEditCtrl', ['$scope', "$http", "taSelection", "FileUploader", "$timeout", "$stateParams", "$state", "$localStorage", "$window",
    function($scope, $http, taSelection, FileUploader, $timeout, $stateParams, $state, $localStorage, $window) {


        $scope.form = {
            "id": "",
            "page_name": "",
            "page_title": "",
            "page_content": ""
        };


        $scope.isView = !$localStorage.edit;


        if ($stateParams.id) {
            $http({
                method: "POST",
                url: _Api + "/admin/page/get",
                params: {
                    "id": $stateParams.id
                }
            }).success(function(data) {
                $scope.form = data;
                contentEditor.setContent(data.page_content);
            });
        }





        UM.getEditor('page_content', {
            //传入配置参数,可配参数列表看umeditor.config.js 

        }).destroy();
        var contentEditor = UM.getEditor('page_content', {
            //传入配置参数,可配参数列表看umeditor.config.js 

        });


        $("#projectForm").validator({
            stopOnError: false,
            timely: true,
            fields: {
                'page_name': 'required;length[2~60]',
                'page_title': "required;length[2~200]",
                'page_content': "required;length[12~]"
            }
        });
        $scope.ckSave = function() {
            $("#projectForm").isValid(function(v) {
                if (v) {

                    var postData = $scope.form;

                    if (!!$stateParams.id) {

                        $scope.form.id = $stateParams.id;
                    } else {
                        var isAdd = true;

                        $scope.form.id = 0;
                    }
                    var q = $http({
                        method: "POST",
                        url: _Api + "/admin/page/save",
                        data: {
                            "page_name": $scope.form.page_name,
                            "page_title": $scope.form.page_title,
                            "page_content": contentEditor.getContent(),
                            "id": $scope.form.id
                        }
                    });
                    q.success(function(data) {
                        if (data) {
                            layer.msg("保存成功", {
                                time: 1000
                            });
                            $scope.form.id = data.id;
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



    }
]);
