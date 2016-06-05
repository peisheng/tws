app.controller('CategoryCtrl', ['$scope', "$http","$localStorage","$stateParams", "$state", function($scope, $http,$localStorage,$stateParams, $state) {
    var page_size = 1000;
    var getDataList = function() {
        var params = {
            page_index: $scope.paginationConf.currentPage,
            page_size: $scope.paginationConf.itemsPerPage
        }

        var q = $http({
            method: "GET",
            url: _Api + "/admin/category/list",
            params: params
        });

        q.success(function(data) {
           // $scope.paginationConf.totalItems = data.total_count;
            $scope.items = data;

        });
    }
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: page_size,
        pagesLength: 10,
        perPageOptions: [10, 20, 50],
        onChange: function(e) {}
    };

    $scope.ckAdd = function() {
        $localStorage.edit = true;
        $state.go("app.category-edit");
    }

    $scope.ckView = function(id) {
        $localStorage.edit = false;
        $state.go("app.category-edit", {
            id: id
        });
        $localStorage.edit = false;

    }
    $scope.ckEdit = function(id) {
        $localStorage.edit = true;
        $state.go("app.category-edit", {
            id: id
        });
        $localStorage.edit = true;
    }

    $scope.ckDelete = function(id) {
        if (!!id) {
            layer.confirm("确定要删除这个分类吗？", {
                btn: ["确定", "取消"]
            }, function() {
                $http({
                    method: "GET",
                    url: _Api + "/admin/category/delete",
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
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function() {
        getDataList();
    });
}]);
