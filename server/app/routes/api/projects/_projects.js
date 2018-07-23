'use strict';
var MEANLib = require("server/mean-lib").module;
var router = MEANLib.modules.express.Router();
module.exports = router;

var Project = require("server/db/models/Project/_Project");
// var CORE = require("@ttcorestudio/core");

/*
███    ███ ██    ██ ██   ████████ ██ ██████  ██      ███████
████  ████ ██    ██ ██      ██    ██ ██   ██ ██      ██
██ ████ ██ ██    ██ ██      ██    ██ ██████  ██      █████
██  ██  ██ ██    ██ ██      ██    ██ ██      ██      ██
██      ██  ██████  ███████ ██    ██ ██      ███████ ███████
*/


/**
 * @api {post} /api/projects/new New Project
 * @apiName New Project
 * @apiDescription Create a new project
 * @apiGroup projects
 *
 * @apiSuccess {object} project - Your created project
 * @apiError 500 Unable to save a new project
 *
 * @apiParam {string} name - Project name
 * @apiParam {string} description - Project description
 *
 * @apiExample Request body example
 * {
 *   name: "My Project Name",
 *   description: "More info about this project"
 * }
 */
router.post("/new", function (req, res) {
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
        users: [{
            user: req.user._id,
            permissions: {
                edit: true,
                delete: true
            }
        }]
    });
    req.user.saveProject(project, function (err) {
        if (!err) return res.json(project);
        else return res.status("500").send(err);
    });
});

/**
 * @api {get} /api/projects/get-all Get All
 * @apiName Get All
 * @apiDescription Get all of the current user's related projects
 * @apiGroup projects
 *
 * @apiSuccess {object[]} projects - Your affiliated projects
 * @apiError 500 Unable to perform this find
 */
router.get("/get-all", function (req, res) {
    req.user.findAllProjects(function (err, projects) {
        if (!err) return res.json(projects);
        else return res.status("500").send("Unable to perform find");
    });
});
