app.directive('filesList', function(AppUtilSvc, FileSvc, NotificationService) {
	return {
		restrict: 'E',
		scope: {
			wFiles: '=',
			deleteItem: '<'
		},
		templateUrl: 'js/main/directives/filesList/filesList.html',
		link: function($scope) {

			$scope.modalId = "image-modal-" + $scope.$id;

			$scope.predicates = [{
				label: "Name",
				key: "file.name",
				defaultReverse: false
			}, {
				label: "Date",
				key: "date",
				defaultReverse: true
			}, {
				label: "Size",
				key: "file.size",
				defaultReverse: false
			}, {
				label: "User",
				key: "user",
				defaultReverse: false
			}];

			$scope.saveChanges = function(wFile) {
				if (wFile.file.name === wFile.newName) {
					return NotificationService.notify("No changes detected. Your file has not been updated.", {
						class: "warning",
						dismissAfter: 5000
					});
				}
				var objToSend = angular.copy(wFile.file);
				objToSend.name = wFile.newName;
				FileSvc.one_update(wFile.file.project, objToSend).then(function(updatedFile) {
					if (updatedFile) {
						Object.keys(updatedFile).forEach(function(key) {
							wFile.file[key] = updatedFile[key];
						});
					}
					wFile.selected = false;
				}).catch(function(code) {
					if (code === "DUPLICATE") {
						return NotificationService.notify("A file of this name already exists in the location specified. Please try again.", {
							class: "danger",
							dismissAfter: 5000
						});
					}
				});
			};

			$scope.viewImagePopup = function(image) {
				$scope.curWImage = image;
				$("#" + $scope.modalId).modal("show");
			};

			$scope.toggleSelectAllFiles = function() {
				AppUtilSvc.wrap.toggleSelectAll($scope.wFiles);
			};

		}
	};

});
