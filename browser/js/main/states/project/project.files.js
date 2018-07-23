app.config(function($stateProvider) {

	$stateProvider.state('root.project.files', {
		url: '/files/:folderId',
		templateUrl: 'js/main/states/project/project.files.html',
		params: {
			folderId: {
				value: null,
				squash: true
			}
		},
		resolve: {
			security: function($q, curProject) {
				if (!curProject.curPermissions.edit) return $q.reject("Not authorized");
			},
			curFolder: function($q, $stateParams, curProject, FolderSvc) {
				if (!$stateParams.folderId) $stateParams.folderId = curProject.rootFolder;
				if ($stateParams.folderId._id) $stateParams.folderId = $stateParams.folderId._id;
				if (!curProject.rootFolder) return $q.reject("Your project is in a broken state and has no folders");
				return FolderSvc.one_get(curProject._id, $stateParams.folderId).then(function(folder) {
					return folder;
				});
			},
			wParentFolders: function(FolderSvc, curProject, curFolder) {
				return FolderSvc.one_getParentFolders(curProject._id, curFolder._id).then(function(parentFolders) {
					return parentFolders.map(getWFolder);
				});
			},
			wSubfolders: function(FolderSvc, curProject, curFolder) {
				return FolderSvc.one_getChildFolders(curProject._id, curFolder._id).then(function(childFolders) {
					return childFolders.map(getWFolder);
				});
			},
			wFiles: function(FolderSvc, curProject, curFolder, AppUtilSvc, projectsUsersDict) {
				return FolderSvc.one_getChildFiles(curProject._id, curFolder._id).then(function(files) {
					return files.map(function(file) {
						return getWFile(file, AppUtilSvc, projectsUsersDict);
					});
				});
			}
		},
		controller: StateCtrlr,
	});

	/*
	 ██████ ████████ ██████  ██      ██████
	██         ██    ██   ██ ██      ██   ██
	██         ██    ██████  ██      ██████
	██         ██    ██   ██ ██      ██   ██
	 ██████    ██    ██   ██ ███████ ██   ██
	*/

	function StateCtrlr($scope, $state, $stateParams, FolderSvc, AppUtilSvc, projectsUsersDict, curFolder, wParentFolders, wSubfolders, wFiles) {

		$scope.folder = curFolder;

		$scope.parents = {
			wFolders: wParentFolders
		};

		$scope.children = {
			wFiles: wFiles,
			wFolders: wSubfolders,
			wAll: wFiles.concat(wSubfolders)
		};

		$scope.uploadOptions = {
			pathPrefix: "",
			showPathOptions: false
		};

		$scope.selectedItemCount = 0;

		$scope.childrenToDelete = {};

		$scope.deleteItem = function(wItem) {
			resetDeletionFlags();
			if(wItem) wItem.flaggedForDeletion = true;
			showDeletionModal();
		};

		$scope.deleteAllSelectedItems = function(){
			resetDeletionFlags();
			$scope.children.wAll.filter(AppUtilSvc.wrap.isSelected).forEach(function(wItem){
				wItem.flaggedForDeletion = true;
			});
			showDeletionModal();
		};

		$scope.itemsAreSelected = function() {
			$scope.selectedItemCount = $scope.children.wAll.filter(AppUtilSvc.wrap.isSelected).length;
			return $scope.selectedItemCount;
		};

		/*
		███████ ██    ██ ████████ ███████
		██      ██    ██    ██    ██
		█████   ██    ██    ██    ███████
		██       ██  ██     ██         ██
		███████   ████      ██    ███████
		*/

		$scope.$on("new-folder-created", function(evt, folder) {
			var wFolder = getWFolder(folder);
			$scope.children.wFolders.push(wFolder);
			$scope.children.wAll.push(wFolder);
		});

		$scope.$on(FolderSvc.EVENTS.FILE_UPLOADED, function(event, uploadedFile) {
			var wFile = getWFile(uploadedFile, AppUtilSvc, projectsUsersDict);
			$scope.children.wFiles.push(wFile);
			$scope.children.wAll.push(wFile);
		});

		$scope.$on("files-folders-deleted",function(evt,children){

			children.wFolders.forEach(function(wFolder){
				removeFromArr($scope.children.wFolders,wFolder);
				removeFromArr($scope.children.wAll,wFolder);
			});

			children.wFiles.forEach(function(wFile){
				removeFromArr($scope.children.wFiles,wFile);
				removeFromArr($scope.children.wAll,wFile);
			});

			function removeFromArr(arr,wItem){
				arr.splice(arr.indexOf(wItem), 1);
			}
		});

		/*
		 █████  ███    ██  ██████  ███    ██     ██ ███    ██ ████████
		██   ██ ████   ██ ██    ██ ████   ██     ██ ████   ██    ██
		███████ ██ ██  ██ ██    ██ ██ ██  ██     ██ ██ ██  ██    ██
		██   ██ ██  ██ ██ ██    ██ ██  ██ ██     ██ ██  ██ ██    ██
		██   ██ ██   ████  ██████  ██   ████     ██ ██   ████    ██
		*/
		function resetDeletionFlags(){
			$scope.children.wAll.forEach(function(curWItem){
				curWItem.flaggedForDeletion = false;
			});
		}

		function showDeletionModal(){
			$scope.childrenToDelete.wFiles = $scope.children.wFiles.filter(AppUtilSvc.wrap.isFlaggedForDeletion);
			$scope.childrenToDelete.wFolders = $scope.children.wFolders.filter(AppUtilSvc.wrap.isFlaggedForDeletion);
			$scope.childrenToDelete.wAll = $scope.children.wAll.filter(AppUtilSvc.wrap.isFlaggedForDeletion);
			$("#deleteFilesFolders").modal("show");
		}

	}

	/*
	 █████  ███    ██  ██████  ███    ██
	██   ██ ████   ██ ██    ██ ████   ██
	███████ ██ ██  ██ ██    ██ ██ ██  ██
	██   ██ ██  ██ ██ ██    ██ ██  ██ ██
	██   ██ ██   ████  ██████  ██   ████
	*/

	function getWFolder(folder) {
		return {
			folder: folder,
			selected: false,
			flaggedForDeletion: false,
			newName: folder.name
		};
	}

	function getWFile(file, AppUtilSvc, projectsUsersDict) {
		var wFile = {
			file: file,
			selected: false,
			flaggedForDeletion: false,
			user: AppUtilSvc.users.getDisplayStr(file.uploadedBy, projectsUsersDict),
			date: new Date(file.dateUploaded),
			newName: file.name,
			looksLikeImage: file.type.split("/")[0] === "image",
			downloadLink: "/api/project/" + file.project + "/file/view?key=" + encodeURIComponent(file.s3Key)
		};
		if(wFile.looksLikeImage) wFile.previewLink = "/api/project/" + file.project + "/file/view?key=" + encodeURIComponent(file.s3Key)+"&size=md";
		return wFile;
	}
});
