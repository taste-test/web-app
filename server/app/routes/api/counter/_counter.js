'use strict';
var MEANLib = require("server/mean-lib").module;
var router = MEANLib.modules.express.Router();
module.exports = router;

router.get("/get-count", function(req, res){
    return res.json(MEANLib.server.counter.count);
})

/**
 * @api {get} /api/images/image-comparison
 * @apiName Get Image Comparison
 * @apiDescription Get a whole set of image comparisons
 * @apiGroup images
 *
 * @apiSuccess {object} image - image comparison
 */
router.post("/add-count", function (req, res) {
    var newCount = MEANLib.server.counter.addCount();
    console.log("Added count: ", newCount);
    return res.json(newCount);
});
