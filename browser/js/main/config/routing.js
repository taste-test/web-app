app.config(function ($urlRouterProvider, $locationProvider, $httpProvider) {
    // Authorization
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);

    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);

    // If we go to a URL that ui-router doesn't have registered, go to the "404" url.
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get('$state');

        $state.go('404', {
            title: "404: Page not found",
            message: 'Sorry, we could not find "' + $location.$$url + '". If you feel this message is in error, please contact us!'
        });
    });

    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });

});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state, $window, $location, $anchorScroll) {

    AuthService.getLoggedInUser();

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    var curAnchor;

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams) {

            // add anchor if exists
            if ($window.location.hash) {
                curAnchor = toParams.anchor = $window.location.hash.replace("#", "");
            } else {
                curAnchor = undefined;
            }

            // The destination state does not require authentication
            if (!destinationStateRequiresAuth(toState)) return;

            // The user is authenticated.
            if (AuthService.isAuthenticated()) return;

            // Cancel navigating to new state.
            event.preventDefault();

            AuthService.getLoggedInUser().then(function (user) {
                // If a user is retrieved, then renavigate to the destination
                // (the second time, AuthService.isAuthenticated() will work)
                // otherwise, if no user is logged in, go to "login" state.
                if (user) {
                    $state.go(toState.name, toParams);
                } else {
                    $window.location = '/users/login/?returnTo=' + encodeURIComponent(toState.url);
                }
            });

        });

    // $stateChangeSuccess  is an event fired
    // whenever the process of changing a state ends.
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            if(!fromState.name) $location.hash(toParams.anchor);
        });

    // Apply anchor if necessary.
    $rootScope.$on('$viewContentLoaded',
        function (event) {
            if(curAnchor){
                var anchorTarget = $('a[href="#' + curAnchor + '"][data-toggle="tab"]');
                if(anchorTarget.length) {
                    anchorTarget.tab("show");
                } else {
                    $anchorScroll();
                }
            }
        });

});
