app.controller('MessagesCtrl', ['$scope', "$http", "$timeout",
    "$stateParams", "$state", "$localStorage",
    function($scope, $http, $timeout, $stateParams, $state, $localStorage, $window) {
var page_size = 10;
    $scope.keyword = "";
    $scope.company_id = ""
    var getDataList = function() {
        var params = {
            page_index: $scope.paginationConf.currentPage,
            page_size: $scope.paginationConf.itemsPerPage,
            keyword: $scope.keyword
        }

        var q = $http({
            method: "GET",
            url: _Api + "/admin/contactmsg/list",
            params: params
        });

        q.success(function(data) {
            $scope.paginationConf.totalItems = data.total_count;
            for(var i=0;i<data.items.length;i++)
            {
            	if(data.items[i].is_read)
            	{
            		data.items[i].is_read="已读";
            	}
            	else
            	{
            		data.items[i].is_read="未读";
            	}
            }
            $scope.items = data.items;
        });
    }

    $scope.ckSearch = function() {
        $scope.paginationConf.currentPage = 1;
        getDataList();
    }


    $scope.ckUserView = function(id) {

        $localStorage.edit = false;
        $state.go("app.messages-edit", {
            id: id
        });
    }

    $scope.ckUserEdit = function(id) {

        $localStorage.edit = true;
        $state.go("app.messages-edit", {
            id: id
        });
    }
    $scope.ckUserDelete = function(id) {
        var user_id = id;
        if (!!user_id) {
            layer.confirm("确定要删除当前记录吗？", {
                btn: ["确定", "取消"]
            }, function() {
                $http({
                    method: "POST",
                    url: _Api + "/admin/contactmsg/delete",
                    data: {
                        id: user_id
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
}
]);