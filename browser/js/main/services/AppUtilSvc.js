/**
 * @ngdoc service
 * @name app.AppUtilSvc
 * @description
 * Service for basic utility application functions
 */
app.service('AppUtilSvc', function(NotificationService, $timeout) {

	var AppUtilSvc = this;

	/*
	 █████  ██████  ██
	██   ██ ██   ██ ██
	███████ ██████  ██
	██   ██ ██      ██
	██   ██ ██      ██
	*/

	AppUtilSvc.api = {};

	AppUtilSvc.api.returnData = function(response) {
		return response.data;
	};

	var errorCodesToCatch = [11000, "DUPLICATE"];

	AppUtilSvc.api.catchErr = function(response) {
		// we throw back errors that are known and expected, otherwise we let it resolve
		if (response.data) {
			if(response.data.code && errorCodesToCatch.indexOf(response.data.code)!==-1){
				throw response.data.code;
			}
			return null;
		}
		return null;
	};

	/*
	███    ███  ██████  ██████   █████  ██
	████  ████ ██    ██ ██   ██ ██   ██ ██
	██ ████ ██ ██    ██ ██   ██ ███████ ██
	██  ██  ██ ██    ██ ██   ██ ██   ██ ██
	██      ██  ██████  ██████  ██   ██ ███████
	*/
	AppUtilSvc.modal = {};

	AppUtilSvc.modal.initDefaultFieldBehavior = function(selectorString) {
		$timeout(function() {
			$(selectorString).on('shown.bs.modal', function() {
				$(selectorString + " .default-focus").trigger('focus').select();
			});
		});
	};

	/*
	██    ██ ███████ ███████ ██████  ███████
	██    ██ ██      ██      ██   ██ ██
	██    ██ ███████ █████   ██████  ███████
	██    ██      ██ ██      ██   ██      ██
	 ██████  ███████ ███████ ██   ██ ███████
	*/

	AppUtilSvc.users = {};

	AppUtilSvc.users.getDisplayStr = function(user, userDict) {
		user = (typeof user === "string") ? userDict && userDict[user] : user; // normalize in case user field is already populated
		if (!user) return;
		if (!user.sso) return user.email;
		return (user.sso.profile && user.sso.profile.name) || user.sso.email;
	};

	/*
	██     ██ ██████   █████  ██████
	██     ██ ██   ██ ██   ██ ██   ██
	██  █  ██ ██████  ███████ ██████
	██ ███ ██ ██   ██ ██   ██ ██
	 ███ ███  ██   ██ ██   ██ ██
	*/
	AppUtilSvc.wrap = {};
	AppUtilSvc.wrap.isSelected = function(wItem) {
		return wItem.selected;
	};
	AppUtilSvc.wrap.isFlaggedForDeletion = function(wItem) {
		return wItem.flaggedForDeletion;
	};
	AppUtilSvc.wrap.toggleSelectAll = function(wrappedList) {
		var curSelectedFiles = wrappedList.filter(AppUtilSvc.wrap.isSelected);
		var allFilesSelected = curSelectedFiles.length === wrappedList.length;
		wrappedList.forEach(function(wItem) {
			wItem.selected = allFilesSelected ? false : true;
		});
	};

});
