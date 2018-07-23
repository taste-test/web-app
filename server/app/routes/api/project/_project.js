'use strict';
var MEANLib = require("server/mean-lib").module;
var middlewareRouter = MEANLib.modules.express.Router();
var router = MEANLib.modules.express.Router();
module.exports = middlewareRouter;

var Project = require("server/db/models/Project/_Project");
var Folder = require("server/db/models/Folder/_Folder");
var File = require("server/db/models/File/_File");

/**
 * @api {any} /api/project/:projectId _Middleware
 * @apiName _Middleware
 * @apiDescription All calls with this url pattern will pass through this middleware. It will attach the found project as req.project, or reject the API call outright with a 404 if project is not found. If a project is found, all GET requests will pass on through. If the current user does not have edit permissions, any POST request is rejected by this middleware. If the current user does not have delete permissions, all DELETE requests will be rejected by this middleware. Currently there are no additional request types accepted.
 * @apiGroup project
 */
middlewareRouter.use("/:projectId", function (req, res, next) {
    req.user.findOneProject(req.params.projectId, function (err, project) {
        if (!err) {
            req.project = project;

            if (!project) return res.status("404").send("Project not found.");
            if (req.method === "GET") return next();
            if (req.method === "POST") return req.project.curPermissions.edit ? next() : res.status("403").send("You do not have permissions to modify this project");
            if (req.method === "DELETE") return req.project.curPermissions.delete ? next() : res.status("403").send("You do not have permissions to delete items in this project");
            else return res.status("400").send("Unrecognized request type");
        } else {
            return res.status("404").send("Project not found");
        }
    });
}, router);

/*
███████ ██ ███    ██  ██████  ██      ███████
██      ██ ████   ██ ██       ██      ██
███████ ██ ██ ██  ██ ██   ███ ██      █████
     ██ ██ ██  ██ ██ ██    ██ ██      ██
███████ ██ ██   ████  ██████  ███████ ███████
*/

router.use("/folder", require("./folder/_folder"));
router.use("/file", require("./file"));

/**
 * @api {get} /api/project/:projectId/info Get Info
 * @apiName Get Info
 * @apiDescription Get the information about a project
 * @apiGroup project
 *
 * @apiSuccess {object} project - Project info
 */
router.get("/info", function (req, res) {
    return res.send(req.project);
});

/**
 * @api {post} /api/project/:projectId/edit-info Edit Info
 * @apiName Edit Info
 * @apiDescription Edit project's information
 * @apiGroup project
 *
 * @apiParam {string} name - Project's name
 * @apiParam {string} description - Project's description
 *
 * @apiSuccess {object} project - saved project
 *
 * @apiExample Request body example
 * {
 *   name: "My project name",
 *   description: "My project description"
 * }
 */
router.post("/edit-info", function (req, res) {
    req.project.name = req.body.name;
    req.project.description = req.body.description;
    req.user.saveProject(req.project, function (err) {
        if (err) return res.status("500").send("Could not save project");
        return res.send(req.project);
    });
});

/**
 * @api {post} /api/project/:projectId/add-user Add User
 * @apiName Add User
 * @apiDescription Add user to a project
 * @apiGroup project
 *
 * @apiParam {string} email - Email of user to add
 *
 * @apiSuccess {object} user - Added user object
 *
 * @apiExample Request body example
 * {
 *   email: "newuser@theirdomain.com"
 * }
 */
router.post("/add-user", function (req, res) {
    req.project.users.push({
        email: req.body.email
    });
    return res.json(req.project.users.pop());
});


/**
 * @api {post} /api/project/:projectId/save-users Save Users
 * @apiName Save Users
 * @apiDescription Save a bunch of project users at once
 * @apiGroup project
 *
 * @apiSuccess {object} project - Updated project object
 * @apiError 500 Unable to perform this save
 *
 * @apiParam {object[]} users - Bunch of users to update permissions with.
 * A user can have either an "add" or "delete" flag on them, which will perform
 * the appropriate reaction as all users update. Without an add or delete flag,
 * a found user's permissions will be overwritten by what is given to us.
 *
 * @apiExample Request body example
 * {
 *   users: [{
 *      _id: SampleUserId1,
 *      permissions: {...updatedPermissionsObject},
 *   },{
 *      _id: SampleUserId2,
 *      permissions: {...updatedPermissionsObject},
 *      delete: true // this user will be deleted from the project
 *   },{
 *      _id: SampleUserId1,
 *      permissions: {...updatedPermissionsObject},
 *      add: true // this user will be added to the project
 *   }]
 * }
 */
router.post("/save-users", function (req, res) {
    if (req.project.curPermissions.delete && req.body.users && req.body.users.length) {
        req.body.users.forEach(function (postUser) {
            if (postUser.add && !postUser.delete) {
                postUser.add = undefined;
                req.project.users.push(postUser);

                // Send an email notification here if you would like!
            }
            req.project.users.forEach(function (projUser, i) {
                if (projUser._id == postUser._id) {
                    // found match
                    if (postUser.delete && !postUser.add) {
                        //delete
                        req.project.users.splice(i, 1);
                    } else {
                        //update
                        req.project.users[i] = postUser;
                    }
                }
            });
        });

        var admins = req.project.users.filter(function (user) {
            return user.permissions.delete && user.permissions.edit;
        });
        var newAdmin;

        if (admins.length === 0) {
            // add user who is doing this back as admin
            req.project.users.push({
                user: req.user._id
            });
            newAdmin = req.project.users[req.project.users.length - 1];
            newAdmin.permissions.delete = true;
            newAdmin.permissions.edit = true;
        }

        req.user.saveProject(req.project, function (error) {
            if (error) return res.status("500").send(error);
            else return res.json(req.project);
        });
    }
});

/**
 * @api {delete} /api/project/:projectId/delete Delete
 * @apiName Delete
 * @apiDescription Deletes a project. Will also remove sub-folders and sub-files.
 * @apiGroup folder
 *
 *
 * @apiSuccess {object} response - Success response object
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       success: true,
 *       id: projectId
 *     }
 */
router.delete("/delete", function (req, res) {
    var deleteId = req.project._id;

    removeFolders();

    function removeFolders() {
        Folder.remove({
            project: deleteId
        }, removeFiles);
    }

    function removeFiles(err) {
        if (err) return res.status("500").send(err);
        req.project.getFiles().then(function (files) {
            if (files.length) {
                File.deleteByIds(files.map(function (file) {
                    return file._id;
                })).then(removeProject);
            } else {
                removeProject();
            }

        })
    }

    function removeProject() {
        Project.remove({
            _id: deleteId
        }, finishDeletion);
    }

    function finishDeletion(err) {
        if (err) return res.status("500").send(err);
        return res.json({
            success: true,
            id: deleteId
        });
    }
});
