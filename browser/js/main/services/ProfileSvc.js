/**
 * @ngdoc service
 * @name app.ProfileSvc
 * @description
 * Service for profile/roles/profession I/O.
 */
app.service('ProfileSvc', function ($http, AppUtilSvc) {

    var ProfileSvc = this;

    /**
     * @ngdoc method
     * @name app.ProfileSvc#one_get
     * @methodOf app.ProfileSvc
     *
     * @description
     * HTTP Get /api/images/image-comparison
     * Gets initial array of comparison images
     * @return {Promise} Promise resolving with server response
     */
    ProfileSvc.getProfiles = function () {
        return $http.get("/api/profiles/get-all-roles")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

});
