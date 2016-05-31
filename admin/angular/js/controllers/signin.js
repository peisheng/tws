'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', "$localStorage", function($scope, $http, $state, $localStorage) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
        $scope.authError = null;
        // Try to login
        $http.post(_Api + '/admin/account/login', {
                username: $scope.user.username,
                password: $scope.user.password,
                return_url: ""
            })
            .then(function(response) {
                if (!response.data.result) {
                    $scope.authError = '用户名或者密码不正确';
                } else {
                    $localStorage.username = response.data.username;
                    $state.go('app.dashboard-v1');
                }
            }, function(x) {
                $scope.authError = '服务器异常';
            });
    };
}]);
