app.controller('CompanysCtrl', ['$scope', "$http", function($scope, $http) {
    var page_size = 15;
    $scope.keyword = "";
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

    $scope.ckView = function() {
        throw "";
    }


    $scope.ckEdit = function() {
        throw "";
    }

    $scope.ckDelete = function() {
        throw "";
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
