#!/usr/bin/env node

const Promise = require("bluebird");

const dotenv = require("dotenv");
const chalk = require("chalk");

const express = require("express");
const http = require("http");
const path = require("path");

require('rootpath')();

module.exports = function() {
    /*
    ENVIRONMENT VARIABLES
    */
    dotenv.config({
        path: ".env"
    });
    console.log(chalk.yellow("Environment variables loaded"));

    const port = process.env.PORT || 1814;


    return new Promise(function(resolve) {
        var resolvedInstance = {};
        /*
        FUNCTIONS
         */
        var connectDb = require("./db/_db");

        var createApp = function() {
            // return new Promise(function(resolve) {
            //Create application for use
            const app = express();
            const port = process.env.PORT || 1814;

            //Set DB models

            //Create application
            require("./app/_app")(app, port);

            //Create router, use the base URL and route from there
            const router = require("./app/routes/_routes");

            //Use base URL + PORT
            app.use('/', router);
            resolvedInstance.app = app;
            //     resolve(app);
            // });
        };

        var createStartServer = function(app) {
            //Start server
            const server = http.createServer(app);
            resolvedInstance.server = server;

            resolve(resolvedInstance);

            resolvedInstance.server.listen(port);
            resolvedInstance.server.on("error", function(err) {
                console.log(chalk.bgRed("SERVER ERROR: ", chalk.black(err.syscall)));
                if (err.code == "EADDRINUSE") {
                    console.log(chalk.red("Port " + port + " is already in use"));
                    process.exit(1);
                }
            });
            resolvedInstance.server.on("listening", function(err) {
                console.log(chalk.bgGreen("SERVER LISTENING ON: ", chalk.black(port)));
            });
        };

        connectDb.then(createApp).then(createStartServer);
    });
}
