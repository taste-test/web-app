app.directive('deleteFilesFoldersModal', function(FolderSvc, FileSvc) {
	return {
		restrict: 'E',
		scope: {
			project: '<',
			items: '<'
		},
		templateUrl: 'js/main/directives/modals/deleteFilesFoldersModal/deleteFilesFoldersModal.html',
		link: function($scope) {

			$scope.confirmDeletion = function() {
				var itemsDeleted = 0;
				var itemsToDelete = $scope.items.wAll.length;
				var items = $scope.items;

				$scope.items.wFolders.forEach(function(wFolder) {
					FolderSvc.one_delete($scope.project._id, wFolder.folder._id).then(function() {
						finishDeletion([wFolder]);
					});
				});

				if($scope.items.wFiles.length){
					FileSvc.deleteByIds($scope.project._id, $scope.items.wFiles.map(function(wFile){
						return wFile.file._id;
					})).then(function(){
						finishDeletion($scope.items.wFiles);
					});
				}

				function finishDeletion(wItems){
					itemsDeleted += wItems.length;
					if(itemsDeleted === itemsToDelete){
						$scope.$emit("files-folders-deleted",items);
						$("#deleteFilesFolders").modal("hide");
					};
				}
			};

		}
	};
});
