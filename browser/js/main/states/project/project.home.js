app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider.state('root.project.home', {
        url: '/home',
        templateUrl: 'js/main/states/project/project.home.html',
        controller: [StateCtrlr]
    });

    function StateCtrlr(){

    }
    
}]);
