/**
 * @ngdoc service
 * @name app.FileSvc
 * @description
 * Service for file interaction
 */
app.service('FileSvc', function ($http, AppUtilSvc) {
    var FileSvc = this;

    /**
     * @ngdoc method
     * @name app.FileSvc#deletebyIds
     * @methodOf app.FileSvc
     *
     * @description
     * HTTP Get /api/project/:projectId/file/delete-by-ids?ids=[ids]
     * @param {String} projectId ID of project to get
     * @param {[String]} ids files we're looking at
     * @return {Promise} Promise resolving with server response
     */
    FileSvc.deleteByIds = function (projectId, ids) {
        return $http.delete("/api/project/" + projectId + "/file/delete-by-ids?ids="+ids)
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FileSvc#one_update
     * @methodOf app.FileSvc
     *
     * @description
     * HTTP Get /api/project/:projectId/file/update
     * @param {String} projectId ID of project to get
     * @param {Object} postRequest Post request including file id to update
     * @return {Promise} Promise resolving with server response
     */
    FileSvc.one_update = function (projectId, postRequest) {
        return $http.post("/api/project/" + projectId + "/file/update", postRequest)
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

});
