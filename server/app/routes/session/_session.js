const express = require("express");
const router = express.Router();

module.exports = router;

router.get("/user", function(req, res) {
    if (req.user) {
        res.send({
            user: req.user.sanitize()
        });
    } else {
        res.status(401).send('No authenticated user.');
    }
})
