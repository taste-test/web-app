app.config(function ($stateProvider) {
    $stateProvider.state('root.project.settings', {
        url: '/settings',
        templateUrl: 'js/main/states/project/project.settings.html',
        controller: 'ProjectSettingsCtrl',
        resolve: {
            security: function ($q, curProject) {
                if (!curProject.curPermissions.edit) return $q.reject("Not authorized");
            }
        }
    });
});

app.controller('ProjectSettingsCtrl', function ($scope, $state, curProject, ProjectSvc) {
    $scope.projectChanges = angular.copy(curProject);
    $scope.newUserEmail = null;

    $scope.toggleEditMode = function () {
        $scope.editMode = !$scope.editMode;
        if (!$scope.editMode) {
            // set back to original
            $scope.projectChanges.name = curProject.name;
            $scope.projectChanges.description = curProject.description;
        }
    };

    $scope.saveEdits = function () {
        ProjectSvc.one_editInfo(curProject._id, $scope.projectChanges).then(function () {
            $state.reload();
        });
    };

    $scope.checkNewUser = function () {
        // TODO:validate $scope.newUserEmail
    };

    $scope.adminIsLeft = function () {
        return $scope.projectChanges.users.filter(function (user) {
            return user.permissions.edit && user.permissions.delete && !user.delete;
        }).length;
    };

    $scope.addUser = function () {
        $scope.newUserEmail = $scope.newUserEmail.toLowerCase();
        ProjectSvc.one_newUser(curProject._id, {
            email: $scope.newUserEmail
        }).then(function (newUser) {
            $scope.projectChanges.users.push(newUser);
            newUser.add = true;
        });
    };

    $scope.saveUsers = function () {
        ProjectSvc.one_saveUsers(curProject._id, {
            users: $scope.projectChanges.users
        }).then(function () {
            $state.reload();
        });
    };

    $scope.removeUserToggle = function (user) {
        $scope.newUserEmail = null;
        user.delete = user.delete ? false : true;
    };

    $scope.deleteProject = function () {
        ProjectSvc.one_delete(curProject._id).then(function (response) {
            if (response && response.success) $state.go("projects");
        });
    }

});
