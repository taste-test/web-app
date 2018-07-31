app.config([
    '$stateProvider',
    function($stateProvider) {

        $stateProvider.state('root.compare', {
            url: '/compare',
            templateUrl: 'compare.html',
            abstract: true,
            resolve: {
                getCompare: function(ImageSvc) {
                    return ImageSvc.one_get().then(function(imageJson) {
                        return imageJson;
                    });
                },
                getRoles: function(ProfileSvc) {
                    return ProfileSvc.getProfiles().then(function(roles) {
                        return roles;
                    });
                }
            },
            controller: StateCtrlr
        });

        function StateCtrlr($rootScope, $state, $scope, $timeout, $interval, getCompare, getRoles, ImageSvc, CountSvc) {
            console.log("Got compare:", getCompare, " and got roles: ", getRoles);
            $scope.compareScope = $scope;
            $scope.roles = getRoles;
            $scope.comparisons = getCompare;
            $scope.curComparison = null;
            $scope.userRole = null;

            $scope.showSummary = false;
            $scope.showSurvey = false;
        }
    }
]);
