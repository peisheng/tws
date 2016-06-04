app.controller('SystemsCtrl', ['$scope', "$http", "$state", "$localStorage", function($scope, $http, $state, $localStorage) {
    var page_size = 20;
    $scope.group = "";
    var getDataList = function() {
        var params = {
            page_index: $scope.paginationConf.currentPage,
            page_size: $scope.paginationConf.itemsPerPage,
            group: $scope.group
        };
        var q = $http({
            method: "GET",
            url: _Api + "/admin/setting/list",
            params: params
        });
        q.success(function(data) {
            //$scope.paginationConf.totalItems = data.total_count;
            $scope.items = data;
        });
    }

   

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
