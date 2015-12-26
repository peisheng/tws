app.controller('ProjectsCtrl', ['$scope', "$http", "$state", "$localStorage", function($scope, $http, $state, $localStorage) {
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
