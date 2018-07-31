const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/get-count", function(req, res){
    const instance = require("server/instance").get();
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
    const instance = require("server/instance").get();
    var newCount = instance.server.counter.addCount();
    console.log("Added count: ", newCount);
    return res.json(newCount);
});
