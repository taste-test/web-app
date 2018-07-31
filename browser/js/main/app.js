'use strict';
window.app = angular.module('TasteTest', ['rzModule','ui.router', 'ngAnimate']);

// var TASTE = TASTE || {};
//
// var logColor = '#ffaa00';
// TASTE.log = console.log.bind(console, "%c ", 'background: ' + logColor + ';');

app.run(function($rootScope){
    $rootScope.date = new Date();
});
