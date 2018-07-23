/**
 * @ngdoc service
 * @name app.FolderSvc
 * @description
 * Service for project interaction
 */
app.service('FolderSvc', function ($http, AppUtilSvc, S3Svc, $rootScope) {

    var FolderSvc = this;

    /**
     * @ngdoc property
     * @name app.FolderSvc#EVENTS
     * @propertyOf app.FolderSvc
     * @returns {Object} Namespaced object of strings indicating events emitted from this service
     */
    FolderSvc.EVENTS = {
        FILE_UPLOADED: "FolderSvc_FileUploaded"
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_get
     * @methodOf app.FolderSvc
     *
     * @description
     * HTTP Get /api/project/:projectId/folder/:folderId/info
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @return {Promise} Promise resolving with server response
     */
    FolderSvc.one_get = function (projectId, folderId) {
        return $http.get("/api/project/" + projectId + "/folder/" + folderId + "/info")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_getChildFolders
     * @methodOf app.FolderSvc
     *
     * @description
     * HTTP Get /api/project/:projectId/folder/:folderId/child-folders
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @return {Promise} Promise resolving with server response
     */
    FolderSvc.one_getChildFolders = function (projectId, folderId) {
        return $http.get("/api/project/" + projectId + "/folder/" + folderId + "/child-folders")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_getChildFiles
     * @methodOf app.FolderSvc
     *
     * @description
     * HTTP Get /api/project/:projectId/folder/:folderId/child-files
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @return {Promise} Promise resolving with server response
     */
    FolderSvc.one_getChildFiles = function (projectId, folderId) {
        return $http.get("/api/project/" + projectId + "/folder/" + folderId + "/child-files")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_getParentFolders
     * @methodOf app.FolderSvc
     *
     * @description
     * HTTP Get /api/project/:projectId/folder/:folderId/parent-folders
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @return {Promise} Promise resolving with server response
     */
    FolderSvc.one_getParentFolders = function (projectId, folderId) {
        return $http.get("/api/project/" + projectId + "/folder/" + folderId + "/parent-folders")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_new
     * @methodOf app.FolderSvc
     *
     * @description
     * HTTP Post /api/project/:projectId/folder/:folderId/add-new-folder
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @param {Object} postBody Post request object
     * @return {Promise} Promise resolving with server response
     */
    FolderSvc.one_new = function (projectId, folderId, postBody) {
        return $http.post("/api/project/" + projectId + "/folder/" + folderId + "/add-new-folder", postBody)
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_update
     * @methodOf app.FolderSvc
     *
     * @description
     * HTTP Post /api/project/:projectId/folder/:folderId/update
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @param {Object} postBody Post request object
     * @return {Promise} Promise resolving with server response
     */
    FolderSvc.one_update = function (projectId, folderId, postBody) {
        return $http.post("/api/project/" + projectId + "/folder/" + folderId + "/update", postBody)
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_delete
     * @methodOf app.FolderSvc
     *
     * @description
     * HTTP Delete /api/project/:projectId/folder/:folderId/delete
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @return {Promise} Promise resolving with server response
     */
    FolderSvc.one_delete = function (projectId, folderId) {
        return $http.delete("/api/project/" + projectId + "/folder/" + folderId + "/delete")
            .then(AppUtilSvc.api.returnData)
            .catch(AppUtilSvc.api.catchErr);
    };

    /**
     * @ngdoc method
     * @name app.FolderSvc#one_uploadFiles
     * @methodOf app.FolderSvc
     *
     * @description
     * Uploads a bunch of files to a folder within a project
     * @param {String} projectId ID of project to get
     * @param {String} folderId ID of folder we're looking at
     * @param {String} path S3 key path to upload to. We will add /:projectId to the path
     * @param {File[]} files List of files from an HTML file uploader input
     * @param {Function} callback Callback with list of files and their progresses as we upload
     */
    FolderSvc.one_uploadFiles = function (projectId, folderId, path, files, callback) {

        for (var i = 0; i < files.length; i++) {
            uploadFile(files[i]);
        }

        function uploadFile(file) {

            $http.post("/api/project/" + projectId + "/file/create-temp", {
                    project: projectId,
                    folder: folderId,
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    name: file.name,
                    size: file.size,
                    type: file.type
                })
                .then(AppUtilSvc.api.returnData)
                .then(function (newFile) {
                    S3Svc.uploadFiles(projectId, folderId, path + "/" + projectId + "/", newFile._id, [file], function (progresses, uploadedKey) {
                        if (uploadedKey) {
                            newFile.s3Key = uploadedKey;
                            $http.post("/api/project/" + projectId + "/file/save", newFile)
                                .then(AppUtilSvc.api.returnData)
                                .then(function (savedFile) {
                                    $rootScope.$broadcast(FolderSvc.EVENTS.FILE_UPLOADED, savedFile);
                                });
                        }
                        callback(progresses);
                    });
                });
                
        }
    };

});
