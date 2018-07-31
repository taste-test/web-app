const express = require("express");
const router = express.Router();
const middlewareRouter = express.Router();

module.exports = middlewareRouter;

var fs = require('fs');
var needle = require('needle');
var async = require('async');

var Comparison = require("server/db/models/Comparison/_Comparison");

var needleOpts = {
    json: true,
    connection: "keep-alive"
};

middlewareRouter.use("/", function(req, res, next) {
    next();
}, router);

/**
 * @api {get} /api/images/image-comparison
 * @apiName Get Image Comparison
 * @apiDescription Get a whole set of image comparisons
 * @apiGroup images
 *
 * @apiSuccess {object} image - image comparison
 */
router.get("/image-comparison", function(req, res) {
    var negImg,
        posImg;
    var numComparisons = 10;
    // for(var i = 0; i < 20; i++) {
    //     fileName = 'server/_assets/images/' + i + '.jpg';
    //     getComparisonJson.images.push(convertImgFileToBuffer(fileName));
    // }
    needle("get", process.env.CORE_LEARN_IP + "/taste/test/comparisons/generate/" + numComparisons + "/", null, needleOpts).then(function(resp) {
        getComparisonJson = resp.body;
        getComparisonJson.images = {};
        var parseImgs = function(comparisonSet) {
            negImg = 'server/_assets/images/' + comparisonSet.NegativeImage;
            posImg = 'server/_assets/images/' + comparisonSet.PositiveImage;
            getComparisonJson.images[comparisonSet.NegativeImage.split(".")[0]] = convertImgFileToBufferSync(negImg);
            getComparisonJson.images[comparisonSet.PositiveImage.split(".")[0]] = convertImgFileToBufferSync(posImg);

        };

        getComparisonJson.ComparisonList.forEach(parseImgs);
        return res.status(200).send(getComparisonJson);
    }).catch(function(err) {
        return res.status(500).send(err);
    });
});

router.post("/comparison-summary", function(req, res) {
    getScoresJson.images = [];
    var fileName;
    var userProfile;
    var reqComparisons = {
        ComparisonList: req.body.comparisons
    };

    if (process.env.PRODUCTION) {
        userProfile = Comparison.addSetAndProfile(req.body.comparisons, req.body.role, saveResultsToUser);
    }

    needle("post", process.env.CORE_LEARN_IP + "/taste/test/comparisons/summary/", reqComparisons, needleOpts).then(function(resp) {
        getScoresJson = resp.body;
        if (typeof resp.body === "string") return res.status(500).send("Not an object");
        getScoresJson.images = [];
        var parseReps = function(repImg, i) {
            fileName = 'server/_assets/images/' + getScoresJson.RepresentativeImages[i];
            getScoresJson.images.push(convertImgFileToBufferSync(fileName));
        };
        getScoresJson.RepresentativeImages.forEach(parseReps);
        return res.status(200).send(getScoresJson);
    }).catch(function(err) {
        return res.status(500).send(err);
    });

    function saveResultsToUser(user) {
        user.results = getScoresJson;
        user.save();
    }
});

function convertImgFileToBufferSync(fileLoc) {
    var binaryFile = fs.readFileSync(fileLoc);
    return new Buffer(binaryFile, "binary").toString("base64");
}

var getComparisonJson = {
    "ComparisonList": [
        {
            "Feature": "StructuralEmphasis",
            // "NegativeImage": "0.jpg",
            // "PositiveImage": "1.jpg",
            "NegativeImage": "1736929e9cc663e63b6dc447c85b9353.jpg",
            "PositiveImage": "c4639ab40c7482ee9d0b12f374f748d0.jpg",
            "Preference": ""
        }, {
            "Feature": "Slenderness",
            // "NegativeImage": "2.jpg",
            // "PositiveImage": "3.jpg",
            "NegativeImage": "797dd88606650be3624b920d5ecee929.jpg",
            "PositiveImage": "8d7ba9fc495426c207248d362ac8d983.jpg",
            "Preference": ""
        }, {
            "Feature": "Symmetry",
            // "NegativeImage": "4.jpg",
            // "PositiveImage": "5.jpg",
            "NegativeImage": "0ad9aa145861675ba909f10bbfe728b9.jpg",
            "PositiveImage": "d647f8244fbcd804b399b4c5e11b889d.jpg",
            "Preference": ""
        }, {
            "Feature": "Repetition",
            // "NegativeImage": "6.jpg",
            // "PositiveImage": "7.jpg",
            "NegativeImage": "13dab112ecaace5f26dac1e983463d70.jpg",
            "PositiveImage": "1e4990a2c236b068b354a9f5df0f1500.jpg",
            "Preference": ""
        }, {
            "Feature": "Complexity",
            // "NegativeImage": "8.jpg",
            // "PositiveImage": "9.jpg",
            "NegativeImage": "23d474e701bd29abbb8606bd4cea8f4c.jpg",
            "PositiveImage": "645de6ecba0ed2e3ab3780486e4356ee.jpg",
            "Preference": ""
        }, {
            "Feature": "StructuralEmphasis",
            // "NegativeImage": "10.jpg",
            // "PositiveImage": "11.jpg",
            "NegativeImage": "1719d6ddef3af6b823c9f6371af1b58a.jpg",
            "PositiveImage": "0e18738e547ea41d53676ce15ea74c33.jpg",
            "Preference": ""
        }, {
            "Feature": "Slenderness",
            // "NegativeImage": "12.jpg",
            // "PositiveImage": "13.jpg",
            "NegativeImage": "c634fca02998da19ac3398669c431f6c.jpg",
            "PositiveImage": "6637439a834a5dda653bcc8dfbd18e1d.jpg",
            "Preference": ""
        }, {
            "Feature": "Symmetry",
            // "NegativeImage": "14.jpg",
            // "PositiveImage": "15.jpg",
            "NegativeImage": "576e9cf1cdb010edd539d15981e541db.jpg",
            "PositiveImage": "1622f100ee0704219a7a2f4315734f88.jpg",
            "Preference": ""
        }, {
            "Feature": "Repetition",
            // "NegativeImage": "16.jpg",
            // "PositiveImage": "17.jpg",
            "NegativeImage": "172ec475b128544f21d0a31e4ead433a.jpg",
            "PositiveImage": "187ae3ae314c51a80aaa3aff0aae6c30.jpg",
            "Preference": ""
        }, {
            "Feature": "Complexity",
            // "NegativeImage": "18.jpg",
            // "PositiveImage": "19.jpg",
            "NegativeImage": "c67072888e118536e6328a23d16d88ac.jpg",
            "PositiveImage": "870fae3281dec796906654ab5c2bfab4.jpg",
            "Preference": ""
        }
    ]
};

var getScoresJson = {
    "FeatureScores": [
        {
            "Feature": "StructuralEmphasis",
            "Score": -0.3333333333333333
        }, {
            "Feature": "Complexity",
            "Score": -0.3333333333333333
        }, {
            "Feature": "Repetition",
            "Score": 0.3333333333333333
        }, {
            "Feature": "Symmetry",
            "Score": 0
        }, {
            "Feature": "Slenderness",
            "Score": 0
        }
    ],
    "RepresentativeImages": ["ea9081a88a050767933851ddf496da6b.jpg", "3b0ab955ef830a64e8f96f1947bd8636.jpg", "3dacf1ceb2b2ba1f6a8538a8a87aaf15.jpg", "edadd27a7376f26d2cec81031610850c.jpg", "5d9c07a2fc59308f2be7c7fb51aae6d7.jpg"]
}
