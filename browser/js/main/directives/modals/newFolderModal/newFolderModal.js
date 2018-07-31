app.directive('newFolderModal', function (FolderSvc, AppUtilSvc) {
    return {
        restrict: 'E',
        scope:{
            folder: '<'
        },
        templateUrl: 'js/main/directives/modals/newFolderModal/newFolderModal.html',
        link: function ($scope) {

            $scope.newFolderName = "New Folder";

            $scope.createFolder = function() {
				FolderSvc.one_new($scope.folder.project, $scope.folder._id, {
					name: $scope.newFolderName
				}).then(function(newFolder) {
                    $scope.$emit("new-folder-created",newFolder);
					$("#newFolderModal").modal('hide');
				});
			};

            $scope.respondToKeyPress = function(eventName) {
                if (eventName === "enter") {
                    if ($scope.newFolderName) {
                        $scope.createFolder();
                    }
                }
            };

            AppUtilSvc.modal.initDefaultFieldBehavior("#newFolderModal");

        }
    };
});
