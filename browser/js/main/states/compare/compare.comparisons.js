app.config(function($stateProvider) {

    $stateProvider.state('root.compare.comparisons', {
        url: '/',
        templateUrl: 'js/main/states/compare/compare.comparisons.html',
        controller: StateCtrlr
    });

    /*
	 ██████ ████████ ██████  ██      ██████
	██         ██    ██   ██ ██      ██   ██
	██         ██    ██████  ██      ██████
	██         ██    ██   ██ ██      ██   ██
	 ██████    ██    ██   ██ ███████ ██   ██
	*/

    function StateCtrlr($scope, $rootScope, $state, $timeout, $interval, getCompare, getRoles, ImageSvc, CountSvc) {
        var i = 0;
        var userComparisons = getCompare.ComparisonList;
        var autoIncrement,
            showTimer;
        var incrementTime = 3000;
        var displayInterval = 1000;

        $scope.compareImgs = getCompare.images;
        $scope.curCompare = userComparisons[0];
        $scope.compareScope.showSurvey = false;
        $scope.professions = getRoles;

        $scope.currentTimer = incrementTime;

        //EVENTS
        $rootScope.$on('keypress', function(evt, obj, key) {
            CORE.log(key);
            if (key.toUpperCase() === "F")
                userComparisons[i].Preference = "Negative";
            if (key.toUpperCase() === "J")
                userComparisons[i].Preference = "Positive";
            incrementOrFinish();
        });

        autoIncrement = setInterval(incrementOrFinish, incrementTime);
        showTimer = $interval(incrementTimer, displayInterval, 0, true);

        //SCOPE FN
        $scope.clicked = function(evt, imageI) {
            CORE.log("Clicked image ", imageI);
            incrementOrFinish();
        };

        $scope.select = function(val) {
            CORE.log("In select ", val);
            userComparisons[i].Preference = val
                ? "Positive"
                : "Negative";
            incrementOrFinish();
        };

        $scope.selectRole = function(role) {
            $scope.compareScope.userRole = role;
        };

        $scope.finishAndScore = function() {
            CORE.log("Finished comparison");
            clearInterval(autoIncrement);
            $interval.cancel(showTimer);
            $scope.currentTimer = incrementTime;

            $scope.compareScope.showSurvey = false;
            // $scope.showSummary = true;
            CORE.log("Role selected = ", $scope.compareScope.userRole);
            convertBlankToNA();
            $scope.compareScope.curComparison = userComparisons;
            $state.go("root.compare.summary");
        };
        //ANON
        function incrementOrFinish() {
            clearInterval(autoIncrement);
            $interval.cancel(showTimer);

            autoIncrement = setInterval(incrementOrFinish, incrementTime);
            showTimer = $interval(incrementTimer, displayInterval);

            if (i < userComparisons.length - 1) {
                $scope.currentTimer = incrementTime;

                i += 1;
                CountSvc.one_addCount({});
                $timeout(function() {
                    $scope.curCompare = userComparisons[i];
                });
            } else {
                $scope.currentTimer = null;
                getSurveyResponses();
            }
        }

        function incrementTimer() {
            $scope.currentTimer -= displayInterval;
        }

        function getSurveyResponses() {
            $scope.compareScope.showSurvey = true;
        };

        function convertBlankToNA() {
            userComparisons.forEach(function(comparison) {
                if (comparison.Preference !== "Negative" && comparison.Preference !== "Positive") {
                    comparison.Preference = "NA";
                }
            })
        }
    }
});
