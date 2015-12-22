 app.controller('CompanysEditCtrl', ['$scope', "$http", "FileUploader", function($scope, $http, FileUploader) {

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
         console.info('onAfterAddingAll', addedFileItems);
     };
     uploader.onBeforeUploadItem = function(item) {
         console.info('onBeforeUploadItem', item);
     };
     uploader.onProgressItem = function(fileItem, progress) {
         console.info('onProgressItem', fileItem, progress);
     };
     uploader.onProgressAll = function(progress) {
         console.info('onProgressAll', progress);
     };
     uploader.onSuccessItem = function(fileItem, response, status, headers) {

         console.info('onSuccessItem', fileItem, response, status, headers);
     };
     uploader.onErrorItem = function(fileItem, response, status, headers) {
         console.info('onErrorItem', fileItem, response, status, headers);
     };
     uploader.onCancelItem = function(fileItem, response, status, headers) {
         console.info('onCancelItem', fileItem, response, status, headers);
     };
     uploader.onCompleteItem = function(fileItem, response, status, headers) {
         console.info('onCompleteItem', fileItem, response, status, headers);
     };
     uploader.onCompleteAll = function() {
         console.info('onCompleteAll');
     };



 }])
