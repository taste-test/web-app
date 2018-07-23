app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('root.projects', {
        url: '/projects',
        templateUrl: 'js/main/states/projects/projects.html',
        abstract: true,
        data: {
            authenticate: true
        },
        controller:['$scope', StateCtrlr]
    });

    function StateCtrlr($scope){
        // For master list of projects functionality, look at the root state

        // sorting stuff
        $scope.predicates = [{
            label: "Date Last Modified",
            key: "modified.date",
            defaultReverse: true
        },{
            label: "Date Created",
            key: "created.date",
            defaultReverse: true
        },{
            label: "Name",
            key: "project.name",
            defaultReverse: false
        },{
            label: "User Last Modified",
            key: "modified.user",
            defaultReverse: true
        },{
            label: "User Created",
            key: "created.user",
            defaultReverse: true
        }];

    }

}]);
