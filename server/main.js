'use strict';

// use from root path for self-written requires
// mandatory!
require('rootpath')();

var path = require('path');

var options = {
	rootPath: path.join(__dirname, "../"),
	staticPaths: [
		'public',
		'browser'
	],
	indexPath: "server/app/views/index.html",
	faviconPath: "server/app/views/favicon.ico",
	routesPath: "server/app/routes/_routes",
	modelsPath: 'server/db/models/_models'
};

if (process.env.USE_LOCAL_BUILDS) {
	options.staticPaths.unshift('../libraries/npm');
}

var MEANLib = require("server/mean-lib").set(options.rootPath);

MEANLib.server.create(options).then(function(instance) {

	// Now we have the following:
	// instance.server
	// instance.app
	// instance.io

	// we can do more stuff with above variables here
	instance.io.on('connection', function() {
		// Now have access to socket, wowzers!
	});
	var Counter = require("server/db/models/Counter/_Counter");
	var serverCounter = new Counter({
		count: 0
	});
	if (process.env.PRODUCTION) {
		Counter.findOne({production: true}).sort('-created').exec(function(err, counter){
			counter.save();
			MEANLib.server.counter = counter;
		})
	} else {
		serverCounter.save();
		MEANLib.server.counter = serverCounter;
	}

	console.log(serverCounter);
});
