app.directive('uploader', function (FolderSvc) {

    return {
        restrict: 'E',
        templateUrl: 'js/main/directives/uploader/uploader.html',
        scope: {
            projectId: '<',
            folderId: '<',
            options: '='
        },
        link: function ($scope /*, element, attributes*/ ) {

            $scope.progresses = [];
            $scope.uploadPath = "";
            $scope.uploadPathPrefix = "fileUploadPrefixExample/";
            $scope.showPathOptions = true;

            if ($scope.options) {
                if ($scope.options.pathPrefix) $scope.uploadPathPrefix = $scope.options.pathPrefix;
                $scope.showPathOptions = $scope.options.showPathOptions;
            }

            $scope.fileNameChanged = function (ele) {
                // do checking before/after upload for minimums, maximums, filetypes, etc if needed
                FolderSvc.one_uploadFiles($scope.projectId, $scope.folderId, $scope.uploadPathPrefix + $scope.uploadPath + "/", ele.files, function (progresses) {
                    $scope.progresses = progresses;
                });
            };
        }
    };

});
