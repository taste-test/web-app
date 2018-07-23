'use strict';
var MEANLib = require("server/mean-lib").module;
var middlewareRouter = MEANLib.modules.express.Router();
var router = MEANLib.modules.express.Router();
module.exports = middlewareRouter;

// var Project = require("server/db/models/Project/_Project");
var Folder = require("server/db/models/Folder/_Folder");
// var File = require("server/db/models/File/_File");

/**
 * @api {any} /api/project/:projectId/folder/:folderId _Middleware
 * @apiName _Middleware
 * @apiDescription All calls with this url pattern will pass through this middleware. It will attach the found folder as req.folder, or reject the API call outright with a 404 if folder is not found.
 * @apiGroup folder
 */
middlewareRouter.use("/:folderId", function(req, res, next) {
	req.project.getFolder(req.params.folderId).then(function(folder) {
		if (folder) {
			req.folder = folder;
			return next();
		} else {
			return reject();
		}
	}).catch(reject);

	function reject() {
		return res.status("404").send("Folder not found.");
	}
}, router);

/*
███████ ██ ███    ██  ██████  ██      ███████
██      ██ ████   ██ ██       ██      ██
███████ ██ ██ ██  ██ ██   ███ ██      █████
     ██ ██ ██  ██ ██ ██    ██ ██      ██
███████ ██ ██   ████  ██████  ███████ ███████
*/

// -----------------------------------------------------------------------------
// PROJECT VIEW PRIVILEGES
// -----------------------------------------------------------------------------

/**
 * @api {get} /api/project/:projectId/folder/:folderId/info Get Info
 * @apiName Get Info
 * @apiDescription Get the information about a folder
 * @apiGroup folder
 *
 * @apiSuccess {object} folder - Folder info
 */
router.get("/info", function(req, res) {
	return res.send(req.folder);
});

/**
 * @api {get} /api/project/:projectId/folder/:folderId/child-folders Get child folders
 * @apiName Get child folders
 * @apiDescription Get the direct child folders of a folder
 * @apiGroup folder
 *
 * @apiSuccess {object[]} folders - Array of child folders
 */
router.get("/child-folders", function(req, res) {
	req.folder.findChildFolders().then(function(folders) {
		return res.send(folders);
	});
});

/**
 * @api {get} /api/project/:projectId/folder/:folderId/child-files Get child files
 * @apiName Get child files
 * @apiDescription Get the direct child files of a folder
 * @apiGroup folder
 *
 * @apiSuccess {object[]} files - Array of child files
 */
router.get("/child-files", function(req, res) {
	req.folder.findChildFiles().then(function(files) {
		return res.send(files);
	});
});

/**
 * @api {get} /api/project/:projectId/folder/:folderId/parent-folders Get parent folders
 * @apiName Get parent folders
 * @apiDescription Get parents of a folder
 * @apiGroup folder
 *
 * @apiSuccess {object[]} folders - Array of parent folders
 */
router.get("/parent-folders", function(req, res) {
	req.folder.findParents().then(function(folders) {
		return res.send(folders);
	});
});

// -----------------------------------------------------------------------------
// PROJECT EDIT PRIVILEGES
// -----------------------------------------------------------------------------

/**
 * @api {post} /api/project/:projectId/folder/:folderId/add-new-folder Add a new child folder
 * @apiName Add a new child folder
 * @apiDescription Add a new child folder to folder called in URL
 * @apiGroup folder
 *
 * @apiParam {string} name - Folder name
 *
 * @apiSuccess {object} folder - New folder
 *
 * @apiExample Request body example
 * {
 *   name: "My folder name"
 * }
 */
router.post("/add-new-folder", function(req, res) {

	// check for duplicates
	var folderObj = {
		name: req.body.name,
		project: req.project._id,
		parentFolder: req.folder._id
	};

	Folder.findOne(folderObj, function(err, exstFolder) {

		if(err) return res.staus(500).send("Error communicating with database");

		if (exstFolder) {
			folderObj.name = folderObj.name + " (duplicate: " + new Date().getTime() + ")";
		}

		var folder = new Folder(folderObj);

		folder.save(function(saveErr, savedFolder) {
			if (saveErr) return res.status("500").send("Could not save your new folder");
			return res.send(savedFolder);
		});

	});
});

/**
 * @api {post} /api/project/:projectId/folder/:folderId/update Update
 * @apiName Update
 * @apiDescription Update a folder's information. Also used to change a folder's location in the folder hierarchy.
 * @apiGroup folder
 *
 * @apiParam {string} name - Folder name
 *
 * @apiSuccess {object} folder - New folder
 *
 * @apiExample Request body example: rename only
 * {
 *   name: "My folder name"
 * }
 *
 * @apiExample Request body example: move only
 * {
 *   parentFolder: newParentFolderId
 * }
 *
 * @apiExample Do both
 * {
 *   name: "My folder name"
 *   parentFolder: newParentFolderId
 * }
 */
router.post("/update", function(req, res) {

	// Test for dups
	var folderObj = {
		name: req.folder.name,
		project: req.project._id,
		parentFolder: req.folder.parentFolder
	};

	var wasChanged = false;

	var changeableKeys = ["name", "parentFolder"];

	changeableKeys.forEach(function(key) {
		if (req.body[key]) {
			folderObj[key] = req.body[key];
			wasChanged = true;
		}
	});

	// Let's just pretend we saved it, but nothing is different
	if (!wasChanged) return res.status(200).send(req.folder);

	Folder.findOne(folderObj, function(err, exstFolder) {

		if(err) return res.status(500).send("Could not communicate with database");

		if (exstFolder) {
			return res.status(400).send({
				"code": "DUPLICATE",
				"message": "A folder already exists in this location with this name"
			});
		}
		changeableKeys.forEach(function(key) {
			req.folder[key] = folderObj[key];
		});

		req.folder.save(function(saveErr, savedFolder) {
			if (saveErr) return res.status("500").send("Could not save your new folder");
			return res.send(savedFolder);
		});
	});
});

// -----------------------------------------------------------------------------
// PROJECT DELETE PRIVILEGES
// -----------------------------------------------------------------------------

/**
 * @api {delete} /api/project/:projectId/folder/:folderId/delete Delete
 * @apiName Delete
 * @apiDescription Deletes a folder. Will also remove sub-folders and sub-files.
 * @apiGroup folder
 *
 * @apiParam {string} id - Folder id
 *
 * @apiSuccess {object} response - Success response object
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       success: true,
 *       id: folderId
 *     }
 */
router.delete("/delete", function(req, res) {
	var folderId = req.folder._id;

	req.folder.deleteAllChildren().then(function( /*success*/ ) {
		Folder.remove({
			_id: folderId
		}, function(err) {
			if (err) return res.status("500").send("Error deleting folder");
			else return res.send({
				success: true,
				id: folderId
			});
		});
	}).catch(function() {
		return res.status("500").send("Error deleting sub-folders and children.");
	});
});
