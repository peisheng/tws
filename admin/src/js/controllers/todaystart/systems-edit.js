 app.controller('SystemsEditCtrl', ['$scope', "$http", "FileUploader", "$timeout", "$stateParams", "$state", "$localStorage", "$window",
     function($scope, $http, FileUploader, $timeout, $stateParams, $state, $localStorage, $window) {


         $scope.form = {
             id: 0,
             name: "",
             value: "",
             group: ""
         };
         $scope.isView = !$localStorage.edit;
         $scope.imgList = [];

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


         var uploader = $scope.uploader = new FileUploader({
             url: _Api + '/file/upload'
         });

         uploader.filters.push({
             name: 'customFilter',
             fn: function(item /*{File|FileLikeObject}*/ , options) {
                 //$scope.currentImageList = [];
                 return this.queue.length < 30;
             }
         });

         $scope.ckUpload = function() {
             $("#myUpload").click();
         }

         uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
             console.info('onWhenAddingFileFailed', item, filter, options);
         };
         uploader.onAfterAddingFile = function(fileItem) {
             // console.info('onAfterAddingFile', fileItem);
             uploader.uploadAll();

         };
         uploader.onAfterAddingAll = function(addedFileItems) {
             // console.info('onAfterAddingAll', addedFileItems);
         };
         uploader.onBeforeUploadItem = function(item) {
             // console.info('onBeforeUploadItem', item);
         };
         uploader.onProgressItem = function(fileItem, progress) {
             // console.info('onProgressItem', fileItem, progress);
         };
         uploader.onProgressAll = function(progress) {
             // console.info('onProgressAll', progress);
         };
         uploader.onSuccessItem = function(fileItem, response, status, headers) {
             if (response.length > 0) {
                 $scope.imgList.push(response[0]);
                 var obj = [];
                 if ($scope.form.value)
                     obj = $scope.form.value.split(',');
                 obj.push(response[0].id);
                 $scope.form.value = obj.join(',');
                 $scope.$apply();
             }

         };
         uploader.onErrorItem = function(fileItem, response, status, headers) {
             // console.info('onErrorItem', fileItem, response, status, headers);
         };
         uploader.onCancelItem = function(fileItem, response, status, headers) {
             // console.info('onCancelItem', fileItem, response, status, headers);
         };
         uploader.onCompleteItem = function(fileItem, response, status, headers) {
             // console.info('onCompleteItem', fileItem, response, status, headers);
         };
         uploader.onCompleteAll = function() {};

         if (!!$stateParams.id) {
             $http({
                 method: "GET",
                 url: _Api + "/admin/setting/get",
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
                 if (data.name.indexOf("logo") > -1 || data.name.indexOf("image") > -1) {
                     $scope.isImage = true;
                     $http({
                         method: "GET",
                         url: _Api + "/file/get",
                         params: {
                             ids: data.value.split(',')
                         }
                     }).success(function(resData) {
                         $scope.imgList = resData;
                         $scope.$apply();
                     });

                 } else {
                     $scope.isImage = false;
                 }
                 $scope.$apply();

             });
         };


         $scope.ckSave = function() {


             $("#dictForm").isValid(function(v) {
                 if (v) {
                     var postData = $scope.form;
                     var q = $http({
                         method: "POST",
                         url: _Api + "/admin/setting/save",
                         data: {
                             "set": postData
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

         $scope.removeImg = function(id) {

             layer.confirm("确定要删除当前图片吗？", {
                 btn: ["确定", "取消"]
             }, function() {
                 var list = [];
                 for (var i = 0; i < $scope.imgList.length; i++) {
                     var item = $scope.imgList[i];
                     if (item.id != id) {
                         list.push(item);
                     }
                 }
                 $scope.imgList = list;
                 var obj = [];
                 if (list.length > 0) {
                     for (var i = 0; i < list.length; i++) {
                        var item=list[i];                      
                         obj.push(item.id);
                     }
                     $scope.form.value = obj.join(',');
                 }
                 $scope.$apply();
                 layer.closeAll();
             }, function() {
                 layer.closeAll();
             });
         }

         $scope.openBigImg = function(imagePath) {
             window.open(imagePath);
         }








     }
 ]);
