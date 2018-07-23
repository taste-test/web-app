var path = require("path");

var MEAN_Lib = {};

MEAN_Lib.module = null;

MEAN_Lib.set = function(repoRootPath){
    MEAN_Lib.module = process.env.USE_LOCAL_BUILDS ? require(path.join(repoRootPath,"../libraries/npm/@ttcorestudio/mean-lib")) : require("@ttcorestudio/mean-lib");
    return MEAN_Lib.module;
};

module.exports = MEAN_Lib;
