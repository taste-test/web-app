app.config(['$stateProvider', function($stateProvider) {

	$stateProvider.state('root.project', {
		url: '/project/:projectId',
		abstract: true,
		templateUrl: 'js/main/states/project/project.html',
		data: {
			authenticate: true
		},
		resolve: {
			wProject: ['wProjects', '$state', '$stateParams', function(wProjects, $state, $stateParams) {
				if(!wProjects) return $state.go("404");
				var wProject = wProjects.filter(function(wP){
					return wP.project && wP.project._id === $stateParams.projectId;
				})[0];
				if(!wProject) return $state.go("404");
				return wProject;
			}],
			curProject: ['wProject', function(wProject) {
				return wProject.project;
				// // You can make another API call if you don't return a full list of information
				// // with your master projects list found in root. In the case of this starter,
				// // no additional information is needed so we just use the projects from before
				// return ProjectSvc.one_get($stateParams.projectId).then(function(project) {
				// 	return (project) ? project: $state.go("404");
				// });
			}]
		},
		controller: ['$scope', '$state', 'wProject', 'curProject', StateCtrlr]
	});

	function StateCtrlr($scope, $state, wProject, curProject) {
		$scope.wProject = wProject;
		$scope.project = curProject;
		$scope.projectScope = $scope;
	}

}]);
