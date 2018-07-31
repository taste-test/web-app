app.config(['$stateProvider', function($stateProvider) {

	$stateProvider.state('root.404', {
		url: '/404',
		params: {
			'title': null,
			'message': null
		},
		templateUrl: '404.html',
		controller: ['$scope', '$stateParams', StateCtrlr]
	});

	function StateCtrlr($scope, $stateParams) {
		$scope.title = $stateParams.title;
		$scope.message = $stateParams.message;
	}

}]);
