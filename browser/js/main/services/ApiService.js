/**
 * @ngdoc service
 * @name @ttcorestudio-MEANLib-browser-app.ApiService
 * @description
 * Service for API interaction
 */
app.service('ApiService', function ($http) {
    var ApiService = this;

    /**
     * @ngdoc method
     * @name @ttcorestudio-MEANLib-browser-app.service:ApiService#addPostRouteToService
     * @methodOf @ttcorestudio-MEANLib-browser-app.service:ApiService
     * @param {service} service - Service to attach the function to
     * @param {string} routeOptions.url - URL to post to
     * @param {string} routeOptions.name - Name of post function when attached to service
     *
     * @description
     * Adds an API post request to a service.
     *
     @example
     ApiService.addPostRouteToService(MyService,{
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
    ApiService.addPostRouteToService = function (service, routeOptions) {
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
