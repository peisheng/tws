 app.controller('SystemsEditCtrl', ['$scope', "$http", "$timeout",
     "$stateParams", "$state", "$localStorage",
     function($scope, $http, $timeout, $stateParams, $state, $localStorage, $window) {


         $scope.form = {
             id: 0,
             name: "",
             value: "",
             group: ""
         };

         $scope.isView = !$localStorage.edit;

         $("#dictForm").validator({
             stopOnError: false,
             timely: true,
             fields: {
                 name: "required;",
                 value: "required;",
                 group: "required;"
             }
         });


         $scope.groupList = [];

         $http({
             method: "GET",
             url: _Api + "/admin/dictionary/grouplist"
         }).success(function(data) {
             $scope.groupList = data;
         });

         if (!!$stateParams.id) {
             $http({
                 method: "GET",
                 url: _Api + "/admin/dictionary/getdictbyid",
                 params: {
                     id: $stateParams.id
                 }
             }).success(function(data) {
                 $scope.form = {
                     id: data.id,
                     name: data.name,
                     value: data.value,
                     group: data.group
                 };
             });
         };


         $scope.ckSave = function() {


             $("#dictForm").isValid(function(v) {
                 if (v) {
                     var postData = $scope.form;
                     var q = $http({
                         method: "POST",
                         url: _Api + "/admin/dictionary/save",
                         data: {
                             "dict": JSON.stringify(postData)
                         }
                     });
                     q.success(function(data) {
                         if (data.result) {
                             layer.msg("保存成功", {
                                 time: 1000
                             });
                             $scope.form.id = data.id;

                         } else {
                             layer.msg("保存失败", {
                                 time: 1000
                             });
                         }
                     });
                 }
             });
         }









     }
 ]);
