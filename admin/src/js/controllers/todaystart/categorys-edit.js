app.controller('CategoryEditCtrl', ['$scope', "$http", "$timeout",
    "$stateParams", "$state", "$localStorage",
    function($scope, $http, $timeout, $stateParams, $state, $localStorage, $window) {
        $scope.form = {
            "id": 0,
            'user_name': '',
            'real_name': "",
            'qq_number': "",
            'phone': "",
            'mobile': "",
            'email': "",
            'isAdmin': "",
            'company_id': null
        };
        $scope.isView = !$localStorage.edit;

        $("#UserForm").validator({
            stopOnError: false,
            timely: true,
            fields: {
                'user_name': 'required;length[2~14];',
                'real_name': "required;",
                'phone': "required;",
                'mobile': "required;mobile;",
                'email': "required;email;",
                'is_admin': "required;"
            }
        });


        if (!!$stateParams.id) {
            $http({
                method: "GET",
                url: _Api + "/admin/user/get",
                params: {
                    id: $stateParams.id
                }
            }).success(function(data) {
                $scope.form = {
                     id:data.id,
                     category_name:data.category_name,
                     parent_id:data.parent_id,
                     sort:data.sort             
                };
            });

        };


        $scope.ckSave = function() {
            var company_id = $localStorage.company_id;
            if (!company_id) {
                layer.msg("参数不合法，企业Id不能为空");
                return;
            }
            $scope.form.company_id = company_id;
            $("#UserForm").isValid(function(v) {
                if (v) {
                    var postData = $scope.form;
                    var q = $http({
                        method: "POST",
                        url: _Api + "/admin/category/save",
                        data: {
                            
                        }
                    });
                    q.success(function(data) {
                        if (data.result) {
                            layer.msg("保存成功", {
                                time: 1000
                            });
                            $scope.form.id = data.user_id;

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
