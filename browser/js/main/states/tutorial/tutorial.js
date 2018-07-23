app.config(['$stateProvider', function($stateProvider) {

	$stateProvider.state('root.tutorial', {
		url: '/tutorial',
		templateUrl: 'js/main/states/tutorial/tutorial.html',
		controller: ['$scope', StateCtrlr]
	});

	function StateCtrlr($scope) {

		$scope.name = "";

		$scope.clickMe = function() {
			alert("CLICKED");
		};
	}

}]);
