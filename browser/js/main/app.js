'use strict';
window.app = angular.module('TasteTest', ['rzModule','ui.router', 'ngAnimate']);

app.run(function($rootScope){
    $rootScope.date = new Date();
});
