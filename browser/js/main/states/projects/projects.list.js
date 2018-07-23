app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('root.projects.list', {
        url: '/list',
        templateUrl: 'js/main/states/projects/projects.list.html',
        controller: [StateCtrlr]
    });

    function StateCtrlr(){

    }
    
}]);
