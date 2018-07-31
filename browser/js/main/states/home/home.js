app.config([
    '$stateProvider',
    function($stateProvider) {

        $stateProvider.state('root.home', {
            url: '/',
            templateUrl: 'js/main/states/home/home.html',
            controller: StateCtrlr,
            resolve: {}
        });

        function StateCtrlr($scope, $timeout, $interval, $state) {
            TASTE.log("What?");
            var countdownTime = 5000;
            var displayInterval = 1000;

            $scope.currentCountdown = + countdownTime / 1000;
            $scope.countdownStarted = false;
            $scope.startCompare = false;

            var countdown,
                showCountdown;

            $scope.startCountdown = function() {
                $scope.countdownStarted = true;
                if ($scope.currentCountdown === displayInterval)
                    $scope.startCompare = true;
                showCountdown = $interval(incrementCountdown, displayInterval);
                countdown = setInterval(moveOn, countdownTime);
            }
            //ANON
            function moveOn() {
                clearInterval(countdown);
                $interval.cancel(showCountdown);
                $scope.currentCountdown = null;

                $state.go("root.compare.comparisons");
            }

            function incrementCountdown() {
                console.log($scope.currentCountdown);
                $scope.currentCountdown -= displayInterval / 1000;
            }
        }

    }
]);
