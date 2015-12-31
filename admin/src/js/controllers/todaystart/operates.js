app.controller('OperatesCtrl', ['$scope', "$http", function($scope, $http) {
    var page_size = 10;
    var getDataList = function() {
        var params = {
            page_index: $scope.paginationConf.currentPage,
            page_size: $scope.paginationConf.itemsPerPage
        }

        var q = $http({
            method: "GET",
            url: _Api + "/admin/operate/list",
            params: params
        });

        q.success(function(data) {
            $scope.paginationConf.totalItems = data.total_count;
            $scope.items = data.items;

        });
    }

    $scope.clearLog = function(type) {

        layer.confirm('确定要清空吗？', {
            btn: ['确定', '取消'] //按钮
        }, function() {
            var q = $http({
                method: "GET",
                url: _Api + "/admin/operate/clear" + "?type=" + type
            });
            q.success(function(data) {
                if (data.result) {
                    layer.msg("操作成功", {
                        time: 1000
                    });
                    getDataList();
                } else {
                    layer.msg("操作失败", {
                        time: 1000
                    });
                }
            });
        }, function() {
            layer.closeAll();
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

    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function() {
        getDataList();
    });
}]);
