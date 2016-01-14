'use strict';

angular.module('webappApp').filter('smallpath', function() {
    return function(imagepath) {
        if (imagepath.indexOf("_450_300.") > -1) {
            imagepath = imagepath.replace('_450_300.', "_160_120.");
        } else {
            imagepath = imagepath.replace('.', "_160_120.");
        }
        return imagepath;
    }
});
