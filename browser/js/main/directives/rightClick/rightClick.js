app.directive('rightClick', function() {

	return {
		restrict: 'A',
        scope:{
            contextMenu: '<',
			contextArguments: '<'
        },
		link: function(/*$scope*/) {

		}

	};

});
