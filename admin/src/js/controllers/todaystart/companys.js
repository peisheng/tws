app.controller('CompanysCtrl', ['$scope', "$http", "$state", "$localStorage", function($scope, $http, $state, $localStorage) {
    var page_size = 10;
    $scope.keyword = "";
    $scope.showList = true;
    var getDataList = function() {
        var params = {
            page_index: $scope.paginationConf.currentPage,
            page_size: $scope.paginationConf.itemsPerPage,
            keyword: $scope.keyword
        }

        var q = $http({
            method: "GET",
            url: _Api + "/admin/company/list",
            params: params
        });

        q.success(function(data) {
            $scope.paginationConf.totalItems = data.total_count;
            $scope.items = data.items;

        });
    }


    $scope.ckSearch = function() {
        $scope.paginationConf.currentPage = 1;
        getDataList();
    }

    $scope.ckView = function(id) {
        $localStorage.edit = false;
        $state.go("app.companys-edit", {
            id: id
        });
        $localStorage.edit = false;

    }
    $scope.ckEdit = function(id) {
        $localStorage.edit = true;
        $state.go("app.companys-edit", {
            id: id
        });
        $localStorage.edit = true;
    }

    $scope.ckDelete = function(id) {
        if (!!id) {
            layer.confirm("确定要删除这个企业吗？", {
                btn: ["确定", "取消"]
            }, function() {
                $http({
                    method: "GET",
                    url: _Api + "/admin/company/delete",
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
    $scope.ckAdd = function() {
        $localStorage.edit = true;
        $state.go("app.companys-edit");
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
app.controller('CompanysEditCtrl', ['$scope', "$http", function($scope, $http) {


}])
