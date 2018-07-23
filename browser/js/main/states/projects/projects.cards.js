app.config(function($stateProvider) {

	$stateProvider.state('root.projects.cards', {
		url: '/cards',
		templateUrl: 'js/main/states/projects/projects.cards.html',
		controller: StateCtrlr
	});

	function StateCtrlr($scope) {

		$scope.contextMenu = [{
			'label': 'Menu Item 1',
			'action': function() {
				CORE.dlog("DO SOMETHING HERE", arguments)
			}
		}, {
			'label': 'Menu Item 2',
			'action': function() {
				CORE.dlog("DO SOMETHING ELSE HERE", arguments)
			}
		}];

	}

});
