'use strict';

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const passport = require('passport');
const favicon = require('serve-favicon');


// Serialize and deserialize are required functions for passport module to function
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var User = require("mongoose").model("User");

	User.findById(id, function(err, user) {
		done(err, user);
	});
});

module.exports = function(app, port, options) {
	app.setValue = app.set.bind(app);

	app.getValue = function(pathVal) {
		return app.get(pathVal);
	};
	// app.setValue('projectRoot', rootPath);

	var rootPath = path.join(__dirname, '../../');

	//Static directories
	if (options.staticPaths) {
		options.staticPaths.map(function(eachPath){
			var curPath = path.join(rootPath, eachPath);
			app.use(express.static(curPath));
		});
	} else {
		var publicPath = path.join(rootPath, './public');
		var browserPath = path.join(rootPath, './browser');

		app.use(express.static(publicPath));
		app.use(express.static(browserPath));
	}

	if (options.faviconPath) app.use(favicon(path.join(rootPath,options.faviconPath))); 

	//Middleware to parse requests
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		limit: '500mb',
		extended: true
	}));

	//Middleware to use cookies
	app.use(cookieParser(process.env.SESSION_SECRET));

	//Middleware to use session
	app.use(session({
		secret: process.env.SESSION_SECRET,
		store: new MongoStore({
			url: process.env.DATABASE_URI,
			autoReconnect: true
		}),
		resave: true,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	//Use base URL + PORT
	app.set('port', port);
}
