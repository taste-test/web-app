app.config(function($stateProvider) {

	$stateProvider.state('root', {
		templateUrl: 'root.html',
		resolve: {
			waitForAuthentication: function(AuthService) {
				return AuthService.getLoggedInUser().then(function(user) {
					console.log("auth service user: ", user);
					return user;
				});
			},
			projects: function(waitForAuthentication, ProjectSvc) {
				if (!waitForAuthentication) return;
				return ProjectSvc.getAll().then(function(projects) {
					return projects;
				});
			},
			projectsUsersDict: function(waitForAuthentication, projects, ProjectSvc) {
				if (!waitForAuthentication) return;
				return ProjectSvc.createUserDict(projects);
			},
			wProjects: function(waitForAuthentication, projects, projectsUsersDict, AppUtilSvc) {
				if (!waitForAuthentication) return;
				return projects.map(function(project) {
					return getWrappedProject(project, projectsUsersDict, AppUtilSvc);
				});
			}
		},
		controller: StateCtrlr
	});

	function StateCtrlr($scope, $state, $rootScope, wProjects, projectsUsersDict, AppUtilSvc) {

		$scope.wProjects = wProjects;

		$scope.$on("newProjectSaved", function(event, data) {
			$scope.wProjects.push(getWrappedProject(data, projectsUsersDict, AppUtilSvc));
		});

		// TODO: Does not fire yet. Should it?
		//$rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
	}

	/*
	 █████  ███    ██  ██████  ███    ██
	██   ██ ████   ██ ██    ██ ████   ██
	███████ ██ ██  ██ ██    ██ ██ ██  ██
	██   ██ ██  ██ ██ ██    ██ ██  ██ ██
	██   ██ ██   ████  ██████  ██   ████
	*/

	function getWrappedProject(project, projectsUsersDict, AppUtilSvc) {
		return {
			created: {
				date: new Date(project.created.date),
				user: AppUtilSvc.users.getDisplayStr(project.created.user, projectsUsersDict)
			},
			modified: {
				date: new Date(project.modified.date),
				user: AppUtilSvc.users.getDisplayStr(project.modified.user, projectsUsersDict)
			},
			project: project
		};
	}


});
