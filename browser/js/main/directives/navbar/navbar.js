app.directive('navbar', function ($rootScope, AuthService, CountSvc,AUTH_EVENTS) {

    return {
        restrict: 'E',
        templateUrl: 'js/main/directives/navbar/navbar.html',
        scope: true,
        link: function ($scope) {

            $scope.gravatar = null;
            CountSvc.one_getCount().then(function(retrievedCount){
                $scope.count = retrievedCount;
            })
            // $scope.count = 0; //TODO: get count first

            if($scope.USER) setUser();

            function setUser() {
                AuthService.getGravatar(60).then(function(gravatar){
                    $scope.gravatar = gravatar;
                });
            };

            function updateCount(evt,newCount){
                $scope.count = newCount;
            }

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(CountSvc.EVENTS.NEW_COUNT, updateCount);
        }

    };

});
