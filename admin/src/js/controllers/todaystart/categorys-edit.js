app.controller('CategoryEditCtrl', ['$scope', "$http", "$timeout",
    "$stateParams", "$state", "$localStorage",
    function($scope, $http, $timeout, $stateParams, $state, $localStorage, $window) {
        $scope.form = {
            id: 0,
            category_name: "",
            parent_id: "",
            sort: ""
        };
        $scope.isView = !$localStorage.edit;

        $("#UserForm").validator({
            stopOnError: false,
            timely: true,
            fields: {
                "category_name": 'required;length[2~14];',
                "sort": "number"
            }
        });


        if (!!$stateParams.id) {
            $http({
                method: "GET",
                url: _Api + "/admin/category/get",
                params: {
                    id: $stateParams.id
                }
            }).success(function(data) {
                $scope.form = {
                    id: data.id,
                    category_name: data.category_name,
                    parent_id: data.parent_id,
                    sort: data.sort
                };

                $http({
                    method: "GET",
                    url: _Api + "/admin/category/list"
                }).success(function(data) {
                    // var obj = [];
                    // var len = data.length;
                    // if (len > 0) {
                    //     for (var i = 0; i < data.length; i++) {
                    //         if(!data[i].parent_id)
                    //         {
                    //             obj.push(data[i]);
                    //         }
                    //     }
                    // }
                    $scope.category_list = data;
                });
            });
        } else {
            $http({
                method: "GET",
                url: _Api + "/admin/category/list"
            }).success(function(data) {
                $scope.category_list = data;
            });
        }





        $scope.ckSave = function() {

            $("#UserForm").isValid(function(v) {
                if (v) {
                    if ($scope.form.id > 0 && ($scope.form.id == $scope.form.parent_id)) {
                        layer.msg("你选择的父分类是当前分类，请重新选择或者选择空", { time: 2000 });
                        return;
                    };
                    var postData = $scope.form;
                    if(!$scope.form.sort)
                    {
                        $scope.form.sort=0;
                    }
                    var q = $http({
                        method: "POST",
                        url: _Api + "/admin/category/save",
                        data: {
                            category_name: $scope.form.category_name,
                            parent_id: $scope.form.parent_id,
                            sort: $scope.form.sort,
                            id: $scope.form.id
                        }
                    });
                    q.success(function(data) {
                        if (data) {
                            layer.msg("保存成功", {
                                time: 1000
                            });
                            if(!$scope.form.id)
                            {
                                history.back();
                            }                            
                        } else {
                            layer.msg("保存失败", {
                                time: 1000
                            });
                        }

                    });
                }
            });
        }









    }
]);
