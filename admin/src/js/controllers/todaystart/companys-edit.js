 app.controller('CompanysEditCtrl', ['$scope', "$http", "FileUploader", "$timeout", "$stateParams", function($scope, $http, FileUploader, $timeout, $stateParams) {


     $scope.companyTypeList = [];
     $scope.provinceList = [];
     $scope.cityList = [];
     $scope.projectItems = [];
     $scope.userItems = [];
     $scope.form = {
         name: "",
         type: "",
         city_id: "",
         province: "",
         address: "",
         site_url: "",
         logo_path: ""
     };



     //上传
     $scope.paginationConf = {
         currentPage: 1,
         totalItems: 0,
         itemsPerPage: page_size,
         pagesLength: 10,
         perPageOptions: [10, 20, 50],
         onChange: function(e) {}
     };

     var uploader = $scope.uploader = new FileUploader({
         url: _Api + '/file/upload'
     });

     uploader.filters.push({
         name: 'customFilter',
         fn: function(item /*{File|FileLikeObject}*/ , options) {
             return this.queue.length < 10;
         }
     });

     $scope.ckUpload = function() {
             $("#myUpload").click();
         }
         // CALLBACKS

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
         $scope.logo_path = response.file_path;
         $scope.form.logo_path = $scope.logo_path;
         $("#logo_path").val($scope.logo_path);
         $scope.$apply();

         // console.info('onSuccessItem', fileItem, response, status, headers);
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
     uploader.onCompleteAll = function() {
         // console.info('onCompleteAll');
     };

     //绑定下拉列表
     (function() {

         function readyCompanyList() {
             $http({
                 method: "GET",
                 url: _Api + "/admin/dictionary/GetCompanyTypeList"
             }).success(function(data) {
                 $scope.companyTypeList = data;
             });
         }

         function provinceList() {
             $http({
                 method: "GET",
                 url: _Api + "/admin/city/getprovinces"
             }).success(function(data) {
                 $scope.provinceList = data;
                 if (!!$stateParams.id) {
                     $http({
                         method: "GET",
                         url: _Api + "/admin/company/get",
                         params: {
                             id: $stateParams.id
                         }
                     }).success(function(data) {
                         $scope.form = {
                             id: data.id,
                             name: data.name,
                             type: data.type_id,
                             city_id: data.city_id,
                             province: data.province,
                             address: data.address,
                             site_url: data.site_url,
                             logo_path: data.logo_path
                         };
                     });
                 }
             });
         }

         function cityList() {
             $http({
                 method: "GET",
                 url: _Api + "/admin/city/getcitys"
             }).success(function(data) {
                 $scope.cityList = data;
             });
         }
         readyCompanyList();
         provinceList();
         cityList();
     })();


     $("#companyForm").validator({
         stopOnError: false,
         timely: true,
         fields: {
             'name': 'required;length[4~14];',
             'type': "required;",
             'province': "required;",
             'city': "required;",
             'address': "required;",
             'logo_path': "required;",
         }
     });
     $scope.ckSave = function() {
         $("#companyForm").isValid(function(v) {
             if (v) {
                 var postData = $scope.form;

                 var q = $http({
                     method: "POST",
                     url: _Api + "/admin/company/save",
                     data: {
                         "jsonCom": JSON.stringify(postData)
                     }
                 });
                 q.success(function(data) {
                     if (data.result) {
                         layer.msg("保存成功", {
                             time: 1000
                         });
                         $scope.form.id = data.company_id;
                     } else {
                         layer.msg("保存失败", {
                             time: 1000
                         });
                     }

                 });
             }
         });
     }



     $scope.tabArticle = function() {
         if (!$scope.isShowArticle) {
             $scope.articeActive = "active";
             $scope.userActive = "";
             $scope.isShowArticle = true;
             $scope.isShowUser = false;
             $scope.paginationConf.currentPage = 1;
             $scope.project_keyword = "";
             if (!!$scope.form.id) {
                 getProjectDataList();
             }
         }

     }

     $scope.tabUser = function() {
         if (!$scope.isShowUser) {
             $scope.articeActive = "";
             $scope.userActive = "active";
             $scope.isShowArticle = false;
             $scope.isShowUser = true;
             $scope.paginationConf.currentPage = 1;
             $scope.user_keyword = "";
             if (!!$scope.form.id) {
                 getUserDataList();
             }
         }
     }



     var page_size = 15;
     $scope.user_keyword = "";
     $scope.company_id = ""
     var getUserDataList = function() {
         var params = {
             page_index: $scope.paginationConf.currentPage,
             page_size: $scope.paginationConf.itemsPerPage,
             keyword: $scope.keyword,
             company_id: $scope.form.id
         };
         var q = $http({
             method: "GET",
             url: _Api + "/admin/company/getusers",
             params: params
         });
         q.success(function(data) {
             $scope.paginationConf.totalItems = data.total_count;
             $scope.userItems = data.items;

         });
     }

     $scope.ckUserSearch = function() {
         $scope.paginationConf.currentPage = 1;
         getUserDataList();
     }

     $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function() {
         if ($scope.isShowUser) {
             getUserDataList();
         }
         if ($scope.isShowArticle) {
             getProjectDataList();
         }
     });



     $scope.project_keyword = "";
     var getProjectDataList = function() {
         var params = {
             page_index: $scope.paginationConf.currentPage,
             page_size: $scope.paginationConf.itemsPerPage,
             keyword: $scope.project_keyword,
             company_id: $scope.form.id
         };
         var q = $http({
             method: "GET",
             url: _Api + "/admin/project/list",
             params: params
         });

         q.success(function(data) {
             $scope.paginationConf.totalItems = data.total_count;
             $scope.projectItems = data.items;
         });
     }

     $scope.ckProjectSearch = function() {
         $scope.paginationConf.currentPage = 1;
         getProjectDataList();
     }






 }]);
