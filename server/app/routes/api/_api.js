const express = require("express");
const router = express.Router();

/**
 * Adds routes to express application
 */

router.use('/images', require('./images/_images'));
router.use('/profiles', require('./profiles/_profiles'));
router.use('/counter', require('./counter/_counter'));

module.exports = router;
