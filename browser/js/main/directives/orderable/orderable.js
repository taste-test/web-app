app.directive('orderable', function() {

	return {
		restrict: 'A',
		link: function($scope) {

			$scope.reverse = false;
			$scope.predicate = null;
			$scope.orderedIconClass = "";

			$scope.order = function(predicateOrKey) {
				var predicate = (predicateOrKey.key) ? predicateOrKey : $scope.predicates.filter(function(p) {
					return p.key === predicateOrKey;
				})[0];

				if(!predicate) return;

				if ($scope.predicate && $scope.predicate.key === predicate.key) {
					$scope.reverse = !$scope.reverse;
				} else {
					$scope.reverse = predicate.defaultReverse;
				}
				$scope.orderedIconClass = $scope.reverse ? "fas fa-long-arrow-alt-up" : "fas fa-long-arrow-alt-down";
				$scope.predicate = predicate;
			};

			$scope.$watch('predicates', function() {
				if($scope.predicates) $scope.order($scope.predicates[0]);
			});

		}

	};

});
