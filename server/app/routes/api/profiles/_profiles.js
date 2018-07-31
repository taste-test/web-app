const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/get-all-roles", function(req, res){
    return res.json(profiles);
});

var profiles = ["engineer", "architect", "other"];
