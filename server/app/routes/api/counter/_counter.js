const express = require("express");
const router = express.Router();
const instance = require("server/instance").get();
module.exports = router;

router.get("/get-count", function(req, res){
    return res.json(instance.server.counter.count);
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
    var newCount = instance.server.counter.addCount();
    console.log("Added count: ", newCount);
    return res.json(newCount);
});
