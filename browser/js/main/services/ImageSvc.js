/**
 * @ngdoc service
 * @name app.ImageSvc
 * @description
 * Service for image I/O interaction
 */
app.service('ImageSvc', function ($http, AppUtilSvc, S3Svc, $rootScope) {

    var ImageSvc = this;

    /**
     * @ngdoc property
     * @name app.ImageSvc#EVENTS
     * @propertyOf app.ImageSvc
     * @returns {Object} Namespaced object of strings indicating events emitted from this service
     */
    ImageSvc.EVENTS = {
        FILE_UPLOADED: "ImageSvc_FileUploaded"
    };

    /**
     * @ngdoc method
     * @name app.ImageSvc#one_get
     * @methodOf app.ImageSvc
     *
     * @description
     * HTTP Get /api/images/image-comparison
     * Gets initial array of comparison images
     * @return {Promise} Promise resolving with server response
     */
    ImageSvc.one_get = function () {
        return $http.get("/api/images/image-comparison")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.ImageSvc#one_postSummary
     * @methodOf app.ImageSvc
     *
     * @description
     */
    ImageSvc.one_postSummary = function (postBody) {
        return $http.post("/api/images/comparison-summary", postBody)
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

});
