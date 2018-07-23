'use strict';
var MEANLib = require("server/mean-lib").module;
var router = MEANLib.modules.express.Router();
module.exports = router;

router.get("/get-all-roles", function(req, res){
    return res.json(profiles);
});

var profiles = ["engineer", "architect", "other"];
