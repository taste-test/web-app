app.directive('newProject', function(ProjectSvc, $rootScope, $timeout, NotificationService, AppUtilSvc) {
	return {
		restrict: 'E',
		templateUrl: 'js/main/directives/modals/newProject/newProject.html',
		link: function($scope, element, attributes) {
			$scope.modalId = attributes.ngId;
			$scope.name = "";
			$scope.description = "";
			$scope.err = null;

			var modalSelector = "#" + $scope.modalId;

			$scope.submit = function() {
				ProjectSvc.addNew({
					name: $scope.name,
					description: $scope.description
				}).then(function(project) {
					$scope.err = null;
					$rootScope.$broadcast("newProjectSaved", project);
					$(modalSelector).modal('hide');
				}).catch(function(err) {
					if (err === 11000) {
						$scope.err = "Project not saved: name is already taken. Please try another.";
					}
				});
			};

			$scope.respondToKeyPress = function(eventName) {
				if (eventName === "enter") {
					if ($scope.name) {
						$scope.submit();
					}
				}
			};

			AppUtilSvc.modal.initDefaultFieldBehavior(modalSelector);
		}
	};

});
