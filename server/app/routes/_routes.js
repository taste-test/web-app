const express = require("express");
const router = express.Router();
const path = require("path");

/**
 * Adds routes to express application
 */
 module.exports = router;

 let viewsPath = path.join(__dirname, "..", "views/");
 let passport = require("./auth/passport/_passport");

 //API paths
 router.use('/users', require('./auth/_auth'));
 router.use('/api', require('./api/_api'));
 router.use('/session', passport.validateApiRequest, require('./session/_session'));

 //View paths
 router.get("/*", function(req, res) {
     res.sendFile(viewsPath + "index.html");
 });
