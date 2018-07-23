'use strict';

var MEANLib = require("server/mean-lib").module;
var router = MEANLib.modules.express.Router()

/**
 * Adds routes to express application
 */
module.exports = function (app) {
    var routerOptions = {};

    // Use default routes for authentication/login
    MEANLib.server.routers.attachDefault(router, routerOptions);

    // API subrouter
    router.use('/api', require('./api/_api'));

    // Send to index.html otherwise
    router.get('/*', function (req, res) {
        res.sendFile(app.get('indexHTMLPath'));
    });

    // Use default 404s
    MEANLib.server.routers.attachLast(router);

    app.use("/", router);

};
