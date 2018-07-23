/**
 * @ngdoc service
 * @name app.CountSvc
 * @description
 * Service for project interaction
 */
app.service('CountSvc', function ($http, AppUtilSvc, S3Svc, $rootScope) {

    var CountSvc = this;

    /**
     * @ngdoc property
     * @name app.CountSvc#EVENTS
     * @propertyOf app.CountSvc
     * @returns {Object} Namespaced object of strings indicating events emitted from this service
     */
    CountSvc.EVENTS = {
        NEW_COUNT: "CountSvc_NewCount"
    };

    CountSvc.one_getCount = function () {
        return $http.get("/api/counter/get-count")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.CountSvc#one_addCount
     * @methodOf app.CountSvc
     *
     * @description
     * HTTP Get /api/counter/add-count
     * Gets initial array of comparison images
     * @return {Promise} Promise resolving with server response
     */
     CountSvc.one_addCount = function (postBody) {
         return $http.post("/api/counter/add-count", postBody)
             .then(AppUtilSvc.api.returnData)
             .then(function(newCount){
                 CORE.log("New count: ", newCount);
                 $rootScope.$broadcast(CountSvc.EVENTS.NEW_COUNT, newCount);
             })
             .catch(AppUtilSvc.api.catchErr);
     };

});
