/**
 * @ngdoc service
 * @name app.ProjectSvc
 * @description
 * Service for project interaction
 */
app.service('ProjectSvc', function($http, AppUtilSvc) {
	var ProjectSvc = this;

	/**
	 * @ngdoc method
	 * @name app.ProjectSvc#addNew
	 * @methodOf app.ProjectSvc
	 *
	 * @description
	 * HTTP Posts to /api/projects/new
	 * @param {Object} Post request object
	 * @return {Promise} Promise resolving with server response
	 */
	ProjectSvc.addNew = function(postBody) {
		return $http.post("/api/projects/new", postBody)
			.then(AppUtilSvc.api.returnData)
			.catch(AppUtilSvc.api.catchErr);
	};

	/**
	 * @ngdoc method
	 * @name app.ProjectSvc#getAll
	 * @methodOf app.ProjectSvc
	 *
	 * @description
	 * HTTP Posts to /api/projects/get-all
	 * @param {Object} Post request object
	 * @return {Promise} Promise resolving with server response
	 */
	ProjectSvc.getAll = function() {
		return $http.get("/api/projects/get-all")
			.then(AppUtilSvc.api.returnData)
			.catch(AppUtilSvc.api.catchErr);
	};

	/**
	 * @ngdoc method
	 * @name app.ProjectSvc#one_get
	 * @methodOf app.ProjectSvc
	 *
	 * @description
	 * HTTP Get /api/project/:projectId/info
	 * @param {String} projectId ID of project to get
	 * @return {Promise} Promise resolving with server response
	 */
	ProjectSvc.one_get = function(projectId) {
		return $http.get("/api/project/" + projectId + "/info")
			.then(AppUtilSvc.api.returnData)
			.catch(AppUtilSvc.api.catchErr);
	};

	/**
	 * @ngdoc method
	 * @name app.ProjectSvc#one_editInfo
	 * @methodOf app.ProjectSvc
	 *
	 * @description
	 * HTTP Post /api/project/:projectId/edit-info
	 * @param {String} projectId ID of project to get
	 * @param {Object} postBody Post request object
	 * @return {Promise} Promise resolving with server response
	 */
	ProjectSvc.one_editInfo = function(projectId, postBody) {
		return $http.post("/api/project/" + projectId + "/edit-info", postBody)
			.then(AppUtilSvc.api.returnData)
			.catch(AppUtilSvc.api.catchErr);
	};

	/**
	 * @ngdoc method
	 * @name app.ProjectSvc#one_newUser
	 * @methodOf app.ProjectSvc
	 *
	 * @description
	 * HTTP Post /api/project/:projectId/add-user
	 * @param {String} projectId ID of project to get
	 * @param {Object} postBody Post request object
	 * @return {Promise} Promise resolving with server response
	 */
	ProjectSvc.one_newUser = function(projectId, postBody) {
		return $http.post("/api/project/" + projectId + "/add-user", postBody)
			.then(AppUtilSvc.api.returnData)
			.catch(AppUtilSvc.api.catchErr);
	};

	/**
	 * @ngdoc method
	 * @name app.ProjectSvc#one_saveUsers
	 * @methodOf app.ProjectSvc
	 *
	 * @description
	 * HTTP Post /api/project/:projectId/save-users
	 * @param {String} projectId ID of project to get
	 * @param {Object} postBody Post request object
	 * @return {Promise} Promise resolving with server response
	 */
	ProjectSvc.one_saveUsers = function(projectId, postBody) {
		return $http.post("/api/project/" + projectId + "/save-users", postBody)
			.then(AppUtilSvc.api.returnData)
			.catch(AppUtilSvc.api.catchErr);
	};

	/**
	 * @ngdoc method
	 * @name app.ProjectSvc#one_delete
	 * @methodOf app.ProjectSvc
	 *
	 * @description
	 * HTTP Delete /api/project/:projectId/delete
	 * @param {String} projectId ID of project to get
	 * @return {Promise} Promise resolving with server response
	 */
	ProjectSvc.one_delete = function(projectId) {
		return $http.delete("/api/project/" + projectId + "/delete")
			.then(AppUtilSvc.api.returnData)
			.catch(AppUtilSvc.api.catchErr);
	};

	/*
	██    ██ ████████ ██ ██
	██    ██    ██    ██ ██
	██    ██    ██    ██ ██
	██    ██    ██    ██ ██
	 ██████     ██    ██ ███████
	*/
	ProjectSvc.createUserDict = function(projects) {
		var dict = {};
		if(!projects) return dict;
		projects.forEach(function(project){
			if(project.users){
				project.users.forEach(function(user){
					if(user && user.user){
						dict[user.user._id] = user.user;
					}
				});
			}
		});
		return dict;
	};

});
