app.directive('foldersList', function(AppUtilSvc, FolderSvc, NotificationService) {
	return {
		restrict: 'E',
		scope: {
			wFolders: '=',
			deleteItem: '<'
		},
		templateUrl: 'js/main/directives/foldersList/foldersList.html',
		link: function($scope) {

			$scope.predicates = [{
				label: "Name",
				key: "folder.name",
				defaultReverse: false
			}];

			$scope.saveChanges = function(wFolder) {
				if (wFolder.folder.name === wFolder.newName) {
					return NotificationService.notify("No changes detected. Your folder has not been updated.", {
						class: "warning",
						dismissAfter: 5000
					});
				}
				var objToSend = angular.copy(wFolder.folder);
				objToSend.name = wFolder.newName;
				FolderSvc.one_update(wFolder.folder.project, wFolder.folder._id, objToSend).then(function(updatedFolder) {
					if(updatedFolder){
						Object.keys(updatedFolder).forEach(function(key){
							wFolder.folder[key] = updatedFolder[key];
						});
					}
					wFolder.selected = false;
				}).catch(function(code){
					if(code==="DUPLICATE") {
						return NotificationService.notify("A folder of this name already exists in the location specified. Please try again.", {
							class: "danger",
							dismissAfter: 5000
						});
					}
				});
			};

			$scope.toggleSelectAllFolders = function() {
				AppUtilSvc.wrap.toggleSelectAll($scope.wFolders);
			};

		}
	};

});
