/**
 * @ngdoc service
 * @name app.S3Svc
 * @description
 * Service for S3 interaction
 */
app.service('S3Svc', function ($http) {

    var S3Svc = this;

    S3Svc.uploadProgresses = [];

    /**
     * @ngdoc method
     * @name app.S3Svc#uploadFiles
     * @methodOf app.S3Svc
     *
     * @description
     * Upload files to S3. First posts to /api/files/s3/put.
     * Then posts to /api/files/save afterward with: {file: jsonFile,
     key: key}
     * @param {String} projectId Project ID
     * @param {String} folderId Folder ID
     * @param {String} path Path to load to (aka S3 key)
     * @param {Array} files Files to upload
     * @callback {function} Load progress
     */
    S3Svc.uploadFiles = function (projectId, folderId, path, id, files, callback) {
        // Filelist is not array, has no map function
        var curFile;
        //var acl = "public-read";

        path = path.replace(/\/\/+/g, '/');

        for (var i = 0; i < files.length; i++) {
            curFile = files[i];
            uploadFile(curFile);
        }

        function uploadFile(file) {
            var key = path + id;

            S3Svc.uploadProgresses.push({
                name: file.name,
                size: file.size,
                percent: 0,
                done: false
            });

            var index = S3Svc.uploadProgresses.length - 1;

            callback(S3Svc.uploadProgresses);

            $http.post("/api/project/" + projectId + "/file/s3/put", {
                key: key,
                fileType: file.type
            }).then(function (response) {

                // Upload file
                var xhr = new XMLHttpRequest();
                xhr.open("PUT", response.data);
                xhr.upload.addEventListener("progress", uploadProgress, false);
                xhr.addEventListener("load", reqListener);

                function uploadProgress(evt) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    S3Svc.uploadProgresses[index].percent = percentComplete;
                    callback(S3Svc.uploadProgresses);
                }

                function reqListener() {
                    xhr = this;

                    // When finished uploading:
                    if (xhr.status === 200) {
                        S3Svc.uploadProgresses[index].done = true;
                        callback(S3Svc.uploadProgresses, key);
                    } else {
                        // unsuccessful upload
                    }
                }

                xhr.onerror = function () {
                    // error handling
                };

                xhr.send(file);

            });
        }
    };

});
