app.controller('SystemsCtrl', ['$scope', "$http", "$state", "$localStorage", function($scope, $http, $state, $localStorage) {
    var page_size = 10;
    $scope.group = "";
    var getDataList = function() {
        var params = {
            page_index: $scope.paginationConf.currentPage,
            page_size: $scope.paginationConf.itemsPerPage,
            group: $scope.group
        };
        var q = $http({
            method: "GET",
            url: _Api + "/admin/dictionary/list",
            params: params
        });
        q.success(function(data) {
            $scope.paginationConf.totalItems = data.total_count;
            $scope.items = data.items;
        });
    }

    $scope.groupList = [];

    $http({
        method: "GET",
        url: _Api + "/admin/dictionary/grouplist"
    }).success(function(data) {
        $scope.groupList = data;
    });

    $scope.ckAdd = function() {
        $localStorage.edit = true;
        $state.go("app.systems-edit");
    }


    $scope.ckView = function(id) {
        $localStorage.edit = false;
        $state.go("app.systems-edit", {
            id: id
        });
    };
    $scope.ckEdit = function(id) {
        $localStorage.edit = true;
        $state.go("app.systems-edit", {
            id: id
        });
    };
    $scope.ckDelete = function(id) {
        if (!!id) {
            layer.confirm("确定要删除这个配置吗？", {
                btn: ["确定", "取消"]
            }, function() {
                $http({
                    method: "GET",
                    url: _Api + "/admin/dictionary/delete",
                    params: {
                        id: id
                    }
                }).success(function(data) {
                    if (data.result) {
                        layer.msg("删除成功");
                        getDataList();
                    } else {
                        layer.msg("删除失败,已被别的表引用，请联系管理员");
                    }
                });

            }, function() {
                layer.closeAll();
            });

        }

    }


    $scope.ckSearch = function() {
        $scope.paginationConf.currentPage = 1;
        getDataList();
    }

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: page_size,
        pagesLength: 10,
        perPageOptions: [10, 20, 50],
        onChange: function(e) {}
    };

    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function() {
        getDataList();
    });
}]);
