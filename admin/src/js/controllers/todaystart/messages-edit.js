app.controller('MessagesEditCtrl', ['$scope', "$http", "$timeout",
    "$stateParams", "$state", "$localStorage",
    function($scope, $http, $timeout, $stateParams, $state, $localStorage, $window) {

        $scope.form = {
            "id": 0,
            "name":"",
            "email":"",
            "phone":"",
            "content":""
        };
        $scope.isView = true;
        if (!!$stateParams.id) {
            $http({
                method: "GET",
                url: _Api + "/admin/contactmsg/get",
                params: {
                    id: $stateParams.id
                }
            }).success(function(data) {
                $scope.form = data;
            });

        };


         
    }
]);
