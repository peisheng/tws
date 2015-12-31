app.controller('ProjectsCtrl', ['$scope', "$http", "$state", "$localStorage", function($scope, $http, $state, $localStorage) {
    var page_size = 10;
    $scope.keyword = "";
    var getDataList = function() {
        var params = {
            page_index: $scope.paginationConf.currentPage,
            page_size: $scope.paginationConf.itemsPerPage,
            keyword: $scope.keyword
        }

        var q = $http({
            method: "GET",
            url: _Api + "/admin/project/list",
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
        $state.go("app.projects-edit", {
            id: id
        });
    }

    $scope.ckEdit = function(id) {
        $localStorage.edit = true;
        $state.go("app.projects-edit", {
            id: id
        });
    }

    $scope.ckAdd = function() {
        $localStorage.edit = true;
        $localStorage.company_id = 0;
        $state.go("app.projects-edit");
    }

    $scope.ckDelete = function(id) {
        if (!!id) {
            layer.confirm("确定要删除当前的文章吗？", {
                btn: ["确定", "取消"]
            }, function() {
                $http({
                    method: "POST",
                    url: _Api + "/admin/project/delete",
                    data: {
                        id: id
                    }
                }).success(function(data) {
                    if (data.result) {
                        layer.msg("删除成功");
                        getDataList();
                    } else {
                        layer.msg("删除失败，请联系管理员");
                    }
                });
            }, function() {
                layer.closeAll();
            });

        }
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

    $scope.ckAddProject = function() {
        $localStorage.edit = true;
        $state.go("app.projects-edit");
    }
}]);
