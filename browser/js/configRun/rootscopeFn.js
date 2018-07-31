/**
 * @ngdoc service
 * @name @ttcorestudio-MEANLib-browser-app.service:$rootScope
 * @description
 * Rootscope
 */
app.run(function ($rootScope, $http) {

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.service:$rootScope#addApiRouteToService
     * @methodOf @ttcorestudio-MEANLib-browser-app.service:$rootScope
     * @param {service} service - Service to attach the function to
     * @param {string} routeOptions.url - URL to post to
     * @param {string} routeOptions.name - Name of post function when attached to service
     *
     * @description
     * Adds an API post request to a service. DEPRECATED: SEE ApiService.addPostRouteToService
     *
     @example
     $ootScope.addApiRouteToService(MyService,{
         "name": "myNewFunction",
         "url": "/myurl"
     });

     // MyService.myNewFunction() now returns a promise with the server response.

     MyService.myNewFunction({
         param: value,
         param2: value2
     }).then(function (response) {
         // we have the server response
     }).catch(function () {
         // in case of error
     });
     */
    $rootScope.addApiRouteToService = function (service, routeOptions) {
        service[routeOptions.name] = function (options) {

            return $http.post(routeOptions.url, options)
                .then(function (response) {
                    return response.data;
                }).catch(function () {
                    return null;
                });

        };
    };

});
