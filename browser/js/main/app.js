'use strict';
window.app = angular.module('TasteTest', ['rzModule','@ttcorestudio-MEANLib-browser-app']);

app.run(function($rootScope){
    $rootScope.date = new Date();
});
