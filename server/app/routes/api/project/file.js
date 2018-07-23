'use strict';

var MEANLib = require("server/mean-lib").module;
var mongoose = MEANLib.modules.mongoose;
var File = mongoose.model("File");
var router = MEANLib.modules.express.Router();

module.exports = router;


/**
 * @api {get} /api/project/:projectId/file/view?s3Key=:s3KeyValue View File
 * @apiName View File
 * @apiDescription View a file from a project with its s3 key
 * @apiGroup file
 *
 * @apiSuccess {String} signed_request - Redirects to signed URL
 * @apiError 404 File not found.
 *
 * @apiParam {string} s3Key - request query with the key
 */
router.get("/view", function(req, res) {
	File.findOne({
		project: req.project._id,
		s3Key: req.query.key
	}, function(err, file) {
		if (err || !file) return res.status("404").send("File not found.");
		return returnSignedUrl( req.query.size ? file.getSizeKey(req.query.size) : file.s3Key);
	});

	function returnSignedUrl(key){
		File.getSignedUrl("getObject", key).then(function(response) {
			return res.redirect(response.signed_request);
		});
	}
});

/**
 * @api {post} /api/project/:projectId/file/create-temp Create Temporary File
 * @apiName Create Temporary File
 * @apiDescription Create a temporary file including the user who uploaded the file.
 * @apiGroup file
 *
 * @apiSuccess {File} file - Temporary file object.
 * @apiError 500 No temporary file
 *
 * @apiExample Request body example
 * {
 *      name: filename,
 *      folder: folderId,
 *      etc...
 * }
 */
router.post("/create-temp", function(req, res) {
	var file = new File(req.body);
	file.uploadedBy = req.user._id;
	if (file) return res.json(file);
	else return res.status("500").send("Could not create a temp file");
});

/**
 * @api {post} /api/project/:projectId/file/save Save New File
 * @apiName Save New File
 * @apiDescription Save a file by finding by the name, then creating and saving
 * a new file with that name.
 * @apiGroup file
 *
 * @apiSuccess {File} newFile - New saved file.
 * @apiError 500 Could not save file
 *
 * @apiParam {string} name - File name
 * @apiParam {string} folder - ID of the folder the file belongs to
 *
 * @apiExample Request body example
 * {
 *   folder: folderId,
 *   name: 'File Name'
 * }
 */
router.post("/save", function(req, res) {

	var fileNameSplit = req.body.name.split(".");
	var ext = fileNameSplit.pop();
	var name = fileNameSplit.join(".");

	// Look for duplicate name
	File.findOne({
		project: req.project._id,
		folder: req.body.folder,
		name: req.body.name
	}, function(err, file) {
		if (err) return res.status("500").send("Could not check for duplicates");
		if (file) {
			req.body.name = name + " (duplicate: " + new Date().getTime() + ")." + ext;
		}
		var newFile = new File(req.body);
		newFile.createThumbnailsIfNeeded();
		saveFile(newFile);
	});

	function saveFile(file) {
		file.save(function(err, savedFile) {
			if (err) return res.status("500").send("Could not save your file");
			return res.json(savedFile);
		});
	}

});

/**
 * @api {post} /api/project/:projectId/file/update Update Existing File
 * @apiName Update Existing File
 * @apiDescription Update a file name or folder. Rejects the update if there is a name conflict in the folder requested.
 * @apiGroup file
 *
 * @apiSuccess {File} savedFile - New saved file.
 * @apiError 500 Could not search in database
 * @apiError 404 File not found
 * @apiError 500 Could not check for duplicates
 * @apiError 400 Rename failed
 * @apiError 500 Could not perform save
 *
 * @apiParam {string} folder - Folder mongo Id
 * @apiParam {string} name - File name
 *
 * @apiExample Request body example
 * {
 *   _id: fileId,
 *   name: "My updated file name",
 *   folder: folderId
 * }
 */
router.post("/update", function(req, res) {

	File.findById(req.body._id, function(err, file) {
		if (err) return res.status(500).send("Could not search in database");
		if (!file) return res.status(404).send("File not found");

		searchForDups(function(dupFile){
			if(dupFile) return res.status(400).send({
				"code": "DUPLICATE",
				"message": "A file with this name already exists in this location"
			});
			file.folder = req.body.folder || file.folder;
			file.name = req.body.name || file.name;
			return saveAndReturn(file);
		});
	});

	function saveAndReturn(file){
		return file.save(function(err, savedFile) {
			if (err) return res.status(500).send("Could not perform save");
			return res.json(savedFile);
		});
	}

	function searchForDups(cb) {
		var fileObj = {
			project: req.project._id
		};

		var changeableKeys = ["folder", "name"],
			wasChanged = false;

		changeableKeys.forEach(function(key) {
			if (req.body[key]) {
				fileObj[key] = req.body[key];
				wasChanged = true;
			}
		});

		if(!wasChanged) return cb();

		File.findOne(fileObj, function(err, file) {
			if (err) return cb();
			return cb(file);
		});
	}
});

/**
 * @api {delete} /api/project/:projectId/file/delete?ids=:ids Delete File(s)
 * @apiName Delete File(s)
 * @apiDescription Delete an array of files by splitting into each file and
 * deleting each file object.
 * @apiGroup file
 *
 * @apiSuccess {object} response
 * @apiSuccess {boolean} response.success - true
 * @apiSuccess {[string]} response.ids - array of ids.
 * @apiError 500 Failed to delete
 *
 * @apiParam {string[]} ids - Array of ids
 */
router.delete("/delete-by-ids", function(req, res) {
	File.deleteByIds(req.query.ids.split(",")).then(function(response) {
		if (response) return res.send({
			success: true,
			ids: req.body.ids
		});
		else return res.status("500").send("Failed to delete");
	});
});

/**
 * @api {post} /api/project/:projectId/file/s3/put Put
 * @apiName Put in S3
 * @apiDescription Get a signed URL to upload a file
 * @apiGroup file
 *
 * @apiSuccess {object} response
 * @apiSuccess {boolean} response.success - true
 * @apiSuccess {[string]} response.ids - array of ids.
 * @apiError 500 Failed to delete
 *
 * @apiExample Example usage
 *     endpoint: /api/files/s3/put
 *
 *     body:
 *     {
 *       key: "..../file._id",
 *       fileTyoe: "File Type",
 *       acl: file.info
 *     }
 *
 * @apiParam {String} key s3Key of an file in S3 Service
 * @apiParam {String} fileType file type
 * @apiParam {String} acl file object
 *
 * @apiSuccess {String} signed_request Returns signed request
 */
router.post('/s3/put', function(req, res) {
	var key = req.body.key;
	var fileType = req.body.fileType;
	var acl = req.body.acl;
	File.getSignedUrl("putObject", key, fileType, acl).then(function(response) {
		res.send(response.signed_request);
	});
});
