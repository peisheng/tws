 app.controller('ChangePasswordCtrl', ['$scope', "$http", "$timeout", "$state", function($scope, $http, $timeout, $state) {
     var $form = $("#passwordForm");
     $form.validator({
         stopOnError: false,
         timely: true,
         fields: {
             'oldPwd': 'required; length[4~30];',
             'newPwd': "required; length[4~30];",
             'reNewPwd': "required; match[eq, newPwd];length[4~30];"
         }
     });
     $scope.ckSave = function() {
         $form.isValid(function(v) {
             if (v) {
                 var postData = $scope.form;

                 var q = $http({
                     method: "POST",
                     url: _Api + "/admin/account/changePassword",
                     data: {
                         oldPwd: postData.oldPwd,
                         newPwd: postData.newPwd
                     }
                 });
                 q.success(function(data) {
                     if (data.result) {
                         layer.msg("修改成功，请重新登录", {
                             time: 5000
                         });
                         setTimeout(function() {
                             $state.go('access.signin');
                         }, 5000);

                     } else {
                         layer.msg("修改失败", {
                             time: 2000
                         });
                     }

                 });
             }
         });
     }



 }]);
